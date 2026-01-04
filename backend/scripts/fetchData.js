// 📁 scripts/fetchData.js
require('dotenv').config();
const mongoose = require('mongoose');
const yf = require('yahoo-finance2').default;
const Commodity = require('../models/Commodity');

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected for data fetch");
  } catch (error) {
    console.error("❌ DB connection error:", error.message);
    process.exit(1);
  }
}
async function getOilData() {
  try {
    const result = await yf.chart('CL=F', {
      period1: new Date('2020-01-01'),
      period2: new Date('2024-12-31'),
      interval: '1d'
    });

    if (!result || !result.quotes || result.quotes.length === 0) {
      console.error("⚠️ No quote data returned. Please check symbol or API rate limit.");
      return;
    }

    for (const quote of result.quotes) {
      const price = quote.adjclose;
      const date = new Date(quote.date);

      if (price == null) continue;

      const signal = price > 70 ? 'Sell' : price < 30 ? 'Buy' : 'Hold';

      await Commodity.create({
        name: 'Crude Oil',
        date,
        price,
        signal
      });
    }

    console.log("✅ Data with signal inserted successfully");
  } catch (error) {
    console.error("❌ Error fetching data:", error.message);
  } finally {
    await mongoose.disconnect();
    process.exit();
  }
}


(async () => {
  await connectDB();
  await getOilData();
})();
