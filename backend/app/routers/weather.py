from fastapi import APIRouter, Query
from app.schemas.weather import WeatherResponse
from app.services.weather_service import weather_service

router = APIRouter(prefix="", tags=["Weather"])


@router.get(
    "/weather",
    response_model=WeatherResponse,
    summary="Get Current Weather Data",
    description="Retrieves clean, real-time meteorological metrics for agricultural advisory via OpenWeather API."
)
async def get_current_weather(
    location: str = Query(
        ...,
        min_length=1,
        description="Target location or city name (e.g. Gandhinagar, Ahmedabad, Rajkot)"
    )
) -> WeatherResponse:
    """Fetch structured meteorological metrics for a given location."""
    return await weather_service.get_weather_by_location(location=location)
