const mysql = require('mysql2/promise');

const initDatabase = async () => {
  try {
    // Connect without database first
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'JSBL',
      password: 'admin123'
    });

    // Create database if it doesn't exist
    await connection.query('CREATE DATABASE IF NOT EXISTS commodities_exchange');
    console.log('✅ Database created/verified');

    // Use the database
    await connection.query('USE commodities_exchange');

    // Create Users table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        full_name VARCHAR(100),
        balance DECIMAL(15, 2) DEFAULT 100000.00,
        is_admin BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_username (username),
        INDEX idx_email (email)
      )
    `);
    console.log('✅ Users table created');

    // Create Commodities table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS commodities (
        id INT AUTO_INCREMENT PRIMARY KEY,
        symbol VARCHAR(20) UNIQUE NOT NULL,
        name VARCHAR(100) NOT NULL,
        current_price DECIMAL(15, 2) NOT NULL,
        previous_close DECIMAL(15, 2),
        open_price DECIMAL(15, 2),
        high_price DECIMAL(15, 2),
        low_price DECIMAL(15, 2),
        volume BIGINT,
        market_cap DECIMAL(20, 2),
        change_percent DECIMAL(10, 2),
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_symbol (symbol)
      )
    `);
    console.log('✅ Commodities table created');

    // Create Orders table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        commodity_symbol VARCHAR(20) NOT NULL,
        order_type ENUM('BUY', 'SELL') NOT NULL,
        quantity DECIMAL(15, 4) NOT NULL,
        price DECIMAL(15, 2) NOT NULL,
        total_amount DECIMAL(15, 2) NOT NULL,
        status ENUM('PENDING', 'COMPLETED', 'CANCELLED') DEFAULT 'COMPLETED',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_user_id (user_id),
        INDEX idx_commodity (commodity_symbol),
        INDEX idx_created_at (created_at)
      )
    `);
    console.log('✅ Orders table created');

    // Create Portfolio table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS portfolio (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        commodity_symbol VARCHAR(20) NOT NULL,
        quantity DECIMAL(15, 4) NOT NULL DEFAULT 0,
        average_price DECIMAL(15, 2) NOT NULL,
        total_invested DECIMAL(15, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE KEY unique_user_commodity (user_id, commodity_symbol),
        INDEX idx_user_id (user_id)
      )
    `);
    console.log('✅ Portfolio table created');

    // Create Watchlist table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS watchlist (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        commodity_symbol VARCHAR(20) NOT NULL,
        added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE KEY unique_user_watchlist (user_id, commodity_symbol),
        INDEX idx_user_id (user_id)
      )
    `);
    console.log('✅ Watchlist table created');

    // Create Alerts table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS price_alerts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        commodity_symbol VARCHAR(20) NOT NULL,
        alert_type ENUM('ABOVE', 'BELOW') NOT NULL,
        target_price DECIMAL(15, 2) NOT NULL,
        is_active BOOLEAN DEFAULT TRUE,
        triggered_at TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_user_id (user_id),
        INDEX idx_active (is_active)
      )
    `);
    console.log('✅ Price Alerts table created');

    // Create Transactions table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS transactions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        transaction_type ENUM('DEPOSIT', 'WITHDRAWAL', 'TRADE_BUY', 'TRADE_SELL') NOT NULL,
        amount DECIMAL(15, 2) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_user_id (user_id),
        INDEX idx_created_at (created_at)
      )
    `);
    console.log('✅ Transactions table created');

    // Insert sample commodities
    await connection.query(`
      INSERT IGNORE INTO commodities (symbol, name, current_price, previous_close, open_price, high_price, low_price, volume, market_cap, change_percent) VALUES
      ('GC=F', 'Gold', 2050.50, 2045.00, 2048.00, 2055.00, 2042.00, 125000, 12500000000, 0.27),
      ('SI=F', 'Silver', 25.75, 25.60, 25.65, 25.90, 25.50, 85000, 1500000000, 0.59),
      ('CL=F', 'Crude Oil', 78.25, 77.80, 78.00, 78.50, 77.50, 250000, 8500000000, 0.58),
      ('NG=F', 'Natural Gas', 2.85, 2.90, 2.88, 2.95, 2.80, 180000, 950000000, -1.72),
      ('HG=F', 'Copper', 3.85, 3.82, 3.83, 3.88, 3.80, 95000, 2200000000, 0.79),
      ('PL=F', 'Platinum', 925.50, 920.00, 922.00, 928.00, 918.00, 45000, 750000000, 0.60),
      ('PA=F', 'Palladium', 1050.75, 1045.00, 1048.00, 1055.00, 1042.00, 35000, 650000000, 0.55),
      ('ZC=F', 'Corn', 485.25, 483.50, 484.00, 487.00, 482.00, 150000, 1800000000, 0.36),
      ('ZW=F', 'Wheat', 625.50, 622.00, 623.50, 627.00, 620.00, 120000, 1500000000, 0.56),
      ('KC=F', 'Coffee', 185.75, 184.50, 185.00, 186.50, 184.00, 65000, 850000000, 0.68)
    `);
    console.log('✅ Sample commodities inserted');

    await connection.end();
    console.log('✅ Database initialization complete');

  } catch (err) {
    console.error('❌ Database initialization error:', err);
    throw err;
  }
};

// Run initialization if called directly
if (require.main === module) {
  initDatabase()
    .then(() => {
      console.log('Database setup completed successfully');
      process.exit(0);
    })
    .catch((err) => {
      console.error('Database setup failed:', err);
      process.exit(1);
    });
}

module.exports = initDatabase;
