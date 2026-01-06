# Commodities Exchange - Native Android App

A comprehensive native Android commodities trading application with a futuristic cyberpunk UI, built with **Kotlin**, **Jetpack Compose**, **Node.js**, **Express**, and **MySQL**.

## 🚀 Features

### Authentication & Security
- User registration and login with JWT authentication
- Secure password hashing with bcrypt
- Protected routes and automatic token refresh
- Session management with encrypted local storage

### Trading Features
- **Real-time Market Data**: View live commodity prices with 24h changes
- **Interactive Charts**: Price charts with multiple timeframes (1H, 1D, 1W, 1M, 3M, 1Y)
- **Buy/Sell Orders**: Place market orders instantly
- **Portfolio Management**: Track holdings with real-time P&L calculations
- **Order History**: View complete trading history with filters
- **Watchlist**: Add commodities to favorites for quick access
- **Price Alerts**: Set price alerts with above/below conditions

### Wallet Management
- View account balance in real-time
- Transaction history with filtering
- Deposit/withdrawal tracking
- Balance updates after each trade

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

## 📱 Android App Screens

1. **Dashboard** - Live markets with quick buy/sell actions
2. **Portfolio** - Holdings with P&L tracking and stats
3. **Charts** - Interactive price charts with timeframe selection
4. **Orders** - Order history with status filters
5. **Watchlist** - Favorite commodities management
6. **Price Alerts** - Create and manage price alerts
7. **Profile** - User account and settings
8. **Transactions** - Complete transaction history

## 🛠 Technology Stack

### Android App
- **Kotlin** - Modern programming language
- **Jetpack Compose** - Declarative UI framework
- **Material Design 3** - Latest Android design system
- **MVVM Architecture** - Clean separation of concerns
- **Retrofit** - Type-safe HTTP client
- **Coroutines & Flow** - Asynchronous programming
- **StateFlow** - Reactive state management
- **Navigation** - Bottom navigation + menu system

### Backend
- **Node.js** with Express.js
- **MySQL** database
- **JWT** for authentication
- **bcryptjs** for password hashing
- RESTful API architecture

### Design
- **Cyberpunk Theme** - Neon cyan, green, purple colors
- **Glassmorphism** - Semi-transparent cards with blur
- **Gradient Effects** - Profit/loss indicators
- **Animations** - Smooth color transitions
- **Custom Charts** - Canvas-based price visualization

## 📦 Installation & Setup

### Prerequisites
- **Android Studio** (Arctic Fox or newer)
- **JDK 11+**
- **Android SDK 34**
- **Node.js** (v14 or higher)
- **MySQL** (8.0 or higher)

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Set up MySQL database
# See MYSQL_SETUP.md for detailed instructions
mysql -u root -p < ../database/mysql_schema.sql

# Start the backend server
npm start
```

The backend server will run on `http://localhost:5000`

### 2. Android App Setup

#### Option A: Using Android Studio (Recommended)

1. **Open Android Studio**
   - File → Open → Select `android-app/` directory

2. **Sync Gradle**
   - Wait for Gradle sync to complete
   - Click "Sync Now" if prompted

3. **Configure API URL**
   - Open `android-app/app/build.gradle`
   - For **Emulator**: Use `http://10.0.2.2:5000/api/`
   - For **Physical Device**: Change to your computer's IP
   ```gradle
   buildConfigField "String", "API_BASE_URL", "\"http://YOUR_IP:5000/api/\""
   ```

4. **Run the App**
   - Click the green Run button (▶️)
   - Or press `Shift + F10`
   - Select emulator or connected device

#### Option B: Using Command Line

```bash
# Navigate to android app directory
cd android-app

# Build the APK
./gradlew assembleDebug

# Install on connected device/emulator
./gradlew installDebug

# Launch the app
adb shell am start -n com.commodityx/.ui.MainActivity
```

### 3. Database Setup

See detailed instructions in:
- `MYSQL_SETUP.md` - Complete MySQL setup guide
- `MYSQL_PASSWORD_SETUP.md` - Password configuration

Quick setup:
```bash
# Import database schema
mysql -u root -p commodities_exchange < database/mysql_schema.sql

# Update backend config with your MySQL credentials
# Edit backend/.env or backend/config/database.js
```

## 🎨 UI/UX Design

### Color Palette
- **Neon Cyan**: `#0DCCF2` - Primary actions
- **Neon Green**: `#00FFA3` - Profits, success
- **Neon Purple**: `#8C25F4` - Alerts, highlights
- **Neon Red**: `#FF3B3B` - Losses, warnings
- **Cyber Dark**: `#0A0E17` - Background
- **Surface Dark**: `#16292D` - Cards, surfaces

### Design Patterns
- **Bottom Navigation**: Dashboard, Portfolio, Charts, Profile
- **Header Menu**: Watchlist, Alerts, Transactions
- **Glassmorphism Cards**: Semi-transparent with backdrop blur
- **Gradient Borders**: Indicating profit (green) or loss (red)
- **Glow Effects**: Radial gradients for emphasis
- **Smooth Animations**: Color transitions and loading states

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile

