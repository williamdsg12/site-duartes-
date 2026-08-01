"""Tests for GET /api/reviews (Google Reviews unconfigured path) and root endpoint."""
import os
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://manutencao-duartes.preview.emergentagent.com").rstrip("/")


def test_root_still_works():
    r = requests.get(f"{BASE_URL}/api/", timeout=15)
    assert r.status_code == 200
    assert r.json() == {"message": "Hello World"}


def test_reviews_unconfigured_returns_200_and_fallback_shape():
    r = requests.get(f"{BASE_URL}/api/reviews", timeout=15)
    assert r.status_code == 200, r.text
    data = r.json()
    # Required keys
    for k in ["configured", "rating", "total", "reviews", "cached"]:
        assert k in data, f"missing key {k} in {data}"
    assert data["configured"] is False
    assert data["reviews"] == []
    assert data["cached"] is False
    assert data["rating"] is None
    assert data["total"] is None


def test_reviews_endpoint_multiple_calls_stable():
    """Ensure the endpoint is idempotent and doesn't crash on repeated calls."""
    for _ in range(3):
        r = requests.get(f"{BASE_URL}/api/reviews", timeout=15)
        assert r.status_code == 200
        assert r.json()["configured"] is False
