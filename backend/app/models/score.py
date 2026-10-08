import uuid
from datetime import datetime, timezone
from typing import Optional
from sqlmodel import SQLModel, Field
from pydantic import BaseModel, Field as PydField


def get_utc_now() -> datetime:
    return datetime.now(timezone.utc)


def current_week_identifier() -> str:
    now = datetime.now(timezone.utc)
    # Formato ISO Ano-Semana, ex: '2026-W41'
    year, week, _ = now.isocalendar()
    return f"{year}-W{week:02d}"


class Score(SQLModel, table=True):
    __tablename__ = "scores"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    player_id: uuid.UUID = Field(index=True, foreign_key="players.id")
    player_name: str = Field(default="Guia Astral", max_length=50)
    score_points: int = Field(index=True)
    wave_reached: int = Field(default=1)
    spirits_purified: int = Field(default=0)
    duration_seconds: int = Field(default=0)
    week_identifier: str = Field(default_factory=current_week_identifier, index=True)
    created_at: datetime = Field(default_factory=get_utc_now)


class ScoreSubmission(BaseModel):
    score_points: int = PydField(ge=0, description="Pontuação total")
    wave_reached: int = PydField(ge=1, le=100, description="Onda máxima alcançada")
    spirits_purified: int = PydField(ge=0, description="Quantidade de espíritos purificados")
    duration_seconds: int = PydField(ge=1, description="Duração total da partida em segundos")


class ScoreItemResponse(BaseModel):
    rank: int
    player_name: str
    score_points: int
    wave_reached: int
    spirits_purified: int
    created_at: datetime


class WeeklyLeaderboardResponse(BaseModel):
    week_identifier: str
    total_entries: int
    top_scores: list[ScoreItemResponse]
