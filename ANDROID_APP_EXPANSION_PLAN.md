# 📱 Android App Expansion Plan - Complete Module Architecture

## 🎯 Overview
Expanding from 8 screens to 25+ screens with complete feature modules.

## 📊 Current Structure (8 Screens)
✅ 1. Login Screen
✅ 2. Register Screen  
✅ 3. Dashboard Screen
✅ 4. Portfolio Screen
✅ 5. Charts Screen
✅ 6. Orders Screen
✅ 7. Watchlist Screen
✅ 8. Alerts Screen
✅ 9. Profile Screen
✅ 10. Transactions Screen

## 🚀 NEW EXPANDED STRUCTURE (25+ Screens)

### Module 1: Authentication & Onboarding (4 Screens)
- [x] 1.1 Splash Screen with animated logo
- [x] 1.2 Login Screen
- [x] 1.3 Register Screen
- [ ] 1.4 Forgot Password Screen
- [ ] 1.5 Reset Password Screen
- [ ] 1.6 Email Verification Screen
- [ ] 1.7 Onboarding Tutorial (3 slides)

### Module 2: Dashboard & Home (3 Screens)
- [x] 2.1 Main Dashboard - Market Overview
- [ ] 2.2 Market Summary - Top Gainers/Losers
- [ ] 2.3 Search Screen - Search commodities
- [ ] 2.4 Filter Screen - Filter by category, price range

### Module 3: Trading Module (5 Screens)
- [x] 3.1 Trading Screen - Buy/Sell
- [ ] 3.2 Order Confirmation Screen
- [ ] 3.3 Order Details Screen - View single order
- [x] 3.4 Order History Screen
- [ ] 3.5 Pending Orders Screen
- [ ] 3.6 Trade Calculator - Calculate profit/loss before trading

### Module 4: Portfolio Module (4 Screens)
- [x] 4.1 Portfolio Overview
- [ ] 4.2 Asset Details Screen - Detailed view of single holding
- [ ] 4.3 Performance Analysis - P&L charts, ROI
- [ ] 4.4 Portfolio Distribution - Pie chart of holdings

### Module 5: Wallet Module (5 Screens)
- [ ] 5.1 Wallet Overview - Balance, total value
- [ ] 5.2 Deposit Screen - Add funds
- [ ] 5.3 Withdraw Screen - Withdraw to bank
- [ ] 5.4 Payment Methods - Manage cards/banks
- [ ] 5.5 Transaction Details - Single transaction view

### Module 6: Market Analysis (4 Screens)
- [x] 6.1 Price Charts - Multiple timeframes
- [ ] 6.2 Technical Indicators - RSI, MACD, Moving Averages
- [ ] 6.3 Market News - Commodity news feed
- [ ] 6.4 Economic Calendar - Important events

### Module 7: Watchlist & Alerts (3 Screens)
- [x] 7.1 Watchlist Screen
- [x] 7.2 Alerts Screen
- [ ] 7.3 Alert Details - Edit/view single alert
- [ ] 7.4 Create Alert - Advanced alert builder

### Module 8: Reports & Analytics (4 Screens)
- [ ] 8.1 Reports Dashboard
- [ ] 8.2 Profit & Loss Report - Detailed P&L
- [ ] 8.3 Tax Report - Generate tax documents
- [ ] 8.4 Export Reports - PDF, CSV, Excel

### Module 9: Profile & Settings (6 Screens)
- [x] 9.1 Profile Screen
- [ ] 9.2 Edit Profile - Update personal info
- [ ] 9.3 Change Password
- [ ] 9.4 Settings Screen - App preferences
- [ ] 9.5 Notification Settings
- [ ] 9.6 Security Settings - 2FA, biometric
- [ ] 9.7 Theme Settings - Dark/Light mode
- [ ] 9.8 Language Settings

### Module 10: Notifications (2 Screens)
- [ ] 10.1 Notifications List
- [ ] 10.2 Notification Details

