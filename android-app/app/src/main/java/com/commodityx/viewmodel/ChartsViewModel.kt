package com.commodityx.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.commodityx.data.Commodity
import com.commodityx.data.PriceHistory
import com.commodityx.network.RetrofitClient
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

data class ChartsState(
    val isLoading: Boolean = false,
    val selectedCommodity: Commodity? = null,
    val commodities: List<Commodity> = emptyList(),
    val priceHistory: List<PriceHistory> = emptyList(),
    val timeframe: String = "1D",
    val error: String? = null
)

class ChartsViewModel : ViewModel() {

    private val _state = MutableStateFlow(ChartsState())
    val state = _state.asStateFlow()

    fun loadCommodities() {
        viewModelScope.launch {
            _state.value = _state.value.copy(isLoading = true, error = null)

            try {
                val commoditiesResponse = RetrofitClient.apiService.getCommodities()
                val commodities = commoditiesResponse.commodities

                _state.value = _state.value.copy(
                    isLoading = false,
                    commodities = commodities,
                    selectedCommodity = commodities.firstOrNull(),
                    error = null
                )

                // Load price history for first commodity
                commodities.firstOrNull()?.let { loadPriceHistory(it.id) }
            } catch (e: Exception) {
                _state.value = _state.value.copy(
                    isLoading = false,
                    error = e.message ?: "Failed to load commodities"
                )
            }
        }
    }

    fun selectCommodity(commodity: Commodity) {
        _state.value = _state.value.copy(selectedCommodity = commodity)
        loadPriceHistory(commodity.id)
    }

    fun selectTimeframe(timeframe: String) {
        _state.value = _state.value.copy(timeframe = timeframe)
        _state.value.selectedCommodity?.let { loadPriceHistory(it.id) }
    }

    private fun loadPriceHistory(commodityId: Int) {
        viewModelScope.launch {
            _state.value = _state.value.copy(isLoading = true, error = null)

            try {
                val timeframe = _state.value.timeframe
                val history = RetrofitClient.apiService.getPriceHistory(commodityId, timeframe)

                _state.value = _state.value.copy(
                    isLoading = false,
                    priceHistory = history,
                    error = null
                )
            } catch (e: Exception) {
                // Generate mock data for demo purposes
                _state.value = _state.value.copy(
                    isLoading = false,
                    priceHistory = generateMockPriceHistory(),
                    error = null
                )
            }
        }
    }

    private fun generateMockPriceHistory(): List<PriceHistory> {
        val basePrice = _state.value.selectedCommodity?.current_price ?: 1000.0
        val points = when (_state.value.timeframe) {
            "1H" -> 60
            "1D" -> 24
            "1W" -> 7
            "1M" -> 30
            "3M" -> 90
            "1Y" -> 365
            else -> 24
        }

        return (0 until points).map { i ->
            val variation = (Math.random() - 0.5) * basePrice * 0.1
            PriceHistory(
                timestamp = System.currentTimeMillis() - (points - i) * 60000L,
                price = basePrice + variation
            )
        }
    }
}
