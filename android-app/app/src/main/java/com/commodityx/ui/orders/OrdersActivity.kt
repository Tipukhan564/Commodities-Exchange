package com.commodityx.ui.orders

import android.os.Bundle
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.viewModels
import androidx.compose.animation.animateColorAsState
import androidx.compose.foundation.BorderStroke
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
import com.commodityx.data.Order
import com.commodityx.data.OrderFilter
import com.commodityx.ui.theme.*
import com.commodityx.viewmodel.OrdersViewModel
import java.text.NumberFormat
import java.text.SimpleDateFormat
import java.util.*

class OrdersActivity : ComponentActivity() {

    private val viewModel: OrdersViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        setContent {
            CommodityXTheme {
                val state by viewModel.state.collectAsState()

                LaunchedEffect(Unit) {
                    viewModel.loadOrders()
                }

                OrdersScreen(
                    state = state,
                    filteredOrders = viewModel.getFilteredOrders(),
                    onFilterChange = { viewModel.setFilter(it) },
                    onCancelOrder = { orderId ->
                        viewModel.cancelOrder(
                            orderId = orderId,
                            onSuccess = {
                                Toast.makeText(this, "Order cancelled successfully", Toast.LENGTH_SHORT).show()
                            },
                            onError = { error ->
                                Toast.makeText(this, error, Toast.LENGTH_SHORT).show()
                            }
                        )
                    },
                    onBack = { finish() }
                )
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun OrdersScreen(
    state: com.commodityx.data.OrdersState,
    filteredOrders: List<Order>,
    onFilterChange: (OrderFilter) -> Unit,
    onCancelOrder: (Int) -> Unit,
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
                title = { Text("Orders") },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Back")
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = SurfaceDark,
                    titleContentColor = Color.White,
                    navigationIconContentColor = Color.White
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
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    OrderFilter.values().forEach { filter ->
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
                                selectedContainerColor = NeonPurple,
                                labelColor = Gray400,
                                selectedLabelColor = Color.White
                            ),
                            border = FilterChipDefaults.filterChipBorder(
                                borderColor = if (isSelected) NeonPurple else Gray600,
                                selectedBorderColor = NeonPurple
                            )
                        )
                    }
                }

                Spacer(modifier = Modifier.height(16.dp))

                // Orders Count
                Text(
                    text = "${filteredOrders.size} ${if (filteredOrders.size == 1) "Order" else "Orders"}",
                    style = MaterialTheme.typography.titleMedium,
                    color = Gray400
                )

                Spacer(modifier = Modifier.height(16.dp))

