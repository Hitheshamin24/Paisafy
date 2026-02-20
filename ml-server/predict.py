import joblib

MODEL_DIR = "models"

scaler = joblib.load(f"{MODEL_DIR}/scaler.pkl")
return_model = joblib.load(f"{MODEL_DIR}/return_model.pkl")
alloc_model = joblib.load(f"{MODEL_DIR}/allocation_model.pkl")
encoders = joblib.load(f"{MODEL_DIR}/label_encoders.pkl")


# =========================
# SAFE ENCODER
# =========================
def safe_encode(encoder, value):
    if value in encoder.classes_:
        return encoder.transform([value])[0]
    return encoder.transform([encoder.classes_[0]])[0]


# =========================
# MAIN PREDICTION FUNCTION
# =========================
def predict_allocations(data):

    # ---------------------------
    # 1. Build feature vector
    # ---------------------------
    features = [
        data["income"],
        data["amountToInvest"],
        data["horizon"],
        safe_encode(encoders["risk"], data["risk"]),
        safe_encode(encoders["goal"], data["goal"]),
        safe_encode(encoders["experience"], data["experience"]),
    ]

    X = scaler.transform([features])

    # ---------------------------
    # 2. ML predictions
    # ---------------------------
    expected_return = float(return_model.predict(X)[0])
    stock, mutualfund, etf = alloc_model.predict(X)[0]

    # ---------------------------
    # 3. Clean negative values
    # ---------------------------
    stock = max(stock, 0)
    mutualfund = max(mutualfund, 0)
    etf = max(etf, 0)

    # ---------------------------
    # 4. Apply preferred types
    # ---------------------------
    preferred = set(data.get("preferredTypes", []))

    alloc = {
        "stocks": stock if "Stocks" in preferred else 0,
        "mutualfund": mutualfund if "Mutual Funds" in preferred else 0,
        "etf": etf if "ETFs" in preferred else 0,
    }

    # If nothing selected → allow all
    if not preferred:
        alloc = {
            "stocks": stock,
            "mutualfund": mutualfund,
            "etf": etf,
        }

    total = sum(alloc.values())

    # ---------------------------
    # 5. Force EXACT 100%
    # ---------------------------
    if total == 0:
        # fallback
        allocations = {
            "stocks": 33.33,
            "mutualfund": 33.33,
            "etf": 33.33,
        }
    else:
        allocations = {
            "stocks": round(alloc["stocks"] / total * 100, 2),
            "mutualfund": round(alloc["mutualfund"] / total * 100, 2),
            "etf": round(alloc["etf"] / total * 100, 2),
        }

    # ---------------------------
    # 6. Return response
    # ---------------------------
    return {
        "expected_return": round(expected_return, 2),
        "allocations": allocations
    }