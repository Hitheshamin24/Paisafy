import joblib

MODEL_DIR = "models"

scaler = joblib.load(f"{MODEL_DIR}/scaler.pkl")
return_model = joblib.load(f"{MODEL_DIR}/return_model.pkl")
alloc_model = joblib.load(f"{MODEL_DIR}/allocation_model.pkl")
encoders = joblib.load(f"{MODEL_DIR}/label_encoders.pkl")


def safe_encode(encoder, value):
    """Prevent unseen-label crashes"""
    if value in encoder.classes_:
        return encoder.transform([value])[0]
    return encoder.transform([encoder.classes_[0]])[0]


def predict_allocations(data):
    # ---------------------------
    # 1. Build feature vector
    # ---------------------------
    features = [
        data["income"],
        data["amountToInvest"],
        data["horizon"],
        len(data.get("preferredTypes", [])),
        safe_encode(encoders["risk"], data["risk"]),
        safe_encode(encoders["goal"], data["goal"]),
        safe_encode(encoders["experience"], data["experience"]),
    ]

    X = scaler.transform([features])

    # ---------------------------
    # 2. ML predictions
    # ---------------------------
    expected_return = float(return_model.predict(X)[0])
    stock, sip, etf = alloc_model.predict(X)[0]

    # ---------------------------
    # 3. Enforce preferredTypes
    # ---------------------------
    preferred = set(data.get("preferredTypes", []))

    alloc = {
        "stocks": max(stock, 0) if "Stocks" in preferred else 0,
        "sip": max(sip, 0) if "SIPs" in preferred else 0,
        "etf": max(etf, 0) if "ETFs" in preferred else 0,
    }

    # If nothing selected → allow all
    if not preferred:
        alloc = {
            "stocks": max(stock, 0),
            "sip": max(sip, 0),
            "etf": max(etf, 0),
        }

    total = sum(alloc.values())

    # ---------------------------
    # 4. Force EXACT 100%
    # ---------------------------
    if total == 0:
        # safety fallback
        count = len([k for k in alloc if alloc[k] == 0])
        equal = 100 / 3
        allocations = {
            "stocks": round(equal, 2),
            "sip": round(equal, 2),
            "etf": round(equal, 2),
        }
    else:
        allocations = {
            "stocks": round(alloc["stocks"] / total * 100, 2),
            "sip": round(alloc["sip"] / total * 100, 2),
            "etf": round(alloc["etf"] / total * 100, 2),
        }

    return {
        "expected_return": round(expected_return, 2),
        "allocations": allocations
    }
