
import { CryptoCurrency, NewsItem } from './types';

export const MOCK_CRYPTOS: CryptoCurrency[] = [
  {
    id: 'bitcoin',
    symbol: 'BTC',
    name: 'Bitcoin',
    price: 64230.45,
    change1h: 0.25,
    change24h: 3.42,
    change7d: -1.2,
    marketCap: 1260000000000,
    volume24h: 35000000000,
    rsi: 58,
    macd: { value: 120, signal: 95 },
    trend: 'Bullish',
    strength: 'Strong'
  },
  {
    id: 'ethereum',
    symbol: 'ETH',
    name: 'Ethereum',
    price: 3450.12,
    change1h: -0.12,
    change24h: 1.5,
    change7d: 5.4,
    marketCap: 415000000000,
    volume24h: 15000000000,
    rsi: 62,
    macd: { value: 45, signal: 30 },
    trend: 'Bullish',
    strength: 'Medium'
  },
  {
    id: 'solana',
    symbol: 'SOL',
    name: 'Solana',
    price: 145.67,
    change1h: 1.2,
    change24h: 8.9,
    change7d: 12.5,
    marketCap: 65000000000,
    volume24h: 4200000000,
    rsi: 71,
    macd: { value: 8, signal: 2 },
    trend: 'Bullish',
    strength: 'Strong'
  },
  {
    id: 'cardano',
    symbol: 'ADA',
    name: 'Cardano',
    price: 0.45,
    change1h: -0.5,
    change24h: -2.3,
    change7d: -4.1,
    marketCap: 16000000000,
    volume24h: 300000000,
    rsi: 35,
    macd: { value: -0.01, signal: -0.005 },
    trend: 'Bearish',
    strength: 'Medium'
  },
  {
    id: 'ripple',
    symbol: 'XRP',
    name: 'XRP',
    price: 0.61,
    change1h: 0.05,
    change24h: 0.4,
    change7d: 2.1,
    marketCap: 33000000000,
    volume24h: 1200000000,
    rsi: 48,
    macd: { value: 0.002, signal: 0.001 },
    trend: 'Neutral',
    strength: 'Weak'
  }
];

export const MOCK_NEWS: NewsItem[] = [
  {
    id: '1',
    title: 'SEC Greenlights New Crypto ETF Structure',
    summary: 'A major breakthrough in regulation as the SEC approves a novel diversified index fund strategy.',
    source: 'CoinDesk',
    timestamp: Date.now() - 3600000,
    impact: 'High',
    coins: ['BTC', 'ETH']
  },
  {
    id: '2',
    title: 'Solana Network Activity Hits All-Time High',
    summary: 'DEX volume on Solana surpasses Ethereum as memecoin mania continues to drive users.',
    source: 'Decrypt',
    timestamp: Date.now() - 7200000,
    impact: 'Medium',
    coins: ['SOL']
  },
  {
    id: '3',
    title: 'Central Bank Explores Digital Currency Integration',
    summary: 'Preliminary reports suggest a major economy is ready to pilot a retail CBDC by year-end.',
    source: 'Reuters Finance',
    timestamp: Date.now() - 14400000,
    impact: 'Low',
    coins: []
  }
];