### Module 11: Help & Support (4 Screens)
- [ ] 11.1 Help Center - FAQ
- [ ] 11.2 Contact Support
- [ ] 11.3 Live Chat
- [ ] 11.4 About App - Version, terms, privacy

### Module 12: Admin Module (3 Screens) - If user is admin
- [ ] 12.1 Admin Dashboard
- [ ] 12.2 Manage Commodities - Add/Edit/Delete
- [ ] 12.3 User Management - View all users

## 🏗️ NEW ANDROID APP STRUCTURE

```
android-app/app/src/main/java/com/commodityx/
├── CommodityXApp.kt                    [NEW] - Application class
├── data/
│   ├── model/                          [EXISTING]
│   │   ├── User.kt
│   │   ├── Commodity.kt
│   │   ├── Order.kt
│   │   ├── Portfolio.kt
│   │   ├── Transaction.kt
│   │   ├── Watchlist.kt
│   │   ├── Alert.kt
│   │   ├── Notification.kt             [NEW]
│   │   ├── Report.kt                   [NEW]
│   │   ├── PaymentMethod.kt            [NEW]
│   │   ├── NewsArticle.kt              [NEW]
│   │   └── MarketSummary.kt            [NEW]
│   ├── remote/                         [NEW] - Better organized API
│   │   ├── ApiService.kt
│   │   ├── AuthApi.kt
│   │   ├── TradingApi.kt
│   │   ├── WalletApi.kt
│   │   ├── ReportsApi.kt
│   │   └── AdminApi.kt
│   ├── repository/                     [NEW] - Repository pattern
│   │   ├── AuthRepository.kt
│   │   ├── TradingRepository.kt
│   │   ├── WalletRepository.kt
│   │   ├── ReportsRepository.kt
│   │   └── NotificationRepository.kt
│   └── local/                          [NEW] - Local database
│       ├── AppDatabase.kt
│       ├── dao/
│       │   ├── UserDao.kt
│       │   ├── CommodityDao.kt
│       │   └── NotificationDao.kt
│       └── preferences/
│           └── PreferencesManager.kt
├── ui/
│   ├── theme/                          [EXISTING]
│   │   ├── Color.kt
│   │   ├── Theme.kt
│   │   └── Type.kt
│   ├── components/                     [NEW] - Reusable components
│   │   ├── CommodityCard.kt
│   │   ├── OrderCard.kt
│   │   ├── PriceChart.kt
│   │   ├── StatCard.kt
│   │   ├── LoadingDialog.kt
│   │   ├── ErrorDialog.kt
│   │   └── SuccessDialog.kt
│   ├── splash/                         [NEW]
│   │   ├── SplashScreen.kt
│   │   └── SplashViewModel.kt
│   ├── onboarding/                     [NEW]
│   │   ├── OnboardingScreen.kt
│   │   └── OnboardingViewModel.kt
│   ├── auth/                           [EXISTING + ENHANCED]
│   │   ├── LoginScreen.kt
│   │   ├── RegisterScreen.kt
│   │   ├── ForgotPasswordScreen.kt     [NEW]
│   │   ├── ResetPasswordScreen.kt      [NEW]
│   │   └── AuthViewModel.kt
│   ├── dashboard/                      [EXISTING + ENHANCED]
│   │   ├── DashboardScreen.kt
│   │   ├── MarketSummaryScreen.kt      [NEW]
│   │   ├── SearchScreen.kt             [NEW]
│   │   └── DashboardViewModel.kt
│   ├── trading/                        [EXISTING + ENHANCED]
│   │   ├── TradingScreen.kt
│   │   ├── OrderConfirmationScreen.kt  [NEW]
│   │   ├── OrderDetailsScreen.kt       [NEW]
│   │   ├── TradeCalculatorScreen.kt    [NEW]
│   │   └── TradingViewModel.kt
│   ├── portfolio/                      [EXISTING + ENHANCED]
│   │   ├── PortfolioScreen.kt
│   │   ├── AssetDetailsScreen.kt       [NEW]
│   │   ├── PerformanceScreen.kt        [NEW]
│   │   ├── DistributionScreen.kt       [NEW]
│   │   └── PortfolioViewModel.kt
│   ├── wallet/                         [NEW]
│   │   ├── WalletScreen.kt
│   │   ├── DepositScreen.kt
│   │   ├── WithdrawScreen.kt
│   │   ├── PaymentMethodsScreen.kt
│   │   └── WalletViewModel.kt
│   ├── charts/                         [EXISTING + ENHANCED]
│   │   ├── ChartsScreen.kt
│   │   ├── TechnicalIndicatorsScreen.kt [NEW]
│   │   └── ChartsViewModel.kt
│   ├── watchlist/                      [EXISTING]
│   │   ├── WatchlistScreen.kt
│   │   └── WatchlistViewModel.kt
│   ├── alerts/                         [EXISTING + ENHANCED]
│   │   ├── AlertsScreen.kt
│   │   ├── AlertDetailsScreen.kt       [NEW]
│   │   ├── CreateAlertScreen.kt        [NEW]
│   │   └── AlertsViewModel.kt
│   ├── reports/                        [NEW]
│   │   ├── ReportsScreen.kt
│   │   ├── ProfitLossScreen.kt
│   │   ├── TaxReportScreen.kt
│   │   ├── ExportScreen.kt
│   │   └── ReportsViewModel.kt
│   ├── profile/                        [EXISTING + ENHANCED]
│   │   ├── ProfileScreen.kt
│   │   ├── EditProfileScreen.kt        [NEW]
│   │   ├── ChangePasswordScreen.kt     [NEW]
│   │   └── ProfileViewModel.kt
│   ├── settings/                       [NEW]
│   │   ├── SettingsScreen.kt
│   │   ├── NotificationSettingsScreen.kt
│   │   ├── SecuritySettingsScreen.kt
│   │   ├── ThemeSettingsScreen.kt
│   │   └── SettingsViewModel.kt
│   ├── notifications/                  [NEW]
│   │   ├── NotificationsScreen.kt
│   │   ├── NotificationDetailsScreen.kt
│   │   └── NotificationsViewModel.kt
│   ├── news/                           [NEW]
│   │   ├── NewsScreen.kt
│   │   ├── NewsDetailsScreen.kt
│   │   └── NewsViewModel.kt
│   ├── help/                           [NEW]
│   │   ├── HelpScreen.kt
│   │   ├── ContactSupportScreen.kt
│   │   ├── LiveChatScreen.kt
│   │   ├── AboutScreen.kt
│   │   └── HelpViewModel.kt
│   └── admin/                          [NEW]
│       ├── AdminDashboardScreen.kt
│       ├── ManageCommoditiesScreen.kt
│       ├── UserManagementScreen.kt
│       └── AdminViewModel.kt
├── viewmodel/                          [EXISTING]
│   └── BaseViewModel.kt
├── utils/                              [EXISTING + ENHANCED]
│   ├── Constants.kt
│   ├── NetworkUtils.kt
│   ├── DateTimeUtils.kt
│   ├── CurrencyUtils.kt                [NEW]
│   ├── ValidationUtils.kt              [NEW]
│   ├── PermissionUtils.kt              [NEW]
│   ├── FileUtils.kt                    [NEW]
│   └── NotificationUtils.kt            [NEW]
├── navigation/                         [NEW]
│   ├── NavGraph.kt
│   ├── NavigationRoutes.kt
│   └── NavigationManager.kt
└── di/                                 [NEW] - Dependency Injection
    ├── AppModule.kt
    ├── NetworkModule.kt
    ├── DatabaseModule.kt
    └── ViewModelModule.kt
```

