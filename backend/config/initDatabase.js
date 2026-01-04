const db = require('./database');

const initDatabase = () => {
  try {
    // Create Users table
    db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        full_name TEXT,
        balance REAL DEFAULT 100000.00,
        is_admin INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Users table created');

    // Create Commodities table
    db.exec(`
      CREATE TABLE IF NOT EXISTS commodities (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        symbol TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        current_price REAL NOT NULL,
        previous_close REAL,
        open_price REAL,
        high_price REAL,
        low_price REAL,
        volume INTEGER,
        market_cap REAL,
        change_percent REAL,
        last_updated DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Commodities table created');

    // Create Orders table
    db.exec(`
      CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        commodity_symbol TEXT NOT NULL,
        order_type TEXT NOT NULL CHECK(order_type IN ('BUY', 'SELL')),
        quantity REAL NOT NULL,
        price REAL NOT NULL,
        total_amount REAL NOT NULL,
        status TEXT DEFAULT 'COMPLETED' CHECK(status IN ('PENDING', 'COMPLETED', 'CANCELLED')),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    console.log('✅ Orders table created');

    // Create Portfolio table
    db.exec(`
      CREATE TABLE IF NOT EXISTS portfolio (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        commodity_symbol TEXT NOT NULL,
        quantity REAL NOT NULL DEFAULT 0,
        average_price REAL NOT NULL,
        total_invested REAL NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE(user_id, commodity_symbol)
      )
    `);
    console.log('✅ Portfolio table created');

    // Create Watchlist table
    db.exec(`
      CREATE TABLE IF NOT EXISTS watchlist (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        commodity_symbol TEXT NOT NULL,
        added_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE(user_id, commodity_symbol)
      )
    `);
    console.log('✅ Watchlist table created');

    // Create Alerts table
    db.exec(`
      CREATE TABLE IF NOT EXISTS price_alerts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        commodity_symbol TEXT NOT NULL,
        alert_type TEXT NOT NULL CHECK(alert_type IN ('ABOVE', 'BELOW')),
        target_price REAL NOT NULL,
        is_active INTEGER DEFAULT 1,
        triggered_at DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    console.log('✅ Price Alerts table created');

    // Create Transactions table
    db.exec(`
      CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        transaction_type TEXT NOT NULL CHECK(transaction_type IN ('DEPOSIT', 'WITHDRAWAL', 'TRADE_BUY', 'TRADE_SELL')),
        amount REAL NOT NULL,
        description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    console.log('✅ Transactions table created');

    // Insert sample commodities
    const insertCommodity = db.prepare(`
      INSERT OR IGNORE INTO commodities
      (symbol, name, current_price, previous_close, open_price, high_price, low_price, volume, market_cap, change_percent)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const commodities = [
      ['GC=F', 'Gold', 2050.50, 2045.00, 2048.00, 2055.00, 2042.00, 125000, 12500000000, 0.27],
      ['SI=F', 'Silver', 25.75, 25.60, 25.65, 25.90, 25.50, 85000, 1500000000, 0.59],
      ['CL=F', 'Crude Oil', 78.25, 77.80, 78.00, 78.50, 77.50, 250000, 8500000000, 0.58],
      ['NG=F', 'Natural Gas', 2.85, 2.90, 2.88, 2.95, 2.80, 180000, 950000000, -1.72],
      ['HG=F', 'Copper', 3.85, 3.82, 3.83, 3.88, 3.80, 95000, 2200000000, 0.79],
      ['PL=F', 'Platinum', 925.50, 920.00, 922.00, 928.00, 918.00, 45000, 750000000, 0.60],
      ['PA=F', 'Palladium', 1050.75, 1045.00, 1048.00, 1055.00, 1042.00, 35000, 650000000, 0.55],
      ['ZC=F', 'Corn', 485.25, 483.50, 484.00, 487.00, 482.00, 150000, 1800000000, 0.36],
      ['ZW=F', 'Wheat', 625.50, 622.00, 623.50, 627.00, 620.00, 120000, 1500000000, 0.56],
      ['KC=F', 'Coffee', 185.75, 184.50, 185.00, 186.50, 184.00, 65000, 850000000, 0.68]
    ];

    const insertMany = db.transaction((commodities) => {
      for (const commodity of commodities) {
        insertCommodity.run(...commodity);
      }
    });

    insertMany(commodities);
    console.log('✅ Sample commodities inserted');

    console.log('✅ Database initialization complete');

  } catch (err) {
    console.error('❌ Database initialization error:', err);
    throw err;
  }
};

// Run initialization if called directly
if (require.main === module) {
  try {
    initDatabase();
    console.log('Database setup completed successfully');
  } catch (err) {
    console.error('Database setup failed:', err);
    process.exit(1);
  }
}

module.exports = initDatabase;
