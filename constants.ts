
import { CryptoCurrency, NewsItem } from './types';

export const MOCK_CRYPTOS: CryptoCurrency[] = [
  {
    id: 'bitcoin',
    symbol: 'BTC',
    name: 'Bitcoin',
    price: 94500.00,
    image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
    change1h: 0.15,
    change24h: 2.10,
    change7d: 5.2,
    marketCap: 1800000000000,
    volume24h: 45000000000,
    rsi: 62,
    macd: { value: 120, signal: 95 },
    trend: 'Bullish',
    strength: 'Strong'
  },
  {
    id: 'ethereum',
    symbol: 'ETH',
    name: 'Ethereum',
    price: 2750.50,
    image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
    change1h: -0.05,
    change24h: 1.2,
    change7d: 3.4,
    marketCap: 330000000000,
    volume24h: 18000000000,
    rsi: 55,
    macd: { value: 45, signal: 30 },
    trend: 'Bullish',
    strength: 'Medium'
  },
  {
    id: 'solana',
    symbol: 'SOL',
    name: 'Solana',
    price: 185.20,
    image: 'https://assets.coingecko.com/coins/images/4128/large/solana.png',
    change1h: 0.45,
    change24h: 4.5,
    change7d: 12.1,
    marketCap: 85000000000,
    volume24h: 5000000000,
    rsi: 68,
    macd: { value: 5, signal: 3 },
    trend: 'Bullish',
    strength: 'Strong'
  }
];

export const MOCK_NEWS: NewsItem[] = [
  {
    id: '1',
    title: 'Bitcoin atinge nova máxima histórica em meio a adoção institucional',
    summary: 'O mercado de criptomoedas reage positivamente a novos fluxos de capital de grandes fundos globais.',
    source: 'Cryvex News',
    timestamp: Date.now() - 1800000,
    impact: 'High',
    coins: ['BTC', 'ETH']
  },
  {
    id: '2',
    title: 'Solana ultrapassa Ethereum em volume de DEX',
    summary: 'A rede Solana continua sua ascensão meteórica impulsionada pelo ecossistema de memecoins.',
    source: 'Tech Insights',
    timestamp: Date.now() - 3600000,
    impact: 'Medium',
    coins: ['SOL']
  }
];
