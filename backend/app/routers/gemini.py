from fastapi import APIRouter
from app.schemas.gemini import GeminiAdviceRequest, GeminiAdviceResponse
from app.services.gemini_service import gemini_service

router = APIRouter(prefix="/ai", tags=["AI Advisory"])


@router.post(
    "/advice",
    response_model=GeminiAdviceResponse,
    summary="Generate AI Agricultural Advice",
    description="Contextualizes ML crop and fertilizer predictions with practical, safe, and structured agronomic explanations using Google Gemini AI."
)
def get_ai_agricultural_advice(request: GeminiAdviceRequest) -> GeminiAdviceResponse:
    """Generate structured agronomic advisory from farm context and ML prediction output."""
    return gemini_service.generate_agricultural_advice(request)
