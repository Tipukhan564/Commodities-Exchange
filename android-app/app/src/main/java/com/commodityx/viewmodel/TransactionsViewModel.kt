package com.commodityx.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.commodityx.data.Transaction
import com.commodityx.data.TransactionFilter
import com.commodityx.data.TransactionsState
import com.commodityx.network.RetrofitClient
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

class TransactionsViewModel : ViewModel() {

    private val _state = MutableStateFlow(TransactionsState())
    val state = _state.asStateFlow()

    fun loadTransactions() {
        viewModelScope.launch {
            _state.value = _state.value.copy(isLoading = true, error = null)

            try {
                val transactionsResponse = RetrofitClient.apiService.getTransactions()
                _state.value = _state.value.copy(
                    isLoading = false,
                    transactions = transactionsResponse.transactions,
                    error = null
                )
            } catch (e: Exception) {
                _state.value = _state.value.copy(
                    isLoading = false,
                    error = e.message ?: "Failed to load transactions"
                )
            }
        }
    }

    fun setFilter(filter: TransactionFilter) {
        _state.value = _state.value.copy(filter = filter)
    }

    fun getFilteredTransactions(): List<Transaction> {
        val transactions = _state.value.transactions
        return when (_state.value.filter) {
            TransactionFilter.ALL -> transactions
            TransactionFilter.DEPOSIT -> transactions.filter { it.transaction_type.equals("deposit", ignoreCase = true) }
            TransactionFilter.WITHDRAWAL -> transactions.filter { it.transaction_type.equals("withdrawal", ignoreCase = true) }
            TransactionFilter.BUY -> transactions.filter { it.transaction_type.equals("buy", ignoreCase = true) }
            TransactionFilter.SELL -> transactions.filter { it.transaction_type.equals("sell", ignoreCase = true) }
        }
    }
}
