package com.commodityx.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.commodityx.CommodityXApplication
import com.commodityx.data.ProfileState
import com.commodityx.network.RetrofitClient
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

class ProfileViewModel : ViewModel() {

    private val _state = MutableStateFlow(ProfileState())
    val state = _state.asStateFlow()

    private val preferencesManager = CommodityXApplication.instance.preferencesManager

    fun loadProfile() {
        viewModelScope.launch {
            _state.value = _state.value.copy(isLoading = true, error = null)

            try {
                val userResponse = RetrofitClient.apiService.getProfile()
                val user = userResponse.data

                _state.value = _state.value.copy(
                    isLoading = false,
                    user = user,
                    error = null
                )
            } catch (e: Exception) {
                // Try to get cached user
                val cachedUser = preferencesManager.getUser()
                _state.value = _state.value.copy(
                    isLoading = false,
                    user = cachedUser,
                    error = if (cachedUser == null) e.message ?: "Failed to load profile" else null
                )
            }
        }
    }

    fun logout(onSuccess: () -> Unit) {
        viewModelScope.launch {
            preferencesManager.clearToken()
            preferencesManager.clearUser()
            onSuccess()
        }
    }
}
