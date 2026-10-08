import uuid
from datetime import datetime, timezone, timedelta
from typing import Optional
import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlmodel import Session, select

from app.config import settings
from app.database import get_session
from app.models.player import Player

security = HTTPBearer(auto_error=False)


def create_access_token(player_id: uuid.UUID, is_guest: bool) -> str:
    """Gera um JWT de sessão para o jogador."""
    expire = datetime.now(timezone.utc) + timedelta(days=settings.JWT_EXPIRE_DAYS)
    payload = {
        "sub": str(player_id),
        "is_guest": is_guest,
        "exp": expire,
        "iat": datetime.now(timezone.utc),
    }
    return jwt.encode(payload, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)


def decode_token(token: str) -> dict:
    """Decodifica e valida o token JWT."""
    try:
        return jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token expirado. Por favor, autentique-se novamente.",
        )
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token de autenticação inválido.",
        )


def get_current_player(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
    session: Session = Depends(get_session),
) -> Player:
    """Injeta o jogador atual autenticado via Bearer token."""
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Autenticação requerida (Bearer token ausente).",
        )

    payload = decode_token(credentials.credentials)
    player_id_str = payload.get("sub")
    if not player_id_str:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token sem identificador de jogador.")

    try:
        player_id = uuid.UUID(player_id_str)
    except ValueError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="ID de jogador inválido no token.")

    player = session.get(Player, player_id)
    if not player:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Jogador não encontrado no banco de dados.")

    return player


def get_optional_player(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
    session: Session = Depends(get_session),
) -> Optional[Player]:
    """Injeta o jogador se autenticado, ou None caso contrário."""
    if not credentials:
        return None
    try:
        payload = decode_token(credentials.credentials)
        player_id_str = payload.get("sub")
        if not player_id_str:
            return None
        return session.get(Player, uuid.UUID(player_id_str))
    except Exception:
        return None
