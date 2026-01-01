
import React, { useState, useRef, useEffect } from 'react';
import { CryptoCurrency, View, Alert } from '../types';

interface TopNavProps {
  onOpenSidebar: () => void;
  currentView: View;
  cryptos: CryptoCurrency[];
  currency: 'usd' | 'brl';
  setCurrency: (c: 'usd' | 'brl') => void;
  onLogout: () => void;
  alerts: Alert[];
  user: { email: string };
}

const TopNav: React.FC<TopNavProps> = ({ 
  onOpenSidebar, 
  currentView, 
  cryptos, 
  currency, 
  setCurrency, 
  onLogout, 
  alerts,
  user
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  
  const btc = cryptos.find(c => c.symbol === 'BTC');
  const notificationRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfile(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-16 bg-slate-900/50 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-4 md:px-8 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <button 
          onClick={onOpenSidebar}
          className="lg:hidden p-2 text-slate-400 hover:text-white"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h2 className="text-lg font-bold text-white uppercase tracking-tight hidden md:block">
          {currentView === 'dashboard' ? 'Painel de Controle' : currentView}
        </h2>
      </div>

      <div className="flex items-center gap-4 md:gap-6">
        {/* Currency Switcher */}
        <div className="flex bg-slate-800 p-1 rounded-lg border border-slate-700">
          <button 
            onClick={() => setCurrency('usd')}
            className={`px-3 py-1 text-[10px] font-bold rounded uppercase transition-all ${currency === 'usd' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
          >
            USDT
          </button>
          <button 
            onClick={() => setCurrency('brl')}
            className={`px-3 py-1 text-[10px] font-bold rounded uppercase transition-all ${currency === 'brl' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
          >
            BRL
          </button>
        </div>

        {/* Live BTC Ticker */}
        <div className="hidden sm:flex items-center gap-4 bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-700">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">BTC/{currency.toUpperCase()}</span>
            <span className={`text-sm font-mono font-bold ${btc && btc.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {currency === 'brl' ? 'R$' : '$'}{btc?.price.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </span>
          </div>
          <div className="w-[1px] h-4 bg-slate-700"></div>
          <span className={`text-[10px] font-bold ${btc && btc.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {btc?.change24h > 0 ? '+' : ''}{btc?.change24h}%
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Notifications Dropdown */}
          <div className="relative" ref={notificationRef}>
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className={`p-2 rounded-xl transition-all relative ${showNotifications ? 'bg-indigo-600/10 text-indigo-400' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {alerts.length > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full border border-slate-900 animate-pulse"></span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-3 w-80 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="p-4 border-b border-slate-800 flex justify-between items-center">
                  <h3 className="text-sm font-bold text-white">Notificações</h3>
                  <span className="text-[10px] text-indigo-400 font-bold uppercase">{alerts.length} Alertas</span>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {alerts.length > 0 ? (
                    alerts.slice(0, 5).map(alert => {
                      const coin = cryptos.find(c => c.id === alert.coinId);
                      return (
                        <div key={alert.id} className="p-4 border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors cursor-pointer">
                          <p className="text-xs text-slate-300 font-medium">Alerta de {alert.intent === 'buy' ? 'Compra' : 'Venda'} para {coin?.symbol}</p>
                          <p className="text-[10px] text-slate-500 mt-1">Disparo em {currency === 'brl' ? 'R$' : '$'}{alert.value.toLocaleString()}</p>
                        </div>
                      );
                    })
                  ) : (
                    <div className="p-8 text-center">
                      <p className="text-xs text-slate-500">Nenhuma notificação nova.</p>
                    </div>
                  )}
                </div>
                <button className="w-full py-3 text-[10px] font-bold text-slate-400 hover:text-white bg-slate-800/50 uppercase tracking-widest transition-colors">Ver tudo</button>
              </div>
            )}
          </div>

          {/* Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <div 
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center gap-2 p-1 pl-1 pr-2 rounded-full border border-slate-800 hover:border-indigo-500 transition-all cursor-pointer bg-slate-800/30 group"
            >
              <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center overflow-hidden transition-all group-hover:ring-2 group-hover:ring-indigo-500/50">
                <img src={`https://ui-avatars.com/api/?name=${user.email}&background=6366f1&color=fff&bold=true`} alt="Avatar" />
              </div>
              <svg className={`w-3 h-3 text-slate-500 transition-transform ${showProfile ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            {showProfile && (
              <div className="absolute right-0 mt-3 w-56 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="p-4 bg-slate-800/50 border-b border-slate-800">
                  <p className="text-xs font-bold text-white truncate">{user.email}</p>
                  <p className="text-[10px] text-indigo-400 font-bold uppercase mt-0.5">Membro Cryvex</p>
                </div>
                <div className="p-2">
                  <button className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Meu Perfil
                  </button>
                  <button className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Configurações
                  </button>
                  <button className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                    Chaves de API
                  </button>
                  <div className="h-[1px] bg-slate-800 my-1"></div>
                  <button 
                    onClick={onLogout}
                    className="w-full flex items-center gap-3 px-3 py-2 text-xs font-bold text-rose-400 hover:bg-rose-400/10 rounded-lg transition-all"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sair
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopNav;
