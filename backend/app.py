from flask import Flask
from flask_cors import CORS
from flask_mail import Mail
from models.prediction import db
from config import Config
from controllers.prediction_controllers import prediction_bp
from controllers.mail_controllers import mail_bp

# Initialize Flask
app = Flask(__name__)
app.config.from_object(Config)

# Init extensions
CORS(app)
db.init_app(app)
mail = Mail(app)

# Register Blueprints
app.register_blueprint(prediction_bp)
app.register_blueprint(mail_bp)

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
