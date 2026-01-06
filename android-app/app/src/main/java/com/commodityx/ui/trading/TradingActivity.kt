package com.commodityx.ui.trading

import android.os.Bundle
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.viewModels
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
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
import com.commodityx.ui.theme.*
import com.commodityx.viewmodel.TradingViewModel
import java.text.NumberFormat
import java.util.*

class TradingActivity : ComponentActivity() {

    private val viewModel: TradingViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val commodity = intent.getParcelableExtra<Commodity>("commodity")

        setContent {
            CommodityXTheme {
                commodity?.let {
                    TradingScreen(
                        commodity = it,
                        viewModel = viewModel,
                        onBack = { finish() },
                        onSuccess = {
                            Toast.makeText(this, "Order placed successfully!", Toast.LENGTH_SHORT).show()
                            finish()
                        },
                        onError = { message ->
                            Toast.makeText(this, message, Toast.LENGTH_SHORT).show()
                        }
                    )
                }
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun TradingScreen(
    commodity: Commodity,
    viewModel: TradingViewModel,
    onBack: () -> Unit,
    onSuccess: () -> Unit,
    onError: (String) -> Unit
) {
    var orderType by remember { mutableStateOf("buy") }
    var quantity by remember { mutableStateOf("") }
    var isLoading by remember { mutableStateOf(false) }

    val currencyFormatter = remember {
        NumberFormat.getCurrencyInstance(Locale.US).apply {
            maximumFractionDigits = 2
            minimumFractionDigits = 2
        }
    }

    val totalCost = remember(quantity) {
        val qty = quantity.toDoubleOrNull() ?: 0.0
        commodity.current_price * qty
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Place Order") },
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
                // Commodity Info Card
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    colors = CardDefaults.cardColors(
                        containerColor = SurfaceDark.copy(alpha = 0.7f)
                    ),
                    shape = RoundedCornerShape(20.dp)
                ) {
                    Box {
                        // Glow
                        Box(
                            modifier = Modifier
                                .size(200.dp)
                                .align(Alignment.TopEnd)
                                .offset(x = 100.dp, y = (-100).dp)
                                .background(
                                    Brush.radialGradient(
                                        colors = listOf(
                                            NeonPurple.copy(alpha = 0.2f),
                                            Color.Transparent
                                        )
                                    )
                                )
                        )

                        Column(modifier = Modifier.padding(20.dp)) {
                            Text(
                                text = commodity.symbol,
                                style = MaterialTheme.typography.displaySmall,
                                fontWeight = FontWeight.Bold,
                                color = Color.White
                            )
                            Text(
                                text = commodity.name,
                                style = MaterialTheme.typography.bodyMedium,
                                color = Gray400
                            )

                            Spacer(modifier = Modifier.height(16.dp))

                            Text(
                                text = currencyFormatter.format(commodity.current_price),
                                style = MaterialTheme.typography.displayMedium,
                                fontWeight = FontWeight.Bold,
                                color = NeonCyan
                            )

                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween
                            ) {
                                InfoItem("24h High", currencyFormatter.format(commodity.high_24h ?: 0.0))
                                InfoItem("24h Low", currencyFormatter.format(commodity.low_24h ?: 0.0))
                            }
                        }
                    }
                }

                Spacer(modifier = Modifier.height(24.dp))

                // Order Type Selector
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    colors = CardDefaults.cardColors(containerColor = SurfaceDark),
                    shape = RoundedCornerShape(16.dp)
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(4.dp)
                    ) {
                        Button(
                            onClick = { orderType = "buy" },
                            modifier = Modifier
                                .weight(1f)
                                .height(56.dp),
                            colors = ButtonDefaults.buttonColors(
                                containerColor = if (orderType == "buy") ProfitGreen else Color.Transparent,
                                contentColor = if (orderType == "buy") Color.White else Gray400
                            ),
                            shape = RoundedCornerShape(12.dp)
                        ) {
                            Icon(Icons.Default.TrendingUp, contentDescription = null)
                            Spacer(modifier = Modifier.width(8.dp))
                            Text("BUY", fontWeight = FontWeight.Bold)
                        }

                        Spacer(modifier = Modifier.width(8.dp))

                        Button(
                            onClick = { orderType = "sell" },
                            modifier = Modifier
                                .weight(1f)
                                .height(56.dp),
                            colors = ButtonDefaults.buttonColors(
                                containerColor = if (orderType == "sell") LossRed else Color.Transparent,
                                contentColor = if (orderType == "sell") Color.White else Gray400
                            ),
                            shape = RoundedCornerShape(12.dp)
                        ) {
                            Icon(Icons.Default.TrendingDown, contentDescription = null)
                            Spacer(modifier = Modifier.width(8.dp))
                            Text("SELL", fontWeight = FontWeight.Bold)
                        }
                    }
                }

