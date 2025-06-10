from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    income = data.get('income', 0)
    amount = data.get('amountToInvest', 0)
    risk = data.get('risk', 'medium')
    horizon = int(data.get('horizon', 1))

    # Convert horizon to time category (optional logic)
    if horizon <= 2:
        time_category = 'short'
    elif horizon <= 5:
        time_category = 'medium'
    else:
        time_category = 'long'

    recommendations = {
        "stocks": [],
        "sip": [],
        "etf": []
    }

    # Sample logic combining risk + time horizon (you can expand this)
    if risk == "high":
        if time_category == 'long':
            recommendations["stocks"].append({"name": "Reliance Industries", "amount": amount * 0.6})
            recommendations["etf"].append({"name": "Nifty 50 ETF", "amount": amount * 0.4})
        else:
            recommendations["etf"].append({"name": "Nifty 50 ETF", "amount": amount})
    elif risk == "medium":
        if time_category == 'medium' or time_category == 'long':
            recommendations["sip"].append({"name": "SBI Bluechip Fund", "amount": amount * 0.7})
            recommendations["etf"].append({"name": "Nifty Next 50 ETF", "amount": amount * 0.3})
        else:
            recommendations["sip"].append({"name": "ICICI Prudential Balanced Advantage", "amount": amount})
    else:
        recommendations["sip"].append({"name": "HDFC Balanced Fund", "amount": amount})

    return jsonify(recommendations)

if __name__ == "__main__":
    app.run(port=8000, debug=True)
