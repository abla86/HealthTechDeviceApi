from fastapi.testclient import TestClient

from main import app

client = TestClient(app)


def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}


def test_list_devices():
    response = client.get("/devices")
    assert response.status_code == 200
    assert len(response.json()) >= 1


def test_create_and_read_device():
    response = client.post(
        "/devices",
        json={
            "name": "Demo Sensor",
            "type": "Sensor",
            "status": "Online",
            "battery": 90,
        },
    )
    assert response.status_code == 201
    device = response.json()

    read_response = client.get(f"/devices/{device['id']}")
    assert read_response.status_code == 200
    assert read_response.json()["name"] == "Demo Sensor"

    delete_response = client.delete(f"/devices/{device['id']}")
    assert delete_response.status_code == 204


def test_validation_rejects_invalid_battery():
    response = client.post(
        "/devices",
        json={
            "name": "Invalid Sensor",
            "type": "Sensor",
            "status": "Online",
            "battery": 101,
        },
    )
    assert response.status_code == 422


def test_missing_device_returns_404():
    response = client.get("/devices/999999")
    assert response.status_code == 404


def test_create_validation_rejects_invalid_status():
    response = client.post(
        "/devices",
        json={
            "name": "Invalid Status Device",
            "type": "Sensor",
            "status": "Unknown",
            "battery": 50,
        },
    )
    assert response.status_code == 422


def test_create_validation_rejects_short_name():
    response = client.post(
        "/devices",
        json={
            "name": "X",
            "type": "Sensor",
            "status": "Online",
            "battery": 50,
        },
    )
    assert response.status_code == 422
