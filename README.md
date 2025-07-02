# 🩺 Medical Insurance Cost Prediction

This project predicts medical insurance charges based on customer details like age, BMI, smoking status, etc.

## ✅ Models Compared

| Model              | Train R² | Test R² |
|-------------------|----------|---------|
| Linear Regression | 0.75     | 0.74    |
| Random Forest     | 0.98     | 0.87    |
| XGBoost (Tuned)   | 0.99     | 0.89    |

## 📊 Explainability (SHAP)

- SHAP plots show `smoker`, `age`, and `bmi` most influence charges.

## 💾 Saved Model

- `best_xgb_model.pkl`

## 🔧 Requirements

```bash
xgboost
shap
numpy
pandas
scikit-learn
matplotlib
