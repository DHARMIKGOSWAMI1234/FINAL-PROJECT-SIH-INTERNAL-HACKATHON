import logging
from typing import Optional
from fastapi import HTTPException

from app.schemas.crop import CropPredictionRequest
from app.schemas.fertilizer import FertilizerPredictionRequest
from app.schemas.predict import CombinedPredictionResponse
from app.schemas.recommendation import (
    RecommendationRequest,
    UnifiedWeatherInfo,
    UnifiedAIAdvice,
    UnifiedRecommendationResponse,
)
from app.schemas.gemini import GeminiAdviceRequest
from app.services.crop_model import crop_model_service
from app.services.fertilizer_model import fertilizer_model_service
from app.services.weather_service import weather_service
from app.services.gemini_service import gemini_service

logger = logging.getLogger(__name__)


class RecommendationService:
    """Orchestrates Crop ML, Fertilizer ML, OpenWeather, and Gemini AI advisory."""

    async def get_unified_recommendation(
        self, req: RecommendationRequest
    ) -> UnifiedRecommendationResponse:
        """Executes full unified pipeline and returns structured recommendation."""

        # 1. Execute Crop ML Prediction
        c_N = req.N if req.N is not None else req.Nitrogen_Level
        c_P = req.P if req.P is not None else req.Phosphorus_Level
        c_K = req.K if req.K is not None else req.Potassium_Level
        c_temp = req.temperature if req.temperature is not None else req.Temperature
        c_hum = req.humidity if req.humidity is not None else req.Humidity
        c_ph = req.ph if req.ph is not None else req.Soil_pH
        c_rain = req.rainfall if req.rainfall is not None else req.Rainfall

        crop_req = CropPredictionRequest(
            N=c_N,
            P=c_P,
            K=c_K,
            temperature=c_temp,
            humidity=c_hum,
            ph=c_ph,
            rainfall=c_rain,
        )
        crop_res = crop_model_service.predict(crop_req)

        # 2. Execute Fertilizer ML Prediction
        fert_req = FertilizerPredictionRequest(
            Soil_Type=req.Soil_Type,
            Soil_pH=req.Soil_pH,
            Soil_Moisture=req.Soil_Moisture,
            Organic_Carbon=req.Organic_Carbon,
            Electrical_Conductivity=req.Electrical_Conductivity,
            Nitrogen_Level=req.Nitrogen_Level,
            Phosphorus_Level=req.Phosphorus_Level,
            Potassium_Level=req.Potassium_Level,
            Temperature=req.Temperature,
            Humidity=req.Humidity,
            Rainfall=req.Rainfall,
            Crop_Type=req.Crop_Type,
            Crop_Growth_Stage=req.Crop_Growth_Stage,
            Season=req.Season,
            Irrigation_Type=req.Irrigation_Type,
            Previous_Crop=req.Previous_Crop,
            Region=req.Region,
            Fertilizer_Used_Last_Season=req.Fertilizer_Used_Last_Season,
            Yield_Last_Season=req.Yield_Last_Season,
        )

        fert_res = fertilizer_model_service.predict(fert_req)

        # Build CombinedPredictionResponse (matches exactly POST /predict output)
        prediction_output = CombinedPredictionResponse(
            recommended_crop=crop_res.recommended_crop,
            crop_confidence=crop_res.crop_confidence,
            crop_probabilities=crop_res.crop_probabilities,
            recommended_fertilizer=fert_res.recommended_fertilizer,
            fertilizer_confidence=fert_res.fertilizer_confidence,
            fertilizer_probabilities=fert_res.fertilizer_probabilities,
        )

        # 3. Retrieve Live OpenWeather (with graceful fault-tolerance)
        weather_output: UnifiedWeatherInfo
        if req.location and req.location.strip():
            try:
                live_weather = await weather_service.get_weather_by_location(
                    req.location.strip()
                )
                weather_output = UnifiedWeatherInfo(
                    status="available",
                    location=live_weather.location,
                    country=live_weather.country,
                    latitude=live_weather.latitude,
                    longitude=live_weather.longitude,
                    temperature=live_weather.temperature,
                    feels_like=live_weather.feels_like,
                    humidity=live_weather.humidity,
                    pressure=live_weather.pressure,
                    wind_speed=live_weather.wind_speed,
                    weather=live_weather.weather,
                    description=live_weather.description,
                    cloudiness=live_weather.cloudiness,
                    rainfall=live_weather.rainfall,
                )
            except HTTPException as exc:
                logger.warning(
                    f"Weather retrieval for '{req.location}' returned HTTP {exc.status_code}: {exc.detail}"
                )
                weather_output = UnifiedWeatherInfo(
                    status="unavailable",
                    message=f"Live weather data temporarily unavailable ({exc.detail})",
                )
            except Exception as exc:
                logger.warning(f"Weather lookup error: {exc}")
                weather_output = UnifiedWeatherInfo(
                    status="unavailable",
                    message="Live weather service temporarily unavailable",
                )
        else:
            weather_output = UnifiedWeatherInfo(
                status="not_requested",
                message="No location provided for live weather lookup",
            )

        # 4. Generate Gemini AI Agricultural Advisory
        ai_advice_output: UnifiedAIAdvice
        try:
            advice_req = GeminiAdviceRequest(
                crop=crop_res.recommended_crop,
                crop_confidence=crop_res.crop_confidence,
                recommended_fertilizer=fert_res.recommended_fertilizer,
                fertilizer_confidence=fert_res.fertilizer_confidence,
                soil_type=req.Soil_Type,
                soil_ph=req.Soil_pH,
                nitrogen=req.Nitrogen_Level,
                phosphorus=req.Phosphorus_Level,
                potassium=req.Potassium_Level,
                temperature=weather_output.temperature if weather_output.temperature is not None else req.Temperature,
                humidity=weather_output.humidity if weather_output.humidity is not None else req.Humidity,
                rainfall=weather_output.rainfall if weather_output.rainfall is not None else req.Rainfall,
                location=req.location,
                growth_stage=req.Crop_Growth_Stage,
                season=req.Season,
                irrigation_type=req.Irrigation_Type,
                previous_crop=req.Previous_Crop,
                previous_fertilizer=str(req.Fertilizer_Used_Last_Season),
                previous_yield=req.Yield_Last_Season,
                language=req.language or "en",
            )

            raw_advice = gemini_service.generate_agricultural_advice(advice_req)
            ai_advice_output = UnifiedAIAdvice(
                status="available",
                summary=raw_advice.summary,
                recommendation_reason=raw_advice.recommendation_reason,
                application_guidance=raw_advice.application_guidance,
                weather_considerations=raw_advice.weather_considerations,
                soil_considerations=raw_advice.soil_considerations,
                precautions=raw_advice.precautions,
                confidence_note=raw_advice.confidence_note,
            )
        except Exception as exc:
            logger.warning(f"Gemini advisory generation error: {exc}")
            ai_advice_output = UnifiedAIAdvice(
                status="unavailable",
                message="AI advisory service temporarily unavailable",
                summary=f"Recommended {crop_res.recommended_crop} with {fert_res.recommended_fertilizer}.",
                recommendation_reason=f"Model selected {crop_res.recommended_crop} ({crop_res.crop_confidence:.1f}%) and {fert_res.recommended_fertilizer} ({fert_res.fertilizer_confidence:.1f}%).",
                application_guidance=f"Apply {fert_res.recommended_fertilizer} according to standard agronomic dosages for {req.Crop_Growth_Stage}.",
                weather_considerations="Check ambient weather and rainfall forecasts prior to fertilizer application.",
                soil_considerations=f"Soil type {req.Soil_Type} (pH {req.Soil_pH}) should be monitored for balanced nutrient availability.",
                precautions="Follow standard protective equipment and fertilizer label instructions.",
                confidence_note=f"Recommendation generated with {crop_res.crop_confidence:.1f}% crop and {fert_res.fertilizer_confidence:.1f}% fertilizer confidence.",
            )

        return UnifiedRecommendationResponse(
            prediction=prediction_output,
            weather=weather_output,
            ai_advice=ai_advice_output,
        )


# Singleton instance
recommendation_service = RecommendationService()
