
import React from 'react';
import { CryptoCurrency, View } from '../types';

interface TopNavProps {
  onOpenSidebar: () => void;
  currentView: View;
  cryptos: CryptoCurrency[];
}

const TopNav: React.FC<TopNavProps> = ({ onOpenSidebar, currentView, cryptos }) => {
  const btc = cryptos.find(c => c.symbol === 'BTC');

  return (
    <header className="h-16 bg-slate-900/50 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-4 md:px-8 sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <button 
          onClick={onOpenSidebar}
          className="lg:hidden p-2 text-slate-400 hover:text-white"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h2 className="text-lg font-semibold text-white capitalize hidden md:block">
          {currentView}
        </h2>
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden sm:flex items-center gap-4 bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-700">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 uppercase font-bold">BTC/USD</span>
            <span className="text-sm font-mono font-medium text-emerald-400">
              ${btc?.price.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </span>
          </div>
          <div className="w-[1px] h-4 bg-slate-700"></div>
          <span className={`text-xs font-medium ${btc && btc.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {btc?.change24h}%
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button className="p-2 text-slate-400 hover:text-white transition-colors relative">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full border border-slate-900"></span>
          </button>
          <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center overflow-hidden cursor-pointer hover:border-indigo-500 transition-colors">
            <img src="https://picsum.photos/32/32?random=1" alt="Avatar" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopNav;
