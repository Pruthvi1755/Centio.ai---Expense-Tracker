-- Centio.ai - Smart Expense Tracker Database Schema
-- Compatible with PostgreSQL and SQLite

-- 1. Create Users Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 2. Create Transactions Table
CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    type VARCHAR(50) NOT NULL,
    category VARCHAR(255) NOT NULL,
    amount DOUBLE PRECISION NOT NULL,
    date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    notes TEXT NULL,
    tags TEXT NULL, -- Stored as comma-separated tags (e.g. "groceries,food")
    CONSTRAINT fk_transaction_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Indexing queries for analytical performance
CREATE INDEX IF NOT EXISTS idx_transactions_user_type ON transactions(user_id, type);
CREATE INDEX IF NOT EXISTS idx_transactions_user_date ON transactions(user_id, date);

-- 3. Create Budgets Table
CREATE TABLE IF NOT EXISTS budgets (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    category VARCHAR(255) NOT NULL,
    amount DOUBLE PRECISION NOT NULL,
    period VARCHAR(50) DEFAULT 'monthly' NOT NULL,
    CONSTRAINT fk_budget_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Indexing budget query scans
CREATE INDEX IF NOT EXISTS idx_budgets_user_cat ON budgets(user_id, category);
