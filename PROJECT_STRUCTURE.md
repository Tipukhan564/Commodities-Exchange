# 📁 Complete Project Structure - Commodities Exchange

## 🎯 Overview

This document shows the complete separation of Android app and Spring Boot backend, with clear connectivity between them.

---

## 📂 ROOT PROJECT STRUCTURE

```
Commodities-Exchange/                    [ROOT - Git Repository]
├── android-app/                         [SEPARATE: Android Application]
│   ├── app/                             [Android app module]
│   ├── build.gradle                     [Android build config]
│   ├── settings.gradle                  [Android settings]
│   ├── gradle.properties                [Gradle properties]
│   └── gradlew                          [Gradle wrapper]
│
├── spring-backend/                      [SEPARATE: Spring Boot Backend]
│   ├── src/                             [Java source code]
│   ├── pom.xml                          [Maven config]
│   ├── mvnw                             [Maven wrapper]
│   └── application.properties           [Backend config]
│
├── database/                            [DATABASE: MySQL Scripts]
│   ├── mysql_schema.sql                 [Main schema]
│   ├── init_commodities.sql             [Sample data]
│   └── expand_schema.sql                [Extension schema]
│
└── DOCUMENTATION/                       [PROJECT DOCS]
    ├── README.md
    ├── COMPLETE_SETUP_GUIDE.md
    ├── HOW_TO_EXPAND_APP.md
    └── IMPLEMENTATION_GUIDE.md
```

---

## 🤖 ANDROID APP STRUCTURE (Completely Separate)

### Location: `/android-app/`

```
android-app/                             [ANDROID PROJECT ROOT]
├── app/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/commodityx/
│   │   │   │   ├── data/                [Data Layer]
│   │   │   │   │   ├── model/
│   │   │   │   │   │   ├── User.kt
│   │   │   │   │   │   ├── Commodity.kt
│   │   │   │   │   │   ├── Order.kt
│   │   │   │   │   │   ├── Portfolio.kt
│   │   │   │   │   │   ├── Transaction.kt
│   │   │   │   │   │   ├── Watchlist.kt
│   │   │   │   │   │   └── Alert.kt
│   │   │   │   │   └── remote/
│   │   │   │   │       └── ApiService.kt [Retrofit Interface]
│   │   │   │   │
│   │   │   │   ├── network/             [Network Layer]
│   │   │   │   │   ├── RetrofitClient.kt
│   │   │   │   │   └── AuthInterceptor.kt
│   │   │   │   │
│   │   │   │   ├── ui/                  [UI Layer - Jetpack Compose]
│   │   │   │   │   ├── MainActivity.kt
│   │   │   │   │   ├── auth/
│   │   │   │   │   │   ├── LoginScreen.kt
│   │   │   │   │   │   └── RegisterScreen.kt
│   │   │   │   │   ├── dashboard/
│   │   │   │   │   │   └── DashboardScreen.kt
│   │   │   │   │   ├── portfolio/
│   │   │   │   │   │   └── PortfolioScreen.kt
│   │   │   │   │   ├── trading/
│   │   │   │   │   │   └── TradingScreen.kt
│   │   │   │   │   ├── charts/
│   │   │   │   │   │   └── ChartsScreen.kt
│   │   │   │   │   ├── orders/
│   │   │   │   │   │   └── OrdersScreen.kt
│   │   │   │   │   ├── watchlist/
│   │   │   │   │   │   └── WatchlistScreen.kt
│   │   │   │   │   ├── alerts/
│   │   │   │   │   │   └── AlertsScreen.kt
│   │   │   │   │   ├── profile/
│   │   │   │   │   │   └── ProfileScreen.kt
│   │   │   │   │   └── transactions/
│   │   │   │   │       └── TransactionsScreen.kt
│   │   │   │   │
│   │   │   │   ├── viewmodel/           [ViewModel Layer]
│   │   │   │   │   ├── AuthViewModel.kt
│   │   │   │   │   ├── DashboardViewModel.kt
│   │   │   │   │   ├── PortfolioViewModel.kt
│   │   │   │   │   ├── TradingViewModel.kt
│   │   │   │   │   ├── ChartsViewModel.kt
│   │   │   │   │   ├── OrdersViewModel.kt
│   │   │   │   │   ├── WatchlistViewModel.kt
│   │   │   │   │   ├── AlertsViewModel.kt
│   │   │   │   │   └── ProfileViewModel.kt
│   │   │   │   │
│   │   │   │   └── utils/               [Utilities]
│   │   │   │       ├── Constants.kt
│   │   │   │       ├── PreferencesManager.kt
│   │   │   │       └── DateTimeUtils.kt
│   │   │   │
│   │   │   ├── res/                     [Resources]
│   │   │   │   ├── values/
│   │   │   │   │   ├── strings.xml
│   │   │   │   │   ├── colors.xml
│   │   │   │   │   └── themes.xml
│   │   │   │   ├── drawable/
│   │   │   │   ├── mipmap/
│   │   │   │   └── xml/
│   │   │   │
│   │   │   └── AndroidManifest.xml      [App Manifest]
│   │   │
│   │   └── build.gradle                 [App-level Gradle]
│   │
│   └── build.gradle                     [Project-level Gradle]
│
├── gradle.properties                    [Gradle Settings]
├── settings.gradle                      [Module Settings]
└── local.properties                     [Local SDK path]
```

