package com.commodityx.ui.profile

import android.content.Intent
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.viewModels
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
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
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.commodityx.ui.auth.LoginActivity
import com.commodityx.ui.theme.*
import com.commodityx.viewmodel.ProfileViewModel
import java.text.NumberFormat
import java.util.*

class ProfileActivity : ComponentActivity() {

    private val viewModel: ProfileViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        setContent {
            CommodityXTheme {
                val state by viewModel.state.collectAsState()

                LaunchedEffect(Unit) {
                    viewModel.loadProfile()
                }

                ProfileScreen(
                    state = state,
                    onLogout = {
                        viewModel.logout {
                            val intent = Intent(this, LoginActivity::class.java).apply {
                                flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
                            }
                            startActivity(intent)
                            finish()
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
fun ProfileScreen(
    state: com.commodityx.data.ProfileState,
    onLogout: () -> Unit,
    onBack: () -> Unit
) {
    var showLogoutDialog by remember { mutableStateOf(false) }

    val currencyFormatter = remember {
        NumberFormat.getCurrencyInstance(Locale.US).apply {
            maximumFractionDigits = 2
            minimumFractionDigits = 2
        }
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Profile & Settings") },
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
            if (state.isLoading) {
                CircularProgressIndicator(
                    modifier = Modifier.align(Alignment.Center),
                    color = NeonCyan
                )
            } else {
                LazyColumn(
                    modifier = Modifier.fillMaxSize(),
                    contentPadding = PaddingValues(16.dp),
                    verticalArrangement = Arrangement.spacedBy(16.dp)
                ) {
                    // Profile Header
                    item {
                        state.user?.let { user ->
                            Card(
                                modifier = Modifier.fillMaxWidth(),
                                colors = CardDefaults.cardColors(
                                    containerColor = SurfaceDark.copy(alpha = 0.7f)
                                ),
                                shape = RoundedCornerShape(20.dp)
                            ) {
                                Box {
                                    // Cyan glow
                                    Box(
                                        modifier = Modifier
                                            .size(300.dp)
                                            .align(Alignment.TopEnd)
                                            .offset(x = 150.dp, y = (-150).dp)
                                            .background(
                                                Brush.radialGradient(
                                                    colors = listOf(
                                                        NeonCyan.copy(alpha = 0.3f),
                                                        Color.Transparent
                                                    )
                                                )
                                            )
                                    )

                                    Column(
                                        modifier = Modifier
                                            .fillMaxWidth()
                                            .padding(24.dp),
                                        horizontalAlignment = Alignment.CenterHorizontally
                                    ) {
                                        // Avatar
                                        Box(
                                            modifier = Modifier
                                                .size(100.dp)
                                                .clip(CircleShape)
                                                .background(
                                                    Brush.linearGradient(
                                                        colors = listOf(NeonCyan, NeonPurple)
                                                    )
                                                ),
                                            contentAlignment = Alignment.Center
                                        ) {
                                            Text(
                                                text = user.username.firstOrNull()?.uppercase() ?: "U",
                                                style = MaterialTheme.typography.displayLarge,
                                                fontWeight = FontWeight.Bold,
                                                color = Color.White
                                            )
                                        }

                                        Spacer(modifier = Modifier.height(16.dp))

                                        Text(
                                            text = user.username,
                                            style = MaterialTheme.typography.headlineMedium,
                                            fontWeight = FontWeight.Bold,
                                            color = Color.White
                                        )

                                        Text(
                                            text = user.email,
                                            style = MaterialTheme.typography.bodyLarge,
                                            color = Gray400
                                        )

                                        user.full_name?.let { name ->
                                            Spacer(modifier = Modifier.height(4.dp))
                                            Text(
                                                text = name,
                                                style = MaterialTheme.typography.bodyMedium,
                                                color = Gray500
                                            )
                                        }

                                        Spacer(modifier = Modifier.height(24.dp))

                                        // Balance Card
                                        Surface(
                                            modifier = Modifier.fillMaxWidth(),
                                            color = NeonGreen.copy(alpha = 0.1f),
                                            shape = RoundedCornerShape(16.dp)
                                        ) {
                                            Column(
                                                modifier = Modifier.padding(16.dp),
                                                horizontalAlignment = Alignment.CenterHorizontally
                                            ) {
                                                Text(
                                                    text = "Account Balance",
                                                    style = MaterialTheme.typography.labelMedium,
                                                    color = Gray400
                                                )
                                                Spacer(modifier = Modifier.height(8.dp))
                                                Text(
                                                    text = currencyFormatter.format(user.balance),
                                                    style = MaterialTheme.typography.displaySmall,
                                                    fontWeight = FontWeight.Bold,
                                                    color = NeonGreen
                                                )
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }

                    // Account Section
                    item {
                        Text(
                            text = "Account",
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Bold,
                            color = Gray400,
                            modifier = Modifier.padding(horizontal = 8.dp)
                        )
                    }

                    item {
                        Card(
                            modifier = Modifier.fillMaxWidth(),
                            colors = CardDefaults.cardColors(containerColor = SurfaceDark),
                            shape = RoundedCornerShape(16.dp)
                        ) {
                            Column {
                                SettingsItem(
                                    icon = Icons.Default.Person,
                                    title = "Edit Profile",
                                    subtitle = "Update your personal information",
                                    onClick = { /* TODO: Navigate to edit profile */ }
                                )
                                Divider(color = Gray600, modifier = Modifier.padding(horizontal = 16.dp))
                                SettingsItem(
                                    icon = Icons.Default.AccountBalanceWallet,
                                    title = "Payment Methods",
                                    subtitle = "Manage your payment options",
                                    onClick = { /* TODO: Navigate to payment methods */ }
                                )
                                Divider(color = Gray600, modifier = Modifier.padding(horizontal = 16.dp))
                                SettingsItem(
                                    icon = Icons.Default.Lock,
                                    title = "Security",
                                    subtitle = "Password and authentication",
                                    onClick = { /* TODO: Navigate to security */ }
                                )
                            }
                        }
                    }

                    // Preferences Section
                    item {
                        Text(
                            text = "Preferences",
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Bold,
                            color = Gray400,
                            modifier = Modifier.padding(horizontal = 8.dp)
                        )
                    }

                    item {
                        Card(
                            modifier = Modifier.fillMaxWidth(),
                            colors = CardDefaults.cardColors(containerColor = SurfaceDark),
                            shape = RoundedCornerShape(16.dp)
                        ) {
                            Column {
                                SettingsItem(
                                    icon = Icons.Default.Notifications,
                                    title = "Notifications",
                                    subtitle = "Manage alert preferences",
                                    onClick = { /* TODO: Navigate to notifications */ }
                                )
                                Divider(color = Gray600, modifier = Modifier.padding(horizontal = 16.dp))
                                SettingsItem(
                                    icon = Icons.Default.Palette,
                                    title = "Appearance",
                                    subtitle = "Theme and display settings",
                                    onClick = { /* TODO: Navigate to appearance */ }
                                )
                                Divider(color = Gray600, modifier = Modifier.padding(horizontal = 16.dp))
                                SettingsItem(
                                    icon = Icons.Default.Language,
                                    title = "Language",
                                    subtitle = "English (US)",
                                    onClick = { /* TODO: Navigate to language */ }
                                )
                            }
                        }
                    }

                    // About Section
                    item {
                        Text(
                            text = "About",
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Bold,
                            color = Gray400,
                            modifier = Modifier.padding(horizontal = 8.dp)
                        )
                    }

                    item {
                        Card(
                            modifier = Modifier.fillMaxWidth(),
                            colors = CardDefaults.cardColors(containerColor = SurfaceDark),
                            shape = RoundedCornerShape(16.dp)
                        ) {
                            Column {
                                SettingsItem(
                                    icon = Icons.Default.Info,
                                    title = "About CommodityX",
                                    subtitle = "Version 1.0.0",
                                    onClick = { /* TODO: Show about dialog */ }
                                )
                                Divider(color = Gray600, modifier = Modifier.padding(horizontal = 16.dp))
                                SettingsItem(
                                    icon = Icons.Default.Article,
                                    title = "Terms of Service",
                                    subtitle = "Read our terms and conditions",
                                    onClick = { /* TODO: Navigate to terms */ }
                                )
                                Divider(color = Gray600, modifier = Modifier.padding(horizontal = 16.dp))
                                SettingsItem(
                                    icon = Icons.Default.PrivacyTip,
                                    title = "Privacy Policy",
                                    subtitle = "How we handle your data",
                                    onClick = { /* TODO: Navigate to privacy */ }
                                )
                            }
                        }
                    }

                    // Logout Button
                    item {
                        Button(
                            onClick = { showLogoutDialog = true },
                            modifier = Modifier
                                .fillMaxWidth()
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
                                Row(
                                    verticalAlignment = Alignment.CenterVertically,
                                    horizontalArrangement = Arrangement.Center
                                ) {
                                    Icon(
                                        Icons.Default.Logout,
                                        contentDescription = null,
                                        tint = Color.White
                                    )
                                    Spacer(modifier = Modifier.width(8.dp))
                                    Text(
                                        text = "Logout",
                                        style = MaterialTheme.typography.titleMedium,
                                        fontWeight = FontWeight.Bold,
                                        color = Color.White
                                    )
                                }
                            }
                        }
                    }

                    item {
                        Spacer(modifier = Modifier.height(32.dp))
                    }
                }
            }
        }
    }

    // Logout Confirmation Dialog
    if (showLogoutDialog) {
        AlertDialog(
            onDismissRequest = { showLogoutDialog = false },
            title = { Text("Logout?") },
            text = { Text("Are you sure you want to logout?") },
            confirmButton = {
                Button(
                    onClick = {
                        showLogoutDialog = false
                        onLogout()
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = LossRed)
                ) {
                    Text("Logout")
                }
            },
            dismissButton = {
                TextButton(onClick = { showLogoutDialog = false }) {
                    Text("Cancel")
                }
            },
            containerColor = SurfaceDark,
            titleContentColor = Color.White,
            textContentColor = Gray400
        )
    }
}

@Composable
fun SettingsItem(
    icon: ImageVector,
    title: String,
    subtitle: String,
    onClick: () -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clickable(onClick = onClick)
            .padding(16.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Icon(
            icon,
            contentDescription = null,
            tint = NeonCyan,
            modifier = Modifier.size(32.dp)
        )
        Spacer(modifier = Modifier.width(16.dp))
        Column(modifier = Modifier.weight(1f)) {
            Text(
                text = title,
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.SemiBold,
                color = Color.White
            )
            Text(
                text = subtitle,
                style = MaterialTheme.typography.bodySmall,
                color = Gray400
            )
        }
        Icon(
            Icons.Default.ChevronRight,
            contentDescription = null,
            tint = Gray500
        )
    }
}
