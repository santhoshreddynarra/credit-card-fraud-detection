# Credit Card Fraud Detection System

A production-style end-to-end Machine Learning platform for real-time Credit Card Fraud Detection built with **Python (Flask + XGBoost)**, **Node.js (Express + MongoDB)**, and **React (Vite + Tailwind CSS + Recharts)**.

---

## 🏗️ Architecture & Component Workflow

```text
┌─────────────────────────────────────────────────────────┐
│                    React Frontend                       │
│      (Vite + Tailwind CSS + Recharts Dashboard)         │
└────────────────────────────┬────────────────────────────┘
                             │ Axios HTTP REST API
                             ▼
┌─────────────────────────────────────────────────────────┐
│                   Node.js Express Server                │
│         (Input Validation & API Gateway Layer)          │
└───────────────┬─────────────────────────┬───────────────┘
                │                         │
     Axios HTTP │                         │ Mongoose ODM
                ▼                         ▼
┌───────────────────────────┐ ┌───────────────────────────┐
│     Python ML Service     │ │     MongoDB Database      │
│ (Flask + XGBoost Model)   │ │   (Prediction Storage)    │
└───────────────────────────┘ └───────────────────────────┘
```

1. **User Request**: The React Dashboard submits a transaction feature payload via Axios to the Node.js Express server (`POST /api/predictions`).
2. **API Gateway & Validation**: Express validates that all 30 required numeric features (`Time`, `V1`–`V28`, `Amount`) are present and properly typed.
3. **ML Inference**: Express forwards the validated features to the Python ML Inference Service (`POST /predict`).
4. **Model Execution**: Flask applies `StandardScaler` to `Time` and `Amount`, executes the trained `XGBClassifier`, and calculates fraud probability.
5. **Database Persistence**: Express receives the prediction output, stores the document in MongoDB, and returns the result to React.
6. **UI Update**: React displays the classification badge (`NORMAL` vs `FRAUD DETECTED`), updates dashboard metrics, and refreshes the prediction log & charts in real-time.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Machine Learning** | Python 3, XGBoost, scikit-learn, Pandas, NumPy, joblib |
| **ML Inference API** | Python 3, Flask, Werkzeug |
| **Backend API Gateway** | Node.js, Express.js, Axios, Mongoose ODM, dotenv, CORS |
| **Database** | MongoDB (with automated `mongodb-memory-server` fallback) |
| **Frontend Dashboard** | React 18, Vite, Tailwind CSS, Recharts, Lucide Icons |

---

## 🤖 Machine Learning Pipeline & Methodology