### Key Android Files:

#### 1. **build.gradle** (Project-level)
- Defines Kotlin and Android versions
- Configures repositories
- No backend dependencies

#### 2. **build.gradle** (App-level)
- Android SDK configuration
- Jetpack Compose setup
- Retrofit for API calls
- **API_BASE_URL** configuration

#### 3. **gradle.properties**
- **JVM memory: 2048m** (fixed!)
- Build optimization settings

#### 4. **AndroidManifest.xml**
- App permissions (INTERNET)
- Activity declarations
- App metadata

---

## ☕ SPRING BOOT BACKEND STRUCTURE (Completely Separate)

### Location: `/spring-backend/`

```
spring-backend/                          [BACKEND PROJECT ROOT]
├── src/
│   ├── main/
│   │   ├── java/com/commodityx/backend/
│   │   │   ├── model/                   [JPA Entities]
│   │   │   │   ├── User.java
│   │   │   │   ├── Commodity.java
│   │   │   │   ├── Order.java
│   │   │   │   ├── Portfolio.java
│   │   │   │   ├── Transaction.java
│   │   │   │   ├── Watchlist.java
│   │   │   │   ├── PriceAlert.java
│   │   │   │   ├── OrderType.java       [Enum]
│   │   │   │   ├── OrderStatus.java     [Enum]
│   │   │   │   └── AlertCondition.java  [Enum]
│   │   │   │
│   │   │   ├── repository/              [Spring Data JPA]
│   │   │   │   ├── UserRepository.java
│   │   │   │   ├── CommodityRepository.java
│   │   │   │   ├── OrderRepository.java
│   │   │   │   ├── PortfolioRepository.java
│   │   │   │   ├── TransactionRepository.java
│   │   │   │   ├── WatchlistRepository.java
│   │   │   │   └── PriceAlertRepository.java
│   │   │   │
│   │   │   ├── dto/                     [Data Transfer Objects]
│   │   │   │   ├── LoginRequest.java
│   │   │   │   ├── RegisterRequest.java
│   │   │   │   ├── JwtResponse.java
│   │   │   │   ├── OrderRequest.java
│   │   │   │   ├── WatchlistRequest.java
│   │   │   │   ├── AlertRequest.java
│   │   │   │   └── MessageResponse.java
│   │   │   │
│   │   │   ├── service/                 [Business Logic]
│   │   │   │   ├── AuthService.java
│   │   │   │   ├── CommodityService.java
│   │   │   │   ├── TradingService.java
│   │   │   │   ├── WatchlistService.java
│   │   │   │   ├── AlertService.java
│   │   │   │   └── TransactionService.java
│   │   │   │
│   │   │   ├── controller/              [REST Controllers]
│   │   │   │   ├── AuthController.java
│   │   │   │   ├── CommodityController.java
│   │   │   │   ├── TradingController.java
│   │   │   │   ├── WatchlistController.java
│   │   │   │   ├── AlertController.java
│   │   │   │   └── TransactionController.java
│   │   │   │
│   │   │   ├── security/                [Security Config]
│   │   │   │   ├── JwtUtils.java
│   │   │   │   ├── JwtAuthenticationFilter.java
│   │   │   │   ├── UserDetailsServiceImpl.java
│   │   │   │   └── SecurityConfig.java
│   │   │   │
│   │   │   └── CommodityExchangeApplication.java [Main]
│   │   │
│   │   └── resources/
│   │       ├── application.properties    [Config]
│   │       └── static/
│   │
│   └── test/                            [Unit Tests]
│
├── pom.xml                              [Maven Config]
├── mvnw                                 [Maven Wrapper]
└── README.md
```

### Key Backend Files:

#### 1. **pom.xml**
- Spring Boot 3.2.1
- Spring Data JPA
- Spring Security
- MySQL Connector
- JWT dependencies

#### 2. **application.properties**
- **MySQL connection: localhost:3306**
- **Database: commodities_exchange**
- **Server port: 5000**
- JWT secret and expiration

