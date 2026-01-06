package com.commodityx.ui.portfolio

import android.content.Intent
import android.os.Bundle
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
import com.commodityx.data.Portfolio
import com.commodityx.ui.dashboard.DashboardActivity
import com.commodityx.ui.orders.OrdersActivity
import com.commodityx.ui.theme.*
import com.commodityx.viewmodel.PortfolioViewModel
import java.text.NumberFormat
import java.util.*

class PortfolioActivity : ComponentActivity() {

    private val viewModel: PortfolioViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        setContent {
            CommodityXTheme {
                val state by viewModel.state.collectAsState()

                LaunchedEffect(Unit) {
                    viewModel.loadPortfolio()
                }

                PortfolioScreen(
                    state = state,
                    onNavigateToDashboard = {
                        startActivity(Intent(this, DashboardActivity::class.java))
                        finish()
                    },
                    onNavigateToOrders = {
                        startActivity(Intent(this, OrdersActivity::class.java))
                    },
                    onRefresh = { viewModel.loadPortfolio() }
                )
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun PortfolioScreen(
    state: com.commodityx.data.PortfolioState,
    onNavigateToDashboard: () -> Unit,
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
                selectedIndex = 1,
                onNavigateToDashboard = onNavigateToDashboard,
                onNavigateToOrders = onNavigateToOrders
            )
        }
    ) { paddingValues ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(Color(0xFF050806)) // bg-black from portfolio theme
                .padding(paddingValues)
        ) {
            // Background glow - neon green
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(300.dp)
                    .align(Alignment.TopCenter)
                    .background(
                        Brush.radialGradient(
                            colors = listOf(
                                NeonGreen.copy(alpha = 0.08f),
                                Color.Transparent
                            )
                        )
                    )
            )

            if (state.isLoading) {
                CircularProgressIndicator(
                    modifier = Modifier.align(Alignment.Center),
                    color = NeonGreen
                )
            } else {
                LazyColumn(
                    modifier = Modifier.fillMaxSize(),
                    contentPadding = PaddingValues(16.dp)
                ) {
                    // Header
                    item {
                        PortfolioHeader(
                            onRefresh = onRefresh
                        )
                        Spacer(modifier = Modifier.height(24.dp))
                    }

                    // Total Value Section
                    item {
                        TotalValueCard(
                            totalValue = state.totalValue,
                            totalPnL = state.totalPnL,
                            currencyFormatter = currencyFormatter
                        )
                        Spacer(modifier = Modifier.height(24.dp))
                    }

                    // Stats Summary
                    item {
                        StatsRow(
                            totalValue = state.totalValue,
                            totalInvestment = state.totalInvestment,
                            totalPnL = state.totalPnL,
                            currencyFormatter = currencyFormatter
                        )
                        Spacer(modifier = Modifier.height(24.dp))
                    }

                    // Holdings Title
                    item {
                        Text(
                            text = "Holdings",
                            style = MaterialTheme.typography.headlineSmall,
                            fontWeight = FontWeight.Bold,
                            color = Color.White
                        )
                        Spacer(modifier = Modifier.height(16.dp))
                    }

                    // Holdings List
                    if (state.portfolio.isEmpty()) {
                        item {
                            EmptyPortfolioState()
                        }
                    } else {
                        items(state.portfolio) { holding ->
                            HoldingCard(
                                holding = holding,
                                currencyFormatter = currencyFormatter
                            )
                            Spacer(modifier = Modifier.height(12.dp))
                        }
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
fun PortfolioHeader(onRefresh: () -> Unit) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Column {
            Text(
                text = "Portfolio",
                style = MaterialTheme.typography.displaySmall,
                fontWeight = FontWeight.Bold,
                color = Color.White
            )
            Text(
                text = "TRACK YOUR HOLDINGS",
                style = MaterialTheme.typography.labelSmall,
                color = Gray400,
                letterSpacing = 0.2.dp.value.toInt().toChar().toInt().dp.value.sp
            )
        }

        IconButton(
            onClick = onRefresh,
            modifier = Modifier
                .size(40.dp)
                .background(Color(0xFF0F1613), CircleShape)
        ) {
            Icon(
                imageVector = Icons.Default.Refresh,
                contentDescription = "Refresh",
                tint = NeonGreen
            )
        }
    }
}

@Composable
fun TotalValueCard(
    totalValue: Double,
    totalPnL: Double,
    currencyFormatter: NumberFormat
) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(
            containerColor = Color(0xFF0F1613).copy(alpha = 0.6f)
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
                                NeonGreen.copy(alpha = 0.2f),
                                Color.Transparent
                            )
                        )
                    )
            )

            Column(
                modifier = Modifier.padding(24.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Text(
                    text = "TOTAL ASSET VALUE",
                    style = MaterialTheme.typography.labelSmall,
                    color = Gray400,
                    fontWeight = FontWeight.Bold,
                    letterSpacing = 0.2.dp.value.toInt().toChar().toInt().dp.value.sp
                )

                Spacer(modifier = Modifier.height(12.dp))

                Text(
                    text = currencyFormatter.format(totalValue),
                    style = MaterialTheme.typography.displayLarge,
                    fontWeight = FontWeight.Bold,
                    color = Color.White
                )

                Spacer(modifier = Modifier.height(12.dp))

                // P&L Badge
                val isPositive = totalPnL >= 0
                Surface(
                    color = if (isPositive) NeonGreen.copy(alpha = 0.15f) else NeonRed.copy(alpha = 0.15f),
                    shape = RoundedCornerShape(999.dp),
                    border = androidx.compose.foundation.BorderStroke(
                        1.dp,
                        if (isPositive) NeonGreen.copy(alpha = 0.3f) else NeonRed.copy(alpha = 0.3f)
                    )
                ) {
                    Row(
                        modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Icon(
                            imageVector = if (isPositive) Icons.Default.TrendingUp else Icons.Default.TrendingDown,
                            contentDescription = null,
                            tint = if (isPositive) NeonGreen else NeonRed,
                            modifier = Modifier.size(20.dp)
                        )
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(
                            text = "${if (isPositive) "+" else ""}${String.format("%.2f", totalPnL)}%",
                            color = if (isPositive) NeonGreen else NeonRed,
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Bold
                        )
                    }
                }
            }
        }
    }
}

