from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from app.database import get_session
from app.models.player import Player
from app.models.wallet import (
    Wallet,
    Transaction,
    WalletResponse,
    SpendRequest,
    EarnRequest,
)
from app.services.auth_service import get_current_player

router = APIRouter(prefix="/wallet", tags=["Carteira & Cristais"])


def get_or_create_wallet(player_id, session: Session) -> Wallet:
    wallet = session.exec(select(Wallet).where(Wallet.player_id == player_id)).first()
    if not wallet:
        wallet = Wallet(player_id=player_id, crystals_balance=0)
        session.add(wallet)
        session.commit()
        session.refresh(wallet)
    return wallet


@router.get("", response_model=WalletResponse)
def get_wallet_balance(
    player: Player = Depends(get_current_player),
    session: Session = Depends(get_session)
):
    """Consulta o saldo atual de Cristais de Luz do jogador."""
    wallet = get_or_create_wallet(player.id, session)
    return WalletResponse(
        player_id=wallet.player_id,
        crystals_balance=wallet.crystals_balance,
        updated_at=wallet.updated_at,
    )


@router.post("/spend", response_model=WalletResponse)
def spend_crystals(
    payload: SpendRequest,
    player: Player = Depends(get_current_player),
    session: Session = Depends(get_session)
):
    """
    Debita Cristais para aquisição de power-up ou melhoria astral.
    Operação idempotente quando idempotency_key é fornecida.
    """
    wallet = get_or_create_wallet(player.id, session)

    # 1. Checagem de idempotência
    if payload.idempotency_key:
        existing_tx = session.exec(
            select(Transaction)
            .where(Transaction.player_id == player.id)
            .where(Transaction.reference_id == payload.idempotency_key)
        ).first()
        if existing_tx:
            # Já processado anteriormente; retorna saldo atual sem novo débito
            return WalletResponse(
                player_id=wallet.player_id,
                crystals_balance=wallet.crystals_balance,
                updated_at=wallet.updated_at,
            )

    # 2. Validação de saldo suficiente
    if wallet.crystals_balance < payload.amount:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Saldo insuficiente. Necessário: {payload.amount}, Disponível: {wallet.crystals_balance}.",
        )

    # 3. Execução do débito
    wallet.crystals_balance -= payload.amount
    wallet.updated_at = datetime.now(timezone.utc)
    session.add(wallet)

    tx = Transaction(
        player_id=player.id,
        amount=-payload.amount,
        tx_type="spend",
        description=f"Compra do item astral: {payload.item_id}",
        reference_id=payload.idempotency_key,
    )
    session.add(tx)
    session.commit()
    session.refresh(wallet)

    return WalletResponse(
        player_id=wallet.player_id,
        crystals_balance=wallet.crystals_balance,
        updated_at=wallet.updated_at,
    )


@router.post("/earn", response_model=WalletResponse)
def earn_crystals(
    payload: EarnRequest,
    player: Player = Depends(get_current_player),
    session: Session = Depends(get_session)
):
    """
    Credita Cristais de recompensa por vitória ou desempenho de onda.
    Protegido por limite máximo de 100 Cristais por transação.
    """
    wallet = get_or_create_wallet(player.id, session)

    # 1. Checagem de idempotência
    if payload.idempotency_key:
        existing_tx = session.exec(
            select(Transaction)
            .where(Transaction.player_id == player.id)
            .where(Transaction.reference_id == payload.idempotency_key)
        ).first()
        if existing_tx:
            return WalletResponse(
                player_id=wallet.player_id,
                crystals_balance=wallet.crystals_balance,
                updated_at=wallet.updated_at,
            )

    # 2. Execução do crédito
    wallet.crystals_balance += payload.amount
    wallet.updated_at = datetime.now(timezone.utc)
    session.add(wallet)

    tx = Transaction(
        player_id=player.id,
        amount=payload.amount,
        tx_type="earn",
        description=f"Recompensa astral: {payload.reason}",
        reference_id=payload.idempotency_key,
    )
    session.add(tx)
    session.commit()
    session.refresh(wallet)

    return WalletResponse(
        player_id=wallet.player_id,
        crystals_balance=wallet.crystals_balance,
        updated_at=wallet.updated_at,
    )
