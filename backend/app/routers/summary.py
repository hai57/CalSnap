from datetime import date, datetime, time, timezone

from fastapi import APIRouter, Depends, Query
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.deps import get_current_user
from app.models import DailyGoal, FoodEntry, User
from app.schemas import (
    DailyGoalIn,
    DailyGoalOut,
    DailySummary,
    FoodEntryOut,
    MacroTotals,
)

router = APIRouter(prefix="/api", tags=["summary"])


def _day_bounds(day: date) -> tuple[datetime, datetime]:
    start = datetime.combine(day, time.min, tzinfo=timezone.utc)
    end = datetime.combine(day, time.max, tzinfo=timezone.utc)
    return start, end


@router.get("/summary", response_model=DailySummary)
def daily_summary(
    day: date | None = Query(default=None),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
) -> DailySummary:
    target_day = day or datetime.now(timezone.utc).date()
    start, end = _day_bounds(target_day)
    stmt = (
        select(FoodEntry)
        .where(
            FoodEntry.user_id == user.id,
            FoodEntry.logged_at >= start,
            FoodEntry.logged_at <= end,
        )
        .order_by(FoodEntry.logged_at.desc())
    )
    entries = list(db.scalars(stmt).all())

    totals = MacroTotals(
        calories=sum(e.calories for e in entries),
        protein=sum(e.protein for e in entries),
        carbs=sum(e.carbs for e in entries),
        fat=sum(e.fat for e in entries),
    )

    goal = db.get(DailyGoal, user.id)
    return DailySummary(
        day=target_day,
        totals=totals,
        goal=DailyGoalOut.model_validate(goal) if goal else None,
        entries=[FoodEntryOut.model_validate(e) for e in entries],
    )


@router.get("/goal", response_model=DailyGoalOut | None)
def get_goal(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
) -> DailyGoal | None:
    return db.get(DailyGoal, user.id)


@router.put("/goal", response_model=DailyGoalOut)
def set_goal(
    payload: DailyGoalIn,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
) -> DailyGoal:
    goal = db.get(DailyGoal, user.id)
    if goal is None:
        goal = DailyGoal(user_id=user.id)
        db.add(goal)
    goal.calorie_target = payload.calorie_target
    goal.protein_target = payload.protein_target
    goal.carb_target = payload.carb_target
    goal.fat_target = payload.fat_target
    db.commit()
    db.refresh(goal)
    return goal
