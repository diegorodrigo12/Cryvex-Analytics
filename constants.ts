
import { CryptoCurrency, NewsItem } from './types';

export const MOCK_CRYPTOS: CryptoCurrency[] = [
  {
    id: 'bitcoin',
    symbol: 'BTC',
    name: 'Bitcoin',
    price: 64230.45,
    image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
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
    image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
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
    id: 'dogecoin',
    symbol: 'DOGE',
    name: 'Dogecoin',
    price: 0.16,
    image: 'https://assets.coingecko.com/coins/images/5/large/dogecoin.png',
    change1h: 0.5,
    change24h: 5.2,
    change7d: 10.1,
    marketCap: 23000000000,
    volume24h: 1200000000,
    rsi: 65,
    macd: { value: 0.01, signal: 0.008 },
    trend: 'Bullish',
    strength: 'Strong'
  },
  {
    id: 'shiba-inu',
    symbol: 'SHIB',
    name: 'Shiba Inu',
    price: 0.000027,
    image: 'https://assets.coingecko.com/coins/images/11939/large/shiba.png',
    change1h: -0.2,
    change24h: -1.5,
    change7d: 15.4,
    marketCap: 16000000000,
    volume24h: 800000000,
    rsi: 55,
    macd: { value: 0.000001, signal: 0.0000005 },
    trend: 'Neutral',
    strength: 'Medium'
  },
  {
    id: 'pepe',
    symbol: 'PEPE',
    name: 'Pepe',
    price: 0.000008,
    image: 'https://assets.coingecko.com/coins/images/29850/large/pepe-token.png',
    change1h: 2.1,
    change24h: 12.4,
    change7d: 45.2,
    marketCap: 3500000000,
    volume24h: 500000000,
    rsi: 78,
    macd: { value: 0.000002, signal: 0.000001 },
    trend: 'Bullish',
    strength: 'Strong'
  },
  {
    id: 'floki',
    symbol: 'FLOKI',
    name: 'Floki',
    price: 0.0002,
    image: 'https://assets.coingecko.com/coins/images/16745/large/floki.png',
    change1h: 1.5,
    change24h: 8.9,
    change7d: 22.1,
    marketCap: 2100000000,
    volume24h: 200000000,
    rsi: 72,
    macd: { value: 0.00001, signal: 0.000008 },
    trend: 'Bullish',
    strength: 'Strong'
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
  }
];
