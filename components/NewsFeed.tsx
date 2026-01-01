
import React, { useState, useEffect, useCallback } from 'react';
import { NewsItem, CryptoCurrency } from '../types';
import { fetchMarketNews } from '../services/gemini';
import { MOCK_NEWS } from '../constants';

interface NewsFeedProps {
  cryptos: CryptoCurrency[];
}

const NewsFeed: React.FC<NewsFeedProps> = ({ cryptos }) => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'All' | 'High' | 'Medium' | 'Low'>('All');

  const loadNews = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchMarketNews();
      setNews(data);
    } catch (err) {
      // Fallback para notícias mockadas caso a API falhe
      setNews([...MOCK_NEWS, ...MOCK_NEWS.map(n => ({...n, id: n.id + '_copy'}))]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNews();
  }, [loadNews]);

  const filteredNews = news.filter(n => filter === 'All' || n.impact === filter);

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-3xl font-black text-white tracking-tight">Cryvex News Portal</h2>
            <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">Live Feed</span>
            </div>
          </div>
          <p className="text-slate-500 text-sm mt-2">Insights globais processados em tempo real por nossa inteligência de mercado.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex bg-slate-900 p-1 rounded-2xl border border-slate-800">
            {(['All', 'High', 'Medium', 'Low'] as const).map((impact) => (
              <button
                key={impact}
                onClick={() => setFilter(impact)}
                className={`px-4 py-2 text-[10px] font-bold rounded-xl transition-all uppercase tracking-widest ${
                  filter === impact 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {impact === 'All' ? 'Todos' : impact}
              </button>
            ))}
          </div>
          <button 
            onClick={loadNews}
            disabled={loading}
            className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-2xl border border-slate-700 transition-all active:scale-95 disabled:opacity-50"
          >
            <svg className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="bg-slate-900/50 border border-slate-800 h-48 rounded-3xl animate-pulse"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredNews.length > 0 ? filteredNews.map((item, index) => (
            <div 
              key={item.id} 
              className="bg-slate-900 border border-slate-800 p-6 rounded-3xl hover:border-indigo-500/30 transition-all group relative overflow-hidden flex flex-col justify-between"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 blur-3xl -mr-16 -mt-16 rounded-full group-hover:bg-indigo-600/10 transition-all"></div>
              
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] bg-indigo-500/10 px-2 py-1 rounded">
                    {item.source}
                  </span>
                  <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border ${
                    item.impact === 'High' ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' :
                    item.impact === 'Medium' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' :
                    'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                  }`}>
                    <div className={`w-1 h-1 rounded-full ${
                      item.impact === 'High' ? 'bg-rose-400' :
                      item.impact === 'Medium' ? 'bg-amber-400' : 'bg-emerald-400'
                    }`}></div>
                    <span className="text-[9px] font-bold uppercase tracking-widest">{item.impact} Impact</span>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-white mb-3 group-hover:text-indigo-200 transition-colors leading-snug">
                  {item.title}
                </h3>
                <p className="text-slate-400 text-xs leading-relaxed mb-6 line-clamp-3 italic">
                  "{item.summary}"
                </p>
              </div>

              <div className="relative z-10 pt-4 border-t border-slate-800/50 flex items-center justify-between">
                <div className="flex gap-2">
                  {item.coins.map(c => (
                    <span key={c} className="text-[9px] font-mono font-bold bg-slate-800 text-slate-300 px-2 py-1 rounded border border-slate-700 group-hover:border-indigo-500/20 transition-all">
                      ${c}
                    </span>
                  ))}
                </div>
                <span className="text-[10px] text-slate-600 font-mono font-bold uppercase">
                  {new Date(item.timestamp).toLocaleDateString('pt-BR')} • {new Date(item.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          )) : (
            <div className="col-span-full py-20 text-center bg-slate-900 border border-dashed border-slate-800 rounded-3xl">
              <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">Nenhuma notícia encontrada para este filtro.</p>
            </div>
          )}
        </div>
      )}

      <div className="bg-indigo-600/5 border border-indigo-500/10 p-10 rounded-3xl text-center relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-500/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
        <h4 className="text-white font-bold text-xl mb-3">Newsletter Exclusiva Pro</h4>
        <p className="text-slate-400 text-sm mb-8 max-w-xl mx-auto">
          Receba relatórios detalhados e alertas de "Insider Trading" detectados pela nossa IA diretamente no seu e-mail e WhatsApp.
        </p>
        <button className="px-10 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold shadow-xl shadow-indigo-600/30 transition-all uppercase tracking-widest text-xs active:scale-95">
          Ativar Alertas de Notícias Pro
        </button>
      </div>
    </div>
  );
};

export default NewsFeed;
