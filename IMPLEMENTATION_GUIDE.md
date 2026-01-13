# 🚀 Complete Implementation Guide - Android App Expansion

## 📌 Quick Summary

This guide shows you how to expand the Commodities Exchange app from 10 screens to 25+ screens with complete backend integration.

## 🎯 What We're Building

### Current Status: ✅ Working (10 Screens)
- Login, Register, Dashboard, Portfolio, Charts
- Orders, Watchlist, Alerts, Profile, Transactions

### New Addition: 🆕 (15+ Screens)
- **Wallet Module** (Deposit/Withdraw/Payment Methods)
- **Settings Module** (Preferences/Notifications/Security)
- **Reports Module** (P&L/Tax/Export)
- **News Module** (Commodity News Feed)
- **Help & Support** (FAQ/Contact/Live Chat)
- **Admin Module** (Manage Commodities/Users)
- **Enhanced Features** (Search/Filters/Analytics)

---

## 📦 STEP 1: Update Database

Run the expansion schema:

```bash
# Navigate to database folder
cd database

# Run expansion schema
mysql -u root -p < expand_schema.sql
```

**What this adds:**
- notifications table
- payment_methods table
- deposits table
- withdrawals table
- news_articles table
- user_settings table
- trading_sessions table
- price_history table
- activity_log table

**Verify:**
```sql
USE commodities_exchange;
SHOW TABLES;
-- Should see 17 tables total
```

---

## 🔧 STEP 2: Add Backend Support

### A. Create New Entity Models

**Create: `spring-backend/src/main/java/com/commodityx/backend/model/Notification.java`**

```java
package com.commodityx.backend.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String message;

    @Column(nullable = false, length = 50)
    private String type; // TRADE, ALERT, SYSTEM, NEWS

    @Column(name = "is_read")
    private Boolean isRead = false;

    @Column(length = 500)
    private String link;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
```

**Create: `spring-backend/src/main/java/com/commodityx/backend/model/PaymentMethod.java`**

```java
package com.commodityx.backend.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "payment_methods")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentMethod {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 50)
    private String type; // CARD, BANK_ACCOUNT, UPI

    @Column(length = 100)
    private String provider; // Visa, Mastercard, etc

    @Column(name = "card_last_four", length = 4)
    private String cardLastFour;

    @Column(name = "bank_name", length = 100)
    private String bankName;

    @Column(name = "account_holder_name", length = 100)
    private String accountHolderName;

    @Column(name = "is_default")
    private Boolean isDefault = false;

    @Column(name = "is_verified")
    private Boolean isVerified = false;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
```

**Create: `spring-backend/src/main/java/com/commodityx/backend/model/Deposit.java`**

```java
package com.commodityx.backend.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "deposits")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Deposit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal amount;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "payment_method_id")
    private PaymentMethod paymentMethod;

    @Column(nullable = false, length = 50)
    private String status = "PENDING"; // PENDING, PROCESSING, COMPLETED, FAILED

    @Column(name = "transaction_id", unique = true, length = 100)
    private String transactionId;

    @Column(name = "reference_number", length = 100)
    private String referenceNumber;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;
}
```

**Create: `spring-backend/src/main/java/com/commodityx/backend/model/Withdrawal.java`** (Similar to Deposit)

**Create: `spring-backend/src/main/java/com/commodityx/backend/model/UserSettings.java`**

```java
package com.commodityx.backend.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_settings")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserSettings {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", unique = true, nullable = false)
    private User user;

    @Column(length = 20)
    private String theme = "dark"; // dark, light, auto

    @Column(length = 20)
    private String language = "en";

    @Column(length = 10)
    private String currency = "USD";

    @Column(name = "notifications_enabled")
    private Boolean notificationsEnabled = true;

    @Column(name = "price_alerts_enabled")
    private Boolean priceAlertsEnabled = true;

    @Column(name = "trade_alerts_enabled")
    private Boolean tradeAlertsEnabled = true;

    @Column(name = "email_notifications")
    private Boolean emailNotifications = true;

    @Column(name = "push_notifications")
    private Boolean pushNotifications = true;

    @Column(name = "sms_notifications")
    private Boolean smsNotifications = false;

    @Column(name = "biometric_enabled")
    private Boolean biometricEnabled = false;

    @Column(name = "two_factor_enabled")
    private Boolean twoFactorEnabled = false;

    @Column(name = "auto_logout_minutes")
    private Integer autoLogoutMinutes = 30;

    @Column(name = "chart_default_timeframe", length = 10)
    private String chartDefaultTimeframe = "1D";

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
```

