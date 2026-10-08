def test_initial_wallet_balance(client, auth_headers):
    headers = {"Authorization": auth_headers["Authorization"]}
    response = client.get("/wallet", headers=headers)
    assert response.status_code == 200
    data = response.json()
    # O jogador novo recebe 50 cristais de bônus de boas-vindas
    assert data["crystals_balance"] == 50


def test_spend_crystals_success(client, auth_headers):
    headers = {"Authorization": auth_headers["Authorization"]}
    spend_payload = {
        "amount": 25,
        "item_id": "powerup_bencao_luz",
        "idempotency_key": "tx_spend_001",
    }
    response = client.post("/wallet/spend", json=spend_payload, headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["crystals_balance"] == 25  # 50 - 25 = 25


def test_spend_idempotency(client, auth_headers):
    headers = {"Authorization": auth_headers["Authorization"]}
    spend_payload = {
        "amount": 20,
        "item_id": "powerup_ervas_cura",
        "idempotency_key": "tx_idempotent_key_abc",
    }
    # Primeira chamada
    r1 = client.post("/wallet/spend", json=spend_payload, headers=headers)
    assert r1.status_code == 200
    bal1 = r1.json()["crystals_balance"]

    # Segunda chamada com exatamente a mesma idempotency_key não pode subtrair de novo
    r2 = client.post("/wallet/spend", json=spend_payload, headers=headers)
    assert r2.status_code == 200
    bal2 = r2.json()["crystals_balance"]
    assert bal1 == bal2


def test_spend_insufficient_balance(client, auth_headers):
    headers = {"Authorization": auth_headers["Authorization"]}
    # Tenta gastar 9999 Cristais
    spend_payload = {
        "amount": 9999,
        "item_id": "skin_dourada_mentor",
    }
    response = client.post("/wallet/spend", json=spend_payload, headers=headers)
    assert response.status_code == 400
    assert "Saldo insuficiente" in response.json()["detail"]


def test_earn_crystals(client, auth_headers):
    headers = {"Authorization": auth_headers["Authorization"]}
    earn_payload = {
        "amount": 40,
        "reason": "vitoria_onda_10",
        "idempotency_key": "earn_victory_onda_10",
    }
    response = client.post("/wallet/earn", json=earn_payload, headers=headers)
    assert response.status_code == 200
    # O saldo anterior (50) + 40 = 90
    assert response.json()["crystals_balance"] == 90
