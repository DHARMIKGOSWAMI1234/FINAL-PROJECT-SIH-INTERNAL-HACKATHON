from fastapi import APIRouter, HTTPException, status
from app.schemas.fertilizer import FertilizerPredictionRequest, FertilizerPredictionResponse
from app.services.fertilizer_model import fertilizer_model_service

router = APIRouter(tags=["Fertilizer Recommendation"])


@router.post(
    "/predict/fertilizer",
    response_model=FertilizerPredictionResponse,
    summary="Predict recommended fertilizer",
    description="Accepts 12 numerical and 7 categorical soil, crop, and farm management parameters and returns the ML model's recommended fertilizer along with confidence score and class probabilities across all 7 fertilizer classes.",
)
def predict_fertilizer(payload: FertilizerPredictionRequest) -> FertilizerPredictionResponse:
    try:
        return fertilizer_model_service.predict(payload)
    except FileNotFoundError as fnf:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Model asset missing: {str(fnf)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Prediction error: {str(e)}"
        )
