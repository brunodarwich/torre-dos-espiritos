import uuid
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from app.database import get_session
from app.models.player import (
    Player,
    GuestAuthRequest,
    GoogleAuthRequest,
    AuthResponse,
)
from app.models.wallet import Wallet, Transaction
from app.services.auth_service import create_access_token, get_current_player

router = APIRouter(prefix="/auth", tags=["Autenticação"])

WELCOME_CRYSTALS = 50  # Cristais concedidos ao novo jogador


def ensure_player_wallet(player_id: uuid.UUID, session: Session) -> Wallet:
    """Garante que o jogador possui uma carteira ativa."""
    wallet = session.exec(select(Wallet).where(Wallet.player_id == player_id)).first()
    if not wallet:
        wallet = Wallet(player_id=player_id, crystals_balance=WELCOME_CRYSTALS)
        session.add(wallet)
        # Registra a transação inicial de boas-vindas
        tx = Transaction(
            player_id=player_id,
            amount=WELCOME_CRYSTALS,
            tx_type="earn",
            description="Bônus de boas-vindas ao mundo astral",
        )
        session.add(tx)
        session.commit()
        session.refresh(wallet)
    return wallet


@router.post("/guest", response_model=AuthResponse)
def authenticate_guest(
    payload: GuestAuthRequest,
    session: Session = Depends(get_session)
):
    """
    Autentica ou registra um jogador em modo convidado (anônimo).
    Se guest_id não for enviado, gera um novo UUID.
    """
    guest_id = payload.guest_id or f"guest_{uuid.uuid4().hex[:12]}"

    player = session.exec(select(Player).where(Player.guest_id == guest_id)).first()
    if not player:
        player = Player(
            guest_id=guest_id,
            display_name=payload.display_name or "Guia Astral",
        )
        session.add(player)
        session.commit()
        session.refresh(player)
        ensure_player_wallet(player.id, session)
    else:
        player.last_login = datetime.now(timezone.utc)
        session.add(player)
        session.commit()
        session.refresh(player)

    token = create_access_token(player.id, is_guest=True)
    return AuthResponse(
        access_token=token,
        player_id=player.id,
        display_name=player.display_name,
        is_guest=True,
    )


@router.post("/google", response_model=AuthResponse)
def authenticate_google(
    payload: GoogleAuthRequest,
    session: Session = Depends(get_session)
):
    """
    Autentica ou vincula conta Google ao jogador.
    Preserva carteira de Cristais e progresso existente.
    """
    # Em ambiente de dev / sandbox ou até configuração completa do Google Client ID
    # Extrai o google_id de forma segura ou simula a decodificação do ID token
    google_id = f"google_{hash(payload.id_token) & 0xFFFFFFFF:x}"
    
    # 1. Verifica se já existe um jogador com este Google ID
    existing_google_player = session.exec(select(Player).where(Player.google_id == google_id)).first()

    if existing_google_player:
        existing_google_player.last_login = datetime.now(timezone.utc)
        session.add(existing_google_player)
        session.commit()
        session.refresh(existing_google_player)
        token = create_access_token(existing_google_player.id, is_guest=False)
        return AuthResponse(
            access_token=token,
            player_id=existing_google_player.id,
            display_name=existing_google_player.display_name,
            is_guest=False,
        )

    # 2. Se o jogador já tem uma sessão de guest e deseja vincular a conta
    if payload.guest_id:
        guest_player = session.exec(select(Player).where(Player.guest_id == payload.guest_id)).first()
        if guest_player:
            guest_player.google_id = google_id
            guest_player.last_login = datetime.now(timezone.utc)
            session.add(guest_player)
            session.commit()
            session.refresh(guest_player)
            token = create_access_token(guest_player.id, is_guest=False)
            return AuthResponse(
                access_token=token,
                player_id=guest_player.id,
                display_name=guest_player.display_name,
                is_guest=False,
            )

    # 3. Cria novo jogador autenticado pelo Google
    new_player = Player(
        guest_id=f"guest_{uuid.uuid4().hex[:12]}",
        google_id=google_id,
        display_name="Guia Astral Guardião",
    )
    session.add(new_player)
    session.commit()
    session.refresh(new_player)
    ensure_player_wallet(new_player.id, session)

    token = create_access_token(new_player.id, is_guest=False)
    return AuthResponse(
        access_token=token,
        player_id=new_player.id,
        display_name=new_player.display_name,
        is_guest=False,
    )


@router.get("/me")
def get_current_user_profile(player: Player = Depends(get_current_player)):
    """Retorna os dados do perfil do jogador logado."""
    return {
        "id": player.id,
        "display_name": player.display_name,
        "avatar_url": player.avatar_url,
        "is_guest": player.google_id is None,
        "created_at": player.created_at,
    }
