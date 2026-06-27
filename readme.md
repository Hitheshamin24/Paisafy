# Paisafy – Investment Recommendation System

Paisafy is a full-stack web application designed to provide personalized investment recommendations based on user profiles, risk appetites, goals, and market data. 

The application utilizes a combination of traditional backend services and a machine learning model to suggest optimized portfolio allocations spanning Stocks, ETFs, and Mutual Funds.

## 🚀 Tech Stack

### Frontend
- **React.js** (Vite)
- **TailwindCSS** for modern, responsive, and aesthetic UI
- **Clerk** for User Authentication
- **Framer Motion** & **Lucide React** for UI animations and icons
- **Axios** for API requests

### Backend (Node.js API)
- **Node.js** with **Express.js**
- **MongoDB** via **Mongoose** for data persistence (Users, Preferences, Recommendation History)
- **Clerk Express SDK** for backend route protection and auth validation

### Machine Learning / Python Server
- **Python** with **Flask**
- **scikit-learn** / **pandas** for ML model inference and training
- Uses historical and generated datasets to predict allocations
- Serves recommendations to the Node.js backend

---

## 🏗️ Architecture & Data Flow

### DFD Level 0 (Context Diagram)
```mermaid
flowchart LR
    U["External Entity: User"]
    A["External Entity: Clerk Authentication"]
    M["External Entity: Market Data (yfinance)"]
    P["Process: Paisafy Investment System"]
    D[["Data Store: MongoDB"]]

    U -->|Login / Inputs| P
    P -->|Auth request| A
    A -->|Auth status| P
    P -->|Market data request| M
    M -->|Market data| P
    P -->|Read/Write data| D
    P -->|Results / Recommendations| U
```

### DFD Level 1
```mermaid
flowchart TB
    U["External Entity: User"]
    A["External Entity: Clerk Authentication"]
    M["External Entity: Market Data (yfinance)"]

    D1[["Data Store: User Profiles"]]
    D2[["Data Store: Investment Preferences"]]
    D3[["Data Store: Recommendation History"]]

    P1["Process 1.1: Enter Financial Details (Frontend)"]
    P2["Process 1.2: Validate & Store Data (Backend API)"]
    P3["Process 1.3: Fetch Market Data (yfinance API)"]
    P4["Process 1.4: Generate Recommendations (ML Flask)"]
    P5["Process 1.5: Show Results & Save History"]

    U -->|Login / Sign Up| P1
    P1 -->|Auth flow| A
    A -->|Auth status| P1
    U -->|Financial details, risk, goals| P1
    P1 -->|Validated inputs| P2
    P2 -->|Create/Update| D1
    P2 -->|Save preferences| D2
    P2 -->|Read profile| D1
    P2 -->|Read prefs| D2
    P2 -->|Request recommendations| P4
    P4 -->|Needs market data| P3
    P3 -->|Request OHLC| M
    M -->|Market data| P3
    P3 -->|Features| P4
    P4 -->|Recommendations| P5
    P5 -->|Store results| D3
    P5 -->|Retrieve history| D3
    P5 -->|Portfolio breakdown| U
```

---

## 📂 Project Structure

```
paisafy/
├── frontend/             # React application (Vite + Tailwind)
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Main route pages (Home, Form)
│   │   └── ...
├── backend/              # Node.js + Express backend
│   ├── controllers/      # Business logic (users, recommendations)
│   ├── models/           # Mongoose schemas
│   ├── routes/           # Express route definitions
│   └── index.js          # Main server entrypoint
├── ml-server/            # Python Flask server for ML Inference
│   ├── models/           # Pre-trained ML models
│   ├── app.py            # Flask API entry point
│   ├── predict.py        # Prediction logic
│   └── train.py          # Model training scripts
└── readme.md             # Project documentation
```

---

## 🛠️ Installation & Local Setup

### Prerequisites
- Node.js (v18+)
- Python (3.9+)
- MongoDB connection string (Local or Atlas)
- Clerk API Keys (Publishable key and Secret key)

### 1. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend/` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
FLASK_URL=http://127.0.0.1:8000
RAPIDAPI_KEY=your_rapidapi_key
```
Start the server:
```bash
npm run dev
```

### 2. Machine Learning Server Setup
```bash
cd ml-server
python -m venv venv
# Activate venv (Windows: venv\Scripts\activate | Mac/Linux: source venv/bin/activate)
pip install -r requirements.txt
```
Start the Flask server:
```bash
python app.py
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```
Create a `.env` file in the `frontend/` directory:
```env
VITE_BACKEND_URL=http://localhost:5000
```
*(Note: Clerk publishable key is currently hardcoded in `main.jsx` for frontend configuration)*

Start the development server:
```bash
npm run dev
```

---

## ✨ Features
- **Secure Authentication**: Passwordless or social login utilizing Clerk.
- **Dynamic Risk Profiling**: Custom algorithms to assess user's financial standing and risk tolerance.
- **Intelligent Portfolio Allocation**: Python-based models split funds intelligently across different financial instruments.
- **Market Specifics**: Recommendations are tied to real-world sectors (IT, FMCG, Banking, etc.) and asset classes.
- **Historical Tracking**: Ability to save and review past generated investment plans.
- **Premium UI**: Fluid, glassmorphism-inspired interface with responsive micro-animations for an elevated user experience.
