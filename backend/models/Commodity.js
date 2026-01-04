const mongoose = require('mongoose');

const commoditySchema = new mongoose.Schema({
  name: String,
  date: Date,
  price: Number,
  rsi: Number,
  macd: Object,
  bollingerBand: {
    upper: Number,
    lower: Number
  },
  signal: String
});

module.exports = mongoose.model('Commodity', commoditySchema);
