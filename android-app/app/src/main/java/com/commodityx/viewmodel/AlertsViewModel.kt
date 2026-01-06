package com.commodityx.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.commodityx.data.AlertsState
import com.commodityx.data.CreateAlertRequest
import com.commodityx.network.RetrofitClient
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

class AlertsViewModel : ViewModel() {

    private val _state = MutableStateFlow(AlertsState())
    val state = _state.asStateFlow()

    fun loadAlerts() {
        viewModelScope.launch {
            _state.value = _state.value.copy(isLoading = true, error = null)

            try {
                val alertsResponse = RetrofitClient.apiService.getAlerts()
                _state.value = _state.value.copy(
                    isLoading = false,
                    alerts = alertsResponse.alerts,
                    error = null
                )
            } catch (e: Exception) {
                _state.value = _state.value.copy(
                    isLoading = false,
                    error = e.message ?: "Failed to load alerts"
                )
            }
        }
    }

    fun createAlert(
        commodityId: Int,
        targetPrice: Double,
        condition: String,
        onSuccess: () -> Unit,
        onError: (String) -> Unit
    ) {
        viewModelScope.launch {
            try {
                RetrofitClient.apiService.createAlert(
                    CreateAlertRequest(
                        commodity_id = commodityId,
                        target_price = targetPrice,
                        condition = condition
                    )
                )
                loadAlerts()
                onSuccess()
            } catch (e: Exception) {
                onError(e.message ?: "Failed to create alert")
            }
        }
    }

    fun deleteAlert(alertId: Int, onSuccess: () -> Unit, onError: (String) -> Unit) {
        viewModelScope.launch {
            try {
                RetrofitClient.apiService.deleteAlert(alertId)
                loadAlerts()
                onSuccess()
            } catch (e: Exception) {
                onError(e.message ?: "Failed to delete alert")
            }
        }
    }
}
