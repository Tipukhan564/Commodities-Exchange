package com.commodityx.ui.dashboard

import android.content.Intent
import android.os.Bundle
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.viewModels
import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.commodityx.data.Commodity
import com.commodityx.ui.charts.ChartsActivity
import com.commodityx.ui.orders.OrdersActivity
import com.commodityx.ui.portfolio.PortfolioActivity
import com.commodityx.ui.trading.TradingActivity
import com.commodityx.ui.theme.*
import com.commodityx.viewmodel.DashboardViewModel
import java.text.NumberFormat
import java.util.*

class DashboardActivity : ComponentActivity() {

    private val viewModel: DashboardViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        setContent {
            CommodityXTheme {
                val state by viewModel.state.collectAsState()

                LaunchedEffect(Unit) {
                    viewModel.loadDashboardData()
                }

                DashboardScreen(
                    state = state,
                    onNavigateToPortfolio = {
                        startActivity(Intent(this, PortfolioActivity::class.java))
                    },
                    onNavigateToCharts = { commodity ->
                        val intent = Intent(this, ChartsActivity::class.java)
                        intent.putExtra("commodity", commodity)
                        startActivity(intent)
                    },
                    onNavigateToTrading = { commodity ->
                        val intent = Intent(this, TradingActivity::class.java)
                        intent.putExtra("commodity", commodity)
                        startActivity(intent)
                    },
                    onNavigateToOrders = {
                        startActivity(Intent(this, OrdersActivity::class.java))
                    },
                    onRefresh = { viewModel.loadDashboardData() }
                )
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DashboardScreen(
    state: com.commodityx.data.DashboardState,
    onNavigateToPortfolio: () -> Unit,
    onNavigateToCharts: (Commodity) -> Unit,
    onNavigateToTrading: (Commodity) -> Unit,
    onNavigateToOrders: () -> Unit,
    onRefresh: () -> Unit
) {
    val currencyFormatter = remember {
        NumberFormat.getCurrencyInstance(Locale.US).apply {
            maximumFractionDigits = 2
            minimumFractionDigits = 2
        }
    }

    Scaffold(
        bottomBar = {
            BottomNavigationBar(
                selectedIndex = 0,
                onNavigateToPortfolio = onNavigateToPortfolio,
                onNavigateToOrders = onNavigateToOrders
            )
        }
    ) { paddingValues ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(CyberDark)
                .padding(paddingValues)
        ) {
            // Background gradient
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(300.dp)
                    .align(Alignment.TopCenter)
                    .background(
                        Brush.radialGradient(
                            colors = listOf(
                                NeonCyan.copy(alpha = 0.08f),
                                Color.Transparent
                            )
                        )
                    )
            )

            if (state.isLoading) {
                CircularProgressIndicator(
                    modifier = Modifier.align(Alignment.Center),
                    color = NeonCyan
                )
            } else {
                LazyColumn(
                    modifier = Modifier.fillMaxSize(),
                    contentPadding = PaddingValues(16.dp)
                ) {
                    // Header
                    item {
                        DashboardHeader(
                            username = state.user?.username ?: "User",
                            onRefresh = onRefresh
                        )
                        Spacer(modifier = Modifier.height(16.dp))
                    }

                    // Portfolio Value Card
                    item {
                        PortfolioValueCard(
                            totalValue = state.totalValue,
                            totalPnL = state.totalPnL,
                            balance = state.user?.balance ?: 0.0,
                            currencyFormatter = currencyFormatter,
                            onClick = onNavigateToPortfolio
                        )
                        Spacer(modifier = Modifier.height(24.dp))
                    }

                    // Live Markets Title
                    item {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Icon(
                                    imageVector = Icons.Default.ShowChart,
                                    contentDescription = null,
                                    tint = NeonCyan,
                                    modifier = Modifier.size(24.dp)
                                )
                                Spacer(modifier = Modifier.width(8.dp))
                                Text(
                                    text = "Live Markets",
                                    style = MaterialTheme.typography.headlineSmall,
                                    fontWeight = FontWeight.Bold,
                                    color = Color.White
                                )
                            }

                            // Live indicator
                            LiveIndicator()
                        }
                        Spacer(modifier = Modifier.height(16.dp))
                    }

                    // Commodity Cards
                    items(state.commodities) { commodity ->
                        CommodityCard(
                            commodity = commodity,
                            currencyFormatter = currencyFormatter,
                            onCardClick = { onNavigateToCharts(commodity) },
                            onBuyClick = { onNavigateToTrading(commodity) },
                            onSellClick = { onNavigateToTrading(commodity) }
                        )
                        Spacer(modifier = Modifier.height(12.dp))
                    }

                    item {
                        Spacer(modifier = Modifier.height(80.dp))
                    }
                }
            }
        }
    }
}

