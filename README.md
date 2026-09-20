# Credit Card Fraud Detection Application

An end-to-end production-style Credit Card Fraud Detection platform built with Machine Learning, Node.js Express API backend, and React frontend.

## 📌 Project Overview

Credit card fraud detection is a binary classification problem where fraudulent transactions are much less frequent than legitimate transactions. This project builds a production-style application around a trained XGBoost classifier that handles class imbalance, scaled features, persistent prediction history in MongoDB, and dynamic analytics.

## 🏗️ Architecture

```
React Frontend (Phase 3 - Coming Soon)
      ↓ (HTTP / REST)
Node.js + Express Backend (Port 8000)
      ↓ (Axios HTTP POST)
Python ML Inference Service (Port 5000)
      ↓
Trained Fraud Detection Model (XGBoost)
```

## 🛠️ Tech Stack & System Components

### 1. Python ML Inference Service (`/ml-service`)
- **Framework**: Python 3 (Flask)
- **ML Engine**: XGBoost Classifier (`scale_pos_weight`) with `StandardScaler` preprocessing.
- **Libraries**: `scikit-learn`, `xgboost`, `pandas`, `numpy`, `joblib`
- **Port**: `http://127.0.0.1:5000`
- **Endpoints**:
  - `GET /health`: Health status and model metrics.
  - `POST /predict`: Fraud prediction inference endpoint.

### 2. Node.js Express Backend (`/server`)
- **Framework**: Node.js + Express.js
- **Database**: MongoDB (via Mongoose, with automated local in-memory fallback)
- **Libraries**: `express`, `axios`, `mongoose`, `cors`, `dotenv`
- **Port**: `http://127.0.0.1:8000`
- **Endpoints**:
  - `GET /api/health`: Health status & ML service connectivity.
  - `POST /api/predictions`: Validates input, executes ML inference, and persists records to MongoDB.
  - `GET /api/predictions`: Retrieves prediction history records.
  - `GET /api/predictions/stats`: Dynamic dashboard aggregations.

---

## 🚀 Quick Start Guide

### Step 1: Start Python ML Service
```bash
cd ml-service
pip install -r requirements.txt
python train.py
python app.py
```

### Step 2: Start Node.js Express Backend
```bash
cd server
npm install
npm start
```
