import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import pandas as pd
import yfinance as yf
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.model_selection import train_test_split
import joblib
import os
from datetime import datetime, timedelta
import warnings
warnings.filterwarnings('ignore')

app = Flask(__name__)
CORS(app)

# Global variables for ML models
scaler = None
return_model = None
allocation_model = None
label_encoders = {}

def create_synthetic_training_data():
    """Create synthetic training data for the ML models"""
    np.random.seed(42)
    n_samples = 5000
    
    data = []
    for _ in range(n_samples):
        income = np.random.uniform(15000, 200000)
        amount = np.random.uniform(1000, min(income * 0.5, 100000))
        risk = np.random.choice(['low', 'medium', 'high'])
        horizon = np.random.randint(1, 21)
        goal = np.random.choice(['Wealth Creation', 'Retirement', 'Child Education', 'Short-Term Gains'])
        experience = np.random.choice(['Beginner', 'Intermediate', 'Expert'])
        
        # Preferred types based on risk and experience
        preferred_types = []
        if risk in ['medium', 'high']:
            preferred_types.append('Stocks')
        if risk == 'low' or np.random.random() > 0.5:
            preferred_types.append('SIPs')
        if np.random.random() > 0.6:
            preferred_types.append('ETFs')
        
        # Calculate expected returns based on risk and horizon
        base_return = {'low': 8, 'medium': 12, 'high': 18}[risk]
        horizon_bonus = min(horizon * 0.5, 5)  # Long-term bonus
        noise = np.random.normal(0, 2)
        expected_return = max(base_return + horizon_bonus + noise, 5)
        
        # Calculate allocations based on risk profile
        if risk == 'low':
            stock_alloc = np.random.uniform(0, 30)
            sip_alloc = np.random.uniform(50, 80)
            etf_alloc = max(0, 100 - stock_alloc - sip_alloc)
        elif risk == 'medium':
            stock_alloc = np.random.uniform(30, 60)
            sip_alloc = np.random.uniform(25, 50)
            etf_alloc = max(0, 100 - stock_alloc - sip_alloc)
        else:  # high risk
            stock_alloc = np.random.uniform(60, 85)
            sip_alloc = np.random.uniform(10, 30)
            etf_alloc = max(0, 100 - stock_alloc - sip_alloc)
        
        # Normalize allocations
        total_alloc = stock_alloc + sip_alloc + etf_alloc
        if total_alloc > 0:
            stock_alloc = (stock_alloc / total_alloc) * 100
            sip_alloc = (sip_alloc / total_alloc) * 100
            etf_alloc = (etf_alloc / total_alloc) * 100
        
        data.append({
            'income': income,
            'amount_to_invest': amount,
            'risk': risk,
            'horizon': horizon,
            'goal': goal,
            'experience': experience,
            'num_preferred_types': len(preferred_types),
            'expected_return': expected_return,
            'stock_allocation': stock_alloc,
            'sip_allocation': sip_alloc,
            'etf_allocation': etf_alloc
        })
    
    return pd.DataFrame(data)

def train_ml_models():
    """Train the ML models for return prediction and allocation"""
    global scaler, return_model, allocation_model, label_encoders
    
    print("Creating synthetic training data...")
    df = create_synthetic_training_data()
    
    # Prepare features
    categorical_features = ['risk', 'goal', 'experience']
    numerical_features = ['income', 'amount_to_invest', 'horizon', 'num_preferred_types']
    
    # Encode categorical variables
    label_encoders = {}
    for col in categorical_features:
        le = LabelEncoder()
        df[col + '_encoded'] = le.fit_transform(df[col])
        label_encoders[col] = le
    
    # Feature columns for training
    feature_cols = numerical_features + [col + '_encoded' for col in categorical_features]
    X = df[feature_cols]
    
    # Scale features
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    
    # Train return prediction model
    print("Training return prediction model...")
    y_return = df['expected_return']
    return_model = RandomForestRegressor(n_estimators=100, random_state=42, max_depth=10)
    return_model.fit(X_scaled, y_return)
    
    # Train allocation models
    print("Training allocation models...")
    y_allocations = df[['stock_allocation', 'sip_allocation', 'etf_allocation']]
    allocation_model = RandomForestRegressor(n_estimators=100, random_state=42, max_depth=10)
    allocation_model.fit(X_scaled, y_allocations)
    
    # Save models
    joblib.dump(scaler, 'models/scaler.pkl')
    joblib.dump(return_model, 'models/return_model.pkl')
    joblib.dump(allocation_model, 'models/allocation_model.pkl')
    joblib.dump(label_encoders, 'models/label_encoders.pkl')
    
    print("Models trained and saved successfully!")

