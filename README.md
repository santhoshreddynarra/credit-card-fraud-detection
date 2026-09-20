# FraudShield — Credit Card Fraud Detection Platform

A production-style, end-to-end fintech security web application for real-time Credit Card Fraud Risk Analysis built with **Python (Flask + XGBoost)**, **Node.js (Express + MongoDB Atlas)**, and **React (Vite + Tailwind CSS + Recharts)**.

---

## 1. Project Overview

**FraudShield** is a commercial-grade fraud monitoring platform designed to evaluate financial transaction risk in real time. Rather than operating as a simple demo or Jupyter notebook script, FraudShield implements a decoupled microservice architecture: a **Python Flask inference service** hosts the trained machine learning model, a **Node.js / Express API gateway** handles user authentication and audit persistence in **MongoDB Atlas**, and a **React single-page application** provides an enterprise dashboard interface.

---

## 2. Problem Statement

Financial fraud detection presents unique engineering and machine learning challenges:
- **Severe Class Imbalance**: In real-world credit card datasets, fraudulent transactions represent less than 0.2% of total volume (492 fraud cases out of 284,807 transactions).
- **Latency & Reliability**: Risk scoring must be executed within milliseconds without impacting checkout user experience.
- **Data Isolation & Security**: Prediction history, financial telemetry, and user credentials must be protected through secure authentication and tenant-level data isolation.

---

## 3. Key Features

- **Decoupled ML Inference**: High-speed XGBoost prediction microservice decoupled from the web application API gateway.
- **Production Authentication**: Secure user sign-up (`/register`), login (`/login`), and session persistence using `bcryptjs` password hashing and `JWT` tokens.
- **Strict User Data Isolation**: Prediction history and aggregate statistics are strictly isolated by authenticated `userId` extracted from server-validated JWT tokens.
- **User-Friendly Transaction Form**: Prominently features primary transaction attributes (**Amount**, **Elapsed Time**) with a collapsible section for 28 PCA feature inputs (`V1`–`V28`). Includes pre-validated demo sample presets.
- **Clear Risk Scoring UI**: Displays risk status (`Potential Fraud Detected` vs `Transaction Appears Legitimate`), risk level badges (`High`, `Medium`, `Low`), exact fraud probability percentages, and a clear model disclaimer accordion.
- **Searchable Prediction History**: User-isolated history log with live search, result filters (`All`, `Fraud`, `Legitimate`), risk sorting (`Highest Risk`, `Lowest Risk`, `Newest`, `Oldest`), and an interactive 30-feature inspection modal.

---

## 4. System Architecture

```text
┌─────────────────────────────────────────────────────────────┐
│                 React Frontend Dashboard                    │
│              (Vite SPA - Deployed on Vercel)                │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTPS REST API Requests (VITE_API_URL)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                Node.js / Express API Gateway                │
│             (JWT Auth & Middleware - Deployed on Render)    │
└───────────────┬─────────────────────────────┬───────────────┘
                │                             │
    HTTPS Proxy │ (ML_SERVICE_URL)            │ Mongoose ODM (MONGODB_URI)
                ▼                             ▼
┌───────────────────────────────┐ ┌───────────────────────────┐
│     Python ML Microservice    │ │      MongoDB Atlas        │
│  (Flask Server - Render)      │ │   (Cloud NoSQL Database)  │
└───────────────────────────────┘ └───────────────────────────┘
```

### Why Decouple the Python ML Service from the Node.js Backend?

1. **Ecosystem Optimization**: Python provides superior libraries for numerical computing, matrix transformations, and machine learning (`scikit-learn`, `xgboost`, `pandas`), whereas Node.js excels at asynchronous I/O, user authentication, and REST API routing.
2. **Independent Scaling**: Inference microservices are compute-heavy and CPU-bound, whereas API gateways are memory and network I/O-bound. Decoupling allows independent horizontal scaling of the ML service without overloading web API processes.
3. **Model Versioning & Deployment**: ML models can be retrained, versioned, or swapped independently without modifying web application code or restarting core Express backend services.

