import os
import joblib
import numpy as np
import pandas as pd
from flask import Flask, request, jsonify

app = Flask(__name__)

# Load serialized model pipeline package on service startup
MODEL_PATH = os.path.join(os.path.dirname(__file__), "model", "fraud_model.pkl")

model_data = None
model = None
scaler = None
cols_to_scale = None
feature_names = None
threshold = 0.5

def load_model_package():
    global model_data, model, scaler, cols_to_scale, feature_names, threshold
    if os.path.exists(MODEL_PATH):
        try:
            model_data = joblib.load(MODEL_PATH)
            model = model_data["model"]
            scaler = model_data["scaler"]
            cols_to_scale = model_data["cols_to_scale"]
            feature_names = model_data["feature_names"]
            threshold = model_data.get("threshold", 0.5)
            print(f"Model successfully loaded from {MODEL_PATH}")
            return True
        except Exception as e:
            print(f"Error loading model package: {str(e)}")
            return False
    else:
        print(f"Model file not found at {MODEL_PATH}")
        return False

# Attempt initial model load
model_loaded = load_model_package()


@app.route("/health", methods=["GET"])
def health_check():
    """Health check endpoint returning service status and model metadata."""
    if model is None:
        return jsonify({
            "status": "degraded",
            "model_loaded": False,
            "message": "ML model file not loaded. Run train.py first."
        }), 503

    return jsonify({
        "status": "healthy",
        "model_loaded": True,
        "feature_count": len(feature_names),
        "metrics": model_data.get("metrics", {})
    }), 200


@app.route("/predict", methods=["POST"])
def predict():
    """
    Prediction endpoint accepting transaction feature values.
    
    Accepts JSON body format:
    1. Dictionary of features: {"Time": 0, "V1": -1.35, ..., "Amount": 149.62}
    2. Array of 30 ordered feature values: [0, -1.35, ..., 149.62]
    """
    if model is None or scaler is None:
        return jsonify({
            "error": "Model not loaded. Service is unavailable."
        }), 500

    if not request.is_json:
        return jsonify({
            "error": "Invalid request. Content-Type must be application/json."
        }), 400

    data = request.get_json()

    # Extract features dictionary or array
    if isinstance(data, dict):
        # If payload wraps features in a key like 'features'
        if "features" in data and isinstance(data["features"], (dict, list)):
            input_data = data["features"]
        else:
            input_data = data
    elif isinstance(data, list):
        input_data = data
    else:
        return jsonify({
            "error": "Payload must be a JSON object or array of 30 feature values."
        }), 400

    # Convert input to DataFrame maintaining exact expected feature order
    try:
        if isinstance(input_data, dict):
            # Verify missing features
            missing_cols = [col for col in feature_names if col not in input_data]
            if missing_cols:
                return jsonify({
                    "error": f"Missing required feature(s): {missing_cols}"
                }), 400

            # Construct DataFrame with exact column ordering
            input_df = pd.DataFrame([{col: float(input_data[col]) for col in feature_names}])

        elif isinstance(input_data, list):
            if len(input_data) != len(feature_names):
                return jsonify({
                    "error": f"Expected exactly {len(feature_names)} features, but received {len(input_data)}."
                }), 400

            input_df = pd.DataFrame([ [float(v) for v in input_data] ], columns=feature_names)

    except (ValueError, TypeError) as e:
        return jsonify({
            "error": f"Invalid feature value provided. All features must be numeric. Details: {str(e)}"
        }), 400

    # Apply scaling to Time and Amount as in notebook training pipeline
    input_df_scaled = input_df.copy()
    input_df_scaled[cols_to_scale] = scaler.transform(input_df[cols_to_scale])

    # Run XGBoost inference
    try:
        proba = float(model.predict_proba(input_df_scaled)[0, 1])
        prediction = int(proba >= threshold)
        is_fraud = bool(prediction == 1)

        return jsonify({
            "prediction": prediction,
            "fraud_probability": round(proba, 6),
            "is_fraud": is_fraud
        }), 200

    except Exception as e:
        return jsonify({
            "error": f"Inference execution failed: {str(e)}"
        }), 500


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)
