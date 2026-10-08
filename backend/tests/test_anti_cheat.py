import pytest
from app.models.score import ScoreSubmission
from app.services.anti_cheat import validate_match_heuristics, AntiCheatException


def test_valid_match_submission():
    # Partida válida: onda 5, 40 espíritos purificados, 120 segundos, pontuação proporcional
    submission = ScoreSubmission(
        score_points=8500,
        wave_reached=5,
        spirits_purified=40,
        duration_seconds=120,
    )
    is_valid, msg = validate_match_heuristics(submission)
    assert is_valid is True
    assert "sucesso" in msg


def test_reject_impossible_short_duration():
    # Tentativa de hack de velocidade: onda 10 completada em apenas 5 segundos
    submission = ScoreSubmission(
        score_points=5000,
        wave_reached=10,
        spirits_purified=50,
        duration_seconds=5,
    )
    with pytest.raises(AntiCheatException) as exc_info:
        validate_match_heuristics(submission)
    assert "Duração de partida implausível" in str(exc_info.value)


def test_reject_impossible_spirit_count():
    # Tentativa de injetar 1000 espíritos derrotados na onda 1
    submission = ScoreSubmission(
        score_points=2000,
        wave_reached=1,
        spirits_purified=1000,
        duration_seconds=60,
    )
    with pytest.raises(AntiCheatException) as exc_info:
        validate_match_heuristics(submission)
    assert "Quantidade excessiva de espíritos purificados" in str(exc_info.value)


def test_reject_astronomical_score():
    # Tentativa de enviar 9.999.999 pontos derrotando apenas 2 espíritos
    submission = ScoreSubmission(
        score_points=9_999_999,
        wave_reached=2,
        spirits_purified=2,
        duration_seconds=60,
    )
    with pytest.raises(AntiCheatException) as exc_info:
        validate_match_heuristics(submission)
    assert "excede o teto teórico" in str(exc_info.value)
