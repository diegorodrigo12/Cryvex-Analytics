
import React, { useMemo, useState, useEffect, useCallback, useRef } from 'react';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, ReferenceLine
} from 'recharts';
import { CryptoCurrency } from '../types';
import AiAnalysis from './AiAnalysis';
import TradingViewWidget from './TradingViewWidget';

interface CoinDetailProps {
  coin: CryptoCurrency;
  onCreateAlert: (id: string, intent: 'buy' | 'sell') => void;
  currency: 'usd' | 'brl';
}

type Interval = '1s' | '15m' | '1h' | '4h' | '1d' | '1w';
const intervals: Interval[] = ['1s', '15m', '1h', '4h', '1d', '1w'];
type ChartMode = 'original' | 'tradingview';

const CoinDetail: React.FC<CoinDetailProps> = ({ coin, onCreateAlert, currency }) => {
  const [selectedInterval, setSelectedInterval] = useState<Interval>('1d');
  const [chartMode, setChartMode] = useState<ChartMode>('original');
  const [dynamicHistory, setDynamicHistory] = useState<any[]>([]);
  const [visiblePoints, setVisiblePoints] = useState<number>(60);
  
  const coinPriceRef = useRef(coin.price);
  const symbol = currency === 'brl' ? 'R$' : '$';
  const BULL_COLOR = '#0ecb81';
  const BEAR_COLOR = '#f6465d';

  // Sincroniza o ref com o preço mais recente da API
  useEffect(() => {
    coinPriceRef.current = coin.price;
  }, [coin.price]);

  // Inicialização estável do histórico
  useEffect(() => {
    const points = 100;
    const startPrice = coin.price;
    const initialData = [];
    for (let i = 0; i < points; i++) {
      initialData.push({
        time: new Date(Date.now() - (points - i) * 1000).toLocaleTimeString(),
        price: startPrice + (Math.random() - 0.5) * (startPrice * 0.0005),
      });
    }
    setDynamicHistory(initialData);
  }, [coin.id]);

  // Ticker de 1 segundo suave e resiliente
  useEffect(() => {
    if (selectedInterval !== '1s' || chartMode !== 'original') return;

    const timer = setInterval(() => {
      setDynamicHistory(prev => {
        const lastPoint = prev[prev.length - 1];
        // Atração suave para o preço real da API para evitar saltos bruscos
        const currentPrice = coinPriceRef.current;
        const drift = (Math.random() - 0.5) * (currentPrice * 0.0002);
        const pull = (currentPrice - lastPoint.price) * 0.1; // Suaviza a transição para o novo preço real
        const nextPrice = lastPoint.price + drift + pull;
        
        const newPoint = {
          time: new Date().toLocaleTimeString(),
          price: nextPrice
        };
        const updated = [...prev, newPoint];
        return updated.slice(-300); // Mantém buffer maior
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [selectedInterval, chartMode, coin.id]);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (chartMode !== 'original') return;
    const zoomSpeed = 4;
    if (e.deltaY < 0) {
      setVisiblePoints(prev => Math.max(15, prev - zoomSpeed));
    } else {
      setVisiblePoints(prev => Math.min(dynamicHistory.length, prev + zoomSpeed));
    }
  }, [chartMode, dynamicHistory.length]);

  const zoomedData = useMemo(() => dynamicHistory.slice(-visiblePoints), [dynamicHistory, visiblePoints]);

  const { minPrice, maxPrice } = useMemo(() => {
    if (zoomedData.length === 0) return { minPrice: 0, maxPrice: 100 };
    const prices = zoomedData.map(d => d.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const range = max - min;
    const padding = range === 0 ? 1 : range * 0.15;
    return { minPrice: min - padding, maxPrice: max + padding };
  }, [zoomedData]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img 
              src={coin.image} 
              alt={coin.symbol} 
              className="w-12 h-12 rounded-full border border-slate-800" 
              onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${coin.symbol}&background=1e293b&color=6366f1&bold=true`; }}
            />
            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-slate-950 ${coin.change24h >= 0 ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-white">{coin.name}</h2>
              <span className="text-slate-500 font-mono text-[10px] font-bold bg-slate-800 px-2 py-0.5 rounded uppercase">{coin.symbol}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-2xl font-mono font-bold ${coin.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {symbol}{coin.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${coin.change24h >= 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                {coin.change24h.toFixed(2)}%
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => onCreateAlert(coin.id, 'buy')} className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-emerald-500/20 uppercase active:scale-95">Comprar</button>
          <button onClick={() => onCreateAlert(coin.id, 'sell')} className="px-6 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-rose-500/20 uppercase active:scale-95">Vender</button>
        </div>
      </div>

      <div className="bg-[#0b0e11] rounded-2xl border border-slate-800 overflow-hidden shadow-2xl relative" onWheel={handleWheel}>
        <div className="flex items-center gap-4 px-4 py-2 border-b border-[#1e2329] bg-[#161a1e] overflow-x-auto custom-scrollbar">
          {intervals.map(t => (
            <button 
              key={t} 
              onClick={() => setSelectedInterval(t)} 
              className={`px-3 py-1 rounded text-[10px] font-bold transition-all whitespace-nowrap ${selectedInterval === t ? 'text-[#f0b90b] bg-white/5 border border-white/10' : 'text-slate-500 hover:text-white'}`}
            >
              {t.toUpperCase()}
            </button>
          ))}
          <div className="ml-auto flex bg-[#1e2329] p-0.5 rounded-lg border border-slate-800">
             <button onClick={() => setChartMode('original')} className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${chartMode === 'original' ? 'bg-[#2b3139] text-white' : 'text-slate-500 hover:text-slate-300'}`}>Cryvex View</button>
             <button onClick={() => setChartMode('tradingview')} className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${chartMode === 'tradingview' ? 'bg-[#2b3139] text-white' : 'text-slate-500 hover:text-slate-300'}`}>TradingView</button>
          </div>
        </div>

        <div className="h-[400px] w-full relative group bg-[#0b0e11]">
          {chartMode === 'original' ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={zoomedData} margin={{ top: 20, right: 70, bottom: 20, left: 0 }}>
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={coin.change24h >= 0 ? BULL_COLOR : BEAR_COLOR} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={coin.change24h >= 0 ? BULL_COLOR : BEAR_COLOR} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="0" stroke="#1e2329" vertical={false} opacity={0.3} />
                <XAxis dataKey="time" hide />
                <YAxis orientation="right" domain={[minPrice, maxPrice]} axisLine={false} tickLine={false} tick={{ fill: '#707a8a', fontSize: 10 }} width={70} />
                <Tooltip 
                  isAnimationActive={false}
                  content={({ active, payload }) => active && payload && payload.length > 0 && (
                    <div className="bg-[#1e2329] border border-[#2b3139] p-2 rounded shadow-xl z-50">
                      <p className="text-[10px] text-slate-500 mb-1">{payload[0].payload.time}</p>
                      <p className="text-xs font-bold text-white">{symbol}{payload[0].value?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                    </div>
                  )} 
                />
                <Area 
                  type="monotone" 
                  dataKey="price" 
                  stroke={coin.change24h >= 0 ? BULL_COLOR : BEAR_COLOR} 
                  fillOpacity={1} 
                  fill="url(#colorPrice)" 
                  strokeWidth={2} 
                  isAnimationActive={false} 
                  connectNulls
                />
                <ReferenceLine y={coin.price} stroke={coin.change24h >= 0 ? BULL_COLOR : BEAR_COLOR} strokeDasharray="3 3" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <TradingViewWidget symbol={coin.symbol} interval={selectedInterval} />
          )}

          {selectedInterval === '1s' && chartMode === 'original' && (
            <div className="absolute top-4 left-4 flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full animate-pulse z-10 pointer-events-none">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-tighter">Live Ticker 1s</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2"><AiAnalysis coin={coin} /></div>
        <div className="bg-[#161a1e] rounded-3xl border border-slate-800 p-6 shadow-xl">
          <h4 className="text-slate-500 font-bold text-[10px] uppercase tracking-widest mb-6">Métricas do Ativo</h4>
          <div className="space-y-4">
             <div className="flex justify-between items-center">
                <span className="text-slate-400 text-xs">RSI (14)</span>
                <span className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${coin.rsi > 70 ? 'text-rose-400 bg-rose-400/10' : coin.rsi < 30 ? 'text-emerald-400 bg-emerald-400/10' : 'text-slate-300 bg-slate-800'}`}>{coin.rsi}</span>
             </div>
             <div className="flex justify-between items-center">
                <span className="text-slate-400 text-xs">Tendência</span>
                <span className={`text-[10px] font-bold uppercase ${coin.trend === 'Bullish' ? 'text-emerald-400' : 'text-rose-400'}`}>{coin.trend}</span>
             </div>
             <div className="flex justify-between items-center">
                <span className="text-slate-400 text-xs">Força</span>
                <span className="text-white text-[10px] font-bold uppercase">{coin.strength}</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoinDetail;
