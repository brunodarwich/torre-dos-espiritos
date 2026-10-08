def test_list_packages(client):
    response = client.get("/purchases/packages")
    assert response.status_code == 200
    packages = response.json()["packages"]
    assert len(packages) >= 4
    pkg_ids = [p["package_id"] for p in packages]
    assert "pack_cristais_100" in pkg_ids
    assert "pack_cristais_750" in pkg_ids


def test_verify_sandbox_purchase_credits_wallet(client, auth_headers):
    headers = {"Authorization": auth_headers["Authorization"]}

    # Saldo inicial é 50
    bal_initial = client.get("/wallet", headers=headers).json()["crystals_balance"]
    assert bal_initial == 50

    # Compra o pacote de 300 cristais em modo sandbox
    purchase_payload = {
        "package_id": "pack_cristais_300",
        "store": "sandbox",
        "receipt_token": "sandbox_receipt_token_xyz_987",
    }
    response = client.post("/purchases/verify", json=purchase_payload, headers=headers)
    assert response.status_code == 200
    data = response.json()
    # 50 + 300 = 350
    assert data["crystals_balance"] == 350


def test_reject_duplicate_receipt_token(client, auth_headers):
    headers = {"Authorization": auth_headers["Authorization"]}

    payload = {
        "package_id": "pack_cristais_100",
        "store": "sandbox",
        "receipt_token": "sandbox_token_duplicado_001",
    }
    # Primeiro resgate: sucesso
    r1 = client.post("/purchases/verify", json=payload, headers=headers)
    assert r1.status_code == 200

    # Segundo resgate com o mesmo recibo: rejeitado por conflito (409)
    r2 = client.post("/purchases/verify", json=payload, headers=headers)
    assert r2.status_code == 409
    assert "já foi resgatado" in r2.json()["detail"]


def test_reject_unknown_package(client, auth_headers):
    headers = {"Authorization": auth_headers["Authorization"]}

    payload = {
        "package_id": "pacote_inexistente_9999",
        "store": "sandbox",
        "receipt_token": "sandbox_token_inv_123",
    }
    response = client.post("/purchases/verify", json=payload, headers=headers)
    assert response.status_code == 400
    assert "Pacote de cristais desconhecido" in response.json()["detail"]
