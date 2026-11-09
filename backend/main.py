from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel, Field
import joblib
import pandas as pd
import os
import logging
from datetime import datetime
from typing import List, Optional
from dotenv import load_dotenv

# Optional SQLAlchemy for PostgreSQL persistence
try:
    from sqlalchemy import create_engine, Column, Integer, Numeric, String, DateTime, desc
    from sqlalchemy.orm import declarative_base, sessionmaker, Session
    SQLALCHEMY_AVAILABLE = True
except ImportError:
    SQLALCHEMY_AVAILABLE = False

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("diamond_predictor")

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(
    title="Diamond Price Predictor API",
    description="API for predicting diamond prices based on their physical and quality characteristics",
    version="1.1.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------------------------------------------
# Model Loading with Candidate Paths
# -------------------------------------------------------------
candidate_model_paths = [
    os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "diamond_price_model.pkl")),
    os.path.abspath(os.path.join(os.path.dirname(__file__), "diamond_price_model.pkl")),
    os.path.abspath("diamond_price_model.pkl"),
    os.path.abspath("/app/diamond_price_model.pkl")
]

model = None
model_loaded_path = None

for path in candidate_model_paths:
    if os.path.exists(path):
        try:
            model = joblib.load(path)
            model_loaded_path = path
            logger.info(f"✅ Model successfully loaded from: {path}")
            break
        except Exception as e:
            logger.warning(f"Found model at {path} but failed to load: {e}")

if model is None:
    logger.warning("⚠️ Model file not loaded at startup. Predictions will raise 503 until model is present.")

# -------------------------------------------------------------
# Database Configuration (PostgreSQL with In-Memory Fallback)
# -------------------------------------------------------------
DATABASE_URL = os.getenv("DATABASE_URL")
db_session_factory = None
db_available = False

# In-memory storage fallback
predictions_history = []

if SQLALCHEMY_AVAILABLE and DATABASE_URL:
    try:
        engine = create_engine(DATABASE_URL, pool_pre_ping=True)
        Base = declarative_base()

        class PredictionRecord(Base):
            __tablename__ = "predictions"

            id = Column(Integer, primary_key=True, index=True)
            carat = Column(Numeric(5, 2), nullable=False)
            depth = Column(Numeric(5, 2), nullable=False)
            table_pct = Column(Numeric(5, 2), nullable=False)
            x = Column(Numeric(5, 2), nullable=False)
            y = Column(Numeric(5, 2), nullable=False)
            z = Column(Numeric(5, 2), nullable=False)
            cut = Column(String(20), nullable=False)
            color = Column(String(1), nullable=False)
            clarity = Column(String(5), nullable=False)
            predicted_price = Column(Numeric(12, 2), nullable=False)
            created_at = Column(DateTime, default=datetime.utcnow)

        Base.metadata.create_all(bind=engine)
        db_session_factory = sessionmaker(autocommit=False, autoflush=False, bind=engine)
        
        # Test connection
        with db_session_factory() as test_session:
            test_session.execute("SELECT 1")
        db_available = True
        logger.info("✅ PostgreSQL database connected successfully.")
    except Exception as e:
        logger.warning(f"⚠️ Could not connect to PostgreSQL: {e}. Falling back to in-memory history.")
        db_available = False
else:
    logger.info("ℹ️ Running with in-memory history (PostgreSQL not configured or SQLAlchemy missing).")

# -------------------------------------------------------------
# Request & Response Schemas
# -------------------------------------------------------------
class DiamondInput(BaseModel):
    carat: float = Field(..., ge=0.1, le=10.0, description="Weight in carats (0.2 - 5.0)")
    depth: float = Field(..., ge=30.0, le=90.0, description="Total depth percentage (40 - 80)")
    table: float = Field(..., ge=30.0, le=100.0, description="Table percentage (40 - 95)")
    x: float = Field(..., ge=0.5, le=20.0, description="Length in mm (3 - 11)")
    y: float = Field(..., ge=0.5, le=20.0, description="Width in mm (3 - 11)")
    z: float = Field(..., ge=0.5, le=20.0, description="Depth in mm (2 - 7)")
    cut: str = Field(..., description="Cut quality (Fair, Good, Very Good, Premium, Ideal)")
    color: str = Field(..., description="Color grade (D - J)")
    clarity: str = Field(..., description="Clarity grade (I1, SI2, SI1, VS2, VS1, VVS2, VVS1, IF)")

class PredictionResponse(BaseModel):
    predicted_price: float
    input_data: DiamondInput
    timestamp: str

class HistoryResponse(BaseModel):
    id: int
    predicted_price: float
    carat: float
    cut: str
    color: str
    clarity: str
    timestamp: str

# -------------------------------------------------------------
# Static Files & Frontend Paths
# -------------------------------------------------------------
candidate_frontend_dirs = [
    os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "frontend")),
    os.path.abspath(os.path.join(os.path.dirname(__file__), "frontend")),
    os.path.abspath("frontend"),
    os.path.abspath("/app/frontend")
]

frontend_dir = None
for f_dir in candidate_frontend_dirs:
    if os.path.isdir(f_dir):
        frontend_dir = f_dir
        break

