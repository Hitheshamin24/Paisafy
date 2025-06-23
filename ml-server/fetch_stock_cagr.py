import yfinance as yf
import pandas as pd

stocks = {
    "RELIANCE.NS": "Reliance Industries",
    "TCS.NS": "TCS",
    "INFY.NS": "Infosys",
    "HDFCBANK.NS": "HDFC Bank",
    "ICICIBANK.NS": "ICICI Bank",
    "ITC.NS": "ITC",
    "LT.NS": "Larsen & Toubro",
    "SBIN.NS": "SBI",
    "AXISBANK.NS": "Axis Bank",
    "HINDUNILVR.NS": "HUL"
}

def get_cagr(ticker, years=5):
    data = yf.download(ticker, period=f"{years}y")
    if len(data) == 0:
        return None
    start_price = data['Close'].iloc[0]
    end_price = data['Close'].iloc[-1]
    cagr = ((end_price / start_price) ** (1 / years)) - 1
    return round(cagr * 100, 2)

results = []
for symbol, name in stocks.items():
    cagr = get_cagr(symbol)
    if cagr is not None:
        results.append({"Stock": name, "Ticker": symbol, "5Y_CAGR(%)": cagr})

df = pd.DataFrame(results)
df.to_csv("5y_cagr_stock_data.csv", index=False)
print("✅ 5-Year CAGR data saved to 5y_cagr_stock_data.csv")
