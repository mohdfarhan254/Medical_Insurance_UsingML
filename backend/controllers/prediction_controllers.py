from flask import Blueprint, request, jsonify
from service.prediction_service import handle_prediction, get_history

prediction_bp = Blueprint('prediction_bp', __name__)

@prediction_bp.route('/predict', methods=['POST'])
def predict():
    response, status = handle_prediction(request)
    return jsonify(response), status

@prediction_bp.route('/history', methods=['GET'])
def history():
    response, status = get_history(request)
    return jsonify(response), status