def load_ml_models():
    """Load pre-trained ML models"""
    global scaler, return_model, allocation_model, label_encoders
    
    try:
        if not os.path.exists('models'):
            os.makedirs('models')
        
        if (os.path.exists('models/scaler.pkl') and 
            os.path.exists('models/return_model.pkl') and 
            os.path.exists('models/allocation_model.pkl') and 
            os.path.exists('models/label_encoders.pkl')):
            
            scaler = joblib.load('models/scaler.pkl')
            return_model = joblib.load('models/return_model.pkl')
            allocation_model = joblib.load('models/allocation_model.pkl')
            label_encoders = joblib.load('models/label_encoders.pkl')
            print("Models loaded successfully!")
        else:
            print("Models not found. Training new models...")
            train_ml_models()
    except Exception as e:
        print(f"Error loading models: {e}. Retraining...")
        train_ml_models()

def predict_investment_parameters(income, amount, risk, horizon, goal, experience, preferred_types):
    """Use ML models to predict expected returns and allocations"""
    global scaler, return_model, allocation_model, label_encoders
    
    # Prepare input features
    features = {
        'income': income,
        'amount_to_invest': amount,
        'horizon': horizon,
        'num_preferred_types': len(preferred_types),
        'risk': risk,
        'goal': goal,
        'experience': experience
    }
    
    # Create feature vector
    feature_vector = []
    
    # Numerical features
    numerical_features = ['income', 'amount_to_invest', 'horizon', 'num_preferred_types']
    for feature in numerical_features:
        feature_vector.append(features[feature])
    
    # Categorical features
    categorical_features = ['risk', 'goal', 'experience']
    for feature in categorical_features:
        if feature in label_encoders:
            try:
                encoded_val = label_encoders[feature].transform([features[feature]])[0]
            except ValueError:
                # Handle unseen categories
                encoded_val = 0
            feature_vector.append(encoded_val)
        else:
            feature_vector.append(0)
    
    # Scale features
    X_scaled = scaler.transform([feature_vector])
    
    # Predict expected return
    expected_return = return_model.predict(X_scaled)[0]
    expected_return = max(5, min(expected_return, 25))  # Clamp between 5-25%
    
    # Predict allocations
    allocations = allocation_model.predict(X_scaled)[0]
    stock_alloc, sip_alloc, etf_alloc = allocations
    
    # Normalize allocations to sum to 100%
    total_alloc = stock_alloc + sip_alloc + etf_alloc
    if total_alloc > 0:
        stock_alloc = (stock_alloc / total_alloc) * 100
        sip_alloc = (sip_alloc / total_alloc) * 100
        etf_alloc = (etf_alloc / total_alloc) * 100
    
    # Adjust allocations based on preferred types
    if 'Stocks' not in preferred_types:
        sip_alloc += stock_alloc * 0.7
        etf_alloc += stock_alloc * 0.3
        stock_alloc = 0
    
    if 'SIPs' not in preferred_types:
        stock_alloc += sip_alloc * 0.6
        etf_alloc += sip_alloc * 0.4
        sip_alloc = 0
    
    if 'ETFs' not in preferred_types:
        stock_alloc += etf_alloc * 0.5
        sip_alloc += etf_alloc * 0.5
        etf_alloc = 0
    
    return {
        'expected_return': expected_return,
        'stock_allocation': max(0, stock_alloc),
        'sip_allocation': max(0, sip_alloc),
        'etf_allocation': max(0, etf_alloc)
    }

