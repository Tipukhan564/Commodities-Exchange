import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { commoditiesAPI, tradingAPI } from '../services/api';
import CommodityCard from '../components/CommodityCard';
import Portfolio from '../components/Portfolio';
import Orders from '../components/Orders';
import Watchlist from '../components/Watchlist';
import TradeModal from '../components/TradeModal';
import Wallet from '../components/Wallet';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [commodities, setCommodities] = useState([]);
  const [portfolio, setPortfolio] = useState(null);
  const [activeTab, setActiveTab] = useState('market');
  const [selectedCommodity, setSelectedCommodity] = useState(null);
  const [tradeType, setTradeType] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      const [commoditiesRes, portfolioRes] = await Promise.all([
        commoditiesAPI.getAll(),
        tradingAPI.getPortfolio()
      ]);
      setCommodities(commoditiesRes.data);
      setPortfolio(portfolioRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const openTradeModal = (commodity, type) => {
    setSelectedCommodity(commodity);
    setTradeType(type);
  };

  const closeTradeModal = () => {
    setSelectedCommodity(null);
    setTradeType(null);
    loadData();
  };

  const tabs = [
    { id: 'market', label: 'Market', icon: '📈' },
    { id: 'portfolio', label: 'Portfolio', icon: '💼' },
    { id: 'orders', label: 'Orders', icon: '📋' },
    { id: 'watchlist', label: 'Watchlist', icon: '⭐' }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Commodities Exchange</h1>
              <p className="text-blue-100 mt-1">Welcome, {user?.username || 'Trader'}</p>
            </div>
            <div className="flex items-center space-x-4">
              <Wallet balance={user?.balance} onUpdate={loadData} />
              <button
                onClick={logout}
                className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Account Summary */}
      {portfolio && (
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
                <p className="text-sm font-medium text-green-600">Cash Balance</p>
                <p className="text-3xl font-bold text-green-700 mt-2">
                  ${portfolio.cash_balance?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
                <p className="text-sm font-medium text-blue-600">Portfolio Value</p>
                <p className="text-3xl font-bold text-blue-700 mt-2">
                  ${portfolio.total_portfolio_value?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
                <p className="text-sm font-medium text-purple-600">Total Value</p>
                <p className="text-3xl font-bold text-purple-700 mt-2">
                  ${portfolio.total_account_value?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl border border-orange-200">
                <p className="text-sm font-medium text-orange-600">Holdings</p>
                <p className="text-3xl font-bold text-orange-700 mt-2">
                  {portfolio.portfolio?.length || 0} Assets
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        ) : (
          <>
            {activeTab === 'market' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Market Commodities</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {commodities.map((commodity) => (
                    <CommodityCard
                      key={commodity.symbol}
                      commodity={commodity}
                      onBuy={() => openTradeModal(commodity, 'buy')}
                      onSell={() => openTradeModal(commodity, 'sell')}
                      portfolio={portfolio?.portfolio}
                    />
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'portfolio' && <Portfolio portfolio={portfolio} onSell={openTradeModal} />}
            {activeTab === 'orders' && <Orders />}
            {activeTab === 'watchlist' && <Watchlist onBuy={openTradeModal} />}
          </>
        )}
      </div>

      {/* Trade Modal */}
      {selectedCommodity && tradeType && (
        <TradeModal
          commodity={selectedCommodity}
          type={tradeType}
          onClose={closeTradeModal}
          balance={portfolio?.cash_balance}
          portfolio={portfolio?.portfolio}
        />
      )}
    </div>
  );
};

export default Dashboard;
