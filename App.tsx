
import React, { useState, useEffect } from 'react';
import { View, CryptoCurrency, Alert } from './types';
import { MOCK_CRYPTOS } from './constants';
import Sidebar from './components/Sidebar';
import TopNav from './components/TopNav';
import Dashboard from './components/Dashboard';
import CoinDetail from './components/CoinDetail';
import Alerts from './components/Alerts';
import NewsFeed from './components/NewsFeed';
import PremiumGate from './components/PremiumGate';
import Auth from './components/Auth';

const App: React.FC = () => {
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [selectedCoinId, setSelectedCoinId] = useState<string | null>(null);
  const [cryptos, setCryptos] = useState<CryptoCurrency[]>(MOCK_CRYPTOS);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pendingAlert, setPendingAlert] = useState<{coinId: string, intent: 'buy' | 'sell'} | null>(null);

  const fetchMarketData = async () => {
    try {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false&price_change_percentage=1h,24h,7d'
      );
      if (!response.ok) throw new Error('API limit reached');
      const data = await response.json();
      
      const mappedData: CryptoCurrency[] = data.map((coin: any) => ({
        id: coin.id,
        symbol: coin.symbol.toUpperCase(),
        name: coin.name,
        price: coin.current_price,
        change1h: coin.price_change_percentage_1h_in_currency || 0,
        change24h: coin.price_change_percentage_24h || 0,
        change7d: coin.price_change_percentage_7d_in_currency || 0,
        marketCap: coin.market_cap,
        volume24h: coin.total_volume,
        rsi: Math.floor(Math.random() * (75 - 35) + 35),
        macd: { value: Math.random() * 100, signal: Math.random() * 80 },
        trend: coin.price_change_percentage_24h > 0 ? 'Bullish' : 'Bearish',
        strength: Math.abs(coin.price_change_percentage_24h) > 5 ? 'Strong' : 'Medium'
      }));

      setCryptos(mappedData);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch real market data, using mocks:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketData();
    const interval = setInterval(fetchMarketData, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleCoinSelect = (id: string) => {
    setSelectedCoinId(id);
    setCurrentView('detail');
  };

  const handleCreateTradingAlert = (id: string, intent: 'buy' | 'sell') => {
    setPendingAlert({ coinId: id, intent });
    setCurrentView('alerts');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('dashboard');
  };

  const selectedCoin = cryptos.find(c => c.id === selectedCoinId) || cryptos[0];

  if (!user) {
    return <Auth onLogin={(email) => setUser({ email })} />;
  }

  const renderView = () => {
    if (loading && cryptos.length === 0) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      );
    }

    switch (currentView) {
      case 'dashboard':
        return <Dashboard cryptos={cryptos} onSelectCoin={handleCoinSelect} onCreateAlert={handleCreateTradingAlert} />;
      case 'detail':
        return <CoinDetail coin={selectedCoin} onCreateAlert={handleCreateTradingAlert} />;
      case 'alerts':
        return (
          <Alerts 
            alerts={alerts} 
            setAlerts={setAlerts} 
            cryptos={cryptos} 
            pendingAlert={pendingAlert}
            clearPending={() => setPendingAlert(null)}
          />
        );
      case 'news':
        return <NewsFeed cryptos={cryptos} />;
      case 'premium':
        return <PremiumGate />;
      default:
        return <Dashboard cryptos={cryptos} onSelectCoin={handleCoinSelect} onCreateAlert={handleCreateTradingAlert} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 overflow-hidden">
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <Sidebar 
        currentView={currentView} 
        setCurrentView={setCurrentView} 
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        onLogout={handleLogout}
        userEmail={user.email}
      />
      
      <div className="flex-1 flex flex-col min-w-0">
        <TopNav 
          onOpenSidebar={() => setIsSidebarOpen(true)} 
          currentView={currentView}
          cryptos={cryptos}
        />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 custom-scrollbar">
          {renderView()}
        </main>
      </div>
    </div>
  );
};

export default App;
