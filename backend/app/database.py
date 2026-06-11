from collections.abc import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

from app.config import settings

DEFAULT_SQLITE_URL = "sqlite:///./calorie.db"

# An empty/whitespace DATABASE_URL (e.g. a blank env var on Railway) would make
# create_engine() crash at import time, before the app can even start. Fall back
# to SQLite so the server still boots instead of dying on the healthcheck.
database_url = (settings.database_url or "").strip() or DEFAULT_SQLITE_URL

# Some hosts (e.g. Render, Heroku) hand out a "postgres://" URL, which SQLAlchemy
# 2.0 no longer recognizes. Normalize it to the "postgresql://" dialect.
if database_url.startswith("postgres://"):
    database_url = database_url.replace("postgres://", "postgresql://", 1)

connect_args = {"check_same_thread": False} if database_url.startswith("sqlite") else {}

engine = create_engine(database_url, connect_args=connect_args, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    pass


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
