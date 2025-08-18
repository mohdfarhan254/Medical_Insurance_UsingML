import numpy as np
import pandas as pd
from datetime import datetime
from models.prediction import db, Prediction
from utils.ml_utils import model, explainer, feature_names
from service.auth_service import verify_firebase_token

def handle_prediction(request):
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return {'error': 'Unauthorized'}, 401

    token = auth_header.split('Bearer ')[1]
    uid = verify_firebase_token(token)
    if not uid:
        return {'error': 'Invalid or expired token'}, 403

    data = request.get_json()
    input_array = np.array([
        data['age'], data['sex'], data['bmi'],
        data['children'], data['smoker'], data['region']
    ]).reshape(1, -1)

    prediction = model.predict(input_array)[0]

    # SHAP
    shap_values = explainer.shap_values(input_array)
    shap_df = pd.DataFrame({
        'feature': feature_names,
        'contribution': shap_values[0]
    })
    top_contributors = shap_df.sort_values(
        by='contribution', key=abs, ascending=False
    ).head(3).to_dict(orient='records')

    all_contributors = shap_df.to_dict(orient='records')

    # Save to DB
    new_entry = Prediction(
        user_id=uid,
        age=data['age'],
        sex=data['sex'],
        bmi=data['bmi'],
        children=data['children'],
        smoker=data['smoker'],
        region=data['region'],
        result=prediction,
        timestamp=datetime.utcnow()
    )
    db.session.add(new_entry)
    db.session.commit()

    return {
        'predicted_charges': round(float(prediction), 2),
        'top_contributors': top_contributors,
        'all_contributors': all_contributors
    }, 200


def get_history(request):
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return {'error': 'Unauthorized'}, 401

    token = auth_header.split('Bearer ')[1]
    uid = verify_firebase_token(token)
    if not uid:
        return {'error': 'Invalid or expired token'}, 403

    predictions = Prediction.query.filter_by(user_id=uid).order_by(Prediction.timestamp.desc()).all()

    output = [{
        'age': p.age,
        'sex': p.sex,
        'bmi': p.bmi,
        'children': p.children,
        'smoker': p.smoker,
        'region': p.region,
        'result': round(p.result, 2),
        'timestamp': p.timestamp.strftime('%Y-%m-%d %H:%M')
    } for p in predictions]

    return output, 200