                Spacer(modifier = Modifier.height(24.dp))

                // Quantity Input
                OutlinedTextField(
                    value = quantity,
                    onValueChange = { quantity = it },
                    label = { Text("Quantity") },
                    leadingIcon = {
                        Icon(Icons.Default.Numbers, contentDescription = null)
                    },
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Decimal),
                    modifier = Modifier.fillMaxWidth(),
                    colors = TextFieldDefaults.outlinedTextFieldColors(
                        focusedBorderColor = NeonCyan,
                        unfocusedBorderColor = Gray600,
                        focusedLabelColor = NeonCyan,
                        cursorColor = NeonCyan
                    ),
                    shape = RoundedCornerShape(12.dp)
                )

                Spacer(modifier = Modifier.height(24.dp))

                // Order Summary
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    colors = CardDefaults.cardColors(containerColor = SurfaceDark),
                    shape = RoundedCornerShape(16.dp)
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Text(
                            text = "Order Summary",
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Bold,
                            color = Color.White
                        )

                        Spacer(modifier = Modifier.height(12.dp))

                        SummaryRow("Price per unit", currencyFormatter.format(commodity.current_price))
                        SummaryRow("Quantity", quantity.ifEmpty { "0" })
                        Divider(color = Gray600, modifier = Modifier.padding(vertical = 8.dp))
                        SummaryRow(
                            "Total Cost",
                            currencyFormatter.format(totalCost),
                            isHighlight = true
                        )
                    }
                }

                Spacer(modifier = Modifier.weight(1f))

                // Place Order Button
                Button(
                    onClick = {
                        val qty = quantity.toDoubleOrNull()
                        if (qty == null || qty <= 0) {
                            onError("Please enter a valid quantity")
                            return@Button
                        }

                        isLoading = true
                        viewModel.placeOrder(
                            commodityId = commodity.id,
                            orderType = orderType,
                            quantity = qty,
                            price = commodity.current_price,
                            onSuccess = {
                                isLoading = false
                                onSuccess()
                            },
                            onError = { error ->
                                isLoading = false
                                onError(error)
                            }
                        )
                    },
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(56.dp),
                    enabled = !isLoading && quantity.isNotEmpty(),
                    colors = ButtonDefaults.buttonColors(containerColor = Color.Transparent),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Box(
                        modifier = Modifier
                            .fillMaxSize()
                            .background(
                                Brush.horizontalGradient(
                                    colors = if (orderType == "buy") {
                                        listOf(ProfitGreen, NeonGreen)
                                    } else {
                                        listOf(LossRed, NeonRed)
                                    }
                                ),
                                shape = RoundedCornerShape(12.dp)
                            ),
                        contentAlignment = Alignment.Center
                    ) {
                        if (isLoading) {
                            CircularProgressIndicator(
                                color = Color.White,
                                modifier = Modifier.size(24.dp)
                            )
                        } else {
                            Text(
                                text = if (orderType == "buy") "PLACE BUY ORDER" else "PLACE SELL ORDER",
                                style = MaterialTheme.typography.titleMedium,
                                fontWeight = FontWeight.Bold,
                                color = Color.White
                            )
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun InfoItem(label: String, value: String) {
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

@Composable
fun SummaryRow(label: String, value: String, isHighlight: Boolean = false) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 4.dp),
        horizontalArrangement = Arrangement.SpaceBetween
    ) {
        Text(
            text = label,
            style = MaterialTheme.typography.bodyMedium,
            color = if (isHighlight) Color.White else Gray400
        )
        Text(
            text = value,
            style = if (isHighlight) MaterialTheme.typography.titleMedium else MaterialTheme.typography.bodyMedium,
            fontWeight = if (isHighlight) FontWeight.Bold else FontWeight.Normal,
            color = if (isHighlight) NeonGreen else Color.White
        )
    }
}
