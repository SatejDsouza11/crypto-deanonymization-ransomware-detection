# De-Anonymization of Crypto Transactions

A full-stack BE major project that combines a **live cryptocurrency tracker** (React + 3D Bitcoin model) with a **machine-learning service that flags suspicious Bitcoin transactions** linked to ransomware activity. Paste a Bitcoin transaction hash and the system fetches the transaction from the blockchain, extracts features, and classifies it as **Normal** or **Suspicious** with a confidence score.

## Features

- **Live market data**: exchanges, coin list, coin detail pages and price charts (CoinGecko API)
- **3D Bitcoin model** rendered with React Three Fiber
- **Transaction analysis**: enter a 64-character Bitcoin transaction hash and get a Normal/Suspicious label with class probabilities
- **XGBoost classifier** trained on a labelled ransomware transaction dataset
- **REST API** (Flask) so the model can be used independently of the UI

## Architecture

```
React frontend (port 3000)
        |  POST /predict {transaction_hash}
        v
Flask API (port 5000) --> BlockCypher API (fetch tx)
        |
        v
Feature extraction -> StandardScaler -> XGBoost -> label + probability
```

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 18, React Router, Axios, Chart.js, React Three Fiber / drei |
| Backend | Python, Flask, Flask-CORS |
| ML | XGBoost, scikit-learn, pandas, joblib |
| Data sources | CoinGecko (market data), BlockCypher (transactions) |

## Project structure

```
.
├── public/                  # Static assets, 3D model (bitcoin.glb)
├── src/
│   ├── App.js               # Routes: /, /coins, /coins/:id, /model
│   └── components/          # Exchanges, Coins, CoinDetails, CoinChart, ModelPrediction, ...
├── ml_api_backend/
│   ├── app.py               # Flask API (GET /, POST /predict)
│   ├── model_code.py        # Fetch tx from BlockCypher + feature engineering + prediction
│   ├── train_model.py       # Trains XGBoost, saves .pkl artifacts
│   ├── xgboost_model.pkl    # Trained model
│   ├── scaler.pkl           # Fitted StandardScaler
│   ├── feature_columns.pkl  # Feature order used at training time
│   ├── test_api.py          # Example API call
│   └── requirements.txt
└── package.json
```

## Getting started

### Prerequisites
- Node.js 18+ and npm
- Python 3.10+

### 1. Backend (ML API)

```bash
cd ml_api_backend
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt
python app.py                    # runs on http://127.0.0.1:5000
```

> The pre-trained `.pkl` files are included. If you hit a version-mismatch warning on load, retrain (see below) with your installed scikit-learn/XGBoost versions.

### 2. Frontend

```bash
# from the project root
npm install
npm start                        # runs on http://localhost:3000
```

Open `http://localhost:3000/model` for the transaction analysis page.

### API usage

```bash
curl -X POST http://127.0.0.1:5000/predict \
  -H "Content-Type: application/json" \
  -d '{"transaction_hash": "<64-char-hex-tx-hash>"}'
```

Response:

```json
{
  "transaction_hash": "...",
  "label": "Suspicious",
  "probability": { "Normal": 0.12, "Suspicious": 0.88 }
}
```

## Retraining the model

The dataset (~89 MB, 216,261 transactions, 6 ransomware families) is **not stored in this repo** because of its size. Place `Ransomware_Transaction_Dataset.csv` in `ml_api_backend/` and run:

```bash
cd ml_api_backend
python train_model.py
```

This regenerates `xgboost_model.pkl`, `scaler.pkl` and `feature_columns.pkl`.

**Features used:** sent amount (BTC), received amount (BTC), amount difference, year, month, day, hour, number of inputs+outputs.
**Label:** `Transaction Flag` (Suspicious = 1, Normal = 0). The dataset is imbalanced (~85% Suspicious).

## Known limitations

- The training script fills `num_inputs_outputs` with random values (the dataset has no such column), while inference uses the real count, so this feature is not meaningful in the current model.
- The dataset is heavily imbalanced toward Suspicious, so accuracy alone is misleading; look at per-class precision/recall.
- The model uses only transaction-level features (amounts and time), not graph or address-clustering analysis.
- BlockCypher's free tier is rate limited.
- The frontend calls the API at `http://127.0.0.1:5000`; change this in `src/components/ModelPrediction.jsx` when deploying.
- Predictions are probabilistic indicators for research and education, not proof of illicit activity.

## Future work

- Real input/output counts and graph-based features (address clustering, transaction chaining)
- Class-imbalance handling (SMOTE, class weights) and model comparison
- Environment-based API URL configuration and Docker setup
- Explainability (SHAP) in the UI

## Acknowledgements

- Frontend base inspired by the open-source React Crypto Tracker with React Three Fiber
- Market data: [CoinGecko](https://www.coingecko.com/en/api), transaction data: [BlockCypher](https://www.blockcypher.com/dev/bitcoin/)

## Authors

Satej D'Souza and team: BE Major Project.

## License

Add a license of your choice (MIT is a common default).
