from typing import Optional, Dict, Any
from pydantic import BaseModel, Field
from app.schemas.predict import CombinedPredictionRequest, CombinedPredictionResponse


class RecommendationRequest(CombinedPredictionRequest):
    """Input payload for unified AGRISENSE recommendation pipeline."""
    location: Optional[str] = Field(None, description="Farm geographical location for live OpenWeather lookup (e.g. Gandhinagar, Rajkot)")
    language: Optional[str] = Field("en", description="Preferred language for AI advisory explanations ('en', 'hi', 'gu')")

    model_config = {
        "json_schema_extra": {
            "example": {
                "N": 90.0,
                "P": 42.0,
                "K": 43.0,
                "temperature": 22.0,
                "humidity": 70.0,
                "ph": 6.5,
                "rainfall": 180.0,
                "Soil_Type": "Clay",
                "Soil_pH": 6.5,
                "Soil_Moisture": 35.0,
                "Organic_Carbon": 0.8,
                "Electrical_Conductivity": 1.5,
                "Nitrogen_Level": 90.0,
                "Phosphorus_Level": 42.0,
                "Potassium_Level": 43.0,
                "Temperature": 22.0,
                "Humidity": 70.0,
                "Rainfall": 180.0,
                "Crop_Type": "Wheat",
                "Crop_Growth_Stage": "Vegetative",
                "Season": "Rabi",
                "Irrigation_Type": "Drip",
                "Previous_Crop": "Rice",
                "Region": "North",
                "Fertilizer_Used_Last_Season": 100.0,
                "Yield_Last_Season": 2500.0,
                "location": "Gandhinagar",
                "language": "en"
            }
        }
    }


class UnifiedWeatherInfo(BaseModel):
    """Weather data status and metrics in unified recommendation."""
    status: str = Field(..., description="Weather status: 'available', 'unavailable', or 'not_requested'")
    message: Optional[str] = Field(None, description="Diagnostic message if weather was unavailable")
    location: Optional[str] = Field(None, description="Resolved city name")
    country: Optional[str] = Field(None, description="Country code (e.g. IN)")
    latitude: Optional[float] = Field(None, description="Latitude coordinate")
    longitude: Optional[float] = Field(None, description="Longitude coordinate")
    temperature: Optional[float] = Field(None, description="Current ambient temperature in °C")
    feels_like: Optional[float] = Field(None, description="Perceived temperature in °C")
    humidity: Optional[float] = Field(None, description="Relative humidity percentage")
    pressure: Optional[float] = Field(None, description="Atmospheric pressure in hPa")
    wind_speed: Optional[float] = Field(None, description="Wind speed in m/s")
    weather: Optional[str] = Field(None, description="Primary condition (e.g. Clear, Clouds, Rain)")
    description: Optional[str] = Field(None, description="Detailed condition description")
    cloudiness: Optional[int] = Field(None, description="Cloudiness percentage (0-100%)")
    rainfall: Optional[float] = Field(None, description="Precipitation volume in mm")


class UnifiedAIAdvice(BaseModel):
    """AI agronomic advisory in unified recommendation."""
    status: str = Field(..., description="AI advisory status: 'available' or 'unavailable'")
    message: Optional[str] = Field(None, description="Diagnostic status note")
    summary: str = Field(..., description="Executive agronomic summary")
    recommendation_reason: str = Field(..., description="Scientific rationale for ML prediction")
    application_guidance: str = Field(..., description="Dosage and application timing guidance")
    weather_considerations: str = Field(..., description="Weather impact on nutrient absorption")
    soil_considerations: str = Field(..., description="Soil health and NPK balance")
    precautions: str = Field(..., description="Safety and environmental precautions")
    confidence_note: str = Field(..., description="Model confidence note and recommendations")


class UnifiedRecommendationResponse(BaseModel):
    """Complete unified AGRISENSE recommendation response."""
    prediction: CombinedPredictionResponse = Field(..., description="Primary ML crop and fertilizer predictions")
    weather: UnifiedWeatherInfo = Field(..., description="Real-time meteorological context")
    ai_advice: UnifiedAIAdvice = Field(..., description="Gemini AI agronomic explanation and guidance")
