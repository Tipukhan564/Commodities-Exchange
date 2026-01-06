package com.commodityx.ui.charts

import android.content.Intent
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.viewModels
import androidx.compose.animation.animateColorAsState
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.commodityx.data.Commodity
import com.commodityx.data.PriceHistory
import com.commodityx.ui.theme.*
import com.commodityx.ui.trading.TradingActivity
import com.commodityx.viewmodel.ChartsViewModel
import java.text.NumberFormat
import java.util.*

class ChartsActivity : ComponentActivity() {

    private val viewModel: ChartsViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        setContent {
            CommodityXTheme {
                val state by viewModel.state.collectAsState()

                LaunchedEffect(Unit) {
                    viewModel.loadCommodities()
                }

                ChartsScreen(
                    state = state,
                    onCommoditySelect = { viewModel.selectCommodity(it) },
                    onTimeframeSelect = { viewModel.selectTimeframe(it) },
                    onBuyClick = {
                        state.selectedCommodity?.let { commodity ->
                            val intent = Intent(this, TradingActivity::class.java).apply {
                                putExtra("commodity", commodity)
                            }
                            startActivity(intent)
                        }
                    },
                    onBack = { finish() }
                )
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ChartsScreen(
    state: com.commodityx.viewmodel.ChartsState,
    onCommoditySelect: (Commodity) -> Unit,
    onTimeframeSelect: (String) -> Unit,
    onBuyClick: () -> Unit,
    onBack: () -> Unit
) {
    var showDropdown by remember { mutableStateOf(false) }

    val currencyFormatter = remember {
        NumberFormat.getCurrencyInstance(Locale.US).apply {
            maximumFractionDigits = 2
            minimumFractionDigits = 2
        }
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Charts") },
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
            if (state.isLoading && state.commodities.isEmpty()) {
                CircularProgressIndicator(
                    modifier = Modifier.align(Alignment.Center),
                    color = NeonGreen
                )
            } else {
                Column(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(16.dp)
                ) {
                    // Commodity Selector
                    Card(
                        modifier = Modifier.fillMaxWidth(),
                        colors = CardDefaults.cardColors(containerColor = SurfaceDark),
                        shape = RoundedCornerShape(16.dp),
                        onClick = { showDropdown = true }
                    ) {
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(16.dp),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Icon(
                                    Icons.Default.ShowChart,
                                    contentDescription = null,
                                    tint = NeonGreen,
                                    modifier = Modifier.size(32.dp)
                                )
                                Spacer(modifier = Modifier.width(12.dp))
                                Column {
                                    Text(
                                        text = state.selectedCommodity?.symbol ?: "Select",
                                        style = MaterialTheme.typography.titleLarge,
                                        fontWeight = FontWeight.Bold,
                                        color = Color.White
                                    )
                                    Text(
                                        text = state.selectedCommodity?.name ?: "",
                                        style = MaterialTheme.typography.bodySmall,
                                        color = Gray400
                                    )
                                }
                            }
                            Icon(
                                Icons.Default.KeyboardArrowDown,
                                contentDescription = null,
                                tint = Color.White
                            )
                        }

                        DropdownMenu(
                            expanded = showDropdown,
                            onDismissRequest = { showDropdown = false },
                            modifier = Modifier
                                .fillMaxWidth(0.9f)
                                .background(SurfaceDark)
                        ) {
                            state.commodities.forEach { commodity ->
                                DropdownMenuItem(
                                    text = {
                                        Row(
                                            modifier = Modifier.fillMaxWidth(),
                                            horizontalArrangement = Arrangement.SpaceBetween
                                        ) {
                                            Column {
                                                Text(
                                                    text = commodity.symbol,
                                                    color = Color.White,
                                                    fontWeight = FontWeight.Bold
                                                )
                                                Text(
                                                    text = commodity.name,
                                                    color = Gray400,
                                                    style = MaterialTheme.typography.bodySmall
                                                )
                                            }
                                            Text(
                                                text = currencyFormatter.format(commodity.current_price),
                                                color = NeonGreen,
                                                fontWeight = FontWeight.Bold
                                            )
                                        }
                                    },
                                    onClick = {
                                        onCommoditySelect(commodity)
                                        showDropdown = false
                                    }
                                )
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(16.dp))

                    // Current Price Display
                    state.selectedCommodity?.let { commodity ->
                        Card(
                            modifier = Modifier.fillMaxWidth(),
                            colors = CardDefaults.cardColors(
                                containerColor = SurfaceDark.copy(alpha = 0.7f)
                            ),
                            shape = RoundedCornerShape(20.dp)
                        ) {
                            Box {
                                // Electric green glow
                                Box(
                                    modifier = Modifier
                                        .size(300.dp)
                                        .align(Alignment.TopEnd)
                                        .offset(x = 150.dp, y = (-150).dp)
                                        .background(
                                            Brush.radialGradient(
                                                colors = listOf(
                                                    NeonGreen.copy(alpha = 0.3f),
                                                    Color.Transparent
                                                )
                                            )
                                        )
                                )

                                Column(
                                    modifier = Modifier.padding(20.dp),
                                    horizontalAlignment = Alignment.CenterHorizontally
                                ) {
                                    Text(
                                        text = "Current Price",
                                        style = MaterialTheme.typography.labelLarge,
                                        color = Gray400
                                    )
                                    Text(
                                        text = currencyFormatter.format(commodity.current_price),
                                        style = MaterialTheme.typography.displayLarge,
                                        fontWeight = FontWeight.Bold,
                                        color = NeonGreen
                                    )

                                    val isPositive = (commodity.price_change_24h ?: 0.0) >= 0
                                    val priceChangeColor by animateColorAsState(
                                        targetValue = if (isPositive) ProfitGreen else LossRed
                                    )

                                    Row(
                                        verticalAlignment = Alignment.CenterVertically,
                                        horizontalArrangement = Arrangement.Center
                                    ) {
                                        Icon(
                                            if (isPositive) Icons.Default.TrendingUp else Icons.Default.TrendingDown,
                                            contentDescription = null,
                                            tint = priceChangeColor,
                                            modifier = Modifier.size(20.dp)
                                        )
                                        Spacer(modifier = Modifier.width(4.dp))
                                        Text(
                                            text = "${if (isPositive) "+" else ""}${String.format("%.2f", commodity.price_change_24h ?: 0.0)}%",
                                            style = MaterialTheme.typography.titleMedium,
                                            fontWeight = FontWeight.Bold,
                                            color = priceChangeColor
                                        )
                                    }
                                }
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(24.dp))

                    // Timeframe Selector
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceEvenly
                    ) {
                        listOf("1H", "1D", "1W", "1M", "3M", "1Y").forEach { timeframe ->
                            val isSelected = state.timeframe == timeframe
                            FilterChip(
                                selected = isSelected,
                                onClick = { onTimeframeSelect(timeframe) },
                                label = {
                                    Text(
                                        text = timeframe,
                                        fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal
                                    )
                                },
                                colors = FilterChipDefaults.filterChipColors(
                                    containerColor = SurfaceDark,
                                    selectedContainerColor = NeonGreen,
                                    labelColor = Gray400,
                                    selectedLabelColor = Color.Black
                                ),
                                border = FilterChipDefaults.filterChipBorder(
                                    borderColor = if (isSelected) NeonGreen else Gray600,
                                    selectedBorderColor = NeonGreen
                                )
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(24.dp))

                    // Price Chart
                    Card(
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(300.dp),
                        colors = CardDefaults.cardColors(containerColor = SurfaceDark),
                        shape = RoundedCornerShape(20.dp)
                    ) {
                        Box(modifier = Modifier.fillMaxSize()) {
                            if (state.isLoading) {
                                CircularProgressIndicator(
                                    modifier = Modifier.align(Alignment.Center),
                                    color = NeonGreen
                                )
                            } else if (state.priceHistory.isNotEmpty()) {
                                PriceChart(
                                    priceHistory = state.priceHistory,
                                    modifier = Modifier
                                        .fillMaxSize()
                                        .padding(16.dp)
                                )
                            } else {
                                Text(
                                    text = "No price data available",
                                    modifier = Modifier.align(Alignment.Center),
                                    color = Gray400
                                )
                            }
                        }
                    }

                    Spacer(modifier = Modifier.weight(1f))

                    // Action Buttons
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        Button(
                            onClick = onBuyClick,
                            modifier = Modifier
                                .weight(1f)
                                .height(56.dp),
                            colors = ButtonDefaults.buttonColors(containerColor = Color.Transparent),
                            shape = RoundedCornerShape(12.dp)
                        ) {
                            Box(
                                modifier = Modifier
                                    .fillMaxSize()
                                    .background(
                                        Brush.horizontalGradient(
                                            colors = listOf(ProfitGreen, NeonGreen)
                                        ),
                                        shape = RoundedCornerShape(12.dp)
                                    ),
                                contentAlignment = Alignment.Center
                            ) {
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Icon(
                                        Icons.Default.TrendingUp,
                                        contentDescription = null,
                                        tint = Color.White
                                    )
                                    Spacer(modifier = Modifier.width(8.dp))
                                    Text(
                                        text = "BUY",
                                        style = MaterialTheme.typography.titleMedium,
                                        fontWeight = FontWeight.Bold,
                                        color = Color.White
                                    )
                                }
                            }
                        }

                        Button(
                            onClick = onBuyClick, // Will update when implementing sell
                            modifier = Modifier
                                .weight(1f)
                                .height(56.dp),
                            colors = ButtonDefaults.buttonColors(containerColor = Color.Transparent),
                            shape = RoundedCornerShape(12.dp)
                        ) {
                            Box(
                                modifier = Modifier
                                    .fillMaxSize()
                                    .background(
                                        Brush.horizontalGradient(
                                            colors = listOf(LossRed, NeonRed)
                                        ),
                                        shape = RoundedCornerShape(12.dp)
                                    ),
                                contentAlignment = Alignment.Center
                            ) {
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Icon(
                                        Icons.Default.TrendingDown,
                                        contentDescription = null,
                                        tint = Color.White
                                    )
                                    Spacer(modifier = Modifier.width(8.dp))
                                    Text(
                                        text = "SELL",
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
    }
}

@Composable
fun PriceChart(
    priceHistory: List<PriceHistory>,
    modifier: Modifier = Modifier
) {
    if (priceHistory.isEmpty()) return

    val prices = priceHistory.map { it.price.toFloat() }
    val maxPrice = prices.maxOrNull() ?: 0f
    val minPrice = prices.minOrNull() ?: 0f
    val priceRange = maxPrice - minPrice

    Canvas(modifier = modifier) {
        val width = size.width
        val height = size.height
        val stepX = width / (prices.size - 1).coerceAtLeast(1)

        // Draw gradient fill
        val path = Path().apply {
            prices.forEachIndexed { index, price ->
                val x = index * stepX
                val y = height - ((price - minPrice) / priceRange) * height

                if (index == 0) {
                    moveTo(x, y)
                } else {
                    lineTo(x, y)
                }
            }
            lineTo(width, height)
            lineTo(0f, height)
            close()
        }

        drawPath(
            path = path,
            brush = Brush.verticalGradient(
                colors = listOf(
                    NeonGreen.copy(alpha = 0.3f),
                    Color.Transparent
                )
            )
        )

        // Draw line
        val linePath = Path().apply {
            prices.forEachIndexed { index, price ->
                val x = index * stepX
                val y = height - ((price - minPrice) / priceRange) * height

                if (index == 0) {
                    moveTo(x, y)
                } else {
                    lineTo(x, y)
                }
            }
        }

        drawPath(
            path = linePath,
            color = NeonGreen,
            style = Stroke(width = 4f, cap = StrokeCap.Round)
        )

        // Draw data points
        prices.forEachIndexed { index, price ->
            val x = index * stepX
            val y = height - ((price - minPrice) / priceRange) * height

            drawCircle(
                color = NeonGreen,
                radius = 6f,
                center = Offset(x, y)
            )
            drawCircle(
                color = Color.White,
                radius = 3f,
                center = Offset(x, y)
            )
        }
    }
}