### B. Create Repositories

**Create: `spring-backend/src/main/java/com/commodityx/backend/repository/NotificationRepository.java`**

```java
package com.commodityx.backend.repository;

import com.commodityx.backend.model.Notification;
import com.commodityx.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUserOrderByCreatedAtDesc(User user);
    List<Notification> findByUserAndIsReadFalse(User user);
    Long countByUserAndIsReadFalse(User user);
}
```

**Create similar repositories for:**
- `PaymentMethodRepository.java`
- `DepositRepository.java`
- `WithdrawalRepository.java`
- `UserSettingsRepository.java`

### C. Create DTOs

**Create: `spring-backend/src/main/java/com/commodityx/backend/dto/DepositRequest.java`**

```java
package com.commodityx.backend.dto;

import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DepositRequest {
    @NotNull(message = "Amount is required")
    @DecimalMin(value = "10.00", message = "Minimum deposit amount is $10")
    @DecimalMax(value = "100000.00", message = "Maximum deposit amount is $100,000")
    private BigDecimal amount;

    @NotNull(message = "Payment method is required")
    private Long paymentMethodId;

    private String notes;
}
```

**Create: `spring-backend/src/main/java/com/commodityx/backend/dto/WithdrawRequest.java`** (Similar)

**Create: `spring-backend/src/main/java/com/commodityx/backend/dto/SettingsUpdateRequest.java`**

```java
package com.commodityx.backend.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SettingsUpdateRequest {
    private String theme;
    private String language;
    private String currency;
    private Boolean notificationsEnabled;
    private Boolean priceAlertsEnabled;
    private Boolean tradeAlertsEnabled;
    private Boolean emailNotifications;
    private Boolean pushNotifications;
    private Boolean biometricEnabled;
    private String chartDefaultTimeframe;
}
```

### D. Create Services

**Create: `spring-backend/src/main/java/com/commodityx/backend/service/WalletService.java`**

```java
package com.commodityx.backend.service;

import com.commodityx.backend.dto.DepositRequest;
import com.commodityx.backend.dto.WithdrawRequest;
import com.commodityx.backend.model.*;
import com.commodityx.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class WalletService {

    @Autowired
    private DepositRepository depositRepository;

    @Autowired
    private WithdrawalRepository withdrawalRepository;

    @Autowired
    private PaymentMethodRepository paymentMethodRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private AuthService authService;

    @Transactional
    public Deposit createDeposit(DepositRequest request) {
        User user = authService.getCurrentUser();
        
        PaymentMethod paymentMethod = paymentMethodRepository.findById(request.getPaymentMethodId())
                .orElseThrow(() -> new RuntimeException("Payment method not found"));

        if (!paymentMethod.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized payment method");
        }

        Deposit deposit = new Deposit();
        deposit.setUser(user);
        deposit.setAmount(request.getAmount());
        deposit.setPaymentMethod(paymentMethod);
        deposit.setStatus("COMPLETED"); // Instant for demo
        deposit.setTransactionId(UUID.randomUUID().toString());
        deposit.setNotes(request.getNotes());
        deposit.setCompletedAt(LocalDateTime.now());

        deposit = depositRepository.save(deposit);

        // Update user balance
        user.setBalance(user.getBalance().add(request.getAmount()));
        userRepository.save(user);

        // Create transaction record
        Transaction transaction = new Transaction();
        transaction.setUser(user);
        transaction.setType("DEPOSIT");
        transaction.setAmount(request.getAmount());
        transaction.setDescription("Deposit via " + paymentMethod.getType());
        transaction.setCreatedAt(LocalDateTime.now());
        transactionRepository.save(transaction);

        return deposit;
    }

    @Transactional
    public Withdrawal createWithdrawal(WithdrawRequest request) {
        User user = authService.getCurrentUser();

        if (user.getBalance().compareTo(request.getAmount()) < 0) {
            throw new RuntimeException("Insufficient balance");
        }

        PaymentMethod paymentMethod = paymentMethodRepository.findById(request.getPaymentMethodId())
                .orElseThrow(() -> new RuntimeException("Payment method not found"));

        Withdrawal withdrawal = new Withdrawal();
        withdrawal.setUser(user);
        withdrawal.setAmount(request.getAmount());
        withdrawal.setPaymentMethod(paymentMethod);
        withdrawal.setStatus("COMPLETED"); // Instant for demo
        withdrawal.setTransactionId(UUID.randomUUID().toString());
        withdrawal.setCompletedAt(LocalDateTime.now());

        withdrawal = withdrawalRepository.save(withdrawal);

        // Update user balance
        user.setBalance(user.getBalance().subtract(request.getAmount()));
        userRepository.save(user);

        // Create transaction record
        Transaction transaction = new Transaction();
        transaction.setUser(user);
        transaction.setType("WITHDRAWAL");
        transaction.setAmount(request.getAmount().negate());
        transaction.setDescription("Withdrawal to " + paymentMethod.getType());
        transaction.setCreatedAt(LocalDateTime.now());
        transactionRepository.save(transaction);

        return withdrawal;
    }

    public List<PaymentMethod> getUserPaymentMethods() {
        User user = authService.getCurrentUser();
        return paymentMethodRepository.findByUser(user);
    }

    public List<Deposit> getUserDeposits() {
        User user = authService.getCurrentUser();
        return depositRepository.findByUserOrderByCreatedAtDesc(user);
    }

    public List<Withdrawal> getUserWithdrawals() {
        User user = authService.getCurrentUser();
        return withdrawalRepository.findByUserOrderByCreatedAtDesc(user);
    }
}
```

