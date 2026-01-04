const yf = require('yahoo-finance2').default;
const Commodity = require('../models/Commodity');
const { calculateRSI, calculateMACD, calculateBollinger } = require('../utils/indicators');

exports.fetchOilData = async () => {
  try {
    const result = await yf.chart('CL=F', {
      period1: new Date('2020-01-01'),
      period2: new Date('2024-12-31'),
      interval: '1d'
    });

    if (!result || !result.quotes || result.quotes.length === 0) {
      console.error("⚠️ No quote data returned.");
      return;
    }

    for (const quote of result.quotes) {
      const price = quote.adjclose;
      const date = new Date(quote.date);
      if (price == null) continue;

      const signal = price > 70 ? 'Sell' : price < 30 ? 'Buy' : 'Hold';

      await Commodity.create({ name: 'Crude Oil', date, price, signal });
    }

    console.log("✅ Data inserted successfully");
  } catch (err) {
    console.error("❌ Error fetching oil data:", err.message);
  }
};

exports.updateIndicators = async () => {
  try {
    const commodities = await Commodity.find().sort({ date: 1 });
    console.log(`📊 Found ${commodities.length} entries.`);

    const prices = commodities.map(c => c.price);
    const rsi = calculateRSI(prices);
    const macd = calculateMACD(prices);
    const boll = calculateBollinger(prices);

    for (let i = 0; i < commodities.length; i++) {
      let signal = 'Hold';
      if (rsi[i] > 70) signal = 'Sell';
      else if (rsi[i] < 30) signal = 'Buy';

      await Commodity.findByIdAndUpdate(commodities[i]._id, {
        rsi: rsi[i],
        macd: macd[i],
        bollingerBand: boll[i],
        signal
      });
    }

    console.log("✅ Indicators updated for all records");
  } catch (error) {
    console.error('❌ Error in updateIndicators:', error.message);
  }
};
