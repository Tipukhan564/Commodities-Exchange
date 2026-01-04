import React from 'react';

const Portfolio = ({ portfolio, onSell }) => {
  if (!portfolio || !portfolio.portfolio || portfolio.portfolio.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No holdings yet. Start trading to build your portfolio!</p>
      </div>
    );
  }

  const totalProfit = portfolio.portfolio.reduce((sum, item) => sum + (item.profit_loss || 0), 0);
  const totalInvested = portfolio.portfolio.reduce((sum, item) => sum + item.total_invested, 0);

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Portfolio</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
            <p className="text-sm text-gray-600">Total Invested</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              ${totalInvested.toFixed(2)}
            </p>
          </div>
          <div className={`bg-white p-6 rounded-xl shadow border ${totalProfit >= 0 ? 'border-green-200' : 'border-red-200'}`}>
            <p className="text-sm text-gray-600">Total P/L</p>
            <p className={`text-2xl font-bold mt-1 ${totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${totalProfit.toFixed(2)}
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
            <p className="text-sm text-gray-600">Current Value</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">
              ${portfolio.total_portfolio_value?.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Commodity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quantity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Avg Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Current Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Value
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                P/L
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {portfolio.portfolio.map((item) => (
              <tr key={item.commodity_symbol} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{item.name}</div>
                  <div className="text-sm text-gray-500">{item.commodity_symbol}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.quantity}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${item.average_price?.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    ${item.current_price?.toFixed(2)}
                  </div>
                  <div className={`text-xs ${item.change_percent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {item.change_percent >= 0 ? '▲' : '▼'} {Math.abs(item.change_percent).toFixed(2)}%
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  ${item.current_value?.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`text-sm font-bold ${item.profit_loss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${item.profit_loss?.toFixed(2)}
                  </div>
                  <div className={`text-xs ${item.profit_loss_percent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    ({item.profit_loss_percent?.toFixed(2)}%)
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => onSell({ ...item, symbol: item.commodity_symbol }, 'sell')}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Sell
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Portfolio;
