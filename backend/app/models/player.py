import uuid
from datetime import datetime, timezone
from typing import Optional
from sqlmodel import SQLModel, Field
from pydantic import BaseModel


def get_utc_now() -> datetime:
    return datetime.now(timezone.utc)


class Player(SQLModel, table=True):
    __tablename__ = "players"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    guest_id: str = Field(index=True, unique=True, description="UUID do aparelho do convidado")
    google_id: Optional[str] = Field(default=None, index=True, unique=True, description="ID único do Google OAuth")
    display_name: str = Field(default="Guia Astral", max_length=50)
    avatar_url: Optional[str] = Field(default=None)
    created_at: datetime = Field(default_factory=get_utc_now)
    last_login: datetime = Field(default_factory=get_utc_now)


class GuestAuthRequest(BaseModel):
    guest_id: Optional[str] = None
    display_name: Optional[str] = "Guia Astral"


class GoogleAuthRequest(BaseModel):
    guest_id: Optional[str] = None
    id_token: str


class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    player_id: uuid.UUID
    display_name: str
    is_guest: bool
