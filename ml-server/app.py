from flask import Flask, request, jsonify
from flask_cors import CORS
from predict import predict_allocations, explain_allocations
from monte_carlo import run_monte_carlo

app = Flask(__name__)
CORS(app)


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})


@app.route("/predict", methods=["POST"])
def predict():
    data = request.json
    result = predict_allocations(data)
    return jsonify(result)


@app.route("/explain", methods=["POST"])
def explain():
    """Returns SHAP-based human-readable drivers for the allocation decision."""
    data = request.json
    result = explain_allocations(data)
    return jsonify(result)


@app.route("/forecast", methods=["POST"])
def forecast():
    """
    Runs a Monte Carlo simulation and returns percentile bands.
    Expected body: { principal, expected_return, horizon }
    """
    body = request.json
    principal = float(body.get("principal", 0))
    expected_return = float(body.get("expected_return", 10))
    horizon = int(body.get("horizon", 5))

    if principal <= 0 or horizon <= 0:
        return jsonify({"error": "principal and horizon must be positive"}), 400

    result = run_monte_carlo(principal, expected_return, horizon)
    return jsonify(result)


if __name__ == "__main__":
    import os
    port = int(os.environ.get("PORT", 8000))
    app.run(host="0.0.0.0", port=port)
