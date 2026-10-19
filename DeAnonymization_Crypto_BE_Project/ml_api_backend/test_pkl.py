# test_pkl.py
import joblib

try:
    model = joblib.load("xgboost_model.pkl")
    print("Loaded xgboost_model.pkl successfully")
    scaler = joblib.load("scaler.pkl")
    print("Loaded scaler.pkl successfully")
    feature_columns = joblib.load("feature_columns.pkl")
    print("Loaded feature_columns.pkl successfully")
    print("Feature columns:", feature_columns)
except Exception as e:
    print(f"Error: {str(e)}")