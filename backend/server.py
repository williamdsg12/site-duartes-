from fastapi import FastAPI, APIRouter
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import asyncio
import requests
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Configure logging early so it is available to all route handlers
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")  # Ignore MongoDB's _id field
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    
    # Convert to dict and serialize datetime to ISO string for MongoDB
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    # Exclude MongoDB's _id field from the query results
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    
    # Convert ISO string timestamps back to datetime objects
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    
    return status_checks

# ----------------------------------------------------------------------------
# Google Reviews integration (Places API New) — key kept server-side only
# ----------------------------------------------------------------------------
GOOGLE_PLACES_API_KEY = os.environ.get("GOOGLE_PLACES_API_KEY", "").strip()
GOOGLE_PLACE_ID = os.environ.get("GOOGLE_PLACE_ID", "").strip()
REVIEWS_CACHE_TTL_SECONDS = 60 * 60 * 12  # 12h


class ReviewItem(BaseModel):
    author: str
    rating: int
    text: str
    relative_time: Optional[str] = None
    profile_photo: Optional[str] = None
    publish_time: Optional[str] = None


class ReviewsResponse(BaseModel):
    configured: bool
    rating: Optional[float] = None
    total: Optional[int] = None
    reviews: List[ReviewItem] = []
    cached: bool = False


def _fetch_google_reviews_sync():
    """Blocking call to Google Places API (New). Returns parsed dict."""
    url = f"https://places.googleapis.com/v1/places/{GOOGLE_PLACE_ID}"
    headers = {
        "X-Goog-Api-Key": GOOGLE_PLACES_API_KEY,
        "X-Goog-FieldMask": "id,displayName,rating,userRatingCount,reviews",
        # ask Google to localise review text / times to Brazilian Portuguese
        "Accept-Language": "pt-BR",
    }
    resp = requests.get(url, headers=headers, timeout=15)
    resp.raise_for_status()
    data = resp.json()

    reviews = []
    for r in (data.get("reviews") or [])[:6]:
        text_obj = r.get("text") or r.get("originalText") or {}
        author_attr = r.get("authorAttribution") or {}
        reviews.append(
            {
                "author": author_attr.get("displayName", "Cliente Google"),
                "rating": int(r.get("rating", 5)),
                "text": (text_obj.get("text") or "").strip(),
                "relative_time": r.get("relativePublishTimeDescription"),
                "profile_photo": author_attr.get("photoUri"),
                "publish_time": r.get("publishTime"),
            }
        )

    return {
        "rating": data.get("rating"),
        "total": data.get("userRatingCount"),
        "reviews": [rv for rv in reviews if rv["text"]],
    }


@api_router.get("/reviews", response_model=ReviewsResponse)
async def get_reviews():
    # Not configured yet — frontend will fall back to its static testimonials
    if not GOOGLE_PLACES_API_KEY or not GOOGLE_PLACE_ID:
        return ReviewsResponse(configured=False, reviews=[])

    now = datetime.now(timezone.utc)

    # Serve from cache if fresh
    cached = await db.google_reviews_cache.find_one({"_id": "google_reviews"})
    if cached and cached.get("fetched_at"):
        try:
            fetched_at = datetime.fromisoformat(cached["fetched_at"])
            if (now - fetched_at).total_seconds() < REVIEWS_CACHE_TTL_SECONDS:
                return ReviewsResponse(
                    configured=True,
                    rating=cached.get("rating"),
                    total=cached.get("total"),
                    reviews=cached.get("reviews", []),
                    cached=True,
                )
        except (ValueError, TypeError):
            pass

    # Fetch fresh data from Google
    try:
        result = await asyncio.to_thread(_fetch_google_reviews_sync)
        await db.google_reviews_cache.update_one(
            {"_id": "google_reviews"},
            {"$set": {**result, "fetched_at": now.isoformat()}},
            upsert=True,
        )
        return ReviewsResponse(
            configured=True,
            rating=result["rating"],
            total=result["total"],
            reviews=result["reviews"],
        )
    except Exception as e:  # noqa: BLE001
        logger.error(f"Failed to fetch Google reviews: {e}")
        # Fall back to any stale cache we may have
        if cached:
            return ReviewsResponse(
                configured=True,
                rating=cached.get("rating"),
                total=cached.get("total"),
                reviews=cached.get("reviews", []),
                cached=True,
            )
        return ReviewsResponse(configured=True, reviews=[])


