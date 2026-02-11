# 🗄️ Database Setup Guide

## Prerequisites
- PostgreSQL installed on your system
- pgAdmin or psql command-line tool

## Setup Instructions

### Step 1: Install PostgreSQL (if not already installed)
Download and install PostgreSQL from: https://www.postgresql.org/download/

### Step 2: Create Database

#### Option A: Using pgAdmin (GUI)
1. Open pgAdmin
2. Right-click on "Databases" → Create → Database
3. Name it: `inventory_db`
4. Click "Save"

#### Option B: Using psql (Command Line)
```bash
psql -U postgres
CREATE DATABASE inventory_db;
\q
```

### Step 3: Run the Schema File

#### Option A: Using pgAdmin
1. Open pgAdmin and connect to `inventory_db`
2. Click on "Query Tool"
3. Open `schema.sql` file
4. Click "Execute" (F5)

#### Option B: Using psql
```bash
psql -U postgres -d inventory_db -f schema.sql
```

### Step 4: Configure Environment Variables

Edit the `.env` file in the `server` folder with your PostgreSQL credentials:

```env
PORT=5000
DB_USER=postgres          # Your PostgreSQL username
DB_PASSWORD=your_password # Your PostgreSQL password
DB_HOST=localhost
DB_NAME=inventory_db
DB_PORT=5432
```

**Important:** Replace `your_password` with your actual PostgreSQL password!

### Step 5: Verify Connection

Start the server:
```bash
cd server
npm start
```

You should see:
```
✅ Successfully connected to PostgreSQL database
Server running on port 5000
```

## Troubleshooting

### Connection Refused Error
- Make sure PostgreSQL service is running
- Windows: Check Services → PostgreSQL should be running
- Verify port 5432 is not blocked by firewall

### Authentication Failed
- Double-check username and password in `.env`
- Default PostgreSQL username is usually `postgres`

### Database Does Not Exist
- Make sure you created the `inventory_db` database
- Run: `psql -U postgres -l` to list all databases

## Testing the Database

After setup, you can test with these queries:

```sql
-- Check products
SELECT * FROM products;

-- Check if tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';
```

## Sample Data

The schema includes 10 sample products. After running the schema, your database will have:
- 10 products with various electronics items
- Empty invoices and invoice_items tables (ready for billing)

---

Need help? Check the error messages in the server console for specific issues.
