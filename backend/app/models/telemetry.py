import uuid
from datetime import datetime, timezone
from typing import Optional, Dict, Any, List
from sqlmodel import SQLModel, Field
from pydantic import BaseModel


def get_utc_now() -> datetime:
    return datetime.now(timezone.utc)


class EventLog(SQLModel, table=True):
    __tablename__ = "event_logs"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    player_id: Optional[uuid.UUID] = Field(default=None, index=True)
    event_name: str = Field(index=True)
    payload_json: str = Field(default="{}")
    created_at: datetime = Field(default_factory=get_utc_now)


class UserFeedback(SQLModel, table=True):
    __tablename__ = "user_feedbacks"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    player_id: Optional[uuid.UUID] = Field(default=None, index=True)
    category: str = Field(default="bug")
    message: str = Field(max_length=1000)
    created_at: datetime = Field(default_factory=get_utc_now)


class TelemetryEventItem(BaseModel):
    event_name: str
    payload: Dict[str, Any] = {}
    timestamp: Optional[datetime] = None


class BatchEventsRequest(BaseModel):
    events: List[TelemetryEventItem]


class FeedbackRequest(BaseModel):
    category: str = "suggestion"
    message: str
