# test_api.py
import requests

url = "http://127.0.0.1:5000/predict"
# Replace with a valid 64-character Bitcoin transaction hash from https://blockchair.com/bitcoin
payload = {"transaction_hash": "cf64add6d43f9500ab2133b56f9043b381c0df16dd0a43e1ae80b64ce15592ba"}
headers = {"Content-Type": "application/json"}

response = requests.post(url, json=payload, headers=headers)
print("Status Code:", response.status_code)
print("Response:", response.json())