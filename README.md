# Commodities Exchange Platform

A comprehensive full-stack commodities trading exchange with a futuristic cyberpunk UI, built with React, Node.js, Express, and SQLite/MySQL.

## Features

### Authentication & Security
- User registration and login with JWT authentication
- Secure password hashing with bcrypt
- Protected routes and admin access control
- Session management with automatic token refresh

### Trading Features
- **Real-time Market Data**: View live commodity prices with price changes
- **Buy/Sell Orders**: Place market orders instantly
- **Portfolio Management**: Track your holdings with profit/loss calculations
- **Order History**: View complete trading history
- **Watchlist**: Add commodities to watchlist for quick access
- **Price Alerts**: Set price alerts for commodities (above/below target price)

### Wallet Management
- Deposit funds to your trading account
- Withdraw funds from your account
- Real-time balance updates
- Transaction history tracking

### Admin Panel
- User management (view, delete users)
- Platform statistics dashboard
- Order monitoring
- Trading volume analytics

### Available Commodities
- Gold (GC=F)
- Silver (SI=F)
- Crude Oil (CL=F)
- Natural Gas (NG=F)
- Copper (HG=F)
- Platinum (PL=F)
- Palladium (PA=F)
- Corn (ZC=F)
- Wheat (ZW=F)
- Coffee (KC=F)

## Technology Stack

### Backend
- **Node.js** with Express.js
- **SQLite** database (better-sqlite3)
- **JWT** for authentication
- **bcryptjs** for password hashing
- RESTful API architecture

### Frontend (Original)
- **React** 19.1
- **React Router** for navigation
- **Axios** for API calls
- **Tailwind CSS** for styling
- Context API for state management

### Mobile App (NEW - Futuristic UI)
- **React** 18.2 with React Router
- **Framer Motion** for smooth animations
- **Tailwind CSS** with custom cyberpunk theme
- **Recharts** for interactive charts
- Glassmorphism and neon effects
- Mobile-first responsive design

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Initialize the database:
```bash
node config/initDatabase.js
```

4. Start the backend server:
```bash
npm start
```

The backend server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

### Mobile App Setup (NEW - Cyberpunk UI)

1. Navigate to mobile-app directory:
```bash
cd mobile-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The mobile app will run on `http://localhost:3000` (use a different port if frontend is already running)

**Features:**
- 🎨 Stunning cyberpunk/Binance-inspired design
- ✨ Glassmorphism effects and neon glows
- 📊 Interactive charts with multiple timeframes
- 💼 Advanced portfolio management with P&L tracking
- 📈 Real-time trading interface
- 📜 Order history with filtering
- 🔐 Secure JWT authentication
- 📱 Fully responsive mobile-first design

See `mobile-app/README.md` for detailed documentation.

## Database Schema

### Users Table
- id, username, email, password (hashed)
- balance, is_admin
- created_at, updated_at

### Commodities Table
- id, symbol, name
- current_price, previous_close, open_price
- high_price, low_price, volume
- market_cap, change_percent

### Orders Table
- id, user_id, commodity_symbol
- order_type (BUY/SELL)
- quantity, price, total_amount
- status, created_at

### Portfolio Table
- id, user_id, commodity_symbol
- quantity, average_price, total_invested

### Watchlist Table
- id, user_id, commodity_symbol, added_at

### Price Alerts Table
- id, user_id, commodity_symbol
- alert_type (ABOVE/BELOW), target_price
- is_active, triggered_at

### Transactions Table
- id, user_id, transaction_type
- amount, description, created_at

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/profile` - Update user profile (protected)

### Commodities
- `GET /api/commodities` - Get all commodities
- `GET /api/commodities/:symbol` - Get commodity by symbol
- `POST /api/commodities` - Create commodity (admin)
- `PUT /api/commodities/:symbol` - Update commodity price (admin)
- `DELETE /api/commodities/:symbol` - Delete commodity (admin)

### Trading
- `POST /api/trading/buy` - Place buy order (protected)
- `POST /api/trading/sell` - Place sell order (protected)
- `GET /api/trading/orders` - Get user orders (protected)
- `GET /api/trading/portfolio` - Get user portfolio (protected)

### Watchlist
- `GET /api/watchlist` - Get user watchlist (protected)
- `POST /api/watchlist` - Add to watchlist (protected)
- `DELETE /api/watchlist/:symbol` - Remove from watchlist (protected)

### Alerts
- `GET /api/alerts` - Get user alerts (protected)
- `POST /api/alerts` - Create alert (protected)
- `DELETE /api/alerts/:id` - Delete alert (protected)

### Transactions
- `GET /api/transactions` - Get user transactions (protected)
- `POST /api/transactions/deposit` - Deposit funds (protected)
- `POST /api/transactions/withdraw` - Withdraw funds (protected)

### Admin
- `GET /api/admin/users` - Get all users (admin)
- `GET /api/admin/users/:id` - Get user details (admin)
- `DELETE /api/admin/users/:id` - Delete user (admin)
- `GET /api/admin/orders` - Get all orders (admin)
- `GET /api/admin/stats` - Get platform statistics (admin)

## Default User

New users start with:
- **Balance**: $100,000
- **Initial deposit transaction** recorded

To create an admin user, manually update the `is_admin` field in the database:
```sql
UPDATE users SET is_admin = 1 WHERE username = 'your_username';
```

## Features Overview

### Dashboard
- Account summary with balance and portfolio value
- Market view with all available commodities
- Quick buy/sell actions
- Real-time price updates

### Portfolio Management
- View all holdings with current values
- Profit/loss calculations (absolute and percentage)
- Average purchase price tracking
- Quick sell functionality

### Order Management
- Complete order history
- Filter by buy/sell orders
- Order status tracking
- Detailed transaction information

### Watchlist
- Add favorite commodities
- Quick access to tracked items
- Real-time price updates
- One-click trading

### Admin Features
- Platform-wide statistics
- User management
- Order monitoring
- Trading volume analytics

## Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- Protected API routes
- Admin role-based access control
- SQL injection prevention with prepared statements
- CORS configuration for API security

## Future Enhancements

- Real-time price updates using WebSockets
- Advanced charting with historical data
- Limit orders and stop-loss functionality
- Email notifications for price alerts
- Two-factor authentication (2FA)
- Mobile responsive design improvements
- Trading analytics and reports

## License

MIT License

## Author

Built with ❤️ for commodities trading enthusiasts
