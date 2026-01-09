# Spring Boot Backend - Commodities Exchange

## 🚀 Quick Start

```bash
# Install Maven (if not installed)
sudo apt-get install maven  # Linux
brew install maven           # Mac

# Run the application
./mvnw spring-boot:run

# Or if mvnw doesn't work
mvn spring-boot:run
```

## ✅ What's Included

- ✅ Spring Boot 3.2.1
- ✅ Spring Data JPA with MySQL
- ✅ Spring Security with JWT
- ✅ All REST API endpoints
- ✅ Entity classes (User, Commodity, Order, etc.)
- ✅ Repository layer
- ✅ Ready for production

## 🔧 Configuration

Edit `src/main/resources/application.properties`:

```properties
spring.datasource.password=YOUR_MYSQL_PASSWORD
```

## 📡 API Endpoints

Once running, API available at: `http://localhost:5000/api`

- POST `/api/auth/register` - Register user
- POST `/api/auth/login` - Login
- GET `/api/commodities` - Get all commodities
- POST `/api/trading/order` - Place order
- GET `/api/trading/portfolio` - Get portfolio
- And more...

## 🐛 Troubleshooting

**Issue: Maven not found**
```bash
sudo apt-get install maven
```

**Issue: Port already in use**
```bash
# Kill process on port 5000
kill -9 $(lsof -ti:5000)
```

**Issue: MySQL connection failed**
- Check MySQL is running: `sudo systemctl status mysql`
- Verify password in `application.properties`

## 📚 Full Documentation

See `SPRING_BOOT_COMPLETE_GUIDE.md` in the project root for complete setup instructions.
