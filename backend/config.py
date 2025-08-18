import os
import firebase_admin
from firebase_admin import credentials

class Config:
    SQLALCHEMY_DATABASE_URI = 'sqlite:///database.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    MAIL_SERVER = 'smtp.gmail.com'
    MAIL_PORT = 587
    MAIL_USERNAME = 'mohdfarhan29102002@gmail.com'
    MAIL_PASSWORD = ''  # 🔁 App Password here
    MAIL_USE_TLS = True
    MAIL_USE_SSL = False

# Initialize Firebase
cred_path = os.path.join(os.path.dirname(__file__), "serviceAccountKey.json")
cred = credentials.Certificate(cred_path)
firebase_admin.initialize_app(cred)
