import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import yfinance as yf
import difflib

app = Flask(__name__)
CORS(app)

model = joblib.load("model.pkl")


def load_amfi_nav_dict():
    url = "https://www.amfiindia.com/spages/NAVAll.txt"
    response = requests.get(url)
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


# Load once globally (optional caching)
amfi_nav_dict = load_amfi_nav_dict()


def get_nav_from_amfi(amfi_code):
    url = "https://www.amfiindia.com/spages/NAVAll.txt"
    response = requests.get(url)
    if response.status_code != 200:
        return None

    nav_lines = response.text.splitlines()
    for line in nav_lines:
        parts = line.split(';')
        if len(parts) >= 6 and parts[0] == str(amfi_code):
            try:
                return float(parts[4])  # NAV value
            except ValueError:
                return None
    return None


def calculate_future_value(monthly_investment, annual_return_percent, years):
    r = (annual_return_percent / 100) / 12
    n = years * 12
    if r == 0:
        return round(monthly_investment * n, 2)
    fv = monthly_investment * (((1 + r) ** n - 1) / r) * (1 + r)
    return round(fv, 2)


@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    try:
        income = float(data.get('income', 0))
        amount = float(data.get('amountToInvest', 0))
        risk = data.get('risk', 'medium').lower()
        horizon = int(data.get('horizon', 1))
        preferred = data.get('preferredTypes', [])
    except (TypeError, ValueError):
        return jsonify({"error": "Invalid input values"}), 400

    risk_map = {"low": 0, "medium": 1, "high": 2}
    risk_encoded = risk_map.get(risk, 1)

    features = np.array([[income, amount, risk_encoded, horizon]])
    predicted_return = float(round(model.predict(features)[0], 2))
    predicted_return = max(0, min(predicted_return, 30))
    future_value = calculate_future_value(amount, predicted_return, horizon)

    recommendations = {
        "stocks": [],
        "sip": [],
        "etf": [],
        "expected_return": predicted_return,
        "future_value": future_value
    }

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

    # Exact AMFI scheme name map (you can expand this)
    sip_funds = {
        "Nippon India Small Cap Fund - Growth": "113177",
        "HDFC Hybrid Equity Fund - IDCW ": "119061",
        "ICICI Prudential US Bluechip Equity Fund - Direct Plan -IDCW": "120185",
    }

    etf_list = [
        "Nifty 50 ETF", "Nifty Next 50 ETF", "Sensex ETF"
    ]
    etf_symbol_map = {
        "Nifty 50 ETF": "NIFTYBEES.NS",
        "Nifty Next 50 ETF": "JUNIORBEES.NS",
        "Sensex ETF": "SENSEXBEES.NS"
    }

    # Stocks
    if "Stocks" in preferred and risk in ["high", "medium"]:
        stock_amt = amount * 0.7
        limited_stocks = list(stock_map.items()) if risk == "high" else list(
            stock_map.items())[:3]
        per_stock = stock_amt / len(limited_stocks)

        for name, symbol in limited_stocks:
            try:
                ticker = yf.Ticker(symbol)
                info = ticker.info
                recommendations["stocks"].append({
                    "name": info.get("longName", name),
                    "symbol": info.get("symbol", symbol),
                    # "description": info.get("longBusinessSummary", "No description available"),
                    "price": info.get("regularMarketPrice", 0),
                    "amount": round(per_stock, 2)
                })
            except Exception as e:
                print(f"Error fetching stock data for {name}: {e}")
                recommendations["stocks"].append({
                    "name": name,
                    "symbol": symbol,
                    "description": "Data not available",
                    "price": 0,
                    "amount": round(per_stock, 2)
                })

    if "SIPs" in preferred:
        sip_amt = amount * (0.8 if risk == "low" else 0.6)
        sip_targets = list(sip_funds.keys())[
            :2] if risk == "low" else list(sip_funds.keys())
        per_sip = sip_amt / len(sip_targets)

        for sip_name in sip_targets:
            amfi_code = sip_funds[sip_name]
            nav_price = get_nav_from_amfi(amfi_code)

            recommendations["sip"].append({
                "name": sip_name,
                "symbol": f"AMFI-{amfi_code}",
                "description": "Real-time NAV from AMFI",
                "price": round(nav_price, 2) if nav_price else "N/A",
                "amount": round(per_sip, 2)
            })

    # ETFs
    if "ETFs" in preferred:
        etf_amt = (
            amount * 0.2 if risk == "low"
            else amount * 0.4 if risk == "medium"
            else amount * 0.3
        )
        per_etf = etf_amt / len(etf_list)

        for etf in etf_list:
            symbol = etf_symbol_map.get(etf)
            try:
                if symbol:
                    ticker = yf.Ticker(symbol)
                    info = ticker.info
                    recommendations["etf"].append({
                        "name": info.get("longName", etf),
                        "symbol": symbol,
                        # "description": info.get("longBusinessSummary", "No description available"),
                        "price": info.get("regularMarketPrice", 0),
                        "amount": round(per_etf, 2)
                    })
                else:
                    raise ValueError("Symbol not found")
            except Exception as e:
                print(f"Error fetching ETF data for {etf}: {e}")
                recommendations["etf"].append({
                    "name": etf,
                    "symbol": etf,
                    # "description": "Data not available",
                    "price": 0,
                    "amount": round(per_etf, 2)
                })

    return jsonify(recommendations)


if __name__ == "__main__":
    app.run(port=8000, debug=True)
