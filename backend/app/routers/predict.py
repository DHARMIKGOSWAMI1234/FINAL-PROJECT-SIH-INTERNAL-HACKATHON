from fastapi import APIRouter, HTTPException, status
from app.schemas.crop import CropPredictionRequest
from app.schemas.fertilizer import FertilizerPredictionRequest
from app.schemas.predict import CombinedPredictionRequest, CombinedPredictionResponse
from app.services.crop_model import crop_model_service
from app.services.fertilizer_model import fertilizer_model_service

router = APIRouter(tags=["Combined Recommendation"])


@router.post(
    "/predict",
    response_model=CombinedPredictionResponse,
    summary="Predict recommended crop and fertilizer",
    description="Unified endpoint accepting soil, environmental, and farming parameters to return simultaneous predictions for both crop and fertilizer along with confidence scores and probability distributions.",
)
def predict_combined(payload: CombinedPredictionRequest) -> CombinedPredictionResponse:
    try:
        # Build CropPredictionRequest (using explicit overrides or matching fertilizer field values)
        crop_request = CropPredictionRequest(
            N=payload.N if payload.N is not None else payload.Nitrogen_Level,
            P=payload.P if payload.P is not None else payload.Phosphorus_Level,
            K=payload.K if payload.K is not None else payload.Potassium_Level,
            temperature=payload.temperature if payload.temperature is not None else payload.Temperature,
            humidity=payload.humidity if payload.humidity is not None else payload.Humidity,
            ph=payload.ph if payload.ph is not None else payload.Soil_pH,
            rainfall=payload.rainfall if payload.rainfall is not None else payload.Rainfall,
        )
        crop_result = crop_model_service.predict(crop_request)

        # Build FertilizerPredictionRequest
        fertilizer_request = FertilizerPredictionRequest(
            Soil_Type=payload.Soil_Type,
            Soil_pH=payload.Soil_pH,
            Soil_Moisture=payload.Soil_Moisture,
            Organic_Carbon=payload.Organic_Carbon,
            Electrical_Conductivity=payload.Electrical_Conductivity,
            Nitrogen_Level=payload.Nitrogen_Level,
            Phosphorus_Level=payload.Phosphorus_Level,
            Potassium_Level=payload.Potassium_Level,
            Temperature=payload.Temperature,
            Humidity=payload.Humidity,
            Rainfall=payload.Rainfall,
            Crop_Type=payload.Crop_Type,
            Crop_Growth_Stage=payload.Crop_Growth_Stage,
            Season=payload.Season,
            Irrigation_Type=payload.Irrigation_Type,
            Previous_Crop=payload.Previous_Crop,
            Region=payload.Region,
            Fertilizer_Used_Last_Season=payload.Fertilizer_Used_Last_Season,
            Yield_Last_Season=payload.Yield_Last_Season,
        )
        fertilizer_result = fertilizer_model_service.predict(fertilizer_request)

        return CombinedPredictionResponse(
            recommended_crop=crop_result.recommended_crop,
            crop_confidence=crop_result.crop_confidence,
            crop_probabilities=crop_result.crop_probabilities,
            recommended_fertilizer=fertilizer_result.recommended_fertilizer,
            fertilizer_confidence=fertilizer_result.fertilizer_confidence,
            fertilizer_probabilities=fertilizer_result.fertilizer_probabilities,
        )

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
