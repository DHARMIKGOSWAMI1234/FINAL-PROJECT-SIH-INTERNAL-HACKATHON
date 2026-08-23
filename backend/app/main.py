import os
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from app.routers.crop import router as crop_router
from app.routers.fertilizer import router as fertilizer_router
from app.routers.predict import router as predict_router
from app.routers.weather import router as weather_router
from app.routers.gemini import router as gemini_router
from app.routers.recommendation import router as recommendation_router
from app.services.crop_model import crop_model_service
from app.services.fertilizer_model import fertilizer_model_service

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Suppress verbose HTTP client logging to protect secret parameters in outgoing calls
logging.getLogger("httpx").setLevel(logging.WARNING)
logging.getLogger("httpcore").setLevel(logging.WARNING)

# Load environment variables from .env file if present
load_dotenv()


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: preload ML models once on server start
    logger.info("Initializing ML models...")
    try:
        crop_model_service.load_model()
        logger.info("Crop recommendation model preloaded successfully.")
    except Exception as e:
        logger.warning(f"Could not preload crop model at startup: {e}")

    try:
        fertilizer_model_service.load_model()
        logger.info("Fertilizer recommendation model preloaded successfully.")
    except Exception as e:
        logger.warning(f"Could not preload fertilizer model at startup: {e}")

    yield
    # Shutdown logic if any


app = FastAPI(
    title="AGRISENSE Backend",
    description="Backend API service for AGRISENSE — Precision AI Agriculture & Crop-Soil Advisory Engine",
    version="1.0.0",
    lifespan=lifespan,
)

# Configure CORS origins (supports merged LOCAL_DEV_ORIGINS, CORS_ORIGINS, and FRONTEND_ORIGIN)
LOCAL_DEV_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

env_origins = []
cors_origins_env = os.getenv("CORS_ORIGINS", "")
if cors_origins_env:
    env_origins.extend(
        origin.strip()
        for origin in cors_origins_env.split(",")
        if origin.strip()
    )

frontend_origin_env = os.getenv("FRONTEND_ORIGIN", "")
if frontend_origin_env:
    env_origins.extend(
        origin.strip()
        for origin in frontend_origin_env.split(",")
        if origin.strip()
    )

origins = list(dict.fromkeys(LOCAL_DEV_ORIGINS + env_origins))

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Accept", "Content-Type", "Authorization", "*"],
)

# Register API Routers
app.include_router(crop_router)
app.include_router(fertilizer_router)
app.include_router(predict_router)
app.include_router(weather_router)
app.include_router(gemini_router)
app.include_router(recommendation_router)


@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "service": "AGRISENSE backend"
    }
