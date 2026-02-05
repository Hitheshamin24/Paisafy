from flask import Flask, request, jsonify
from flask_cors import CORS
from predict import predict_allocations

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

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)
