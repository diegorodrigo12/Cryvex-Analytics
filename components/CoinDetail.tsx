
import React, { useMemo, useState, useEffect, useRef } from 'react';
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
  const [hoverData, setHoverData] = useState<any>(null);
  
  const historyRef = useRef<any[]>([]);
  const currentCoinIdRef = useRef<string | null>(null);
  const currentIntervalRef = useRef<Interval | null>(null);

  const symbol = currency === 'brl' ? 'R$' : '$';

  const BULL_COLOR = '#0ecb81';
  const BEAR_COLOR = '#f6465d';
  const GRID_COLOR = '#1e2329';
  const CROSSHAIR_COLOR = '#707a8a';

  const generateInitialData = (points: number, startPrice: number, interval: Interval) => {
    const data: any[] = [];
    let currentPrice = startPrice;
    
    const volMap: Record<Interval, number> = {
      '1s': 0.0003,
      '15m': 0.0015,
      '1h': 0.004,
      '4h': 0.007,
      '1d': 0.012,
      '1w': 0.025
    };
    const volatility = volMap[interval] || 0.008;
    
    for (let i = 0; i < points; i++) {
      const change = currentPrice * (Math.random() * volatility * 2 - volatility);
      const close = currentPrice + change;
      const volume = Math.random() * 800 + 400;
      
      data.push({
        time: i.toString(),
        price: close,
        volume,
      });
      currentPrice = close;
    }
    return data;
  };

  const { chartData, minPrice, maxPrice } = useMemo(() => {
    if (currentCoinIdRef.current !== coin.id || currentIntervalRef.current !== selectedInterval) {
      const startPrice = coin.price * (1 - (coin.change24h / 100));
      historyRef.current = generateInitialData(80, startPrice, selectedInterval);
      currentCoinIdRef.current = coin.id;
      currentIntervalRef.current = selectedInterval;
    }

    const historical = historyRef.current;
    const currentPoint = {
      time: 'Agora',
      price: coin.price,
      volume: historical[historical.length - 1].volume * (0.8 + Math.random() * 0.4),
    };

    const data = [...historical, currentPoint];

    const allPrices = data.map(d => d.price);
    const minP = Math.min(...allPrices);
    const maxP = Math.max(...allPrices);
    const padding = (maxP - minP) * 0.15;

    return { 
      chartData: data, 
      minPrice: minP - padding, 
      maxPrice: maxP + padding 
    };
  }, [coin.id, coin.price, selectedInterval]);

  const latest = hoverData || (chartData.length > 0 ? chartData[chartData.length - 1] : null);

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img 
              src={coin.image} 
              alt={coin.symbol}
              className="w-12 h-12 rounded-full shadow-lg"
              onError={(e) => (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${coin.symbol}&background=1e293b&color=6366f1&bold=true`}
            />
            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-slate-950 ${coin.change24h >= 0 ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-white tracking-tight">{coin.name}</h2>
              <span className="text-slate-500 font-mono text-xs font-bold bg-slate-800 px-2 py-0.5 rounded uppercase">{coin.symbol} / {currency.toUpperCase()}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-2xl font-mono font-bold ${coin.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {symbol}{coin.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded bg-slate-800 ${coin.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {coin.change24h > 0 ? '+' : ''}{coin.change24h}%
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => onCreateAlert(coin.id, 'buy')} className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-bold transition-all active:scale-95 shadow-xl shadow-emerald-500/20">COMPRAR</button>
          <button onClick={() => onCreateAlert(coin.id, 'sell')} className="px-6 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-sm font-bold transition-all active:scale-95 shadow-xl shadow-rose-500/20">VENDER</button>
        </div>
      </div>

      <div className="bg-[#0b0e11] rounded-2xl border border-slate-800 overflow-hidden shadow-2xl relative">
        <div className="flex items-center gap-6 px-4 py-2 border-b border-[#1e2329] bg-[#161a1e] flex-wrap">
          <div className="flex items-center gap-4">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mr-2">Intervalo</span>
            {intervals.map(t => (
              <button 
                key={t} 
                onClick={() => setSelectedInterval(t)}
                className={`px-2 py-1 rounded text-[11px] font-bold transition-all ${selectedInterval === t ? 'text-[#f0b90b] bg-white/5' : 'text-slate-400 hover:text-white'}`}
              >
                {t.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="h-4 w-[1px] bg-slate-800 hidden sm:block"></div>
          
          <div className="flex items-center gap-2">
             <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-tighter">Gráfico de Linha</span>
          </div>

          <div className="ml-auto flex items-center gap-4">
             <div className="flex bg-[#1e2329] p-0.5 rounded-lg border border-slate-800">
               <button 
                  onClick={() => setChartMode('original')}
                  className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${chartMode === 'original' ? 'bg-[#2b3139] text-white' : 'text-slate-500 hover:text-slate-300'}`}
               >
                 Original
               </button>
               <button 
                  onClick={() => setChartMode('tradingview')}
                  className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${chartMode === 'tradingview' ? 'bg-[#2b3139] text-white' : 'text-slate-500 hover:text-slate-300'}`}
               >
                 Pro View
               </button>
             </div>
          </div>
        </div>

        <div className="h-[500px] w-full relative group bg-[#0b0e11]">
          {chartMode === 'original' ? (
            <>
              <div className="absolute top-4 left-4 z-10 select-none pointer-events-none">
                {latest && (
                  <div className="flex flex-col gap-1.5 bg-black/40 p-2 rounded-lg backdrop-blur-sm border border-white/5">
                    <div className="flex items-center gap-x-4 text-[13px] font-mono">
                      <div className="flex gap-2">
                        <span className="text-slate-500 font-bold uppercase tracking-tighter text-[10px]">Preço:</span>
                        <span className={coin.change24h >= 0 ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                          {symbol}{latest.price?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
                        </span>
                      </div>
                    </div>
                    <div className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">
                      Intervalo: {selectedInterval} • Live Market
                    </div>
                  </div>
                )}
              </div>

              <ResponsiveContainer width="100%" height="100%">
                <AreaChart 
                  data={chartData} 
                  onMouseMove={(e: any) => e.activePayload && setHoverData(e.activePayload[0].payload)}
                  onMouseLeave={() => setHoverData(null)}
                  margin={{ top: 20, right: 80, bottom: 20, left: 0 }}
                >
                  <defs>
                    <linearGradient id="colorPriceLine" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={coin.change24h >= 0 ? BULL_COLOR : BEAR_COLOR} stopOpacity={0.25}/>
                      <stop offset="95%" stopColor={coin.change24h >= 0 ? BULL_COLOR : BEAR_COLOR} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="0" stroke={GRID_COLOR} vertical={false} />
                  <XAxis dataKey="time" hide />
                  <YAxis 
                    orientation="right" 
                    domain={[minPrice, maxPrice]} 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#707a8a', fontSize: 11, fontWeight: 'bold' }} 
                    width={80} 
                  />
                  <Tooltip content={() => null} cursor={{ stroke: CROSSHAIR_COLOR, strokeWidth: 1, strokeDasharray: '4 4' }} />
                  <Area 
                    type="monotone" 
                    dataKey="price" 
                    stroke={coin.change24h >= 0 ? BULL_COLOR : BEAR_COLOR} 
                    fillOpacity={1} 
                    fill="url(#colorPriceLine)" 
                    strokeWidth={2} 
                    isAnimationActive={false} 
                  />
                  <ReferenceLine 
                    y={coin.price} 
                    stroke={coin.change24h >= 0 ? BULL_COLOR : BEAR_COLOR} 
                    strokeDasharray="4 2" 
                    label={(props) => (
                      <g>
                        <rect 
                          x={props.viewBox.width + props.viewBox.x} 
                          y={props.viewBox.y - 10} 
                          width={75} 
                          height={20} 
                          fill={coin.change24h >= 0 ? BULL_COLOR : BEAR_COLOR} 
                          rx={4}
                        />
                        <text 
                          x={props.viewBox.width + props.viewBox.x + 37.5} 
                          y={props.viewBox.y + 4} 
                          fill="white" 
                          fontSize={10} 
                          fontWeight="bold" 
                          textAnchor="middle"
                          fontFamily="monospace"
                        >
                          {coin.price.toFixed(coin.price < 1 ? 6 : 2)}
                        </text>
                      </g>
                    )}
                  />
                </AreaChart>
              </ResponsiveContainer>
              
              <div className="absolute bottom-4 left-4 z-10 flex gap-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-black/40 px-3 py-1.5 rounded-md backdrop-blur-sm border border-white/5">
                <div className="flex gap-1.5 items-center">
                  <span>Vol 24h:</span>
                  <span className="text-white">{symbol}{(coin.volume24h / 1e9).toFixed(2)}B</span>
                </div>
              </div>
            </>
          ) : (
            <TradingViewWidget symbol={coin.symbol} interval={selectedInterval} />
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AiAnalysis coin={coin} />
        </div>
        <div className="bg-[#161a1e] rounded-3xl border border-slate-800 p-6 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-slate-400 font-bold text-xs uppercase tracking-widest">Resumo de Ativo</h4>
            <span className="text-[10px] text-emerald-500 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">ONLINE</span>
          </div>
          <div className="space-y-5">
             <div className="flex justify-between items-center group">
                <span className="text-slate-500 text-sm group-hover:text-slate-400 transition-colors">Market Cap</span>
                <span className="text-white font-mono font-bold">{symbol}{(coin.marketCap / 1e9).toFixed(2)}B</span>
             </div>
             <div className="flex justify-between items-center group">
                <span className="text-slate-500 text-sm group-hover:text-slate-400 transition-colors">Volume 24h</span>
                <span className="text-white font-mono font-bold">{symbol}{(coin.volume24h / 1e9).toFixed(2)}B</span>
             </div>
             <div className="flex justify-between items-center group">
                <span className="text-slate-500 text-sm group-hover:text-slate-400 transition-colors">Força RSI</span>
                <span className={`font-mono font-bold px-3 py-1 rounded-lg ${coin.rsi > 70 ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : coin.rsi < 30 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-800 text-slate-200'}`}>{coin.rsi}</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoinDetail;
