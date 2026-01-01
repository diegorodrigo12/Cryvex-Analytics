
import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CryptoCurrency, MarketHistory } from '../types';
import AiAnalysis from './AiAnalysis';

interface CoinDetailProps {
  coin: CryptoCurrency;
  onCreateAlert: (id: string, intent: 'buy' | 'sell') => void;
}

const CoinDetail: React.FC<CoinDetailProps> = ({ coin, onCreateAlert }) => {
  const chartData: MarketHistory[] = useMemo(() => {
    const data: MarketHistory[] = [];
    let currentPrice = coin.price * (1 - (coin.change24h / 100));
    for (let i = 0; i < 24; i++) {
      currentPrice = currentPrice * (1 + (Math.random() * 0.01 - 0.005));
      data.push({
        time: `${i}:00`,
        price: currentPrice
      });
    }
    return data;
  }, [coin.id, coin.price, coin.change24h]);

  const getIconUrl = (symbol: string) => `https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/${symbol.toLowerCase()}.png`;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center border border-slate-800 overflow-hidden">
            <img 
              src={getIconUrl(coin.symbol)} 
              alt={coin.symbol} 
              className="w-10 h-10 object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${coin.symbol}&background=1e293b&color=6366f1&bold=true&size=128`;
              }}
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-3xl font-bold text-white">{coin.name}</h2>
              <span className="text-slate-500 font-mono">{coin.symbol}</span>
            </div>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-2xl font-mono font-bold text-white">
                ${coin.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className={`px-2 py-0.5 rounded-md text-sm font-bold ${coin.change24h >= 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                {coin.change24h > 0 ? '+' : ''}{coin.change24h}%
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button 
            onClick={() => onCreateAlert(coin.id, 'buy')}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-emerald-600/20"
          >
            Configurar Compra
          </button>
          <button 
            onClick={() => onCreateAlert(coin.id, 'sell')}
            className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-rose-600/20"
          >
            Configurar Venda
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 shadow-xl">
            <div className="flex items-center justify-between mb-8">
              <h4 className="text-slate-400 font-medium">Histórico de Preço (24h)</h4>
              <div className="flex gap-1 bg-slate-800 p-1 rounded-lg">
                {['1h', '4h', '1d', '1w'].map(t => (
                  <button key={t} className={`px-3 py-1 text-xs rounded-md ${t === '1d' ? 'bg-slate-700 text-white' : 'text-slate-500 hover:text-slate-300'}`}>{t}</button>
                ))}
              </div>
            </div>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="time" hide />
                  <YAxis hide domain={['auto', 'auto']} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                    formatter={(value: number) => [`$${value.toFixed(2)}`, 'Price']}
                  />
                  <Area type="monotone" dataKey="price" stroke="#6366f1" fillOpacity={1} fill="url(#colorPrice)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-emerald-500/5 border border-emerald-500/20 p-6 rounded-3xl">
              <div className="flex items-center gap-3 mb-4 text-emerald-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <h4 className="font-bold">Estratégia de Compra</h4>
              </div>
              <p className="text-sm text-slate-400 mb-6">Defina um preço alvo abaixo do valor atual para acumular {coin.symbol} em quedas de mercado.</p>
              <button 
                onClick={() => onCreateAlert(coin.id, 'buy')}
                className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-bold transition-all"
              >
                Definir Alvo de Compra
              </button>
            </div>
            <div className="bg-rose-500/5 border border-rose-500/20 p-6 rounded-3xl">
              <div className="flex items-center gap-3 mb-4 text-rose-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                <h4 className="font-bold">Estratégia de Venda</h4>
              </div>
              <p className="text-sm text-slate-400 mb-6">Defina metas de lucro para sair da posição automaticamente quando {coin.symbol} atingir sua valorização alvo.</p>
              <button 
                onClick={() => onCreateAlert(coin.id, 'sell')}
                className="w-full py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-sm font-bold transition-all"
              >
                Definir Alvo de Venda
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 shadow-xl">
            <h4 className="text-slate-400 font-medium mb-4">Indicadores Técnicos</h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">RSI (14)</span>
                <span className={`font-mono font-bold ${coin.rsi > 70 ? 'text-rose-400' : coin.rsi < 30 ? 'text-emerald-400' : 'text-white'}`}>
                  {coin.rsi}
                </span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden relative">
                <div className="absolute left-[30%] right-[30%] h-full bg-slate-700 opacity-50"></div>
                <div 
                  className={`absolute h-full w-2 rounded-full -ml-1 transition-all duration-1000 ${coin.rsi > 70 ? 'bg-rose-500' : coin.rsi < 30 ? 'bg-emerald-500' : 'bg-indigo-500'}`} 
                  style={{ left: `${coin.rsi}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">Tendência</span>
                <span className={`px-2 py-0.5 rounded text-xs font-bold ${coin.trend === 'Bullish' ? 'bg-emerald-500/20 text-emerald-400' : coin.trend === 'Bearish' ? 'bg-rose-500/20 text-rose-400' : 'bg-slate-500/20 text-slate-400'}`}>
                  {coin.trend.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          <AiAnalysis coin={coin} />
        </div>
      </div>
    </div>
  );
};

export default CoinDetail;
