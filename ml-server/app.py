from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np

app = Flask(__name__)
CORS(app)

model = joblib.load("model.pkl")  
def calculate_future_value(monthly_investment, annual_return_percent, years):
    r = (annual_return_percent / 100) / 12  # monthly rate
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
    

# Clamp the return between 0% and 30% (sensible real-world range)
    predicted_return = max(0, min(predicted_return, 30))

    future_value = calculate_future_value(amount, predicted_return, horizon)

    recommendations = {
    "stocks": [],
    "sip": [],
    "etf": [],
    "expected_return": predicted_return,
    "future_value": future_value
}


    stock_list = [
        "Reliance Industries", "TCS", "Infosys", "ICICI Bank", "HDFC Bank",
        "SBI", "Axis Bank", "L&T", "ITC", "HUL"
    ]
    sip_list = [
        "SBI Bluechip Fund", "HDFC Equity Fund", "ICICI Prudential Value Discovery Fund"
    ]
    etf_list = [
        "Nifty 50 ETF", "Nifty Next 50 ETF", "Sensex ETF"
    ]

    # Use only preferred types
    if risk == "high":
        if "Stocks" in preferred:
            stock_amt = amount * 0.7
            per_stock = stock_amt / len(stock_list)
            for stock in stock_list:
                recommendations["stocks"].append({
                    "name": stock,
                    "amount": round(per_stock, 2)
                })
        if "ETFs" in preferred:
            etf_amt = amount * 0.3
            per_etf = etf_amt / len(etf_list)
            for etf in etf_list:
                recommendations["etf"].append({
                    "name": etf,
                    "amount": round(per_etf, 2)
                })

    elif risk == "medium":
        if "Stocks" in preferred:
            stock_amt = amount * 0.7
            limited_stocks = stock_list[:3]  # ✅ Choose only top 3 stocks
            per_stock = stock_amt / len(limited_stocks)
            for stock in limited_stocks:
                recommendations["stocks"].append({
                    "name": stock,
                    "amount": round(per_stock, 2)
                })
        if "SIPs" in preferred:
            sip_amt = amount * 0.6
            per_sip = sip_amt / len(sip_list)
            for sip in sip_list:
                recommendations["sip"].append({
                    "name": sip,
                    "amount": round(per_sip, 2)
                })
        if "ETFs" in preferred:
            etf_amt = amount * 0.4
            per_etf = etf_amt / len(etf_list)
            for etf in etf_list:
                recommendations["etf"].append({
                    "name": etf,
                    "amount": round(per_etf, 2)
                })

    else:  # low risk
        if "SIPs" in preferred:
            sip_amt = amount * 0.8
            for sip in sip_list[:2]:
                recommendations["sip"].append({
                    "name": sip,
                    "amount": round(sip_amt / 2, 2)
                })
        if "ETFs" in preferred:
            etf_amt = amount * 0.2
            recommendations["etf"].append({
                "name": etf_list[0],
                "amount": round(etf_amt, 2)
            })

    return jsonify(recommendations)


if __name__ == "__main__":
    app.run(port=8000, debug=True)
