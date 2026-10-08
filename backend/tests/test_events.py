def test_telemetry_batch_ingest(client, auth_headers):
    headers = {"Authorization": auth_headers["Authorization"]}
    payload = {
        "events": [
            {"event_name": "match_start", "payload": {"map": "astral_nivel_1"}},
            {"event_name": "wave_cleared", "payload": {"wave": 1, "duration": 18}},
            {"event_name": "guide_placed", "payload": {"guide": "mentor", "grid_x": 4, "grid_y": 2}},
        ]
    }
    response = client.post("/events", json=payload, headers=headers)
    assert response.status_code == 202
    data = response.json()
    assert data["status"] == "accepted"
    assert data["ingested_count"] == 3


def test_user_feedback_submission(client, auth_headers):
    headers = {"Authorization": auth_headers["Authorization"]}
    payload = {
        "category": "suggestion",
        "message": "Adorei a trilha sonora e os cantos de cura da Benzedeira!",
    }
    response = client.post("/feedback", json=payload, headers=headers)
    assert response.status_code == 201
    data = response.json()
    assert data["status"] == "received"
    assert "feedback_id" in data
