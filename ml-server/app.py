import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import yfinance as yf

app = Flask(__name__)
CORS(app)


def load_amfi_nav_dict():
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
    url = "https://www.amfiindia.com/spages/NAVAll.txt"
    response = requests.get(url)
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


def calculate_future_value(monthly_investment, annual_return_percent, years):
    r = annual_return_percent / 100
    months = years * 12
    monthly_rate = r / 12  
    total_principal = monthly_investment * months
    
    # SIP future value formula
    fv = monthly_investment * (((1 + monthly_rate) ** months - 1) * (1 + monthly_rate) / monthly_rate)
    profit = fv - total_principal
    
    return round(fv, 2), round(total_principal, 2), round(profit, 2)



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

    if risk=="high":
        annual_return=20
    elif risk=="low":
        annual_return=10
    else:
        annual_return=15
    future_value,total_invested,profit = calculate_future_value(amount, annual_return, horizon)
    
    recommendations = {
        "stocks": [],
        "sip": [],
        "etf": [],
        "total_principal":total_invested,
        "expected_return": annual_return,
        "profit":profit,
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
    total_invested = 0

    # Allocation weights
    weights = {"stocks": 0, "etfs": 0, "sips": 0}
    if "Stocks" in preferred and risk in ["high", "medium"]:
        weights["stocks"] = 7
    if "ETFs" in preferred:
        weights["etfs"] = 2 if risk == "low" else 4 if risk == "medium" else 3
    if "SIPs" in preferred:
        weights["sips"] = 8 if risk == "low" else 6

    total_weight = sum(weights.values())
    allocations = {
        key: round((weights[key] / total_weight) * 100, 2) if total_weight else 0
        for key in weights
    }
    recommendations["allocations"] = allocations

    # ----------------- STOCKS -----------------
    if "Stocks" in preferred and risk in ["high", "medium"]:
        stock_amt = amount * (allocations["stocks"] / 100)
        remaining_stock_amt = stock_amt
        for name, symbol in stock_map.items():
            if remaining_stock_amt <= 0:
                break
            try:
                ticker = yf.Ticker(symbol)
                price = ticker.info.get("regularMarketPrice", 0)
                if price <= 0 or remaining_stock_amt < price:
                    continue
                qty = int(remaining_stock_amt // price)
                amt = round(qty * price, 2)
                remaining_stock_amt -= amt

                recommendations["stocks"].append({
                    "name": ticker.info.get("longName", name),
                    "symbol": symbol,
                    "price": price,
                    "quantity": qty,
                    "amount": amt
                })
            except Exception as e:
                print(f"Stock error: {e}")
                continue

    # ----------------- SIPs -----------------
    if "SIPs" in preferred:
        sip_amt = amount * (allocations["sips"] / 100)
        remaining_sip_amt = sip_amt
        sip_targets = list(sip_funds.keys())[:2] if risk == "low" else list(sip_funds.keys())

        for sip_name in sip_targets:
            amfi_code = sip_funds[sip_name]
            price = get_nav_from_amfi(amfi_code)
            if price and remaining_sip_amt >= price:
                qty = int(remaining_sip_amt // price)
                amt = round(qty * price, 2)
                remaining_sip_amt -= amt
            else:
                qty, amt = 0, 0

            recommendations["sip"].append({
                "name": sip_name,
                "symbol": f"AMFI-{amfi_code}",
                "description": "Real-time NAV from AMFI",
                "price": round(price, 2) if price else "N/A",
                "quantity": qty,
                "amount": amt if price else "N/A"
            })

    # ----------------- ETFs -----------------
    if "ETFs" in preferred:
        etf_amt = amount * (allocations["etfs"] / 100)
        remaining_etf_amt = etf_amt

        for etf in etf_list:
            symbol = etf_symbol_map.get(etf)
            if not symbol or remaining_etf_amt <= 0:
                continue
            try:
                ticker = yf.Ticker(symbol)
                price = ticker.info.get("regularMarketPrice", 0)
                if price <= 0 or remaining_etf_amt < price:
                    continue
                qty = int(remaining_etf_amt // price)
                amt = round(qty * price, 2)
                remaining_etf_amt -= amt

                recommendations["etf"].append({
                    "name": ticker.info.get("longName", etf),
                    "symbol": symbol,
                    "price": price,
                    "quantity": qty,
                    "amount": amt
                })
            except Exception as e:
                print(f"ETF error: {e}")
                continue
        
    for stock in recommendations["stocks"]:
        total_invested += stock.get("amount", 0)

    for sip in recommendations["sip"]:
        if isinstance(sip.get("amount"), (int, float)):
            total_invested += sip.get("amount", 0)

    for etf in recommendations["etf"]:
        total_invested += etf.get("amount", 0)

    remaining_amount = round(amount - total_invested, 2)
    recommendations["total_invested"] = round(total_invested, 2)
    recommendations["uninvested_amount"] = remaining_amount


    return jsonify(recommendations)


if __name__ == "__main__":
    app.run(port=8000, debug=True)