### Commodities
- `GET /api/commodities` - Get all commodities
- `GET /api/commodities/{id}` - Get commodity by ID
- `GET /api/commodities/{id}/history` - Get price history

### Trading
- `POST /api/trading/order` - Place buy/sell order
- `GET /api/trading/orders` - Get user orders
- `DELETE /api/trading/orders/{id}` - Cancel order
- `GET /api/trading/portfolio` - Get user portfolio

### Watchlist
- `GET /api/watchlist` - Get user watchlist
- `POST /api/watchlist` - Add to watchlist
- `DELETE /api/watchlist/{commodityId}` - Remove from watchlist

### Alerts
- `GET /api/alerts` - Get user alerts
- `POST /api/alerts` - Create price alert
- `DELETE /api/alerts/{id}` - Delete alert

### Transactions
- `GET /api/transactions` - Get user transaction history

## 🏗 Project Structure

```
Commodities-Exchange/
├── android-app/                 # Native Android application
│   ├── app/
│   │   ├── src/main/
│   │   │   ├── java/com/commodityx/
│   │   │   │   ├── data/        # Data models
│   │   │   │   ├── network/     # API service & Retrofit
│   │   │   │   ├── ui/          # Compose UI screens
│   │   │   │   │   ├── alerts/
│   │   │   │   │   ├── auth/
│   │   │   │   │   ├── charts/
│   │   │   │   │   ├── dashboard/
│   │   │   │   │   ├── orders/
│   │   │   │   │   ├── portfolio/
│   │   │   │   │   ├── profile/
│   │   │   │   │   ├── trading/
│   │   │   │   │   ├── transactions/
│   │   │   │   │   └── watchlist/
│   │   │   │   ├── utils/       # Utilities & helpers
│   │   │   │   └── viewmodel/   # ViewModels
│   │   │   ├── AndroidManifest.xml
│   │   │   └── res/             # Resources
│   │   └── build.gradle
│   └── build.gradle
├── backend/                     # Node.js Express API
│   ├── config/                  # Database configuration
│   ├── middleware/              # Authentication middleware
│   ├── routes/                  # API routes
│   └── server.js
├── database/                    # MySQL schema & setup
│   └── mysql_schema.sql
├── MYSQL_SETUP.md              # MySQL setup instructions
├── VSCODE_SETUP_GUIDE.md       # VS Code development setup
└── README.md                    # This file
```

## 🔒 Security Features

- Password hashing with bcrypt (10 salt rounds)
- JWT token-based authentication
- Token storage in encrypted DataStore
- Protected API routes with middleware
- Automatic token injection via interceptors
- SQL injection prevention with prepared statements
- CORS configuration for API security

## 📱 Running on Physical Device

1. **Enable Developer Mode:**
   - Settings → About Phone
   - Tap "Build Number" 7 times

2. **Enable USB Debugging:**
   - Settings → Developer Options
   - Enable "USB Debugging"

3. **Find Your Computer's IP:**
   ```bash
   # Linux/Mac
   ifconfig | grep inet

   # Windows
   ipconfig
   ```

4. **Update API URL in build.gradle:**
   ```gradle
   buildConfigField "String", "API_BASE_URL", "\"http://192.168.1.XXX:5000/api/\""
   ```

5. **Connect & Run:**
   ```bash
   adb devices
   ./gradlew installDebug
   ```

## 🐛 Troubleshooting

### "Failed to connect to API"
- Ensure backend is running on `http://localhost:5000`
- Check API_BASE_URL in `build.gradle`
- For emulator: Use `http://10.0.2.2:5000/api/`
- For device: Use your computer's local IP

### "Gradle sync failed"
- File → Invalidate Caches → Invalidate and Restart
- Delete `.gradle` folder and re-sync
- Check internet connection for dependencies

### "App crashes on launch"
- Check Logcat in Android Studio
- View → Tool Windows → Logcat
- Filter by "Error" or "commodityx"

## 📖 Documentation

- **MYSQL_SETUP.md** - Complete MySQL database setup
- **VSCODE_SETUP_GUIDE.md** - VS Code extensions and setup
- **android-app/README.md** - Android app specific docs

## 🎯 Default User Setup

New users start with:
- **Initial Balance**: $100,000
- **Account Type**: Standard user
- **Deposit Transaction**: Automatically recorded

## 📄 License

MIT License

## 👨‍💼 Author

Built with ❤️ for commodities trading enthusiasts

---

## 🚀 Quick Start Guide

1. **Start MySQL**: `mysql.server start`
2. **Import Database**: `mysql -u root -p < database/mysql_schema.sql`
3. **Start Backend**: `cd backend && npm start`
4. **Open Android Studio**: Open `android-app/` directory
5. **Run App**: Click the green Run button

Happy Trading! 📈
