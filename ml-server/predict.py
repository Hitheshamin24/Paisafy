import joblib
import numpy as np

MODEL_DIR = "models"

scaler = joblib.load(f"{MODEL_DIR}/scaler.pkl")
return_model = joblib.load(f"{MODEL_DIR}/return_model.pkl")
alloc_model = joblib.load(f"{MODEL_DIR}/allocation_model.pkl")
encoders = joblib.load(f"{MODEL_DIR}/label_encoders.pkl")

# Must match the column order used during training
FEATURE_NAMES = ["income", "amountToInvest", "horizon", "risk", "goal", "experience"]

FEATURE_LABELS = {
    "income": "your monthly income",
    "amountToInvest": "your investment amount",
    "horizon": "your time horizon",
    "risk": "your risk appetite",
    "goal": "your financial goal",
    "experience": "your investment experience",
}


def safe_encode(encoder, value):
    # Falls back to the first known class if the value is unrecognised
    if value in encoder.classes_:
        return encoder.transform([value])[0]
    return encoder.transform([encoder.classes_[0]])[0]


def _build_features(data):
    return [
        data["income"],
        data["amountToInvest"],
        data["horizon"],
        safe_encode(encoders["risk"], data["risk"]),
        safe_encode(encoders["goal"], data["goal"]),
        safe_encode(encoders["experience"], data["experience"]),
    ]


def predict_allocations(data):
    features = _build_features(data)
    X = scaler.transform([features])

    expected_return = float(return_model.predict(X)[0])
    stock, mutualfund, etf = alloc_model.predict(X)[0]

    # Clamp any negative predictions to zero
    stock = max(stock, 0)
    mutualfund = max(mutualfund, 0)
    etf = max(etf, 0)

    preferred = set(data.get("preferredTypes", []))

    alloc = {
        "stocks": stock if "Stocks" in preferred else 0,
        "mutualfund": mutualfund if "Mutual Funds" in preferred else 0,
        "etf": etf if "ETFs" in preferred else 0,
    }

    # If the user didn't filter by type, use everything
    if not preferred:
        alloc = {"stocks": stock, "mutualfund": mutualfund, "etf": etf}

    total = sum(alloc.values())

    # Equal split fallback if all allocations end up zero
    if total == 0:
        allocations = {"stocks": 33.33, "mutualfund": 33.33, "etf": 33.33}
    else:
        allocations = {
            "stocks": round(alloc["stocks"] / total * 100, 2),
            "mutualfund": round(alloc["mutualfund"] / total * 100, 2),
            "etf": round(alloc["etf"] / total * 100, 2),
        }

    return {
        "expected_return": round(expected_return, 2),
        "allocations": allocations,
    }


def explain_allocations(data):
    try:
        import shap

        features = _build_features(data)
        X = scaler.transform([features])

        explainer = shap.TreeExplainer(alloc_model)
        shap_values = explainer.shap_values(X)

        # Handle both old (list) and new (ndarray) SHAP output formats
        if isinstance(shap_values, list):
            combined = np.abs(np.array(shap_values)).sum(axis=0)[0]
            raw_shap = np.array(shap_values)[:, 0, :]
        else:
            combined = np.abs(shap_values[0]).sum(axis=1)
            raw_shap = shap_values[0].T

        drivers = []
        for i, name in enumerate(FEATURE_NAMES):
            importance = float(combined[i])
            stock_shap = float(raw_shap[0, i])
            direction = "increased" if stock_shap > 0 else "decreased"
            label = FEATURE_LABELS.get(name, name)

            drivers.append({
                "feature": name,
                "label": label,
                "importance": round(importance, 4),
                "direction": direction,
                "summary": f"{label.capitalize()} {direction} stock allocation",
            })

        drivers.sort(key=lambda d: d["importance"], reverse=True)
        return {"drivers": drivers[:4]}

    except Exception as e:
        print(f"SHAP explanation failed: {e}")
        return {"drivers": [], "error": str(e)}