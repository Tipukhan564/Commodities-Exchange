import React from 'react';
import { watchlistAPI } from '../services/api';

const CommodityCard = ({ commodity, onBuy, onSell, portfolio }) => {
  const userHolding = portfolio?.find(p => p.commodity_symbol === commodity.symbol);
  const changeColor = commodity.change_percent >= 0 ? 'text-green-600' : 'text-red-600';
  const changeBg = commodity.change_percent >= 0 ? 'bg-green-100' : 'bg-red-100';

  const handleAddToWatchlist = async () => {
    try {
      await watchlistAPI.add(commodity.symbol);
      alert('Added to watchlist!');
    } catch (error) {
      console.error('Error adding to watchlist:', error);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-200">
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold text-white">{commodity.name}</h3>
            <p className="text-blue-100 text-sm">{commodity.symbol}</p>
          </div>
          <button
            onClick={handleAddToWatchlist}
            className="text-white hover:text-yellow-300 transition-colors"
            title="Add to watchlist"
          >
            ⭐
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-4">
          <div className="text-3xl font-bold text-gray-900">
            ${commodity.current_price?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-semibold mt-2 ${changeBg} ${changeColor}`}>
            {commodity.change_percent >= 0 ? '▲' : '▼'} {Math.abs(commodity.change_percent).toFixed(2)}%
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Open:</span>
            <span className="font-medium">${commodity.open_price?.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">High:</span>
            <span className="font-medium text-green-600">${commodity.high_price?.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Low:</span>
            <span className="font-medium text-red-600">${commodity.low_price?.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Volume:</span>
            <span className="font-medium">{commodity.volume?.toLocaleString()}</span>
          </div>
        </div>

        {userHolding && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
            <p className="text-sm text-blue-700">
              <strong>Your Holdings:</strong> {userHolding.quantity} units
            </p>
            <p className="text-xs text-blue-600 mt-1">
              Avg Price: ${userHolding.average_price?.toFixed(2)}
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onBuy}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
            Buy
          </button>
          <button
            onClick={onSell}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            disabled={!userHolding}
          >
            Sell
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommodityCard;
