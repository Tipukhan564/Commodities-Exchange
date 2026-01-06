package com.commodityx.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.commodityx.data.AddToWatchlistRequest
import com.commodityx.data.WatchlistState
import com.commodityx.network.RetrofitClient
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

class WatchlistViewModel : ViewModel() {

    private val _state = MutableStateFlow(WatchlistState())
    val state = _state.asStateFlow()

    fun loadWatchlist() {
        viewModelScope.launch {
            _state.value = _state.value.copy(isLoading = true, error = null)

            try {
                val watchlistResponse = RetrofitClient.apiService.getWatchlist()
                _state.value = _state.value.copy(
                    isLoading = false,
                    watchlist = watchlistResponse.watchlist,
                    error = null
                )
            } catch (e: Exception) {
                _state.value = _state.value.copy(
                    isLoading = false,
                    error = e.message ?: "Failed to load watchlist"
                )
            }
        }
    }

    fun addToWatchlist(commodityId: Int, onSuccess: () -> Unit, onError: (String) -> Unit) {
        viewModelScope.launch {
            try {
                RetrofitClient.apiService.addToWatchlist(AddToWatchlistRequest(commodityId))
                loadWatchlist()
                onSuccess()
            } catch (e: Exception) {
                onError(e.message ?: "Failed to add to watchlist")
            }
        }
    }

    fun removeFromWatchlist(commodityId: Int, onSuccess: () -> Unit, onError: (String) -> Unit) {
        viewModelScope.launch {
            try {
                RetrofitClient.apiService.removeFromWatchlist(commodityId)
                loadWatchlist()
                onSuccess()
            } catch (e: Exception) {
                onError(e.message ?: "Failed to remove from watchlist")
            }
        }
    }
}
