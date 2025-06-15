from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


@app.route('/predict', methods=['POST'])
def predict():
    data = request.json

    income = data.get('income', 0)
    monthly_investment = data.get('amountToInvest', 0)
    risk = data.get('risk', 'medium')
    horizon_raw = data.get('horizon', 1)

    try:
        horizon = int(horizon_raw)
    except (TypeError, ValueError):
        return jsonify({"error": "Invalid value for horizon"}), 400

    # Determine time category
    if horizon <= 2:
        time_category = 'short'
    elif horizon <= 5:
        time_category = 'medium'
    else:
        time_category = 'long'

    # Define annual expected return per risk
    expected_rate_map = {
        "low": 0.06,
        "medium": 0.10,
        "high": 0.14
    }

    inflation_rate = 0.05
    annual_rate = expected_rate_map.get(risk, 0.10)

    # Convert to monthly values
    r = annual_rate / 12
    n = horizon * 12

    def sip_future_value(p, r, n):
        return p * (((1 + r) ** n - 1) / r) * (1 + r)

    def adjust_for_inflation(fv, inflation_rate, years):
        return round(fv / ((1 + inflation_rate) ** years), 2)

    # Determine investment split
    recommendations = {
        "stocks": [],
        "sip": [],
        "etf": [],
        "expected_return": 0,
    }

    total_monthly = 0

    if risk == "high":
        if time_category == "long":
            stock_amt = monthly_investment * 0.6
            etf_amt = monthly_investment * 0.4
            recommendations["stocks"].append(
                {"name": "Reliance Industries", "amount": stock_amt})
            recommendations["etf"].append(
                {"name": "Nifty 50 ETF", "amount": etf_amt})
            total_monthly = stock_amt + etf_amt
        else:
            recommendations["etf"].append(
                {"name": "Nifty 50 ETF", "amount": monthly_investment})
            total_monthly = monthly_investment
    elif risk == "medium":
        if time_category in ['medium', 'long']:
            sip_amt = monthly_investment * 0.7
            etf_amt = monthly_investment * 0.3
            recommendations["sip"].append(
                {"name": "SBI Bluechip Fund", "amount": sip_amt})
            recommendations["etf"].append(
                {"name": "Nifty Next 50 ETF", "amount": etf_amt})
            total_monthly = sip_amt + etf_amt
        else:
            recommendations["sip"].append(
                {"name": "ICICI Prudential Balanced Advantage", "amount": monthly_investment})
            total_monthly = monthly_investment
    else:
        recommendations["sip"].append(
            {"name": "HDFC Balanced Fund", "amount": monthly_investment})
        total_monthly = monthly_investment

    future_value = sip_future_value(total_monthly, r, n)
    real_return = adjust_for_inflation(future_value, inflation_rate, horizon)

    recommendations["expected_return"] = real_return

    return jsonify(recommendations)


if __name__ == "__main__":
    app.run(port=8000, debug=True)
