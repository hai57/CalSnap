import os
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.config import settings
from app.database import Base, engine
from app.routers import analyze, auth, entries, settings as settings_router, summary


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create tables for local/dev convenience. For production, use Alembic migrations.
    Base.metadata.create_all(bind=engine)
    os.makedirs(settings.upload_dir, exist_ok=True)
    yield


app = FastAPI(title="AI Calorie Tracker API", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
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
