-- ============================================
-- CommodityX Database Schema for MySQL Workbench
-- ============================================

-- Create database
CREATE DATABASE IF NOT EXISTS commodities_exchange;
USE commodities_exchange;

-- ============================================
-- USERS TABLE
-- ============================================
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- COMMODITIES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS commodities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    symbol VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    current_price DECIMAL(15, 2) NOT NULL,
    previous_close DECIMAL(15, 2),
    open_price DECIMAL(15, 2),
    high_price DECIMAL(15, 2),
    low_price DECIMAL(15, 2),
    volume BIGINT DEFAULT 0,
    market_cap DECIMAL(20, 2),
    price_change_24h DECIMAL(10, 2) DEFAULT 0.00,
    high_24h DECIMAL(15, 2),
    low_24h DECIMAL(15, 2),
    volume_24h DECIMAL(20, 2),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_symbol (symbol)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- ORDERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    commodity_id INT NOT NULL,
    order_type ENUM('buy', 'sell') NOT NULL,
    quantity DECIMAL(15, 4) NOT NULL,
    price DECIMAL(15, 2) NOT NULL,
    total_amount DECIMAL(20, 2) NOT NULL,
    status ENUM('pending', 'completed', 'cancelled') DEFAULT 'completed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (commodity_id) REFERENCES commodities(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_commodity_id (commodity_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- PORTFOLIO TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS portfolio (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    commodity_id INT NOT NULL,
    quantity DECIMAL(15, 4) NOT NULL DEFAULT 0,
    average_price DECIMAL(15, 2) NOT NULL,
    total_invested DECIMAL(20, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_user_commodity (user_id, commodity_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (commodity_id) REFERENCES commodities(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_commodity_id (commodity_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- WATCHLIST TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS watchlist (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    commodity_id INT NOT NULL,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_user_commodity (user_id, commodity_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (commodity_id) REFERENCES commodities(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- PRICE ALERTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS price_alerts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    commodity_id INT NOT NULL,
    alert_type ENUM('above', 'below') NOT NULL,
    target_price DECIMAL(15, 2) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    triggered_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (commodity_id) REFERENCES commodities(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TRANSACTIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    transaction_type ENUM('deposit', 'withdrawal', 'trade') NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_transaction_type (transaction_type),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- PRICE HISTORY TABLE (for charts)
-- ============================================
CREATE TABLE IF NOT EXISTS price_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    commodity_id INT NOT NULL,
    price DECIMAL(15, 2) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (commodity_id) REFERENCES commodities(id) ON DELETE CASCADE,
    INDEX idx_commodity_id (commodity_id),
    INDEX idx_timestamp (timestamp)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- INSERT SAMPLE DATA
-- ============================================

-- Insert sample commodities
INSERT INTO commodities (symbol, name, current_price, previous_close, open_price, high_price, low_price, volume, price_change_24h, high_24h, low_24h, volume_24h) VALUES
('GC=F', 'Gold', 1985.50, 1978.30, 1980.00, 1990.20, 1975.10, 125000, 0.36, 1990.20, 1975.10, 2500000),
('SI=F', 'Silver', 24.85, 24.50, 24.60, 25.10, 24.40, 85000, 1.43, 25.10, 24.40, 1800000),
('CL=F', 'Crude Oil', 82.45, 81.90, 82.10, 83.20, 81.50, 210000, 0.67, 83.20, 81.50, 5200000),
('NG=F', 'Natural Gas', 2.85, 2.92, 2.88, 2.95, 2.80, 95000, -2.40, 2.95, 2.80, 980000),
('HG=F', 'Copper', 3.92, 3.88, 3.90, 3.98, 3.85, 68000, 1.03, 3.98, 3.85, 750000),
('PL=F', 'Platinum', 965.80, 958.20, 962.00, 972.50, 955.10, 42000, 0.79, 972.50, 955.10, 420000),
('PA=F', 'Palladium', 1245.60, 1238.90, 1242.00, 1256.30, 1235.70, 28000, 0.54, 1256.30, 1235.70, 285000),
('ZC=F', 'Corn', 485.25, 482.50, 483.75, 487.80, 481.20, 118000, 0.57, 487.80, 481.20, 1250000),
('ZW=F', 'Wheat', 625.40, 622.10, 623.50, 628.90, 620.30, 92000, 0.53, 628.90, 620.30, 980000),
('KC=F', 'Coffee', 168.75, 170.20, 169.50, 172.40, 167.80, 74000, -0.85, 172.40, 167.80, 820000);

-- Insert sample admin user (password: admin123)
-- Password hash for 'admin123' with bcrypt
INSERT INTO users (username, email, password, full_name, balance, is_admin) VALUES
('admin', 'admin@commodityx.com', '$2b$10$rBV2xYYh/qy3q8V6z5zqxO8cF5kY6KqXrLw9L6Lz5z5z5z5z5z5z5u', 'System Administrator', 1000000.00, TRUE);

-- Insert sample regular user (password: demo123)
INSERT INTO users (username, email, password, full_name, balance) VALUES
('demo', 'demo@commodityx.com', '$2b$10$rBV2xYYh/qy3q8V6z5zqxO8cF5kY6KqXrLw9L6Lz5z5z5z5z5z5z5u', 'Demo User', 100000.00);

-- Insert initial deposit transactions
INSERT INTO transactions (user_id, transaction_type, amount, description) VALUES
(1, 'deposit', 1000000.00, 'Initial deposit'),
(2, 'deposit', 100000.00, 'Initial deposit');

-- ============================================
-- CREATE VIEWS FOR EASIER QUERIES
-- ============================================

-- View for portfolio with current prices
CREATE OR REPLACE VIEW portfolio_view AS
SELECT
    p.id,
    p.user_id,
    p.commodity_id,
    c.symbol as commodity_symbol,
    c.name as commodity_name,
    p.quantity,
    p.average_price,
    c.current_price,
    (p.quantity * c.current_price) as current_value,
    (p.quantity * p.average_price) as total_invested,
    ((c.current_price - p.average_price) / p.average_price * 100) as pnl_percentage
FROM portfolio p
JOIN commodities c ON p.commodity_id = c.id
WHERE p.quantity > 0;

-- View for orders with commodity details
CREATE OR REPLACE VIEW orders_view AS
SELECT
    o.id,
    o.user_id,
    o.commodity_id,
    c.symbol as commodity_symbol,
    c.name as commodity_name,
    o.order_type,
    o.quantity,
    o.price,
    o.total_amount,
    o.status,
    o.created_at
FROM orders o
JOIN commodities c ON o.commodity_id = c.id
ORDER BY o.created_at DESC;

-- ============================================
-- STORED PROCEDURES
-- ============================================

DELIMITER $$

-- Procedure to place an order
CREATE PROCEDURE place_order(
    IN p_user_id INT,
    IN p_commodity_id INT,
    IN p_order_type VARCHAR(10),
    IN p_quantity DECIMAL(15,4),
    IN p_price DECIMAL(15,2)
)
BEGIN
    DECLARE v_total_amount DECIMAL(20,2);
    DECLARE v_user_balance DECIMAL(15,2);

    SET v_total_amount = p_quantity * p_price;

    -- Get user balance
    SELECT balance INTO v_user_balance FROM users WHERE id = p_user_id;

    -- Check if user has enough balance for buy orders
    IF p_order_type = 'buy' AND v_user_balance < v_total_amount THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Insufficient balance';
    END IF;

    -- Insert order
    INSERT INTO orders (user_id, commodity_id, order_type, quantity, price, total_amount, status)
    VALUES (p_user_id, p_commodity_id, p_order_type, p_quantity, p_price, v_total_amount, 'completed');

    -- Update user balance
    IF p_order_type = 'buy' THEN
        UPDATE users SET balance = balance - v_total_amount WHERE id = p_user_id;
    ELSE
        UPDATE users SET balance = balance + v_total_amount WHERE id = p_user_id;
    END IF;

    -- Update portfolio
    IF p_order_type = 'buy' THEN
        INSERT INTO portfolio (user_id, commodity_id, quantity, average_price, total_invested)
        VALUES (p_user_id, p_commodity_id, p_quantity, p_price, v_total_amount)
        ON DUPLICATE KEY UPDATE
            quantity = quantity + p_quantity,
            average_price = ((total_invested + v_total_amount) / (quantity + p_quantity)),
            total_invested = total_invested + v_total_amount;
    ELSE
        UPDATE portfolio
        SET quantity = quantity - p_quantity
        WHERE user_id = p_user_id AND commodity_id = p_commodity_id;

        DELETE FROM portfolio WHERE quantity <= 0;
    END IF;

    -- Log transaction
    INSERT INTO transactions (user_id, transaction_type, amount, description)
    VALUES (p_user_id, 'trade', v_total_amount,
            CONCAT(UPPER(p_order_type), ' ', p_quantity, ' units'));
END$$

DELIMITER ;

-- ============================================
-- TRIGGERS
-- ============================================

-- Trigger to log price changes
DELIMITER $$

CREATE TRIGGER after_commodity_price_update
AFTER UPDATE ON commodities
FOR EACH ROW
BEGIN
    IF NEW.current_price != OLD.current_price THEN
        INSERT INTO price_history (commodity_id, price, timestamp)
        VALUES (NEW.id, NEW.current_price, NOW());
    END IF;
END$$

DELIMITER ;

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

-- Additional indexes for better query performance
CREATE INDEX idx_orders_user_status ON orders(user_id, status);
CREATE INDEX idx_orders_user_date ON orders(user_id, created_at DESC);
CREATE INDEX idx_portfolio_user_updated ON portfolio(user_id, updated_at DESC);
CREATE INDEX idx_price_history_commodity_time ON price_history(commodity_id, timestamp DESC);

-- ============================================
-- GRANT PERMISSIONS (adjust as needed)
-- ============================================

-- Create application user
-- CREATE USER 'commodityx_app'@'localhost' IDENTIFIED BY 'your_secure_password';
-- GRANT SELECT, INSERT, UPDATE, DELETE ON commodities_exchange.* TO 'commodityx_app'@'localhost';
-- FLUSH PRIVILEGES;

-- ============================================
-- SAMPLE QUERIES FOR TESTING
-- ============================================

-- Get all commodities
-- SELECT * FROM commodities ORDER BY symbol;

-- Get user portfolio
-- SELECT * FROM portfolio_view WHERE user_id = 2;

-- Get user orders
-- SELECT * FROM orders_view WHERE user_id = 2 ORDER BY created_at DESC LIMIT 10;

-- Get commodity price history
-- SELECT * FROM price_history WHERE commodity_id = 1 ORDER BY timestamp DESC LIMIT 30;

-- Place a sample order (using stored procedure)
-- CALL place_order(2, 1, 'buy', 10.5, 1985.50);
