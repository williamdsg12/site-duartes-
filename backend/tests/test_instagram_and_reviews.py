import os
import requests
import pytest

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://manutencao-duartes.preview.emergentagent.com").rstrip("/")


def test_root():
    r = requests.get(f"{BASE_URL}/api/", timeout=15)
    assert r.status_code == 200
    assert r.json().get("message") == "Hello World"


def test_instagram_feed_unconfigured():
    r = requests.get(f"{BASE_URL}/api/instagram/feed", timeout=15)
    assert r.status_code == 200
    data = r.json()
    assert data["configured"] is False
    assert data["items"] == []
    assert "cached" in data


def test_reviews_unconfigured():
    r = requests.get(f"{BASE_URL}/api/reviews", timeout=15)
    assert r.status_code == 200
    data = r.json()
    assert data["configured"] is False
