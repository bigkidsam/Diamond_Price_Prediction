# 💎 DiamondIQ — AI-Powered Diamond Valuation & Intelligence Platform

[![Python](https://img.shields.io/badge/Python-3.10%20%7C%203.11%20%7C%203.12-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104+-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4+-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Scikit-Learn](https://img.shields.io/badge/scikit--learn-1.8%2B-F7931E?style=for-the-badge&logo=scikit-learn&logoColor=white)](https://scikit-learn.org/)
[![Docker](https://img.shields.io/badge/Docker-Enabled-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

> An end-to-end Machine Learning web application delivering algorithmic diamond appraisals with **$R^2 \approx 0.981$** accuracy across **53,920 gemological transaction records**. Features a luxury **React/TypeScript** frontend, high-performance **FastAPI** backend, explainable feature attributions, PDF certificate generation, and **Docker** containerization.

---

## 📸 Platform Highlights

* **Multi-Factor Valuation Wizard:** Step-by-step input across diamond identity, the 4Cs (Carat, Cut, Color, Clarity), finishing grades (Polish, Symmetry, Fluorescence), spatial 3D proportions ($x, y, z$, depth %, table %), and lab certifications (GIA, IGI, HRD, AGS).
* **Instant Ballpark Calculator:** Interactive slider tool for rapid estimation before deep gemological calibration.
* **Explainable AI & Range Spectrum:** Deconstructs model decisions into wholesale vs. retail market bounds, feature attribution bars (Carat mass vs. Color/Clarity premiums), and plain-language light-return rationales.
* **Valuation Dossier (PDF Export):** Printable appraisal report certificate complete with unique report ID (`DIQ-xxxx`), QR seal, and formal valuation notices.
* **Side-by-Side Comparison Matrix:** Compare up to 3 diamonds simultaneously with difference highlights and price-per-carat rates.
* **Market Insights Terminal:** Macro trends, price-by-carat escalation curves, shape market share breakdowns, and Natural vs. Lab-Grown index movements.
* **Admin & ML Telemetry Console:** Real-time pipeline performance tracking, live inference audit logs, and CSV dataset inspection.

---

## 🏛️ System Architecture

```mermaid
flowchart LR
    subgraph Client["Frontend (React 18 + Vite)"]
        UI["Tailwind UI & Lucide Icons"]
        Wizard["Valuation Wizard"]
        Dash["Results & Dashboards"]
    end

    subgraph Gateway["Reverse Proxy / Dev Server"]
        Proxy["Vite Proxy (:5173) / Nginx (:80)"]
    end

    subgraph API["Backend API (FastAPI)"]
        FastAPI["FastAPI Server (:8000)"]
        Pre["Preprocessor (ColumnTransformer)"]
        Model["Random Forest Regressor (200 Trees)"]
    end

    subgraph Storage["Persistence Layer"]
        DB[("PostgreSQL 15 (Optional)")]
        Cache["In-Memory Audit Cache"]
    end

    UI --> Wizard --> Dash
    Dash --> Proxy
    Proxy --> FastAPI
    FastAPI --> Pre --> Model
    FastAPI --> Storage
```

---

## 🧠 Machine Learning Pipeline

* **Dataset:** 53,920 authenticated diamond records (Kaggle Diamond Price Prediction Dataset).
* **Feature Engineering:**
  * Zero-dimension cleaning ($x, y, z > 0$).
  * Engineered spatial volume: $\text{volume} = x \times y \times z$.
  * Numerical normalization via `StandardScaler` (`carat`, `depth`, `table`, `x`, `y`, `z`, `volume`).
  * Categorical encoding via `OneHotEncoder(handle_unknown='ignore')` (`cut`, `color`, `clarity`).
* **Model:** `RandomForestRegressor(n_estimators=200, random_state=42)` encapsulated inside a scikit-learn `Pipeline`.
* **Evaluation Metrics:**
  * **$R^2$ Score:** `0.98125` (98.1% variance explained)
  * **RMSE:** `~$548.26`
  * **MAE:** `~$264.73`

---

## 📁 Repository Structure

```text
diamond-price-prediction/
├── backend/
│   ├── main.py                  # FastAPI server, endpoints & valuation logic
│   ├── requirements.txt         # Python dependencies
│   ├── .env.example             # Environment configuration template
│   └── main.ipynb               # Exploratory Data Analysis & data cleaning
├── frontend/
│   ├── src/
│   │   ├── components/          # 12 React UI components (Wizard, Dashboards, Modal)
│   │   ├── types/               # TypeScript interfaces (DiamondInput, PredictionResult)
│   │   ├── App.tsx              # Root React application & state manager
│   │   └── main.tsx             # React entrypoint
│   ├── package.json             # Frontend npm dependencies (React, Vite, Tailwind)
│   ├── vite.config.ts           # Vite bundler & /api proxy configuration
│   └── tailwind.config.js       # Luxury theme colors & typography styling
├── database/
│   └── init.sql                 # PostgreSQL schema (predictions, users, audit logs)
├── DiamondPricePridiction.ipynb # ML training, cross-validation & model export notebook
├── diamond_price_model.pkl      # Serialized scikit-learn Random Forest pipeline
├── Diamond Price Prediction.csv # Raw training dataset
├── docker-compose.yml           # Multi-container orchestration (FastAPI + Postgres + Nginx)
├── Dockerfile                   # Backend production container specification
├── nginx.conf                   # Production Nginx reverse-proxy configuration
├── package.json                 # Root script runner (concurrent frontend + backend)
└── README.md                    # Project documentation
```

---

## 🚀 Step-by-Step Execution Guide

You can run DiamondIQ locally using **standard terminal commands** or with **Docker**.

### Prerequisites
* **Python:** `3.10`, `3.11`, or `3.12` installed ([python.org](https://www.python.org/downloads/))
* **Node.js:** `v18.0.0+` & npm installed ([nodejs.org](https://nodejs.org/))
* **Git:** installed ([git-scm.com](https://git-scm.com/))

---

### Option A: Standard Local Setup (Recommended)

#### 1️⃣ Clone the Repository
```bash
git clone https://github.com/<your-username>/diamond-price-prediction.git
cd diamond-price-prediction
```

#### 2️⃣ Setup & Start Backend (Terminal 1)

##### On Windows (PowerShell):
```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

> **Note for Windows users:** If you see `running scripts is disabled on this system`, run `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process` first, then run `.\venv\Scripts\Activate.ps1`.

##### On macOS / Linux (Bash / Zsh):
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

✅ **Backend will be live at:** [http://127.0.0.1:8000](http://127.0.0.1:8000)  
📖 **Interactive Swagger API Docs:** [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

---

#### 3️⃣ Setup & Start Frontend (Terminal 2)

Open a **new terminal tab/window** while keeping the backend running:

```bash
cd frontend
npm install
npm run dev
```

✅ **Frontend will be live at:** [http://localhost:5173](http://localhost:5173)

---

### Option B: Quick Start via Root NPM (Windows Shortcut)

If you have Node.js and have created the `backend/venv` once, you can start both frontend and backend concurrently from the root directory:

```bash
npm start
```
* Backend runs on `:8000` (cyan logs)
* Frontend runs on `:5173` (magenta logs)

---

### Option C: Run via Docker Compose (Production Stack)

Ensure **Docker Desktop** is installed and running, then:

```bash
# 1. Build the production React static bundle
npm --prefix frontend install
npm --prefix frontend run build

# 2. Launch Backend, PostgreSQL, and Nginx with Docker Compose
docker-compose up --build
```

* **Web Application:** [http://localhost](http://localhost) (Served via Nginx on port 80)
* **Backend API Docs:** [http://localhost/docs](http://localhost/docs)
* **PostgreSQL Database:** `localhost:5432` (`diamond_predictor`)

To shut down the containers:
```bash
docker-compose down
```

---

## 🔌 API Endpoints Reference

| Method | Endpoint | Description | Sample Response / Payload |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/predict` | Run Random Forest price prediction | `{"estimated_price": 7033.77, "lower_bound": 6471.07, ...}` |
| `GET` | `/api/history` | Retrieve recent valuation inference logs | `[{"id": "DIQ-0001", "carat": 1.0, ...}]` |
| `POST` | `/api/save-prediction`| Bookmark a diamond valuation | `{"status": "saved", "id": "DIQ-0001"}` |
| `GET` | `/api/model/metrics` | Retrieve model specs & evaluation scores | `{"r2_score": 0.98125, "rmse": 548.26, ...}` |
| `GET` | `/api/market-insights`| Macro market aggregations & price curves | `{"summary": {"average_price": 3932.8}, ...}` |
| `GET` | `/api/health` | Service health status & model availability| `{"status": "healthy", "model_loaded": true}` |
| `GET` | `/docs` | Interactive Swagger UI API playground | Open in browser |

### Example Prediction Request (`POST /api/predict`)
```json
{
  "carat": 1.25,
  "cut": "Ideal",
  "color": "F",
  "clarity": "VS1",
  "depth": 61.8,
  "table": 57.0,
  "x": 6.91,
  "y": 6.95,
  "z": 4.28,
  "shape": "Round",
  "polish": "Excellent",
  "symmetry": "Excellent",
  "fluorescence": "None",
  "diamond_type": "Natural",
  "certification": "GIA"
}
```

---

## ⚙️ Environment Configuration

The backend supports configuration via environment variables. Create a `.env` file inside `backend/` (or copy [`backend/.env.example`](file:///d:/VS%20Code/Structured%20Projects/diamond%20price%20pridiction/backend/.env.example)):

```ini
# backend/.env
FASTAPI_ENV=development
ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173,http://localhost:8000
SECRET_KEY=your-custom-secret-key

# Optional: Connect to PostgreSQL (falls back to high-speed in-memory cache if omitted)
DATABASE_URL=postgresql://diamond_user:diamond_password@localhost:5432/diamond_predictor
```

---

## 🧪 Verification & Testing

Verify that both frontend and backend pass all build and validation checks:

```bash
# 1. Verify Frontend TypeScript types & production compilation
npm --prefix frontend run build

# 2. Verify Backend API routes & Model inference
python -c "import sys; sys.path.insert(0, 'backend'); import main; print('Model loaded:', main.model is not None)"
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the Project (`git checkout -b feature/AmazingFeature`)
2. Commit your Changes (`git commit -m 'feat: add AmazingFeature'`)
3. Push to the Branch (`git push origin feature/AmazingFeature`)
4. Open a Pull Request

---

## 📄 License & Attribution

Distributed under the **MIT License**. See `LICENSE` for more information.

* **Author:** Swayam Singh
* **GitHub:** [@swayam-singh](https://github.com/)
* **Dataset Attribution:** Kaggle Diamond Price Prediction Dataset
