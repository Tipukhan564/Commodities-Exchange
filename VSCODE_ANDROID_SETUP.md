# VS Code Android Development Setup Guide

Complete guide to run the Commodities Exchange Android app using VS Code.

## 📋 Table of Contents
1. [Install VS Code Extensions](#install-extensions)
2. [Set Up Android SDK](#setup-android-sdk)
3. [Configure Environment Variables](#configure-environment)
4. [Set Up Backend & Database](#setup-backend)
5. [Build & Run Android App](#build-run-app)
6. [Testing & Debugging](#testing-debugging)
7. [Troubleshooting](#troubleshooting)

---

## 1️⃣ Install VS Code Extensions

### Required Extensions:

Open VS Code Extensions panel (`Ctrl+Shift+X`) and install:

```
1. Extension Pack for Java (vscjava.vscode-java-pack)
2. Kotlin Language (mathiasfrohlich.Kotlin)
3. Gradle for Java (vscjava.vscode-gradle)
4. Android iOS Emulator (DiemasMichiels.emulate)
5. MySQL (cweijan.vscode-mysql-client2)
6. Thunder Client (rangav.vscode-thunder-client)
```

### Quick Install via Command Line:

```bash
code --install-extension vscjava.vscode-java-pack
code --install-extension mathiasfrohlich.Kotlin
code --install-extension vscjava.vscode-gradle
code --install-extension DiemasMichiels.emulate
code --install-extension cweijan.vscode-mysql-client2
code --install-extension rangav.vscode-thunder-client
```

---

## 2️⃣ Set Up Android SDK

### Option A: Install Android Command Line Tools

1. **Download Android Command Line Tools:**
   ```bash
   # Create Android SDK directory
   mkdir -p ~/Android/Sdk
   cd ~/Android/Sdk

   # Download command line tools (Linux)
   wget https://dl.google.com/android/repository/commandlinetools-linux-9477386_latest.zip

   # Extract
   unzip commandlinetools-linux-*_latest.zip
   mkdir -p cmdline-tools/latest
   mv cmdline-tools/* cmdline-tools/latest/
   ```

2. **Install SDK Packages:**
   ```bash
   cd ~/Android/Sdk/cmdline-tools/latest/bin

   # Accept licenses
   ./sdkmanager --licenses

   # Install required packages
   ./sdkmanager "platform-tools" "platforms;android-34" "build-tools;34.0.0"
   ./sdkmanager "emulator" "system-images;android-34;google_apis;x86_64"
   ```

### Option B: Use Existing Android Studio SDK

If you have Android Studio installed:

```bash
# SDK is usually at:
# Linux: ~/Android/Sdk
# Mac: ~/Library/Android/sdk
# Windows: C:\Users\YourName\AppData\Local\Android\Sdk
```

---

## 3️⃣ Configure Environment Variables

Add these to your shell profile (`~/.bashrc`, `~/.zshrc`, or `~/.profile`):

```bash
# Android SDK
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/emulator

# Java (if needed)
export JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64  # Adjust path
export PATH=$PATH:$JAVA_HOME/bin
```

**Apply changes:**
```bash
source ~/.bashrc  # or ~/.zshrc
```

**Verify installation:**
```bash
adb --version
java -version
```

---

## 4️⃣ Set Up Backend & Database

### A. MySQL Database Setup

1. **Start MySQL:**
   ```bash
   # Linux
   sudo systemctl start mysql

   # Mac
   mysql.server start
   ```

2. **Import Database Schema:**
   ```bash
   cd /home/user/Commodities-Exchange

   # Create database
   mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS commodities_exchange;"

   # Import schema
   mysql -u root -p commodities_exchange < database/mysql_schema.sql
   ```

3. **Verify Database:**
   ```bash
   mysql -u root -p commodities_exchange -e "SHOW TABLES;"
   ```

### B. Backend Setup

1. **Open Terminal in VS Code:**
   - Press `` Ctrl+` `` or `View → Terminal`

2. **Install Backend Dependencies:**
   ```bash
   cd backend
   npm install
   ```

3. **Configure Database Connection:**

   Edit `backend/config/database.js` or create `backend/.env`:

   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=commodities_exchange
   DB_PORT=3306
   ```

4. **Start Backend Server:**
   ```bash
   npm start
   ```

   Backend should run on `http://localhost:5000`

---

## 5️⃣ Build & Run Android App

### A. Configure API URL

1. **Open in VS Code:**
   ```
   android-app/app/build.gradle
   ```

2. **Update API URL:**
   ```gradle
   android {
       buildTypes {
           debug {
               // For Android Emulator
               buildConfigField "String", "API_BASE_URL", "\"http://10.0.2.2:5000/api/\""

               // For Physical Device (replace with your computer's IP)
               // buildConfigField "String", "API_BASE_URL", "\"http://192.168.1.100:5000/api/\""
           }
       }
   }
   ```

### B. Build Using Gradle

1. **Open Gradle Panel:**
   - Click on Gradle icon in VS Code sidebar
   - Or press `Ctrl+Shift+P` → "Gradle: View Gradle Tasks"

2. **Build the APK:**

   **Via Terminal:**
   ```bash
   cd /home/user/Commodities-Exchange/android-app

   # Make gradlew executable
   chmod +x gradlew

   # Build debug APK
   ./gradlew assembleDebug
   ```

   **Via VS Code Gradle Panel:**
   - Navigate to: `android-app → app → Tasks → build → assembleDebug`
   - Click to run

3. **APK Location:**
   ```
   android-app/app/build/outputs/apk/debug/app-debug.apk
   ```

### C. Install & Run on Emulator

1. **Create Emulator (First Time Only):**
   ```bash
   # List available system images
   sdkmanager --list | grep system-images

   # Create AVD (Android Virtual Device)
   avdmanager create avd -n Pixel6 -k "system-images;android-34;google_apis;x86_64" -d pixel_6
   ```

2. **Start Emulator:**

   **Option 1: Command Line**
   ```bash
   emulator -avd Pixel6
   ```

   **Option 2: VS Code Extension**
   - Press `Ctrl+Shift+P`
   - Type "Emulate: Run Android Emulator"
   - Select your emulator

3. **Install APK:**
   ```bash
   # Wait for emulator to boot completely
   adb wait-for-device

   # Install the app
   ./gradlew installDebug

   # Or manually
   adb install app/build/outputs/apk/debug/app-debug.apk
   ```

4. **Launch App:**
   ```bash
   adb shell am start -n com.commodityx/.ui.MainActivity
   ```

### D. Run on Physical Device

1. **Enable Developer Options on Phone:**
   - Settings → About Phone
   - Tap "Build Number" 7 times

2. **Enable USB Debugging:**
   - Settings → Developer Options
   - Enable "USB Debugging"

3. **Connect Device:**
   ```bash
   # Check if device is connected
   adb devices

   # Should show:
   # List of devices attached
   # XXXXXXXX    device
   ```

4. **Find Your Computer's IP:**
   ```bash
   # Linux/Mac
   ifconfig | grep "inet "

   # Or
   hostname -I
   ```

5. **Update API URL in build.gradle:**
   ```gradle
   buildConfigField "String", "API_BASE_URL", "\"http://192.168.1.100:5000/api/\""
   ```

6. **Install & Run:**
   ```bash
   ./gradlew installDebug
   adb shell am start -n com.commodityx/.ui.MainActivity
   ```

---

## 6️⃣ Testing & Debugging

### A. View Logs (Logcat)

**Terminal Method:**
```bash
# View all logs
adb logcat

# Filter by app
adb logcat | grep "commodityx"

# Clear and view fresh logs
adb logcat -c
adb logcat *:E  # Only errors
```

**VS Code Method:**
1. Install "Logcat" extension
2. Open Command Palette (`Ctrl+Shift+P`)
3. Type "Logcat: Start Logcat"

### B. Test API Endpoints

Use Thunder Client extension:

1. **Open Thunder Client:**
   - Click Thunder Client icon in sidebar
   - Or press `Ctrl+Shift+P` → "Thunder Client: New Request"

2. **Test Backend:**
   ```
   POST http://localhost:5000/api/auth/register
   Content-Type: application/json

   {
       "username": "testuser",
       "email": "test@example.com",
       "password": "password123",
       "full_name": "Test User"
   }
   ```

3. **Test Login:**
   ```
   POST http://localhost:5000/api/auth/login
   Content-Type: application/json

   {
       "username": "testuser",
       "password": "password123"
   }
   ```

### C. Database Queries

Use MySQL extension:

1. **Connect to Database:**
   - Click MySQL icon in sidebar
   - Click "+" to add connection
   - Enter: host=localhost, user=root, password=your_password

2. **Run Queries:**
   - Right-click database → "New Query"
   ```sql
   SELECT * FROM users;
   SELECT * FROM commodities;
   SELECT * FROM orders;
   ```

---

## 7️⃣ VS Code Tasks (Automation)

Create `.vscode/tasks.json` in project root:

```json
{
    "version": "2.0.0",
    "tasks": [
        {
            "label": "Build Android Debug",
            "type": "shell",
            "command": "./gradlew",
            "args": ["assembleDebug"],
            "options": {
                "cwd": "${workspaceFolder}/android-app"
            },
            "group": {
                "kind": "build",
                "isDefault": true
            }
        },
        {
            "label": "Install on Device",
            "type": "shell",
            "command": "./gradlew",
            "args": ["installDebug"],
            "options": {
                "cwd": "${workspaceFolder}/android-app"
            }
        },
        {
            "label": "Start Backend",
            "type": "shell",
            "command": "npm start",
            "options": {
                "cwd": "${workspaceFolder}/backend"
            },
            "isBackground": true
        },
        {
            "label": "Run App",
            "type": "shell",
            "command": "adb shell am start -n com.commodityx/.ui.MainActivity",
            "dependsOn": ["Install on Device"]
        }
    ]
}
```

**Run Tasks:**
- Press `Ctrl+Shift+P`
- Type "Tasks: Run Task"
- Select task

---

## 8️⃣ Keyboard Shortcuts

Create `.vscode/keybindings.json`:

```json
[
    {
        "key": "ctrl+shift+b",
        "command": "workbench.action.tasks.build"
    },
    {
        "key": "ctrl+shift+r",
        "command": "workbench.action.tasks.runTask",
        "args": "Run App"
    }
]
```

---

## 🐛 Troubleshooting

### Issue: "ANDROID_HOME not set"

**Solution:**
```bash
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

### Issue: "adb: command not found"

**Solution:**
```bash
# Add to PATH
export PATH=$PATH:$HOME/Android/Sdk/platform-tools

# Or install platform-tools
sudo apt-get install android-tools-adb android-tools-fastboot  # Linux
```

### Issue: "Gradle sync failed"

**Solution:**
```bash
cd android-app
./gradlew clean
./gradlew build --refresh-dependencies
```

### Issue: "Failed to connect to API"

**Solution:**
1. Check backend is running: `curl http://localhost:5000/api/commodities`
2. For emulator, use `10.0.2.2` instead of `localhost`
3. For device, use computer's IP address
4. Check firewall settings

### Issue: "Device not authorized"

**Solution:**
```bash
# Restart ADB
adb kill-server
adb start-server

# Check for authorization popup on device
adb devices
```

### Issue: "Build fails with Java version error"

**Solution:**
```bash
# Check Java version
java -version

# Set JAVA_HOME to JDK 11
export JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64
```

---

## 📁 Recommended VS Code Workspace Settings

Create `.vscode/settings.json`:

```json
{
    "java.configuration.updateBuildConfiguration": "automatic",
    "java.compile.nullAnalysis.mode": "automatic",
    "files.exclude": {
        "**/.git": true,
        "**/.gradle": true,
        "**/build": true,
        "**/node_modules": true
    },
    "search.exclude": {
        "**/build": true,
        "**/node_modules": true
    },
    "files.watcherExclude": {
        "**/.git/objects/**": true,
        "**/build/**": true,
        "**/node_modules/**": true
    },
    "terminal.integrated.env.linux": {
        "ANDROID_HOME": "${env:HOME}/Android/Sdk"
    }
}
```

---

## 🎯 Complete Workflow Example

### Start Fresh Development Session:

```bash
# Terminal 1: Start MySQL
sudo systemctl start mysql

# Terminal 2: Start Backend
cd /home/user/Commodities-Exchange/backend
npm start

# Terminal 3: Build & Run Android App
cd /home/user/Commodities-Exchange/android-app
./gradlew installDebug
adb shell am start -n com.commodityx/.ui.MainActivity

# Terminal 4: Watch Logs
adb logcat | grep "commodityx"
```

### Or Use VS Code Tasks (Ctrl+Shift+P → "Tasks: Run Task"):
1. Start Backend
2. Build Android Debug
3. Install on Device
4. Run App

---

## 📚 Additional Resources

- **VS Code Java Documentation**: https://code.visualstudio.com/docs/java/java-tutorial
- **Android Developer Guide**: https://developer.android.com/studio/command-line
- **Gradle Documentation**: https://docs.gradle.org/current/userguide/command_line_interface.html
- **ADB Commands**: https://developer.android.com/studio/command-line/adb

---

## ✅ Quick Reference Commands

```bash
# Build
cd android-app && ./gradlew assembleDebug

# Install
./gradlew installDebug

# Run
adb shell am start -n com.commodityx/.ui.MainActivity

# Logs
adb logcat | grep "commodityx"

# Uninstall
adb uninstall com.commodityx

# Clean build
./gradlew clean build

# Check connected devices
adb devices

# Backend
cd backend && npm start

# Database
mysql -u root -p commodities_exchange
```

---

**Happy Coding! 🚀**
