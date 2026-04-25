# 💎 Diamond Price Prediction & Real-Time Visualizer

## 📌 Project Overview
This project is an **end-to-end machine learning application** that predicts the **fair market price of diamonds** based on their physical and quality attributes.  

The project covers the complete data science lifecycle:
- Data cleaning & exploration
- Feature engineering
- Model building & evaluation
- Business insight generation
- Real-time deployment using Streamlit

The final outcome is an **interactive web app** where users can input diamond characteristics and instantly receive a price prediction.

---

## 🎯 Problem Statement
Diamond pricing is influenced by multiple factors such as carat, cut, color, clarity, and dimensions.  
The goal of this project is to:
- Accurately predict diamond prices
- Identify key drivers of price
- Detect potentially **overpriced or underpriced diamonds**
- Provide a real-time price prediction interface

---

## 📂 Dataset
- **Source:** Kaggle – Diamond Price Prediction Dataset  
- **Size:** ~54,000 diamonds  
- **Target Variable:** `price` (in USD)

### Features include:
- Carat
- Cut
- Color
- Clarity
- Depth & Table
- Physical dimensions (x, y, z)

---

## 🧹 Data Preprocessing
- Renamed columns for consistency and usability
- Removed invalid diamonds with zero dimensions
- Handled categorical variables using one-hot encoding
- Engineered additional feature: `volume = x * y * z`

---

## 📊 Exploratory Data Analysis (EDA)
Key insights from EDA:
- Carat shows a strong non-linear relationship with price
- Higher quality cuts and clarity grades command premium prices
- Diamond volume correlates strongly with price

---

## 🤖 Modeling Approach

### Baseline Model
- **Linear Regression**
- Used to establish a benchmark and validate the pipeline

### Final Model
- **Random Forest Regressor**
- Captures non-linear relationships and feature interactions
- Achieved significantly better performance than linear models

### Evaluation Metrics
- R² Score
- RMSE
- MAE

---

## 🔍 Key Findings
- **Carat** is the strongest driver of diamond price
- **Cut, clarity, and color** significantly affect pricing
- Tree-based models outperform linear baselines
- Prediction errors can be used to identify **pricing anomalies**

---

## 🚀 Real-Time Price Predictor
The trained Random Forest model is deployed using **Streamlit**, allowing users to:
- Adjust diamond features via sliders and dropdowns
- Instantly predict diamond prices
- Simulate real-world pricing scenarios

---

## 🖥️ How to Run the Project Locally

### 1️⃣ Clone the repository
```bash
git clone <your-repo-link>
cd diamond-price-prediction
