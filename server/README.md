# Credit Card Fraud Detection - Node.js Backend API

Express API server providing business logic, MongoDB persistence, prediction history, and statistics for the Credit Card Fraud Detection application. It acts as the API gateway between the React frontend and the Python ML inference service.

## Architecture & Data Flow

```
React Frontend
      ↓ (POST /api/predictions)
Node.js + Express Server (Port 8000)
      ↓ (axios POST /predict)
Python ML Service (Port 5000)
      ↓
Fraud Detection Model (XGBoost)
```

1. Express validates incoming transaction payloads (ensuring all 30 features are present and numeric).
2. Express forwards the validated feature payload to the Python ML inference service.
3. Upon receiving inference results (`prediction`, `fraud_probability`, `is_fraud`), Express persists the transaction record to MongoDB.
4. Express responds to the client with the prediction result and record metadata.

---

## Setup & Installation

### 1. Install Dependencies
```bash
cd server
npm install
```

### 2. Environment Variables (`.env`)
Create a `.env` file based on `.env.example`:
```env
PORT=8000
MONGODB_URI=mongodb://127.0.0.1:27017/credit_card_fraud
ML_SERVICE_URL=http://127.0.0.1:5000
```

---

## Starting the Server

### Production Mode
```bash
npm start
```

### Development Mode (with hot-reloading)
```bash
npm run dev
```

The Express backend runs at `http://127.0.0.1:8000`.

---

## API Endpoints Summary

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Backend and ML service connection health status |
| `POST` | `/api/predictions` | Runs fraud prediction via Python ML service & saves to MongoDB |
| `GET` | `/api/predictions` | Retrieves recent prediction records (query `?limit=20`) |
| `GET` | `/api/predictions/stats` | Aggregates summary statistics from MongoDB |

---

## Endpoint Details & Examples

### 1. Health Check (`GET /api/health`)
**Response (`200 OK`)**:
```json
{
  "status": "ok",
  "ml_service": "connected"
}
```

---

### 2. Predict & Store Fraud Transaction (`POST /api/predictions`)
**Headers**: `Content-Type: application/json`

**Sample Request Body**:
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

**Response (`201 Created`)**:
```json
{
  "success": true,
  "prediction": 1,
  "fraud_probability": 0.999601,
  "is_fraud": true,
  "_id": "673e4a819f201b2a9401b312",
  "createdAt": "2026-09-20T14:26:00.000Z"
}
```

---

### 3. Prediction History (`GET /api/predictions?limit=20`)
**Response (`200 OK`)**:
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "673e4a819f201b2a9401b312",
      "transactionData": { "Time": 406, "Amount": 0, ... },
      "prediction": 1,
      "fraudProbability": 0.999601,
      "isFraud": true,
      "createdAt": "2026-09-20T14:26:00.000Z"
    }
  ]
}
```

---

### 4. Dashboard Statistics (`GET /api/predictions/stats`)
**Response (`200 OK`)**:
```json
{
  "success": true,
  "stats": {
    "totalPredictions": 2,
    "fraudPredictions": 1,
    "normalPredictions": 1,
    "avgFraudProbability": 0.499802
  }
}
```

---

## Error Responses

- **Missing or Invalid Input**: `400 Bad Request`
  ```json
  {
    "success": false,
    "message": "Missing required transaction feature(s): V1, V2"
  }
  ```
- **ML Service Offline**: `530 Service Unavailable`
  ```json
  {
    "success": false,
    "message": "ML prediction service is currently unavailable or un-reachable."
  }
  ```
