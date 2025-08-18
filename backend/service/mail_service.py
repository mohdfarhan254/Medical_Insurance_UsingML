from flask_mail import Message

def send_health_email(mail, email):
    msg = Message(
        subject='💡 Health Tip to Lower Your Insurance Premium',
        sender='your_email@gmail.com',
        recipients=[email],
        body="🏃 Stay active, eat healthy, and avoid smoking to reduce your premium. Predict and track your progress on FitInsure!"
    )

    try:
        mail.send(msg)
        return {'status': 'sent'}, 200
    except Exception as e:
        print("Mail sending failed:", e)
        return {'error': 'Failed to send email'}, 500