                // Orders List
                if (state.isLoading) {
                    Box(
                        modifier = Modifier.fillMaxSize(),
                        contentAlignment = Alignment.Center
                    ) {
                        CircularProgressIndicator(color = NeonPurple)
                    }
                } else if (filteredOrders.isEmpty()) {
                    Box(
                        modifier = Modifier.fillMaxSize(),
                        contentAlignment = Alignment.Center
                    ) {
                        Column(
                            horizontalAlignment = Alignment.CenterHorizontally,
                            verticalArrangement = Arrangement.Center
                        ) {
                            Icon(
                                Icons.Default.ShoppingBag,
                                contentDescription = null,
                                modifier = Modifier.size(80.dp),
                                tint = Gray600
                            )
                            Spacer(modifier = Modifier.height(16.dp))
                            Text(
                                text = "No ${state.filter.name.lowercase()} orders",
                                style = MaterialTheme.typography.titleLarge,
                                color = Gray500
                            )
                        }
                    }
                } else {
                    LazyColumn(
                        verticalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        items(filteredOrders) { order ->
                            OrderCard(
                                order = order,
                                currencyFormatter = currencyFormatter,
                                dateFormatter = dateFormatter,
                                onCancelClick = { onCancelOrder(order.id) }
                            )
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun OrderCard(
    order: Order,
    currencyFormatter: NumberFormat,
    dateFormatter: SimpleDateFormat,
    onCancelClick: () -> Unit
) {
    val statusColor = when (order.status.lowercase()) {
        "completed" -> ProfitGreen
        "pending" -> NeonCyan
        "cancelled" -> LossRed
        else -> Gray400
    }

    val borderColor by animateColorAsState(
        targetValue = statusColor.copy(alpha = 0.5f)
    )

    var showCancelDialog by remember { mutableStateOf(false) }

    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(containerColor = SurfaceDark),
        shape = RoundedCornerShape(16.dp),
        border = BorderStroke(
            width = 2.dp,
            brush = Brush.horizontalGradient(
                colors = listOf(borderColor, Color.Transparent)
            )
        )
    ) {
        Column(
            modifier = Modifier.padding(16.dp)
        ) {
            // Header: Symbol and Status
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(
                        if (order.order_type == "buy") Icons.Default.TrendingUp else Icons.Default.TrendingDown,
                        contentDescription = null,
                        tint = if (order.order_type == "buy") ProfitGreen else LossRed,
                        modifier = Modifier.size(24.dp)
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Column {
                        Text(
                            text = order.commodity_symbol ?: "N/A",
                            style = MaterialTheme.typography.titleLarge,
                            fontWeight = FontWeight.Bold,
                            color = Color.White
                        )
                        Text(
                            text = order.commodity_name ?: "",
                            style = MaterialTheme.typography.bodySmall,
                            color = Gray400
                        )
                    }
                }

                Surface(
                    color = statusColor.copy(alpha = 0.15f),
                    shape = RoundedCornerShape(8.dp)
                ) {
                    Text(
                        text = order.status.uppercase(),
                        modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp),
                        style = MaterialTheme.typography.labelMedium,
                        fontWeight = FontWeight.Bold,
                        color = statusColor
                    )
                }
            }

            Spacer(modifier = Modifier.height(12.dp))
            Divider(color = Gray600)
            Spacer(modifier = Modifier.height(12.dp))

            // Order Details
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                OrderDetailItem("Type", order.order_type.uppercase())
                OrderDetailItem("Quantity", String.format("%.4f", order.quantity))
                OrderDetailItem("Price", currencyFormatter.format(order.price))
            }

            Spacer(modifier = Modifier.height(12.dp))

            // Total and Date
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text(
                        text = "Total Value",
                        style = MaterialTheme.typography.labelSmall,
                        color = Gray500
                    )
                    Text(
                        text = currencyFormatter.format(order.totalValue),
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold,
                        color = NeonCyan
                    )
                }

                Column(horizontalAlignment = Alignment.End) {
                    Text(
                        text = "Placed on",
                        style = MaterialTheme.typography.labelSmall,
                        color = Gray500
                    )
                    Text(
                        text = try {
                            dateFormatter.format(Date(order.created_at.toLong()))
                        } catch (e: Exception) {
                            order.created_at
                        },
                        style = MaterialTheme.typography.bodySmall,
                        color = Gray400
                    )
                }
            }

            // Cancel Button (only for pending orders)
            if (order.status.equals("pending", ignoreCase = true)) {
                Spacer(modifier = Modifier.height(12.dp))
                OutlinedButton(
                    onClick = { showCancelDialog = true },
                    modifier = Modifier.fillMaxWidth(),
                    colors = ButtonDefaults.outlinedButtonColors(
                        contentColor = LossRed
                    ),
                    border = BorderStroke(1.dp, LossRed),
                    shape = RoundedCornerShape(8.dp)
                ) {
                    Icon(
                        Icons.Default.Close,
                        contentDescription = null,
                        modifier = Modifier.size(18.dp)
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("Cancel Order")
                }
            }
        }
    }

    // Cancel Confirmation Dialog
    if (showCancelDialog) {
        AlertDialog(
            onDismissRequest = { showCancelDialog = false },
            title = { Text("Cancel Order?") },
            text = { Text("Are you sure you want to cancel this order? This action cannot be undone.") },
            confirmButton = {
                Button(
                    onClick = {
                        showCancelDialog = false
                        onCancelClick()
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = LossRed)
                ) {
                    Text("Cancel Order")
                }
            },
            dismissButton = {
                TextButton(onClick = { showCancelDialog = false }) {
                    Text("Keep Order")
                }
            },
            containerColor = SurfaceDark,
            titleContentColor = Color.White,
            textContentColor = Gray400
        )
    }
}

@Composable
fun OrderDetailItem(label: String, value: String) {
    Column {
        Text(
            text = label,
            style = MaterialTheme.typography.labelSmall,
            color = Gray500
        )
        Text(
            text = value,
            style = MaterialTheme.typography.bodyMedium,
            fontWeight = FontWeight.SemiBold,
            color = Color.White
        )
    }
}
