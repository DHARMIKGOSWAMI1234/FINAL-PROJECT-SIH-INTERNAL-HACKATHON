import os
import logging
from pathlib import Path
from typing import Optional, Dict, Any
import httpx
from dotenv import load_dotenv
from fastapi import HTTPException

from app.schemas.weather import WeatherResponse

logger = logging.getLogger(__name__)
logging.getLogger("httpx").setLevel(logging.WARNING)
logging.getLogger("httpcore").setLevel(logging.WARNING)

# Ensure backend/.env is properly discovered and loaded
BACKEND_DIR = Path(__file__).resolve().parent.parent.parent
load_dotenv(BACKEND_DIR / ".env")

OPENWEATHER_BASE_URL = "https://api.openweathermap.org/data/2.5/weather"


class WeatherService:
    """Service to interact with OpenWeather Current Weather Data API."""

    def __init__(self):
        self.client_timeout = 10.0

    def _get_api_key(self) -> str:
        """Retrieves and validates OpenWeather API key from environment."""
        # Refresh from environment/dotenv
        load_dotenv(BACKEND_DIR / ".env")
        api_key = os.getenv("WEATHER_API_KEY", "").strip().strip("'\"")
        if not api_key or api_key == "MY_REAL_KEY" or api_key == "your_openweather_api_key_here":
            logger.error("WEATHER_API_KEY is not configured or is a placeholder.")
            raise HTTPException(
                status_code=503,
                detail="Weather service is currently unavailable (API key not configured)."
            )
        return api_key

    async def get_weather_by_location(self, location: str) -> WeatherResponse:
        """Fetches current weather for a city name or region string."""
        clean_location = location.strip() if location else ""
        if not clean_location:
            raise HTTPException(
                status_code=400,
                detail="Location query parameter cannot be empty."
            )

        api_key = self._get_api_key()

        params = {
            "q": clean_location,
            "appid": api_key,
            "units": "metric",
        }

        try:
            async with httpx.AsyncClient(timeout=self.client_timeout) as client:
                response = await client.get(OPENWEATHER_BASE_URL, params=params)

            if response.status_code == 200:
                raw_data = response.json()
                return self._parse_weather_payload(raw_data, fallback_name=clean_location)

            elif response.status_code == 404:
                raise HTTPException(
                    status_code=404,
                    detail=f"Location '{clean_location}' was not found by weather service."
                )

            elif response.status_code == 401:
                logger.error("OpenWeather API returned 401 Unauthorized (key may still be propagating).")
                raise HTTPException(
                    status_code=502,
                    detail="Weather service provider authentication failed (API key may still be activating)."
                )

            elif response.status_code == 429:
                logger.warning("OpenWeather API rate limit exceeded.")
                raise HTTPException(
                    status_code=429,
                    detail="Weather service rate limit reached. Please try again shortly."
                )

            else:
                logger.error(f"OpenWeather returned HTTP {response.status_code}: {response.text}")
                raise HTTPException(
                    status_code=502,
                    detail="Weather service provider returned an unexpected error."
                )

        except httpx.TimeoutException:
            logger.error(f"Weather request timed out for location: {clean_location}")
            raise HTTPException(
                status_code=504,
                detail="Weather service request timed out. Please try again."
            )
        except httpx.RequestError as exc:
            logger.error(f"Network error during weather fetch: {exc}")
            raise HTTPException(
                status_code=502,
                detail="Unable to reach weather service provider."
            )
        except HTTPException:
            raise
        except Exception as exc:
            logger.error(f"Unexpected error processing weather data: {exc}")
            raise HTTPException(
                status_code=500,
                detail="Internal error processing weather data."
            )

    async def get_weather_by_coords(self, lat: float, lon: float) -> WeatherResponse:
        """Fetches current weather for geographic coordinates."""
        api_key = self._get_api_key()

        params = {
            "lat": lat,
            "lon": lon,
            "appid": api_key,
            "units": "metric",
        }

        try:
            async with httpx.AsyncClient(timeout=self.client_timeout) as client:
                response = await client.get(OPENWEATHER_BASE_URL, params=params)

            if response.status_code == 200:
                raw_data = response.json()
                return self._parse_weather_payload(raw_data)

            elif response.status_code == 404:
                raise HTTPException(
                    status_code=404,
                    detail=f"Weather data not found for coordinates ({lat}, {lon})."
                )
            elif response.status_code == 401:
                logger.error("OpenWeather API returned 401 Unauthorized.")
                raise HTTPException(
                    status_code=502,
                    detail="Weather service provider authentication failed."
                )
            else:
                raise HTTPException(
                    status_code=502,
                    detail="Weather service provider returned an error."
                )

        except httpx.TimeoutException:
            raise HTTPException(status_code=504, detail="Weather service request timed out.")
        except httpx.RequestError:
            raise HTTPException(status_code=502, detail="Unable to reach weather service.")
        except HTTPException:
            raise
        except Exception:
            raise HTTPException(status_code=500, detail="Internal error processing weather data.")

    def _parse_weather_payload(self, data: Dict[str, Any], fallback_name: str = "") -> WeatherResponse:
        """Transforms OpenWeather raw JSON response into a clean WeatherResponse."""
        main = data.get("main", {})
        coord = data.get("coord", {})
        sys = data.get("sys", {})
        weather_list = data.get("weather", [])
        weather_item = weather_list[0] if weather_list else {}
        wind = data.get("wind", {})
        clouds = data.get("clouds", {})
        rain = data.get("rain", {})

        # Extract rainfall if available in mm
        rainfall: Optional[float] = None
        if isinstance(rain, dict):
            if "1h" in rain:
                rainfall = float(rain["1h"])
            elif "3h" in rain:
                rainfall = float(rain["3h"])

        return WeatherResponse(
            location=data.get("name") or fallback_name or "Unknown",
            country=sys.get("country", ""),
            latitude=float(coord.get("lat", 0.0)),
            longitude=float(coord.get("lon", 0.0)),
            temperature=float(main.get("temp", 0.0)),
            feels_like=float(main.get("feels_like", 0.0)),
            humidity=float(main.get("humidity", 0.0)),
            pressure=float(main.get("pressure", 0.0)),
            wind_speed=float(wind.get("speed", 0.0)),
            weather=weather_item.get("main", "Clear"),
            description=weather_item.get("description", "clear sky"),
            cloudiness=int(clouds.get("all", 0)),
            rainfall=rainfall,
        )


# Singleton instance
weather_service = WeatherService()
