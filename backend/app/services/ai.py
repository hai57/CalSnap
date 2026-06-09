"""AI-powered nutrition estimation.

Exposes two functions used by the API layer:
  - analyze_text(description) -> Nutrition
  - analyze_image(image_bytes, mime_type) -> Nutrition

When settings.mock_ai is True (the default for local dev), deterministic canned
data is returned so the apps can be built and tested without spending on API calls.
Otherwise a hosted vision LLM (OpenAI GPT-4o by default) is called and asked to
return strict JSON matching the Nutrition schema.
"""

from __future__ import annotations

import base64
import hashlib
import json

from app.config import settings
from app.schemas import Nutrition

_SYSTEM_PROMPT = (
    "You are a nutrition estimation assistant. Given a food photo or a text "
    "description of a meal, estimate the nutrition for the WHOLE portion shown "
    "or described. Respond with a concise, human-friendly food name and your best "
    "numeric estimates. Calories are in kcal; protein, carbs, and fat are in grams. "
    "Provide a confidence value between 0 and 1 reflecting how certain you are."
)

_JSON_SCHEMA = {
    "type": "object",
    "additionalProperties": False,
    "properties": {
        "name": {"type": "string"},
        "calories": {"type": "number"},
        "protein": {"type": "number"},
        "carbs": {"type": "number"},
        "fat": {"type": "number"},
        "confidence": {"type": "number"},
    },
    "required": ["name", "calories", "protein", "carbs", "fat", "confidence"],
}


def _mock_from_seed(seed: str, name: str) -> Nutrition:
    """Deterministic pseudo-random nutrition so the same input gives stable output."""
    h = int(hashlib.sha256(seed.encode("utf-8")).hexdigest(), 16)
    calories = 150 + (h % 650)  # 150..799
    protein = 5 + (h // 7 % 40)
    fat = 3 + (h // 13 % 35)
    carbs = 10 + (h // 17 % 80)
    confidence = round(0.55 + (h % 40) / 100, 2)  # 0.55..0.94
    return Nutrition(
        name=name,
        calories=float(calories),
        protein=float(protein),
        carbs=float(carbs),
        fat=float(fat),
        confidence=confidence,
    )


def _parse_llm_json(content: str, fallback_name: str) -> Nutrition:
    data = json.loads(content)
    return Nutrition(
        name=str(data.get("name") or fallback_name),
        calories=max(0.0, float(data.get("calories", 0))),
        protein=max(0.0, float(data.get("protein", 0))),
        carbs=max(0.0, float(data.get("carbs", 0))),
        fat=max(0.0, float(data.get("fat", 0))),
        confidence=_clamp_conf(data.get("confidence")),
    )


def _clamp_conf(value) -> float | None:
    if value is None:
        return None
    try:
        return max(0.0, min(1.0, float(value)))
    except (TypeError, ValueError):
        return None


def _client():
    # Imported lazily so the package is only required when not mocking.
    from openai import OpenAI

    if not settings.openai_api_key:
        raise RuntimeError(
            "OPENAI_API_KEY is not set. Set MOCK_AI=true for local development "
            "or provide an API key."
        )
    return OpenAI(api_key=settings.openai_api_key)


def _chat(messages: list[dict]) -> str:
    client = _client()
    resp = client.chat.completions.create(
        model=settings.openai_model,
        messages=messages,
        response_format={
            "type": "json_schema",
            "json_schema": {"name": "nutrition", "schema": _JSON_SCHEMA, "strict": True},
        },
        temperature=0.2,
    )
    return resp.choices[0].message.content or "{}"


def analyze_text(description: str) -> Nutrition:
    if settings.mock_ai:
        name = description.strip().split("\n")[0][:80] or "Meal"
        return _mock_from_seed(f"text:{description}", name)

    content = _chat(
        [
            {"role": "system", "content": _SYSTEM_PROMPT},
            {"role": "user", "content": f"Estimate the nutrition for: {description}"},
        ]
    )
    return _parse_llm_json(content, fallback_name=description[:80] or "Meal")


def analyze_image(image_bytes: bytes, mime_type: str = "image/jpeg") -> Nutrition:
    if settings.mock_ai:
        seed = hashlib.sha256(image_bytes).hexdigest()
        return _mock_from_seed(f"image:{seed}", "Analyzed meal")

    b64 = base64.b64encode(image_bytes).decode("ascii")
    data_url = f"data:{mime_type};base64,{b64}"
    content = _chat(
        [
            {"role": "system", "content": _SYSTEM_PROMPT},
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": "Estimate the nutrition for the food in this image."},
                    {"type": "image_url", "image_url": {"url": data_url}},
                ],
            },
        ]
    )
    return _parse_llm_json(content, fallback_name="Analyzed meal")
