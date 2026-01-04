const CommodityModel = require('../models/CommodityModel');

class CommodityController {
  static async getAllCommodities(req, res) {
    try {
      const commodities = CommodityModel.getAll();
      res.json(commodities);
    } catch (err) {
      console.error('Fetch commodities error:', err);
      res.status(500).json({ error: 'Server error fetching commodities' });
    }
  }

  static async getCommodityBySymbol(req, res) {
    try {
      const { symbol } = req.params;
      const commodity = CommodityModel.getBySymbol(symbol);

      if (!commodity) {
        return res.status(404).json({ error: 'Commodity not found' });
      }

      res.json(commodity);
    } catch (err) {
      console.error('Fetch commodity error:', err);
      res.status(500).json({ error: 'Server error fetching commodity' });
    }
  }

  static async updateCommodityPrice(req, res) {
    try {
      const { symbol } = req.params;
      const priceData = req.body;

      const commodity = CommodityModel.getBySymbol(symbol);
      if (!commodity) {
        return res.status(404).json({ error: 'Commodity not found' });
      }

      CommodityModel.updatePrice(symbol, priceData);

      res.json({
        message: 'Commodity price updated successfully',
        commodity: CommodityModel.getBySymbol(symbol)
      });
    } catch (err) {
      console.error('Update price error:', err);
      res.status(500).json({ error: 'Server error updating price' });
    }
  }

  static async createCommodity(req, res) {
    try {
      const commodityData = req.body;
      const id = CommodityModel.create(commodityData);

      res.status(201).json({
        message: 'Commodity created successfully',
        id
      });
    } catch (err) {
      console.error('Create commodity error:', err);
      res.status(500).json({ error: 'Server error creating commodity' });
    }
  }

  static async deleteCommodity(req, res) {
    try {
      const { symbol } = req.params;
      CommodityModel.delete(symbol);

      res.json({ message: 'Commodity deleted successfully' });
    } catch (err) {
      console.error('Delete commodity error:', err);
      res.status(500).json({ error: 'Server error deleting commodity' });
    }
  }
}

module.exports = CommodityController;
