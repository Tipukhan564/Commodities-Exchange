package com.commodityx.ui.watchlist

import android.content.Intent
import android.os.Bundle
import android.widget.Toast
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
import com.commodityx.data.Commodity
import com.commodityx.ui.charts.ChartsActivity
import com.commodityx.ui.theme.*
import com.commodityx.ui.trading.TradingActivity
import com.commodityx.viewmodel.WatchlistViewModel
import java.text.NumberFormat
import java.util.*

class WatchlistActivity : ComponentActivity() {

    private val viewModel: WatchlistViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        setContent {
            CommodityXTheme {
                val state by viewModel.state.collectAsState()

                LaunchedEffect(Unit) {
                    viewModel.loadWatchlist()
                }

                WatchlistScreen(
                    state = state,
                    onRefresh = { viewModel.loadWatchlist() },
                    onRemove = { commodityId ->
                        viewModel.removeFromWatchlist(
                            commodityId = commodityId,
                            onSuccess = {
                                Toast.makeText(this, "Removed from watchlist", Toast.LENGTH_SHORT).show()
                            },
                            onError = { error ->
                                Toast.makeText(this, error, Toast.LENGTH_SHORT).show()
                            }
                        )
                    },
                    onViewChart = { commodity ->
                        val intent = Intent(this, ChartsActivity::class.java).apply {
                            putExtra("commodity", commodity)
                        }
                        startActivity(intent)
                    },
                    onTrade = { commodity ->
                        val intent = Intent(this, TradingActivity::class.java).apply {
                            putExtra("commodity", commodity)
                        }
                        startActivity(intent)
                    },
                    onBack = { finish() }
                )
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun WatchlistScreen(
    state: com.commodityx.data.WatchlistState,
    onRefresh: () -> Unit,
    onRemove: (Int) -> Unit,
    onViewChart: (Commodity) -> Unit,
    onTrade: (Commodity) -> Unit,
    onBack: () -> Unit
) {
    val currencyFormatter = remember {
        NumberFormat.getCurrencyInstance(Locale.US).apply {
            maximumFractionDigits = 2
            minimumFractionDigits = 2
        }
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Watchlist") },
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
            if (state.isLoading) {
                CircularProgressIndicator(
                    modifier = Modifier.align(Alignment.Center),
                    color = NeonCyan
                )
            } else if (state.watchlist.isEmpty()) {
                // Empty State
                Column(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(32.dp),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(
                        Icons.Default.StarOutline,
                        contentDescription = null,
                        modifier = Modifier.size(120.dp),
                        tint = Gray600
                    )
                    Spacer(modifier = Modifier.height(24.dp))
                    Text(
                        text = "Your watchlist is empty",
                        style = MaterialTheme.typography.headlineSmall,
                        fontWeight = FontWeight.Bold,
                        color = Color.White
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        text = "Add commodities to keep track of their prices",
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
                    Text(
                        text = "${state.watchlist.size} ${if (state.watchlist.size == 1) "Commodity" else "Commodities"}",
                        style = MaterialTheme.typography.titleMedium,
                        color = Gray400
                    )

                    Spacer(modifier = Modifier.height(16.dp))

                    // Watchlist Items
                    LazyColumn(
                        verticalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        items(state.watchlist) { commodity ->
                            WatchlistItemCard(
                                commodity = commodity,
                                currencyFormatter = currencyFormatter,
                                onRemove = { onRemove(commodity.id) },
                                onViewChart = { onViewChart(commodity) },
                                onTrade = { onTrade(commodity) }
                            )
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun WatchlistItemCard(
    commodity: Commodity,
    currencyFormatter: NumberFormat,
    onRemove: () -> Unit,
    onViewChart: () -> Unit,
    onTrade: () -> Unit
) {
    var showMenu by remember { mutableStateOf(false) }
    val isPositive = (commodity.price_change_24h ?: 0.0) >= 0
    val priceChangeColor by animateColorAsState(
        targetValue = if (isPositive) ProfitGreen else LossRed
    )

    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(containerColor = SurfaceDark),
        shape = RoundedCornerShape(16.dp)
    ) {
        Box {
            // Glow effect based on price change
            Box(
                modifier = Modifier
                    .size(200.dp)
                    .align(Alignment.TopEnd)
                    .offset(x = 100.dp, y = (-100).dp)
                    .background(
                        Brush.radialGradient(
                            colors = listOf(
                                priceChangeColor.copy(alpha = 0.15f),
                                Color.Transparent
                            )
                        )
                    )
            )

            Column(
                modifier = Modifier.padding(16.dp)
            ) {
                // Header: Symbol and Actions
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(
                            Icons.Default.Star,
                            contentDescription = null,
                            tint = NeonCyan,
                            modifier = Modifier.size(28.dp)
                        )
                        Spacer(modifier = Modifier.width(12.dp))
                        Column {
                            Text(
                                text = commodity.symbol,
                                style = MaterialTheme.typography.titleLarge,
                                fontWeight = FontWeight.Bold,
                                color = Color.White
                            )
                            Text(
                                text = commodity.name,
                                style = MaterialTheme.typography.bodySmall,
                                color = Gray400
                            )
                        }
                    }

                    Box {
                        IconButton(onClick = { showMenu = true }) {
                            Icon(
                                Icons.Default.MoreVert,
                                contentDescription = "More",
                                tint = Color.White
                            )
                        }

                        DropdownMenu(
                            expanded = showMenu,
                            onDismissRequest = { showMenu = false },
                            modifier = Modifier.background(SurfaceDark)
                        ) {
                            DropdownMenuItem(
                                text = { Text("View Chart", color = Color.White) },
                                onClick = {
                                    showMenu = false
                                    onViewChart()
                                },
                                leadingIcon = {
                                    Icon(
                                        Icons.Default.ShowChart,
                                        contentDescription = null,
                                        tint = NeonCyan
                                    )
                                }
                            )
                            DropdownMenuItem(
                                text = { Text("Remove", color = LossRed) },
                                onClick = {
                                    showMenu = false
                                    onRemove()
                                },
                                leadingIcon = {
                                    Icon(
                                        Icons.Default.Delete,
                                        contentDescription = null,
                                        tint = LossRed
                                    )
                                }
                            )
                        }
                    }
                }

                Spacer(modifier = Modifier.height(16.dp))

                // Price Display
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text(
                            text = "Current Price",
                            style = MaterialTheme.typography.labelSmall,
                            color = Gray500
                        )
                        Text(
                            text = currencyFormatter.format(commodity.current_price),
                            style = MaterialTheme.typography.headlineMedium,
                            fontWeight = FontWeight.Bold,
                            color = NeonCyan
                        )
                    }

                    Surface(
                        color = priceChangeColor.copy(alpha = 0.15f),
                        shape = RoundedCornerShape(12.dp)
                    ) {
                        Row(
                            modifier = Modifier.padding(horizontal = 12.dp, vertical = 8.dp),
                            verticalAlignment = Alignment.CenterVertically
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

                // 24h Stats
                commodity.high_24h?.let { high ->
                    commodity.low_24h?.let { low ->
                        Spacer(modifier = Modifier.height(12.dp))
                        Divider(color = Gray600)
                        Spacer(modifier = Modifier.height(12.dp))

                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceAround
                        ) {
                            StatItem("24h High", currencyFormatter.format(high))
                            StatItem("24h Low", currencyFormatter.format(low))
                            commodity.volume_24h?.let { volume ->
                                StatItem("24h Volume", String.format("%.2f", volume))
                            }
                        }
                    }
                }

                Spacer(modifier = Modifier.height(16.dp))

                // Action Buttons
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    OutlinedButton(
                        onClick = onViewChart,
                        modifier = Modifier.weight(1f),
                        colors = ButtonDefaults.outlinedButtonColors(
                            contentColor = NeonCyan
                        ),
                        shape = RoundedCornerShape(8.dp)
                    ) {
                        Icon(
                            Icons.Default.ShowChart,
                            contentDescription = null,
                            modifier = Modifier.size(18.dp)
                        )
                        Spacer(modifier = Modifier.width(4.dp))
                        Text("Chart")
                    }

                    Button(
                        onClick = onTrade,
                        modifier = Modifier.weight(1f),
                        colors = ButtonDefaults.buttonColors(containerColor = Color.Transparent),
                        shape = RoundedCornerShape(8.dp)
                    ) {
                        Box(
                            modifier = Modifier
                                .fillMaxSize()
                                .background(
                                    Brush.horizontalGradient(
                                        colors = listOf(ProfitGreen, NeonGreen)
                                    ),
                                    shape = RoundedCornerShape(8.dp)
                                ),
                            contentAlignment = Alignment.Center
                        ) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Icon(
                                    Icons.Default.TrendingUp,
                                    contentDescription = null,
                                    tint = Color.White,
                                    modifier = Modifier.size(18.dp)
                                )
                                Spacer(modifier = Modifier.width(4.dp))
                                Text(
                                    text = "Trade",
                                    color = Color.White,
                                    fontWeight = FontWeight.Bold
                                )
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun StatItem(label: String, value: String) {
    Column(horizontalAlignment = Alignment.CenterHorizontally) {
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