def load_amfi_nav_dict():
    """Load AMFI NAV data"""
    url = "https://www.amfiindia.com/spages/NAVAll.txt"
    headers = {'User-Agent': 'Mozilla/5.0'}

    try:
        response = requests.get(url, headers=headers, timeout=10)
        lines = response.text.splitlines()

        nav_data = {}
        for line in lines:
            if ';' not in line:
                continue
            parts = line.split(';')
            if len(parts) >= 5:
                scheme_name = parts[3].strip()
                try:
                    nav = float(parts[4].strip())
                    nav_data[scheme_name] = nav
                except:
                    continue
        return nav_data
    except Exception as e:
        print(f"Error loading AMFI NAV data: {e}")
        return {}

def get_nav_from_amfi(amfi_code):
    """Get NAV from AMFI for a specific code"""
    url = "https://www.amfiindia.com/spages/NAVAll.txt"
    try:
        response = requests.get(url, timeout=10)
        if response.status_code != 200:
            return None

        nav_lines = response.text.splitlines()
        for line in nav_lines:
            parts = line.split(';')
            if len(parts) >= 6 and parts[0] == str(amfi_code):
                try:
                    return float(parts[4])
                except ValueError:
                    return None
        return None
    except:
        return None

def calculate_future_value(monthly_investment, annual_return_percent, years):
    """Calculate SIP future value"""
    r = annual_return_percent / 100
    months = years * 12
    monthly_rate = r / 12  
    total_principal = monthly_investment * months
    
    if monthly_rate == 0:
        fv = total_principal
    else:
        fv = monthly_investment * (((1 + monthly_rate) ** months - 1) * (1 + monthly_rate) / monthly_rate)
    
    profit = fv - total_principal
    
    return round(fv, 2), round(total_principal, 2), round(profit, 2)

