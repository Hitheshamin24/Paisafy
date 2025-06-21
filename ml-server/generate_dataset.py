import pandas as pd
import random
risk_map = {"low": 0, "medium": 1, "high": 2}
data = []
for _ in range(500):
    income = random.randint(20000, 200000)
    invest_amt = random.randint(1000, 25000)
    risk = random.choice(["low", "medium", "high"])
    horizon = random.randint(1, 10)
    risk_code = risk_map[risk]

    base_return = invest_amt*(0.05+0.03*risk_code)
    bonus = horizon * random.uniform(100, 300)
    expected_return = base_return+bonus

    data.append({
        "income": income,
        "amount_to_invest": invest_amt,
        "risk": risk_code,
        "horizon": horizon,
        "expected_return": round(expected_return, 2)

    })
df = pd.DataFrame(data)
df.to_csv("ml_datasets.csv", index=False)
print("Dataset created")
