
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, CryptoCurrency, Alert } from './types';
import { MOCK_CRYPTOS } from './constants';
import Sidebar from './components/Sidebar';
import TopNav from './components/TopNav';
import Dashboard from './components/Dashboard';
import CoinDetail from './components/CoinDetail';
import Alerts from './components/Alerts';
import NewsFeed from './components/NewsFeed';
import UpcomingCoins from './components/UpcomingCoins';
import PremiumGate from './components/PremiumGate';
import Profile from './components/Profile';
import Settings from './components/Settings';
import Auth from './components/Auth';

interface User {
  email: string;
  name?: string;
  phone?: string;
  plan: 'Free' | 'Pro';
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'buy' | 'sell' | 'info';
}

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [currency, setCurrency] = useState<'usd' | 'brl'>('usd');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [selectedCoinId, setSelectedCoinId] = useState<string | null>(null);
  const [cryptos, setCryptos] = useState<CryptoCurrency[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<number>(Date.now());
  const [pendingAlert, setPendingAlert] = useState<{coinId: string, intent: 'buy' | 'sell'} | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);
  
  const isFetchingRef = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const handleLoginSuccess = (email: string) => {
    const savedUsers = localStorage.getItem('cryvex_users');
    const users = savedUsers ? JSON.parse(savedUsers) : [];
    const userData = users.find((u: any) => u.email === email);
    setUser({
      email: userData?.email || email,
      name: userData?.name || 'Investidor',
      phone: userData?.phone || '',
      plan: 'Free'
    });
  };

  const fetchMarketData = useCallback(async () => {
    if (isFetchingRef.current) return;
    
    // Cancela requisição anterior se houver
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    abortControllerRef.current = new AbortController();
    isFetchingRef.current = true;
    setIsUpdating(true);
    
    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=50&page=1&sparkline=false&price_change_percentage=24h`,
        { 
          headers: { 'Accept': 'application/json' },
          signal: abortControllerRef.current.signal
        }
      );
      
      if (response.status === 429) {
        setIsDemoMode(true);
        throw new Error("Taxa limite atingida. Ativando modo demonstração.");
      }

      if (response.ok) {
        const data = await response.json();
        const mappedData: CryptoCurrency[] = data.map((coin: any) => ({
          id: coin.id,
          symbol: coin.symbol.toUpperCase(),
          name: coin.name,
          price: coin.current_price,
          image: coin.image,
          change1h: 0, 
          change24h: coin.price_change_percentage_24h || 0,
          change7d: 0,
          marketCap: coin.market_cap,
          volume24h: coin.total_volume,
          rsi: Math.floor(45 + Math.random() * 20),
          macd: { value: 2, signal: 1 },
          trend: coin.price_change_percentage_24h > 0 ? 'Bullish' : 'Bearish',
          strength: 'Medium'
        }));
        setCryptos(mappedData);
        setLastUpdated(Date.now());
        setIsDemoMode(false);
      }
    } catch (e: any) {
      if (e.name === 'AbortError') return;
      console.warn("Market Sync Alert:", e.message);
      setIsDemoMode(true);
      if (cryptos.length === 0) setCryptos(MOCK_CRYPTOS);
    } finally {
      setLoading(false);
      setIsUpdating(false);
      isFetchingRef.current = false;
    }
  }, [currency, cryptos.length]);

  useEffect(() => {
    fetchMarketData();
    const interval = setInterval(() => fetchMarketData(), 45000); 
    return () => {
      clearInterval(interval);
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, [fetchMarketData]);

  const handleLogout = () => {
    setUser(null);
    setCurrentView('dashboard');
  };

  const selectedCoin = cryptos.find(c => c.id === selectedCoinId) || cryptos[0] || MOCK_CRYPTOS[0];

  if (!user) return <Auth onLogin={handleLoginSuccess} />;

  return (
    <div className={`flex min-h-screen transition-all duration-500 overflow-hidden relative ${theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} onLogout={handleLogout} user={user} isUpdating={isUpdating} />
      
      <div className="flex-1 flex flex-col min-w-0 h-screen">
        <TopNav onOpenSidebar={() => setIsSidebarOpen(true)} currentView={currentView} setCurrentView={setCurrentView} cryptos={cryptos} currency={currency} setCurrency={setCurrency} onLogout={handleLogout} alerts={alerts} user={user} />
        
        {isDemoMode && (
          <div className="bg-amber-500/10 border-b border-amber-500/20 px-6 py-2 flex items-center justify-between z-40">
            <p className="text-[10px] text-amber-500 font-bold uppercase tracking-widest flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
              Modo Demonstração Ativo (API em Cooldown)
            </p>
            <button onClick={fetchMarketData} className="text-[9px] text-amber-500 underline font-bold uppercase">Tentar Reconectar</button>
          </div>
        )}

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 custom-scrollbar">
          {loading && cryptos.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-slate-500 animate-pulse font-bold uppercase text-xs tracking-widest">Sincronizando Nodes...</p>
            </div>
          ) : (
            <>
              {currentView === 'dashboard' && <Dashboard cryptos={cryptos} onSelectCoin={(id) => { setSelectedCoinId(id); setCurrentView('detail'); }} onCreateAlert={(id, intent) => { setSelectedCoinId(id); setPendingAlert({coinId: id, intent}); setCurrentView('alerts'); }} currency={currency} isUpdating={isUpdating} lastUpdated={lastUpdated} />}
              {currentView === 'detail' && <CoinDetail coin={selectedCoin} onCreateAlert={(id, intent) => { setPendingAlert({coinId: id, intent}); setCurrentView('alerts'); }} currency={currency} />}
              {currentView === 'alerts' && <Alerts alerts={alerts} setAlerts={setAlerts} cryptos={cryptos} pendingAlert={pendingAlert} clearPending={() => setPendingAlert(null)} currency={currency} />}
              {currentView === 'news' && <NewsFeed cryptos={cryptos} />}
              {currentView === 'upcoming' && <UpcomingCoins />}
              {currentView === 'premium' && <PremiumGate user={user} onUpgrade={() => setUser({...user, plan: 'Pro'})} />}
              {currentView === 'profile' && <Profile user={user} />}
              {currentView === 'settings' && <Settings currency={currency} setCurrency={setCurrency} theme={theme} setTheme={setTheme} />}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
