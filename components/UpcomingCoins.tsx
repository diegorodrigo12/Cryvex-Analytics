
import React, { useState, useEffect, useCallback } from 'react';
import { UpcomingCoin } from '../types';
import { fetchUpcomingCoins } from '../services/gemini';

const UpcomingCoins: React.FC = () => {
  const [coins, setCoins] = useState<UpcomingCoin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchUpcomingCoins();
      if (data && data.length > 0) {
        setCoins(data);
      } else {
        throw new Error("Nenhum projeto encontrado para o filtro de 2026.");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Erro ao conectar com o servidor de inteligência.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-white">Radar Visionário 2026 🚀</h2>
            {loading && (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-indigo-500 animate-ping"></div>
                <span className="text-[10px] text-indigo-400 font-bold uppercase animate-pulse">Escanenado Nodes...</span>
              </div>
            )}
          </div>
          <p className="text-slate-500 text-sm mt-1">
            Nossa IA analisa roadmaps e repositórios GitHub para mapear a próxima geração de ativos previstos para 2026.
          </p>
        </div>
        <button 
          onClick={loadData}
          disabled={loading}
          className="flex items-center gap-2 bg-indigo-600/10 hover:bg-indigo-600/20 border border-indigo-500/30 px-5 py-2.5 rounded-2xl text-xs font-bold text-indigo-400 transition-all disabled:opacity-50 active:scale-95"
        >
          <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Sincronizar Roadmaps 2026
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 animate-pulse space-y-4">
              <div className="flex gap-4 items-center">
                <div className="w-12 h-12 bg-slate-800 rounded-2xl"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-slate-800 rounded w-1/2"></div>
                  <div className="h-3 bg-slate-800 rounded w-1/3"></div>
                </div>
              </div>
              <div className="h-20 bg-slate-800 rounded-2xl"></div>
              <div className="flex justify-between">
                <div className="h-4 bg-slate-800 rounded w-1/4"></div>
                <div className="h-4 bg-slate-800 rounded w-1/4"></div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-rose-500/5 border border-rose-500/20 p-12 rounded-3xl text-center backdrop-blur-sm">
          <div className="w-16 h-16 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-rose-500/20">
            <svg className="w-8 h-8 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-white font-bold text-lg mb-2">Falha na Sincronização On-Chain</h3>
          <p className="text-slate-400 text-sm mb-6 max-w-sm mx-auto">{error}</p>
          <button 
            onClick={loadData} 
            className="px-8 py-3 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-lg shadow-rose-600/20"
          >
            Tentar Reconectar
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {coins.map((coin) => (
            <div key={coin.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 hover:border-indigo-500/40 transition-all group relative overflow-hidden flex flex-col justify-between h-full shadow-xl">
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-all group-hover:scale-110">
                <span className="text-8xl font-black">{coin.symbol}</span>
              </div>

              <div className="relative z-10 h-full flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-lg font-bold text-indigo-400 shadow-xl group-hover:bg-indigo-500 group-hover:text-white transition-all duration-300">
                      {coin.symbol.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-lg group-hover:text-indigo-300 transition-colors">{coin.name}</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded uppercase">{coin.category}</span>
                        <span className="text-[10px] font-bold text-slate-500 font-mono">Blockchain: {coin.platform}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Previsão IA</p>
                    <p className={`text-xl font-black ${coin.hypeScore > 85 ? 'text-amber-400' : 'text-indigo-400'}`}>{coin.hypeScore}%</p>
                  </div>
                </div>

                <div className="bg-slate-950/50 rounded-2xl p-4 border border-slate-800 mb-6 flex-grow">
                  <p className="text-xs text-slate-300 leading-relaxed italic">
                    "{coin.summary}"
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-800/50 mt-auto">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">Janela Estimada 2026</span>
                    <span className="text-sm font-mono font-bold text-white">
                      {new Date(coin.launchDate).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <div className="px-3 py-1 bg-indigo-500/10 rounded-lg text-[9px] font-bold text-indigo-400 border border-indigo-500/20 uppercase tracking-widest">Early Stake</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="bg-gradient-to-r from-slate-900 to-indigo-950/30 border border-indigo-500/20 p-8 rounded-3xl text-center shadow-2xl">
        <h4 className="text-white font-bold mb-2">Monitoramento de Roadmaps Privados</h4>
        <p className="text-slate-400 text-sm mb-6 max-w-lg mx-auto">
          Membros Pro recebem alertas instantâneos quando a IA detecta movimentação de novos contratos ou atualizações críticas em repositórios de projetos visionários.
        </p>
        <button className="px-10 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold shadow-lg shadow-indigo-600/30 transition-all uppercase tracking-widest text-xs active:scale-95">
          Upgrade para Radar Pro
        </button>
      </div>
    </div>
  );
};

export default UpcomingCoins;
