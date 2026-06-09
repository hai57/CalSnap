import os
import uuid

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status

from app.config import settings
from app.deps import get_current_user
from app.models import User
from app.schemas import AnalyzeResult, AnalyzeTextRequest
from app.services import ai

router = APIRouter(prefix="/api/analyze", tags=["analyze"])

_ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/webp", "image/heic"}
_MAX_IMAGE_BYTES = 10 * 1024 * 1024  # 10 MB


@router.post("/text", response_model=AnalyzeResult)
def analyze_text(
    payload: AnalyzeTextRequest,
    _: User = Depends(get_current_user),
) -> AnalyzeResult:
    nutrition = ai.analyze_text(payload.description)
    return AnalyzeResult(source="text", image_url=None, **nutrition.model_dump())


@router.post("/image", response_model=AnalyzeResult)
async def analyze_image(
    file: UploadFile = File(...),
    _: User = Depends(get_current_user),
) -> AnalyzeResult:
    if file.content_type not in _ALLOWED_IMAGE_TYPES:
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail=f"Unsupported image type: {file.content_type}",
        )
    image_bytes = await file.read()
    if len(image_bytes) > _MAX_IMAGE_BYTES:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail="Image is too large (max 10 MB)",
        )

    image_url = _save_upload(image_bytes, file.filename or "upload.jpg")
    nutrition = ai.analyze_image(image_bytes, file.content_type or "image/jpeg")
    return AnalyzeResult(source="photo", image_url=image_url, **nutrition.model_dump())


def _save_upload(image_bytes: bytes, original_name: str) -> str:
    os.makedirs(settings.upload_dir, exist_ok=True)
    ext = os.path.splitext(original_name)[1].lower() or ".jpg"
    name = f"{uuid.uuid4().hex}{ext}"
    path = os.path.join(settings.upload_dir, name)
    with open(path, "wb") as fh:
        fh.write(image_bytes)
    return f"/uploads/{name}"
