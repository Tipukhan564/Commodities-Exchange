package com.commodityx.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.commodityx.CommodityXApplication
import com.commodityx.data.LoginRequest
import com.commodityx.data.RegisterRequest
import com.commodityx.network.RetrofitClient
import kotlinx.coroutines.launch

class AuthViewModel : ViewModel() {

    private val preferencesManager = CommodityXApplication.instance.preferencesManager

    fun login(
        username: String,
        password: String,
        onSuccess: () -> Unit,
        onError: (String) -> Unit
    ) {
        if (username.isBlank() || password.isBlank()) {
            onError("Please enter username and password")
            return
        }

        viewModelScope.launch {
            try {
                val response = RetrofitClient.apiService.login(
                    LoginRequest(username, password)
                )

                preferencesManager.saveToken(response.token)
                preferencesManager.saveUser(response.user)

                onSuccess()
            } catch (e: Exception) {
                onError(e.message ?: "Login failed")
            }
        }
    }

    fun register(
        username: String,
        email: String,
        password: String,
        fullName: String,
        onSuccess: () -> Unit,
        onError: (String) -> Unit
    ) {
        if (username.isBlank() || email.isBlank() || password.isBlank()) {
            onError("Please fill in all fields")
            return
        }

        viewModelScope.launch {
            try {
                val response = RetrofitClient.apiService.register(
                    RegisterRequest(username, email, password, fullName)
                )

                preferencesManager.saveToken(response.token)
                preferencesManager.saveUser(response.user)

                onSuccess()
            } catch (e: Exception) {
                onError(e.message ?: "Registration failed")
            }
        }
    }

    fun isLoggedIn(): Boolean {
        return preferencesManager.isLoggedIn()
    }

    fun logout() {
        preferencesManager.logout()
    }
}
