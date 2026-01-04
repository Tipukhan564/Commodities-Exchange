import React, { useState } from 'react';
import { transactionsAPI } from '../services/api';

const Wallet = ({ balance, onUpdate }) => {
  const [showModal, setShowModal] = useState(false);
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('deposit');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const amountNum = parseFloat(amount);
    if (!amountNum || amountNum <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    setLoading(true);

    try {
      if (type === 'deposit') {
        await transactionsAPI.deposit(amountNum);
      } else {
        await transactionsAPI.withdraw(amountNum);
      }

      alert(`${type === 'deposit' ? 'Deposit' : 'Withdrawal'} successful!`);
      setShowModal(false);
      setAmount('');
      onUpdate();
    } catch (err) {
      setError(err.response?.data?.error || 'Transaction failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg px-4 py-2 text-white">
        <div className="text-xs opacity-90">Balance</div>
        <div className="text-lg font-bold">${balance?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
        <button
          onClick={() => setShowModal(true)}
          className="text-xs bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-1 rounded mt-1 transition-colors"
        >
          Add/Withdraw
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Manage Wallet</h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setError('');
                  setAmount('');
                }}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="bg-gray-100 rounded-lg p-4 mb-6">
              <div className="text-sm text-gray-600">Current Balance</div>
              <div className="text-2xl font-bold text-gray-900">
                ${balance?.toFixed(2)}
              </div>
            </div>

            <div className="flex space-x-2 mb-6">
              <button
                onClick={() => setType('deposit')}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                  type === 'deposit'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Deposit
              </button>
              <button
                onClick={() => setType('withdraw')}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                  type === 'withdraw'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Withdraw
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter amount"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full font-bold py-3 px-4 rounded-lg transition-colors ${
                  type === 'deposit'
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-red-600 hover:bg-red-700 text-white'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {loading ? 'Processing...' : `Confirm ${type === 'deposit' ? 'Deposit' : 'Withdrawal'}`}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Wallet;