---

## 5. Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Machine Learning** | Python 3, XGBoost Classifier, scikit-learn, Pandas, NumPy, joblib |
| **ML Microservice** | Python 3, Flask, Flask-CORS, Gunicorn WSGI |
| **Backend Gateway** | Node.js, Express.js, Axios, Mongoose ODM, jsonwebtoken, bcryptjs, CORS |
| **Database** | MongoDB Atlas (Cloud NoSQL Database) |
| **Frontend UI** | React 18, Vite, Tailwind CSS, Recharts, Lucide Icons, React Router |

---

## 6. Machine Learning Approach

- **Class Imbalance Strategy**: The dataset exhibits extreme positive class imbalance (0.172% fraud). Standard accuracy models fail by predicting 99.83% majority class. `XGBClassifier` was configured with positive weight tuning (`scale_pos_weight = count(negative) / count(positive) ≈ 577.28`) to penalize false negatives heavily.
- **Preprocessing Pipeline**: `StandardScaler` fitted on the training split scales `Time` and `Amount`. The 28 PCA-transformed features (`V1` through `V28`) are passed unscaled as provided in the dataset.
- **Decision Threshold**: `0.5` decision threshold maps prediction probabilities to class labels.

---

## 7. Dataset Overview

- **Source**: Kaggle Credit Card Fraud Detection Dataset (European cardholder transactions).
- **Total Samples**: 284,807 transactions.
- **Class Breakdown**:
  - **Legitimate (Class 0)**: 284,315 transactions (99.828%)
  - **Fraudulent (Class 1)**: 492 transactions (0.172%)
- **Feature Structure**:
  - `Time`: Seconds elapsed between each transaction and the first transaction in the dataset.
  - `Amount`: Transaction monetary amount.
  - `V1`–`V28`: Principal components obtained with PCA transformation due to confidentiality constraints.

---

## 8. Model & Inference Specifications

- **Classifier**: `xgboost.XGBClassifier`
- **Feature Count**: Exactly 30 numerical inputs in required order: `['Time', 'V1', 'V2', ..., 'V28', 'Amount']`
- **Scaler Artifact**: `scaler.pkl` (`StandardScaler` object fit on `Time` and `Amount`)
- **Model Artifact**: `fraud_model.pkl`

---

## 9. Model Evaluation Metrics

In severely imbalanced fraud detection tasks, **raw Accuracy is misleading** (a naive model predicting all normal transactions achieves 99.83% accuracy while missing 100% of fraud). The model was evaluated using precision, recall, and area-under-curve metrics:

| Metric | Score | Explanation |
| :--- | :--- | :--- |
| **ROC-AUC** | `0.9726` | Area under the Receiver Operating Characteristic curve |
| **PR-AUC** | `0.8791` | Precision-Recall Area Under Curve (primary metric for imbalanced data) |
| **Precision (Fraud)** | `0.8710` | Percentage of flagged transactions that were truly fraudulent |
| **Recall (Fraud)** | `0.8265` | Percentage of actual fraudulent transactions successfully captured |
| **F1-Score (Fraud)** | `0.8482` | Harmonic mean of precision and recall |

---

## 10. Authentication & Security Architecture

- **Password Hashing**: Passwords hashed using `bcryptjs` with salt rounds prior to persistence.
- **JWT Verification**: Tokens signed with `JWT_SECRET` (`7d` validity) and validated server-side by `server/src/middleware/auth.js`.
- **Tenant Data Isolation**: Express controllers extract `req.user.id` strictly from the decoded JWT token. Client-provided user IDs are ignored, ensuring User A cannot query or view User B's predictions or statistics.
- **Sanitized Errors**: Error responses return user-safe messages without exposing raw Python tracebacks, database URIs, or stack traces.

---

## 11. End-to-End Prediction Flow

