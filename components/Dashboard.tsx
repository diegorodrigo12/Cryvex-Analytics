
import React, { useState } from 'react';
import { CryptoCurrency } from '../types';

interface DashboardProps {
  cryptos: CryptoCurrency[];
  onSelectCoin: (id: string) => void;
  onCreateAlert: (id: string, intent: 'buy' | 'sell') => void;
  currency: 'usd' | 'brl';
  isUpdating?: boolean;
  lastUpdated?: number;
}

const MEMECOIN_LIST = ['DOGE', 'SHIB', 'PEPE', 'FLOKI', 'BONK', 'WIF', 'MYRO', 'MEME', 'COQ', 'BOME'];

const Dashboard: React.FC<DashboardProps> = ({ cryptos, onSelectCoin, onCreateAlert, currency, isUpdating, lastUpdated }) => {
  const [filter, setFilter] = useState<'all' | 'gainers' | 'losers' | 'memes'>('all');
  const [search, setSearch] = useState('');

  const filteredCryptos = [...cryptos]
    .filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.symbol.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => b.marketCap - a.marketCap);
  
  const displayCryptos = filteredCryptos.filter(c => {
    if (filter === 'gainers') return c.change24h > 0;
    if (filter === 'losers') return c.change24h < 0;
    if (filter === 'memes') return MEMECOIN_LIST.includes(c.symbol);
    return true;
  });

  const symbol = currency === 'brl' ? 'R$' : '$';

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-sm hover:border-indigo-500/30 transition-colors">
          <p className="text-slate-500 text-sm mb-1 uppercase tracking-wider font-semibold">Market Cap Global</p>
          <h3 className="text-2xl font-bold text-white">{symbol}2.45T</h3>
          <div className="mt-2 text-xs flex items-center gap-1">
            <span className="text-emerald-400 font-medium">↑ 1.2%</span>
            <span className="text-slate-600">nas últimas 24h</span>
          </div>
        </div>
        <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-sm hover:border-indigo-500/30 transition-colors">
          <p className="text-slate-500 text-sm mb-1 uppercase tracking-wider font-semibold">Dominância BTC</p>
          <h3 className="text-2xl font-bold text-white">52.4%</h3>
          <div className="mt-2 text-xs flex items-center gap-1">
            <span className="text-rose-400 font-medium">↓ 0.3%</span>
            <span className="text-slate-600">nas últimas 24h</span>
          </div>
        </div>
        <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-sm hover:border-indigo-500/30 transition-colors">
          <p className="text-slate-500 text-sm mb-1 uppercase tracking-wider font-semibold">Fear & Greed</p>
          <h3 className="text-2xl font-bold text-emerald-400">72 / Ganância</h3>
          <div className="mt-2 w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-emerald-400 h-full w-[72%]"></div>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="p-4 md:p-6 border-b border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white">Mercado em Tempo Real ({currency.toUpperCase()})</h3>
              {isUpdating && <div className="w-2 h-2 rounded-full bg-indigo-500 animate-ping"></div>}
            </div>
            <div className="flex items-center gap-2">
              <p className="text-xs text-slate-500">Dados ao vivo via CoinGecko</p>
              {lastUpdated && (
                <>
                  <span className="text-slate-700">•</span>
                  <p className="text-[10px] text-slate-500 font-mono">Atualizado: {new Date(lastUpdated).toLocaleTimeString()}</p>
                </>
              )}
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Buscar ativo..." 
                className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 w-full sm:w-64"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="flex gap-1 p-1 bg-slate-800 rounded-xl overflow-x-auto custom-scrollbar">
              <button 
                onClick={() => setFilter('all')}
                className={`px-3 py-1.5 text-xs rounded-lg transition-all font-bold whitespace-nowrap ${filter === 'all' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
              >
                Todos
              </button>
              <button 
                onClick={() => setFilter('memes')}
                className={`px-3 py-1.5 text-xs rounded-lg transition-all font-bold whitespace-nowrap ${filter === 'memes' ? 'bg-amber-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
              >
                Memecoins 🐕
              </button>
              <button 
                onClick={() => setFilter('gainers')}
                className={`px-3 py-1.5 text-xs rounded-lg transition-all font-bold whitespace-nowrap ${filter === 'gainers' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
              >
                Altas
              </button>
              <button 
                onClick={() => setFilter('losers')}
                className={`px-3 py-1.5 text-xs rounded-lg transition-all font-bold whitespace-nowrap ${filter === 'losers' ? 'bg-rose-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
              >
                Baixas
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-800/30 text-slate-500 text-xs uppercase tracking-widest font-bold">
                <th className="px-6 py-4"># Ativo</th>
                <th className="px-6 py-4 text-right">Preço</th>
                <th className="px-6 py-4 text-right">24h</th>
                <th className="px-6 py-4 text-right">Vol (24h)</th>
                <th className="px-6 py-4 text-center">Ação Rápida</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {displayCryptos.map((coin, index) => (
                <tr key={coin.id} className="hover:bg-indigo-500/5 transition-colors group cursor-pointer" onClick={() => onSelectCoin(coin.id)}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-slate-600 font-mono w-4">{index + 1}</span>
                      <div className="w-9 h-9 rounded-full overflow-hidden bg-slate-900 flex items-center justify-center border border-slate-700 group-hover:border-indigo-500/50 transition-all shadow-lg">
                        <img 
                          src={coin.image} 
                          alt={coin.symbol} 
                          className="w-full h-full object-cover p-1"
                          loading="lazy"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${coin.symbol}&background=1e293b&color=6366f1&bold=true`;
                          }}
                        />
                      </div>
                      <div>
                        <p className="font-bold text-white text-sm group-hover:text-indigo-400 transition-colors">{coin.name}</p>
                        <p className="text-[10px] text-slate-500 uppercase font-mono tracking-tight">{coin.symbol}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right font-mono text-sm font-medium">
                    {symbol}{coin.price > 1 ? coin.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : coin.price.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 6 })}
                  </td>
                  <td className={`px-6 py-4 text-right text-sm font-bold ${coin.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {coin.change24h.toFixed(2)}%
                  </td>
                  <td className="px-6 py-4 text-right text-sm text-slate-400 font-mono">
                    {symbol}{(coin.volume24h / 1000000000).toFixed(2)}B
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">
                      <button 
                        onClick={(e) => { e.stopPropagation(); onCreateAlert(coin.id, 'buy'); }}
                        className="px-2 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded border border-emerald-500/20 transition-all uppercase"
                      >
                        Comp.
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); onCreateAlert(coin.id, 'sell'); }}
                        className="px-2 py-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-[10px] font-bold rounded border border-rose-500/20 transition-all uppercase"
                      >
                        Vend.
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
