from fastapi.testclient import TestClient

from main import app

client = TestClient(app)


def test_controls_list_is_available():
    response = client.get("/controls")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_control_lifecycle_create_patch_and_filter():
    created = client.post(
        "/controls",
        json={
            "domain": "Device Safety",
            "title": "Synthetic test control",
            "description": "Created by automated API test.",
            "severity": "High",
            "owner": "Test",
        },
    )
    assert created.status_code == 201
    record = created.json()
    assert record["severity"] == "High"

    patched = client.patch(
        f"/controls/{record['id']}",
        json={"status": "Resolved", "owner": "Reviewer"},
    )
    assert patched.status_code == 200
    assert patched.json()["status"] == "Resolved"
    assert patched.json()["owner"] == "Reviewer"

    filtered = client.get("/controls", params={"status": "Resolved"})
    assert filtered.status_code == 200
    assert any(item["id"] == record["id"] for item in filtered.json())


def test_missing_control_returns_404():
    response = client.get("/controls/999999")
    assert response.status_code == 404
