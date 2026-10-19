from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import os
from model_code import fetch_transaction_data, predict_transaction

app = Flask(__name__)
CORS(app)

# ✅ Get the absolute path to the current file directory
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# ✅ Load models using absolute paths
model = joblib.load(os.path.join(BASE_DIR, "xgboost_model.pkl"))
scaler = joblib.load(os.path.join(BASE_DIR, "scaler.pkl"))
feature_columns = joblib.load(os.path.join(BASE_DIR, "feature_columns.pkl"))

@app.route('/')
def home():
    return jsonify({'message': 'Welcome to the Crypto Prediction API. Use POST /predict with a transaction hash.'})

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    tx_hash = data.get('transaction_hash')

    input_data = fetch_transaction_data(tx_hash)
    if input_data is None:
        return jsonify({'error': 'Invalid transaction hash'}), 400

    label, probability = predict_transaction(model, scaler, feature_columns, input_data)
    
    return jsonify({
        'transaction_hash': tx_hash,
        'label': label,
        'probability': {
            'Normal': float(probability[0]),
            'Suspicious': float(probability[1])
        }
    })

if __name__ == '__main__':
    app.run(debug=True)


