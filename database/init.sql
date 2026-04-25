-- Diamond Price Predictor Database Schema

CREATE TABLE IF NOT EXISTS predictions (
    id SERIAL PRIMARY KEY,
    carat DECIMAL(5, 2) NOT NULL,
    depth DECIMAL(5, 2) NOT NULL,
    table_pct DECIMAL(5, 2) NOT NULL,
    x DECIMAL(5, 2) NOT NULL,
    y DECIMAL(5, 2) NOT NULL,
    z DECIMAL(5, 2) NOT NULL,
    cut VARCHAR(20) NOT NULL,
    color VARCHAR(1) NOT NULL,
    clarity VARCHAR(5) NOT NULL,
    predicted_price DECIMAL(12, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_predictions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    prediction_id INTEGER REFERENCES predictions(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for faster queries
CREATE INDEX idx_predictions_created_at ON predictions(created_at);
CREATE INDEX idx_user_predictions_user_id ON user_predictions(user_id);
