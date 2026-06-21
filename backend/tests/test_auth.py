import pytest
from fastapi.testclient import TestClient

def test_user_registration_and_login(client: TestClient):
    # 1. Test register new user
    register_payload = {"email": "testuser@example.com", "password": "securepassword"}
    response = client.post("/api/v1/auth/register", json=register_payload)
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "testuser@example.com"
    assert "id" in data

    # 2. Test register duplicate email
    response_dup = client.post("/api/v1/auth/register", json=register_payload)
    assert response_dup.status_code == 400
    assert response_dup.json()["detail"] == "A user with this email address already exists."

    # 3. Test login success
    login_payload = {"email": "testuser@example.com", "password": "securepassword"}
    response_login = client.post("/api/v1/auth/login", json=login_payload)
    assert response_login.status_code == 200
    login_data = response_login.json()
    assert "access_token" in login_data
    assert login_data["token_type"] == "bearer"
    assert login_data["user"]["email"] == "testuser@example.com"

    # 4. Test login failure (invalid credentials)
    response_bad_login = client.post(
        "/api/v1/auth/login", 
        json={"email": "testuser@example.com", "password": "wrongpassword"}
    )
    assert response_bad_login.status_code == 401

    # 5. Test retrieve profile (/me)
    token = login_data["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    response_me = client.get("/api/v1/auth/me", headers=headers)
    assert response_me.status_code == 200
    me_data = response_me.json()
    assert me_data["email"] == "testuser@example.com"

    # 6. Test retrieve profile without auth header
    response_me_no_auth = client.get("/api/v1/auth/me")
    assert response_me_no_auth.status_code == 401
