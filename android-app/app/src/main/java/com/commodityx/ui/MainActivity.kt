package com.commodityx.ui

import android.content.Intent
import android.os.Bundle
import androidx.activity.ComponentActivity
import com.commodityx.CommodityXApplication
import com.commodityx.ui.auth.LoginActivity
import com.commodityx.ui.dashboard.DashboardActivity

class MainActivity : ComponentActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val preferencesManager = (application as CommodityXApplication).preferencesManager

        // Check if user is logged in
        val intent = if (preferencesManager.isLoggedIn()) {
            Intent(this, DashboardActivity::class.java)
        } else {
            Intent(this, LoginActivity::class.java)
        }

        startActivity(intent)
        finish()
    }
}
