
import React, { useState, useEffect } from 'react';
import { CryptoCurrency } from '../types';
import { analyzeMarket } from '../services/gemini';

interface AiAnalysisProps {
  coin: CryptoCurrency;
}

const AiAnalysis: React.FC<AiAnalysisProps> = ({ coin }) => {
  const [analysis, setAnalysis] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAnalysis = async () => {
      setLoading(true);
      try {
        const result = await analyzeMarket(coin);
        setAnalysis(result);
      } catch (err) {
        setAnalysis('Falha ao gerar análise de IA. Verifique sua conexão.');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalysis();
  }, [coin.id]);

  return (
    <div className="bg-indigo-950/20 rounded-3xl border border-indigo-500/20 p-6 shadow-xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <svg className="w-20 h-20 text-indigo-400" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2L4.5 20.29L5.21 21L12 18L18.79 21L19.5 20.29L12 2Z" />
        </svg>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h4 className="text-indigo-200 font-bold uppercase tracking-wider text-sm">Cryvex AI Insight</h4>
      </div>

      {loading ? (
        <div className="space-y-3">
          <div className="h-4 bg-indigo-500/10 rounded-full w-full animate-pulse"></div>
          <div className="h-4 bg-indigo-500/10 rounded-full w-5/6 animate-pulse"></div>
          <div className="h-4 bg-indigo-500/10 rounded-full w-4/6 animate-pulse"></div>
        </div>
      ) : (
        <div className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
          {analysis}
        </div>
      )}
      
      <div className="mt-4 pt-4 border-t border-indigo-500/10 flex justify-between items-center">
        <span className="text-[10px] text-indigo-400/60 uppercase font-bold tracking-widest">IA Engine v3.1</span>
        <button className="text-xs text-indigo-400 hover:text-indigo-200 font-medium underline">Ler mais detalhes</button>
      </div>
    </div>
  );
};

export default AiAnalysis;
