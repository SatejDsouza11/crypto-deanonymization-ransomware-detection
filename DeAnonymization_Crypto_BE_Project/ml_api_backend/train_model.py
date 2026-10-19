# train_model.py
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import classification_report, roc_auc_score
from xgboost import XGBClassifier
import joblib
import os

def load_data(file_path):
    try:
        df = pd.read_csv(file_path)
        print("Column names in the dataset:", df.columns.tolist())
        return df
    except FileNotFoundError:
        print(f"Error: File '{file_path}' not found.")
        return None
    except pd.errors.EmptyDataError:
        print(f"Error: File '{file_path}' is empty or invalid.")
        return None

def preprocess_data(df):
    if df is None:
        print("Error: No data to preprocess.")
        return None, None, None

    df['target'] = df['Transaction Flag'].apply(lambda x: 1 if x == 'Suspicious' else 0)

    numerical_features = ['Sent Amount(BTC)', 'Received Amount(BTC)']

    for col in numerical_features:
        df[col] = pd.to_numeric(df[col], errors='coerce')
        df[col].fillna(df[col].median(), inplace=True)

    df['amount_diff'] = df['Sent Amount(BTC)'] - df['Received Amount(BTC)']

    df['Date and Time'] = pd.to_datetime(df['Date and Time'], errors='coerce')
    df['year'] = df['Date and Time'].dt.year
    df['month'] = df['Date and Time'].dt.month
    df['day'] = df['Date and Time'].dt.day
    df['hour'] = df['Date and Time'].dt.hour

    for col in ['year', 'month', 'day', 'hour']:
        df[col].fillna(df[col].median(), inplace=True)

    df['num_inputs_outputs'] = np.random.randint(2, 11, size=len(df))

    feature_columns = [
        'Sent Amount(BTC)', 'Received Amount(BTC)', 'amount_diff',
        'year', 'month', 'day', 'hour', 'num_inputs_outputs'
    ]

    X = df[feature_columns]
    y = df['target']

    scaler = StandardScaler()
    X[['Sent Amount(BTC)', 'Received Amount(BTC)', 'amount_diff', 'num_inputs_outputs']] = scaler.fit_transform(
        X[['Sent Amount(BTC)', 'Received Amount(BTC)', 'amount_diff', 'num_inputs_outputs']]
    )

    return X, y, scaler

def train_model(X, y):
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    model = XGBClassifier(
        objective='binary:logistic',
        eval_metric='logloss',
        use_label_encoder=False,
        random_state=42,
        early_stopping_rounds=10
    )

    model.fit(X_train, y_train, eval_set=[(X_test, y_test)], verbose=False)

    y_pred = model.predict(X_test)
    print("Classification Report:")
    print(classification_report(y_test, y_pred, target_names=['Normal', 'Suspicious']))
    print("AUC-ROC Score:", roc_auc_score(y_test, model.predict_proba(X_test)[:, 1]))

    return model, X_train.columns

if __name__ == "__main__":
    file_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "Ransomware_Transaction_Dataset.csv")
    df = load_data(file_path)
    if df is not None:
        X, y, scaler = preprocess_data(df)
        if X is not None:
            model, feature_columns = train_model(X, y)
            joblib.dump(model, "xgboost_model.pkl")
            joblib.dump(scaler, "scaler.pkl")
            joblib.dump(feature_columns, "feature_columns.pkl")
            print("Saved model, scaler, and feature columns.")
        else:
            print("Error: Preprocessing failed.")
    else:
        print("Error: Data loading failed.")
