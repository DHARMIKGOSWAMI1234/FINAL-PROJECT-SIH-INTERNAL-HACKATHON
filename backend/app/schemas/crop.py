from typing import Dict
from pydantic import BaseModel, Field


class CropPredictionRequest(BaseModel):
    """Input payload for crop recommendation model."""
    N: float = Field(..., description="Nitrogen content in soil (ratio / ppm)")
    P: float = Field(..., description="Phosphorus content in soil (ratio / ppm)")
    K: float = Field(..., description="Potassium content in soil (ratio / ppm)")
    temperature: float = Field(..., description="Temperature in degree Celsius")
    humidity: float = Field(..., description="Relative humidity in percentage")
    ph: float = Field(..., description="Soil pH value (0-14)")
    rainfall: float = Field(..., description="Rainfall in mm")

    model_config = {
        "json_schema_extra": {
            "example": {
                "N": 90,
                "P": 42,
                "K": 43,
                "temperature": 20.0,
                "humidity": 82.0,
                "ph": 6.5,
                "rainfall": 200.0
            }
        }
    }


class CropPredictionResponse(BaseModel):
    """Output response for crop recommendation prediction."""
    recommended_crop: str = Field(..., description="Name of the recommended crop")
    crop_confidence: float = Field(..., description="Confidence score for the predicted crop (percentage)")
    crop_probabilities: Dict[str, float] = Field(..., description="Probability distribution across all 22 crop classes (percentages)")
