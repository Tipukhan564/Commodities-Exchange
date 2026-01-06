package com.commodityx.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.commodityx.CommodityXApplication
import com.commodityx.data.DashboardState
import com.commodityx.network.RetrofitClient
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

class DashboardViewModel : ViewModel() {

    private val _state = MutableStateFlow(DashboardState())
    val state = _state.asStateFlow()

    private val preferencesManager = CommodityXApplication.instance.preferencesManager

    fun loadDashboardData() {
        viewModelScope.launch {
            _state.value = _state.value.copy(isLoading = true, error = null)

            try {
                // Load user
                val user = preferencesManager.getUser()

                // Load commodities
                val commoditiesResponse = RetrofitClient.apiService.getCommodities()

                // Load portfolio
                val portfolioResponse = try {
                    RetrofitClient.apiService.getPortfolio()
                } catch (e: Exception) {
                    null
                }

                val portfolio = portfolioResponse?.portfolio ?: emptyList()
                val totalValue = portfolio.sumOf { it.currentValue }
                val totalInvestment = portfolio.sumOf { it.investment }
                val totalPnL = if (totalInvestment > 0) {
                    ((totalValue - totalInvestment) / totalInvestment) * 100
                } else 0.0

                _state.value = DashboardState(
                    isLoading = false,
                    user = user,
                    commodities = commoditiesResponse.commodities,
                    portfolio = portfolio,
                    totalValue = totalValue,
                    totalPnL = totalPnL,
                    error = null
                )
            } catch (e: Exception) {
                _state.value = _state.value.copy(
                    isLoading = false,
                    error = e.message ?: "Failed to load dashboard data"
                )
            }
        }
    }
}
