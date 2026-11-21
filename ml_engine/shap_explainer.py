"""
ml_engine/shap_explainer.py
Rigorous Explainable AI (XAI) using SHAP (SHapley Additive exPlanations)
Computes game-theoretic marginal feature attributions for diamond appraisals.
"""

import os
import json
import numpy as np
import pandas as pd
import shap
import joblib

class DiamondShapExplainer:
    """
    Computes exact local and global Shapley values using TreeExplainer.
    Deconstructs f(x) = E[f(X)] + sum(phi_i) with mathematical efficiency.
    """
    def __init__(self, pipeline):
        self.pipeline = pipeline
        self.preprocessor = pipeline.named_steps.get('preprocessor')
        self.regressor = pipeline.named_steps.get('regressor') or pipeline.named_steps.get('model')
        
        # Initialize TreeExplainer on the regressor
        self.explainer = shap.TreeExplainer(self.regressor)
        exp_val = self.explainer.expected_value
        if isinstance(exp_val, (list, np.ndarray)):
            self.base_value = float(exp_val[0])
        else:
            self.base_value = float(exp_val)

    def explain_sample(self, sample_df: pd.DataFrame):
        """
        Compute local Shapley attribution for an individual diamond.
        Returns exact dollar amounts added or subtracted by each feature.
        """
        # Transform input using the pipeline's ColumnTransformer
        X_trans = self.preprocessor.transform(sample_df)
        feature_names = self.preprocessor.get_feature_names_out()
        
        # Calculate shap values
        shap_values = self.explainer.shap_values(X_trans)
        if isinstance(shap_values, list):
            shap_values = shap_values[0]
            
        values_row = shap_values[0]
        
        # Map raw one-hot / scaled feature names to intuitive gemological categories
        contributions = []
        for name, val in zip(feature_names, values_row):
            # Clean feature prefix e.g. 'num__carat' -> 'carat'
            clean_name = name.split('__')[-1]
            contributions.append({
                "feature": clean_name,
                "impact_usd": round(float(val), 2),
                "direction": "positive" if val >= 0 else "negative"
            })
            
        # Group one-hot encoded categories back into single features (e.g. color, cut, clarity)
        aggregated = {
            "carat_and_volume": 0.0,
            "clarity": 0.0,
            "color": 0.0,
            "cut_and_proportions": 0.0,
            "other_geometry": 0.0
        }
        
        for item in contributions:
            f = item["feature"].lower()
            val = item["impact_usd"]
            if "carat" in f or "volume" in f:
                aggregated["carat_and_volume"] += val
            elif "clarity" in f:
                aggregated["clarity"] += val
            elif "color" in f:
                aggregated["color"] += val
            elif "cut" in f or "depth" in f or "table" in f:
                aggregated["cut_and_proportions"] += val
            else:
                aggregated["other_geometry"] += val

        predicted_val = float(self.base_value + np.sum(values_row))

        return {
            "base_market_price": round(self.base_value, 2),
            "predicted_price": round(predicted_val, 2),
            "top_feature_contributions": sorted(contributions, key=lambda x: abs(x["impact_usd"]), reverse=True)[:8],
            "category_breakdown": {k: round(v, 2) for k, v in aggregated.items()}
        }

if __name__ == "__main__":
    from benchmark import load_and_preprocess_data, get_preprocessor
    from sklearn.model_selection import train_test_split
    import lightgbm as lgb
    from sklearn.pipeline import Pipeline

    print("Building SHAP TreeExplainer...")
    df = load_and_preprocess_data()
    X = df.drop('price', axis=1)
    y = df['price']
    
    categorical_features = ['cut', 'color', 'clarity']
    numerical_features = [col for col in X.columns if col not in categorical_features]
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.20, random_state=42)
    
    pipe = Pipeline([
        ('preprocessor', get_preprocessor(numerical_features, categorical_features)),
        ('regressor', lgb.LGBMRegressor(n_estimators=100, num_leaves=31, learning_rate=0.08, random_state=42, verbose=-1))
    ])
    pipe.fit(X_train, y_train)
    
    explainer = DiamondShapExplainer(pipe)
    
    # Test on a single high-tier diamond
    test_diamond = X_test.iloc[[0]]
    explanation = explainer.explain_sample(test_diamond)
    
    print("\nSHAP Attribution Result for Test Diamond:")
    print(json.dumps(explanation, indent=2))
