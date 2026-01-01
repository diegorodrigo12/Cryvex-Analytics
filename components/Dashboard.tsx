
import React, { useState } from 'react';
import { CryptoCurrency } from '../types';

interface DashboardProps {
  cryptos: CryptoCurrency[];
  onSelectCoin: (id: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ cryptos, onSelectCoin }) => {
  const [filter, setFilter] = useState<'all' | 'gainers' | 'losers'>('all');

  const filteredCryptos = [...cryptos].sort((a, b) => b.marketCap - a.marketCap);
  
  const displayCryptos = filteredCryptos.filter(c => {
    if (filter === 'gainers') return c.change24h > 0;
    if (filter === 'losers') return c.change24h < 0;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-sm">
          <p className="text-slate-500 text-sm mb-1">Global Market Cap</p>
          <h3 className="text-2xl font-bold text-white">$2.45T</h3>
          <div className="mt-2 text-xs flex items-center gap-1">
            <span className="text-emerald-400 font-medium">↑ 1.2%</span>
            <span className="text-slate-600">vs yesterday</span>
          </div>
        </div>
        <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-sm">
          <p className="text-slate-500 text-sm mb-1">BTC Dominance</p>
          <h3 className="text-2xl font-bold text-white">52.4%</h3>
          <div className="mt-2 text-xs flex items-center gap-1">
            <span className="text-rose-400 font-medium">↓ 0.3%</span>
            <span className="text-slate-600">vs yesterday</span>
          </div>
        </div>
        <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-sm">
          <p className="text-slate-500 text-sm mb-1">Fear & Greed Index</p>
          <h3 className="text-2xl font-bold text-emerald-400">72 / Greed</h3>
          <div className="mt-2 w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-emerald-400 h-full w-[72%]"></div>
          </div>
        </div>
      </div>

      {/* Crypto List */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
        <div className="p-4 md:p-6 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-lg font-bold text-white">Top Criptoativos</h3>
          <div className="flex gap-2 p-1 bg-slate-800 rounded-lg self-start">
            <button 
              onClick={() => setFilter('all')}
              className={`px-3 py-1 text-xs rounded-md transition-all ${filter === 'all' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Todos
            </button>
            <button 
              onClick={() => setFilter('gainers')}
              className={`px-3 py-1 text-xs rounded-md transition-all ${filter === 'gainers' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Ganhadores
            </button>
            <button 
              onClick={() => setFilter('losers')}
              className={`px-3 py-1 text-xs rounded-md transition-all ${filter === 'losers' ? 'bg-rose-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Perdedores
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-800/30 text-slate-500 text-xs uppercase tracking-wider font-bold">
                <th className="px-6 py-4">Ativo</th>
                <th className="px-6 py-4 text-right">Preço</th>
                <th className="px-6 py-4 text-right">1h</th>
                <th className="px-6 py-4 text-right">24h</th>
                <th className="px-6 py-4 text-right">Volume (24h)</th>
                <th className="px-6 py-4 text-right">Mkt Cap</th>
                <th className="px-6 py-4">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {displayCryptos.map((coin) => (
                <tr key={coin.id} className="hover:bg-slate-800/40 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center font-bold text-xs">
                        {coin.symbol[0]}
                      </div>
                      <div>
                        <p className="font-bold text-white group-hover:text-indigo-400 transition-colors">{coin.name}</p>
                        <p className="text-xs text-slate-500">{coin.symbol}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right font-mono text-sm">
                    ${coin.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                  </td>
                  <td className={`px-6 py-4 text-right text-sm font-medium ${coin.change1h >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {coin.change1h > 0 ? '↑' : '↓'} {Math.abs(coin.change1h)}%
                  </td>
                  <td className={`px-6 py-4 text-right text-sm font-medium ${coin.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {coin.change24h > 0 ? '↑' : '↓'} {Math.abs(coin.change24h)}%
                  </td>
                  <td className="px-6 py-4 text-right text-sm text-slate-400">
                    ${(coin.volume24h / 1000000000).toFixed(2)}B
                  </td>
                  <td className="px-6 py-4 text-right text-sm text-slate-400">
                    ${(coin.marketCap / 1000000000).toFixed(2)}B
                  </td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => onSelectCoin(coin.id)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white rounded-lg text-xs font-medium transition-all"
                    >
                      Analisar
                    </button>
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
