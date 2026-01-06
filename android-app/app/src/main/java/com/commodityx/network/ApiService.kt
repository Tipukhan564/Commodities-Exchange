package com.commodityx.network

import com.commodityx.data.*
import retrofit2.Response
import retrofit2.http.*

interface ApiService {

    // Authentication
    @POST("auth/login")
    suspend fun login(@Body request: LoginRequest): AuthResponse

    @POST("auth/register")
    suspend fun register(@Body request: RegisterRequest): AuthResponse

    @GET("auth/profile")
    suspend fun getProfile(): ApiResponse<User>

    // Commodities
    @GET("commodities")
    suspend fun getCommodities(): CommoditiesResponse

    @GET("commodities/{id}")
    suspend fun getCommodity(@Path("id") id: Int): ApiResponse<Commodity>

    @GET("commodities/{id}/history")
    suspend fun getPriceHistory(
        @Path("id") id: Int,
        @Query("timeframe") timeframe: String = "1D"
    ): PriceHistoryResponse

    // Trading
    @POST("trading/order")
    suspend fun placeOrder(@Body request: PlaceOrderRequest): OrderResponse

    @GET("trading/orders")
    suspend fun getOrders(): OrdersResponse

    @DELETE("trading/orders/{id}")
    suspend fun cancelOrder(@Path("id") id: Int): ApiResponse<Any>

    @GET("trading/portfolio")
    suspend fun getPortfolio(): PortfolioResponse

    // Watchlist
    @GET("watchlist")
    suspend fun getWatchlist(): WatchlistResponse

    @POST("watchlist")
    suspend fun addToWatchlist(@Body request: AddToWatchlistRequest): ApiResponse<Any>

    @DELETE("watchlist/{commodityId}")
    suspend fun removeFromWatchlist(@Path("commodityId") commodityId: Int): ApiResponse<Any>

    // Alerts
    @GET("alerts")
    suspend fun getAlerts(): AlertsResponse

    @POST("alerts")
    suspend fun createAlert(@Body request: CreateAlertRequest): AlertResponse

    @DELETE("alerts/{id}")
    suspend fun deleteAlert(@Path("id") id: Int): ApiResponse<Any>

    // Transactions
    @GET("transactions")
    suspend fun getTransactions(): TransactionsResponse
}
