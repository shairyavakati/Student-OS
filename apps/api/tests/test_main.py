from fastapi.testclient import TestClient
import pytest
import uuid

# Import the main FastAPI app
from main import app

client = TestClient(app)

def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"
    assert "StudentOS API" in response.json()["app"]

def test_docs_accessible():
    response = client.get("/docs")
    assert response.status_code == 200

# We can add more endpoints here, but since auth routes require an active AsyncPG database
# and we are running tests before the database might be fully seeded, we skip deeper DB tests
# or we'd mock get_db dependency.
