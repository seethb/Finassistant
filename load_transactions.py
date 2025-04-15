import psycopg2
import pandas as pd
import random
from datetime import datetime, timedelta

# PostgreSQL connection
conn = psycopg2.connect(
    host="10.33.16.10",
    port=5433,
    database="yugabyte",
    user="yugabyte",
    password="yugabyte"
)
cur = conn.cursor()

# Create table if not exists
cur.execute("""
CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    user_id INT,
    amount DECIMAL,
    merchant TEXT,
    category TEXT,
    txn_date DATE
);
""")

# Merchants & categories
merchants = ['Amazon', 'Flipkart', 'Starbucks', 'Walmart', 'Uber', 'Zomato', 'Swiggy', 'Apple', 'Google', 'Netflix']
categories = ['shopping', 'food', 'transport', 'entertainment', 'subscription', 'electronics']

# Generate 1000 fake records
start_date = datetime(2024, 1, 1)
records = []
for _ in range(1000):
    user_id = random.randint(1, 50)
    amount = round(random.uniform(5, 500), 2)
    merchant = random.choice(merchants)
    category = random.choice(categories)
    txn_date = (start_date + timedelta(days=random.randint(0, 90))).date()
    records.append((user_id, amount, merchant, category, txn_date))

# Insert into table
cur.executemany("""
INSERT INTO transactions (user_id, amount, merchant, category, txn_date)
VALUES (%s, %s, %s, %s, %s)
""", records)

conn.commit()
print("✅ Loaded 1000 sample transactions.")

cur.close()
conn.close()