**Create: `spring-backend/src/main/java/com/commodityx/backend/service/NotificationService.java`**

**Create: `spring-backend/src/main/java/com/commodityx/backend/service/SettingsService.java`**

### E. Create Controllers

**Create: `spring-backend/src/main/java/com/commodityx/backend/controller/WalletController.java`**

```java
package com.commodityx.backend.controller;

import com.commodityx.backend.dto.*;
import com.commodityx.backend.model.*;
import com.commodityx.backend.service.WalletService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/wallet")
public class WalletController {

    @Autowired
    private WalletService walletService;

    @PostMapping("/deposit")
    public ResponseEntity<?> deposit(@Valid @RequestBody DepositRequest request) {
        try {
            Deposit deposit = walletService.createDeposit(request);
            return ResponseEntity.ok(deposit);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @PostMapping("/withdraw")
    public ResponseEntity<?> withdraw(@Valid @RequestBody WithdrawRequest request) {
        try {
            Withdrawal withdrawal = walletService.createWithdrawal(request);
            return ResponseEntity.ok(withdrawal);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @GetMapping("/payment-methods")
    public ResponseEntity<List<PaymentMethod>> getPaymentMethods() {
        List<PaymentMethod> methods = walletService.getUserPaymentMethods();
        return ResponseEntity.ok(methods);
    }

    @GetMapping("/deposits")
    public ResponseEntity<List<Deposit>> getDeposits() {
        List<Deposit> deposits = walletService.getUserDeposits();
        return ResponseEntity.ok(deposits);
    }

    @GetMapping("/withdrawals")
    public ResponseEntity<List<Withdrawal>> getWithdrawals() {
        List<Withdrawal> withdrawals = walletService.getUserWithdrawals();
        return ResponseEntity.ok(withdrawals);
    }

    static class ErrorResponse {
        private String message;
        public ErrorResponse(String message) { this.message = message; }
        public String getMessage() { return message; }
    }
}
```

**Create similar controllers for:**
- `NotificationController.java`
- `SettingsController.java`
- `ReportsController.java`

---

## 📱 STEP 3: Android App Expansion

### Update Gradle Dependencies

**Edit: `android-app/app/build.gradle`**

Add these dependencies:

```gradle
dependencies {
    // Existing dependencies...

    // Navigation
    implementation("androidx.navigation:navigation-compose:2.7.6")
    
    // DataStore for preferences
    implementation("androidx.datastore:datastore-preferences:1.0.0")
    
    // Charts library
    implementation("com.github.PhilJay:MPAndroidChart:v3.1.0")
    
    // Lottie animations
    implementation("com.airbnb.android:lottie-compose:6.1.0")
    
    // Image loading - Coil
    implementation("io.coil-kt:coil-compose:2.5.0")
    
    // Swipe refresh
    implementation("com.google.accompanist:accompanist-swiperefresh:0.32.0")
}
```

### Create Wallet Module (Android)

**1. Create Data Model:**

**File: `android-app/app/src/main/java/com/commodityx/data/Deposit.kt`**

```kotlin
package com.commodityx.data

data class Deposit(
    val id: Long,
    val amount: Double,
    val status: String,
    val transactionId: String?,
    val notes: String?,
    val createdAt: String,
    val completedAt: String?
)

data class DepositRequest(
    val amount: Double,
    val paymentMethodId: Long,
    val notes: String?
)
```