## 🔗 NEW BACKEND ENDPOINTS NEEDED

### Wallet Endpoints
- POST /api/wallet/deposit - Deposit funds
- POST /api/wallet/withdraw - Withdraw funds
- GET /api/wallet/balance - Get current balance
- GET /api/wallet/payment-methods - Get payment methods
- POST /api/wallet/payment-methods - Add payment method
- DELETE /api/wallet/payment-methods/{id} - Delete payment method

### Reports Endpoints
- GET /api/reports/profit-loss - Get P&L report
- GET /api/reports/tax - Get tax report
- GET /api/reports/summary - Get summary report
- POST /api/reports/export - Export report (PDF/CSV)

### Notifications Endpoints
- GET /api/notifications - Get all notifications
- GET /api/notifications/unread - Get unread count
- PUT /api/notifications/{id}/read - Mark as read
- DELETE /api/notifications/{id} - Delete notification

### News Endpoints
- GET /api/news - Get commodity news
- GET /api/news/{id} - Get news details
- GET /api/news/trending - Get trending news

### Admin Endpoints
- GET /api/admin/users - Get all users
- PUT /api/admin/users/{id} - Update user
- DELETE /api/admin/users/{id} - Delete user
- POST /api/admin/commodities - Create commodity
- PUT /api/admin/commodities/{id} - Update commodity
- DELETE /api/admin/commodities/{id} - Delete commodity

