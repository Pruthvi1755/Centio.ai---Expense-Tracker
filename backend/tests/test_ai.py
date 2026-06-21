import pytest
from datetime import datetime, timedelta
from fastapi.testclient import TestClient

@pytest.fixture
def auth_headers(client: TestClient) -> dict:
    register_payload = {"email": "aiuser@example.com", "password": "password123"}
    client.post("/api/v1/auth/register", json=register_payload)
    
    response = client.post("/api/v1/auth/login", json=register_payload)
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}

def test_ai_forecast_and_insights_generation(client: TestClient, auth_headers: dict):
    # 1. Test forecast and insights with empty history first
    resp_forecast_empty = client.get("/api/v1/ai/forecast", headers=auth_headers)
    assert resp_forecast_empty.status_code == 200
    assert resp_forecast_empty.json()["next_month_forecast"] == 0.0
    
    resp_insights_empty = client.get("/api/v1/ai/insights", headers=auth_headers)
    assert resp_insights_empty.status_code == 200
    assert "No expense data recorded" in resp_insights_empty.json()["spending_pattern"]

    # 2. Add multiple chronological expense transactions to train our simple model
    base_date = datetime.now() - timedelta(days=10)
    for i in range(5):
        tx_date = (base_date + timedelta(days=i)).isoformat()
        tx_payload = {
            "type": "expense",
            "category": "Dining Out",
            "amount": 50.0 + (i * 10), # increasing trend: 50, 60, 70, 80, 90
            "date": tx_date,
            "notes": f"Sequential expense day {i}",
            "tags": ["food", "daily"]
        }
        client.post("/api/v1/transactions/", json=tx_payload, headers=auth_headers)

    # 3. Request forecast and check projections
    resp_forecast = client.get("/api/v1/ai/forecast", headers=auth_headers)
    assert resp_forecast.status_code == 200
    forecast_data = resp_forecast.json()
    assert forecast_data["next_month_forecast"] > 0.0
    assert len(forecast_data["points"]) == 30
    assert "Medium" in forecast_data["confidence"] or "High" in forecast_data["confidence"]

    # 4. Request insights and check rule-based outcomes
    resp_insights = client.get("/api/v1/ai/insights", headers=auth_headers)
    assert resp_insights.status_code == 200
    insights_data = resp_insights.json()
    assert len(insights_data["insights"]) > 0
    assert "Dining Out" in insights_data["spending_pattern"]
    assert len(insights_data["savings_suggestions"]) > 0
