from datetime import date, datetime, time, timezone

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.deps import get_current_user
from app.models import FoodEntry, User
from app.schemas import FoodEntryCreate, FoodEntryOut, FoodEntryUpdate

router = APIRouter(prefix="/api/entries", tags=["entries"])


def _day_bounds(day: date) -> tuple[datetime, datetime]:
    start = datetime.combine(day, time.min, tzinfo=timezone.utc)
    end = datetime.combine(day, time.max, tzinfo=timezone.utc)
    return start, end


@router.post("", response_model=FoodEntryOut, status_code=status.HTTP_201_CREATED)
def create_entry(
    payload: FoodEntryCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
) -> FoodEntry:
    entry = FoodEntry(
        user_id=user.id,
        name=payload.name,
        calories=payload.calories,
        protein=payload.protein,
        carbs=payload.carbs,
        fat=payload.fat,
        source=payload.source,
        image_url=payload.image_url,
        confidence=payload.confidence,
        logged_at=payload.logged_at or datetime.now(timezone.utc),
    )
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry


@router.get("", response_model=list[FoodEntryOut])
def list_entries(
    day: date | None = Query(default=None, description="Filter to a single day (YYYY-MM-DD)"),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
) -> list[FoodEntry]:
    stmt = select(FoodEntry).where(FoodEntry.user_id == user.id)
    if day is not None:
        start, end = _day_bounds(day)
        stmt = stmt.where(FoodEntry.logged_at >= start, FoodEntry.logged_at <= end)
    stmt = stmt.order_by(FoodEntry.logged_at.desc())
    return list(db.scalars(stmt).all())


@router.patch("/{entry_id}", response_model=FoodEntryOut)
def update_entry(
    entry_id: int,
    payload: FoodEntryUpdate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
) -> FoodEntry:
    entry = _get_owned_entry(db, entry_id, user)
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(entry, field, value)
    db.commit()
    db.refresh(entry)
    return entry


@router.delete("/{entry_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_entry(
    entry_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
) -> None:
    entry = _get_owned_entry(db, entry_id, user)
    db.delete(entry)
    db.commit()


def _get_owned_entry(db: Session, entry_id: int, user: User) -> FoodEntry:
    entry = db.get(FoodEntry, entry_id)
    if entry is None or entry.user_id != user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Entry not found")
    return entry
