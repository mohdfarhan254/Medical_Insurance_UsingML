from firebase_admin import auth as firebase_auth

def verify_firebase_token(token):
    try:
        decoded_token = firebase_auth.verify_id_token(token)
        return decoded_token['uid']
    except Exception as e:
        print("Token verification failed:", e)
        return None