@Composable
fun DashboardHeader(
    username: String,
    onRefresh: () -> Unit
) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Box(
                modifier = Modifier
                    .size(48.dp)
                    .clip(CircleShape)
                    .background(
                        Brush.linearGradient(
                            colors = listOf(NeonCyan, NeonGreen)
                        )
                    ),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = Icons.Default.Person,
                    contentDescription = null,
                    tint = CyberDark,
                    modifier = Modifier.size(28.dp)
                )
            }

            Spacer(modifier = Modifier.width(12.dp))

            Column {
                Text(
                    text = "Welcome back",
                    style = MaterialTheme.typography.bodySmall,
                    color = Gray400
                )
                Text(
                    text = username,
                    style = MaterialTheme.typography.titleLarge,
                    fontWeight = FontWeight.Bold,
                    color = Color.White
                )
            }
        }

        IconButton(
            onClick = onRefresh,
            modifier = Modifier
                .size(40.dp)
                .background(SurfaceDark, CircleShape)
        ) {
            Icon(
                imageVector = Icons.Default.Refresh,
                contentDescription = "Refresh",
                tint = Color.White
            )
        }
    }
}

@Composable
fun PortfolioValueCard(
    totalValue: Double,
    totalPnL: Double,
    balance: Double,
    currencyFormatter: NumberFormat,
    onClick: () -> Unit
) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .clickable(onClick = onClick),
        colors = CardDefaults.cardColors(
            containerColor = SurfaceDark.copy(alpha = 0.7f)
        ),
        shape = RoundedCornerShape(20.dp)
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
                                NeonCyan.copy(alpha = 0.2f),
                                Color.Transparent
                            )
                        )
                    )
            )

            Column(
                modifier = Modifier.padding(20.dp)
            ) {
                Text(
                    text = "Portfolio Value",
                    style = MaterialTheme.typography.bodyMedium,
                    color = Gray400
                )

                Spacer(modifier = Modifier.height(8.dp))

                Text(
                    text = currencyFormatter.format(totalValue),
                    style = MaterialTheme.typography.displayMedium,
                    fontWeight = FontWeight.Bold,
                    color = Color.White
                )

                Spacer(modifier = Modifier.height(8.dp))

                PnLBadge(value = totalPnL)

                Spacer(modifier = Modifier.height(16.dp))

                // Stats row
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(top = 16.dp),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    StatItem("Balance", currencyFormatter.format(balance))
                    StatItem("Holdings", "${totalValue.toInt()}")
                }
            }
        }
    }
}

@Composable
fun StatItem(label: String, value: String) {
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
fun LiveIndicator() {
    Row(verticalAlignment = Alignment.CenterVertically) {
        Box(
            modifier = Modifier
                .size(8.dp)
                .clip(CircleShape)
                .background(NeonGreen)
        )
        Spacer(modifier = Modifier.width(6.dp))
        Text(
            text = "LIVE",
            style = MaterialTheme.typography.labelSmall,
            color = NeonGreen,
            fontWeight = FontWeight.Bold
        )
    }
}

@Composable
fun CommodityCard(
    commodity: Commodity,
    currencyFormatter: NumberFormat,
    onCardClick: () -> Unit,
    onBuyClick: () -> Unit,
    onSellClick: () -> Unit
) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .clickable(onClick = onCardClick),
        colors = CardDefaults.cardColors(
            containerColor = SurfaceDark.copy(alpha = 0.7f)
        ),
        shape = RoundedCornerShape(16.dp)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(12.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            // Left: Symbol and name
            Row(
                modifier = Modifier.weight(1f),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Box(
                    modifier = Modifier
                        .size(40.dp)
                        .clip(CircleShape)
                        .background(SurfaceHighlight),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        imageVector = Icons.Default.CurrencyBitcoin,
                        contentDescription = null,
                        tint = NeonCyan,
                        modifier = Modifier.size(24.dp)
                    )
                }

                Spacer(modifier = Modifier.width(12.dp))

                Column {
                    Text(
                        text = commodity.symbol,
                        style = MaterialTheme.typography.titleMedium,
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

            // Right: Price and buttons
            Row(
                horizontalArrangement = Arrangement.End,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column(horizontalAlignment = Alignment.End) {
                    Text(
                        text = currencyFormatter.format(commodity.current_price),
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold,
                        color = Color.White
                    )
                    PriceChangeBadge(change = commodity.price_change_24h)
                }

                Spacer(modifier = Modifier.width(8.dp))

                // Buy/Sell buttons
                Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
                    Button(
                        onClick = onBuyClick,
                        modifier = Modifier
                            .width(70.dp)
                            .height(32.dp),
                        colors = ButtonDefaults.buttonColors(
                            containerColor = NeonCyan.copy(alpha = 0.15f),
                            contentColor = NeonCyan
                        ),
                        contentPadding = PaddingValues(0.dp),
                        shape = RoundedCornerShape(8.dp)
                    ) {
                        Text("BUY", style = MaterialTheme.typography.labelSmall)
                    }

                    Button(
                        onClick = onSellClick,
                        modifier = Modifier
                            .width(70.dp)
                            .height(32.dp),
                        colors = ButtonDefaults.buttonColors(
                            containerColor = NeonRed.copy(alpha = 0.15f),
                            contentColor = NeonRed
                        ),
                        contentPadding = PaddingValues(0.dp),
                        shape = RoundedCornerShape(8.dp)
                    ) {
                        Text("SELL", style = MaterialTheme.typography.labelSmall)
                    }
                }
            }
        }
    }
}

