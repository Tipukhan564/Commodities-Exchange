-- Insert commodity data for the Commodities Exchange
-- Run this after running mysql_schema.sql

USE commodities_exchange;

-- Clear existing commodities (optional)
DELETE FROM commodities;

-- Insert commodity data with realistic prices
INSERT INTO commodities (symbol, name, current_price, price_change_24h, high_24h, low_24h, volume_24h, updated_at) VALUES
('GC=F', 'Gold', 2050.00, 15.50, 2065.00, 2035.00, 1250000.50, NOW()),
('SI=F', 'Silver', 24.50, -0.35, 24.90, 24.20, 850000.75, NOW()),
('CL=F', 'Crude Oil', 75.25, 2.10, 76.50, 73.80, 5500000.00, NOW()),
('NG=F', 'Natural Gas', 2.85, -0.15, 2.95, 2.75, 3200000.00, NOW()),
('HG=F', 'Copper', 3.85, 0.08, 3.92, 3.78, 920000.50, NOW()),
('PL=F', 'Platinum', 925.00, -8.50, 935.00, 920.00, 180000.25, NOW()),
('PA=F', 'Palladium', 1050.00, 12.00, 1065.00, 1035.00, 95000.50, NOW()),
('ZC=F', 'Corn', 4.75, 0.12, 4.82, 4.68, 2100000.00, NOW()),
('ZW=F', 'Wheat', 5.90, -0.22, 6.05, 5.85, 1650000.00, NOW()),
('KC=F', 'Coffee', 1.85, 0.05, 1.89, 1.81, 750000.00, NOW());

-- Verify the data was inserted
SELECT * FROM commodities;

