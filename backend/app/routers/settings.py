from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.deps import get_current_user
from app.models import User, UserSettings
from app.schemas import UserSettingsIn, UserSettingsOut

router = APIRouter(prefix="/api", tags=["settings"])


@router.get("/settings", response_model=UserSettingsOut)
def get_settings(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
) -> UserSettings:
    settings = db.get(UserSettings, user.id)
    if settings is None:
        # Return defaults without persisting until the user saves.
        settings = UserSettings(user_id=user.id)
    return settings


@router.put("/settings", response_model=UserSettingsOut)
def set_settings(
    payload: UserSettingsIn,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
) -> UserSettings:
    settings = db.get(UserSettings, user.id)
    if settings is None:
        settings = UserSettings(user_id=user.id)
        db.add(settings)
    settings.weight_kg = payload.weight_kg
    settings.weight_unit = payload.weight_unit
    settings.diet_mode = payload.diet_mode
    settings.steps_target = payload.steps_target
    settings.water_ml = payload.water_ml
    db.commit()
    db.refresh(settings)
    return settings