### User Management Endpoints
- PUT /api/users/profile - Update profile
- PUT /api/users/password - Change password
- POST /api/users/forgot-password - Request password reset
- POST /api/users/reset-password - Reset password

### Settings Endpoints
- GET /api/settings - Get user settings
- PUT /api/settings - Update settings
- PUT /api/settings/notifications - Update notification preferences

## 🎨 NEW UI FEATURES

### Design Enhancements
1. **Animated Splash Screen** - Lottie animations
2. **Pull-to-Refresh** - All list screens
3. **Infinite Scroll** - Pagination for large lists
4. **Shimmer Loading** - Skeleton screens while loading
5. **Bottom Sheets** - For filters, options
6. **Swipe Actions** - Swipe to delete, archive
7. **FAB Menu** - Quick actions floating button
8. **Search with Filters** - Advanced search functionality
9. **Charts Library** - MPAndroidChart for advanced charts
10. **QR Code Scanner** - For quick payments

### Navigation Enhancements
1. **Bottom Navigation** - 5 main tabs
   - Home (Dashboard)
   - Portfolio
   - Trading
   - Wallet
   - Profile
2. **Top Navigation** - Quick access
   - Watchlist
   - Alerts
   - Notifications
3. **Drawer Navigation** - Settings, Help, Admin
4. **Deep Linking** - Direct links to screens

## 📊 NEW DATABASE TABLES NEEDED

### MySQL Tables to Add

