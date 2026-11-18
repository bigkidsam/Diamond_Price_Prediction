"""
ml_engine/conformal_predictor.py
Probabilistic Machine Learning using Split Conformal Prediction
Provides distribution-free, mathematically guaranteed finite-sample coverage intervals.
"""

import os
import numpy as np
import pandas as pd
import joblib

class ConformalPredictor:
    """
    Split Conformal Prediction Engine for Regression.
    Guarantees: P( Y_true in [Y_pred - q, Y_pred + q] ) >= 1 - alpha
    without making any Gaussian or distributional assumptions.
    """
    def __init__(self, model_pipeline):
        self.pipeline = model_pipeline
        self.non_conformity_scores = None
        self.is_calibrated = False

    def calibrate(self, X_calib: pd.DataFrame, y_calib: pd.Series):
        """Compute absolute residual non-conformity scores on held-out calibration set."""
        y_pred_calib = self.pipeline.predict(X_calib)
        # S_i = |y_i - f(x_i)|
        self.non_conformity_scores = np.abs(np.array(y_calib) - y_pred_calib)
        self.non_conformity_scores = np.sort(self.non_conformity_scores)
        self.is_calibrated = True
        return self

    def predict_interval(self, X_new: pd.DataFrame, confidence: float = 0.95):
        """
        Produce point predictions and finite-sample guaranteed conformal intervals.
        confidence = 1 - alpha (e.g., 0.95 -> 95% coverage guarantee).
        """
        if not self.is_calibrated:
            raise ValueError("ConformalPredictor must be calibrated using .calibrate(X_calib, y_calib) before predicting.")

        n = len(self.non_conformity_scores)
        alpha = 1.0 - confidence
        
        # Conformal quantile calculation with finite-sample correction: ceil((n + 1) * (1 - alpha)) / n
        p_index = int(np.ceil((n + 1) * (1.0 - alpha))) - 1
        p_index = min(max(p_index, 0), n - 1)
        
        q_hat = float(self.non_conformity_scores[p_index])
        
        point_preds = self.pipeline.predict(X_new)
        
        lower_bounds = np.maximum(0.0, point_preds - q_hat)
        upper_bounds = point_preds + q_hat
        
        return {
            "point_estimate": np.round(point_preds, 2),
            "lower_bound": np.round(lower_bounds, 2),
            "upper_bound": np.round(upper_bounds, 2),
            "margin_error": round(q_hat, 2),
            "guaranteed_coverage": f"{int(confidence * 100)}%",
            "calibration_samples": n
        }

    def save(self, filepath: str):
        joblib.dump({
            "pipeline": self.pipeline,
            "scores": self.non_conformity_scores,
            "calibrated": self.is_calibrated
        }, filepath, compress=5)

    @classmethod
    def load(cls, filepath: str):
        data = joblib.load(filepath)
        cp = cls(data["pipeline"])
        cp.non_conformity_scores = data["scores"]
        cp.is_calibrated = data["calibrated"]
        return cp

if __name__ == "__main__":
    from benchmark import load_and_preprocess_data, get_preprocessor
    from sklearn.model_selection import train_test_split
    import lightgbm as lgb
    from sklearn.pipeline import Pipeline
    
    print("Calibrating Conformal Prediction Engine...")
    df = load_and_preprocess_data()
    X = df.drop('price', axis=1)
    y = df['price']
    
    categorical_features = ['cut', 'color', 'clarity']
    numerical_features = [col for col in X.columns if col not in categorical_features]
    
    X_train, X_temp, y_train, y_temp = train_test_split(X, y, test_size=0.30, random_state=42)
    X_calib, X_test, y_calib, y_test = train_test_split(X_temp, y_temp, test_size=0.50, random_state=42)
    
    pipe = Pipeline([
        ('preprocessor', get_preprocessor(numerical_features, categorical_features)),
        ('model', lgb.LGBMRegressor(n_estimators=150, num_leaves=31, learning_rate=0.06, random_state=42, verbose=-1))
    ])
    pipe.fit(X_train, y_train)
    
    cp = ConformalPredictor(pipe)
    cp.calibrate(X_calib, y_calib)
    
    # Test on out-of-sample data
    test_sample = X_test.iloc[:5]
    intervals = cp.predict_interval(test_sample, confidence=0.90)
    
    print("\nConformal Prediction Output (90% Confidence Interval):")
    for i in range(5):
        actual = y_test.iloc[i]
        pt = intervals["point_estimate"][i]
        lb = intervals["lower_bound"][i]
        ub = intervals["upper_bound"][i]
        inside = lb <= actual <= ub
        print(f"Sample {i+1}: Actual=${actual:,.2f} | Pred=${pt:,.2f} | Interval=[${lb:,.2f}, ${ub:,.2f}] | Covered={inside}")
    
    # Save calibrated engine
    save_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "conformal_predictor.pkl"))
    cp.save(save_path)
    print(f"\nSaved calibrated Conformal Predictor to {save_path}")
