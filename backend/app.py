import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import numpy as np
import pandas as pd
import shap
import firebase_admin
from firebase_admin import credentials, auth as firebase_auth
from flask_mail import Mail, Message
from models import db, Prediction
from datetime import datetime

# 🔐 Initialize Firebase Admin SDK
cred_path = os.path.join(os.path.dirname(__file__), "serviceAccountKey.json")
cred = credentials.Certificate(cred_path)
firebase_admin.initialize_app(cred)

# 🚀 Flask app
app = Flask(__name__)
CORS(app)

# 🗄️ SQLite DB Config
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

# 📧 Mail Config
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USERNAME'] = 'mohdfarhan29102002@gmail.com'  # 🔁 Replace
app.config['MAIL_PASSWORD'] = ''     # 🔁 Replace (Use App Password)
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USE_SSL'] = False
mail = Mail(app)

# 📦 Load ML model
model_path = os.path.join(os.path.dirname(__file__), "best_xgb_model.pkl")
with open(model_path, "rb") as f:
    model = pickle.load(f)

# 🔍 SHAP Explainer
explainer = shap.TreeExplainer(model)
feature_names = ['age', 'sex', 'bmi', 'children', 'smoker', 'region']

# ✅ Firebase token verification
def verify_firebase_token(token):
    try:
        decoded_token = firebase_auth.verify_id_token(token)
        return decoded_token['uid']
    except Exception as e:
        print("Token verification failed:", e)
        return None

# 🔐 Prediction Route
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
    input_array = np.array([
        data['age'], data['sex'], data['bmi'],
        data['children'], data['smoker'], data['region']
    ]).reshape(1, -1)

    prediction = model.predict(input_array)[0]

    # SHAP Explainability
    shap_values = explainer.shap_values(input_array)
    shap_df = pd.DataFrame({
        'feature': feature_names,
        'contribution': shap_values[0]
    })

    top_contributors = shap_df.copy().sort_values(
        by='contribution', key=abs, ascending=False
    ).head(3).to_dict(orient='records')

    all_contributors = shap_df.to_dict(orient='records')

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

    return jsonify({
        'predicted_charges': round(float(prediction), 2),
        'top_contributors': top_contributors,
        'all_contributors': all_contributors
    })

# 📜 Get User Prediction History
@app.route('/history', methods=['GET'])
def get_user_history():
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return jsonify({'error': 'Unauthorized'}), 401

    token = auth_header.split('Bearer ')[1]
    uid = verify_firebase_token(token)
    if not uid:
        return jsonify({'error': 'Invalid or expired token'}), 403

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

    return jsonify(output)

# 📧 Send Health Email Reminder
@app.route('/send-reminder', methods=['POST'])
def send_reminder():
    data = request.get_json()
    email = data.get('email')

    msg = Message(
        subject='💡 Health Tip to Lower Your Insurance Premium',
        sender='your_email@gmail.com',
        recipients=[email],
        body="🏃 Stay active, eat healthy, and avoid smoking to reduce your premium. Predict and track your progress on FitInsure!"
    )

    try:
        mail.send(msg)
        return jsonify({'status': 'sent'})
    except Exception as e:
        print("Mail sending failed:", e)
        return jsonify({'error': 'Failed to send email'}), 500

# 🏁 Run Flask App
if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