# Mount frontend directory for static assets (style.css, script.js)
if frontend_dir:
    app.mount("/static", StaticFiles(directory=frontend_dir), name="static")

# -------------------------------------------------------------
# Routes
# -------------------------------------------------------------
@app.get("/")
def read_root(request: Request):
    """Serve frontend index.html if present, else JSON welcome info"""
    if frontend_dir:
        index_path = os.path.join(frontend_dir, "index.html")
        if os.path.exists(index_path) and "text/html" in request.headers.get("accept", ""):
            return FileResponse(index_path)
    return {
        "message": "Welcome to Diamond Price Predictor API",
        "endpoints": {
            "web_app": "/app",
            "predict": "/api/predict",
            "history": "/api/history",
            "health": "/api/health",
            "docs": "/docs"
        },
        "status": {
            "model_loaded": model is not None,
            "database_connected": db_available
        }
    }

@app.get("/app")
def serve_app():
    """Serve the frontend user interface"""
    if frontend_dir:
        index_path = os.path.join(frontend_dir, "index.html")
        if os.path.exists(index_path):
            return FileResponse(index_path)
    raise HTTPException(status_code=404, detail="Frontend application not found")

@app.get("/style.css")
def serve_css():
    """Serve style.css for root index requests"""
    if frontend_dir:
        css_path = os.path.join(frontend_dir, "style.css")
        if os.path.exists(css_path):
            return FileResponse(css_path, media_type="text/css")
    raise HTTPException(status_code=404, detail="style.css not found")

@app.get("/script.js")
def serve_js():
    """Serve script.js for root index requests"""
    if frontend_dir:
        js_path = os.path.join(frontend_dir, "script.js")
        if os.path.exists(js_path):
            return FileResponse(js_path, media_type="application/javascript")
    raise HTTPException(status_code=404, detail="script.js not found")

@app.post("/api/predict", response_model=PredictionResponse)
def predict_price(diamond: DiamondInput):
    """
    Predict diamond price based on characteristics.
    """
    global model
    if model is None:
        raise HTTPException(
            status_code=503,
            detail="Model is not currently loaded on the server."
        )

    try:
        # Calculate volume
        volume = diamond.x * diamond.y * diamond.z

        # Create input DataFrame matching model training schema
        input_df = pd.DataFrame({
            "carat": [diamond.carat],
            "depth": [diamond.depth],
            "table": [diamond.table],
            "x": [diamond.x],
            "y": [diamond.y],
            "z": [diamond.z],
            "volume": [volume],
            "cut": [diamond.cut],
            "color": [diamond.color],
            "clarity": [diamond.clarity]
        })

        # Make prediction
        prediction_val = float(model.predict(input_df)[0])
        # Ensure predicted price is not negative
        predicted_price = max(0.0, round(prediction_val, 2))
        now_iso = datetime.now().isoformat()

        # Persist to Database if available
        persisted_id = len(predictions_history) + 1
        if db_available and db_session_factory:
            try:
                with db_session_factory() as session:
                    record = PredictionRecord(
                        carat=diamond.carat,
                        depth=diamond.depth,
                        table_pct=diamond.table,
                        x=diamond.x,
                        y=diamond.y,
                        z=diamond.z,
                        cut=diamond.cut,
                        color=diamond.color,
                        clarity=diamond.clarity,
                        predicted_price=predicted_price
                    )
                    session.add(record)
                    session.commit()
                    session.refresh(record)
                    persisted_id = record.id
            except Exception as db_err:
                logger.error(f"Failed to persist prediction to database: {db_err}")

        # Always update in-memory cache
        predictions_history.append({
            "id": persisted_id,
            "predicted_price": predicted_price,
            "carat": diamond.carat,
            "cut": diamond.cut,
            "color": diamond.color,
            "clarity": diamond.clarity,
            "timestamp": now_iso
        })

        return PredictionResponse(
            predicted_price=predicted_price,
            input_data=diamond,
            timestamp=now_iso
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Prediction error: {e}")
        raise HTTPException(status_code=400, detail=f"Prediction error: {str(e)}")

@app.get("/api/history", response_model=List[HistoryResponse])
def get_history(limit: int = 50):
    """
    Get prediction history (latest predictions first).
    Reads from PostgreSQL if connected, otherwise from in-memory cache.
    """
    if db_available and db_session_factory:
        try:
            with db_session_factory() as session:
                records = session.query(PredictionRecord).order_by(desc(PredictionRecord.created_at)).limit(limit).all()
                return [
                    HistoryResponse(
                        id=r.id,
                        predicted_price=float(r.predicted_price),
                        carat=float(r.carat),
                        cut=r.cut,
                        color=r.color,
                        clarity=r.clarity,
                        timestamp=r.created_at.isoformat() if r.created_at else datetime.now().isoformat()
                    )
                    for r in records
                ]
        except Exception as db_err:
            logger.error(f"Error querying history from database: {db_err}. Falling back to memory.")

    # In-memory fallback
    return sorted(predictions_history, key=lambda x: x["id"], reverse=True)[:limit]

@app.get("/api/health")
def health_check():
    """Health check endpoint providing status of server components"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "model_loaded": model is not None,
        "model_path": model_loaded_path,
        "database_connected": db_available
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
