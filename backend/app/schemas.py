from datetime import date, datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, EmailStr, Field


# ---------- Auth ----------
class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6, max_length=128)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    email: EmailStr
    created_at: datetime


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


# ---------- Nutrition / AI ----------
class Nutrition(BaseModel):
    name: str
    calories: float = Field(ge=0)
    protein: float = Field(ge=0)
    carbs: float = Field(ge=0)
    fat: float = Field(ge=0)
    confidence: float | None = Field(default=None, ge=0, le=1)


class AnalyzeTextRequest(BaseModel):
    description: str = Field(min_length=1, max_length=2000)


class AnalyzeResult(Nutrition):
    source: Literal["photo", "text"]
    image_url: str | None = None


# ---------- Food entries ----------
class FoodEntryCreate(BaseModel):
    name: str = Field(min_length=1, max_length=255)
    calories: float = Field(ge=0)
    protein: float = Field(default=0, ge=0)
    carbs: float = Field(default=0, ge=0)
    fat: float = Field(default=0, ge=0)
    source: Literal["photo", "text"] = "text"
    image_url: str | None = None
    confidence: float | None = Field(default=None, ge=0, le=1)
    logged_at: datetime | None = None


class FoodEntryUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=255)
    calories: float | None = Field(default=None, ge=0)
    protein: float | None = Field(default=None, ge=0)
    carbs: float | None = Field(default=None, ge=0)
    fat: float | None = Field(default=None, ge=0)
    logged_at: datetime | None = None


class FoodEntryOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    calories: float
    protein: float
    carbs: float
    fat: float
    image_url: str | None
    source: str
    confidence: float | None
    logged_at: datetime


# ---------- Goals & summary ----------
class DailyGoalIn(BaseModel):
    calorie_target: float = Field(ge=0)
    protein_target: float = Field(ge=0)
    carb_target: float = Field(ge=0)
    fat_target: float = Field(ge=0)


class DailyGoalOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    calorie_target: float
    protein_target: float
    carb_target: float
    fat_target: float


class MacroTotals(BaseModel):
    calories: float = 0
    protein: float = 0
    carbs: float = 0
    fat: float = 0


class DailySummary(BaseModel):
    day: date
    totals: MacroTotals
    goal: DailyGoalOut | None
    entries: list[FoodEntryOut]
