package com.commodityx.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.commodityx.data.PortfolioState
import com.commodityx.network.RetrofitClient
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

class PortfolioViewModel : ViewModel() {

    private val _state = MutableStateFlow(PortfolioState())
    val state = _state.asStateFlow()

    fun loadPortfolio() {
        viewModelScope.launch {
            _state.value = _state.value.copy(isLoading = true, error = null)

            try {
                val portfolioResponse = RetrofitClient.apiService.getPortfolio()
                val portfolio = portfolioResponse.portfolio

                val totalValue = portfolio.sumOf { it.currentValue }
                val totalInvestment = portfolio.sumOf { it.investment }
                val totalPnL = if (totalInvestment > 0) {
                    ((totalValue - totalInvestment) / totalInvestment) * 100
                } else 0.0

                _state.value = PortfolioState(
                    isLoading = false,
                    portfolio = portfolio,
                    totalValue = totalValue,
                    totalInvestment = totalInvestment,
                    totalPnL = totalPnL,
                    error = null
                )
            } catch (e: Exception) {
                _state.value = _state.value.copy(
                    isLoading = false,
                    error = e.message ?: "Failed to load portfolio"
                )
            }
        }
    }
}
