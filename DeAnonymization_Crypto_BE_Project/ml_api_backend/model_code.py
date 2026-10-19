# model_code.py
import pandas as pd
import requests
import re

def fetch_transaction_data(tx_hash):
    if not re.match(r'^[0-9a-fA-F]{64}$', tx_hash):
        print("Error: Invalid transaction hash. Must be a 64-character hexadecimal string.")
        return None
    try:
        url = f"https://api.blockcypher.com/v1/btc/main/txs/{tx_hash}"
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        data = response.json()
        
        sent_amount = sum(vout.get('value', 0) for vout in data.get('inputs', [])) / 1e8
        received_amount = sum(vout.get('value', 0) for vout in data.get('outputs', [])) / 1e8
        timestamp = pd.to_datetime(data.get('confirmed', data.get('received')))
        num_inputs_outputs = len(data.get('inputs', [])) + len(data.get('outputs', []))
        
        return {
            'Sent Amount(BTC)': sent_amount,
            'Received Amount(BTC)': received_amount,
            'Date and Time': timestamp,
            'num_inputs_outputs': num_inputs_outputs
        }
    except requests.RequestException as e:
        print(f"Error fetching transaction data: {str(e)}")
        return None

def predict_transaction(model, scaler, feature_columns, input_data):
    input_df = pd.DataFrame([input_data])
    
    input_df['amount_diff'] = input_df['Sent Amount(BTC)'] - input_df['Received Amount(BTC)']
    input_df['year'] = input_df['Date and Time'].dt.year
    input_df['month'] = input_df['Date and Time'].dt.month
    input_df['day'] = input_df['Date and Time'].dt.day
    input_df['hour'] = input_df['Date and Time'].dt.hour
    
    for col in ['year', 'month', 'day', 'hour']:
        input_df.loc[:, col] = input_df[col].fillna(input_df[col].median())
    
    input_df = input_df[feature_columns]
    
    input_df.loc[:, ['Sent Amount(BTC)', 'Received Amount(BTC)', 'amount_diff', 'num_inputs_outputs']] = scaler.transform(
        input_df[['Sent Amount(BTC)', 'Received Amount(BTC)', 'amount_diff', 'num_inputs_outputs']]
    )
    
    prediction = model.predict(input_df)
    probability = model.predict_proba(input_df)[0]
    
    return 'Suspicious' if prediction[0] == 1 else 'Normal', probability