```
1. User enters 30 transaction parameters in React PredictionForm.jsx.
2. React sends POST /api/predictions with JWT Bearer header to Express API Gateway.
3. Express auth middleware validates JWT token and attaches req.user.id.
4. Express mlService.predictFraud() proxies the 30 feature vector to Python Flask service (POST /predict).
5. Python Flask extracts features in exact order: ['Time', 'V1'..'V28', 'Amount'].
6. Python Flask applies scaler.pkl to Time & Amount and passes all 30 features to fraud_model.pkl.
7. Python Flask returns { prediction: 0|1, fraud_probability: float, is_fraud: bool }.
8. Express saves the prediction in MongoDB Atlas linked to userId: req.user.id.
9. Express returns prediction result JSON to React for display.
```

---

## 12. Database Schema (MongoDB Atlas)

### **User Collection (`users`)**
```js
{
  _id: ObjectId,
  name: String,
  email: String, // Unique index, lowercase
  password: String, // Hashed via bcryptjs
  createdAt: Date,
  updatedAt: Date
}
```

### **Prediction Collection (`predictions`)**
```js
{
  _id: ObjectId,
  userId: ObjectId, // Indexed reference to users collection
  transactionData: { Time, V1...V28, Amount },
  prediction: Number, // 0 (Legitimate) or 1 (Fraud)
  fraudProbability: Number, // Range 0.0 to 1.0
  isFraud: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 13. API Endpoint Reference

### **Authentication API (`/api/auth`)**

| Method | Endpoint | Auth Required | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new user, hash password, return JWT |
| `POST` | `/api/auth/login` | Public | Authenticate user credentials, return JWT |
| `GET` | `/api/auth/me` | JWT | Get current authenticated user profile |
| `POST` | `/api/auth/logout` | Public | Invalidate client session token |

### **Prediction API (`/api/predictions`)**

| Method | Endpoint | Auth Required | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/predictions` | JWT | Submit 30 features for inference & MongoDB save |
| `GET` | `/api/predictions` | JWT | Get user-isolated prediction history (`?limit=20&page=1`) |
| `GET` | `/api/predictions/stats` | JWT | Get user-isolated aggregated statistics |
| `GET` | `/api/health` | Public | Backend health probe & Python ML connection status |

---

## 14. Environment Variables Reference

### **Express Backend (`server/.env`)**
```env
PORT=8000
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>
ML_SERVICE_URL=https://credit-card-fraud-detection-kdkf.onrender.com
JWT_SECRET=super_secret_jwt_key_credit_card_fraud_2026
CLIENT_URL=https://<your-vercel-app>.vercel.app
```

### **React Frontend (`client/.env`)**
```env
VITE_API_URL=https://credit-card-fraud-backend-rx3j.onrender.com
```

### **Python ML Microservice (`ml-service/`)**
```env
PORT=5000
```

---

## 15. Local Setup & Development

```bash
# 1. Clone Repository
git clone https://github.com/santhoshreddynarra/credit-card-fraud-detection.git
cd credit-card-fraud-detection

# 2. Run Python ML Service (Port 5000)
cd ml-service
pip install -r requirements.txt
python app.py

# 3. Run Express Backend Gateway (Port 8000)
cd ../server
npm install
npm start

# 4. Run React Frontend Dashboard (Port 5173)
cd ../client
npm install
npm run dev
```

---

## 16. Production Deployment Overview

- **Frontend**: Deployed on **Vercel** (`client/` root directory, Vite framework preset).
- **Backend API Gateway**: Deployed on **Render** as a Node.js Web Service (`server/` root directory).
- **Python ML Microservice**: Deployed on **Render** as a Python 3 Web Service (`ml-service/` root directory).
- **Database**: **MongoDB Atlas** Cloud M0 Cluster.

---

## 17. Application Screenshots

*(Screenshots of the Landing Page, Auth Views, Dashboard Analytics, Transaction Input Form, Prediction Result Card, and History Log Modal will be showcased here).*

---

## 18. Future Improvements

- **SHAP / LIME Explainability**: Visualizing individual feature contribution scores for each prediction.
- **Model Monitoring & Concept Drift**: Tracking feature input distribution shifts over time.
- **Configurable Decision Threshold**: Allowing risk analysts to tune the threshold slider dynamically in the UI.
