
import React, { useState, useEffect, useCallback } from 'react';
import { View, CryptoCurrency, Alert } from './types';
import { MOCK_CRYPTOS } from './constants';
import Sidebar from './components/Sidebar';
import TopNav from './components/TopNav';
import Dashboard from './components/Dashboard';
import CoinDetail from './components/CoinDetail';
import Alerts from './components/Alerts';
import NewsFeed from './components/NewsFeed';
import PremiumGate from './components/PremiumGate';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [selectedCoinId, setSelectedCoinId] = useState<string | null>(null);
  const [cryptos, setCryptos] = useState<CryptoCurrency[]>(MOCK_CRYPTOS);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Simulate real-time price fluctuations
  useEffect(() => {
    const interval = setInterval(() => {
      setCryptos(prev => prev.map(c => ({
        ...c,
        price: c.price * (1 + (Math.random() * 0.002 - 0.001))
      })));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleCoinSelect = (id: string) => {
    setSelectedCoinId(id);
    setCurrentView('detail');
  };

  const selectedCoin = cryptos.find(c => c.id === selectedCoinId) || cryptos[0];

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard cryptos={cryptos} onSelectCoin={handleCoinSelect} />;
      case 'detail':
        return <CoinDetail coin={selectedCoin} />;
      case 'alerts':
        return <Alerts alerts={alerts} setAlerts={setAlerts} cryptos={cryptos} />;
      case 'news':
        return <NewsFeed cryptos={cryptos} />;
      case 'premium':
        return <PremiumGate />;
      default:
        return <Dashboard cryptos={cryptos} onSelectCoin={handleCoinSelect} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 overflow-hidden">
      {/* Mobile Sidebar Backdrop */}
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
