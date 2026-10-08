import json
from fastapi import APIRouter, Depends, status
from sqlmodel import Session

from app.database import get_session
from app.models.player import Player
from app.models.telemetry import (
    EventLog,
    UserFeedback,
    BatchEventsRequest,
    FeedbackRequest,
)
from app.services.auth_service import get_optional_player

router = APIRouter(tags=["Telemetria & Suporte"])


@router.post("/events", status_code=status.HTTP_202_ACCEPTED)
def ingest_telemetry_batch(
    payload: BatchEventsRequest,
    player: Player = Depends(get_optional_player),
    session: Session = Depends(get_session)
):
    """
    Ingestão em lote de eventos de telemetria do jogo (início de onda, derrota, etc.).
    Processa de forma assíncrona/não bloqueante.
    """
    player_id = player.id if player else None

    for item in payload.events:
        event_record = EventLog(
            player_id=player_id,
            event_name=item.event_name,
            payload_json=json.dumps(item.payload, default=str),
        )
        session.add(event_record)

    session.commit()
    return {"status": "accepted", "ingested_count": len(payload.events)}


@router.post("/feedback", status_code=status.HTTP_201_CREATED)
def submit_user_feedback(
    payload: FeedbackRequest,
    player: Player = Depends(get_optional_player),
    session: Session = Depends(get_session)
):
    """Permite ao jogador enviar relatórios de bugs ou sugestões diretamente do jogo."""
    feedback = UserFeedback(
        player_id=player.id if player else None,
        category=payload.category,
        message=payload.message,
    )
    session.add(feedback)
    session.commit()
    session.refresh(feedback)

    return {
        "status": "received",
        "feedback_id": feedback.id,
        "message": "Agradecemos por sua contribuição com o plano astral!",
    }
