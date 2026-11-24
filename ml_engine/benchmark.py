"""
ml_engine/benchmark.py
Comprehensive Model Tournament & Benchmarking Suite for Diamond Valuation
Evaluates Linear, Ridge, Random Forest, XGBoost, LightGBM, and Stacking Ensemble.
"""

import os
import sys
import time
import json
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.metrics import r2_score, mean_squared_error, mean_absolute_error, mean_absolute_percentage_error
from sklearn.linear_model import LinearRegression, Ridge
from sklearn.ensemble import RandomForestRegressor, StackingRegressor
import xgboost as xgb
import lightgbm as lgb
import joblib

DATA_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "Diamond Price Prediction.csv"))

def load_and_preprocess_data():
    """Load raw dataset and apply domain-specific gemological feature engineering."""
    df = pd.read_csv(DATA_PATH)
    
    # Standardize column headers
    rename_map = {
        'Carat(Weight of Daimond)': 'carat',
        'Carat(Weight of Diamond)': 'carat',
        'Cut(Quality)': 'cut',
        'Color': 'color',
        'Clarity': 'clarity',
        'Depth': 'depth',
        'Table': 'table',
        'Price(in US dollars)': 'price',
        'X(length)': 'x',
        'Y(width)': 'y',
        'Z(Depth)': 'z'
    }
    df = df.rename(columns={k: v for k, v in rename_map.items() if k in df.columns})
    
    # Gemological validity filters: dimensions must be non-zero
    df = df[(df['x'] > 0) & (df['y'] > 0) & (df['z'] > 0)].copy()
    
    # Feature Engineering: 3D spatial volume and geometric ratios
    df['volume'] = df['x'] * df['y'] * df['z']
    df['aspect_ratio'] = df['x'] / df['y']
    df['depth_ratio'] = df['z'] / df['x']
    df['table_to_depth'] = df['table'] / df['depth']
    
    return df

def get_preprocessor(numerical_features, categorical_features):
    """Build Scikit-Learn ColumnTransformer pipeline."""
    return ColumnTransformer(
        transformers=[
            ('num', StandardScaler(), numerical_features),
            ('cat', OneHotEncoder(handle_unknown='ignore', sparse_output=False), categorical_features)
        ]
    )