@Composable
fun PnLBadge(value: Double) {
    val isPositive = value >= 0
    val color = if (isPositive) ProfitGreen else LossRed

    Surface(
        color = color.copy(alpha = 0.15f),
        shape = RoundedCornerShape(8.dp),
        border = androidx.compose.foundation.BorderStroke(1.dp, color.copy(alpha = 0.3f))
    ) {
        Row(
            modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Icon(
                imageVector = if (isPositive) Icons.Default.TrendingUp else Icons.Default.TrendingDown,
                contentDescription = null,
                tint = color,
                modifier = Modifier.size(16.dp)
            )
            Spacer(modifier = Modifier.width(4.dp))
            Text(
                text = "${if (isPositive) "+" else ""}${String.format("%.2f", value)}%",
                color = color,
                style = MaterialTheme.typography.labelMedium,
                fontWeight = FontWeight.Bold
            )
        }
    }
}

@Composable
fun PriceChangeBadge(change: Double) {
    val isPositive = change >= 0
    val color = if (isPositive) ProfitGreen else LossRed

    Text(
        text = "${if (isPositive) "+" else ""}${String.format("%.2f", change)}%",
        color = color,
        style = MaterialTheme.typography.labelSmall,
        fontWeight = FontWeight.SemiBold
    )
}

@Composable
fun BottomNavigationBar(
    selectedIndex: Int,
    onNavigateToPortfolio: () -> Unit,
    onNavigateToOrders: () -> Unit
) {
    NavigationBar(
        containerColor = SurfaceDark.copy(alpha = 0.95f),
        tonalElevation = 0.dp
    ) {
        NavigationBarItem(
            icon = { Icon(Icons.Default.Dashboard, contentDescription = "Dashboard") },
            label = { Text("Dashboard") },
            selected = selectedIndex == 0,
            onClick = { },
            colors = NavigationBarItemDefaults.colors(
                selectedIconColor = NeonCyan,
                selectedTextColor = NeonCyan,
                indicatorColor = NeonCyan.copy(alpha = 0.2f),
                unselectedIconColor = Gray400,
                unselectedTextColor = Gray400
            )
        )
        NavigationBarItem(
            icon = { Icon(Icons.Default.PieChart, contentDescription = "Portfolio") },
            label = { Text("Portfolio") },
            selected = selectedIndex == 1,
            onClick = onNavigateToPortfolio,
            colors = NavigationBarItemDefaults.colors(
                selectedIconColor = NeonCyan,
                selectedTextColor = NeonCyan,
                indicatorColor = NeonCyan.copy(alpha = 0.2f),
                unselectedIconColor = Gray400,
                unselectedTextColor = Gray400
            )
        )
        NavigationBarItem(
            icon = { Icon(Icons.Default.Receipt, contentDescription = "Orders") },
            label = { Text("Orders") },
            selected = selectedIndex == 2,
            onClick = onNavigateToOrders,
            colors = NavigationBarItemDefaults.colors(
                selectedIconColor = NeonCyan,
                selectedTextColor = NeonCyan,
                indicatorColor = NeonCyan.copy(alpha = 0.2f),
                unselectedIconColor = Gray400,
                unselectedTextColor = Gray400
            )
        )
    }
}
