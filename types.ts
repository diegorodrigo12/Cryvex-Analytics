
export interface CryptoCurrency {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change1h: number;
  change24h: number;
  change7d: number;
  marketCap: number;
  volume24h: number;
  rsi: number;
  macd: {
    value: number;
    signal: number;
  };
  trend: 'Bullish' | 'Bearish' | 'Neutral';
  strength: 'Weak' | 'Medium' | 'Strong';
}

export interface Alert {
  id: string;
  coinId: string;
  condition: 'price_above' | 'price_below' | 'percent_change' | 'rsi_level';
  value: number;
  active: boolean;
  createdAt: number;
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  timestamp: number;
  impact: 'Low' | 'Medium' | 'High';
  coins: string[];
}

export type View = 'dashboard' | 'detail' | 'alerts' | 'news' | 'premium';

export interface MarketHistory {
  time: string;
  price: number;
}
