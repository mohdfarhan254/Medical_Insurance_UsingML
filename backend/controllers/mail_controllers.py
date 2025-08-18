from flask import Blueprint, request, jsonify, current_app
from service.mail_service import send_health_email
from flask_mail import Mail

mail_bp = Blueprint('mail_bp', __name__)

@mail_bp.route('/send-reminder', methods=['POST'])
def send_reminder():
    data = request.get_json()
    email = data.get('email')

    # Access Mail instance via current_app
    mail = current_app.extensions.get('mail')

    response, status = send_health_email(mail, email)
    return jsonify(response), status
