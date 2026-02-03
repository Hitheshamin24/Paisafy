import numpy as np
import pandas as pd
import joblib
import os
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler, LabelEncoder

MODEL_DIR = "models"
os.makedirs(MODEL_DIR, exist_ok=True)

RANDOM_STATE = 42
N_SAMPLES = 7000

INVESTMENT_TYPES = ["Stocks", "SIPs", "ETFs"]

def create_synthetic_data(n_samples=N_SAMPLES):
    np.random.seed(RANDOM_STATE)
    rows = []

    for _ in range(n_samples):
        income = np.random.uniform(15000, 200000)
        amount = np.random.uniform(1000, min(income * 0.5, 100000))
        horizon = np.random.randint(1, 21)

        risk = np.random.choice(["low", "medium", "high"])
        goal = np.random.choice([
            "Wealth Creation",
            "Retirement",
            "Child Education",
            "Short-Term Gains"
        ])
        experience = np.random.choice([
            "Beginner",
            "Intermediate",
            "Expert"
        ])

        # -------- Preferred Types (CRITICAL) --------
        num_types = np.random.randint(1, 4)
        preferred_types = np.random.choice(
            INVESTMENT_TYPES,
            size=num_types,
            replace=False
        ).tolist()

        num_preferred_types = len(preferred_types)

        # -------- Expected Return --------
        base_return = {"low": 8, "medium": 12, "high": 18}[risk]
        experience_bonus = {"Beginner": 0, "Intermediate": 1.5, "Expert": 3}[experience]
        horizon_bonus = min(horizon * 0.5, 5)

        expected_return = base_return + experience_bonus + horizon_bonus
        expected_return += np.random.normal(0, 1.2)
        expected_return = np.clip(expected_return, 5, 25)
        # -------- Allocation Logic (100% RULE) --------
        alloc = {"Stocks": 0.0, "SIPs": 0.0, "ETFs": 0.0}

        if num_preferred_types == 1:
            alloc[preferred_types[0]] = 100.0

        else:
            if risk == "low":
                weights = np.random.dirichlet(np.ones(num_preferred_types) * 3)
            elif risk == "medium":
                weights = np.random.dirichlet(np.ones(num_preferred_types) * 2)
            else:
                weights = np.random.dirichlet(np.ones(num_preferred_types) * 1.5)

            for i, t in enumerate(preferred_types):
                alloc[t] = weights[i] * 100

        # 🔒 HARD NORMALIZATION (ADD THIS)
        total_alloc = sum(alloc.values())
        if total_alloc > 0:
            for k in alloc:
                alloc[k] = (alloc[k] / total_alloc) * 100

        # -------- Save Row --------
        rows.append({
            "income": income,
            "amountToInvest": amount,
            "horizon": horizon,
            "num_preferred_types": num_preferred_types,
            "risk": risk,
            "goal": goal,
            "experience": experience,
            "stock_alloc": alloc["Stocks"],
            "sip_alloc": alloc["SIPs"],
            "etf_alloc": alloc["ETFs"],
            "expected_return": expected_return
        })


    return pd.DataFrame(rows)

def train():
    df = create_synthetic_data()

    categorical_cols = ["risk", "goal", "experience"]
    numeric_cols = ["income", "amountToInvest", "horizon", "num_preferred_types"]

    label_encoders = {}
    for col in categorical_cols:
        le = LabelEncoder()
        df[col] = le.fit_transform(df[col])
        label_encoders[col] = le

    X = df[numeric_cols + categorical_cols]

    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    y_return = df["expected_return"]
    y_alloc = df[["stock_alloc", "sip_alloc", "etf_alloc"]]

    return_model = RandomForestRegressor(
        n_estimators=160,
        max_depth=10,
        random_state=RANDOM_STATE
    )

    allocation_model = RandomForestRegressor(
        n_estimators=160,
        max_depth=10,
        random_state=RANDOM_STATE
    )

    return_model.fit(X_scaled, y_return)
    allocation_model.fit(X_scaled, y_alloc)

    joblib.dump(scaler, f"{MODEL_DIR}/scaler.pkl")
    joblib.dump(return_model, f"{MODEL_DIR}/return_model.pkl")
    joblib.dump(allocation_model, f"{MODEL_DIR}/allocation_model.pkl")
    joblib.dump(label_encoders, f"{MODEL_DIR}/label_encoders.pkl")

    print("✅ Training done with 100% allocation rule enforced")

if __name__ == "__main__":
    train()
