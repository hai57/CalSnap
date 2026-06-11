import logging
import os
import time
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.config import settings
from app.database import Base, engine
from app.routers import analyze, auth, entries, settings as settings_router, summary

logger = logging.getLogger("uvicorn.error")


def _init_db(retries: int = 8, delay: float = 3.0) -> None:
    # Log which database we're actually targeting (password hidden) so deploy
    # logs reveal whether DATABASE_URL resolved (postgres vs sqlite fallback).
    try:
        logger.info("Using database: %s", engine.url.render_as_string(hide_password=True))
    except Exception:  # noqa: BLE001 - never let logging break startup
        pass

    # On Railway, private networking to Postgres can take a few seconds after the
    # container starts. Retry, but DO NOT crash the app: keeping the web server up
    # lets /api/health pass and surfaces the real DB error in the logs/requests.
    for attempt in range(1, retries + 1):
        try:
            Base.metadata.create_all(bind=engine)
            logger.info("Database ready (attempt %d).", attempt)
            return
        except Exception as err:  # noqa: BLE001 - report any connection/url error
            logger.warning("DB not ready (attempt %d/%d): %s", attempt, retries, err)
            if attempt < retries:
                time.sleep(delay)
    logger.error("Could not initialize the database; starting anyway. Check DATABASE_URL.")


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