**2. Add API Endpoints:**

**File: `android-app/app/src/main/java/com/commodityx/network/ApiService.kt`**

Add these methods to your existing ApiService interface:

```kotlin
@POST("wallet/deposit")
suspend fun deposit(@Body request: DepositRequest): Response<Deposit>

@POST("wallet/withdraw")
suspend fun withdraw(@Body request: WithdrawRequest): Response<Withdrawal>

@GET("wallet/deposits")
suspend fun getDeposits(): Response<List<Deposit>>

@GET("wallet/withdrawals")
suspend fun getWithdrawals(): Response<List<Withdrawal>>

@GET("wallet/payment-methods")
suspend fun getPaymentMethods(): Response<List<PaymentMethod>>
```

**3. Create ViewModel:**

**File: `android-app/app/src/main/java/com/commodityx/viewmodel/WalletViewModel.kt`**

```kotlin
package com.commodityx.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.commodityx.data.*
import com.commodityx.network.ApiService
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

class WalletViewModel(private val apiService: ApiService) : ViewModel() {
    
    private val _deposits = MutableStateFlow<List<Deposit>>(emptyList())
    val deposits: StateFlow<List<Deposit>> = _deposits

    private val _withdrawals = MutableStateFlow<List<Withdrawal>>(emptyList())
    val withdrawals: StateFlow<List<Withdrawal>> = _withdrawals

    private val _paymentMethods = MutableStateFlow<List<PaymentMethod>>(emptyList())
    val paymentMethods: StateFlow<List<PaymentMethod>> = _paymentMethods

    private val _isLoading = MutableStateFlow(false)
    val isLoading: StateFlow<Boolean> = _isLoading

    private val _error = MutableStateFlow<String?>(null)
    val error: StateFlow<String?> = _error

    fun loadDeposits() {
        viewModelScope.launch {
            _isLoading.value = true
            try {
                val response = apiService.getDeposits()
                if (response.isSuccessful) {
                    _deposits.value = response.body() ?: emptyList()
                } else {
                    _error.value = "Failed to load deposits"
                }
            } catch (e: Exception) {
                _error.value = e.message
            } finally {
                _isLoading.value = false
            }
        }
    }

    fun deposit(amount: Double, paymentMethodId: Long, notes: String?) {
        viewModelScope.launch {
            _isLoading.value = true
            try {
                val request = DepositRequest(amount, paymentMethodId, notes)
                val response = apiService.deposit(request)
                if (response.isSuccessful) {
                    loadDeposits()
                } else {
                    _error.value = "Deposit failed"
                }
            } catch (e: Exception) {
                _error.value = e.message
            } finally {
                _isLoading.value = false
            }
        }
    }

    // Similar methods for withdraw, loadPaymentMethods, etc.
}
```

**4. Create UI Screen:**

**File: `android-app/app/src/main/java/com/commodityx/ui/wallet/WalletScreen.kt`**

```kotlin
package com.commodityx.ui.wallet

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

@Composable
fun WalletScreen(
    viewModel: WalletViewModel
) {
    val deposits by viewModel.deposits.collectAsState()
    val isLoading by viewModel.isLoading.collectAsState()

    LaunchedEffect(Unit) {
        viewModel.loadDeposits()
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
    ) {
        Text(
            text = "Wallet",
            style = MaterialTheme.typography.headlineMedium
        )

        Spacer(modifier = Modifier.height(16.dp))

        // Deposit Button
        Button(
            onClick = { /* Navigate to deposit screen */ },
            modifier = Modifier.fillMaxWidth()
        ) {
            Text("Deposit Funds")
        }

        Spacer(modifier = Modifier.height(8.dp))

        // Withdraw Button
        Button(
            onClick = { /* Navigate to withdraw screen */ },
            modifier = Modifier.fillMaxWidth()
        ) {
            Text("Withdraw Funds")
        }

        Spacer(modifier = Modifier.height(24.dp))

        Text(
            text = "Recent Deposits",
            style = MaterialTheme.typography.titleMedium
        )

        if (isLoading) {
            CircularProgressIndicator()
        } else {
            deposits.forEach { deposit ->
                DepositCard(deposit = deposit)
            }
        }
    }
}

@Composable
fun DepositCard(deposit: Deposit) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 8.dp)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Text(text = "Amount: $${deposit.amount}")
            Text(text = "Status: ${deposit.status}")
            Text(text = "Date: ${deposit.createdAt}")
        }
    }
}
```

