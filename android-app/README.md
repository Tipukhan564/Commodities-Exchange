# CommodityX - Native Android App

A native Android mobile application for commodities trading with a stunning cyberpunk/futuristic UI design built with Kotlin and Jetpack Compose.

![Platform](https://img.shields.io/badge/Platform-Android-green.svg)
![Language](https://img.shields.io/badge/Language-Kotlin-blue.svg)
![Min SDK](https://img.shields.io/badge/Min%20SDK-24-orange.svg)
![Target SDK](https://img.shields.io/badge/Target%20SDK-34-orange.svg)

## 🚀 Features

### 📱 Native Android Experience
- **Jetpack Compose** - Modern declarative UI framework
- **Material Design 3** - Latest Material Design components
- **MVVM Architecture** - Clean architecture pattern
- **Kotlin Coroutines** - Asynchronous programming
- **Retrofit** - Type-safe HTTP client for API calls
- **DataStore** - Modern data storage solution

### 🎨 Stunning UI/UX
- **Cyberpunk Theme** - Neon cyan/green color scheme
- **Glassmorphism Effects** - Translucent backgrounds with blur
- **Smooth Animations** - Framer-like motion effects
- **Gradient Buttons** - Eye-catching action buttons
- **Live Indicators** - Pulsing animations for real-time data
- **Dark Theme** - Optimized for low-light viewing

### 💼 Trading Features
- **Real-Time Prices** - Live commodity price updates
- **Portfolio Management** - Track holdings with P&L calculations
- **Interactive Charts** - Price history with multiple timeframes
- **Buy/Sell Orders** - Place market orders instantly
- **Order History** - View and manage all orders
- **Secure Authentication** - JWT-based login system

### 📊 Screens Implemented
1. ✅ **Login/Register** - Authentication with animated logo
2. 🔨 **Dashboard** - Portfolio summary and market overview
3. 🔨 **Portfolio** - Holdings with profit/loss tracking
4. 🔨 **Charts** - Interactive price charts
5. 🔨 **Trading** - Place buy/sell orders
6. 🔨 **Orders** - Order history and management

## 🏗️ Architecture

### Project Structure
```
android-app/
├── app/
│   ├── src/main/
│   │   ├── java/com/commodityx/
│   │   │   ├── ui/                    # UI Layer (Activities & Composables)
│   │   │   │   ├── auth/              # Login/Register screens
│   │   │   │   ├── dashboard/         # Dashboard screen
│   │   │   │   ├── portfolio/         # Portfolio screen
│   │   │   │   ├── charts/            # Charts screen
│   │   │   │   ├── trading/           # Trading screen
│   │   │   │   ├── orders/            # Orders screen
│   │   │   │   └── theme/             # App theme & colors
│   │   │   ├── viewmodel/             # ViewModels (MVVM)
│   │   │   ├── data/                  # Data models
│   │   │   ├── network/               # API service layer
│   │   │   ├── utils/                 # Utility classes
│   │   │   └── CommodityXApplication.kt
│   │   ├── res/                       # Resources
│   │   └── AndroidManifest.xml
│   └── build.gradle                   # App-level Gradle
├── build.gradle                       # Project-level Gradle
└── settings.gradle
```

### MVVM Pattern
```
View (Activity/Composable)
    ↓
ViewModel (Business Logic)
    ↓
Repository (Data Layer)
    ↓
API Service (Retrofit)
```

## 🛠️ Technology Stack

| Component | Technology |
|-----------|-----------|
| Language | Kotlin 1.9.10 |
| UI Framework | Jetpack Compose |
| Architecture | MVVM + Repository Pattern |
| Networking | Retrofit 2.9.0 + OkHttp 4.12.0 |
| Async | Kotlin Coroutines |
| DI | Manual (can add Hilt/Koin) |
| Storage | DataStore Preferences |
| Charts | MPAndroidChart |
| Image Loading | Coil |
| Min SDK | 24 (Android 7.0) |
| Target SDK | 34 (Android 14) |

## 🚀 Getting Started

### Prerequisites
- **Android Studio** Hedgehog (2023.1.1) or later
- **JDK** 17 or later
- **Android SDK** with API Level 34
- **Backend server** running on your machine or network

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/yourusername/Commodities-Exchange.git
cd Commodities-Exchange/android-app
```

2. **Open in Android Studio:**
   - Launch Android Studio
   - Select "Open an Existing Project"
   - Navigate to `android-app` folder
   - Click "OK"

3. **Configure API endpoint:**
   - Open `app/build.gradle`
   - Update `API_BASE_URL` if needed:
   ```gradle
   buildConfigField "String", "API_BASE_URL", "\"http://10.0.2.2:5000/api/\""
   ```
   - `10.0.2.2` is the special IP for Android emulator to access localhost
   - For physical device, use your computer's local IP (e.g., `192.168.1.100:5000`)

4. **Sync Gradle:**
   - Click "Sync Now" when prompted
   - Wait for dependencies to download

5. **Run the app:**
   - Connect an Android device or start an emulator
   - Click "Run" (▶️) or press Shift+F10
   - Select your device/emulator
   - Wait for app to build and install

### Backend Setup

**IMPORTANT:** The Android app connects to the backend API. Make sure the backend is running:

```bash
# Terminal 1 - Start backend
cd backend
npm start
# Backend runs on http://localhost:5000
```

For **Android Emulator**, use: `http://10.0.2.2:5000/api/`
For **Physical Device**, use: `http://YOUR_COMPUTER_IP:5000/api/`

To find your computer's local IP:
- **Windows:** `ipconfig` (look for IPv4 Address)
- **Mac/Linux:** `ifconfig` or `ip addr` (look for inet)

## 📱 Screen Implementation Guide

### Completed Screens

#### ✅ Login/Register (LoginActivity.kt)
- **Location:** `ui/auth/LoginActivity.kt`
- **Features:**
  - Tab switcher between Login and Register
  - Animated 3D rotating logo
  - Form validation
  - Error handling
  - Gradient submit button
  - Password visibility toggle

### Screens To Implement

#### 🔨 Dashboard (DashboardActivity.kt)

**Create:** `ui/dashboard/DashboardActivity.kt`

**UI Components:**
```kotlin
@Composable
fun DashboardScreen() {
    Column {
        // 1. Header with user info
        UserHeader()

        // 2. Portfolio Value Card
        PortfolioValueCard(
            totalValue = viewModel.totalValue,
            pnl = viewModel.totalPnL
        )

        // 3. Live Markets List
        LazyColumn {
            items(viewModel.commodities) { commodity ->
                CommodityCard(
                    commodity = commodity,
                    onBuyClick = { /* Navigate to Trading */ },
                    onSellClick = { /* Navigate to Trading */ }
                )
            }
        }

        // 4. Bottom Navigation
        BottomNavigationBar()
    }
}
```

**ViewModel:** `viewmodel/DashboardViewModel.kt`
```kotlin
class DashboardViewModel : ViewModel() {
    private val _state = MutableStateFlow(DashboardState())
    val state = _state.asStateFlow()

    fun loadDashboardData() {
        viewModelScope.launch {
            val commodities = RetrofitClient.apiService.getCommodities()
            val portfolio = RetrofitClient.apiService.getPortfolio()
            // Update state
        }
    }
}
```

#### 🔨 Portfolio (PortfolioActivity.kt)

**Create:** `ui/portfolio/PortfolioActivity.kt`

**UI Components:**
```kotlin
@Composable
fun PortfolioScreen() {
    Column {
        // 1. Total Value Header
        PortfolioHeader(totalValue, totalPnL)

        // 2. Asset Allocation (Pie Chart)
        AssetAllocationChart()

        // 3. Holdings List
        LazyColumn {
            items(portfolio) { holding ->
                HoldingCard(
                    holding = holding,
                    onSellClick = { /* Navigate to Trading */ }
                )
            }
        }
    }
}
```

#### 🔨 Charts (ChartsActivity.kt)

**Create:** `ui/charts/ChartsActivity.kt`

**Use MPAndroidChart for graphs:**
```kotlin
@Composable
fun ChartsScreen() {
    Column {
        // 1. Commodity Selector
        CommoditySelector()

        // 2. Price Display
        PriceHeader(currentPrice, priceChange)

        // 3. Chart with MPAndroidChart
        AndroidView(
            factory = { context ->
                LineChart(context).apply {
                    // Configure chart
                }
            }
        )

        // 4. Timeframe Selector
        TimeframeChips()

        // 5. Buy/Sell Buttons
        TradingButtons()
    }
}
```

#### 🔨 Trading (TradingActivity.kt)

**Create:** `ui/trading/TradingActivity.kt`

**UI Components:**
```kotlin
@Composable
fun TradingScreen() {
    Column {
        // 1. Selected Commodity Info
        CommodityInfoCard()

        // 2. Order Type (Buy/Sell Toggle)
        OrderTypeSelector()

        // 3. Quantity Input
        QuantityInput()

        // 4. Order Summary
        OrderSummary(totalCost, fees)

        // 5. Submit Button
        PlaceOrderButton()
    }
}
```

#### 🔨 Orders (OrdersActivity.kt)

**Create:** `ui/orders/OrdersActivity.kt`

**UI Components:**
```kotlin
@Composable
fun OrdersScreen() {
    Column {
        // 1. Statistics Cards
        OrderStats(total, pending, completed, cancelled)

        // 2. Filter Chips
        FilterChips()

        // 3. Orders List
        LazyColumn {
            items(filteredOrders) { order ->
                OrderCard(
                    order = order,
                    onCancelClick = { viewModel.cancelOrder(order.id) }
                )
            }
        }
    }
}
```

## 🎨 UI Components Library

### Reusable Components

Create `ui/components/CommonComponents.kt`:

```kotlin
@Composable
fun GlassCard(
    modifier: Modifier = Modifier,
    content: @Composable ColumnScope.() -> Unit
) {
    Card(
        modifier = modifier,
        colors = CardDefaults.cardColors(
            containerColor = SurfaceDark.copy(alpha = 0.7f)
        ),
        shape = RoundedCornerShape(16.dp)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            content()
        }
    }
}

@Composable
fun NeonButton(
    text: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    gradient: List<Color> = listOf(NeonCyan, NeonGreen)
) {
    Button(
        onClick = onClick,
        modifier = modifier,
        colors = ButtonDefaults.buttonColors(
            containerColor = Color.Transparent
        )
    ) {
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(
                    Brush.horizontalGradient(gradient),
                    shape = RoundedCornerShape(12.dp)
                ),
            contentAlignment = Alignment.Center
        ) {
            Text(text, color = CyberDark)
        }
    }
}

@Composable
fun PnLBadge(
    value: Double,
    percentage: Double
) {
    val isPositive = value >= 0
    val color = if (isPositive) ProfitGreen else LossRed

    Surface(
        color = color.copy(alpha = 0.15f),
        shape = RoundedCornerShape(8.dp),
        border = BorderStroke(1.dp, color.copy(alpha = 0.3f))
    ) {
        Row(
            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Icon(
                imageVector = if (isPositive) Icons.Default.TrendingUp else Icons.Default.TrendingDown,
                contentDescription = null,
                tint = color,
                modifier = Modifier.size(16.dp)
            )
            Spacer(modifier = Modifier.width(4.dp))
            Text(
                text = "${if (isPositive) "+" else ""}${percentage.format(2)}%",
                color = color,
                style = MaterialTheme.typography.labelMedium
            )
        }
    }
}
```

## 🔐 Security Best Practices

1. **API Key Storage:**
   - Never commit API keys to version control
   - Use `local.properties` for sensitive data
   - Add `local.properties` to `.gitignore`

2. **Token Management:**
   - Tokens stored in encrypted DataStore
   - Automatic token refresh on API calls
   - Clear tokens on logout

3. **ProGuard Rules:**
   ```proguard
   # Retrofit
   -keepattributes Signature
   -keepattributes *Annotation*
   -keep class retrofit2.** { *; }

   # Gson
   -keep class com.commodityx.data.** { *; }
   ```

## 🐛 Debugging

### Common Issues

**1. Network Error / Unable to connect**
- Check backend is running on `localhost:5000`
- Verify API_BASE_URL in `build.gradle`
- For emulator, use `10.0.2.2` instead of `localhost`
- For device, use computer's local IP
- Check firewall allows connections on port 5000

**2. Build Errors**
- Clean project: `Build > Clean Project`
- Rebuild: `Build > Rebuild Project`
- Invalidate caches: `File > Invalidate Caches > Invalidate and Restart`
- Check Gradle sync completed successfully

**3. App Crashes on Launch**
- Check Logcat for error messages
- Verify all permissions in AndroidManifest.xml
- Ensure backend API is accessible

### Enable Debug Logging

In `RetrofitClient.kt`, logging is already enabled for debug builds:
```kotlin
level = if (BuildConfig.DEBUG) {
    HttpLoggingInterceptor.Level.BODY
} else {
    HttpLoggingInterceptor.Level.NONE
}
```

View logs in Android Studio Logcat (Alt+6)

## 📦 Building Release APK

1. **Generate Signed APK:**
   ```
   Build > Generate Signed Bundle / APK > APK
   ```

2. **Create Keystore** (first time):
   - Select "Create new..."
   - Fill in keystore details
   - **IMPORTANT:** Save keystore file securely!

3. **Select Build Variant:**
   - Choose "release"
   - Select keystore
   - Enter passwords
   - Click "Next" > "Finish"

4. **APK Location:**
   ```
   app/release/app-release.apk
   ```

## 🚀 Performance Optimization

### LazyColumn Best Practices
```kotlin
LazyColumn {
    items(
        items = list,
        key = { it.id } // Important for performance
    ) { item ->
        ItemCard(item)
    }
}
```

### Remember Expensive Calculations
```kotlin
val totalValue = remember(portfolio) {
    portfolio.sumOf { it.currentValue }
}
```

### Use derivedStateOf for Computed Values
```kotlin
val filteredOrders by remember {
    derivedStateOf {
        orders.filter { it.status == selectedFilter }
    }
}
```

## 🎯 Roadmap

### Phase 1 (Current)
- [x] Project setup
- [x] Authentication screens
- [x] API integration
- [ ] Dashboard screen
- [ ] Portfolio screen
- [ ] Charts screen
- [ ] Trading screen
- [ ] Orders screen

### Phase 2 (Future)
- [ ] Real-time price updates (WebSocket)
- [ ] Push notifications for price alerts
- [ ] Biometric authentication
- [ ] Dark/Light theme toggle
- [ ] Multi-language support
- [ ] Offline mode with local caching
- [ ] Advanced charting (candlesticks, indicators)
- [ ] Widget support
- [ ] Tablet optimization

### Phase 3 (Advanced)
- [ ] Machine learning price predictions
- [ ] Social trading features
- [ ] News feed integration
- [ ] Watchlist customization
- [ ] Advanced order types (limit, stop-loss)
- [ ] Portfolio analytics dashboard

## 📚 Learning Resources

### Jetpack Compose
- [Official Compose Tutorial](https://developer.android.com/jetpack/compose/tutorial)
- [Compose Pathway](https://developer.android.com/courses/pathways/compose)

### Kotlin Coroutines
- [Coroutines Guide](https://kotlinlang.org/docs/coroutines-guide.html)
- [Android Coroutines](https://developer.android.com/kotlin/coroutines)

### MVVM Architecture
- [Android Architecture Guide](https://developer.android.com/topic/architecture)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Developer Notes

### Testing on Device
To test on a physical Android device:
1. Enable Developer Options on your device
2. Enable USB Debugging
3. Connect device via USB
4. Accept debugging prompt on device
5. Run app from Android Studio

### Emulator Setup
Recommended emulator configuration:
- Device: Pixel 6
- System Image: Android 14 (API 34)
- RAM: 2048 MB
- Internal Storage: 2048 MB

## 🔗 API Endpoints Reference

The app uses these endpoints from the backend:

```
POST   /api/auth/login           - User login
POST   /api/auth/register        - User registration
GET    /api/auth/profile         - Get user profile
GET    /api/commodities          - Get all commodities
GET    /api/commodities/:id      - Get commodity details
GET    /api/commodities/:id/history - Get price history
POST   /api/trading/order        - Place order
GET    /api/trading/orders       - Get user orders
DELETE /api/trading/orders/:id   - Cancel order
GET    /api/trading/portfolio    - Get user portfolio
```

## 💡 Tips & Tricks

1. **Hot Reload:** Use Compose Preview for instant UI updates
2. **State Management:** Use `remember` and `rememberSaveable` appropriately
3. **Performance:** Use `key` parameter in LazyColumn for better performance
4. **Testing:** Write unit tests for ViewModels
5. **Code Quality:** Use ktlint for code formatting

---

**Built with ❤️ using Kotlin and Jetpack Compose**

For questions or support, please open an issue on GitHub.
