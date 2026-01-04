# MySQL Setup Guide

## Prerequisites
- MySQL Server installed and running
- MySQL Workbench (optional but recommended)
- MySQL root access with password: `admin123`

## Setup Steps

### 1. Start MySQL Server

Make sure MySQL Server is running on your machine:

**Windows:**
- Open Services (Win + R, then type `services.msc`)
- Find "MySQL" or "MySQL80" service
- Right-click and select "Start" if not running

**OR use Command Prompt (as Administrator):**
```cmd
net start MySQL80
```

### 2. Initialize the Database

Navigate to the backend directory and run the initialization script:

```bash
cd backend
node config/initMysqlDatabase.js
```

This will:
- Create the `commodities_exchange` database
- Create all necessary tables (users, commodities, orders, portfolio, watchlist, alerts, transactions)
- Insert sample commodity data
- Set up proper indexes and foreign keys

### 3. Verify Database in MySQL Workbench

1. Open MySQL Workbench
2. Create a new connection:
   - Connection Name: `Commodities Exchange`
   - Hostname: `localhost`
   - Port: `3306`
   - Username: `root`
   - Password: `admin123`
3. Click "Test Connection"
4. Open the connection
5. You should see `commodities_exchange` database in the schemas list

### 4. View Tables

In MySQL Workbench, expand the `commodities_exchange` database to see:

**Tables:**
- `users` - User accounts with authentication
- `commodities` - Available commodities for trading
- `orders` - All buy/sell orders
- `portfolio` - User holdings
- `watchlist` - User's watched commodities
- `price_alerts` - Price notification alerts
- `transactions` - All financial transactions

### 5. Start the Backend Server

```bash
cd backend
npm start
```

You should see:
```
✅ MySQL connected successfully
🚀 Commodities Exchange Server running on port 5000
📍 API endpoint: http://localhost:5000/api
```

### 6. Start the Frontend

In a new terminal:
```bash
cd frontend
npm start
```

Frontend will open at `http://localhost:3000`

## Database Schema

### Users Table
```sql
id, username, email, password (hashed), full_name, balance, is_admin, created_at, updated_at
```

### Commodities Table
```sql
id, symbol, name, current_price, previous_close, open_price, high_price, low_price, volume, market_cap, change_percent
```

### Orders Table
```sql
id, user_id, commodity_symbol, order_type (BUY/SELL), quantity, price, total_amount, status, created_at
```

### Portfolio Table
```sql
id, user_id, commodity_symbol, quantity, average_price, total_invested, created_at, updated_at
```

### Watchlist Table
```sql
id, user_id, commodity_symbol, added_at
```

### Price Alerts Table
```sql
id, user_id, commodity_symbol, alert_type (ABOVE/BELOW), target_price, is_active, triggered_at, created_at
```

### Transactions Table
```sql
id, user_id, transaction_type (DEPOSIT/WITHDRAWAL/TRADE_BUY/TRADE_SELL), amount, description, created_at
```

## Useful MySQL Queries

### Create an Admin User
```sql
-- First register through the app, then run:
UPDATE users SET is_admin = 1 WHERE username = 'your_username';
```

### View All Users
```sql
SELECT id, username, email, balance, is_admin, created_at FROM users;
```

### View All Orders
```sql
SELECT o.*, u.username, c.name as commodity_name
FROM orders o
JOIN users u ON o.user_id = u.id
JOIN commodities c ON o.commodity_symbol = c.symbol
ORDER BY o.created_at DESC;
```

### View User Portfolio
```sql
SELECT p.*, c.name, c.current_price,
       (p.quantity * c.current_price) as current_value,
       ((p.quantity * c.current_price) - p.total_invested) as profit_loss
FROM portfolio p
JOIN commodities c ON p.commodity_symbol = c.symbol
WHERE p.user_id = 1;
```

### Trading Volume Statistics
```sql
SELECT
    COUNT(*) as total_orders,
    SUM(CASE WHEN order_type = 'BUY' THEN 1 ELSE 0 END) as buy_orders,
    SUM(CASE WHEN order_type = 'SELL' THEN 1 ELSE 0 END) as sell_orders,
    SUM(total_amount) as total_volume
FROM orders;
```

### Reset User Balance
```sql
UPDATE users SET balance = 100000.00 WHERE id = 1;
```

## Troubleshooting

### Error: "connect ECONNREFUSED"
- Make sure MySQL Server is running
- Check if port 3306 is being used
- Verify credentials are correct

### Error: "Access denied for user 'root'@'localhost'"
- Check password is `admin123`
- Try resetting MySQL root password

### Error: "Unknown database"
- Run `node config/initMysqlDatabase.js` to create the database

### Table not found errors
- Re-run the initialization script
- Check if tables were created in MySQL Workbench

## Configuration

Database connection settings are in:
`backend/config/mysqlDatabase.js`

```javascript
{
  host: 'localhost',
  user: 'root',
  password: 'admin123',
  database: 'commodities_exchange'
}
```

## Backup Database

```bash
mysqldump -u root -p commodities_exchange > backup.sql
```

## Restore Database

```bash
mysql -u root -p commodities_exchange < backup.sql
```

## Features Now Working with MySQL

✅ User Registration & Login
✅ JWT Authentication
✅ Buy/Sell Commodities
✅ Portfolio Tracking with P/L
✅ Order History
✅ Watchlist Management
✅ Price Alerts
✅ Wallet Deposits/Withdrawals
✅ Admin Panel
✅ Transaction Logs
✅ Real-time Balance Updates

## Support

If you encounter any issues:
1. Check MySQL Server is running
2. Verify database was initialized
3. Check server logs for errors
4. Ensure frontend is connecting to `http://localhost:5000`
