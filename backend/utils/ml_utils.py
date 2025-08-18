import os
import pickle
import shap

model_path = os.path.join(os.path.dirname(__file__), "..", "best_xgb_model.pkl")
with open(model_path, "rb") as f:
    model = pickle.load(f)

explainer = shap.TreeExplainer(model)
feature_names = ['age', 'sex', 'bmi', 'children', 'smoker', 'region']
