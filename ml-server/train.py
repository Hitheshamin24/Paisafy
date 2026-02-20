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

INVESTMENT_TYPES = ["Stocks", "MutualFunds", "ETFs"]

# =========================
# SMART FINANCIAL ADVISOR
# =========================
def get_base_allocation(risk, horizon, goal, experience):
    alloc = {"Stocks": 0.0, "MutualFunds": 0.0, "ETFs": 0.0}

    # ===== RISK BASE =====
    if risk == "low":
        alloc["MutualFunds"] = 60
        alloc["ETFs"] = 30
        alloc["Stocks"] = 10

    elif risk == "medium":
        alloc["MutualFunds"] = 40
        alloc["Stocks"] = 40
        alloc["ETFs"] = 20

    else:  # high
        alloc["Stocks"] = 70
        alloc["MutualFunds"] = 20
        alloc["ETFs"] = 10

    # ===== HORIZON ADJUSTMENT =====
    if horizon >= 10:
        alloc["Stocks"] += 10
        alloc["MutualFunds"] += 5
        alloc["ETFs"] -= 15

    elif horizon <= 3:
        alloc["ETFs"] += 20
        alloc["Stocks"] -= 15
        alloc["MutualFunds"] -= 5

    # ===== GOAL ADJUSTMENT =====
    if goal == "Retirement":
        alloc["MutualFunds"] += 10
        alloc["Stocks"] += 5

    elif goal == "Child Education":
        alloc["MutualFunds"] += 10

    elif goal == "Short-Term Gains":
        alloc["ETFs"] += 15
        alloc["Stocks"] += 5

    # ===== EXPERIENCE ADJUSTMENT =====
    if experience == "Beginner":
        alloc["MutualFunds"] += 10
        alloc["Stocks"] -= 10

    elif experience == "Expert":
        alloc["Stocks"] += 10

    return alloc


def normalize_allocation(alloc):
    # Ensure no negative values
    for k in alloc:
        alloc[k] = max(0, alloc[k])

    total = sum(alloc.values())

    if total == 0:
        return {"Stocks": 33.3, "MutualFunds": 33.3, "ETFs": 33.3}

    for k in alloc:
        alloc[k] = (alloc[k] / total) * 100

    return alloc


# =========================
# DATA GENERATION
# =========================
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

        # -------- BASE ALLOCATION --------
        alloc = get_base_allocation(risk, horizon, goal, experience)

        # -------- ADD NOISE (REALISM) --------
        for k in alloc:
            noise = np.random.normal(0, 5)
            alloc[k] += noise

        # -------- NORMALIZE --------
        alloc = normalize_allocation(alloc)

        # -------- EXPECTED RETURN --------
        base_return = {"low": 8, "medium": 12, "high": 18}[risk]

        horizon_bonus = min(horizon * 0.5, 5)
        experience_bonus = {"Beginner": 0, "Intermediate": 1.5, "Expert": 3}[experience]

        expected_return = base_return + horizon_bonus + experience_bonus

        # Influence from allocation
        expected_return += (alloc["Stocks"] * 0.05)
        expected_return -= (alloc["ETFs"] * 0.02)

        expected_return += np.random.normal(0, 1.0)
        expected_return = np.clip(expected_return, 5, 25)

        # -------- SAVE ROW --------
        rows.append({
            "income": income,
            "amountToInvest": amount,
            "horizon": horizon,
            "risk": risk,
            "goal": goal,
            "experience": experience,
            "stock_alloc": alloc["Stocks"],
            "mutualfund_alloc": alloc["MutualFunds"],
            "etf_alloc": alloc["ETFs"],
            "expected_return": expected_return
        })

    return pd.DataFrame(rows)


# =========================
# TRAINING
# =========================
def train():
    df = create_synthetic_data()

    categorical_cols = ["risk", "goal", "experience"]
    numeric_cols = ["income", "amountToInvest", "horizon"]

    # Encode
    label_encoders = {}
    for col in categorical_cols:
        le = LabelEncoder()
        df[col] = le.fit_transform(df[col])
        label_encoders[col] = le

    X = df[numeric_cols + categorical_cols]

    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    y_return = df["expected_return"]
    y_alloc = df[["stock_alloc", "mutualfund_alloc", "etf_alloc"]]

    return_model = RandomForestRegressor(
        n_estimators=200,
        max_depth=12,
        random_state=RANDOM_STATE
    )

    allocation_model = RandomForestRegressor(
        n_estimators=200,
        max_depth=12,
        random_state=RANDOM_STATE
    )

    return_model.fit(X_scaled, y_return)
    allocation_model.fit(X_scaled, y_alloc)

    joblib.dump(scaler, f"{MODEL_DIR}/scaler.pkl")
    joblib.dump(return_model, f"{MODEL_DIR}/return_model.pkl")
    joblib.dump(allocation_model, f"{MODEL_DIR}/allocation_model.pkl")
    joblib.dump(label_encoders, f"{MODEL_DIR}/label_encoders.pkl")

    print("Training complete with financial advisor logic")


if __name__ == "__main__":
    train()