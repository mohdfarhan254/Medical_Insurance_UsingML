# models.py

from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

# Initialize DB object
db = SQLAlchemy()

# 📦 Prediction Table
class Prediction(db.Model):
    __tablename__ = 'predictions'  # Explicit table name

    id = db.Column(db.Integer, primary_key=True)
    
    user_id = db.Column(db.String(128), nullable=False, index=True)  # Firebase UID

    age = db.Column(db.Integer, nullable=False, comment="Age of the user")
    sex = db.Column(db.Integer, nullable=False, comment="0 = Male, 1 = Female")
    bmi = db.Column(db.Float, nullable=False, comment="Body Mass Index")
    children = db.Column(db.Integer, nullable=False, comment="Number of children")
    smoker = db.Column(db.Integer, nullable=False, comment="0 = Yes, 1 = No")
    region = db.Column(db.Integer, nullable=False, comment="0=SE, 1=SW, 2=NE, 3=NW")

    result = db.Column(db.Float, nullable=False, comment="Predicted insurance charge")
    timestamp = db.Column(db.DateTime, default=datetime.utcnow, comment="Prediction time")

    def __repr__(self):
        return f"<Prediction User={self.user_id}, Result={self.result}>"
