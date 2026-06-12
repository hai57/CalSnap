from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.deps import get_current_user
from app.models import User, UserProfile
from app.schemas import UserProfileIn, UserProfileOut

router = APIRouter(prefix="/api", tags=["profile"])

DEFAULT_PROFILE = {
    "weight_kg": 70.0,
    "weight_unit": "kg",
    "diet_mode": "balanced",
    "steps_target": 8000,
    "water_ml": 2000,
}


@router.get("/profile", response_model=UserProfileOut)
def get_profile(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
) -> UserProfile:
    profile = db.get(UserProfile, user.id)
    if profile is None:
        # Return defaults without persisting until the user saves.
        profile = UserProfile(user_id=user.id, **DEFAULT_PROFILE)
    return profile


@router.put("/profile", response_model=UserProfileOut)
def set_profile(
    payload: UserProfileIn,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
) -> UserProfile:
    profile = db.get(UserProfile, user.id)
    if profile is None:
        profile = UserProfile(user_id=user.id, **DEFAULT_PROFILE)
        db.add(profile)
    profile.weight_kg = payload.weight_kg
    profile.weight_unit = payload.weight_unit
    profile.diet_mode = payload.diet_mode
    profile.steps_target = payload.steps_target
    profile.water_ml = payload.water_ml
    db.commit()
    db.refresh(profile)
    return profile
