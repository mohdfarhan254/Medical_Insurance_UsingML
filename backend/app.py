import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import numpy as np
import firebase_admin
from firebase_admin import credentials, auth as firebase_auth
from models import db, Prediction
from datetime import datetime

# 🔐 Initialize Firebase Admin SDK
cred_path = os.path.join(os.path.dirname(__file__), "serviceAccountKey.json")
cred = credentials.Certificate(cred_path)

firebase_admin.initialize_app(cred)

# ✅ Firebase token verification function
def verify_firebase_token(token):
    try:
        decoded_token = firebase_auth.verify_id_token(token)
        return decoded_token['uid']
    except Exception as e:
        print("Token verification failed:", e)
        return None

# 🚀 Initialize Flask app
app = Flask(__name__)
CORS(app)

# 🗄️ Configure SQLite DB
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

# 📦 Load ML model
model_path = os.path.join(os.path.dirname(__file__), "best_xgb_model.pkl")
with open(model_path, "rb") as f:
    model = pickle.load(f)

# 🔐 Prediction Route (Secured with Firebase token)
@app.route('/predict', methods=['POST'])
def predict():
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return jsonify({'error': 'Unauthorized'}), 401

    token = auth_header.split('Bearer ')[1]
    uid = verify_firebase_token(token)
    if not uid:
        return jsonify({'error': 'Invalid or expired token'}), 403

    data = request.get_json()

    # Prepare input
    input_array = np.array([
        data['age'], data['sex'], data['bmi'],
        data['children'], data['smoker'], data['region']
    ]).reshape(1, -1)

    # Make prediction
    prediction = model.predict(input_array)[0]

    # Save prediction to DB
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

    return jsonify({'predicted_charges': round(float(prediction),2)})

# 📜 History Route (user-specific)
@app.route('/history', methods=['GET'])
def get_user_history():
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return jsonify({'error': 'Unauthorized'}), 401

    token = auth_header.split('Bearer ')[1]
    uid = verify_firebase_token(token)
    if not uid:
        return jsonify({'error': 'Invalid or expired token'}), 403

    # Fetch all user’s past predictions
    user_predictions = Prediction.query.filter_by(user_id=uid).order_by(Prediction.timestamp.desc()).all()

    # Format data
    output = [{
        'age': p.age,
        'sex': p.sex,
        'bmi': p.bmi,
        'children': p.children,
        'smoker': p.smoker,
        'region': p.region,
        'result': round(p.result, 2),
        'timestamp': p.timestamp.strftime('%Y-%m-%d %H:%M')
    } for p in user_predictions]

    return jsonify(output)

# 🏁 Run the App
if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # Ensure tables are created
    app.run(debug=True)