def run_tournament():
    print("=" * 70)
    print("💎 DIAMOND PRICE PREDICTION: SOTA MODEL TOURNAMENT & BENCHMARK")
    print("=" * 70)
    
    df = load_and_preprocess_data()
    print(f"Dataset Loaded: {len(df):,} valid gemological samples")
    
    X = df.drop('price', axis=1)
    y = df['price']
    
    categorical_features = ['cut', 'color', 'clarity']
    numerical_features = [col for col in X.columns if col not in categorical_features]
    
    # 70% Train, 15% Calibration (for Conformal Prediction), 15% Out-of-Sample Test
    X_train, X_temp, y_train, y_temp = train_test_split(X, y, test_size=0.30, random_state=42)
    X_calib, X_test, y_calib, y_test = train_test_split(X_temp, y_temp, test_size=0.50, random_state=42)
    
    print(f"Split sizes: Train={len(X_train):,}, Calibration={len(X_calib):,}, Test={len(X_test):,}")
    
    preprocessor = get_preprocessor(numerical_features, categorical_features)
    
    # Define Candidate Estimators
    models = {
        "Linear Regression (Baseline)": LinearRegression(),
        "Ridge Regression (L2)": Ridge(alpha=1.0),
        "Random Forest (Tuned)": RandomForestRegressor(
            n_estimators=60, max_depth=16, min_samples_leaf=2, random_state=42, n_jobs=-1
        ),
        "XGBoost Regressor": xgb.XGBRegressor(
            n_estimators=150, max_depth=6, learning_rate=0.08, subsample=0.8,
            colsample_bytree=0.8, random_state=42, n_jobs=-1
        ),
        "LightGBM Regressor": lgb.LGBMRegressor(
            n_estimators=200, num_leaves=31, learning_rate=0.06, subsample=0.8,
            random_state=42, n_jobs=-1, verbose=-1
        )
    }
    
    results = []
    trained_pipelines = {}
    
    for name, model in models.items():
        print(f"\nTraining [{name}]...")
        pipe = Pipeline([
            ('preprocessor', preprocessor),
            ('regressor', model)
        ])
        
        t0 = time.time()
        pipe.fit(X_train, y_train)
        train_time = time.time() - t0
        
        # Measure latency on test set
        t0_inf = time.time()
        y_pred = pipe.predict(X_test)
        latency_ms = ((time.time() - t0_inf) / len(X_test)) * 1000.0
        
        r2 = r2_score(y_test, y_pred)
        rmse = np.sqrt(mean_squared_error(y_test, y_pred))
        mae = mean_absolute_error(y_test, y_pred)
        mape = mean_absolute_percentage_error(y_test, y_pred) * 100.0
        
        trained_pipelines[name] = pipe
        
        results.append({
            "model": name,
            "r2": round(float(r2), 5),
            "rmse": round(float(rmse), 2),
            "mae": round(float(mae), 2),
            "mape_pct": round(float(mape), 2),
            "train_time_sec": round(float(train_time), 3),
            "latency_ms_per_sample": round(float(latency_ms), 4)
        })
        print(f"  --> R²: {r2:.5f} | RMSE: ${rmse:,.2f} | MAE: ${mae:,.2f} | Latency: {latency_ms:.3f} ms/sample")
    
    # -------------------------------------------------------------
    # Stacking Ensemble (XGBoost + LightGBM + Random Forest)
    # -------------------------------------------------------------
    print("\nTraining [Super-Learner Stacking Ensemble]...")
    stacking_estimators = [
        ('xgb', xgb.XGBRegressor(n_estimators=100, max_depth=6, learning_rate=0.08, random_state=42, n_jobs=-1)),
        ('lgb', lgb.LGBMRegressor(n_estimators=120, num_leaves=31, learning_rate=0.06, random_state=42, n_jobs=-1, verbose=-1)),
        ('rf', RandomForestRegressor(n_estimators=40, max_depth=14, min_samples_leaf=3, random_state=42, n_jobs=-1))
    ]
    
    stacking_pipeline = Pipeline([
        ('preprocessor', preprocessor),
        ('stacking', StackingRegressor(
            estimators=stacking_estimators,
            final_estimator=Ridge(alpha=10.0),
            cv=3,
            n_jobs=-1
        ))
    ])
    
    t0_st = time.time()
    stacking_pipeline.fit(X_train, y_train)
    train_time_st = time.time() - t0_st
    
    t0_st_inf = time.time()
    y_pred_st = stacking_pipeline.predict(X_test)
    latency_st = ((time.time() - t0_st_inf) / len(X_test)) * 1000.0
    
    r2_st = r2_score(y_test, y_pred_st)
    rmse_st = np.sqrt(mean_squared_error(y_test, y_pred_st))
    mae_st = mean_absolute_error(y_test, y_pred_st)
    mape_st = mean_absolute_percentage_error(y_test, y_pred_st) * 100.0
    
    trained_pipelines["Stacking Regressor (Ensemble)"] = stacking_pipeline
    results.append({
        "model": "Stacking Regressor (Ensemble)",
        "r2": round(float(r2_st), 5),
        "rmse": round(float(rmse_st), 2),
        "mae": round(float(mae_st), 2),
        "mape_pct": round(float(mape_st), 2),
        "train_time_sec": round(float(train_time_st), 3),
        "latency_ms_per_sample": round(float(latency_st), 4)
    })
    print(f"  --> Stacking Ensemble R²: {r2_st:.5f} | RMSE: ${rmse_st:,.2f} | MAE: ${mae_st:,.2f}")
    
    # Save Benchmark Report
    report_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "benchmark_results.json"))
    with open(report_path, "w") as f:
        json.dump(results, f, indent=2)
    print(f"\n✅ Benchmark tournament complete. Results saved to {report_path}")
    
    # Save the Champion Model (LightGBM / Stacking for high speed and accuracy)
    champion_name = "LightGBM Regressor"
    champion_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "champion_model_lgb.pkl"))
    joblib.dump(trained_pipelines[champion_name], champion_path, compress=5)
    print(f"🏆 Champion Model [{champion_name}] saved to {champion_path} ({os.path.getsize(champion_path)/(1024*1024):.2f} MB)")
    
    return results

if __name__ == "__main__":
    run_tournament()
