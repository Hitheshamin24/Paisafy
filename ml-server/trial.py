import requests

data = {
    "amountToInvest": 50000,
    "risk": "medium",
    "horizon": 5,
    "preferredTypes": ["Stocks", "SIPs", "ETFs"],
    "sectors": ["IT", "Banking"],
    "experience": "Beginner"
}

res = requests.post("http://127.0.0.1:8000/predict", json=data)
print(res.status_code, res.text)