def get_stock_recommendations(amount, allocation_percentage):
    """Get stock recommendations with real-time prices"""
    stock_map = {
        "Reliance Industries": "RELIANCE.NS",
        "TCS": "TCS.NS",
        "Infosys": "INFY.NS",
        "ICICI Bank": "ICICIBANK.NS",
        "HDFC Bank": "HDFCBANK.NS",
        "SBI": "SBIN.NS",
        "Axis Bank": "AXISBANK.NS",
        "L&T": "LT.NS",
        "ITC": "ITC.NS",
        "HUL": "HINDUNILVR.NS"
    }
    
    recommendations = []
    stock_amt = amount * (allocation_percentage / 100)
    remaining_stock_amt = stock_amt
    
    for name, symbol in stock_map.items():
        if remaining_stock_amt <= 0:
            break
        try:
            ticker = yf.Ticker(symbol)
            info = ticker.info
            price = info.get("regularMarketPrice") or info.get("currentPrice", 0)
            
            if price <= 0 or remaining_stock_amt < price:
                continue
                
            qty = int(remaining_stock_amt // price)
            amt = round(qty * price, 2)
            remaining_stock_amt -= amt

            recommendations.append({
                "name": info.get("longName", name),
                "symbol": symbol,
                "price": price,
                "quantity": qty,
                "amount": amt
            })
        except Exception as e:
            print(f"Error fetching stock data for {symbol}: {e}")
            continue
    
    return recommendations

def get_etf_recommendations(amount, allocation_percentage):
    """Get ETF recommendations with real-time prices"""
    etf_symbol_map = {
        "Nifty 50 ETF": "NIFTYBEES.NS",
        "Nifty Next 50 ETF": "JUNIORBEES.NS",
        "Sensex ETF": "SENSEXBEES.NS"
    }
    
    recommendations = []
    etf_amt = amount * (allocation_percentage / 100)
    remaining_etf_amt = etf_amt

    for etf_name, symbol in etf_symbol_map.items():
        if remaining_etf_amt <= 0:
            break
        try:
            ticker = yf.Ticker(symbol)
            info = ticker.info
            price = info.get("regularMarketPrice") or info.get("currentPrice", 0)
            
            if price <= 0 or remaining_etf_amt < price:
                continue
                
            qty = int(remaining_etf_amt // price)
            amt = round(qty * price, 2)
            remaining_etf_amt -= amt

            recommendations.append({
                "name": info.get("longName", etf_name),
                "symbol": symbol,
                "price": price,
                "quantity": qty,
                "amount": amt
            })
        except Exception as e:
            print(f"Error fetching ETF data for {symbol}: {e}")
            continue

    return recommendations

def get_sip_recommendations(amount, allocation_percentage):
    """Get SIP recommendations with real-time NAV"""
    sip_funds = {
        "Nippon India Small Cap Fund - Growth": "113177",
        "HDFC Hybrid Equity Fund - IDCW": "119061",
        "ICICI Prudential US Bluechip Equity Fund - Direct Plan -IDCW": "120185",
    }
    
    recommendations = []
    sip_amt = amount * (allocation_percentage / 100)
    remaining_sip_amt = sip_amt

    for sip_name, amfi_code in sip_funds.items():
        if remaining_sip_amt <= 0:
            break
            
        price = get_nav_from_amfi(amfi_code)
        if price and remaining_sip_amt >= price:
            qty = int(remaining_sip_amt // price)
            amt = round(qty * price, 2)
            remaining_sip_amt -= amt
        else:
            qty, amt = 0, 0

        recommendations.append({
            "name": sip_name,
            "symbol": f"AMFI-{amfi_code}",
            "description": "Real-time NAV from AMFI",
            "price": round(price, 2) if price else "N/A",
            "quantity": qty,
            "amount": amt if price else "N/A"
        })

    return recommendations

@app.route('/predict', methods=['POST'])
def predict():
    """Main prediction endpoint using ML models"""
    data = request.json
    try:
        income = float(data.get('income', 0))
        amount = float(data.get('amountToInvest', 0))
        risk = data.get('risk', 'medium').lower()
        horizon = int(data.get('horizon', 1))
        goal = data.get('goal', 'Wealth Creation')
        experience = data.get('experience', 'Beginner')
        preferred = data.get('preferredTypes', [])
    except (TypeError, ValueError):
        return jsonify({"error": "Invalid input values"}), 400

    # Get ML predictions
    ml_predictions = predict_investment_parameters(
        income, amount, risk, horizon, goal, experience, preferred
    )
    
    expected_return = ml_predictions['expected_return']
    stock_allocation = ml_predictions['stock_allocation']
    sip_allocation = ml_predictions['sip_allocation']
    etf_allocation = ml_predictions['etf_allocation']
    
    # Calculate future value
    future_value, total_invested, profit = calculate_future_value(amount, expected_return, horizon)
    
    recommendations = {
        "recommendations": {
            "stocks": [],
            "sip": [],
            "etf": []
        },
        "total_principal": total_invested,
        "expected_return": expected_return,
        "profit": profit,
        "future_value": future_value,
        "allocations": {
            "stocks": {"percent": stock_allocation},
            "etf": {"percent": etf_allocation},
            "sip": {"percent": sip_allocation}
        }
    }

    total_actual_invested = 0

    # Get recommendations based on ML allocations
    if "Stocks" in preferred and stock_allocation > 0:
        stock_recs = get_stock_recommendations(amount, stock_allocation)
        recommendations["recommendations"]["stocks"] = stock_recs
        total_actual_invested += sum(stock.get("amount", 0) for stock in stock_recs)

    if "SIPs" in preferred and sip_allocation > 0:
        sip_recs = get_sip_recommendations(amount, sip_allocation)
        recommendations["recommendations"]["sip"] = sip_recs
        total_actual_invested += sum(
            sip.get("amount", 0) for sip in sip_recs 
            if isinstance(sip.get("amount"), (int, float))
        )

    if "ETFs" in preferred and etf_allocation > 0:
        etf_recs = get_etf_recommendations(amount, etf_allocation)
        recommendations["recommendations"]["etf"] = etf_recs
        total_actual_invested += sum(etf.get("amount", 0) for etf in etf_recs)

    remaining_amount = round(amount - total_actual_invested, 2)
    recommendations["total_invested"] = round(total_actual_invested, 2)
    recommendations["uninvested_amount"] = remaining_amount

    return jsonify(recommendations)

@app.route('/retrain', methods=['POST'])
def retrain_models():
    """Endpoint to retrain models with new data"""
    try:
        train_ml_models()
        load_ml_models()
        return jsonify({"message": "Models retrained successfully!"})
    except Exception as e:
        return jsonify({"error": f"Failed to retrain models: {str(e)}"}), 500

# Initialize ML models on startup
load_ml_models()

if __name__ == "__main__":
    app.run(port=8000, debug=True)