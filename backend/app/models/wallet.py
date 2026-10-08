import uuid
from datetime import datetime, timezone
from typing import Optional
from sqlmodel import SQLModel, Field
from pydantic import BaseModel, Field as PydField


def get_utc_now() -> datetime:
    return datetime.now(timezone.utc)


class Wallet(SQLModel, table=True):
    __tablename__ = "wallets"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    player_id: uuid.UUID = Field(unique=True, index=True, foreign_key="players.id")
    crystals_balance: int = Field(default=0, ge=0)
    updated_at: datetime = Field(default_factory=get_utc_now)


class Transaction(SQLModel, table=True):
    __tablename__ = "transactions"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    player_id: uuid.UUID = Field(index=True, foreign_key="players.id")
    amount: int = Field(description="Positivo para ganho, negativo para gasto")
    tx_type: str = Field(description="'earn', 'spend', 'iap', 'reward_ad'")
    description: str = Field(default="")
    reference_id: Optional[str] = Field(default=None, index=True, description="Chave de idempotência")
    created_at: datetime = Field(default_factory=get_utc_now)


class PurchaseReceipt(SQLModel, table=True):
    __tablename__ = "purchase_receipts"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    player_id: uuid.UUID = Field(index=True, foreign_key="players.id")
    package_id: str = Field(description="ex: 'pack_light_100', 'pack_astral_500'")
    crystals_granted: int = Field(ge=0)
    store: str = Field(description="'sandbox', 'google_play', 'stripe'")
    receipt_token: str = Field(unique=True, index=True)
    status: str = Field(default="completed")
    created_at: datetime = Field(default_factory=get_utc_now)


class WalletResponse(BaseModel):
    player_id: uuid.UUID
    crystals_balance: int
    updated_at: datetime


class SpendRequest(BaseModel):
    amount: int = PydField(gt=0, description="Quantidade de Cristais a debitar")
    item_id: str = PydField(description="Item adquirido, ex: 'powerup_luz_divina'")
    idempotency_key: Optional[str] = PydField(default=None, description="Chave para evitar cobrança duplicada")


class EarnRequest(BaseModel):
    amount: int = PydField(gt=0, le=100, description="Quantidade de Cristais de vitória (teto de segurança)")
    reason: str = PydField(default="victory", description="Motivo do ganho")
    idempotency_key: Optional[str] = None


class PurchaseVerificationRequest(BaseModel):
    package_id: str
    store: str = PydField(default="sandbox", description="'sandbox', 'google_play', 'stripe'")
    receipt_token: str
