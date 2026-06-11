from datetime import datetime, timezone

from sqlalchemy import DateTime, Float, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


def _utcnow() -> datetime:
    return datetime.now(timezone.utc)


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_utcnow)

    entries: Mapped[list["FoodEntry"]] = relationship(
        back_populates="user", cascade="all, delete-orphan"
    )
    goal: Mapped["DailyGoal | None"] = relationship(
        back_populates="user", cascade="all, delete-orphan", uselist=False
    )
    settings: Mapped["UserSettings | None"] = relationship(
        back_populates="user", cascade="all, delete-orphan", uselist=False
    )


class FoodEntry(Base):
    __tablename__ = "food_entries"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True, nullable=False)

    name: Mapped[str] = mapped_column(String(255), nullable=False)
    calories: Mapped[float] = mapped_column(Float, default=0.0)
    protein: Mapped[float] = mapped_column(Float, default=0.0)
    carbs: Mapped[float] = mapped_column(Float, default=0.0)
    fat: Mapped[float] = mapped_column(Float, default=0.0)

    image_url: Mapped[str | None] = mapped_column(String(512), nullable=True)
    source: Mapped[str] = mapped_column(String(16), default="text")  # "photo" | "text"
    confidence: Mapped[float | None] = mapped_column(Float, nullable=True)

    logged_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_utcnow, index=True)

    user: Mapped["User"] = relationship(back_populates="entries")


class DailyGoal(Base):
    __tablename__ = "daily_goals"

    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), primary_key=True)
    calorie_target: Mapped[float] = mapped_column(Float, default=2000.0)
    protein_target: Mapped[float] = mapped_column(Float, default=120.0)
    carb_target: Mapped[float] = mapped_column(Float, default=250.0)
    fat_target: Mapped[float] = mapped_column(Float, default=70.0)

    user: Mapped["User"] = relationship(back_populates="goal")


class UserSettings(Base):
    __tablename__ = "user_settings"

    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), primary_key=True)
    weight_kg: Mapped[float] = mapped_column(Float, default=70.0)
    weight_unit: Mapped[str] = mapped_column(String(8), default="kg")  # "kg" | "lb"
    diet_mode: Mapped[str] = mapped_column(String(32), default="balanced")
    steps_target: Mapped[int] = mapped_column(Integer, default=8000)
    water_ml: Mapped[int] = mapped_column(Integer, default=2000)

    user: Mapped["User"] = relationship(back_populates="settings")
