# 🚀 Complete VS Code Setup Guide for CommodityX

This guide will help you set up and run the complete CommodityX platform in VS Code, including the Android app, backend API, and MySQL database.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [VS Code Installation](#vs-code-installation)
3. [Required Extensions](#required-extensions)
4. [MySQL Database Setup](#mysql-database-setup)
5. [Backend Setup](#backend-setup)
6. [Android App Setup](#android-app-setup)
7. [Running the Complete Stack](#running-the-complete-stack)
8. [Troubleshooting](#troubleshooting)

---

## 1. Prerequisites

### Required Software

| Software | Version | Download Link |
|----------|---------|---------------|
| VS Code | Latest | https://code.visualstudio.com/ |
| Node.js | 18.x or higher | https://nodejs.org/ |
| MySQL Server | 8.0 or higher | https://dev.mysql.com/downloads/mysql/ |
| MySQL Workbench | 8.0 or higher | https://dev.mysql.com/downloads/workbench/ |
| Android Studio | Latest (Hedgehog+) | https://developer.android.com/studio |
| JDK | 17 | https://www.oracle.com/java/technologies/downloads/#java17 |
| Git | Latest | https://git-scm.com/ |

### System Requirements
- **OS:** Windows 10/11, macOS 10.15+, or Linux
- **RAM:** Minimum 8GB (16GB recommended)
- **Storage:** 10GB free space
- **Internet:** Stable connection for downloading dependencies

---

## 2. VS Code Installation

### Step 1: Download and Install

1. Go to https://code.visualstudio.com/
2. Download for your operating system
3. Run the installer
4. During installation, check:
   - ✅ Add "Open with Code" action to context menu
   - ✅ Add to PATH
   - ✅ Register Code as an editor for supported file types

### Step 2: Initial Configuration

After installation, open VS Code and:

```bash
# Open VS Code from command line
code .
```

Or on Windows, search for "Visual Studio Code" in Start Menu.

---

## 3. Required Extensions

### Essential Extensions for This Project

Open VS Code Extensions panel (`Ctrl+Shift+X` or `Cmd+Shift+X`) and install:

#### 1. **Kotlin Language** (Kotlin by mathiasfrohlich)
```
Extension ID: mathiasfrohlich.Kotlin
Purpose: Kotlin syntax highlighting and language support
```

#### 2. **Android Development Tools** (Android by adelphes)
```
Extension ID: adelphes.android-dev-ext
Purpose: Android project support in VS Code
```

#### 3. **Gradle for Java** (Microsoft)
```
Extension ID: vscjava.vscode-gradle
Purpose: Gradle build tool support
```

#### 4. **ESLint** (Microsoft)
```
Extension ID: dbaeumer.vscode-eslint
Purpose: JavaScript/Node.js linting
```

#### 5. **Prettier - Code Formatter** (Prettier)
```
Extension ID: esbenp.prettier-vscode
Purpose: Code formatting
```

#### 6. **MySQL** (cweijan)
```
Extension ID: cweijan.vscode-mysql-client2
Purpose: MySQL database management in VS Code
```

#### 7. **SQLTools** (Matheus Teixeira)
```
Extension ID: mtxr.sqltools
Purpose: SQL database tools
```

#### 8. **SQLTools MySQL/MariaDB** (Matheus Teixeira)
```
Extension ID: mtxr.sqltools-driver-mysql
Purpose: MySQL driver for SQLTools
```

#### 9. **JavaScript (ES6) code snippets** (charalampos karypidis)
```
Extension ID: xabikos.JavaScriptSnippets
Purpose: ES6 syntax snippets
```

#### 10. **npm Intellisense** (Christian Kohler)
```
Extension ID: christian-kohler.npm-intellisense
Purpose: Autocomplete npm modules
```

#### 11. **Path Intellisense** (Christian Kohler)
```
Extension ID: christian-kohler.path-intellisense
Purpose: Autocomplete filenames
```

#### 12. **GitLens** (GitKraken)
```
Extension ID: eamodio.gitlens
Purpose: Enhanced Git capabilities
```

#### 13. **Thunder Client** (Thunder Client)
```
Extension ID: rangav.vscode-thunder-client
Purpose: API testing (alternative to Postman)
```

#### 14. **Live Server** (Ritwick Dey)
```
Extension ID: ritwickdey.LiveServer
Purpose: Live preview for web files
```

### Install All Extensions at Once

Create a file `.vscode/extensions.json` in your project:

```json
{
  "recommendations": [
    "mathiasfrohlich.Kotlin",
    "adelphes.android-dev-ext",
    "vscjava.vscode-gradle",
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "cweijan.vscode-mysql-client2",
    "mtxr.sqltools",
    "mtxr.sqltools-driver-mysql",
    "xabikos.JavaScriptSnippets",
    "christian-kohler.npm-intellisense",
    "christian-kohler.path-intellisense",
    "eamodio.gitlens",
    "rangav.vscode-thunder-client",
    "ritwickdey.LiveServer"
  ]
}
```

VS Code will prompt you to install recommended extensions!

---

## 4. MySQL Database Setup

### Step 1: Install MySQL Server

**Windows:**
1. Download MySQL Installer from https://dev.mysql.com/downloads/installer/
2. Choose "Custom" installation
3. Select:
   - MySQL Server 8.0.x
   - MySQL Workbench
   - MySQL Shell
4. Set root password: **Remember this!**
5. Complete installation

**macOS:**
```bash
# Using Homebrew
brew install mysql
brew services start mysql
mysql_secure_installation
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install mysql-server
sudo systemctl start mysql
sudo mysql_secure_installation
```

### Step 2: Configure MySQL

1. **Open MySQL Workbench**
2. **Connect to Local Instance:**
   - Click "+" next to MySQL Connections
   - Connection Name: `CommodityX Local`
   - Hostname: `127.0.0.1`
   - Port: `3306`
   - Username: `root`
   - Password: [Your MySQL root password]
   - Test Connection ✅
   - Click OK

### Step 3: Import Database Schema

1. **In MySQL Workbench:**
   - Connect to your database
   - Click "File" → "Open SQL Script"
   - Navigate to: `Commodities-Exchange/database/mysql_schema.sql`
   - Click "Execute" (⚡ lightning bolt icon)
   - Wait for completion ✅

2. **Verify Database:**
   ```sql
   SHOW DATABASES;
   USE commodities_exchange;
   SHOW TABLES;
   SELECT * FROM commodities;
   ```

### Step 4: MySQL in VS Code

1. **Open VS Code**
2. **Open MySQL Extension** (Database icon in sidebar)
3. **Add Connection:**
   - Click "+" to add connection
   - Host: `localhost`
   - Port: `3306`
   - Username: `root`
   - Password: [Your password]
   - Database: `commodities_exchange`
4. **Test:** Right-click database → "New Query" → Run:
   ```sql
   SELECT * FROM commodities LIMIT 5;
   ```

---

## 5. Backend Setup

### Step 1: Open Project in VS Code

```bash
# Navigate to project folder
cd /path/to/Commodities-Exchange

# Open in VS Code
code .
```

### Step 2: Configure Backend

1. **Open Terminal in VS Code** (`Ctrl+` ` or Terminal → New Terminal)

2. **Navigate to backend folder:**
   ```bash
   cd backend
   ```

3. **Install Dependencies:**
   ```bash
   npm install
   ```
   This will install all Node.js packages (Express, MySQL, JWT, etc.)

4. **Configure Environment Variables:**

   Edit `backend/.env`:
   ```env
   PORT=5000
   DB_TYPE=mysql

   # MySQL Configuration
   MYSQL_HOST=localhost
   MYSQL_PORT=3306
   MYSQL_USER=root
   MYSQL_PASSWORD=YOUR_MYSQL_PASSWORD_HERE
   MYSQL_DATABASE=commodities_exchange

   # JWT Secret
   JWT_SECRET=commodities-exchange-secret-key-2024-5d8f7a9b2c1e3f4a6b8d9e0f1a2b3c4d
   ```

   **IMPORTANT:** Replace `YOUR_MYSQL_PASSWORD_HERE` with your actual MySQL root password!

### Step 3: Test Backend

```bash
# Still in backend folder
npm start
```

You should see:
```
✅ MySQL connected successfully
✅ Server running on port 5000
```

**Test API:**
1. Open Thunder Client extension in VS Code
2. Create New Request
3. GET `http://localhost:5000/api/commodities`
4. Click "Send"
5. You should get JSON response with commodities! ✅

### Step 4: Create VS Code Tasks

Create `.vscode/tasks.json`:

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Start Backend",
      "type": "shell",
      "command": "npm start",
      "options": {
        "cwd": "${workspaceFolder}/backend"
      },
      "problemMatcher": [],
      "presentation": {
        "reveal": "always",
        "panel": "new"
      }
    }
  ]
}
```

Now you can run backend with: `Terminal → Run Task → Start Backend`

---

## 6. Android App Setup

### Step 1: Install Android Studio

1. **Download Android Studio** from https://developer.android.com/studio
2. **Install with Default Settings**
3. **During first launch:**
   - Install Android SDK
   - Install Android SDK Platform-Tools
   - Install Android Emulator
   - Download API Level 34 (Android 14)

### Step 2: Set Up Android SDK Path

**Windows:**
```bash
# Add to System Environment Variables
ANDROID_HOME=C:\Users\YourUsername\AppData\Local\Android\Sdk
Path=%Path%;%ANDROID_HOME%\platform-tools;%ANDROID_HOME%\tools
```

**macOS/Linux:**
```bash
# Add to ~/.bashrc or ~/.zshrc
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/platform-tools:$ANDROID_HOME/tools
```

### Step 3: Open Android Project

#### Option A: Using Android Studio (Recommended)

1. **Open Android Studio**
2. **Open Project:**
   - File → Open
   - Navigate to: `Commodities-Exchange/android-app`
   - Click "OK"
3. **Gradle Sync:**
   - Wait for Gradle sync to complete
   - Accept any SDK installation prompts
4. **Run App:**
   - Click "Run" (▶️) button
   - Select emulator or connected device

#### Option B: Using VS Code

1. **Open in VS Code:**
   ```bash
   cd android-app
   code .
   ```

2. **Build Project:**
   ```bash
   # Windows
   .\gradlew.bat build

   # macOS/Linux
   ./gradlew build
   ```

3. **Run on Device:**
   ```bash
   # Check connected devices
   adb devices

   # Install APK
   ./gradlew installDebug
   ```

### Step 4: Configure API Endpoint for Android

Edit `android-app/app/build.gradle`:

```gradle
buildConfigField "String", "API_BASE_URL", "\"http://YOUR_COMPUTER_IP:5000/api/\""
```

**Find Your Computer's IP:**

Windows:
```cmd
ipconfig
```
Look for "IPv4 Address" (e.g., 192.168.1.100)

macOS:
```bash
ifconfig | grep "inet "
```

Linux:
```bash
ip addr show
```

**For Android Emulator:** Use `http://10.0.2.2:5000/api/`
**For Physical Device:** Use `http://YOUR_IP:5000/api/` (e.g., `http://192.168.1.100:5000/api/`)

---

## 7. Running the Complete Stack

### Option 1: Manual Start (Recommended for Learning)

**Terminal 1 - MySQL (should already be running):**
```bash
# Check MySQL status
# Windows: Check Services
# macOS: brew services list
# Linux: sudo systemctl status mysql
```

**Terminal 2 - Backend:**
```bash
cd backend
npm start
```

**Terminal 3 - Android (Android Studio):**
- Open Android Studio
- Open `android-app` project
- Click Run ▶️

### Option 2: VS Code Tasks

Create `.vscode/tasks.json`:

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Start All Services",
      "dependsOn": ["Start Backend"],
      "problemMatcher": []
    },
    {
      "label": "Start Backend",
      "type": "shell",
      "command": "npm start",
      "options": {
        "cwd": "${workspaceFolder}/backend"
      },
      "isBackground": true,
      "problemMatcher": {
        "pattern": {
          "regexp": "^(.*)$",
          "line": 1
        },
        "background": {
          "activeOnStart": true,
          "beginsPattern": "^.*starting.*$",
          "endsPattern": "^.*Server running.*$"
        }
      }
    }
  ]
}
```

Run with: `Terminal → Run Task → Start All Services`

### Option 3: Launch Configuration

Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Launch Backend",
      "skipFiles": ["<node_internals>/**"],
      "program": "${workspaceFolder}/backend/server.js",
      "cwd": "${workspaceFolder}/backend"
    }
  ]
}
```

---

## 8. Testing the Complete Stack

### Step 1: Test Backend API

Use Thunder Client or Postman:

1. **GET Commodities:**
   ```
   GET http://localhost:5000/api/commodities
   ```
   Expected: List of 10 commodities

2. **Register User:**
   ```
   POST http://localhost:5000/api/auth/register
   Body (JSON):
   {
     "username": "testuser",
     "email": "test@example.com",
     "password": "test123",
     "full_name": "Test User"
   }
   ```
   Expected: Token and user object

3. **Login:**
   ```
   POST http://localhost:5000/api/auth/login
   Body (JSON):
   {
     "username": "testuser",
     "password": "test123"
   }
   ```
   Expected: Token and user object

### Step 2: Test Android App

1. **Launch App** on emulator/device
2. **Register** a new account
3. **Login** with credentials
4. **Navigate** through all screens:
   - Dashboard ✅
   - Portfolio ✅
   - Charts ✅
   - Trading ✅
   - Orders ✅

### Step 3: Test Integration

1. **Place an Order** in Android app
2. **Check MySQL:**
   ```sql
   SELECT * FROM orders ORDER BY created_at DESC LIMIT 1;
   SELECT * FROM portfolio WHERE user_id = 1;
   SELECT * FROM users WHERE id = 1;
   ```
3. **Verify** order appears in database

---

## 9. Troubleshooting

### Common Issues

#### ❌ "Cannot connect to MySQL"

**Solution:**
1. Check MySQL is running:
   ```bash
   # Windows
   net start MySQL80

   # macOS
   brew services start mysql

   # Linux
   sudo systemctl start mysql
   ```

2. Verify credentials in `backend/.env`
3. Test connection in MySQL Workbench

#### ❌ "EADDRINUSE: Port 5000 is already in use"

**Solution:**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :5000
kill -9 <PID>
```

Or change port in `backend/.env`:
```env
PORT=5001
```

#### ❌ "Android Gradle sync failed"

**Solution:**
1. Delete `android-app/.gradle` folder
2. Delete `android-app/app/build` folder
3. In Android Studio: File → Invalidate Caches → Invalidate and Restart
4. Sync again

#### ❌ "Unable to connect to backend from Android"

**Solution:**
1. **Check backend is running:**
   ```bash
   curl http://localhost:5000/api/commodities
   ```

2. **For Emulator:** Use `http://10.0.2.2:5000/api/`

3. **For Physical Device:**
   - Find computer IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
   - Use: `http://YOUR_IP:5000/api/`
   - Both devices must be on same WiFi network
   - Check firewall allows port 5000

4. **Update** `android-app/app/build.gradle`:
   ```gradle
   buildConfigField "String", "API_BASE_URL", "\"http://YOUR_IP:5000/api/\""
   ```

5. **Rebuild** app

#### ❌ "Kotlin plugin not working in VS Code"

**Solution:**
1. Install Kotlin extension
2. Install Java Extension Pack
3. Restart VS Code
4. Note: For full Kotlin support, use Android Studio

---

## 10. Recommended VS Code Settings

Create `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "files.associations": {
    "*.kt": "kotlin"
  },
  "terminal.integrated.defaultProfile.windows": "Git Bash",
  "sqltools.connections": [
    {
      "mysqlOptions": {
        "authProtocol": "default"
      },
      "previewLimit": 50,
      "server": "localhost",
      "port": 3306,
      "driver": "MySQL",
      "name": "CommodityX",
      "database": "commodities_exchange",
      "username": "root",
      "password": "YOUR_PASSWORD"
    }
  ]
}
```

---

## 11. Quick Reference Commands

### Backend
```bash
# Install dependencies
cd backend && npm install

# Start server
npm start

# Start with auto-reload
npm run dev  # (if nodemon is installed)
```

### Android
```bash
# Build
cd android-app && ./gradlew build

# Install on device
./gradlew installDebug

# View logs
adb logcat
```

### MySQL
```bash
# Connect to MySQL
mysql -u root -p

# Use database
USE commodities_exchange;

# Show tables
SHOW TABLES;

# View data
SELECT * FROM commodities;
SELECT * FROM users;
SELECT * FROM orders LIMIT 10;
```

---

## 12. Next Steps

✅ **You're all set!** Your complete CommodityX stack is running!

**What to do next:**
1. **Explore the Android app** - Test all features
2. **Monitor MySQL** - Watch data changes in real-time
3. **Test API endpoints** - Use Thunder Client
4. **Customize** - Modify colors, add features
5. **Deploy** - Prepare for production

---

## 🆘 Need Help?

- **Backend Issues:** Check `backend/server.log`
- **Android Issues:** Check Android Studio Logcat
- **Database Issues:** Check MySQL Workbench
- **VS Code Issues:** View → Output → Select relevant extension

---

**Happy Coding! 🚀**

Built with ❤️ for CommodityX Platform
