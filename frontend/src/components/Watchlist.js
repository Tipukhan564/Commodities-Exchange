import React, { useState, useEffect } from 'react';
import { watchlistAPI } from '../services/api';

const Watchlist = ({ onBuy }) => {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWatchlist();
  }, []);

  const loadWatchlist = async () => {
    try {
      const response = await watchlistAPI.get();
      setWatchlist(response.data);
    } catch (error) {
      console.error('Error loading watchlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (commoditySymbol) => {
    try {
      await watchlistAPI.remove(commoditySymbol);
      setWatchlist(watchlist.filter(item => item.commodity_symbol !== commoditySymbol));
    } catch (error) {
      console.error('Error removing from watchlist:', error);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading watchlist...</div>;
  }

  if (watchlist.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Your watchlist is empty. Add commodities to track them!</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Watchlist</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {watchlist.map((item) => (
          <div key={item.commodity_symbol} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-400 p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-white">{item.name}</h3>
                  <p className="text-yellow-100 text-sm">{item.commodity_symbol}</p>
                </div>
                <button
                  onClick={() => handleRemove(item.commodity_symbol)}
                  className="text-white hover:text-red-200 transition-colors font-bold text-xl"
                  title="Remove from watchlist"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-4">
                <div className="text-3xl font-bold text-gray-900">
                  ${item.current_price?.toFixed(2)}
                </div>
                <div className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-semibold mt-2 ${
                  item.change_percent >= 0
                    ? 'bg-green-100 text-green-600'
                    : 'bg-red-100 text-red-600'
                }`}>
                  {item.change_percent >= 0 ? '▲' : '▼'} {Math.abs(item.change_percent).toFixed(2)}%
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">High:</span>
                  <span className="font-medium text-green-600">${item.high_price?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Low:</span>
                  <span className="font-medium text-red-600">${item.low_price?.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={() => onBuy({ ...item, symbol: item.commodity_symbol }, 'buy')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
              >
                Trade Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Watchlist;
