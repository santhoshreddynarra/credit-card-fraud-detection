import os
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import classification_report, roc_auc_score, average_precision_score
from xgboost import XGBClassifier
import joblib

def main():
    dataset_path = r'C:\Users\USER\Downloads\EDA\Dataset-20260410T060704Z-3-001\Dataset\creditcard.csv'
    if not os.path.exists(dataset_path):
        raise FileNotFoundError(f"Dataset not found at {dataset_path}")

    print(f"Loading dataset from {dataset_path}...")
    df = pd.read_csv(dataset_path)

    # Features (X) and Target (y) as defined in notebook
    X = df.drop("Class", axis=1)
    y = df["Class"]

    feature_names = X.columns.tolist()
    print(f"Dataset shape: {df.shape}")
    print(f"Features count: {len(feature_names)}")

    # 80/20 train-test split stratified on target column as in notebook
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    # Preprocessing: StandardScaler fitted ONLY on X_train for Time and Amount
    cols_to_scale = ["Time", "Amount"]
    scaler = StandardScaler()

    X_train_scaled = X_train.copy()
    X_test_scaled = X_test.copy()

    X_train_scaled[cols_to_scale] = scaler.fit_transform(X_train[cols_to_scale])
    X_test_scaled[cols_to_scale] = scaler.transform(X_test[cols_to_scale])

    # Calculate scale_pos_weight for XGBoost to handle class imbalance
    scale_pos_weight = len(y_train[y_train == 0]) / len(y_train[y_train == 1])
    print(f"Calculated scale_pos_weight: {scale_pos_weight:.4f}")

    # Initialize and train XGBoost classifier as per notebook Cell 60
    print("Training XGBoost Classifier...")
    xgb_model = XGBClassifier(
        scale_pos_weight=scale_pos_weight,
        eval_metric='logloss',
        random_state=42
    )
    xgb_model.fit(X_train_scaled, y_train)

    # Evaluate model performance on test set
    y_pred = xgb_model.predict(X_test_scaled)
    y_prob = xgb_model.predict_proba(X_test_scaled)[:, 1]

    roc_auc = roc_auc_score(y_test, y_prob)
    pr_auc = average_precision_score(y_test, y_prob)

    print("\n--- Test Set Evaluation ---")
    print(f"ROC-AUC Score: {roc_auc:.4f}")
    print(f"PR-AUC Score:  {pr_auc:.4f}")
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred, digits=4))

    # Save model, scaler, and metadata package
    output_dir = os.path.join(os.path.dirname(__file__), "model")
    os.makedirs(output_dir, exist_ok=True)

    pipeline_package = {
        "model": xgb_model,
        "scaler": scaler,
        "cols_to_scale": cols_to_scale,
        "feature_names": feature_names,
        "threshold": 0.5,
        "metrics": {
            "roc_auc": float(roc_auc),
            "pr_auc": float(pr_auc)
        }
    }

    pipeline_file = os.path.join(output_dir, "fraud_model.pkl")
    joblib.dump(pipeline_package, pipeline_file)
    print(f"\nPipeline package successfully saved to: {pipeline_file}")

if __name__ == "__main__":
    main()
