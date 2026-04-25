from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
import joblib
import pandas as pd
import os
from datetime import datetime
from typing import List, Optional

# Initialize FastAPI app
app = FastAPI(
    title="Diamond Price Predictor API",
    description="API for predicting diamond prices based on their characteristics",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the trained model
# Look for model in parent directory (project root)
MODEL_PATH = os.path.join(os.path.dirname(__file__), "..", "diamond_price_model.pkl")
MODEL_PATH = os.path.abspath(MODEL_PATH)

if os.path.exists(MODEL_PATH):
    model = joblib.load(MODEL_PATH)
    print(f"✅ Model loaded from: {MODEL_PATH}")
else:
    raise FileNotFoundError(f"Model file not found: {MODEL_PATH}")

# In-memory storage for predictions (for demo purposes)
# In production, use PostgreSQL database
predictions_history = []

# Request/Response Models
class DiamondInput(BaseModel):
    carat: float
    depth: float
    table: float
    x: float
    y: float
    z: float
    cut: str
    color: str
    clarity: str

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

# Routes

@app.get("/")
def read_root():
    """Root endpoint"""
    return {
        "message": "Welcome to Diamond Price Predictor API",
        "endpoints": {
            "predict": "/api/predict",
            "history": "/api/history",
            "docs": "/docs"
        }
    }

@app.post("/api/predict", response_model=PredictionResponse)
def predict_price(diamond: DiamondInput):
    """
    Predict diamond price based on its characteristics.
    
    Parameters:
    - carat: Weight in carats (0.2 to 5.0)
    - depth: Total depth percentage (40 to 80)
    - table: Width of top of diamond relative to widest point (40 to 95)
    - x: Length in mm (3 to 11)
    - y: Width in mm (3 to 11)
    - z: Depth in mm (2 to 7)
    - cut: Cut quality (Fair, Good, Very Good, Premium, Ideal)
    - color: Color grade (D-J, where D is best)
    - clarity: Clarity grade (I1, SI2, SI1, VS2, VS1, VVS2, VVS1, IF)
    """
    
    try:
        # Calculate volume
        volume = diamond.x * diamond.y * diamond.z
        
        # Create input DataFrame matching model training format
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
        predicted_price = float(model.predict(input_df)[0])
        
        # Store in history
        timestamp = datetime.now().isoformat()
        predictions_history.append({
            "id": len(predictions_history) + 1,
            "predicted_price": predicted_price,
            "carat": diamond.carat,
            "cut": diamond.cut,
            "color": diamond.color,
            "clarity": diamond.clarity,
            "timestamp": timestamp
        })
        
        return PredictionResponse(
            predicted_price=predicted_price,
            input_data=diamond,
            timestamp=timestamp
        )
    
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Prediction error: {str(e)}")

@app.get("/api/history", response_model=List[HistoryResponse])
def get_history(limit: int = 50):
    """Get prediction history (latest predictions first)"""
    return sorted(predictions_history, key=lambda x: x["id"], reverse=True)[:limit]

@app.get("/api/health")
def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

# Serve static files (frontend)
if os.path.exists("../frontend/static"):
    app.mount("/static", StaticFiles(directory="../frontend/static"), name="static")

@app.get("/app")
def serve_frontend():
    """Serve frontend HTML"""
    frontend_path = "../frontend/index.html"
    if os.path.exists(frontend_path):
        return FileResponse(frontend_path)
    raise HTTPException(status_code=404, detail="Frontend not found")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
