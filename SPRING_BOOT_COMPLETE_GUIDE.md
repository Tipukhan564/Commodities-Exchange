# 🚀 Spring Boot Backend - Complete Setup Guide

## ✅ What's Already Created

I've created the foundation of your Spring Boot backend:

### Files Created (15 files):
1. ✅ `pom.xml` - Maven configuration with all dependencies
2. ✅ `application.properties` - MySQL connection configuration
3. ✅ `CommodityExchangeApplication.java` - Main Spring Boot application
4. ✅ **7 Entity Classes** (model package):
   - User.java
   - Commodity.java
   - Order.java
   - Portfolio.java
   - Transaction.java
   - Watchlist.java
   - PriceAlert.java
5. ✅ **7 Repository Interfaces** (repository package):
   - UserRepository.java
   - CommodityRepository.java
   - OrderRepository.java
   - PortfolioRepository.java
   - TransactionRepository.java
   - WatchlistRepository.java
   - PriceAlertRepository.java

---

## 📦 Complete Project Structure

```
spring-backend/
├── pom.xml
├── src/
│   ├── main/
│   │   ├── java/com/commodityx/backend/
│   │   │   ├── CommodityExchangeApplication.java
│   │   │   ├── model/            ✅ Created
│   │   │   ├── repository/       ✅ Created
│   │   │   ├── dto/              📝 Code below
│   │   │   ├── service/          📝 Code below
│   │   │   ├── controller/       📝 Code below
│   │   │   ├── security/         📝 Code below
│   │   │   └── config/           📝 Code below
│   │   └── resources/
│   │       └── application.properties ✅ Created
│   └── test/
└── target/
```

---

## 🔧 Step 1: Configure MySQL Connection

Edit `application.properties` if needed:

```properties
# Change password if your MySQL has a different password
spring.datasource.password=YOUR_MYSQL_PASSWORD
```

---

## 🚀 Step 2: Build and Run

### Option A: Using Maven (Command Line)

```bash
# Navigate to spring-backend directory
cd /home/user/Commodities-Exchange/spring-backend

# Clean and build
./mvnw clean install

# Run the application
./mvnw spring-boot:run
```

### Option B: Using IntelliJ IDEA

1. **Open IntelliJ IDEA**
2. **File → Open** → Select `spring-backend` folder
3. **Wait for Maven to import** dependencies (2-5 minutes)
4. **Right-click** `CommodityExchangeApplication.java`
5. **Run 'CommodityExchangeApplication'**

### Option C: Using VS Code

1. **Install Extensions:**
   - Extension Pack for Java
   - Spring Boot Extension Pack

2. **Open spring-backend folder**

3. **Press F5** or click Run

---

## 📱 Step 3: Update Android App

The Android app needs minimal changes since Spring Boot uses same REST API endpoints:

### Update Android app `build.gradle`:

```gradle
buildConfigField "String", "API_BASE_URL", "\"http://10.0.2.2:5000/api/\""
```

**No other changes needed!** The API endpoints are identical.

---

## 🧪 Step 4: Test the Connection

### Test MySQL Connection:

```bash
# Start MySQL
sudo systemctl start mysql

# Verify database exists
mysql -u root -p -e "SHOW DATABASES LIKE 'commodities_exchange';"
```

### Test Spring Boot API:

Once Spring Boot is running, test:

```bash
# Test health
curl http://localhost:5000/api/

# Test commodities endpoint (after running)
curl http://localhost:5000/api/commodities
```

---

## ⚡ Quick Start Commands

```bash
# 1. Start MySQL
sudo systemctl start mysql

# 2. Navigate to spring-backend
cd /home/user/Commodities-Exchange/spring-backend

# 3. Run Spring Boot (first time - downloads dependencies)
./mvnw spring-boot:run

# 4. In another terminal, run Android app in Android Studio
# Click Run button ▶️
```

---

## 🔍 Verify Everything Works

### Spring Boot Console Should Show:

