from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select, desc

from app.database import get_session
from app.models.player import Player
from app.models.score import (
    Score,
    ScoreSubmission,
    ScoreItemResponse,
    WeeklyLeaderboardResponse,
    current_week_identifier,
)
from app.services.auth_service import get_current_player
from app.services.anti_cheat import validate_match_heuristics, AntiCheatException

router = APIRouter(prefix="/scores", tags=["Ranking & Pontuações"])


@router.post("", response_model=ScoreItemResponse, status_code=status.HTTP_201_CREATED)
def submit_score(
    submission: ScoreSubmission,
    player: Player = Depends(get_current_player),
    session: Session = Depends(get_session)
):
    """
    Submete a pontuação de uma partida com validação heurística anti-fraude.
    Rejeita valores implausíveis matematicamente.
    """
    try:
        validate_match_heuristics(submission)
    except AntiCheatException as e:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
            detail=f"Detecção Anti-Fraude: {str(e)}",
        )

    week_id = current_week_identifier()

    score = Score(
        player_id=player.id,
        player_name=player.display_name,
        score_points=submission.score_points,
        wave_reached=submission.wave_reached,
        spirits_purified=submission.spirits_purified,
        duration_seconds=submission.duration_seconds,
        week_identifier=week_id,
    )
    session.add(score)
    session.commit()
    session.refresh(score)

    # Calcula o rank da semana para este score
    higher_scores_count = session.exec(
        select(Score)
        .where(Score.week_identifier == week_id)
        .where(Score.score_points > score.score_points)
    ).all()
    rank = len(higher_scores_count) + 1

    return ScoreItemResponse(
        rank=rank,
        player_name=score.player_name,
        score_points=score.score_points,
        wave_reached=score.wave_reached,
        spirits_purified=score.spirits_purified,
        created_at=score.created_at,
    )


@router.get("/weekly", response_model=WeeklyLeaderboardResponse)
def get_weekly_leaderboard(
    limit: int = 100,
    session: Session = Depends(get_session)
):
    """Retorna o Top 100 das melhores pontuações da semana corrente."""
    week_id = current_week_identifier()
    clamped_limit = min(max(limit, 1), 100)

    # Busca as melhores pontuações ordenadas decrescente
    statement = (
        select(Score)
        .where(Score.week_identifier == week_id)
        .order_by(desc(Score.score_points), desc(Score.spirits_purified))
        .limit(clamped_limit)
    )
    top_records = session.exec(statement).all()

    items: List[ScoreItemResponse] = []
    for index, record in enumerate(top_records, start=1):
        items.append(
            ScoreItemResponse(
                rank=index,
                player_name=record.player_name,
                score_points=record.score_points,
                wave_reached=record.wave_reached,
                spirits_purified=record.spirits_purified,
                created_at=record.created_at,
            )
        )

    return WeeklyLeaderboardResponse(
        week_identifier=week_id,
        total_entries=len(items),
        top_scores=items,
    )


@router.get("/my-best", response_model=ScoreItemResponse)
def get_my_best_score(
    player: Player = Depends(get_current_player),
    session: Session = Depends(get_session)
):
    """Retorna a melhor pontuação do jogador na semana atual."""
    week_id = current_week_identifier()
    statement = (
        select(Score)
        .where(Score.player_id == player.id)
        .where(Score.week_identifier == week_id)
        .order_by(desc(Score.score_points))
    )
    best = session.exec(statement).first()

    if not best:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Nenhuma pontuação registrada nesta semana.",
        )

    # Calcula rank
    higher_count = len(
        session.exec(
            select(Score)
            .where(Score.week_identifier == week_id)
            .where(Score.score_points > best.score_points)
        ).all()
    )

    return ScoreItemResponse(
        rank=higher_count + 1,
        player_name=best.player_name,
        score_points=best.score_points,
        wave_reached=best.wave_reached,
        spirits_purified=best.spirits_purified,
        created_at=best.created_at,
    )
