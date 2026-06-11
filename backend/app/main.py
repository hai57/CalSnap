import logging
import os
import time
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.exc import OperationalError

from app.config import settings
from app.database import Base, engine
from app.routers import analyze, auth, entries, settings as settings_router, summary

logger = logging.getLogger("uvicorn.error")


def _init_db(retries: int = 10, delay: float = 3.0) -> None:
    # On platforms like Railway, private networking to Postgres can take a few
    # seconds to come up after the container starts, so retry instead of crashing.
    last_err: Exception | None = None
    for attempt in range(1, retries + 1):
        try:
            Base.metadata.create_all(bind=engine)
            logger.info("Database ready (attempt %d).", attempt)
            return
        except OperationalError as err:  # DB not reachable yet
            last_err = err
            logger.warning("DB not ready (attempt %d/%d): %s", attempt, retries, err)
            time.sleep(delay)
    raise RuntimeError(f"Could not connect to the database after {retries} attempts") from last_err


@asynccontextmanager
async def lifespan(app: FastAPI):
    os.makedirs(settings.upload_dir, exist_ok=True)
    _init_db()
    yield


app = FastAPI(title="AI Calorie Tracker API", version="1.0.0", lifespan=lifespan)

# Auth uses a Bearer token (not cookies), so when CORS_ORIGINS="*" we can safely
# allow every origin. Browsers forbid "*" together with credentials, so we only
# enable credentials for an explicit origin list.
_allow_all_origins = "*" in settings.cors_origin_list
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if _allow_all_origins else settings.cors_origin_list,
    allow_credentials=not _allow_all_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(analyze.router)
app.include_router(entries.router)
app.include_router(summary.router)
app.include_router(settings_router.router)

# Serve uploaded images (local dev storage).
os.makedirs(settings.upload_dir, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=settings.upload_dir), name="uploads")


@app.get("/api/health", tags=["health"])
def health() -> dict[str, object]:
    return {"status": "ok", "mock_ai": settings.mock_ai}
