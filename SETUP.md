# 🚀 Diamond Price Predictor - SETUP GUIDE (Option B)

## Project Structure
```
diamond-price-predictor/
├── backend/
│   ├── main.py              (FastAPI application)
│   ├── requirements.txt      (Python dependencies)
│   └── .env.example         (Environment variables template)
├── frontend/
│   ├── index.html           (Main webpage)
│   ├── style.css            (Styling)
│   └── script.js            (Frontend logic)
├── database/
│   └── init.sql             (Database schema)
├── docker-compose.yml       (Docker orchestration)
├── Dockerfile              (Backend container)
├── nginx.conf              (Nginx reverse proxy)
├── diamond_price_model.pkl (ML model)
└── README.md
```

---

## 📋 PHASE 1: LOCAL DEVELOPMENT SETUP (2-3 hours)

### Step 1: Install Requirements
1. **Python 3.9+** - https://www.python.org/downloads/
2. **Git** - https://git-scm.com/
3. **PostgreSQL** (optional for local testing) - https://www.postgresql.org/download/
4. **Docker & Docker Compose** (optional) - https://www.docker.com/

### Step 2: Set Up Backend Locally

#### 2a. Create Virtual Environment
```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate
```

#### 2b. Install Dependencies
```bash
pip install -r requirements.txt
```

#### 2c. Set Up Environment Variables
```bash
# Copy the example file
cp .env.example .env

# Edit .env with your settings (optional for local dev)
# For now, you can skip this step
```

#### 2d. Run Backend Server
```bash
cd backend
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

✅ **Backend should be running at:** `http://localhost:8000`

**Check it's working:**
- Visit: http://localhost:8000/docs (interactive API documentation)
- You should see all available endpoints

### Step 3: Test API with Your Model

The backend assumes `diamond_price_model.pkl` exists in the backend folder.

**Make sure your trained model file is in the backend folder:**
```
backend/
├── main.py
├── diamond_price_model.pkl  ← Model should be here
└── requirements.txt
```

### Step 4: Open Frontend Locally

Open `frontend/index.html` in your browser:
```bash
# Windows
start frontend/index.html

# macOS
open frontend/index.html

# Linux
firefox frontend/index.html
```

Or use **Live Server Extension** in VS Code:
1. Install "Live Server" extension
2. Right-click `index.html` → "Open with Live Server"
3. Browser opens automatically at `http://127.0.0.1:5500`

### Step 5: Test the Application

1. Open http://127.0.0.1:5500 (frontend)
2. Fill in the form with sample data
3. Click "Predict Price"
4. ✅ You should see a price prediction

---

## 🐳 PHASE 2: DOCKER SETUP (Optional but Recommended)

### Step 1: Install Docker
Download from https://www.docker.com/products/docker-desktop/

### Step 2: Build & Run with Docker Compose

```bash
# From project root directory
docker-compose up --build
```

This starts:
- **PostgreSQL** on `localhost:5432`
- **FastAPI Backend** on `http://localhost:8000`
- **Nginx** (serving frontend) on `http://localhost`

### Step 3: Access the Application
- Frontend: http://localhost
- API Docs: http://localhost/docs
- Database: localhost:5432 (user: `diamond_user`, pass: `diamond_password`)

### Step 4: View Logs
```bash
# View all container logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f db
```

### Step 5: Stop Containers
```bash
docker-compose down

# Also remove volumes
docker-compose down -v
```

---

## 📊 PHASE 3: DATABASE SETUP (Optional)

If you want to persist predictions in PostgreSQL:

### Step 1: Update Backend with Database

Edit `backend/main.py` to add database integration:

```python
# Add these imports at the top
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import os

# Add this after app initialization
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://diamond_user:diamond_password@localhost:5432/diamond_predictor")
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
```

### Step 2: Create Tables
```bash
psql -U diamond_user -d diamond_predictor -f database/init.sql
```

---

## 🌐 PHASE 4: DEPLOYMENT (Week 2)

### Option A: Deploy to Railway (Recommended)

**Railway is free and easy!**

1. **Create Railway Account**
   - Go to https://railway.app
   - Sign up with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub"
   - Select your repository

3. **Add Services**
   - Add PostgreSQL service
   - Add backend service (select Dockerfile)

4. **Set Environment Variables**
   ```
   DATABASE_URL=postgresql://...
   ```

5. **Deploy**
   - Railway auto-deploys on git push
   - Your app will be live at: `https://your-app.railway.app`

### Option B: Deploy to Render

1. Go to https://render.com
2. Create new Web Service
3. Connect GitHub repo
4. Set build command: `pip install -r backend/requirements.txt`
5. Set start command: `cd backend && uvicorn main:app --host 0.0.0.0`
6. Deploy!

### Option C: Deploy to Heroku (Paid)

```bash
heroku login
heroku create your-app-name
git push heroku main
```

---

## 📱 QUICK COMMAND REFERENCE

### Local Development
```bash
# Backend only
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python -m uvicorn main:app --reload

# Frontend - use Live Server extension
```

### Docker
```bash
docker-compose up --build      # Start all services
docker-compose down            # Stop all services
docker-compose logs -f         # View logs
```

### Database
```bash
psql -U diamond_user -d diamond_predictor
SELECT * FROM predictions;
```

---

## ✅ TROUBLESHOOTING

### Problem: "Module not found" error
```bash
pip install -r requirements.txt
```

### Problem: Model file not found
Make sure `diamond_price_model.pkl` is in the backend folder:
```bash
# Copy from current location if needed
cp diamond_price_model.pkl backend/
```

### Problem: Port 8000 already in use
```bash
# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:8000 | xargs kill -9
```

### Problem: CORS errors (frontend can't reach backend)
Make sure backend is running and CORS is enabled in `main.py` (already done)

### Problem: Docker won't start
```bash
# Reset Docker
docker system prune -a
docker-compose up --build --force-recreate
```

---

## 🎯 NEXT STEPS AFTER SETUP

1. ✅ Test locally with all three features (prediction, history, about)
2. ✅ Deploy to Railway/Render
3. ✅ Add user authentication (email/password login)
4. ✅ Add database persistence
5. ✅ Add batch upload feature (CSV file with multiple diamonds)
6. ✅ Add analytics dashboard
7. ✅ Get custom domain

---

## 📞 NEED HELP?

Common resources:
- **FastAPI Docs:** https://fastapi.tiangolo.com/
- **Docker Docs:** https://docs.docker.com/
- **Railway Docs:** https://docs.railway.app/
- **PostgreSQL Docs:** https://www.postgresql.org/docs/

---

## 🎉 YOU'RE READY!

Your full-featured website is ready to go! Follow the phases above and you'll have a professional, production-ready application in 2-3 weeks.

**Start with Phase 1 (Local Dev) today → Phase 2 (Docker) next → Phase 4 (Deployment) when ready!**

Questions? Let's build this together! 🚀
