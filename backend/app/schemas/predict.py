from typing import Dict, Optional
from pydantic import BaseModel, Field


class CombinedPredictionRequest(BaseModel):
    """Input payload for combined crop and fertilizer recommendation prediction."""
    # Fertilizer Numerical Features
    Soil_pH: float = Field(..., description="Soil pH value (0-14)")
    Soil_Moisture: float = Field(..., description="Soil moisture level percentage")
    Organic_Carbon: float = Field(..., description="Organic carbon content percentage")
    Electrical_Conductivity: float = Field(..., description="Electrical conductivity in dS/m")
    Nitrogen_Level: float = Field(..., description="Nitrogen level in soil (ppm or kg/ha)")
    Phosphorus_Level: float = Field(..., description="Phosphorus level in soil (ppm or kg/ha)")
    Potassium_Level: float = Field(..., description="Potassium level in soil (ppm or kg/ha)")
    Temperature: float = Field(..., description="Ambient temperature in degree Celsius")
    Humidity: float = Field(..., description="Relative humidity percentage")
    Rainfall: float = Field(..., description="Annual or seasonal rainfall in mm")
    Fertilizer_Used_Last_Season: float = Field(..., description="Amount of fertilizer used in previous season (kg/ha)")
    Yield_Last_Season: float = Field(..., description="Crop yield obtained in previous season (tonnes/ha or kg/ha)")

    # Fertilizer Categorical Features
    Soil_Type: str = Field(..., description="Type of soil (e.g. Clay, Sandy, Loamy, Silt)")
    Crop_Type: str = Field(..., description="Target crop (e.g. Wheat, Rice, Cotton, Maize, Potato, Tomato, Sugarcane)")
    Crop_Growth_Stage: str = Field(..., description="Growth stage (e.g. Sowing, Vegetative, Flowering, Harvest)")
    Season: str = Field(..., description="Agricultural season (e.g. Kharif, Rabi, Zaid)")
    Irrigation_Type: str = Field(..., description="Irrigation method (e.g. Drip, Sprinkler, Canal, Rainfed)")
    Previous_Crop: str = Field(..., description="Previous crop harvested (e.g. Rice, Wheat, Cotton, Maize, Potato, Tomato, Sugarcane)")
    Region: str = Field(..., description="Geographical region (e.g. North, South, East, West, Central)")

    # Optional explicit Crop model feature overrides (if omitted, mapped directly from the corresponding fertilizer features)
    N: Optional[float] = Field(None, description="Nitrogen content for crop model (defaults to Nitrogen_Level)")
    P: Optional[float] = Field(None, description="Phosphorus content for crop model (defaults to Phosphorus_Level)")
    K: Optional[float] = Field(None, description="Potassium content for crop model (defaults to Potassium_Level)")
    temperature: Optional[float] = Field(None, description="Temperature for crop model in °C (defaults to Temperature)")
    humidity: Optional[float] = Field(None, description="Humidity for crop model in % (defaults to Humidity)")
    ph: Optional[float] = Field(None, description="Soil pH for crop model (defaults to Soil_pH)")
    rainfall: Optional[float] = Field(None, description="Rainfall for crop model in mm (defaults to Rainfall)")

    model_config = {
        "json_schema_extra": {
            "example": {
                "N": 90.0,
                "P": 42.0,
                "K": 43.0,
                "temperature": 20.0,
                "humidity": 82.0,
                "ph": 6.5,
                "rainfall": 200.0,
                "Soil_Type": "Clay",
                "Soil_pH": 6.5,
                "Soil_Moisture": 35.0,
                "Organic_Carbon": 0.8,
                "Electrical_Conductivity": 1.5,
                "Nitrogen_Level": 60.0,
                "Phosphorus_Level": 45.0,
                "Potassium_Level": 80.0,
                "Temperature": 28.0,
                "Humidity": 70.0,
                "Rainfall": 900.0,
                "Crop_Type": "Wheat",
                "Crop_Growth_Stage": "Vegetative",
                "Season": "Rabi",
                "Irrigation_Type": "Drip",
                "Previous_Crop": "Rice",
                "Region": "North",
                "Fertilizer_Used_Last_Season": 100.0,
                "Yield_Last_Season": 2500.0
            }
        }
    }


class CombinedPredictionResponse(BaseModel):
    """Output response containing recommendations from both ML models."""
    recommended_crop: str = Field(..., description="Name of the recommended crop")
    crop_confidence: float = Field(..., description="Confidence score for the predicted crop (percentage)")
    crop_probabilities: Dict[str, float] = Field(..., description="Probability distribution across all 22 crop classes (percentages)")

    recommended_fertilizer: str = Field(..., description="Name of the recommended fertilizer")
    fertilizer_confidence: float = Field(..., description="Confidence score for the predicted fertilizer (percentage)")
    fertilizer_probabilities: Dict[str, float] = Field(..., description="Probability distribution across all 7 fertilizer classes (percentages)")