@Composable
fun StatsRow(
    totalValue: Double,
    totalInvestment: Double,
    totalPnL: Double,
    currencyFormatter: NumberFormat
) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween
    ) {
        StatCard(
            label = "Total Value",
            value = currencyFormatter.format(totalValue),
            icon = Icons.Default.AccountBalance,
            color = NeonGreen
        )
        Spacer(modifier = Modifier.width(12.dp))
        StatCard(
            label = "Invested",
            value = currencyFormatter.format(totalInvestment),
            icon = Icons.Default.TrendingUp,
            color = NeonCyan
        )
        Spacer(modifier = Modifier.width(12.dp))
        StatCard(
            label = "P&L",
            value = "${if (totalPnL >= 0) "+" else ""}${String.format("%.2f", totalPnL)}%",
            icon = if (totalPnL >= 0) Icons.Default.ArrowUpward else Icons.Default.ArrowDownward,
            color = if (totalPnL >= 0) ProfitGreen else LossRed
        )
    }
}

@Composable
fun RowScope.StatCard(
    label: String,
    value: String,
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    color: Color
) {
    Card(
        modifier = Modifier.weight(1f),
        colors = CardDefaults.cardColors(
            containerColor = Color(0xFF0F1613).copy(alpha = 0.6f)
        ),
        shape = RoundedCornerShape(16.dp)
    ) {
        Column(
            modifier = Modifier.padding(12.dp)
        ) {
            Icon(
                imageVector = icon,
                contentDescription = null,
                tint = color,
                modifier = Modifier.size(20.dp)
            )
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = label,
                style = MaterialTheme.typography.labelSmall,
                color = Gray500
            )
            Spacer(modifier = Modifier.height(4.dp))
            Text(
                text = value,
                style = MaterialTheme.typography.titleSmall,
                fontWeight = FontWeight.Bold,
                color = Color.White
            )
        }
    }
}

