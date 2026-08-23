from fastapi import APIRouter, HTTPException, status
from app.schemas.crop import CropPredictionRequest, CropPredictionResponse
from app.services.crop_model import crop_model_service

router = APIRouter(tags=["Crop Recommendation"])


@router.post(
    "/predict/crop",
    response_model=CropPredictionResponse,
    summary="Predict recommended crop",
    description="Accepts soil and climate metrics (N, P, K, temperature, humidity, pH, rainfall) and returns the ML model's recommended crop along with confidence score and class probabilities.",
)
def predict_crop(payload: CropPredictionRequest) -> CropPredictionResponse:
    try:
        return crop_model_service.predict(payload)
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