**5. Create Deposit Screen:**

**File: `android-app/app/src/main/java/com/commodityx/ui/wallet/DepositScreen.kt`**

```kotlin
@Composable
fun DepositScreen(
    viewModel: WalletViewModel,
    onDepositSuccess: () -> Unit
) {
    var amount by remember { mutableStateOf("") }
    var selectedPaymentMethod by remember { mutableStateOf<Long?>(null) }
    val paymentMethods by viewModel.paymentMethods.collectAsState()

    LaunchedEffect(Unit) {
        viewModel.loadPaymentMethods()
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
    ) {
        Text("Deposit Funds", style = MaterialTheme.typography.headlineMedium)

        Spacer(modifier = Modifier.height(24.dp))

        OutlinedTextField(
            value = amount,
            onValueChange = { amount = it },
            label = { Text("Amount") },
            modifier = Modifier.fillMaxWidth(),
            prefix = { Text("$") }
        )

        Spacer(modifier = Modifier.height(16.dp))

        Text("Select Payment Method")
        
        paymentMethods.forEach { method ->
            RadioButton(
                selected = selectedPaymentMethod == method.id,
                onClick = { selectedPaymentMethod = method.id }
            )
            Text("${method.type} - ${method.cardLastFour}")
        }

        Spacer(modifier = Modifier.height(24.dp))

        Button(
            onClick = {
                selectedPaymentMethod?.let { methodId ->
                    viewModel.deposit(
                        amount = amount.toDoubleOrNull() ?: 0.0,
                        paymentMethodId = methodId,
                        notes = null
                    )
                    onDepositSuccess()
                }
            },
            modifier = Modifier.fillMaxWidth(),
            enabled = amount.isNotEmpty() && selectedPaymentMethod != null
        ) {
            Text("Deposit")
        }
    }
}
```

---

## 🧪 STEP 4: Testing

### Test Backend:

```bash
# Start Spring Boot
cd spring-backend
./mvnw spring-boot:run

# Test deposit endpoint (Postman)
POST http://localhost:5000/api/wallet/deposit
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
    "amount": 1000.00,
    "paymentMethodId": 1,
    "notes": "Test deposit"
}
```

### Test Android:

1. Open Android Studio
2. Run the app
3. Login
4. Navigate to Wallet screen
5. Click "Deposit Funds"
6. Enter amount and select payment method
7. Click "Deposit"
8. Verify balance updates

---

## 📚 Complete Module List

Apply the same pattern for all modules:

### 1. ✅ Wallet Module (Complete above)
- Deposit, Withdraw, Payment Methods

### 2. Settings Module
- Theme, Language, Notifications, Security

### 3. Reports Module  
- P&L Reports, Tax Reports, Export PDF/CSV

### 4. Notifications Module
- List, Mark as Read, Delete

### 5. News Module
- News Feed, Article Details

### 6. Help & Support
- FAQ, Contact Support, About

---

## 🔗 Full Backend API List

```
# Wallet
POST   /api/wallet/deposit
POST   /api/wallet/withdraw
GET    /api/wallet/deposits
GET    /api/wallet/withdrawals
GET    /api/wallet/payment-methods
POST   /api/wallet/payment-methods
DELETE /api/wallet/payment-methods/{id}

# Settings
GET    /api/settings
PUT    /api/settings

# Notifications
GET    /api/notifications
GET    /api/notifications/unread-count
PUT    /api/notifications/{id}/read
DELETE /api/notifications/{id}

# Reports
GET    /api/reports/profit-loss
GET    /api/reports/tax
POST   /api/reports/export

# News
GET    /api/news
GET    /api/news/{id}
```

---

## ✅ Verification Checklist

- [ ] Database expansion schema run successfully
- [ ] Backend entities created
- [ ] Backend repositories created
- [ ] Backend services implemented
- [ ] Backend controllers added
- [ ] Android data models created
- [ ] Android API service updated
- [ ] Android ViewModels created
- [ ] Android UI screens created
- [ ] End-to-end flow tested
- [ ] All features working properly

---

## 🎉 Next Steps

1. **Commit all backend changes**
2. **Test each module thoroughly**
3. **Add more screens following the same pattern**
4. **Implement remaining modules**
5. **Add animations and polish**
6. **Final testing and bug fixes**

---

**For complete code of all modules, follow the same pattern shown in Wallet Module above.**

