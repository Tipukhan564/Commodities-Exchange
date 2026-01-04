const pool = require('../config/mysqlDatabase');

class CommodityModel {
  static async getAll() {
    const [rows] = await pool.query('SELECT * FROM commodities ORDER BY name');
    return rows;
  }

  static async getBySymbol(symbol) {
    const [rows] = await pool.query('SELECT * FROM commodities WHERE symbol = ?', [symbol]);
    return rows[0];
  }

  static async updatePrice(symbol, priceData) {
    const {
      current_price,
      previous_close,
      open_price,
      high_price,
      low_price,
      volume,
      change_percent
    } = priceData;

    const [result] = await pool.query(
      `UPDATE commodities
       SET current_price = ?, previous_close = ?, open_price = ?, high_price = ?,
           low_price = ?, volume = ?, change_percent = ?, last_updated = CURRENT_TIMESTAMP
       WHERE symbol = ?`,
      [current_price, previous_close, open_price, high_price, low_price, volume, change_percent, symbol]
    );
    return result;
  }

  static async create(commodityData) {
    const [result] = await pool.query(
      `INSERT INTO commodities (symbol, name, current_price, previous_close, open_price, high_price, low_price, volume, market_cap, change_percent)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        commodityData.symbol,
        commodityData.name,
        commodityData.current_price,
        commodityData.previous_close,
        commodityData.open_price,
        commodityData.high_price,
        commodityData.low_price,
        commodityData.volume,
        commodityData.market_cap,
        commodityData.change_percent
      ]
    );
    return result.insertId;
  }

  static async delete(symbol) {
    const [result] = await pool.query('DELETE FROM commodities WHERE symbol = ?', [symbol]);
    return result;
  }
}

module.exports = CommodityModel;
