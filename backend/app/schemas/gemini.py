from typing import Optional
from pydantic import BaseModel, Field


class GeminiAdviceRequest(BaseModel):
    """Agricultural Context Schema for Gemini AI Advisory."""
    crop: str = Field(..., description="Recommended or target crop name (e.g. Rice, Wheat)")
    crop_confidence: Optional[float] = Field(None, description="ML crop prediction confidence percentage (0-100%)")
    recommended_fertilizer: str = Field(..., description="ML recommended fertilizer (e.g. NPK, DAP, Urea)")
    fertilizer_confidence: Optional[float] = Field(None, description="ML fertilizer prediction confidence percentage (0-100%)")
    
    # Soil & Environmental Parameters
    soil_type: Optional[str] = Field(None, description="Soil classification (e.g. Clay, Sandy, Loamy)")
    soil_ph: Optional[float] = Field(None, description="Soil pH level (0-14)")
    nitrogen: Optional[float] = Field(None, description="Soil Nitrogen level (N) in kg/ha or mg/kg")
    phosphorus: Optional[float] = Field(None, description="Soil Phosphorus level (P) in kg/ha or mg/kg")
    potassium: Optional[float] = Field(None, description="Soil Potassium level (K) in kg/ha or mg/kg")
    temperature: Optional[float] = Field(None, description="Temperature in Celsius")
    humidity: Optional[float] = Field(None, description="Relative humidity percentage")
    rainfall: Optional[float] = Field(None, description="Rainfall / precipitation in mm")
    
    # Farm & Agronomic Context
    location: Optional[str] = Field(None, description="Farm geographic location / region")
    growth_stage: Optional[str] = Field(None, description="Current crop growth stage (e.g. Sowing, Vegetative, Flowering)")
    season: Optional[str] = Field(None, description="Current cropping season (e.g. Kharif, Rabi, Zaid)")
    irrigation_type: Optional[str] = Field(None, description="Irrigation method (e.g. Drip, Sprinkler, Flood)")
    previous_crop: Optional[str] = Field(None, description="Preceding crop in the field")
    previous_fertilizer: Optional[str] = Field(None, description="Fertilizer applied in previous season")
    previous_yield: Optional[float] = Field(None, description="Previous season yield in kg/hectare")
    language: Optional[str] = Field("en", description="Preferred advisory language code ('en', 'hi', 'gu')")


class GeminiAdviceResponse(BaseModel):
    """Structured AI Explanation & Advisory Response Schema."""
    summary: str = Field(..., description="High-level agronomic executive summary")
    recommendation_reason: str = Field(..., description="Scientific rationale for the recommended crop and fertilizer")
    application_guidance: str = Field(..., description="Actionable dosage, timing, and application method guidance")
    weather_considerations: str = Field(..., description="Impact of current/forecasted weather on nutrient uptake")
    soil_considerations: str = Field(..., description="Soil health, pH balance, and NPK status evaluation")
    precautions: str = Field(..., description="Safety measures, environmental cautions, and potential risks")
    confidence_note: str = Field(..., description="Evaluation of ML confidence score and data completeness")
