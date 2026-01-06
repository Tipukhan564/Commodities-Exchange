package com.commodityx.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.commodityx.data.PlaceOrderRequest
import com.commodityx.network.RetrofitClient
import kotlinx.coroutines.launch

class TradingViewModel : ViewModel() {

    fun placeOrder(
        commodityId: Int,
        orderType: String,
        quantity: Double,
        price: Double,
        onSuccess: () -> Unit,
        onError: (String) -> Unit
    ) {
        viewModelScope.launch {
            try {
                RetrofitClient.apiService.placeOrder(
                    PlaceOrderRequest(
                        commodity_id = commodityId,
                        order_type = orderType,
                        quantity = quantity,
                        price = price
                    )
                )
                onSuccess()
            } catch (e: Exception) {
                onError(e.message ?: "Failed to place order")
            }
        }
    }
}
