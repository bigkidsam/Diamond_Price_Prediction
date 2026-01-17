import streamlit as st
import pandas as pd
import joblib

# Load trained model
model = joblib.load("diamond_price_model.pkl")

st.title(" Diamond Price Predictor")

st.write("Enter diamond characteristics to predict price")

# User inputs
carat = st.slider("Carat", 0.2, 5.0, 1.0)
depth = st.slider("Depth", 40.0, 80.0, 60.0)
table = st.slider("Table", 40.0, 95.0, 57.0)

x = st.slider("Length (x)", 3.0, 11.0, 6.0)
y = st.slider("Width (y)", 3.0, 11.0, 6.0)
z = st.slider("Depth (z)", 2.0, 7.0, 4.0)

cut = st.selectbox("Cut", ["Fair", "Good", "Very Good", "Premium", "Ideal"])
color = st.selectbox("Color", ["D", "E", "F", "G", "H", "I", "J"])
clarity = st.selectbox("Clarity", ["I1", "SI2", "SI1", "VS2", "VS1", "VVS2", "VVS1", "IF"])

volume = x * y * z

# Create input DataFrame
input_df = pd.DataFrame({
    "carat": [carat],
    "depth": [depth],
    "table": [table],
    "x": [x],
    "y": [y],
    "z": [z],
    "volume": [volume],
    "cut": [cut],
    "color": [color],
    "clarity": [clarity]
})

# Predict
if st.button("Predict Price"):
    prediction = model.predict(input_df)[0]
    st.success(f" Estimated Price: ${prediction:,.2f}")
