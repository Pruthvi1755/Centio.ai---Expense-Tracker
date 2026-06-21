import pytest
from fastapi.testclient import TestClient

@pytest.fixture
def auth_headers(client: TestClient) -> dict:
    register_payload = {"email": "budgetuser@example.com", "password": "password123"}
    client.post("/api/v1/auth/register", json=register_payload)
    
    response = client.post("/api/v1/auth/login", json=register_payload)
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}

def test_budget_management_and_alerts(client: TestClient, auth_headers: dict):
    # 1. Create a Category Budget Limit (Food category, limit 300)
    budget_payload = {"category": "Food", "amount": 300.0, "period": "monthly"}
    resp = client.post("/api/v1/budgets/", json=budget_payload, headers=auth_headers)
    assert resp.status_code == 201
    b1 = resp.json()
    assert b1["category"] == "Food"
    assert b1["amount"] == 300.0
    assert b1["current_spent"] == 0.0

    # 2. Add an expense within the Food category to test spent aggregation
    expense_payload = {
        "type": "expense",
        "category": "Food",
        "amount": 120.0,
        "notes": "Weekly groceries",
        "tags": ["groceries"]
    }
    client.post("/api/v1/transactions/", json=expense_payload, headers=auth_headers)

    # 3. Retrieve Budgets list and verify current_spent updates dynamically
    get_resp = client.get("/api/v1/budgets/", headers=auth_headers)
    assert get_resp.status_code == 200
    b_list = get_resp.json()
    assert len(b_list) == 1
    assert b_list[0]["category"] == "Food"
    assert b_list[0]["current_spent"] == 120.0

    # 4. Update the budget limit (Increase limit to 500)
    put_resp = client.put(f"/api/v1/budgets/{b1['id']}", json={"amount": 500.0}, headers=auth_headers)
    assert put_resp.status_code == 200
    updated_b = put_resp.json()
    assert updated_b["amount"] == 500.0

    # 5. Delete the budget
    del_resp = client.delete(f"/api/v1/budgets/{b1['id']}", headers=auth_headers)
    assert del_resp.status_code == 204
