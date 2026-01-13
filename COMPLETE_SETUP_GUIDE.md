# 🚀 Complete Setup and Running Guide - Commodities Exchange Platform

## 📋 Table of Contents
1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Fixed Issues](#fixed-issues)
4. [Step-by-Step Setup](#step-by-step-setup)
5. [Running the Application](#running-the-application)
6. [Testing the Application](#testing-the-application)
7. [Troubleshooting](#troubleshooting)
8. [Features and Functionalities](#features-and-functionalities)

---

## 🎯 Overview

**Complete Commodities Exchange Platform:**
- **Backend:** Spring Boot 3.2.1 (Java 17) with MySQL
- **Frontend:** Kotlin Android App with Jetpack Compose
- **Database:** MySQL 8.0
- **Authentication:** JWT-based security

---

## 📦 Prerequisites

### Required Software:
1. **Java 17+** - Download from [Oracle](https://www.oracle.com/java/technologies/downloads/) or use OpenJDK
2. **MySQL 8.0+** - [Download MySQL](https://dev.mysql.com/downloads/installer/)
3. **Maven** - Comes bundled with Spring Boot (./mvnw)
4. **Android Studio** - [Download](https://developer.android.com/studio) (Arctic Fox or newer)
5. **Android SDK 34**
6. **Git** - [Download](https://git-scm.com/downloads)

### Verify Installations:
```bash
# Check Java version (must be 17+)
java -version

# Check MySQL
mysql --version

# Check Git
git --version
```

---

## ✅ Fixed Issues

### All Issues Resolved:

#### 1. **Entity Model Fixes**
   - ✅ **Order.java** - Removed duplicate inner enum definitions
   - ✅ **PriceAlert.java** - Changed `condition` from String to AlertCondition enum
   - ✅ **Transaction.java** - Changed `transactionType` to `type` (String) to match service usage

#### 2. **Repository Fixes**
   - ✅ **OrderRepository.java** - Updated to use OrderStatus enum directly

#### 3. **Enum Classes Created**
   - ✅ **AlertCondition.java** - ABOVE, BELOW
   - ✅ **OrderType.java** - BUY, SELL
   - ✅ **OrderStatus.java** - PENDING, COMPLETED, CANCELLED

#### 4. **Complete Backend Implementation**
   - ✅ 7 Entity classes (User, Commodity, Order, Portfolio, Transaction, Watchlist, PriceAlert)
   - ✅ 7 Repository interfaces
   - ✅ 7 DTO classes for requests/responses
   - ✅ 6 Service classes with business logic
   - ✅ 6 REST Controllers
   - ✅ 4 Security classes (JWT + Spring Security)

#### 5. **Database Initialization**
   - ✅ Created `init_commodities.sql` with 10 commodities

---

## 🛠️ Step-by-Step Setup

### Step 1: Pull Latest Code

```bash
# Navigate to project directory
cd C:\Users\M.Aftab20267\Downloads\Commodities-Exchange-claude

# Pull latest changes
git pull origin claude/add-login-exchange-features-KZGMQ
```

### Step 2: Setup MySQL Database

#### Option A: Using MySQL Workbench (Recommended for Windows)

1. **Open MySQL Workbench**
2. **Connect to your MySQL server** (localhost, root user)
3. **Create Database:**
   ```sql
   CREATE DATABASE IF NOT EXISTS commodities_exchange;
   ```
4. **Run Schema Script:**
   - File → Open SQL Script
   - Navigate to `database/mysql_schema.sql`
   - Click Execute (⚡ icon)
   
5. **Initialize Commodity Data:**
   - File → Open SQL Script
   - Navigate to `database/init_commodities.sql`
   - Click Execute (⚡ icon)

#### Option B: Using Command Line

```bash
# Start MySQL (if not running)
net start MySQL80

# Login to MySQL
mysql -u root -p

# Create database and run scripts
mysql -u root -p < database/mysql_schema.sql
mysql -u root -p < database/init_commodities.sql
```

#### Verify Database Setup:

```sql
USE commodities_exchange;
SHOW TABLES;
SELECT * FROM commodities;
```

You should see 10 commodities: Gold, Silver, Crude Oil, Natural Gas, Copper, Platinum, Palladium, Corn, Wheat, Coffee.

### Step 3: Configure Spring Boot Backend

1. **Open `spring-backend/src/main/resources/application.properties`**

2. **Update MySQL Password (if needed):**
   ```properties
   spring.datasource.password=YOUR_MYSQL_PASSWORD
   ```

3. **Verify Port (default is 5000):**
   ```properties
   server.port=5000
   ```

### Step 4: Build Spring Boot Backend

```bash
# Navigate to spring-backend directory
cd spring-backend

# Clean and compile (this will download dependencies first time - takes 2-5 minutes)
./mvnw clean compile

# If you're on Windows and mvnw doesn't work:
mvnw.cmd clean compile
```

Expected output: `BUILD SUCCESS`

### Step 5: Setup Android App

1. **Open Android Studio**
2. **File → Open** → Select `android-app` folder
3. **Wait for Gradle Sync** (this may take 3-5 minutes first time)
4. **Configure API URL:**
   - Open `android-app/app/build.gradle`
   - For Emulator (default):
     ```gradle
     buildConfigField "String", "API_BASE_URL", "\"http://10.0.2.2:5000/api/\""
     ```
   - For Physical Device:
     ```gradle
     buildConfigField "String", "API_BASE_URL", "\"http://YOUR_PC_IP:5000/api/\""
     ```

5. **Sync Gradle** again after any changes

---

## 🚀 Running the Application

### Method 1: Using Command Line (Recommended)

#### Terminal 1: Start Spring Boot Backend

```bash
# Navigate to spring-backend
cd spring-backend

# Run Spring Boot
./mvnw spring-boot:run

# On Windows:
mvnw.cmd spring-boot:run
```

**Expected Output:**
```
  .   ____          _            __ _ _
 /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
 \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| |_\__, | / / / /
 =========|_|==============|___/=/_/_/_/
 :: Spring Boot ::                (v3.2.1)

...
Server running on: http://localhost:5000/api
...
Started CommodityExchangeApplication in X.XXX seconds
```

#### Terminal 2: Run Android App (Optional - or use Android Studio)

```bash
# Navigate to android-app
cd android-app

# Install on connected device/emulator
./gradlew installDebug

# Launch the app
adb shell am start -n com.commodityx/.ui.MainActivity
```

### Method 2: Using IDEs

#### IntelliJ IDEA (Spring Boot):
1. Open `spring-backend` in IntelliJ IDEA
2. Find `CommodityExchangeApplication.java`
3. Click green ▶️ button next to `main` method
4. Or right-click → Run 'CommodityExchangeApplication'

#### Android Studio (Android App):
1. Open `android-app` in Android Studio
2. Create/Start Android Emulator (Tools → Device Manager)
3. Click green ▶️ Run button
4. Select emulator or connected device

---

## 🧪 Testing the Application

### 1. Verify Backend is Running

**Open browser or Postman:**

```
http://localhost:5000/api/commodities
```

**Expected Response:** JSON array of 10 commodities

### 2. Test User Registration (Postman)

**Request:**
```http
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "fullName": "Test User"
}
```

**Expected Response:**
```json
{
    "token": "eyJhbGciOiJIUzI1NiJ9...",
    "type": "Bearer",
    "id": 1,
    "username": "testuser",
    "email": "test@example.com",
    "fullName": "Test User",
    "balance": 100000.00,
    "isAdmin": false
}
```

### 3. Test Android App

#### Registration Flow:
1. **Launch App** → You'll see Login screen
2. **Click "Sign Up"** → Registration screen
3. **Fill Details:**
   - Username: testuser2
   - Email: test2@example.com
   - Password: password123
   - Full Name: Test User Two
4. **Click Register** → Should auto-login and show Dashboard

#### Trading Flow:
1. **Dashboard** → Shows 10 commodities with prices
2. **Click on "Gold"** → Opens trading screen
3. **Enter Quantity:** 10
4. **Click Buy** → Should show success message
5. **Check Portfolio** → Bottom nav → Portfolio
6. **Should see:** 10 units of Gold

#### Other Features:
- **Watchlist:** Add/remove favorite commodities
- **Alerts:** Set price alerts (e.g., notify when Gold > $2100)
- **Transactions:** View all buy/sell history
- **Charts:** View price charts (1H, 1D, 1W, etc.)

---

## 🐛 Troubleshooting

### Backend Issues:

#### 1. "Access denied for user 'root'@'localhost'"
**Solution:**
```bash
# Update application.properties with correct MySQL password
spring.datasource.password=YOUR_ACTUAL_PASSWORD
```

#### 2. "Port 5000 already in use"
**Solution:**
```bash
# Windows - Kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID_NUMBER> /F

# Linux/Mac
kill -9 $(lsof -ti:5000)

# Or change port in application.properties
server.port=8080
```

#### 3. "Table 'commodities_exchange.commodities' doesn't exist"
**Solution:**
```bash
# Run database scripts again
mysql -u root -p < database/mysql_schema.sql
mysql -u root -p < database/init_commodities.sql
```

#### 4. "BUILD FAILURE - Cannot resolve dependencies"
**Solution:**
```bash
# Clear Maven cache and retry
cd spring-backend
./mvnw clean
./mvnw compile -U
```

### Android App Issues:

#### 1. "Failed to connect to API"
**Checklist:**
- [ ] Is Spring Boot backend running? (Check terminal)
- [ ] Is API_BASE_URL correct in build.gradle?
- [ ] For emulator: Use `http://10.0.2.2:5000/api/`
- [ ] For device: Use PC's IP (not localhost)
- [ ] Check firewall isn't blocking port 5000

**Get Your PC IP:**
```bash
# Windows
ipconfig
# Look for "IPv4 Address" under your active network

# Linux/Mac
ifconfig | grep inet
```

#### 2. "Gradle Sync Failed"
**Solution:**
```
1. File → Invalidate Caches → Invalidate and Restart
2. Delete android-app/.gradle folder
3. Click "Sync Now"
```

#### 3. "App Crashes on Launch"
**Solution:**
```
1. View → Tool Windows → Logcat
2. Filter by "Error" or "commodityx"
3. Look for stack trace
4. Common causes:
   - Backend not running
   - Incorrect API URL
   - Network permission issues
```

#### 4. "SDK not found"
**Solution:**
```
1. File → Project Structure → SDK Location
2. Set Android SDK path (usually C:\Users\<USER>\AppData\Local\Android\Sdk)
3. Ensure SDK Platform 34 is installed (Tools → SDK Manager)
```

### Database Issues:

#### 1. "Can't connect to MySQL server"
**Solution:**
```bash
# Windows - Start MySQL Service
net start MySQL80

# Or use Services app (Win+R → services.msc)
# Find MySQL80, right-click → Start
```

#### 2. "Database 'commodities_exchange' doesn't exist"
**Solution:**
```sql
-- Login to MySQL
mysql -u root -p

-- Create database
CREATE DATABASE commodities_exchange;

-- Verify
SHOW DATABASES;
```

#### 3. "Access denied" or "Password issues"
**Solution:**
```bash
# Reset MySQL root password (if needed)
# See MYSQL_PASSWORD_SETUP.md for detailed steps
```

---

## ✨ Features and Functionalities

### 🔐 Authentication & Security
- [x] User Registration with email validation
- [x] JWT-based authentication
- [x] BCrypt password hashing
- [x] Token expiration (24 hours)
- [x] Secured API endpoints
- [x] Automatic token refresh
- [x] Protected routes

### 💹 Trading Features
- [x] **Real-time Market Data**
  - View 10 commodities with live prices
  - 24h price change indicators
  - High/Low/Volume stats
  
- [x] **Buy/Sell Orders**
  - Instant market orders
  - Balance validation
  - Quantity validation
  - Order confirmation
  - Order history with filters
  
- [x] **Portfolio Management**
  - View all holdings
  - Real-time P&L calculations
  - Average price tracking
  - Current value updates
  - Profit/Loss indicators
  
- [x] **Watchlist**
  - Add/remove favorite commodities
  - Quick access to tracked items
  - Persistent across sessions
  
- [x] **Price Alerts**
  - Set price targets (Above/Below)
  - Active alert management
  - Alert notifications
  - Delete completed alerts

### 💰 Wallet Management
- [x] Starting balance: $100,000
- [x] Real-time balance updates
- [x] Transaction history
- [x] Deposit/Withdrawal tracking
- [x] Balance after each trade
- [x] Complete audit trail

### 📊 Analytics & Charts
- [x] Interactive price charts
- [x] Multiple timeframes (1H, 1D, 1W, 1M, 3M, 1Y)
- [x] Canvas-based rendering
- [x] Touch interactions
- [x] Price indicators

### 🎨 UI/UX Features
- [x] **Cyberpunk Theme**
  - Neon colors (Cyan, Green, Purple, Red)
  - Dark background
  - Glassmorphism effects
  - Gradient borders
  - Glow effects
  
- [x] **Navigation**
  - Bottom navigation (Dashboard, Portfolio, Charts, Profile)
  - Top menu (Watchlist, Alerts, Transactions)
  - Smooth transitions
  - Back button support
  
- [x] **Responsive Design**
  - Material Design 3
  - Adaptive layouts
  - Loading states
  - Error handling
  - Success feedback

### 🏗️ Technical Features
- [x] **Backend (Spring Boot)**
  - RESTful API design
  - Layer architecture (Controller → Service → Repository)
  - JPA/Hibernate ORM
  - MySQL connection pooling
  - Transaction management
  - Exception handling
  - CORS configuration
  
- [x] **Frontend (Kotlin Android)**
  - MVVM architecture
  - Jetpack Compose
  - StateFlow for reactive state
  - Coroutines for async operations
  - Retrofit for networking
  - JWT token storage
  - Automatic token injection
  
- [x] **Database (MySQL)**
  - 7 normalized tables
  - Foreign key constraints
  - Indexes on key columns
  - Automatic timestamps
  - Data validation

### 📡 API Endpoints

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile

#### Commodities
- `GET /api/commodities` - Get all commodities
- `GET /api/commodities/{id}` - Get commodity by ID

#### Trading
- `POST /api/trading/order` - Place buy/sell order
- `GET /api/trading/orders` - Get user orders
- `GET /api/trading/portfolio` - Get user portfolio
- `DELETE /api/trading/orders/{id}` - Cancel pending order

#### Watchlist
- `GET /api/watchlist` - Get user watchlist
- `POST /api/watchlist` - Add to watchlist
- `DELETE /api/watchlist/{commodityId}` - Remove from watchlist

#### Alerts
- `GET /api/alerts` - Get user alerts
- `POST /api/alerts` - Create price alert
- `DELETE /api/alerts/{id}` - Delete alert

#### Transactions
- `GET /api/transactions` - Get transaction history

---

## 📚 Additional Documentation

- **MYSQL_SETUP.md** - Detailed MySQL setup
- **MYSQL_PASSWORD_SETUP.md** - MySQL password configuration
- **SPRING_BOOT_COMPLETE_GUIDE.md** - Spring Boot detailed guide
- **VSCODE_ANDROID_SETUP.md** - VS Code Android setup
- **README.md** - Project overview

---

## 🎯 Quick Start Summary

```bash
# 1. Start MySQL
net start MySQL80

# 2. Setup Database
mysql -u root -p < database/mysql_schema.sql
mysql -u root -p < database/init_commodities.sql

# 3. Start Backend
cd spring-backend
./mvnw spring-boot:run

# 4. Open Android Studio
# Open android-app folder
# Click Run ▶️
```

---

## ✅ Verification Checklist

Before considering setup complete, verify:

- [ ] MySQL service is running
- [ ] Database 'commodities_exchange' exists with all tables
- [ ] 10 commodities are in database
- [ ] Spring Boot starts without errors
- [ ] Can access http://localhost:5000/api/commodities
- [ ] Android app connects to backend
- [ ] Can register new user
- [ ] Can login with registered user
- [ ] Can view commodities on dashboard
- [ ] Can place buy order
- [ ] Order appears in portfolio
- [ ] Balance updates after trade

---

## 🎉 Success Indicators

**You'll know everything works when:**

1. ✅ Spring Boot shows "Started CommodityExchangeApplication"
2. ✅ Browser shows commodities JSON at http://localhost:5000/api/commodities
3. ✅ Android app shows 10 commodities on Dashboard
4. ✅ Can register → login → buy → portfolio updates
5. ✅ Balance changes from $100,000 after trade
6. ✅ All screens (Dashboard, Portfolio, Charts, Profile) work
7. ✅ No errors in Logcat (Android Studio)
8. ✅ No errors in Spring Boot console

---

## 📞 Need Help?

If you encounter issues not covered here:

1. Check the specific guide (SPRING_BOOT_COMPLETE_GUIDE.md, etc.)
2. Review Troubleshooting section above
3. Check Spring Boot console for error messages
4. Check Android Logcat for app errors
5. Verify all prerequisites are installed correctly
6. Ensure MySQL service is running
7. Verify firewall isn't blocking connections

---

**Happy Trading! 📈💰**

---

*Last Updated: January 2026*
*Version: 1.0.0*
*Platform: Windows 10/11, Android 8+*
