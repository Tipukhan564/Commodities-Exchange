package com.commodityx

import android.app.Application
import com.commodityx.network.RetrofitClient
import com.commodityx.utils.PreferencesManager

class CommodityXApplication : Application() {

    lateinit var preferencesManager: PreferencesManager
        private set

    override fun onCreate() {
        super.onCreate()
        instance = this
        preferencesManager = PreferencesManager(this)
        RetrofitClient.init(preferencesManager)
    }

    companion object {
        lateinit var instance: CommodityXApplication
            private set
    }
}
