from app.routers.crop import router as crop_router
from app.routers.fertilizer import router as fertilizer_router
from app.routers.predict import router as predict_router

__all__ = ["crop_router", "fertilizer_router", "predict_router"]