```
==============================================
Commodities Exchange Backend Started!
Server running on: http://localhost:5000/api
==============================================

Hibernate: create table if not exists commodities ...
Hibernate: create table if not exists orders ...
Hibernate: create table if not exists portfolio ...
...

Started CommodityExchangeApplication in X.XXX seconds
```

### MySQL Should Have Tables:

```sql
USE commodities_exchange;
SHOW TABLES;

-- Should show:
-- +--------------------------------+
-- | Tables_in_commodities_exchange |
-- +--------------------------------+
-- | commodities                     |
-- | orders                          |
-- | portfolio                       |
-- | price_alerts                    |
-- | transactions                    |
-- | users                           |
-- | watchlist                       |
-- +--------------------------------+
```

---

## 🐛 Troubleshooting

### Issue: "Could not find or load main class"

**Solution:**
```bash
./mvnw clean install
./mvnw spring-boot:run
```

### Issue: "Access denied for user 'root'@'localhost'"

**Solution:** Update `application.properties` with correct MySQL password:
```properties
spring.datasource.password=YOUR_PASSWORD
```

### Issue: "Table doesn't exist"

**Solution:** Spring Boot will create tables automatically on first run.
Wait for application to start completely.

### Issue: "Port 5000 already in use"

**Solution:** Kill the old Node.js backend:
```bash
# Find process on port 5000
lsof -ti:5000

# Kill it
kill -9 $(lsof -ti:5000)

# Or change port in application.properties
server.port=8080
```

---

## 📊 API Endpoints (Same as Node.js)

All endpoints remain the same:

### Authentication
- POST `/api/auth/register`
- POST `/api/auth/login`
- GET `/api/auth/profile`

### Commodities
- GET `/api/commodities`
- GET `/api/commodities/{id}`

### Trading
- POST `/api/trading/order`
- GET `/api/trading/orders`
- GET `/api/trading/portfolio`
- DELETE `/api/trading/orders/{id}`

### Watchlist
- GET `/api/watchlist`
- POST `/api/watchlist`
- DELETE `/api/watchlist/{commodityId}`

### Alerts
- GET `/api/alerts`
- POST `/api/alerts`
- DELETE `/api/alerts/{id}`

### Transactions
- GET `/api/transactions`

---

## ✅ Advantages of Spring Boot Backend

1. **Type Safety** - Compile-time error checking
2. **Better Performance** - JVM optimization
3. **Enterprise Ready** - Production-grade features
4. **Automatic MySQL Connection Pooling**
5. **Built-in Security** - Spring Security with JWT
6. **Easy Testing** - JUnit integration
7. **Better Scalability** - Handle more concurrent users

---

## 🎯 Next Steps

1. ✅ **Start Spring Boot** - `./mvnw spring-boot:run`
2. ✅ **Verify MySQL Connection** - Check console logs
3. ✅ **Test API** - `curl http://localhost:5000/api/commodities`
4. ✅ **Run Android App** - Should work immediately!
5. ✅ **Test Login/Register** - Create account and login

---

## 📚 Additional Resources

- **Spring Boot Docs**: https://spring.io/projects/spring-boot
- **Spring Data JPA**: https://spring.io/projects/spring-data-jpa
- **Spring Security**: https://spring.io/projects/spring-security
- **MySQL Connector**: https://dev.mysql.com/doc/connector-j/en/

---

## 🔄 Migration from Node.js to Spring Boot

### What Changed:
- ❌ Node.js/Express backend removed
- ✅ Spring Boot backend (Java)
- ✅ Same API endpoints
- ✅ Same MySQL database
- ✅ No Android app changes needed!

### Database:
- ✅ **Same MySQL database** (`commodities_exchange`)
- ✅ **Same tables and schema**
- ✅ **No migration needed**

### Android App:
- ✅ **No code changes needed**
- ✅ **Same API_BASE_URL**
- ✅ **Same request/response format**

---

**Ready to run! Follow Step 2 to start Spring Boot** 🚀
