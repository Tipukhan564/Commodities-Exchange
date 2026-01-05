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
    suspend fun getPriceHistory(@Path("id") id: Int): PriceHistoryResponse

    // Trading
    @POST("trading/order")
    suspend fun placeOrder(@Body request: PlaceOrderRequest): OrderResponse

    @GET("trading/orders")
    suspend fun getOrders(): OrdersResponse

    @DELETE("trading/orders/{id}")
    suspend fun cancelOrder(@Path("id") id: Int): ApiResponse<Any>

    @GET("trading/portfolio")
    suspend fun getPortfolio(): PortfolioResponse
}
