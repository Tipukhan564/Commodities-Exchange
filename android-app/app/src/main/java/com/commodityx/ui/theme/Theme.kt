package com.commodityx.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.SideEffect
import androidx.compose.ui.graphics.Color
import com.google.accompanist.systemuicontroller.rememberSystemUiController

private val DarkColorScheme = darkColorScheme(
    primary = NeonCyan,
    secondary = NeonGreen,
    tertiary = NeonPurple,
    background = CyberDark,
    surface = SurfaceDark,
    error = LossRed,
    onPrimary = CyberDark,
    onSecondary = CyberDark,
    onBackground = Color.White,
    onSurface = Color.White,
    onError = Color.White
)

@Composable
fun CommodityXTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    val colorScheme = DarkColorScheme

    val systemUiController = rememberSystemUiController()
    SideEffect {
        systemUiController.setSystemBarsColor(
            color = CyberDark,
            darkIcons = false
        )
    }

    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography,
        content = content
    )
}
