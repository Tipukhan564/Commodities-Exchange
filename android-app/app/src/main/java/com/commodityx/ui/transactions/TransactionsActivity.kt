package com.commodityx.ui.transactions

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.viewModels
import androidx.compose.animation.animateColorAsState
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.commodityx.data.Transaction
import com.commodityx.data.TransactionFilter
import com.commodityx.ui.theme.*
import com.commodityx.viewmodel.TransactionsViewModel
import java.text.NumberFormat
import java.text.SimpleDateFormat
import java.util.*

class TransactionsActivity : ComponentActivity() {

    private val viewModel: TransactionsViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        setContent {
            CommodityXTheme {
                val state by viewModel.state.collectAsState()

                LaunchedEffect(Unit) {
                    viewModel.loadTransactions()
                }

                TransactionsScreen(
                    state = state,
                    filteredTransactions = viewModel.getFilteredTransactions(),
                    onFilterChange = { viewModel.setFilter(it) },
                    onRefresh = { viewModel.loadTransactions() },
                    onBack = { finish() }
                )
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun TransactionsScreen(
    state: com.commodityx.data.TransactionsState,
    filteredTransactions: List<Transaction>,
    onFilterChange: (TransactionFilter) -> Unit,
    onRefresh: () -> Unit,
    onBack: () -> Unit
) {
    val currencyFormatter = remember {
        NumberFormat.getCurrencyInstance(Locale.US).apply {
            maximumFractionDigits = 2
            minimumFractionDigits = 2
        }
    }

    val dateFormatter = remember {
        SimpleDateFormat("MMM dd, yyyy HH:mm", Locale.US)
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Transactions") },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Back")
                    }
                },
                actions = {
                    IconButton(onClick = onRefresh) {
                        Icon(Icons.Default.Refresh, contentDescription = "Refresh")
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = SurfaceDark,
                    titleContentColor = Color.White,
                    navigationIconContentColor = Color.White,
                    actionIconContentColor = Color.White
                )
            )
        }
    ) { paddingValues ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(CyberDark)
                .padding(paddingValues)
        ) {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(16.dp)
            ) {
                // Filter Chips
                LazyRow(
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    items(TransactionFilter.values().size) { index ->
                        val filter = TransactionFilter.values()[index]
                        val isSelected = state.filter == filter
                        FilterChip(
                            selected = isSelected,
                            onClick = { onFilterChange(filter) },
                            label = {
                                Text(
                                    text = filter.name,
                                    fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal
                                )
                            },
                            leadingIcon = if (isSelected) {
                                {
                                    Icon(
                                        Icons.Default.Check,
                                        contentDescription = null,
                                        modifier = Modifier.size(18.dp)
                                    )
                                }
                            } else null,
                            colors = FilterChipDefaults.filterChipColors(
                                containerColor = SurfaceDark,
                                selectedContainerColor = NeonCyan,
                                labelColor = Gray400,
                                selectedLabelColor = Color.White
                            ),
                            border = FilterChipDefaults.filterChipBorder(
                                borderColor = if (isSelected) NeonCyan else Gray600,
                                selectedBorderColor = NeonCyan
                            )
                        )
                    }
                }

                Spacer(modifier = Modifier.height(16.dp))

                // Transaction Count
                Text(
                    text = "${filteredTransactions.size} ${if (filteredTransactions.size == 1) "Transaction" else "Transactions"}",
                    style = MaterialTheme.typography.titleMedium,
                    color = Gray400
                )

                Spacer(modifier = Modifier.height(16.dp))

                // Transactions List
                if (state.isLoading) {
                    Box(
                        modifier = Modifier.fillMaxSize(),
                        contentAlignment = Alignment.Center
                    ) {
                        CircularProgressIndicator(color = NeonCyan)
                    }
                } else if (filteredTransactions.isEmpty()) {
                    Box(
                        modifier = Modifier.fillMaxSize(),
                        contentAlignment = Alignment.Center
                    ) {
                        Column(
                            horizontalAlignment = Alignment.CenterHorizontally,
                            verticalArrangement = Arrangement.Center
                        ) {
                            Icon(
                                Icons.Default.Receipt,
                                contentDescription = null,
                                modifier = Modifier.size(80.dp),
                                tint = Gray600
                            )
                            Spacer(modifier = Modifier.height(16.dp))
                            Text(
                                text = "No ${state.filter.name.lowercase()} transactions",
                                style = MaterialTheme.typography.titleLarge,
                                color = Gray500
                            )
                        }
                    }
                } else {
                    LazyColumn(
                        verticalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        items(filteredTransactions) { transaction ->
                            TransactionCard(
                                transaction = transaction,
                                currencyFormatter = currencyFormatter,
                                dateFormatter = dateFormatter
                            )
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun TransactionCard(
    transaction: Transaction,
    currencyFormatter: NumberFormat,
    dateFormatter: SimpleDateFormat
) {
    val transactionColor = when (transaction.transaction_type.lowercase()) {
        "deposit", "sell" -> ProfitGreen
        "withdrawal", "buy" -> NeonCyan
        else -> Gray400
    }

    val isPositive = transaction.transaction_type.lowercase() in listOf("deposit", "sell")

    val borderColor by animateColorAsState(
        targetValue = transactionColor.copy(alpha = 0.5f)
    )

    val icon = when (transaction.transaction_type.lowercase()) {
        "deposit" -> Icons.Default.AccountBalanceWallet
        "withdrawal" -> Icons.Default.MoneyOff
        "buy" -> Icons.Default.TrendingUp
        "sell" -> Icons.Default.TrendingDown
        else -> Icons.Default.Receipt
    }

    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(containerColor = SurfaceDark),
        shape = RoundedCornerShape(16.dp)
    ) {
        Box {
            // Glow effect
            Box(
                modifier = Modifier
                    .size(200.dp)
                    .align(Alignment.TopEnd)
                    .offset(x = 100.dp, y = (-100).dp)
                    .background(
                        Brush.radialGradient(
                            colors = listOf(
                                transactionColor.copy(alpha = 0.15f),
                                Color.Transparent
                            )
                        )
                    )
            )

            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(16.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier.weight(1f)
                ) {
                    Surface(
                        color = transactionColor.copy(alpha = 0.15f),
                        shape = RoundedCornerShape(12.dp),
                        modifier = Modifier.size(56.dp)
                    ) {
                        Box(contentAlignment = Alignment.Center) {
                            Icon(
                                icon,
                                contentDescription = null,
                                tint = transactionColor,
                                modifier = Modifier.size(28.dp)
                            )
                        }
                    }

                    Spacer(modifier = Modifier.width(16.dp))

                    Column {
                        Text(
                            text = transaction.transaction_type.uppercase(),
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Bold,
                            color = Color.White
                        )

                        transaction.description?.let { desc ->
                            Text(
                                text = desc,
                                style = MaterialTheme.typography.bodySmall,
                                color = Gray400
                            )
                        }

                        Spacer(modifier = Modifier.height(4.dp))

                        Text(
                            text = try {
                                dateFormatter.format(Date(transaction.created_at.toLong()))
                            } catch (e: Exception) {
                                transaction.created_at
                            },
                            style = MaterialTheme.typography.labelSmall,
                            color = Gray500
                        )
                    }
                }

                Spacer(modifier = Modifier.width(16.dp))

                Column(horizontalAlignment = Alignment.End) {
                    Text(
                        text = "${if (isPositive) "+" else "-"}${currencyFormatter.format(transaction.amount)}",
                        style = MaterialTheme.typography.titleLarge,
                        fontWeight = FontWeight.Bold,
                        color = transactionColor
                    )
                }
            }
        }
    }
}
