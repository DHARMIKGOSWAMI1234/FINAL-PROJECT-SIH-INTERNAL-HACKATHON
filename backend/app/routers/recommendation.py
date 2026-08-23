from fastapi import APIRouter
from app.schemas.recommendation import (
    RecommendationRequest,
    UnifiedRecommendationResponse,
)
from app.services.recommendation_service import recommendation_service

router = APIRouter(prefix="", tags=["Unified Recommendation"])


@router.post(
    "/recommendation",
    response_model=UnifiedRecommendationResponse,
    summary="Unified AGRISENSE Recommendation Pipeline",
    description="Orchestrates Crop ML prediction, Fertilizer ML prediction, live OpenWeather meteorological context, and Google Gemini AI agricultural advisory in one atomic call."
)
async def get_unified_recommendation(
    request: RecommendationRequest,
) -> UnifiedRecommendationResponse:
    """Generate comprehensive precision agricultural recommendation combining ML, weather, and AI explanations."""
    return await recommendation_service.get_unified_recommendation(request)
