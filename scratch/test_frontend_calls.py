import json
import urllib.request

base_url = "http://127.0.0.1:8000"

sample_diamond = {
    "carat": 1.25,
    "cut": "Ideal",
    "color": "G",
    "clarity": "VS1",
    "depth": 61.5,
    "table": 57.0,
    "x": 6.90,
    "y": 6.95,
    "z": 4.26,
    "shape": "Round",
    "polish": "Excellent",
    "symmetry": "Excellent",
    "fluorescence": "None",
    "certification": "GIA"
}

def post(endpoint, data):
    req = urllib.request.Request(
        f"{base_url}{endpoint}",
        data=json.dumps(data).encode("utf-8"),
        headers={"Content-Type": "application/json"}
    )
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read().decode("utf-8"))

def get(endpoint):
    req = urllib.request.Request(f"{base_url}{endpoint}")
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read().decode("utf-8"))

print("--- 1. Base Prediction ---")
pred = post("/api/predict", sample_diamond)
print(f"Price: ${pred['estimated_price']}, Range: [${pred['lower_bound']}, ${pred['upper_bound']}]")

print("\n--- 2. Split Conformal Guarantee ---")
conf = post("/api/ml/conformal-predict", {**sample_diamond, "confidence_level": 0.95})
print(f"Guarantee: {conf['statistical_guarantee']}")
print(f"Bounds: [${conf['lower_bound']}, ${conf['upper_bound']}], Margin: ±${conf['margin_error_usd']}")

print("\n--- 3. SHAP TreeExplainer Attributions ---")
shap = post("/api/ml/shap-explain", sample_diamond)
print(f"Base E[f(X)]: ${shap['base_market_price']:.2f}, Predicted: ${shap['predicted_price']:.2f}")
print("Top 3 SHAP Features:")
for f in shap["top_feature_contributions"][:3]:
    print(f"  - {f['feature']}: {f['impact_usd']:+.2f} USD")
print("Category Breakdown:", shap["category_breakdown"])

print("\n--- 4. Macro Forecasting Engine ---")
fc = post("/api/ml/forecast", {**sample_diamond, "horizon_years": 3})
print(f"Model: {fc['model']}")
print(f"Annualized Rate: {fc['annualized_rate_pct']}%")
print("Trajectory:")
for pt in fc["projected_trajectory"]:
    print(f"  Year +{pt['year']}: ${pt['projected_price']:.2f} (+{pt['cumulative_change_pct']}%) Cone: [${pt['lower_confidence_bound']:.2f} - ${pt['upper_confidence_bound']:.2f}]")

print("\n--- 5. SOTA Tournament Leaderboard ---")
tourn = get("/api/ml/tournament")
print(f"Champion: {tourn['champion_model']}")
for m in tourn["leaderboard"]:
    print(f"  {m['model']:<25} R²: {m['r2']:.5f}  RMSE: ${m['rmse']:<8.2f} Latency: {m['latency_ms_per_sample']:.4f} ms")

print("\nALL AI/ML CALLS VERIFIED 100% SUCCEEDED!")