- **Source Experimentation**: Derived directly from [`Credit_Card_Fraud_Detection.ipynb`](file:///C:/Users/USER/Downloads/Credit_Card_Fraud_Detection.ipynb).
- **Dataset**: Kaggle Credit Card Fraud Detection dataset (`creditcard.csv` — 284,807 transactions).
- **Class Imbalance Handling**: `XGBClassifier` with `scale_pos_weight = count(normal) / count(fraud)` (~577.28).
- **Preprocessing**: `StandardScaler` fitted on training data for `Time` and `Amount`. PCA features `V1` through `V28` remain unscaled.
- **Classification Threshold**: `0.5`
- **Model Metrics (Test Set)**:
  - **ROC-AUC**: `0.9726`
  - **PR-AUC**: `0.8791`
  - **Fraud Precision**: `0.8710`
  - **Fraud Recall**: `0.8265`
  - **Fraud F1-Score**: `0.8482`

---

## ⚙️ Environment Variables Reference

### 1. Python ML Service (`ml-service/`)
*(Optional environment configuration; defaults to port 5000)*
```env
PORT=5000
```

### 2. Node.js Express Backend (`server/.env`)
```env
PORT=8000
MONGODB_URI=mongodb://127.0.0.1:27017/credit_card_fraud
ML_SERVICE_URL=http://127.0.0.1:5000
```

### 3. React Frontend (`client/.env`)
```env
VITE_API_URL=http://127.0.0.1:8000
```

---

## 🚀 Local Setup & Execution Guide

### Prerequisite
Ensure Python 3 and Node.js (v18+) are installed on your machine.

---

### Step 1: Start Python ML Inference Service (`ml-service/`)
```bash
cd ml-service
pip install -r requirements.txt

# Train & generate model artifacts (if fraud_model.pkl is missing)
python train.py

# Start Flask server (Port 5000)
python app.py
```

---

### Step 2: Start Node.js Express Backend (`server/`)
```bash
cd server
npm install

# Start Express server (Port 8000)
npm start
```
*(Note: If a local MongoDB daemon is not running on port 27017, the server automatically starts an in-memory MongoDB instance for development).*

---

### Step 3: Start React Frontend Dashboard (`client/`)
```bash
cd client
npm install

# Start Vite dev server (Port 5173)
npm run dev
```

Open your browser at `http://127.0.0.1:5173` to access the live dashboard.

---

## 📡 API Contract Reference

### Node.js Express Endpoints (`http://127.0.0.1:8000`)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Service health status & ML connection check |
| `POST` | `/api/predictions` | Submit transaction features for ML inference & DB storage |
| `GET` | `/api/predictions` | Fetch recent prediction history (`?limit=20`) |
| `GET` | `/api/predictions/stats` | Aggregated dashboard statistics |

#### Sample Prediction Request (`POST /api/predictions`)
```json
{
  "Time": 406.0, "V1": -2.312226, "V2": 1.951992, "V3": -1.609850,
  "V4": 3.997905, "V5": -0.522187, "V6": -1.426545, "V7": -2.537387,
  "V8": 1.391657, "V9": -2.770089, "V10": -2.772272, "V11": 3.202033,
  "V12": -2.899907, "V13": -0.595221, "V14": -4.289253, "V15": 0.389724,
  "V16": -1.140747, "V17": -2.830055, "V18": -0.016822, "V19": 0.416955,
  "V20": 0.126910, "V21": 0.517237, "V22": -0.035049, "V23": -0.465211,
  "V24": 0.320198, "V25": 0.044519, "V26": 0.177839, "V27": 0.261145,
  "V28": -0.143275, "Amount": 0.0
}
```

#### Sample Prediction Response (`201 Created`)
```json
{
  "success": true,
  "prediction": 1,
  "fraud_probability": 0.999601,
  "is_fraud": true,
  "_id": "68cf10f3c559ca96377bd136",
  "createdAt": "2026-09-20T08:59:23.705Z"
}
```

---

## 📁 Repository Structure

```
credit-card-fraud/
├── ml-service/                 # Python Flask ML Inference Service
│   ├── app.py                  # Flask REST API server
│   ├── train.py                # Reproducible ML training script
│   ├── model/                  # Model artifacts directory
│   │   └── fraud_model.pkl     # Serialized XGBoost model & StandardScaler package
│   ├── requirements.txt        # Python dependency specification
│   └── README.md               # ML service documentation
├── server/                     # Node.js + Express Backend API Gateway
│   ├── src/
│   │   ├── config/             # Database connection & fallback config
│   │   ├── controllers/        # Express request controllers
│   │   ├── middleware/         # Centralized error handling middleware
│   │   ├── models/             # Mongoose Prediction schema
│   │   ├── routes/             # Express API routes
│   │   ├── services/           # Axios client for Python ML service
│   │   └── server.js           # Server entrypoint
│   ├── .env.example            # Backend environment template
│   ├── package.json            # Node.js dependencies
│   └── README.md               # Backend documentation
├── client/                     # React + Vite Frontend Dashboard
│   ├── src/
│   │   ├── components/         # Reusable UI components (Navbar, Stats, Form, Chart, History)
│   │   ├── pages/              # Main Dashboard page
│   │   ├── services/           # Axios API client
│   │   ├── App.jsx             # Root component
│   │   ├── main.jsx            # Entrypoint
│   │   └── index.css           # Tailwind CSS directives
│   ├── .env.example            # Frontend environment template
│   ├── vite.config.js          # Vite config
│   ├── tailwind.config.js      # Tailwind config
│   └── package.json            # Frontend dependencies
├── .gitignore                  # Root Git exclusions
└── README.md                   # Master System Documentation
```
