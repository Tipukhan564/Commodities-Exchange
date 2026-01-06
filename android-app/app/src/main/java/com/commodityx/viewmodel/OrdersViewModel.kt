package com.commodityx.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.commodityx.data.Order
import com.commodityx.data.OrderFilter
import com.commodityx.data.OrdersState
import com.commodityx.network.RetrofitClient
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

class OrdersViewModel : ViewModel() {

    private val _state = MutableStateFlow(OrdersState())
    val state = _state.asStateFlow()

    fun loadOrders() {
        viewModelScope.launch {
            _state.value = _state.value.copy(isLoading = true, error = null)

            try {
                val ordersResponse = RetrofitClient.apiService.getOrders()
                _state.value = _state.value.copy(
                    isLoading = false,
                    orders = ordersResponse.orders,
                    error = null
                )
            } catch (e: Exception) {
                _state.value = _state.value.copy(
                    isLoading = false,
                    error = e.message ?: "Failed to load orders"
                )
            }
        }
    }

    fun setFilter(filter: OrderFilter) {
        _state.value = _state.value.copy(filter = filter)
    }

    fun getFilteredOrders(): List<Order> {
        val orders = _state.value.orders
        return when (_state.value.filter) {
            OrderFilter.ALL -> orders
            OrderFilter.PENDING -> orders.filter { it.status.equals("pending", ignoreCase = true) }
            OrderFilter.COMPLETED -> orders.filter { it.status.equals("completed", ignoreCase = true) }
            OrderFilter.CANCELLED -> orders.filter { it.status.equals("cancelled", ignoreCase = true) }
        }
    }

    fun cancelOrder(orderId: Int, onSuccess: () -> Unit, onError: (String) -> Unit) {
        viewModelScope.launch {
            try {
                RetrofitClient.apiService.cancelOrder(orderId)
                loadOrders() // Reload orders after cancellation
                onSuccess()
            } catch (e: Exception) {
                onError(e.message ?: "Failed to cancel order")
            }
        }
    }
}
