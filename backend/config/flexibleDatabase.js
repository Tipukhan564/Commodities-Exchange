const mysql = require('mysql2/promise');
const Database = require('better-sqlite3');
const path = require('path');

let pool = null;
let db = null;
let dbType = 'sqlite'; // Default to SQLite

// Try MySQL first
const initializeMySQL = async () => {
  try {
    pool = mysql.createPool({
      host: process.env.MYSQL_HOST || 'localhost',
      port: process.env.MYSQL_PORT || 3306,
      user: process.env.MYSQL_USER || 'root',
      password: process.env.MYSQL_PASSWORD || '',
      database: process.env.MYSQL_DATABASE || 'commodities_exchange',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0
    });

    // Test connection
    const connection = await pool.getConnection();
    console.log('✅ MySQL connected successfully');
    console.log(`📊 Database: ${process.env.MYSQL_DATABASE || 'commodities_exchange'}`);
    connection.release();

    dbType = 'mysql';
    return true;
  } catch (err) {
    console.log('⚠️  MySQL connection failed:', err.message);
    console.log('🔄 Falling back to SQLite...');
    return false;
  }
};

// Fallback to SQLite
const initializeSQLite = () => {
  try {
    const dbPath = path.join(__dirname, '../commodities_exchange.db');
    db = new Database(dbPath, { verbose: console.log });
    db.pragma('foreign_keys = ON');

    console.log('✅ SQLite database connected');
    console.log(`📁 Database file: ${dbPath}`);

    dbType = 'sqlite';
    return true;
  } catch (err) {
    console.error('❌ SQLite connection failed:', err);
    return false;
  }
};

// Universal query executor
const executeQuery = async (query, params = []) => {
  if (dbType === 'mysql' && pool) {
    const [rows] = await pool.query(query, params);
    return rows;
  } else if (dbType === 'sqlite' && db) {
    // Convert MySQL query to SQLite if needed
    const sqliteQuery = query.replace(/\?/g, () => {
      const index = query.split('?').length - query.split('?').slice(0, query.indexOf('?') + 1).length;
      return `$${index}`;
    });

    if (query.trim().toUpperCase().startsWith('SELECT')) {
      return db.prepare(query).all(...params);
    } else {
      return db.prepare(query).run(...params);
    }
  }
  throw new Error('No database connection available');
};

// Initialize database
const initDB = async () => {
  const mysqlSuccess = await initializeMySQL();

  if (!mysqlSuccess) {
    initializeSQLite();
  }

  console.log(`🎯 Active database: ${dbType.toUpperCase()}`);
  return { type: dbType, pool, db };
};

// Export both for compatibility
module.exports = {
  initDB,
  executeQuery,
  getDBType: () => dbType,
  pool: () => pool,
  db: () => db
};

// Auto-initialize
initDB().catch(console.error);