@Composable
fun HoldingCard(
    holding: Portfolio,
    currencyFormatter: NumberFormat
) {
    val pnl = holding.pnl
    val isProfit = pnl >= 0

    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(
            containerColor = Color(0xFF0F1613).copy(alpha = 0.6f)
        ),
        shape = RoundedCornerShape(16.dp),
        border = androidx.compose.foundation.BorderStroke(
            width = if (isProfit) 4.dp else 4.dp,
            brush = Brush.horizontalGradient(
                colors = if (isProfit) {
                    listOf(NeonGreen.copy(alpha = 0.5f), Color.Transparent)
                } else {
                    listOf(NeonRed.copy(alpha = 0.5f), Color.Transparent)
                }
            )
        )
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            // Header
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Box(
                        modifier = Modifier
                            .size(40.dp)
                            .clip(CircleShape)
                            .background(Color(0xFF0A0F0D)),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = Icons.Default.ShowChart,
                            contentDescription = null,
                            tint = NeonGreen,
                            modifier = Modifier.size(24.dp)
                        )
                    }

                    Spacer(modifier = Modifier.width(12.dp))

                    Column {
                        Text(
                            text = holding.commodity_symbol ?: "",
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Bold,
                            color = Color.White
                        )
                        Text(
                            text = holding.commodity_name ?: "",
                            style = MaterialTheme.typography.bodySmall,
                            color = Gray400
                        )
                    }
                }

                Surface(
                    color = if (isProfit) ProfitGreen.copy(alpha = 0.15f) else LossRed.copy(alpha = 0.15f),
                    shape = RoundedCornerShape(8.dp)
                ) {
                    Text(
                        text = "${if (isProfit) "+" else ""}${String.format("%.2f", holding.pnlPercent)}%",
                        modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp),
                        color = if (isProfit) ProfitGreen else LossRed,
                        style = MaterialTheme.typography.labelMedium,
                        fontWeight = FontWeight.Bold
                    )
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Stats Grid
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                HoldingStatItem("Quantity", "${holding.quantity}")
                HoldingStatItem("Avg Price", currencyFormatter.format(holding.average_price))
            }

            Spacer(modifier = Modifier.height(12.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                HoldingStatItem("Current", currencyFormatter.format(holding.current_price))
                HoldingStatItem("Total Value", currencyFormatter.format(holding.currentValue))
            }

            Spacer(modifier = Modifier.height(16.dp))

            // P&L Section
            Divider(color = Gray600.copy(alpha = 0.3f))

            Spacer(modifier = Modifier.height(16.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "Profit/Loss",
                    style = MaterialTheme.typography.labelSmall,
                    color = Gray500
                )
                Text(
                    text = currencyFormatter.format(pnl),
                    style = MaterialTheme.typography.titleLarge,
                    fontWeight = FontWeight.Bold,
                    color = if (isProfit) ProfitGreen else LossRed
                )
            }
        }
    }
}

@Composable
fun HoldingStatItem(label: String, value: String) {
    Column {
        Text(
            text = label,
            style = MaterialTheme.typography.labelSmall,
            color = Gray500
        )
        Spacer(modifier = Modifier.height(4.dp))
        Text(
            text = value,
            style = MaterialTheme.typography.bodyMedium,
            fontWeight = FontWeight.SemiBold,
            color = Color.White
        )
    }
}

@Composable
fun EmptyPortfolioState() {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 48.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Box(
            modifier = Modifier
                .size(80.dp)
                .clip(RoundedCornerShape(20.dp))
                .background(
                    Brush.linearGradient(
                        colors = listOf(
                            NeonGreen.copy(alpha = 0.2f),
                            NeonCyan.copy(alpha = 0.2f)
                        )
                    )
                ),
            contentAlignment = Alignment.Center
        ) {
            Icon(
                imageVector = Icons.Default.Inbox,
                contentDescription = null,
                tint = Gray400,
                modifier = Modifier.size(40.dp)
            )
        }

        Spacer(modifier = Modifier.height(16.dp))

        Text(
            text = "No Holdings Yet",
            style = MaterialTheme.typography.titleLarge,
            fontWeight = FontWeight.Bold,
            color = Color.White
        )

        Spacer(modifier = Modifier.height(8.dp))

        Text(
            text = "Start trading to build your portfolio",
            style = MaterialTheme.typography.bodyMedium,
            color = Gray400
        )
    }
}

@Composable
fun BottomNavigationBar(
    selectedIndex: Int,
    onNavigateToDashboard: () -> Unit,
    onNavigateToOrders: () -> Unit
) {
    NavigationBar(
        containerColor = Color(0xFF0F1613).copy(alpha = 0.95f),
        tonalElevation = 0.dp
    ) {
        NavigationBarItem(
            icon = { Icon(Icons.Default.Dashboard, contentDescription = "Dashboard") },
            label = { Text("Dashboard") },
            selected = selectedIndex == 0,
            onClick = onNavigateToDashboard,
            colors = NavigationBarItemDefaults.colors(
                selectedIconColor = NeonGreen,
                selectedTextColor = NeonGreen,
                indicatorColor = NeonGreen.copy(alpha = 0.2f),
                unselectedIconColor = Gray400,
                unselectedTextColor = Gray400
            )
        )
        NavigationBarItem(
            icon = { Icon(Icons.Default.PieChart, contentDescription = "Portfolio") },
            label = { Text("Portfolio") },
            selected = selectedIndex == 1,
            onClick = { },
            colors = NavigationBarItemDefaults.colors(
                selectedIconColor = NeonGreen,
                selectedTextColor = NeonGreen,
                indicatorColor = NeonGreen.copy(alpha = 0.2f),
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
                selectedIconColor = NeonGreen,
                selectedTextColor = NeonGreen,
                indicatorColor = NeonGreen.copy(alpha = 0.2f),
                unselectedIconColor = Gray400,
                unselectedTextColor = Gray400
            )
        )
    }
}
