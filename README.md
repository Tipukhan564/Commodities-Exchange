# Commodities Exchange - Native Android App

A comprehensive native Android commodities trading application with a futuristic cyberpunk UI, built with **Kotlin**, **Jetpack Compose**, **Spring Boot**, and **MySQL**.

## 🚀 Features

### Authentication & Security
- User registration and login with JWT authentication
- Secure password hashing with BCrypt
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
- **Spring Boot 3.2.1** - Enterprise Java framework
- **Spring Data JPA** - ORM with Hibernate
- **Spring Security** - Authentication & authorization
- **MySQL** - Relational database
- **JWT** - Token-based authentication
- **BCrypt** - Password hashing
- **Maven** - Build and dependency management
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
- **JDK 17+**
- **Android SDK 34**
- **Maven** (comes with Spring Boot wrapper)
- **MySQL** (8.0 or higher)

### 1. Database Setup

```bash
# Start MySQL
sudo systemctl start mysql

# Import database schema
mysql -u root -p commodities_exchange < database/mysql_schema.sql
```

See detailed instructions in:
- `MYSQL_SETUP.md` - Complete MySQL setup guide
- `MYSQL_PASSWORD_SETUP.md` - Password configuration

### 2. Backend Setup (Spring Boot)

```bash
# Navigate to spring-backend directory
cd spring-backend

# Configure MySQL password (if needed)
# Edit src/main/resources/application.properties
# Change: spring.datasource.password=YOUR_MYSQL_PASSWORD

# Run the application
./mvnw spring-boot:run

# Or if mvnw doesn't work
mvn spring-boot:run
```

The backend server will run on `http://localhost:5000/api`

**See complete setup guide:** `SPRING_BOOT_COMPLETE_GUIDE.md`

### 3. Android App Setup

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

#### Option B: Using VS Code

See `VSCODE_ANDROID_SETUP.md` for complete VS Code setup instructions.

#### Option C: Using Command Line

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
├── spring-backend/              # Spring Boot REST API
│   ├── src/main/
│   │   ├── java/com/commodityx/backend/
│   │   │   ├── model/           # JPA Entities
│   │   │   ├── repository/      # Spring Data repositories
│   │   │   ├── dto/             # Data Transfer Objects
│   │   │   ├── service/         # Business logic
│   │   │   ├── controller/      # REST Controllers
│   │   │   ├── security/        # JWT & Security config
│   │   │   └── config/          # Application configuration
│   │   └── resources/
│   │       └── application.properties
│   └── pom.xml
├── database/                    # MySQL schema & setup
│   └── mysql_schema.sql
├── MYSQL_SETUP.md              # MySQL setup instructions
├── MYSQL_PASSWORD_SETUP.md     # MySQL password configuration
├── SPRING_BOOT_COMPLETE_GUIDE.md  # Complete Spring Boot guide
├── VSCODE_ANDROID_SETUP.md     # VS Code Android development
└── README.md                    # This file
```

## 🔒 Security Features

- Password hashing with BCrypt (Spring Security)
- JWT token-based authentication
- Token storage in encrypted DataStore
- Protected API routes with Spring Security filters
- Automatic token injection via interceptors
- SQL injection prevention with JPA/Hibernate
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
- Ensure Spring Boot is running on `http://localhost:5000`
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

### Spring Boot Issues
- **"Access denied for user 'root'@'localhost'"** - Update password in `application.properties`
- **"Port 5000 already in use"** - Kill process: `kill -9 $(lsof -ti:5000)`
- **"Could not find or load main class"** - Run: `./mvnw clean install`

See `SPRING_BOOT_COMPLETE_GUIDE.md` for complete troubleshooting.

## 📖 Documentation

- **SPRING_BOOT_COMPLETE_GUIDE.md** - Complete Spring Boot setup guide
- **MYSQL_SETUP.md** - Complete MySQL database setup
- **MYSQL_PASSWORD_SETUP.md** - MySQL password configuration
- **VSCODE_ANDROID_SETUP.md** - VS Code Android development setup
- **spring-backend/README.md** - Spring Boot backend quick start
- **android-app/README.md** - Android app specific docs

## 🎯 Default User Setup

New users start with:
- **Initial Balance**: $100,000
- **Account Type**: Standard user
- **Deposit Transaction**: Automatically recorded

## ✅ Advantages of Spring Boot Backend

1. **Type Safety** - Compile-time error checking
2. **Better Performance** - JVM optimization
3. **Enterprise Ready** - Production-grade features
4. **Automatic MySQL Connection Pooling**
5. **Built-in Security** - Spring Security with JWT
6. **Easy Testing** - JUnit integration
7. **Better Scalability** - Handle more concurrent users

## 📄 License

MIT License

## 👨‍💼 Author

Built with ❤️ for commodities trading enthusiasts

---

## 🚀 Quick Start Guide

1. **Start MySQL**: `sudo systemctl start mysql`
2. **Verify Database**: `mysql -u root -p -e "SHOW DATABASES LIKE 'commodities_exchange';"`
3. **Start Spring Boot**: `cd spring-backend && ./mvnw spring-boot:run`
4. **Open Android Studio**: Open `android-app/` directory
5. **Run App**: Click the green Run button ▶️

Happy Trading! 📈
