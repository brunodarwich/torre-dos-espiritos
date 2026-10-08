from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from app.database import get_session
from app.models.player import Player
from app.models.wallet import (
    Wallet,
    Transaction,
    PurchaseReceipt,
    PurchaseVerificationRequest,
    WalletResponse,
)
from app.services.auth_service import get_current_player
from app.services.billing_service import (
    verify_store_purchase,
    BillingException,
    CRYSTAL_PACKAGES,
)
from app.routers.wallet import get_or_create_wallet

router = APIRouter(prefix="/purchases", tags=["Compras & IAP"])


@router.get("/packages")
def list_available_packages():
    """Retorna os pacotes de Cristais disponíveis para compra na loja."""
    packages_list = []
    for pkg_id, data in CRYSTAL_PACKAGES.items():
        packages_list.append({
            "package_id": pkg_id,
            "crystals": data["crystals"],
            "price_brl": f"R$ {data['price_brl_cents'] / 100:.2f}".replace(".", ","),
            "price_cents": data["price_brl_cents"],
        })
    return {"packages": packages_list}


@router.post("/verify", response_model=WalletResponse)
def verify_and_credit_purchase(
    payload: PurchaseVerificationRequest,
    player: Player = Depends(get_current_player),
    session: Session = Depends(get_session)
):
    """
    Valida recibo de compra (Google Play, Stripe ou Sandbox) e credita Cristais.
    Impede reutilização fraudulenta de recibos (replay attack).
    """
    # 1. Anti-duplicação de recibo
    existing_receipt = session.exec(
        select(PurchaseReceipt).where(PurchaseReceipt.receipt_token == payload.receipt_token)
    ).first()
    if existing_receipt:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Este recibo de compra já foi resgatado anteriormente.",
        )

    # 2. Validação da loja
    try:
        _, crystals_granted, _ = verify_store_purchase(
            package_id=payload.package_id,
            store=payload.store,
            receipt_token=payload.receipt_token,
        )
    except BillingException as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Falha na validação da compra: {str(e)}",
        )

    # 3. Registro do recibo
    receipt = PurchaseReceipt(
        player_id=player.id,
        package_id=payload.package_id,
        crystals_granted=crystals_granted,
        store=payload.store,
        receipt_token=payload.receipt_token,
        status="completed",
    )
    session.add(receipt)

    # 4. Atualização da carteira
    wallet = get_or_create_wallet(player.id, session)
    wallet.crystals_balance += crystals_granted
    wallet.updated_at = datetime.now(timezone.utc)
    session.add(wallet)

    # 5. Registro da transação
    tx = Transaction(
        player_id=player.id,
        amount=crystals_granted,
        tx_type="iap",
        description=f"Compra confirmada de {payload.package_id} ({payload.store})",
        reference_id=payload.receipt_token,
    )
    session.add(tx)
    session.commit()
    session.refresh(wallet)

    return WalletResponse(
        player_id=wallet.player_id,
        crystals_balance=wallet.crystals_balance,
        updated_at=wallet.updated_at,
    )
