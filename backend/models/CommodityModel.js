const db = require('../config/database');

class CommodityModel {
  static getAll() {
    const stmt = db.prepare('SELECT * FROM commodities ORDER BY name');
    return stmt.all();
  }

  static getBySymbol(symbol) {
    const stmt = db.prepare('SELECT * FROM commodities WHERE symbol = ?');
    return stmt.get(symbol);
  }

  static updatePrice(symbol, priceData) {
    const {
      current_price,
      previous_close,
      open_price,
      high_price,
      low_price,
      volume,
      change_percent
    } = priceData;

    const stmt = db.prepare(`
      UPDATE commodities
      SET current_price = ?, previous_close = ?, open_price = ?, high_price = ?,
          low_price = ?, volume = ?, change_percent = ?, last_updated = CURRENT_TIMESTAMP
      WHERE symbol = ?
    `);
    return stmt.run(current_price, previous_close, open_price, high_price, low_price, volume, change_percent, symbol);
  }

  static create(commodityData) {
    const stmt = db.prepare(`
      INSERT INTO commodities (symbol, name, current_price, previous_close, open_price, high_price, low_price, volume, market_cap, change_percent)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(
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
    );
    return result.lastInsertRowid;
  }

  static delete(symbol) {
    const stmt = db.prepare('DELETE FROM commodities WHERE symbol = ?');
    return stmt.run(symbol);
  }
}

module.exports = CommodityModel;
