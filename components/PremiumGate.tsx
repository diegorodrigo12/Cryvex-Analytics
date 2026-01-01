
import React from 'react';

const PremiumGate: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-extrabold text-white mb-4">Eleve seu Trade ao <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Próximo Nível</span></h2>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          Desbloqueie ferramentas exclusivas, alertas em tempo real via WhatsApp e insights de IA ilimitados.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Free Plan */}
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl relative">
          <h3 className="text-xl font-bold text-white mb-2">Plano Gratuito</h3>
          <p className="text-slate-500 text-sm mb-6">Essencial para iniciantes que estão começando.</p>
          <div className="text-3xl font-bold text-white mb-8">R$ 0<span className="text-sm font-normal text-slate-500">/mês</span></div>
          
          <ul className="space-y-4 mb-10">
            {['Dashboard Básico', '5 Ativos Favoritos', '3 Alertas no Painel', 'Indicadores Standard'].map(feature => (
              <li key={feature} className="flex items-center gap-3 text-slate-300 text-sm">
                <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {feature}
              </li>
            ))}
          </ul>
          
          <button className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-all">
            Plano Atual
          </button>
        </div>

        {/* Pro Plan */}
        <div className="bg-slate-900 border-2 border-indigo-500 p-8 rounded-3xl relative shadow-2xl shadow-indigo-500/10">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
            Recomendado
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Cryvex Pro</h3>
          <p className="text-slate-500 text-sm mb-6">Para quem leva o mercado a sério.</p>
          <div className="text-3xl font-bold text-white mb-8">R$ 49<span className="text-sm font-normal text-slate-500">/mês</span></div>
          
          <ul className="space-y-4 mb-10">
            {['Alertas Ilimitados', 'Notificações via WhatsApp', 'IA Analysis Pro Ilimitada', 'Indicadores Avançados (EMA, Ichimoku)', 'Early access a novos tokens'].map(feature => (
              <li key={feature} className="flex items-center gap-3 text-slate-200 text-sm font-medium">
                <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {feature}
              </li>
            ))}
          </ul>
          
          <button className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all shadow-xl shadow-indigo-600/30">
            Assinar Agora
          </button>
        </div>
      </div>

      <div className="mt-20 flex flex-col items-center">
        <p className="text-slate-500 text-sm mb-6">Aceitamos diversos meios de pagamento</p>
        <div className="flex gap-8 opacity-40 grayscale hover:grayscale-0 transition-all">
          <span className="text-2xl font-bold text-white">VISA</span>
          <span className="text-2xl font-bold text-white">PIX</span>
          <span className="text-2xl font-bold text-white">CRYPTO</span>
        </div>
      </div>
    </div>
  );
};

export default PremiumGate;
