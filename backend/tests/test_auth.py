def test_guest_auth_new_player(client):
    response = client.post("/auth/guest", json={"display_name": "Iniciante Astral"})
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["is_guest"] is True
    assert data["display_name"] == "Iniciante Astral"


def test_guest_auth_existing_player(client):
    # Primeiro login
    resp1 = client.post("/auth/guest", json={"guest_id": "device_uuid_12345", "display_name": "Jogador Fiel"})
    assert resp1.status_code == 200
    player_id1 = resp1.json()["player_id"]

    # Segundo login com o mesmo guest_id deve recuperar o mesmo jogador
    resp2 = client.post("/auth/guest", json={"guest_id": "device_uuid_12345"})
    assert resp2.status_code == 200
    assert resp2.json()["player_id"] == player_id1


def test_get_current_profile(client, auth_headers):
    headers = {"Authorization": auth_headers["Authorization"]}
    response = client.get("/auth/me", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["display_name"] == "Testador Astral"
    assert data["is_guest"] is True


def test_unauthorized_profile_access(client):
    response = client.get("/auth/me")
    assert response.status_code == 401