```sql
-- Notifications table
CREATE TABLE notifications (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT,
    type VARCHAR(50) NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Payment Methods table
CREATE TABLE payment_methods (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    type VARCHAR(50) NOT NULL,
    card_last_four VARCHAR(4),
    bank_name VARCHAR(100),
    account_number VARCHAR(100),
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Deposits table
CREATE TABLE deposits (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    payment_method_id BIGINT,
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (payment_method_id) REFERENCES payment_methods(id)
);

-- Withdrawals table
CREATE TABLE withdrawals (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    payment_method_id BIGINT,
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (payment_method_id) REFERENCES payment_methods(id)
);

-- News Articles table
CREATE TABLE news_articles (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(200) NOT NULL,
    content TEXT,
    source VARCHAR(100),
    image_url VARCHAR(500),
    commodity_id BIGINT,
    published_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (commodity_id) REFERENCES commodities(id)
);

-- User Settings table
CREATE TABLE user_settings (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL UNIQUE,
    theme VARCHAR(20) DEFAULT 'dark',
    language VARCHAR(20) DEFAULT 'en',
    notifications_enabled BOOLEAN DEFAULT TRUE,
    price_alerts_enabled BOOLEAN DEFAULT TRUE,
    email_notifications BOOLEAN DEFAULT TRUE,
    push_notifications BOOLEAN DEFAULT TRUE,
    biometric_enabled BOOLEAN DEFAULT FALSE,
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

## 🔐 SECURITY ENHANCEMENTS

1. **Biometric Authentication** - Fingerprint/Face ID
2. **Two-Factor Authentication (2FA)** - OTP via email/SMS
3. **Session Management** - Auto-logout after inactivity
4. **Encrypted Storage** - Secure local data storage
5. **Certificate Pinning** - Prevent MITM attacks
6. **ProGuard/R8** - Code obfuscation

## 📦 NEW GRADLE DEPENDENCIES NEEDED

```gradle
dependencies {
    // Existing dependencies...
    
    // Navigation
    implementation("androidx.navigation:navigation-compose:2.7.6")
    
    // Dependency Injection - Hilt
    implementation("com.google.dagger:hilt-android:2.48")
    kapt("com.google.dagger:hilt-compiler:2.48")
    implementation("androidx.hilt:hilt-navigation-compose:1.1.0")
    
    // Local Database - Room
    implementation("androidx.room:room-runtime:2.6.1")
    implementation("androidx.room:room-ktx:2.6.1")
    kapt("androidx.room:room-compiler:2.6.1")
    
    // DataStore - Preferences
    implementation("androidx.datastore:datastore-preferences:1.0.0")
    
    // Charts - MPAndroidChart
    implementation("com.github.PhilJay:MPAndroidChart:v3.1.0")
    
    // Animations - Lottie
    implementation("com.airbnb.android:lottie-compose:6.1.0")
    
    // Image Loading - Coil
    implementation("io.coil-kt:coil-compose:2.5.0")
    
    // PDF Generation
    implementation("com.itextpdf:itext7-core:7.2.5")
    
    // Excel Export
    implementation("org.apache.poi:poi:5.2.3")
    implementation("org.apache.poi:poi-ooxml:5.2.3")
    
    // QR Code
    implementation("com.google.zxing:core:3.5.2")
    implementation("com.journeyapps:zxing-android-embedded:4.3.0")
    
    // Biometric
    implementation("androidx.biometric:biometric:1.1.0")
    
    // Work Manager - Background tasks
    implementation("androidx.work:work-runtime-ktx:2.9.0")
    
    // Paging - Pagination
    implementation("androidx.paging:paging-runtime:3.2.1")
    implementation("androidx.paging:paging-compose:3.2.1")
    
    // Swipe Refresh
    implementation("com.google.accompanist:accompanist-swiperefresh:0.32.0")
    
    // Splash Screen
    implementation("androidx.core:core-splashscreen:1.0.1")
}
```

## 🚀 IMPLEMENTATION PRIORITY

### Phase 1: Essential Features (Week 1)
1. Wallet Module - Deposit/Withdraw
2. Settings Module - User preferences
3. Enhanced Profile - Edit profile, change password
4. Notifications Module

### Phase 2: Analytics & Reports (Week 2)
5. Reports Module - P&L, Tax reports
6. Market Analysis - Technical indicators
7. Performance Analytics
8. Export functionality

### Phase 3: Advanced Features (Week 3)
9. News Module
10. Help & Support
11. Admin Module
12. Search & Filters

### Phase 4: Polish & Enhancement (Week 4)
13. Animations & Transitions
14. Biometric Authentication
15. 2FA Implementation
16. Performance Optimization
17. Testing & Bug Fixes

## ✅ SUCCESS CRITERIA

1. All 25+ screens implemented and working
2. All backend endpoints created and tested
3. Complete database schema with new tables
4. Seamless backend-frontend integration
5. MySQL properly connected and synced
6. All features working end-to-end
7. App is stable with no crashes
8. Clean architecture with proper separation of concerns
9. Comprehensive error handling
10. Production-ready code quality

---

**Total Screens:** 25+  
**Total Modules:** 12  
**Total Backend Endpoints:** 40+  
**Estimated Implementation Time:** 4 weeks  
**Team Size:** 1-2 developers  