# ----------------------------------------------------------------------------
# Instagram feed integration (Instagram Graph API) — token kept server-side.
# Auto-updates the site gallery whenever the client posts new photos.
# ----------------------------------------------------------------------------
INSTAGRAM_ACCESS_TOKEN = os.environ.get("INSTAGRAM_ACCESS_TOKEN", "").strip()
INSTAGRAM_USER_ID = os.environ.get("INSTAGRAM_USER_ID", "").strip()
IG_CACHE_TTL_SECONDS = 60 * 60  # 1h — near real-time updates
IG_MEDIA_FIELDS = "id,caption,media_type,media_url,thumbnail_url,permalink,timestamp"


class InstagramItem(BaseModel):
    id: str
    caption: Optional[str] = None
    media_type: Optional[str] = None
    media_url: Optional[str] = None
    thumbnail_url: Optional[str] = None
    permalink: Optional[str] = None
    timestamp: Optional[str] = None


class InstagramResponse(BaseModel):
    configured: bool
    items: List[InstagramItem] = []
    cached: bool = False


async def _get_ig_token():
    """Return the freshest Instagram token, refreshing the long-lived token
    opportunistically (Meta long-lived tokens last 60 days and can be refreshed
    once they are at least 24h old)."""
    token_doc = await db.instagram_tokens.find_one({"_id": "instagram"})
    if not token_doc:
        # Seed from env on first run
        token_doc = {
            "_id": "instagram",
            "access_token": INSTAGRAM_ACCESS_TOKEN,
            "created_at": datetime.now(timezone.utc).isoformat(),
        }
        await db.instagram_tokens.update_one(
            {"_id": "instagram"}, {"$set": token_doc}, upsert=True
        )

    token = token_doc.get("access_token") or INSTAGRAM_ACCESS_TOKEN
    created_at_raw = token_doc.get("created_at")
    try:
        created_at = datetime.fromisoformat(created_at_raw) if created_at_raw else None
    except (ValueError, TypeError):
        created_at = None

    if created_at and (datetime.now(timezone.utc) - created_at).total_seconds() > 60 * 60 * 24:
        try:
            new_token = await asyncio.to_thread(_refresh_ig_token_sync, token)
            if new_token:
                token = new_token
                await db.instagram_tokens.update_one(
                    {"_id": "instagram"},
                    {"$set": {"access_token": new_token, "created_at": datetime.now(timezone.utc).isoformat()}},
                    upsert=True,
                )
        except Exception as e:  # noqa: BLE001
            logger.warning(f"Instagram token refresh skipped: {e}")

    return token


def _refresh_ig_token_sync(token: str):
    resp = requests.get(
        "https://graph.instagram.com/refresh_access_token",
        params={"grant_type": "ig_refresh_token", "access_token": token},
        timeout=15,
    )
    if resp.status_code == 200:
        return resp.json().get("access_token")
    return None


def _fetch_ig_media_sync(token: str):
    resp = requests.get(
        f"https://graph.instagram.com/{INSTAGRAM_USER_ID}/media",
        params={"fields": IG_MEDIA_FIELDS, "access_token": token, "limit": 12},
        timeout=15,
    )
    resp.raise_for_status()
    data = resp.json()
    items = []
    for m in data.get("data", []):
        mtype = m.get("media_type")
        # Use thumbnail for videos so the gallery always has a still image
        url = m.get("media_url")
        thumb = m.get("thumbnail_url") or url
        items.append(
            {
                "id": m.get("id"),
                "caption": m.get("caption"),
                "media_type": mtype,
                "media_url": url,
                "thumbnail_url": thumb,
                "permalink": m.get("permalink"),
                "timestamp": m.get("timestamp"),
            }
        )
    return items


@api_router.get("/instagram/feed", response_model=InstagramResponse)
async def instagram_feed():
    if not INSTAGRAM_ACCESS_TOKEN or not INSTAGRAM_USER_ID:
        return InstagramResponse(configured=False, items=[])

    now = datetime.now(timezone.utc)
    cached = await db.instagram_media_cache.find_one({"_id": "feed"})
    if cached and cached.get("fetched_at"):
        try:
            fetched_at = datetime.fromisoformat(cached["fetched_at"])
            if (now - fetched_at).total_seconds() < IG_CACHE_TTL_SECONDS:
                return InstagramResponse(configured=True, items=cached.get("items", []), cached=True)
        except (ValueError, TypeError):
            pass

    try:
        token = await _get_ig_token()
        items = await asyncio.to_thread(_fetch_ig_media_sync, token)
        await db.instagram_media_cache.update_one(
            {"_id": "feed"},
            {"$set": {"items": items, "fetched_at": now.isoformat()}},
            upsert=True,
        )
        return InstagramResponse(configured=True, items=items)
    except Exception as e:  # noqa: BLE001
        logger.error(f"Failed to fetch Instagram feed: {e}")
        if cached:
            return InstagramResponse(configured=True, items=cached.get("items", []), cached=True)
        return InstagramResponse(configured=True, items=[])


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()