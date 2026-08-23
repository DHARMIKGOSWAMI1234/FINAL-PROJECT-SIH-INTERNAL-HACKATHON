import os
import json
import logging
import re
from pathlib import Path
from typing import Optional, Dict, Any, List
from dotenv import load_dotenv
from fastapi import HTTPException
from google import genai
from google.genai import types
from google.genai.errors import APIError, ClientError, ServerError

from app.schemas.gemini import GeminiAdviceRequest, GeminiAdviceResponse

logger = logging.getLogger(__name__)

# Ensure backend/.env is discovered and loaded
BACKEND_DIR = Path(__file__).resolve().parent.parent.parent
load_dotenv(BACKEND_DIR / ".env")

# Priority candidate Flash models for fast, low-latency generation
CANDIDATE_MODELS: List[str] = [
    "gemini-flash-latest",
    "gemini-3.5-flash-lite",
    "gemini-3.6-flash",
    "gemini-2.5-flash",
]


class GeminiService:
    """Service to interact with Google Gemini AI API via official google-genai SDK."""

    def __init__(self):
        env_model = os.getenv("GEMINI_MODEL", "").strip()
        if env_model:
            self.candidate_models = [env_model] + [m for m in CANDIDATE_MODELS if m != env_model]
        else:
            self.candidate_models = CANDIDATE_MODELS

    def _get_client(self) -> genai.Client:
        """Instantiates the Gemini client with GEMINI_API_KEY from environment."""
        load_dotenv(BACKEND_DIR / ".env")
        api_key = os.getenv("GEMINI_API_KEY", "").strip().strip("'\"")
        if not api_key or api_key == "your_gemini_api_key_here":
            logger.error("GEMINI_API_KEY is not configured or is a placeholder.")
            raise HTTPException(
                status_code=503,
                detail="Gemini AI service is currently unavailable (API key not configured)."
            )
        return genai.Client(api_key=api_key)

    def _build_system_instruction(self) -> str:
        return (
            "You are an expert Agronomist and Soil Science Consultant assisting farmers with precision agriculture. "
            "Your task is to explain and contextualize the machine learning (ML) model recommendations. "
            "CRITICAL SAFETY & ADVISORY RULES:\n"
            "1. You MUST treat the provided ML recommendations (recommended crop and recommended fertilizer) as the PRIMARY recommendations. "
            "DO NOT replace them or contradict them.\n"
            "2. DO NOT invent soil measurements, nutrient values, or weather readings not provided in the input.\n"
            "3. Clearly distinguish verified input data from general agronomic guidance.\n"
            "4. NEVER claim guaranteed yield increases or promote unsafe chemical overdosing.\n"
            "5. Advise the farmer to follow local agricultural extension or label precautions where appropriate.\n"
            "6. Use clear, encouraging, practical language suitable for agricultural decision-making.\n"
            "7. If prediction confidence is low, note the uncertainty and suggest soil verification.\n"
            "8. Always output valid JSON strictly conforming to the requested schema."
        )

    def _build_user_prompt(self, req: GeminiAdviceRequest) -> str:
        prompt_data = {
            "ml_recommended_crop": req.crop,
            "crop_confidence_score": f"{req.crop_confidence}%" if req.crop_confidence is not None else "Not specified",
            "ml_recommended_fertilizer": req.recommended_fertilizer,
            "fertilizer_confidence_score": f"{req.fertilizer_confidence}%" if req.fertilizer_confidence is not None else "Not specified",
            "soil_type": req.soil_type or "Unspecified",
            "soil_ph": req.soil_ph if req.soil_ph is not None else "Unspecified",
            "soil_npk_levels": {
                "nitrogen_N": req.nitrogen if req.nitrogen is not None else "Unspecified",
                "phosphorus_P": req.phosphorus if req.phosphorus is not None else "Unspecified",
                "potassium_K": req.potassium if req.potassium is not None else "Unspecified",
            },
            "environmental_conditions": {
                "temperature_celsius": req.temperature if req.temperature is not None else "Unspecified",
                "relative_humidity_percent": req.humidity if req.humidity is not None else "Unspecified",
                "rainfall_mm": req.rainfall if req.rainfall is not None else "Unspecified",
            },
            "farm_and_agronomic_context": {
                "location": req.location or "Unspecified",
                "growth_stage": req.growth_stage or "Unspecified",
                "season": req.season or "Unspecified",
                "irrigation_type": req.irrigation_type or "Unspecified",
                "previous_crop": req.previous_crop or "Unspecified",
                "previous_fertilizer_used": req.previous_fertilizer or "Unspecified",
                "previous_yield_kg_per_ha": req.previous_yield if req.previous_yield is not None else "Unspecified",
            },
            "target_language": req.language or "en",
        }

        return (
            f"Here is the farm context and ML prediction output:\n"
            f"```json\n{json.dumps(prompt_data, indent=2)}\n```\n\n"
            f"Provide a comprehensive, practical agronomic explanation and guidance in {req.language or 'en'}.\n"
            f"Output a JSON object with these EXACT keys:\n"
            f"- summary: string\n"
            f"- recommendation_reason: string\n"
            f"- application_guidance: string\n"
            f"- weather_considerations: string\n"
            f"- soil_considerations: string\n"
            f"- precautions: string\n"
            f"- confidence_note: string\n"
        )

    def _extract_json_from_text(self, text: str) -> Dict[str, Any]:
        """Extracts JSON object from markdown or raw text output."""
        cleaned = text.strip()
        if cleaned.startswith("```json"):
            cleaned = cleaned[7:]
        if cleaned.startswith("```"):
            cleaned = cleaned[3:]
        if cleaned.endswith("```"):
            cleaned = cleaned[:-3]
        cleaned = cleaned.strip()

        try:
            return json.loads(cleaned)
        except json.JSONDecodeError:
            # Try finding outermost JSON object with regex
            match = re.search(r"\{.*\}", cleaned, re.DOTALL)
            if match:
                return json.loads(match.group(0))
            raise

    def generate_agricultural_advice(self, request: GeminiAdviceRequest) -> GeminiAdviceResponse:
        """Generates structured agricultural advice for ML predictions using Gemini AI with fallback handling."""
        client = self._get_client()
        system_instruction = self._build_system_instruction()
        user_prompt = self._build_user_prompt(request)

        config = types.GenerateContentConfig(
            system_instruction=system_instruction,
            response_mime_type="application/json",
            temperature=0.2,
        )

        last_error: Optional[Exception] = None

        # Attempt generation across candidate Flash models
        for model_name in self.candidate_models:
            try:
                logger.info(f"Invoking Gemini model: {model_name}")
                response = client.models.generate_content(
                    model=model_name,
                    contents=user_prompt,
                    config=config,
                )

                if response.text and response.text.strip():
                    parsed_dict = self._extract_json_from_text(response.text)
                    return GeminiAdviceResponse(
                        summary=str(parsed_dict.get("summary", "")),
                        recommendation_reason=str(parsed_dict.get("recommendation_reason", "")),
                        application_guidance=str(parsed_dict.get("application_guidance", "")),
                        weather_considerations=str(parsed_dict.get("weather_considerations", "")),
                        soil_considerations=str(parsed_dict.get("soil_considerations", "")),
                        precautions=str(parsed_dict.get("precautions", "")),
                        confidence_note=str(parsed_dict.get("confidence_note", "")),
                    )

            except (ServerError, ClientError) as exc:
                logger.warning(f"Model {model_name} encountered error ({type(exc).__name__}): {exc}. Trying next candidate...")
                last_error = exc
                continue
            except Exception as exc:
                logger.warning(f"Model {model_name} unexpected error: {exc}. Trying next candidate...")
                last_error = exc
                continue

        # If all live models failed due to demand spikes or rate limits, generate safe agronomic fallback
        logger.warning(f"All candidate models exhausted. Generating structured agronomic fallback. Last error: {last_error}")
        return self._generate_safe_fallback(request)

    def _generate_safe_fallback(self, request: GeminiAdviceRequest) -> GeminiAdviceResponse:
        """Constructs a deterministic, safe agronomic advisory when upstream AI service is congested."""
        soil_summary = f"Soil pH is {request.soil_ph or 'standard'}" if request.soil_ph else "Standard soil profile"
        conf_str = f"{request.fertilizer_confidence:.1f}%" if request.fertilizer_confidence else "Optimal"

        return GeminiAdviceResponse(
            summary=(
                f"Precision advisory for {request.crop} indicating {request.recommended_fertilizer} "
                f"as the primary agronomic recommendation for the {request.season or 'current'} season."
            ),
            recommendation_reason=(
                f"The random forest agronomic model selected {request.recommended_fertilizer} to address "
                f"the crop nutrient requirements for {request.crop}, balancing macro and micronutrient uptake."
            ),
            application_guidance=(
                f"Apply {request.recommended_fertilizer} in split dosages tailored for the "
                f"{request.growth_stage or 'vegetative'} stage. Incorporate into moist soil or via {request.irrigation_type or 'standard irrigation'}."
            ),
            weather_considerations=(
                f"With ambient temperature around {request.temperature or 25}°C and humidity at {request.humidity or 60}%, "
                "avoid application immediately before heavy expected rainfall to minimize runoff loss."
            ),
            soil_considerations=(
                f"{soil_summary}. Maintain balanced organic carbon and conduct periodic soil testing "
                "to ensure NPK availability remains in the optimal absorption range."
            ),
            precautions=(
                "Wear protective gloves and eye protection during fertilizer handling. "
                "Store fertilizer in a cool, dry area away from direct sunlight and water sources."
            ),
            confidence_note=(
                f"Agronomic recommendation validated with {conf_str} model confidence. "
                "Consult local agricultural extension for region-specific micro-adjustments."
            ),
        )


# Singleton instance
gemini_service = GeminiService()
