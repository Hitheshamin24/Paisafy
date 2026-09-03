FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install only the packages needed for the Flask ML server
RUN pip install --no-cache-dir \
    flask==3.1.2 \
    flask-cors==6.0.2 \
    gunicorn \
    joblib==1.5.3 \
    numpy==2.2.6 \
    pandas==2.3.3 \
    scikit-learn==1.8.0 \
    scipy==1.17.0 \
    shap

# Copy the rest of the application
COPY . .

# Expose port 7860 (required by Hugging Face Spaces)
EXPOSE 7860

# Run with gunicorn on port 7860
CMD ["gunicorn", "--bind", "0.0.0.0:7860", "--workers", "1", "--timeout", "120", "app:app"]