---

## 🗄️ DATABASE STRUCTURE

### Location: `/database/`

```
database/
├── mysql_schema.sql                     [Main Tables]
│   ├── users
│   ├── commodities
│   ├── orders
│   ├── portfolio
│   ├── transactions
│   ├── watchlist
│   └── price_alerts
│
├── init_commodities.sql                 [Sample Data]
│   └── 10 commodities (Gold, Silver, etc.)
│
└── expand_schema.sql                    [Expansion Tables]
    ├── notifications
    ├── payment_methods
    ├── deposits
    ├── withdrawals
    ├── news_articles
    ├── user_settings
    ├── trading_sessions
    ├── price_history
    └── activity_log
```

---

## 🔗 HOW THEY CONNECT

### Android App → Spring Boot Backend → MySQL

```
┌─────────────────────────────────────────────────────────────┐
│                      ANDROID APP                             │
│  (Kotlin + Jetpack Compose + Retrofit)                      │
│                                                              │
│  ┌──────────────────────────────────────────────┐           │
│  │ User Interface (Compose Screens)             │           │
│  └────────────────┬─────────────────────────────┘           │
│                   │                                          │
│  ┌────────────────▼─────────────────────────────┐           │
│  │ ViewModel (State Management)                 │           │
│  └────────────────┬─────────────────────────────┘           │
│                   │                                          │
│  ┌────────────────▼─────────────────────────────┐           │
│  │ Retrofit ApiService (HTTP Client)            │           │
│  │ - POST /api/auth/login                       │           │
│  │ - GET /api/commodities                       │           │
│  │ - POST /api/trading/order                    │           │
│  └────────────────┬─────────────────────────────┘           │
└───────────────────┼─────────────────────────────────────────┘
                    │
                    │ HTTP/JSON
                    │ http://10.0.2.2:5000/api/
                    │
┌───────────────────▼─────────────────────────────────────────┐
│                  SPRING BOOT BACKEND                         │
│  (Java 17 + Spring Boot 3.2.1 + JPA)                        │
│                                                              │
│  ┌──────────────────────────────────────────────┐           │
│  │ REST Controllers (@RestController)           │           │
│  │ - @PostMapping("/api/auth/login")            │           │
│  │ - @GetMapping("/api/commodities")            │           │
│  └────────────────┬─────────────────────────────┘           │
│                   │                                          │
│  ┌────────────────▼─────────────────────────────┐           │
│  │ Service Layer (Business Logic)               │           │
│  │ - AuthService                                │           │
│  │ - TradingService                             │           │
│  │ - CommodityService                           │           │
│  └────────────────┬─────────────────────────────┘           │
│                   │                                          │
│  ┌────────────────▼─────────────────────────────┐           │
│  │ Repository Layer (Spring Data JPA)           │           │
│  │ - UserRepository                             │           │
│  │ - CommodityRepository                        │           │
│  │ - OrderRepository                            │           │
│  └────────────────┬─────────────────────────────┘           │
│                   │                                          │
│  ┌────────────────▼─────────────────────────────┐           │
│  │ JPA Entities (@Entity)                       │           │
│  │ - User, Commodity, Order                     │           │
│  └────────────────┬─────────────────────────────┘           │
└───────────────────┼─────────────────────────────────────────┘
                    │
                    │ JDBC
                    │ jdbc:mysql://localhost:3306/commodities_exchange
                    │
┌───────────────────▼─────────────────────────────────────────┐
│                  MYSQL DATABASE                              │
│  (MySQL 8.0)                                                │
│                                                              │
│  ┌──────────────────────────────────────────────┐           │
│  │ Tables                                       │           │
│  │ - users (authentication)                     │           │
│  │ - commodities (market data)                  │           │
│  │ - orders (buy/sell records)                  │           │
│  │ - portfolio (user holdings)                  │           │
│  │ - transactions (transaction history)         │           │
│  │ - watchlist (favorites)                      │           │
│  │ - price_alerts (price alerts)                │           │
│  └──────────────────────────────────────────────┘           │
└─────────────────────────────────────────────────────────────┘
```

### Example Flow: User Places Buy Order

1. **Android App (UI):**
   - User fills trading form: commodity="Gold", quantity=10
   - Clicks "Buy" button
   
2. **Android App (ViewModel):**
   - TradingViewModel.placeOrder() called
   - Creates OrderRequest(commodityId=1, orderType="BUY", quantity=10, price=2050.00)
   
3. **Android App (Retrofit):**
   - ApiService.placeOrder(request)
   - HTTP POST to `http://10.0.2.2:5000/api/trading/order`
   - Headers: Authorization: Bearer <JWT_TOKEN>
   - Body: JSON with order details
   
