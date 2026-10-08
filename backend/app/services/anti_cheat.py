from typing import Tuple
from app.models.score import ScoreSubmission

# Parâmetros de calibração baseados no GDD (PRD.md)
MIN_SECONDS_PER_WAVE = 8        # Menos que isso é impossível devido à velocidade de caminhada dos espíritos
MAX_SPIRITS_PER_WAVE = 30       # Máximo de inimigos gerados por onda
MAX_POINTS_PER_SPIRIT = 350     # Valor base + bônus de purificação perfeita
WAVE_COMPLETION_BONUS = 600     # Bônus máximo por onda completada


class AntiCheatException(ValueError):
    """Exceção levantada quando uma partida submetida viola os limites físicos do jogo."""
    pass


def validate_match_heuristics(submission: ScoreSubmission) -> Tuple[bool, str]:
    """
    Valida se os dados da partida submetida respeitam as restrições físicas do jogo.
    Retorna (True, "") se válida ou levanta AntiCheatException com o motivo da inconsistência.
    """
    # 1. Checagem de duração temporal plausível
    min_required_duration = submission.wave_reached * MIN_SECONDS_PER_WAVE
    if submission.duration_seconds < min_required_duration:
        raise AntiCheatException(
            f"Duração de partida implausível ({submission.duration_seconds}s para onda {submission.wave_reached}). "
            f"Tempo mínimo esperado: {min_required_duration}s."
        )

    # 2. Checagem de contagem máxima de espíritos purificados
    max_possible_spirits = submission.wave_reached * MAX_SPIRITS_PER_WAVE
    if submission.spirits_purified > max_possible_spirits:
        raise AntiCheatException(
            f"Quantidade excessiva de espíritos purificados ({submission.spirits_purified}). "
            f"Teto teórico para onda {submission.wave_reached}: {max_possible_spirits}."
        )

    # 3. Checagem do teto de pontuação matemática plausível
    theoretical_max_score = (
        (submission.spirits_purified * MAX_POINTS_PER_SPIRIT) +
        (submission.wave_reached * WAVE_COMPLETION_BONUS)
    )
    # Tolerância de 15% para multiplicadores de combos astrais excepcionais
    tolerance_max_score = int(theoretical_max_score * 1.15)

    if submission.score_points > tolerance_max_score:
        raise AntiCheatException(
            f"Pontuação informada ({submission.score_points}) excede o teto teórico ({tolerance_max_score}) "
            f"para {submission.spirits_purified} espíritos purificados na onda {submission.wave_reached}."
        )

    return True, "Pontuação validada com sucesso."
