
import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  const [currency, setCurrency] = useState<'usd' | 'brl'>('usd');
  const [selectedCoinId, setSelectedCoinId] = useState<string | null>(null);
  const [cryptos, setCryptos] = useState<CryptoCurrency[]>(MOCK_CRYPTOS);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<number>(Date.now());
  const [pendingAlert, setPendingAlert] = useState<{coinId: string, intent: 'buy' | 'sell'} | null>(null);
  
  const isFetchingRef = useRef(false);

  const fetchMarketData = useCallback(async (isInitial = false) => {
    if (isFetchingRef.current) return;
    
    isFetchingRef.current = true;
    setIsUpdating(true);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=50&page=1&sparkline=false&price_change_percentage=1h,24h,7d`,
        { 
          method: 'GET',
          headers: { 'Accept': 'application/json' },
          signal: controller.signal
        }
      );
      
      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        
        const mappedData: CryptoCurrency[] = data.map((coin: any) => ({
          id: coin.id,
          symbol: coin.symbol.toUpperCase(),
          name: coin.name,
          price: coin.current_price,
          image: coin.image,
          change1h: coin.price_change_percentage_1h_in_currency || 0,
          change24h: coin.price_change_percentage_24h || 0,
          change7d: coin.price_change_percentage_7d_in_currency || 0,
          marketCap: coin.market_cap,
          volume24h: coin.total_volume,
          rsi: Math.floor(Math.random() * (70 - 40) + 40),
          macd: { value: Math.random() * 10, signal: Math.random() * 8 },
          trend: coin.price_change_percentage_24h > 0 ? 'Bullish' : coin.price_change_percentage_24h < 0 ? 'Bearish' : 'Neutral',
          strength: Math.abs(coin.price_change_percentage_24h) > 5 ? 'Strong' : 'Medium'
        }));

        setCryptos(mappedData);
        setLastUpdated(Date.now());
      } else {
        console.warn(`Market API responded with status: ${response.status}. Using cached/mock data.`);
      }
    } catch (error: any) {
      // Network errors or AbortErrors are caught here
      console.log('Market data sync notice: Using offline/mock data mode.');
      // If we don't have any cryptos yet (shouldn't happen with initial state), ensure we have mock data
      if (cryptos.length === 0) {
        setCryptos(MOCK_CRYPTOS);
      }
    } finally {
      setLoading(false);
      setIsUpdating(false);
      isFetchingRef.current = false;
    }
  }, [currency, cryptos.length]);

  useEffect(() => {
    fetchMarketData(true);
    // Poll less frequently to avoid triggering rate limits on free API tiers
    const interval = setInterval(() => fetchMarketData(), 90000); 
    return () => clearInterval(interval);
  }, [fetchMarketData]);

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
    // We only show the full-screen loader if we have absolutely NO data and are loading
    if (loading && cryptos.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-screen space-y-4 bg-slate-950">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          <p className="text-slate-400 font-medium animate-pulse">Iniciando Cryvex Analytics...</p>
        </div>
      );
    }

    switch (currentView) {
      case 'dashboard':
        return (
          <Dashboard 
            cryptos={cryptos} 
            onSelectCoin={handleCoinSelect} 
            onCreateAlert={handleCreateTradingAlert} 
            currency={currency}
            isUpdating={isUpdating}
            lastUpdated={lastUpdated}
          />
        );
      case 'detail':
        return (
          <CoinDetail 
            coin={selectedCoin} 
            onCreateAlert={handleCreateTradingAlert} 
            currency={currency}
          />
        );
      case 'alerts':
        return (
          <Alerts 
            alerts={alerts} 
            setAlerts={setAlerts} 
            cryptos={cryptos} 
            pendingAlert={pendingAlert}
            clearPending={() => setPendingAlert(null)}
            currency={currency}
          />
        );
      case 'news':
        return <NewsFeed cryptos={cryptos} />;
      case 'premium':
        return <PremiumGate />;
      default:
        return (
          <Dashboard 
            cryptos={cryptos} 
            onSelectCoin={handleCoinSelect} 
            onCreateAlert={handleCreateTradingAlert} 
            currency={currency}
            isUpdating={isUpdating}
            lastUpdated={lastUpdated}
          />
        );
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
        isUpdating={isUpdating}
      />
      
      <div className="flex-1 flex flex-col min-w-0">
        <TopNav 
          onOpenSidebar={() => setIsSidebarOpen(true)} 
          currentView={currentView}
          cryptos={cryptos}
          currency={currency}
          setCurrency={setCurrency}
          onLogout={handleLogout}
          alerts={alerts}
          user={user}
        />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 custom-scrollbar">
          {renderView()}
        </main>
      </div>
    </div>
  );
};

export default App;
