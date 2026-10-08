def test_root_endpoint(client):
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "Torre dos Espíritos API online" in data["message"]
    assert data["docs"] == "/docs"


def test_health_check(client):
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["service"] == "Torre dos Espíritos API"
    assert data["database"] == "ok"
