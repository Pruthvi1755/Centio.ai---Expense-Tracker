import pytest
from fastapi.testclient import TestClient

@pytest.fixture
def auth_headers(client: TestClient) -> dict:
    """
    Utility fixture to register and log in a test user, returning authorization headers.
    """
    register_payload = {"email": "txuser@example.com", "password": "password123"}
    client.post("/api/v1/auth/register", json=register_payload)
    
    response = client.post("/api/v1/auth/login", json=register_payload)
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}

def test_transaction_crud_operations(client: TestClient, auth_headers: dict):
    # 1. Add Transaction (Income)
    income_payload = {
        "type": "income",
        "category": "Salary",
        "amount": 5000.0,
        "notes": "Regular monthly salary",
        "tags": ["work", "salary"]
    }
    resp = client.post("/api/v1/transactions/", json=income_payload, headers=auth_headers)
    assert resp.status_code == 201
    tx1 = resp.json()
    assert tx1["type"] == "income"
    assert tx1["category"] == "Salary"
    assert tx1["amount"] == 5000.0
    assert "work" in tx1["tags"]
    
    # 2. Add Transaction (Expense)
    expense_payload = {
        "type": "expense",
        "category": "Dining Out",
        "amount": 150.0,
        "notes": "Dinner with friends",
        "tags": ["restaurants", "social"]
    }
    resp2 = client.post("/api/v1/transactions/", json=expense_payload, headers=auth_headers)
    assert resp2.status_code == 201
    tx2 = resp2.json()
    
    # 3. Read Transactions (Verify query filters)
    # Check type filter
    get_resp = client.get("/api/v1/transactions/?type=expense", headers=auth_headers)
    assert get_resp.status_code == 200
    tx_list = get_resp.json()
    assert len(tx_list) == 1
    assert tx_list[0]["id"] == tx2["id"]
    
    # Check search filter
    get_search = client.get("/api/v1/transactions/?search=Dinner", headers=auth_headers)
    assert len(get_search.json()) == 1
    
    # 4. Update Transaction details
    update_payload = {"amount": 180.0, "notes": "Dinner with family"}
    put_resp = client.put(f"/api/v1/transactions/{tx2['id']}", json=update_payload, headers=auth_headers)
    assert put_resp.status_code == 200
    updated_tx = put_resp.json()
    assert updated_tx["amount"] == 180.0
    assert updated_tx["notes"] == "Dinner with family"
    
    # 5. Delete Transaction
    del_resp = client.delete(f"/api/v1/transactions/{tx2['id']}", headers=auth_headers)
    assert del_resp.status_code == 204
    
    # Verify deletion
    verify_resp = client.get(f"/api/v1/transactions/{tx2['id']}", headers=auth_headers)
    assert verify_resp.status_code == 404