4. **Spring Boot (Controller):**
   - TradingController.placeOrder(@RequestBody OrderRequest)
   - Validates JWT token
   - Extracts user from token
   
5. **Spring Boot (Service):**
   - TradingService.placeOrder(request)
   - Validates user balance
   - Calculates total cost
   - Creates Order entity
   - Updates user balance
   - Updates portfolio
   - Creates transaction record
   
6. **Spring Boot (Repository):**
   - OrderRepository.save(order)
   - UserRepository.save(user)
   - PortfolioRepository.save(portfolio)
   - TransactionRepository.save(transaction)
   
7. **MySQL Database:**
   - INSERT INTO orders ...
   - UPDATE users SET balance = ...
   - INSERT INTO portfolio ...
   - INSERT INTO transactions ...
   - COMMIT transaction
   
8. **Response Flow (back to Android):**
   - Database → Repository → Service → Controller
   - HTTP 200 OK with Order JSON
   - Retrofit receives response
   - ViewModel updates UI state
   - Compose recomposes screen
   - User sees success message and updated balance

---

## 🚀 HOW TO RUN BOTH SEPARATELY

### Terminal 1: Run Spring Boot Backend

```bash
cd spring-backend
./mvnw spring-boot:run
```

**Output:**
```
Server running on: http://localhost:5000/api
Started CommodityExchangeApplication in 3.456 seconds
```

### Terminal 2: Run Android App

**Option A: Android Studio**
```
1. Open android-app/ in Android Studio
2. Wait for Gradle sync
3. Click Run ▶️
```

**Option B: Command Line**
```bash
cd android-app
./gradlew assembleDebug
./gradlew installDebug
```

**They communicate via:**
- Android: Retrofit HTTP client
- Backend: REST API endpoints
- Protocol: HTTP/JSON
- URL: http://10.0.2.2:5000/api/

---

## 📝 CONFIGURATION FILES

### Android Configuration

**File: `android-app/app/build.gradle`**
```gradle
buildConfigField "String", "API_BASE_URL", "\"http://10.0.2.2:5000/api/\""
```

**File: `android-app/gradle.properties`**
```properties
org.gradle.jvmargs=-Xmx2048m -XX:MaxMetaspaceSize=512m
```

### Backend Configuration

**File: `spring-backend/src/main/resources/application.properties`**
```properties
server.port=5000
server.servlet.context-path=/api

spring.datasource.url=jdbc:mysql://localhost:3306/commodities_exchange
spring.datasource.username=root
spring.datasource.password=root

jwt.secret=your-256-bit-secret-key
jwt.expiration=86400000
```

### Database Configuration

**Connection String:**
```
jdbc:mysql://localhost:3306/commodities_exchange
```

**Credentials:**
- Username: root
- Password: root (change in production!)

---

## ✅ INDEPENDENCE VERIFICATION

### Android App is Independent:
- ✅ Has own build system (Gradle)
- ✅ Has own dependencies (Retrofit, Compose)
- ✅ Can be built separately
- ✅ Can be deployed separately
- ✅ Only connects via HTTP API

### Backend is Independent:
- ✅ Has own build system (Maven)
- ✅ Has own dependencies (Spring Boot)
- ✅ Can be run separately
- ✅ Can be deployed separately
- ✅ Exposes REST API

### Database is Independent:
- ✅ Separate MySQL instance
- ✅ Can be accessed by multiple clients
- ✅ Has own backup/restore

---

## 🎯 BUILD & RUN CHECKLIST

### Before Building:

- [ ] Java 17+ installed
- [ ] MySQL 8.0+ running
- [ ] Android Studio installed
- [ ] Android SDK 34 installed
- [ ] Database schema loaded

### Building Backend:

```bash
cd spring-backend
./mvnw clean compile
# Should show: BUILD SUCCESS
```

### Building Android:

```bash
cd android-app
./gradlew clean build
# Should show: BUILD SUCCESSFUL
```

### Running Full Stack:

1. **Start MySQL:** `net start MySQL80`
2. **Start Backend:** `cd spring-backend && ./mvnw spring-boot:run`
3. **Start Android:** Open Android Studio → Run
4. **Test:** Login → View Dashboard → Place trade

---

## 📊 FILE COUNT SUMMARY

- **Android Files:** ~50+ files (Kotlin, XML, Gradle)
- **Backend Files:** ~30+ files (Java, Properties)
- **Database Files:** 3 files (SQL scripts)
- **Documentation:** 10+ files (MD guides)

**Total Project:** ~100+ files

---

**Everything is properly separated, configured, and connected!**

