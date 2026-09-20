# Credit Card Fraud Detection - Python ML Inference Service

This service provides real-time fraud prediction API endpoints powered by an XGBoost model trained on the Kaggle Credit Card Fraud Detection dataset (`creditcard.csv`).

## Model & Preprocessing Background

The pipeline directly mirrors the notebook `Credit_Card_Fraud_Detection.ipynb`:
- **Model**: `XGBClassifier` with `scale_pos_weight` tuned to handle class imbalance.
- **Preprocessing**: `StandardScaler` applied specifically to `Time` and `Amount` feature columns. Features `V1` through `V28` are already PCA components and left unscaled.
- **Input Features (30 columns in exact order)**:
  `['Time', 'V1', 'V2', 'V3', 'V4', 'V5', 'V6', 'V7', 'V8', 'V9', 'V10', 'V11', 'V12', 'V13', 'V14', 'V15', 'V16', 'V17', 'V18', 'V19', 'V20', 'V21', 'V22', 'V23', 'V24', 'V25', 'V26', 'V27', 'V28', 'Amount']`
- **Classification Threshold**: `0.5`

---

## Installation & Setup

1. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Train & Generate Model Artifacts** (if `model/fraud_model.pkl` is missing):
   ```bash
   python train.py
   ```

3. **Start the ML Service**:
   ```bash
   python app.py
   ```
   The service runs by default on `http://127.0.0.1:5000`.

---

## API Endpoints

### 1. Health Check
`GET /health`

**Response (`200 OK`)**:
```json
{
  "feature_count": 30,
  "metrics": {
    "pr_auc": 0.8791,
    "roc_auc": 0.9726
  },
  "model_loaded": true,
  "status": "healthy"
}
```

---

### 2. Predict Transaction Fraud
`POST /predict`

**Headers**: `Content-Type: application/json`

**Sample Request Body (JSON object with 30 feature fields)**:
```json
{
  "Time": 406.0,
  "V1": -2.312226542,
  "V2": 1.951992011,
  "V3": -1.609850732,
  "V4": 3.997905588,
  "V5": -0.522187865,
  "V6": -1.426545319,
  "V7": -2.537387306,
  "V8": 1.391657248,
  "V9": -2.770089277,
  "V10": -2.772272145,
  "V11": 3.202033207,
  "V12": -2.899907388,
  "V13": -0.595221881,
  "V14": -4.289253782,
  "V15": 0.38972412,
  "V16": -1.14074718,
  "V17": -2.830055675,
  "V18": -0.016822468,
  "V19": 0.416955705,
  "V20": 0.126910559,
  "V21": 0.517232371,
  "V22": -0.035049369,
  "V23": -0.465211076,
  "V24": 0.320198199,
  "V25": 0.044519167,
  "V26": 0.177839798,
  "V27": 0.261145003,
  "V28": -0.143275875,
  "Amount": 0.0
}
```

**Sample Response (`200 OK`)**:
```json
{
  "prediction": 1,
  "fraud_probability": 0.998412,
  "is_fraud": true
}
```

---

## Error Handling

- **Invalid Content-Type**: `400 Bad Request` with `{"error": "Invalid request. Content-Type must be application/json."}`
- **Missing Features**: `400 Bad Request` with list of missing feature names.
- **Non-numeric values**: `400 Bad Request` detailing invalid input types.
- **Model unavailable**: `500 Internal Server Error` if model fails to load.
