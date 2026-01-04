function calculateRSI(prices, period = 14) {
  if (!Array.isArray(prices) || prices.length < period + 1) return Array(prices.length).fill(null);

  let gains = [], losses = [], rsi = [];

  for (let i = 1; i < prices.length; i++) {
    const diff = prices[i] - prices[i - 1];
    if (diff >= 0) gains.push(diff), losses.push(0);
    else losses.push(-diff), gains.push(0);
  }

  for (let i = 0; i < gains.length - period + 1; i++) {
    const avgGain = average(gains.slice(i, i + period));
    const avgLoss = average(losses.slice(i, i + period));
    const rs = avgGain / (avgLoss || 1);
    rsi.push(100 - 100 / (1 + rs));
  }

  while (rsi.length < prices.length) rsi.unshift(null);
  return rsi;
}

function calculateMACD(prices, short = 12, long = 26, signal = 9) {
  if (!Array.isArray(prices) || prices.length < long + signal) {
    return {
      macd: Array(prices.length).fill(null),
      signal: Array(prices.length).fill(null),
      histogram: Array(prices.length).fill(null)
    };
  }

  const emaShort = exponentialMovingAverage(prices, short);
  const emaLong = exponentialMovingAverage(prices, long);
  let macdLine = emaShort.map((val, i) => val - (emaLong[i] || 0));
  let signalLine = exponentialMovingAverage(macdLine, signal);
  let histogram = macdLine.map((val, i) => val - (signalLine[i] || 0));

  while (macdLine.length < prices.length) macdLine.unshift(null);
  while (signalLine.length < prices.length) signalLine.unshift(null);
  while (histogram.length < prices.length) histogram.unshift(null);

  return { macd: macdLine, signal: signalLine, histogram };
}

function calculateBollinger(prices, period = 20, multiplier = 2) {
  if (!Array.isArray(prices) || prices.length < period) return Array(prices.length).fill({ upper: null, lower: null });

  let bands = [];
  for (let i = 0; i < prices.length; i++) {
    if (i < period) {
      bands.push({ upper: null, lower: null });
      continue;
    }
    const slice = prices.slice(i - period, i);
    const avg = average(slice);
    const stdDev = Math.sqrt(average(slice.map(p => (p - avg) ** 2)));
    bands.push({ upper: avg + multiplier * stdDev, lower: avg - multiplier * stdDev });
  }
  return bands;
}

function average(arr) {
  if (!Array.isArray(arr) || arr.length === 0) return 0;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function exponentialMovingAverage(prices, period) {
  if (!Array.isArray(prices) || prices.length < period) return Array(prices.length).fill(null);

  let ema = [], k = 2 / (period + 1);
  ema[0] = average(prices.slice(0, period));
  for (let i = period; i < prices.length; i++) {
    ema.push(prices[i] * k + ema[ema.length - 1] * (1 - k));
  }
  while (ema.length < prices.length) ema.unshift(null);
  return ema;
}

module.exports = {
  calculateRSI,
  calculateMACD,
  calculateBollinger
};
