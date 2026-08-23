import os
import logging
from pathlib import Path
from typing import Dict, Any, Optional
import joblib
import pandas as pd

from app.schemas.fertilizer import FertilizerPredictionRequest, FertilizerPredictionResponse

logger = logging.getLogger(__name__)

# Complete list of feature columns expected by the trained fertilizer pipeline
FERTILIZER_FEATURE_NAMES = [
    "Soil_Type",
    "Soil_pH",
    "Soil_Moisture",
    "Organic_Carbon",
    "Electrical_Conductivity",
    "Nitrogen_Level",
    "Phosphorus_Level",
    "Potassium_Level",
    "Temperature",
    "Humidity",
    "Rainfall",
    "Crop_Type",
    "Crop_Growth_Stage",
    "Season",
    "Irrigation_Type",
    "Previous_Crop",
    "Region",
    "Fertilizer_Used_Last_Season",
    "Yield_Last_Season",
]


class FertilizerModelService:
    """Service for loading the trained fertilizer recommendation model and running predictions."""

    def __init__(self, model_path: Optional[str] = None):
        self.model_path = model_path or self._default_model_path()
        self._model = None

    def _default_model_path(self) -> str:
        env_path = os.getenv("FERTILIZER_MODEL_PATH")
        if env_path:
            return env_path
        # backend root is 2 levels up from app/services/
        backend_dir = Path(__file__).resolve().parent.parent.parent
        return str(backend_dir / "models" / "fertilizer_model.joblib")

    @property
    def model(self):
        """Lazy load and cache the model instance."""
        if self._model is None:
            self.load_model()
        return self._model

    def load_model(self):
        """Loads the trained joblib model once into memory."""
        if not os.path.exists(self.model_path):
            error_msg = f"Fertilizer model file not found at: {self.model_path}"
            logger.error(error_msg)
            raise FileNotFoundError(error_msg)

        logger.info(f"Loading fertilizer recommendation model from: {self.model_path}")
        try:
            self._model = joblib.load(self.model_path)
            logger.info("Fertilizer recommendation model loaded successfully.")
        except Exception as e:
            logger.error(f"Failed to load fertilizer model from {self.model_path}: {e}")
            raise

    def predict(self, request_data: FertilizerPredictionRequest) -> FertilizerPredictionResponse:
        """
        Executes prediction on the input soil, environmental, and farming parameters.
        
        Args:
            request_data: Validated FertilizerPredictionRequest payload
            
        Returns:
            FertilizerPredictionResponse with recommended fertilizer, confidence, and probabilities.
        """
        input_dict = {
            "Soil_Type": request_data.Soil_Type,
            "Soil_pH": request_data.Soil_pH,
            "Soil_Moisture": request_data.Soil_Moisture,
            "Organic_Carbon": request_data.Organic_Carbon,
            "Electrical_Conductivity": request_data.Electrical_Conductivity,
            "Nitrogen_Level": request_data.Nitrogen_Level,
            "Phosphorus_Level": request_data.Phosphorus_Level,
            "Potassium_Level": request_data.Potassium_Level,
            "Temperature": request_data.Temperature,
            "Humidity": request_data.Humidity,
            "Rainfall": request_data.Rainfall,
            "Crop_Type": request_data.Crop_Type,
            "Crop_Growth_Stage": request_data.Crop_Growth_Stage,
            "Season": request_data.Season,
            "Irrigation_Type": request_data.Irrigation_Type,
            "Previous_Crop": request_data.Previous_Crop,
            "Region": request_data.Region,
            "Fertilizer_Used_Last_Season": request_data.Fertilizer_Used_Last_Season,
            "Yield_Last_Season": request_data.Yield_Last_Season,
        }
        input_df = pd.DataFrame([input_dict], columns=FERTILIZER_FEATURE_NAMES)

        model = self.model
        prediction = model.predict(input_df)[0]
        recommended_fertilizer = str(prediction)

        # Calculate prediction probabilities if supported
        if hasattr(model, "predict_proba"):
            probabilities = model.predict_proba(input_df)[0]
            classes = getattr(model, "classes_", [])
            
            top_prob = float(max(probabilities))
            fertilizer_confidence = round(top_prob * 100, 2)

            fertilizer_probabilities: Dict[str, float] = {
                str(cls_name): round(float(prob) * 100, 2)
                for cls_name, prob in zip(classes, probabilities)
            }
        else:
            fertilizer_confidence = 100.0
            fertilizer_probabilities = {recommended_fertilizer: 100.0}

        return FertilizerPredictionResponse(
            recommended_fertilizer=recommended_fertilizer,
            fertilizer_confidence=fertilizer_confidence,
            fertilizer_probabilities=fertilizer_probabilities,
        )


# Global singleton instance
fertilizer_model_service = FertilizerModelService()
