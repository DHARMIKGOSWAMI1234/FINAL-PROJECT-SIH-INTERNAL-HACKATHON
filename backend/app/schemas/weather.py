from typing import Optional
from pydantic import BaseModel, Field


class WeatherResponse(BaseModel):
    """Clean Weather Response Schema for AGRISENSE."""
    location: str = Field(..., description="Resolved location/city name")
    country: str = Field(..., description="Country code (e.g. IN)")
    latitude: float = Field(..., description="Latitude coordinate")
    longitude: float = Field(..., description="Longitude coordinate")
    temperature: float = Field(..., description="Current temperature in Celsius")
    feels_like: float = Field(..., description="Human perceived temperature in Celsius")
    humidity: float = Field(..., description="Relative humidity percentage (0-100%)")
    pressure: float = Field(..., description="Atmospheric pressure in hPa")
    wind_speed: float = Field(..., description="Wind speed in meters/second")
    weather: str = Field(..., description="Primary weather condition (e.g. Clear, Clouds, Rain)")
    description: str = Field(..., description="Detailed weather condition description")
    cloudiness: int = Field(..., description="Cloudiness percentage (0-100%)")
    rainfall: Optional[float] = Field(None, description="Precipitation/Rainfall volume in mm (if available)")
