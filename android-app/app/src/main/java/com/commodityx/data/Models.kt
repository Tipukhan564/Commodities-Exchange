package com.commodityx.data

import android.os.Parcelable
import kotlinx.parcelize.Parcelize

@Parcelize
data class User(
    val id: Int,
    val username: String,
    val email: String,
    val full_name: String?,
    val balance: Double,
    val is_admin: Boolean = false,
    val created_at: String?
) : Parcelable

@Parcelize
data class Commodity(
    val id: Int,
    val symbol: String,
    val name: String,
    val current_price: Double,
    val price_change_24h: Double,
    val high_24h: Double?,
    val low_24h: Double?,
    val volume_24h: Double?
) : Parcelable

@Parcelize
data class Portfolio(
    val id: Int,
    val commodity_id: Int,
    val commodity_name: String?,
    val commodity_symbol: String?,
    val quantity: Double,
    val average_price: Double,
    val current_price: Double
) : Parcelable {
    val currentValue: Double get() = current_price * quantity
    val investment: Double get() = average_price * quantity
    val pnl: Double get() = currentValue - investment
    val pnlPercent: Double get() = if (investment > 0) (pnl / investment) * 100 else 0.0
}

@Parcelize
data class Order(
    val id: Int,
    val commodity_id: Int,
    val commodity_name: String?,
    val commodity_symbol: String?,
    val order_type: String, // "buy" or "sell"
    val quantity: Double,
    val price: Double,
    val status: String, // "pending", "completed", "cancelled"
    val created_at: String
) : Parcelable {
    val totalValue: Double get() = price * quantity
}

@Parcelize
data class PriceHistory(
    val timestamp: String,
    val price: Double
) : Parcelable

// API Request/Response models
data class LoginRequest(
    val username: String,
    val password: String
)

data class RegisterRequest(
    val username: String,
    val email: String,
    val password: String,
    val full_name: String
)

data class AuthResponse(
    val success: Boolean = true,
    val token: String,
    val user: User
)

data class ApiResponse<T>(
    val success: Boolean = true,
    val data: T? = null,
    val message: String? = null
)

data class CommoditiesResponse(
    val commodities: List<Commodity>
)

data class PortfolioResponse(
    val portfolio: List<Portfolio>
)

data class OrdersResponse(
    val orders: List<Order>
)

data class PriceHistoryResponse(
    val history: List<PriceHistory>
)

data class PlaceOrderRequest(
    val commodity_id: Int,
    val order_type: String,
    val quantity: Double,
    val price: Double
)

data class OrderResponse(
    val order: Order
)

// UI State classes
data class DashboardState(
    val isLoading: Boolean = true,
    val user: User? = null,
    val commodities: List<Commodity> = emptyList(),
    val portfolio: List<Portfolio> = emptyList(),
    val totalValue: Double = 0.0,
    val totalPnL: Double = 0.0,
    val error: String? = null
)

data class PortfolioState(
    val isLoading: Boolean = true,
    val portfolio: List<Portfolio> = emptyList(),
    val totalValue: Double = 0.0,
    val totalInvestment: Double = 0.0,
    val totalPnL: Double = 0.0,
    val error: String? = null
)

data class OrdersState(
    val isLoading: Boolean = true,
    val orders: List<Order> = emptyList(),
    val filter: OrderFilter = OrderFilter.ALL,
    val error: String? = null
)

enum class OrderFilter {
    ALL, PENDING, COMPLETED, CANCELLED
}

data class ChartsState(
    val isLoading: Boolean = true,
    val commodities: List<Commodity> = emptyList(),
    val selectedCommodity: Commodity? = null,
    val priceHistory: List<PriceHistory> = emptyList(),
    val timeframe: Timeframe = Timeframe.ONE_DAY,
    val error: String? = null
)

enum class Timeframe(val label: String) {
    ONE_HOUR("1H"),
    ONE_DAY("1D"),
    ONE_WEEK("1W"),
    ONE_MONTH("1M"),
    THREE_MONTHS("3M"),
    ONE_YEAR("1Y")
}
