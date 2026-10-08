def test_submit_valid_score(client, auth_headers):
    headers = {"Authorization": auth_headers["Authorization"]}
    payload = {
        "score_points": 4500,
        "wave_reached": 4,
        "spirits_purified": 25,
        "duration_seconds": 90,
    }
    response = client.post("/scores", json=payload, headers=headers)
    assert response.status_code == 201
    data = response.json()
    assert data["rank"] == 1
    assert data["score_points"] == 4500
    assert data["spirits_purified"] == 25


def test_submit_fraudulent_score_rejected(client, auth_headers):
    headers = {"Authorization": auth_headers["Authorization"]}
    # Tentativa de enviar 500.000 pontos na onda 1 em 5 segundos
    payload = {
        "score_points": 500_000,
        "wave_reached": 1,
        "spirits_purified": 1,
        "duration_seconds": 5,
    }
    response = client.post("/scores", json=payload, headers=headers)
    assert response.status_code == 422
    assert "Detecção Anti-Fraude" in response.json()["detail"]


def test_weekly_leaderboard_ordering(client):
    # Cria dois jogadores distintos com pontuações diferentes
    res1 = client.post("/auth/guest", json={"display_name": "Campeão da Luz"})
    res2 = client.post("/auth/guest", json={"display_name": "Aprendiz Astral"})

    token1 = res1.json()["access_token"]
    token2 = res2.json()["access_token"]

    # Jogador 1 faz 8000 pontos
    client.post(
        "/scores",
        json={"score_points": 8000, "wave_reached": 6, "spirits_purified": 30, "duration_seconds": 150},
        headers={"Authorization": f"Bearer {token1}"},
    )

    # Jogador 2 faz 12000 pontos (onda 8)
    client.post(
        "/scores",
        json={"score_points": 12000, "wave_reached": 8, "spirits_purified": 45, "duration_seconds": 200},
        headers={"Authorization": f"Bearer {token2}"},
    )

    # Consulta o ranking
    leaderboard_resp = client.get("/scores/weekly")
    assert leaderboard_resp.status_code == 200
    data = leaderboard_resp.json()
    assert data["total_entries"] >= 2
    top = data["top_scores"]

    # O primeiro deve ser o Jogador 2 com 12000 pontos
    assert top[0]["player_name"] == "Aprendiz Astral"
    assert top[0]["score_points"] == 12000
    assert top[0]["rank"] == 1

    # O segundo deve ser o Jogador 1 com 8000 pontos
    assert top[1]["player_name"] == "Campeão da Luz"
    assert top[1]["score_points"] == 8000
    assert top[1]["rank"] == 2
