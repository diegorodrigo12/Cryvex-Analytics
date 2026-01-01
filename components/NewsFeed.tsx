
import React from 'react';
import { MOCK_NEWS } from '../constants';
import { CryptoCurrency } from '../types';

interface NewsFeedProps {
  cryptos: CryptoCurrency[];
}

const NewsFeed: React.FC<NewsFeedProps> = ({ cryptos }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Notícias do Mercado</h2>
          <p className="text-slate-500 text-sm">Fique por dentro do que realmente importa.</p>
        </div>
      </div>

      <div className="space-y-6">
        {MOCK_NEWS.map(news => (
          <div key={news.id} className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-lg hover:border-slate-700 transition-all group">
            <div className="md:w-48 h-32 md:h-auto overflow-hidden">
              <img src={`https://picsum.photos/400/300?random=${news.id}`} alt="News" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="p-6 flex-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-indigo-400 font-bold uppercase tracking-widest">{news.source}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  news.impact === 'High' ? 'bg-rose-500/20 text-rose-400' : 
                  news.impact === 'Medium' ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'
                }`}>
                  {news.impact} Impact
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors">{news.title}</h3>
              <p className="text-slate-400 text-sm mb-4 line-clamp-2">{news.summary}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  {news.coins.map(c => (
                    <span key={c} className="text-[10px] font-bold bg-slate-800 text-slate-300 px-2 py-1 rounded">#{c}</span>
                  ))}
                </div>
                <span className="text-xs text-slate-600">
                  {new Date(news.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsFeed;
