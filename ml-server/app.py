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

def get_stock_recommendations(amount, allocation_percentage, preferred_sectors=None):
    """Get stock recommendations with real-time prices based on sector preferences"""
    # Comprehensive stock mapping with sectors
    stock_map = {
        # IT Sector
        "TCS": {"symbol": "TCS.NS", "sector": "IT"},
        "Infosys": {"symbol": "INFY.NS", "sector": "IT"},
        "HCL Technologies": {"symbol": "HCLTECH.NS", "sector": "IT"},
        "Wipro": {"symbol": "WIPRO.NS", "sector": "IT"},
        
        # Banking Sector
        "ICICI Bank": {"symbol": "ICICIBANK.NS", "sector": "Banking"},
        "HDFC Bank": {"symbol": "HDFCBANK.NS", "sector": "Banking"},
        "SBI": {"symbol": "SBIN.NS", "sector": "Banking"},
        "Axis Bank": {"symbol": "AXISBANK.NS", "sector": "Banking"},
        "Kotak Mahindra Bank": {"symbol": "KOTAKBANK.NS", "sector": "Banking"},
        
        # FMCG Sector
        "HUL": {"symbol": "HINDUNILVR.NS", "sector": "FMCG"},
        "ITC": {"symbol": "ITC.NS", "sector": "FMCG"},
        "Nestle India": {"symbol": "NESTLEIND.NS", "sector": "FMCG"},
        "Britannia": {"symbol": "BRITANNIA.NS", "sector": "FMCG"},
        
        # Pharma Sector
        "Sun Pharma": {"symbol": "SUNPHARMA.NS", "sector": "Pharma"},
        "Dr Reddys Labs": {"symbol": "DRREDDY.NS", "sector": "Pharma"},
        "Cipla": {"symbol": "CIPLA.NS", "sector": "Pharma"},
        "Divi's Labs": {"symbol": "DIVISLAB.NS", "sector": "Pharma"},
        
        # Energy Sector
        "Reliance Industries": {"symbol": "RELIANCE.NS", "sector": "Energy"},
        "ONGC": {"symbol": "ONGC.NS", "sector": "Energy"},
        "IOC": {"symbol": "IOC.NS", "sector": "Energy"},
        "BPCL": {"symbol": "BPCL.NS", "sector": "Energy"},
        
        # Automobile Sector
        "Maruti Suzuki": {"symbol": "MARUTI.NS", "sector": "Automobile"},
        "Tata Motors": {"symbol": "TATAMOTORS.NS", "sector": "Automobile"},
        "Bajaj Auto": {"symbol": "BAJAJ-AUTO.NS", "sector": "Automobile"},
        "Mahindra & Mahindra": {"symbol": "M&M.NS", "sector": "Automobile"},
        
        # Healthcare Sector
        "Apollo Hospitals": {"symbol": "APOLLOHOSP.NS", "sector": "Healthcare"},
        "Fortis Healthcare": {"symbol": "FORTIS.NS", "sector": "Healthcare"},
        "Max Healthcare": {"symbol": "MAXHEALTH.NS", "sector": "Healthcare"},
        
        # Infrastructure/General
        "L&T": {"symbol": "LT.NS", "sector": "Infrastructure"},
        "UltraTech Cement": {"symbol": "ULTRACEMCO.NS", "sector": "Infrastructure"},
    }
    
    recommendations = []
    stock_amt = amount * (allocation_percentage / 100)
    remaining_stock_amt = stock_amt
    
    print(f"Stock recommendations - Selected sectors: {preferred_sectors}")
    
    # If preferred sectors are specified, ensure we get stocks from ALL selected sectors
    if preferred_sectors and len(preferred_sectors) > 0:
        # Group stocks by sector
        stocks_by_sector = {}
        for name, data in stock_map.items():
            sector = data["sector"]
            if sector in preferred_sectors:
                if sector not in stocks_by_sector:
                    stocks_by_sector[sector] = []
                stocks_by_sector[sector].append((name, data))
        
        print(f"Stocks grouped by sector: {list(stocks_by_sector.keys())}")
        
        # Calculate how much to invest per sector (equal distribution)
        sectors_found = list(stocks_by_sector.keys())
        if not sectors_found:
            print("No stocks found for selected sectors, using default mix")
            # Fallback to top performers if no sector matches
            selected_stocks = list(stock_map.items())[:8]
        else:
            selected_stocks = []
            amount_per_sector = stock_amt / len(sectors_found)
            
            # Select stocks from each preferred sector
            for sector in sectors_found:
                sector_stocks = stocks_by_sector[sector]
                # Take up to 2-3 stocks per sector to ensure diversification
                stocks_per_sector = min(3, len(sector_stocks))
                selected_stocks.extend(sector_stocks[:stocks_per_sector])
                print(f"Selected {stocks_per_sector} stocks from {sector} sector")
    else:
        # Default to a diversified mix across all sectors
        selected_stocks = list(stock_map.items())[:10]
    
    # Now process the selected stocks
    for name, data in selected_stocks:
        if remaining_stock_amt <= 100:  # Stop if remaining amount is too small
            break
            
        try:
            symbol = data["symbol"]
            ticker = yf.Ticker(symbol)
            info = ticker.info
            price = info.get("regularMarketPrice") or info.get("currentPrice", 0)
            
            if price <= 0 or remaining_stock_amt < price:
                continue
                
            # Calculate investment amount for this stock
            # Distribute remaining amount across remaining stocks
            max_investment = remaining_stock_amt * 0.3  # Max 30% in one stock
            target_investment = min(max_investment, remaining_stock_amt / 2)  # Or half of remaining
            
            qty = int(target_investment // price)
            if qty == 0:
                qty = 1  # Buy at least 1 share if affordable
                
            amt = round(qty * price, 2)
            
            if amt > remaining_stock_amt:
                amt = remaining_stock_amt
                qty = int(amt // price)
                amt = round(qty * price, 2)
            
            if qty > 0 and amt > 0:
                remaining_stock_amt -= amt
                
                recommendations.append({
                    "name": info.get("longName", name),
                    "symbol": symbol,
                    "sector": data["sector"],
                    "price": price,
                    "quantity": qty,
                    "amount": amt,
                    "description": f"{data['sector']} sector stock"
                })
                print(f"Added stock: {name} from {data['sector']} sector - Amount: ₹{amt}")
                
        except Exception as e:
            print(f"Error fetching stock data for {symbol}: {e}")
            continue
    
    return recommendations

def get_etf_recommendations(amount, allocation_percentage, preferred_sectors=None):
    """Get ETF recommendations with real-time prices based on sector preferences"""
    # Comprehensive ETF mapping with sectors
    etf_map = {
        # Broad Market ETFs
        "Nifty 50 ETF": {"symbol": "NIFTYBEES.NS", "sector": "Broad Market"},
        "Nifty Next 50 ETF": {"symbol": "JUNIORBEES.NS", "sector": "Broad Market"},
        "Sensex ETF": {"symbol": "SENSEXBEES.NS", "sector": "Broad Market"},
        
        # Sector-specific ETFs
        "Nifty IT ETF": {"symbol": "NIFTIETF.NS", "sector": "IT"},
        "Nifty Bank ETF": {"symbol": "BANKBEES.NS", "sector": "Banking"},
        "Nifty Pharma ETF": {"symbol": "PHARMABEES.NS", "sector": "Pharma"},
        "Nifty FMCG ETF": {"symbol": "FMCGBEES.NS", "sector": "FMCG"},
        "Nifty Auto ETF": {"symbol": "AUTOBEES.NS", "sector": "Automobile"},
        "Nifty Energy ETF": {"symbol": "ENERGYBEES.NS", "sector": "Energy"},
    }
    
    recommendations = []
    etf_amt = amount * (allocation_percentage / 100)
    remaining_etf_amt = etf_amt
    
    print(f"ETF recommendations - Selected sectors: {preferred_sectors}")
    
    selected_etfs = []
    
    if preferred_sectors and len(preferred_sectors) > 0:
        # First, add sector-specific ETFs for each preferred sector
        for sector in preferred_sectors:
            for name, data in etf_map.items():
                if data["sector"] == sector:
                    selected_etfs.append((name, data))
                    print(f"Added sector ETF: {name} for {sector}")
        
        # Always add at least one broad market ETF for diversification
        broad_market_etf = list(etf_map.items())[0]  # First broad market ETF
        if broad_market_etf not in selected_etfs:
            selected_etfs.insert(0, broad_market_etf)  # Add at the beginning
            print(f"Added broad market ETF: {broad_market_etf[0]}")
    else:
        # Default to broad market ETFs
        selected_etfs = [(name, data) for name, data in etf_map.items() 
                        if data["sector"] == "Broad Market"]

    # If we have multiple ETFs, distribute the investment
    if len(selected_etfs) > 1:
        amount_per_etf = etf_amt / len(selected_etfs)
    else:
        amount_per_etf = etf_amt

    for etf_name, data in selected_etfs:
        if remaining_etf_amt <= 0:
            break
            
        try:
            symbol = data["symbol"]
            ticker = yf.Ticker(symbol)
            info = ticker.info
            price = info.get("regularMarketPrice") or info.get("currentPrice", 0)
            
            if price <= 0:
                continue
                
            # Use proportional amount or remaining amount, whichever is smaller
            target_amount = min(amount_per_etf, remaining_etf_amt)
            qty = int(target_amount // price)
            
            if qty == 0 and remaining_etf_amt >= price:
                qty = 1  # Buy at least 1 unit if affordable
                
            amt = round(qty * price, 2)
            
            if amt > remaining_etf_amt:
                amt = remaining_etf_amt
                qty = int(amt // price)
                amt = round(qty * price, 2)
            
            if qty > 0 and amt > 0:
                remaining_etf_amt -= amt
                
                recommendations.append({
                    "name": info.get("longName", etf_name),
                    "symbol": symbol,
                    "sector": data["sector"],
                    "price": price,
                    "quantity": qty,
                    "amount": amt,
                    "description": f"ETF tracking {data['sector']} sector"
                })
                print(f"Added ETF: {etf_name} from {data['sector']} - Amount: ₹{amt}")

        except Exception as e:
            print(f"Error fetching ETF data for {symbol}: {e}")
            continue

    return recommendations

def get_sip_recommendations(amount, allocation_percentage, preferred_sectors=None, risk_level="medium"):
    """Get SIP recommendations with real-time NAV based on sector preferences and risk"""
    # Enhanced SIP mapping with better sector coverage
    sip_funds = {
        # IT Sector funds
        "ICICI Prudential Technology Fund - Direct Growth": {
            "code": "120505", 
            "sector": "IT", 
            "risk": "high",
            "category": "Sector"
        },
        "Franklin India Technology Fund - Direct Growth": {
            "code": "112148", 
            "sector": "IT", 
            "risk": "high",
            "category": "Sector"
        },
        
        # Banking/Financial Sector funds
        "ICICI Prudential Banking & PSU Debt Fund - Direct Growth": {
            "code": "120276", 
            "sector": "Banking", 
            "risk": "low",
            "category": "Debt"
        },
        "SBI Banking & PSU Debt Fund - Direct Growth": {
            "code": "128690", 
            "sector": "Banking", 
            "risk": "low",
            "category": "Debt"
        },
        
        # Pharma/Healthcare funds
        "ICICI Prudential Pharma Healthcare - Direct Growth": {
            "code": "120513", 
            "sector": "Pharma", 
            "risk": "high",
            "category": "Sector"
        },
        "SBI Healthcare Opportunities Fund - Direct Growth": {
            "code": "119718", 
            "sector": "Healthcare", 
            "risk": "high",
            "category": "Sector"
        },
        
        # FMCG funds
        "ICICI Prudential FMCG Fund - Direct Growth": {
            "code": "120267", 
            "sector": "FMCG", 
            "risk": "medium",
            "category": "Sector"
        },
        
        # Auto/Automobile funds
        "Nippon India Power & Infra Fund - Direct Growth": {
            "code": "113141", 
            "sector": "Automobile", 
            "risk": "high",
            "category": "Sector"
        },
        
        # Energy funds
        "ICICI Prudential Infrastructure Fund - Direct Growth": {
            "code": "120274", 
            "sector": "Energy", 
            "risk": "high",
            "category": "Sector"
        },
        
        # Balanced/Hybrid - Medium Risk (for diversification)
        "HDFC Hybrid Equity Fund - Direct Growth": {
            "code": "119061", 
            "sector": "Balanced", 
            "risk": "medium",
            "category": "Hybrid"
        },
        "ICICI Prudential Balanced Advantage Fund - Direct Growth": {
            "code": "120244", 
            "sector": "Balanced", 
            "risk": "medium",
            "category": "Hybrid"
        },
        
        # Large Cap - Low to Medium Risk
        "Axis Bluechip Fund - Direct Growth": {
            "code": "120503", 
            "sector": "Large Cap", 
            "risk": "medium",
            "category": "Equity"
        },
        
        # Small Cap - High Risk
        "Nippon India Small Cap Fund - Growth": {
            "code": "113177", 
            "sector": "Small Cap", 
            "risk": "high",
            "category": "Equity"
        }
    }
    
    print(f"SIP recommendations - Selected sectors: {preferred_sectors}, Risk level: {risk_level}")
    
    # Risk-based filtering
    risk_preference = {
        "low": ["low", "medium"], 
        "medium": ["low", "medium", "high"], 
        "high": ["medium", "high"]
    }
    acceptable_risks = risk_preference.get(risk_level, ["medium"])
    
    selected_funds = []
    
    if preferred_sectors and len(preferred_sectors) > 0:
        # Enhanced sector mapping
        sector_mapping = {
            "IT": ["IT", "Technology"],
            "Banking": ["Banking", "Financial"],
            "Pharma": ["Pharma", "Healthcare"],
            "FMCG": ["FMCG", "Consumer"],
            "Energy": ["Energy", "Infrastructure", "Power"],
            "Automobile": ["Automobile", "Auto", "Infrastructure"],
            "Healthcare": ["Healthcare", "Pharma"]
        }
        
        # Find funds for each preferred sector
        for pref_sector in preferred_sectors:
            sector_funds_found = []
            mapped_sectors = sector_mapping.get(pref_sector, [pref_sector])
            
            for name, data in sip_funds.items():
                if data["risk"] in acceptable_risks:
                    fund_sector = data["sector"]
                    # Check if fund sector matches any mapped sector
                    if any(mapped.lower() in fund_sector.lower() or fund_sector.lower() in mapped.lower() 
                           for mapped in mapped_sectors):
                        sector_funds_found.append((name, data))
                        
            if sector_funds_found:
                # Take the best fund(s) for this sector
                selected_funds.extend(sector_funds_found[:2])  # Max 2 funds per sector
                print(f"Found {len(sector_funds_found)} funds for {pref_sector} sector")
            else:
                print(f"No specific funds found for {pref_sector} sector")
        
        # Always add at least one balanced fund for diversification
        balanced_funds = [(name, data) for name, data in sip_funds.items() 
                         if data["category"] == "Hybrid" and data["risk"] in acceptable_risks]
        if balanced_funds and not any(fund[1]["category"] == "Hybrid" for fund in selected_funds):
            selected_funds.append(balanced_funds[0])
            print("Added balanced fund for diversification")
    else:
        # Default selection based on risk level
        default_funds = [(name, data) for name, data in sip_funds.items() 
                        if data["risk"] in acceptable_risks]
        selected_funds = default_funds[:4]
    
    # Remove duplicates while preserving order
    unique_funds = []
    seen = set()
    for fund in selected_funds:
        if fund[0] not in seen:
            unique_funds.append(fund)
            seen.add(fund[0])
    
    recommendations = []
    sip_amt = amount * (allocation_percentage / 100)
    remaining_sip_amt = sip_amt
    
    # Distribute amount across selected funds
    if len(unique_funds) > 1:
        amount_per_fund = sip_amt / len(unique_funds)
    else:
        amount_per_fund = sip_amt

    for sip_name, data in unique_funds[:6]:  # Limit to 6 funds max
        if remaining_sip_amt <= 0:
            break
            
        amfi_code = data["code"]
        price = get_nav_from_amfi(amfi_code)
        
        if price and price > 0:
            # Calculate investment for this fund
            target_amount = min(amount_per_fund, remaining_sip_amt)
            qty = int(target_amount // price)
            
            if qty == 0 and remaining_sip_amt >= price:
                qty = 1  # Buy at least 1 unit
            
            amt = round(qty * price, 2)
            
            if amt > remaining_sip_amt:
                amt = remaining_sip_amt
                qty = int(amt // price)
                amt = round(qty * price, 2)
                
            if qty > 0:
                remaining_sip_amt -= amt
        else:
            qty, amt = 0, "N/A"

        recommendations.append({
            "name": sip_name,
            "symbol": f"AMFI-{amfi_code}",
            "description": f"{data['category']} Fund - {data['sector']} Focus - {data['risk'].title()} Risk",
            "sector": data["sector"],
            "risk": data["risk"],
            "category": data["category"],
            "price": round(price, 2) if price else "N/A",
            "quantity": qty,
            "amount": amt if isinstance(amt, (int, float)) else "N/A"
        })
        
        if isinstance(amt, (int, float)) and amt > 0:
            print(f"Added SIP: {sip_name} from {data['sector']} - Amount: ₹{amt}")

    return recommendations

@app.route('/predict', methods=['POST'])
def predict():
    """Main prediction endpoint using ML models"""
    data = request.json
    print(f"Received data: {data}")  # Debug log
    
    try:
        income = float(data.get('income', 0))
        amount = float(data.get('amountToInvest', 0))
        risk = data.get('risk', 'medium').lower()
        horizon = int(data.get('horizon', 1))
        goal = data.get('goal', 'Wealth Creation')
        experience = data.get('experience', 'Beginner')
        preferred = data.get('preferredTypes', [])
        sectors = data.get('sectors', [])  # Add sectors field
        
        print(f"Parsed sectors: {sectors}")  # Debug log
        print(f"Preferred types: {preferred}")  # Debug log
        
    except (TypeError, ValueError) as e:
        print(f"Error parsing data: {e}")
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

    # Get recommendations based on ML allocations with debug logs
    print(f"Starting recommendations with sectors: {sectors}")
    
    if "Stocks" in preferred and stock_allocation > 0:
        print(f"Getting stock recommendations for sectors: {sectors}")
        stock_recs = get_stock_recommendations(amount, stock_allocation, sectors)
        print(f"Stock recommendations: {[s['name'] for s in stock_recs]}")
        recommendations["recommendations"]["stocks"] = stock_recs
        total_actual_invested += sum(stock.get("amount", 0) for stock in stock_recs)

    if "SIPs" in preferred and sip_allocation > 0:
        print(f"Getting SIP recommendations for sectors: {sectors}")
        sip_recs = get_sip_recommendations(amount, sip_allocation, sectors, risk)
        print(f"SIP recommendations: {[s['name'] for s in sip_recs]}")
        recommendations["recommendations"]["sip"] = sip_recs
        total_actual_invested += sum(
            sip.get("amount", 0) for sip in sip_recs 
            if isinstance(sip.get("amount"), (int, float))
        )

    if "ETFs" in preferred and etf_allocation > 0:
        print(f"Getting ETF recommendations for sectors: {sectors}")
        etf_recs = get_etf_recommendations(amount, etf_allocation, sectors)
        print(f"ETF recommendations: {[e['name'] for e in etf_recs]}")
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