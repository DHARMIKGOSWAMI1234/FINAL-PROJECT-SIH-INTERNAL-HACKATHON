import os
import logging
from pathlib import Path
from typing import Dict, Any, Optional
import joblib
import pandas as pd

from app.schemas.crop import CropPredictionRequest, CropPredictionResponse

logger = logging.getLogger(__name__)

# Ordered list of features expected by the trained pipeline
FEATURE_NAMES = ["N", "P", "K", "temperature", "humidity", "ph", "rainfall"]


class CropModelService:
    """Service for loading the trained crop recommendation model and running predictions."""

    def __init__(self, model_path: Optional[str] = None):
        self.model_path = model_path or self._default_model_path()
        self._model = None

    def _default_model_path(self) -> str:
        env_path = os.getenv("CROP_MODEL_PATH")
        if env_path:
            return env_path
        # backend root is 2 levels up from app/services/
        backend_dir = Path(__file__).resolve().parent.parent.parent
        return str(backend_dir / "models" / "crop_model.joblib")

    @property
    def model(self):
        """Lazy load and cache the model instance."""
        if self._model is None:
            self.load_model()
        return self._model

    def load_model(self):
        """Loads the trained joblib model once into memory."""
        if not os.path.exists(self.model_path):
            error_msg = f"Crop model file not found at: {self.model_path}"
            logger.error(error_msg)
            raise FileNotFoundError(error_msg)

        logger.info(f"Loading crop recommendation model from: {self.model_path}")
        try:
            self._model = joblib.load(self.model_path)
            logger.info("Crop recommendation model loaded successfully.")
        except Exception as e:
            logger.error(f"Failed to load crop model from {self.model_path}: {e}")
            raise

    def predict(self, request_data: CropPredictionRequest) -> CropPredictionResponse:
        """
        Executes prediction on the input soil and environmental parameters.
        
        Args:
            request_data: Validated CropPredictionRequest payload
            
        Returns:
            CropPredictionResponse with recommended crop, confidence, and probabilities.
        """
        # Ensure DataFrame has exact expected column names and order
        input_dict = {
            "N": request_data.N,
            "P": request_data.P,
            "K": request_data.K,
            "temperature": request_data.temperature,
            "humidity": request_data.humidity,
            "ph": request_data.ph,
            "rainfall": request_data.rainfall,
        }
        input_df = pd.DataFrame([input_dict], columns=FEATURE_NAMES)

        model = self.model
        prediction = model.predict(input_df)[0]
        recommended_crop = str(prediction)

        # Calculate prediction probabilities if supported
        if hasattr(model, "predict_proba"):
            probabilities = model.predict_proba(input_df)[0]
            classes = getattr(model, "classes_", [])
            
            top_prob = float(max(probabilities))
            crop_confidence = round(top_prob * 100, 2)

            crop_probabilities: Dict[str, float] = {
                str(cls_name): round(float(prob) * 100, 2)
                for cls_name, prob in zip(classes, probabilities)
            }
        else:
            crop_confidence = 100.0
            crop_probabilities = {recommended_crop: 100.0}

        return CropPredictionResponse(
            recommended_crop=recommended_crop,
            crop_confidence=crop_confidence,
            crop_probabilities=crop_probabilities,
        )


# Global singleton instance
crop_model_service = CropModelService()
