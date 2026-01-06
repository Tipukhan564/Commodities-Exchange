package com.commodityx.ui.alerts

import android.os.Bundle
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.viewModels
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import com.commodityx.data.Commodity
import com.commodityx.data.PriceAlert
import com.commodityx.network.RetrofitClient
import com.commodityx.ui.theme.*
import com.commodityx.viewmodel.AlertsViewModel
import kotlinx.coroutines.launch
import java.text.NumberFormat
import java.text.SimpleDateFormat
import java.util.*

class AlertsActivity : ComponentActivity() {

    private val viewModel: AlertsViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        setContent {
            CommodityXTheme {
                val state by viewModel.state.collectAsState()

                LaunchedEffect(Unit) {
                    viewModel.loadAlerts()
                }

                AlertsScreen(
                    state = state,
                    onRefresh = { viewModel.loadAlerts() },
                    onDeleteAlert = { alertId ->
                        viewModel.deleteAlert(
                            alertId = alertId,
                            onSuccess = {
                                Toast.makeText(this, "Alert deleted", Toast.LENGTH_SHORT).show()
                            },
                            onError = { error ->
                                Toast.makeText(this, error, Toast.LENGTH_SHORT).show()
                            }
                        )
                    },
                    onCreateAlert = { commodityId, targetPrice, condition ->
                        viewModel.createAlert(
                            commodityId = commodityId,
                            targetPrice = targetPrice,
                            condition = condition,
                            onSuccess = {
                                Toast.makeText(this, "Alert created successfully", Toast.LENGTH_SHORT).show()
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
fun AlertsScreen(
    state: com.commodityx.data.AlertsState,
    onRefresh: () -> Unit,
    onDeleteAlert: (Int) -> Unit,
    onCreateAlert: (Int, Double, String) -> Unit,
    onBack: () -> Unit
) {
    var showCreateDialog by remember { mutableStateOf(false) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Price Alerts") },
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
        },
        floatingActionButton = {
            FloatingActionButton(
                onClick = { showCreateDialog = true },
                containerColor = NeonPurple,
                contentColor = Color.White
            ) {
                Icon(Icons.Default.Add, contentDescription = "Create Alert")
            }
        }
    ) { paddingValues ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(CyberDark)
                .padding(paddingValues)
        ) {
            if (state.isLoading) {
                CircularProgressIndicator(
                    modifier = Modifier.align(Alignment.Center),
                    color = NeonPurple
                )
            } else if (state.alerts.isEmpty()) {
                // Empty State
                Column(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(32.dp),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(
                        Icons.Default.Notifications,
                        contentDescription = null,
                        modifier = Modifier.size(120.dp),
                        tint = Gray600
                    )
                    Spacer(modifier = Modifier.height(24.dp))
                    Text(
                        text = "No price alerts set",
                        style = MaterialTheme.typography.headlineSmall,
                        fontWeight = FontWeight.Bold,
                        color = Color.White
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        text = "Create alerts to get notified when prices reach your target",
                        style = MaterialTheme.typography.bodyLarge,
                        color = Gray400
                    )
                }
            } else {
                Column(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(16.dp)
                ) {
                    // Header
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = "${state.alerts.size} ${if (state.alerts.size == 1) "Alert" else "Alerts"}",
                            style = MaterialTheme.typography.titleMedium,
                            color = Gray400
                        )

                        Text(
                            text = "${state.alerts.count { it.is_active }} Active",
                            style = MaterialTheme.typography.titleMedium,
                            color = NeonPurple
                        )
                    }

                    Spacer(modifier = Modifier.height(16.dp))

                    // Alerts List
                    LazyColumn(
                        verticalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        items(state.alerts) { alert ->
                            AlertCard(
                                alert = alert,
                                onDelete = { onDeleteAlert(alert.id) }
                            )
                        }
                    }
                }
            }
        }
    }

    // Create Alert Dialog
    if (showCreateDialog) {
        CreateAlertDialog(
            onDismiss = { showCreateDialog = false },
            onCreate = { commodityId, targetPrice, condition ->
                onCreateAlert(commodityId, targetPrice, condition)
                showCreateDialog = false
            }
        )
    }
}

@Composable
fun AlertCard(
    alert: PriceAlert,
    onDelete: () -> Unit
) {
    var showDeleteDialog by remember { mutableStateOf(false) }

    val currencyFormatter = remember {
        NumberFormat.getCurrencyInstance(Locale.US).apply {
            maximumFractionDigits = 2
            minimumFractionDigits = 2
        }
    }

    val dateFormatter = remember {
        SimpleDateFormat("MMM dd, yyyy", Locale.US)
    }

    val conditionColor = if (alert.condition == "above") ProfitGreen else NeonCyan

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
                                conditionColor.copy(alpha = 0.15f),
                                Color.Transparent
                            )
                        )
                    )
            )

            Column(
                modifier = Modifier.padding(16.dp)
            ) {
                // Header
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(
                            Icons.Default.Notifications,
                            contentDescription = null,
                            tint = if (alert.is_active) NeonPurple else Gray600,
                            modifier = Modifier.size(28.dp)
                        )
                        Spacer(modifier = Modifier.width(12.dp))
                        Column {
                            Text(
                                text = alert.commodity_symbol ?: "N/A",
                                style = MaterialTheme.typography.titleLarge,
                                fontWeight = FontWeight.Bold,
                                color = Color.White
                            )
                            Text(
                                text = alert.commodity_name ?: "",
                                style = MaterialTheme.typography.bodySmall,
                                color = Gray400
                            )
                        }
                    }

                    IconButton(onClick = { showDeleteDialog = true }) {
                        Icon(
                            Icons.Default.Delete,
                            contentDescription = "Delete",
                            tint = LossRed
                        )
                    }
                }

                Spacer(modifier = Modifier.height(12.dp))
                Divider(color = Gray600)
                Spacer(modifier = Modifier.height(12.dp))

                // Alert Condition
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text(
                            text = "Target Price",
                            style = MaterialTheme.typography.labelSmall,
                            color = Gray500
                        )
                        Text(
                            text = currencyFormatter.format(alert.target_price),
                            style = MaterialTheme.typography.headlineSmall,
                            fontWeight = FontWeight.Bold,
                            color = conditionColor
                        )
                    }

                    Surface(
                        color = conditionColor.copy(alpha = 0.15f),
                        shape = RoundedCornerShape(12.dp)
                    ) {
                        Row(
                            modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Icon(
                                if (alert.condition == "above") Icons.Default.TrendingUp else Icons.Default.TrendingDown,
                                contentDescription = null,
                                tint = conditionColor,
                                modifier = Modifier.size(20.dp)
                            )
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(
                                text = alert.condition.uppercase(),
                                style = MaterialTheme.typography.titleMedium,
                                fontWeight = FontWeight.Bold,
                                color = conditionColor
                            )
                        }
                    }
                }

                Spacer(modifier = Modifier.height(12.dp))

                // Status and Date
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Surface(
                        color = if (alert.is_active) ProfitGreen.copy(alpha = 0.15f) else Gray600.copy(alpha = 0.15f),
                        shape = RoundedCornerShape(8.dp)
                    ) {
                        Text(
                            text = if (alert.is_active) "ACTIVE" else "INACTIVE",
                            modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp),
                            style = MaterialTheme.typography.labelMedium,
                            fontWeight = FontWeight.Bold,
                            color = if (alert.is_active) ProfitGreen else Gray500
                        )
                    }

                    Text(
                        text = try {
                            "Created ${dateFormatter.format(Date(alert.created_at.toLong()))}"
                        } catch (e: Exception) {
                            alert.created_at
                        },
                        style = MaterialTheme.typography.bodySmall,
                        color = Gray400
                    )
                }
            }
        }
    }

    // Delete Confirmation Dialog
    if (showDeleteDialog) {
        AlertDialog(
            onDismissRequest = { showDeleteDialog = false },
            title = { Text("Delete Alert?") },
            text = { Text("Are you sure you want to delete this price alert?") },
            confirmButton = {
                Button(
                    onClick = {
                        showDeleteDialog = false
                        onDelete()
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = LossRed)
                ) {
                    Text("Delete")
                }
            },
            dismissButton = {
                TextButton(onClick = { showDeleteDialog = false }) {
                    Text("Cancel")
                }
            },
            containerColor = SurfaceDark,
            titleContentColor = Color.White,
            textContentColor = Gray400
        )
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CreateAlertDialog(
    onDismiss: () -> Unit,
    onCreate: (commodityId: Int, targetPrice: Double, condition: String) -> Unit
) {
    var commodities by remember { mutableStateOf<List<Commodity>>(emptyList()) }
    var selectedCommodity by remember { mutableStateOf<Commodity?>(null) }
    var showCommodityDropdown by remember { mutableStateOf(false) }
    var targetPrice by remember { mutableStateOf("") }
    var condition by remember { mutableStateOf("above") }
    val scope = rememberCoroutineScope()

    LaunchedEffect(Unit) {
        scope.launch {
            try {
                val response = RetrofitClient.apiService.getCommodities()
                commodities = response.commodities
            } catch (e: Exception) {
                // Handle error
            }
        }
    }

    val currencyFormatter = remember {
        NumberFormat.getCurrencyInstance(Locale.US).apply {
            maximumFractionDigits = 2
            minimumFractionDigits = 2
        }
    }

    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text("Create Price Alert") },
        text = {
            Column(
                modifier = Modifier.fillMaxWidth(),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                // Commodity Selector
                ExposedDropdownMenuBox(
                    expanded = showCommodityDropdown,
                    onExpandedChange = { showCommodityDropdown = it }
                ) {
                    OutlinedTextField(
                        value = selectedCommodity?.let { "${it.symbol} - ${it.name}" } ?: "Select Commodity",
                        onValueChange = {},
                        readOnly = true,
                        modifier = Modifier
                            .fillMaxWidth()
                            .menuAnchor(),
                        trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = showCommodityDropdown) },
                        colors = TextFieldDefaults.outlinedTextFieldColors(
                            focusedBorderColor = NeonPurple,
                            unfocusedBorderColor = Gray600,
                            cursorColor = NeonPurple
                        )
                    )

                    ExposedDropdownMenu(
                        expanded = showCommodityDropdown,
                        onDismissRequest = { showCommodityDropdown = false },
                        modifier = Modifier.background(SurfaceDark)
                    ) {
                        commodities.forEach { commodity ->
                            DropdownMenuItem(
                                text = {
                                    Column {
                                        Text(commodity.symbol, color = Color.White)
                                        Text(
                                            commodity.name,
                                            style = MaterialTheme.typography.bodySmall,
                                            color = Gray400
                                        )
                                    }
                                },
                                onClick = {
                                    selectedCommodity = commodity
                                    showCommodityDropdown = false
                                }
                            )
                        }
                    }
                }

                // Current Price Display
                selectedCommodity?.let { commodity ->
                    Surface(
                        color = NeonCyan.copy(alpha = 0.1f),
                        shape = RoundedCornerShape(8.dp)
                    ) {
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(12.dp),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Text("Current Price:", color = Gray400)
                            Text(
                                text = currencyFormatter.format(commodity.current_price),
                                fontWeight = FontWeight.Bold,
                                color = NeonCyan
                            )
                        }
                    }
                }

                // Target Price Input
                OutlinedTextField(
                    value = targetPrice,
                    onValueChange = { targetPrice = it },
                    label = { Text("Target Price") },
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Decimal),
                    modifier = Modifier.fillMaxWidth(),
                    colors = TextFieldDefaults.outlinedTextFieldColors(
                        focusedBorderColor = NeonPurple,
                        unfocusedBorderColor = Gray600,
                        focusedLabelColor = NeonPurple,
                        cursorColor = NeonPurple
                    )
                )

                // Condition Selector
                Text("Alert When Price Goes:", color = Gray400)
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    FilterChip(
                        selected = condition == "above",
                        onClick = { condition = "above" },
                        label = { Text("Above") },
                        leadingIcon = {
                            Icon(
                                Icons.Default.TrendingUp,
                                contentDescription = null,
                                modifier = Modifier.size(18.dp)
                            )
                        },
                        colors = FilterChipDefaults.filterChipColors(
                            selectedContainerColor = ProfitGreen,
                            selectedLabelColor = Color.White
                        )
                    )
                    FilterChip(
                        selected = condition == "below",
                        onClick = { condition = "below" },
                        label = { Text("Below") },
                        leadingIcon = {
                            Icon(
                                Icons.Default.TrendingDown,
                                contentDescription = null,
                                modifier = Modifier.size(18.dp)
                            )
                        },
                        colors = FilterChipDefaults.filterChipColors(
                            selectedContainerColor = NeonCyan,
                            selectedLabelColor = Color.White
                        )
                    )
                }
            }
        },
        confirmButton = {
            Button(
                onClick = {
                    val price = targetPrice.toDoubleOrNull()
                    if (selectedCommodity != null && price != null && price > 0) {
                        onCreate(selectedCommodity!!.id, price, condition)
                    }
                },
                colors = ButtonDefaults.buttonColors(containerColor = NeonPurple),
                enabled = selectedCommodity != null && targetPrice.toDoubleOrNull() != null
            ) {
                Text("Create Alert")
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) {
                Text("Cancel")
            }
        },
        containerColor = SurfaceDark,
        titleContentColor = Color.White,
        textContentColor = Gray400
    )
}
