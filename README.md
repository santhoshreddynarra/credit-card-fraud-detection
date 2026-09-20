# Credit Card Fraud Detection System

A production-style end-to-end Machine Learning platform for real-time Credit Card Fraud Detection built with **Python (Flask + XGBoost)**, **Node.js (Express + MongoDB)**, and **React (Vite + Tailwind CSS + Recharts)**.

---

## 📌 Project Overview

Credit card fraud detection is a critical financial security application where fraudulent transactions represent a minute fraction of total transactions. This platform provides an end-to-end cloud architecture to evaluate live transaction feature inputs through a trained **XGBoost machine learning model**, store audit logs in **MongoDB**, and present dynamic risk analytics on a modern **React dashboard**.

---

## ✨ Features

- **Real-Time Fraud Inference**: Immediate risk classification (`NORMAL` vs `FRAUD DETECTED`) and precise fraud probability percentages.
- **Automated Feature Preprocessing**: `StandardScaler` normalization applied to transaction `Time` and `Amount` matching exact ML training specifications.
- **Dynamic Risk Analytics**: Recharts visualizations displaying class distributions and transaction proportion breakdowns.
- **Historical Audit Logs**: Persistent MongoDB logging of predictions, timestamps, and full feature payloads.
- **Preset Test Controls**: Pre-configured sample transactions for 1-click verification of legitimate and fraudulent scenarios.
- **Resilient Multi-Service Architecture**: Independent microservices with centralized error handling and health probes.

---

## 🏗️ System Architecture

```text
┌─────────────────────────────────────────────────────────────┐
│               React Frontend Dashboard                      │
│            (Deployed on Vercel - Vite SPA)                  │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTPS REST API Requests (VITE_API_URL)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                 Node.js Express API Gateway                 │
│             (Deployed on Render - Node.js Server)           │
└───────────────┬─────────────────────────────┬───────────────┘
                │                             │
    HTTPS Proxy │ (ML_SERVICE_URL)            │ Mongoose ODM (MONGODB_URI)
                ▼                             ▼
┌───────────────────────────────┐ ┌───────────────────────────┐
│     Python ML Service         │ │      MongoDB Atlas        │
│ (Deployed on Render - Flask)  │ │   (Cloud NoSQL Database)  │
└───────────────────────────────┘ └───────────────────────────┘
```

---

## 🛠️ Tech Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Machine Learning** | Python 3, XGBoost Classifier, scikit-learn, Pandas, NumPy, joblib |
| **ML Inference Service** | Python 3, Flask, Gunicorn WSGI Server |
| **Backend API Gateway** | Node.js, Express.js, Axios, Mongoose ODM, dotenv, CORS |
| **Database** | MongoDB Atlas (Cloud) / `mongodb-memory-server` (Local Fallback) |
| **Frontend Dashboard** | React 18, Vite, Tailwind CSS, Recharts, Lucide Icons |

---

## 🤖 Machine Learning Methodology

- **Experimentation Source**: Derived from [`Credit_Card_Fraud_Detection.ipynb`](file:///C:/Users/USER/Downloads/Credit_Card_Fraud_Detection.ipynb).
- **Dataset**: Kaggle Credit Card Fraud Detection dataset (284,807 transactions).
- **Class Imbalance Handling**: `XGBClassifier` with `scale_pos_weight = count(normal) / count(fraud)` (~577.28).
- **Preprocessing Pipeline**: `StandardScaler` fitted on training split for `Time` and `Amount`. PCA features (`V1` through `V28`) remain unscaled.
- **Classification Threshold**: `0.5`
- **Model Performance Metrics (Test Set)**:
  - **ROC-AUC**: `0.9726`
  - **PR-AUC**: `0.8791`
  - **Fraud Precision**: `0.8710`
  - **Fraud Recall**: `0.8265`
  - **Fraud F1-Score**: `0.8482`

---

## 📡 API Contract Reference

### Express Backend Endpoints (`/api`)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Health probe & Python ML service connectivity check |
| `POST` | `/api/predictions` | Submit transaction features for ML inference & MongoDB storage |
| `GET` | `/api/predictions` | Fetch recent prediction history (`?limit=20`) |
| `GET` | `/api/predictions/stats` | Aggregated dashboard statistics from MongoDB |

#### Sample Prediction Payload (`POST /api/predictions`)
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

## ⚙️ Environment Variables Reference

### 1. Python ML Service (`ml-service/`)
```env
PORT=5000
```

### 2. Node.js Express Backend (`server/.env`)
```env
PORT=8000
MONGODB_URI=mongodb://127.0.0.1:27017/credit_card_fraud
ML_SERVICE_URL=http://127.0.0.1:5000
CLIENT_URL=http://localhost:5173
```

### 3. React Frontend (`client/.env`)
```env
VITE_API_URL=http://127.0.0.1:8000
```

---

## 🚀 Local Setup & Development

```bash
# 1. Start Python ML Service (Port 5000)
cd ml-service
pip install -r requirements.txt
python app.py

# 2. Start Express Backend (Port 8000)
cd server
npm install
npm start

# 3. Start React Frontend Dashboard (Port 5173)
cd client
npm install
npm run dev
```

---

## 🌐 Production Deployment Guide

### Service 1: Database (MongoDB Atlas)
1. Sign in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a free **M0 Cluster**.
3. Under **Database Access**, create a database user and password.
4. Under **Network Access**, add IP Access List entry `0.0.0.0/0` (Allow Access from Anywhere).
5. Copy the connection string (`mongodb+srv://<username>:<password>@cluster.mongodb.net/credit_card_fraud`).

---

### Service 2: Python ML Service (Render)
1. Log into [Render](https://render.com) and click **New +** -> **Web Service**.
2. Connect your GitHub repository: `credit-card-fraud-detection`.
3. Configure settings:
   - **Name**: `credit-card-fraud-ml`
   - **Root Directory**: `ml-service`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app:app`
4. Copy the deployed service URL (e.g. `https://credit-card-fraud-ml.onrender.com`).

---

### Service 3: Express Backend Gateway (Render)
1. Click **New +** -> **Web Service** on Render.
2. Select your repository: `credit-card-fraud-detection`.
3. Configure settings:
   - **Name**: `credit-card-fraud-backend`
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Environment Variables:
   - `MONGODB_URI`: `<Your MongoDB Atlas Connection String>`
   - `ML_SERVICE_URL`: `https://credit-card-fraud-ml.onrender.com`
   - `CLIENT_URL`: `https://credit-card-fraud-detection.vercel.app`
5. Copy the deployed backend URL (e.g. `https://credit-card-fraud-backend.onrender.com`).

---

### Service 4: React Frontend Dashboard (Vercel)
1. Log into [Vercel](https://vercel.com) and click **Add New Project**.
2. Import your GitHub repository: `credit-card-fraud-detection`.
3. Configure settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Environment Variables:
   - `VITE_API_URL`: `https://credit-card-fraud-backend.onrender.com`
5. Click **Deploy**.

---

## 🖼️ Application Screenshots

*(Screenshots of the live React Dashboard, Statistics Cards, Risk Evaluation Banner, Recharts Analytics, and History Log can be added here).*

---

## 🔮 Future Improvements

- **SHAP / LIME Explainability**: Visualizing feature contribution scores for each prediction.
- **Model Monitoring & Concept Drift**: Tracking input distributions over time.
- **Threshold Tuning Control**: Allowing fraud analysts to adjust the decision threshold via the UI.
