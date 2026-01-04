import React, { useState, useEffect } from 'react';
import { tradingAPI } from '../services/api';

const TradeModal = ({ commodity, type, onClose, balance, portfolio }) => {
  const [quantity, setQuantity] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const userHolding = portfolio?.find(p => p.commodity_symbol === commodity.symbol);
  const maxQuantity = type === 'sell' ? (userHolding?.quantity || 0) : Math.floor(balance / commodity.current_price);
  const totalCost = quantity * commodity.current_price;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!quantity || quantity <= 0) {
      setError('Please enter a valid quantity');
      return;
    }

    if (type === 'buy' && totalCost > balance) {
      setError('Insufficient balance');
      return;
    }

    if (type === 'sell' && quantity > (userHolding?.quantity || 0)) {
      setError('Insufficient holdings');
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        commodity_symbol: commodity.symbol,
        quantity: parseFloat(quantity),
        price: commodity.current_price
      };

      if (type === 'buy') {
        await tradingAPI.buy(orderData);
      } else {
        await tradingAPI.sell(orderData);
      }

      alert(`${type === 'buy' ? 'Buy' : 'Sell'} order placed successfully!`);
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const setMaxQuantity = () => {
    setQuantity(maxQuantity.toString());
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {type === 'buy' ? 'Buy' : 'Sell'} {commodity.name}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="bg-gray-100 rounded-lg p-4 mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Current Price:</span>
            <span className="font-bold text-lg">${commodity.current_price?.toFixed(2)}</span>
          </div>
          {type === 'buy' && (
            <div className="flex justify-between">
              <span className="text-gray-600">Available Balance:</span>
              <span className="font-semibold text-green-600">${balance?.toFixed(2)}</span>
            </div>
          )}
          {type === 'sell' && userHolding && (
            <div className="flex justify-between">
              <span className="text-gray-600">Your Holdings:</span>
              <span className="font-semibold text-blue-600">{userHolding.quantity} units</span>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantity
            </label>
            <div className="flex">
              <input
                type="number"
                step="0.0001"
                min="0"
                max={maxQuantity}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter quantity"
              />
              <button
                type="button"
                onClick={setMaxQuantity}
                className="bg-gray-200 hover:bg-gray-300 px-4 py-3 rounded-r-lg font-medium"
              >
                Max
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Max: {maxQuantity.toFixed(4)} units
            </p>
          </div>

          {quantity > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex justify-between text-lg font-semibold">
                <span>Total {type === 'buy' ? 'Cost' : 'Revenue'}:</span>
                <span className={type === 'buy' ? 'text-red-600' : 'text-green-600'}>
                  ${totalCost.toFixed(2)}
                </span>
              </div>
            </div>
          )}

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-4 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !quantity}
              className={`flex-1 font-bold py-3 px-4 rounded-lg transition-colors ${
                type === 'buy'
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-red-600 hover:bg-red-700 text-white'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {loading ? 'Processing...' : `Confirm ${type === 'buy' ? 'Buy' : 'Sell'}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TradeModal;
