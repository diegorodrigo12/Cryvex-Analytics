
import React, { useState } from 'react';

interface SettingsProps {
  currency: 'usd' | 'brl';
  setCurrency: (c: 'usd' | 'brl') => void;
  theme: 'dark' | 'light';
  setTheme: (t: 'dark' | 'light') => void;
}

const Settings: React.FC<SettingsProps> = ({ currency, setCurrency, theme, setTheme }) => {
  const [bankInfo, setBankInfo] = useState({
    bankName: '',
    agency: '',
    account: '',
    pixKey: ''
  });

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-2xl font-bold text-white">Preferências do Sistema</h2>
        <p className="text-slate-500 text-sm">Personalize sua experiência no Cryvex Analytics.</p>
      </div>

      <div className="space-y-6">
        {/* Interface Section */}
        <section className="bg-slate-900 border border-slate-800 p-8 rounded-3xl space-y-6">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-800 pb-4">Aparência e Unidade</h3>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-white">Tema Visual</p>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">Escolha entre Dark ou Light mode</p>
            </div>
            <div className="flex bg-slate-800 p-1 rounded-xl border border-slate-700">
              <button 
                onClick={() => setTheme('dark')}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${theme === 'dark' ? 'bg-indigo-600 text-white' : 'text-slate-500'}`}
              >
                Dark
              </button>
              <button 
                onClick={() => setTheme('light')}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${theme === 'light' ? 'bg-indigo-600 text-white' : 'text-slate-500'}`}
              >
                Light
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-white">Moeda Base</p>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">Unidade monetária padrão do sistema</p>
            </div>
            <div className="flex bg-slate-800 p-1 rounded-xl border border-slate-700">
              <button 
                onClick={() => setCurrency('usd')}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${currency === 'usd' ? 'bg-indigo-600 text-white' : 'text-slate-500'}`}
              >
                Dólar (USD)
              </button>
              <button 
                onClick={() => setCurrency('brl')}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${currency === 'brl' ? 'bg-indigo-600 text-white' : 'text-slate-500'}`}
              >
                Real (BRL)
              </button>
            </div>
          </div>
        </section>

        {/* Bank Config Section */}
        <section className="bg-slate-900 border border-slate-800 p-8 rounded-3xl space-y-6">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-800 pb-4">Dados Bancários / Recebimento</h3>
          <p className="text-xs text-slate-500">Configure seus dados para agilizar renovações de assinatura ou futuros saques de cashback.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-slate-600 uppercase">Instituição Bancária</label>
              <input 
                type="text" 
                placeholder="Ex: NuBank, Itaú, Binance"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-indigo-500/40 outline-none"
                value={bankInfo.bankName}
                onChange={(e) => setBankInfo({...bankInfo, bankName: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-slate-600 uppercase">Chave PIX</label>
              <input 
                type="text" 
                placeholder="E-mail, CPF ou Celular"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-indigo-500/40 outline-none"
                value={bankInfo.pixKey}
                onChange={(e) => setBankInfo({...bankInfo, pixKey: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-slate-600 uppercase">Agência</label>
              <input 
                type="text" 
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-indigo-500/40 outline-none"
                value={bankInfo.agency}
                onChange={(e) => setBankInfo({...bankInfo, agency: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-slate-600 uppercase">Conta Corrente</label>
              <input 
                type="text" 
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-indigo-500/40 outline-none"
                value={bankInfo.account}
                onChange={(e) => setBankInfo({...bankInfo, account: e.target.value})}
              />
            </div>
          </div>

          <button className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs uppercase tracking-widest transition-all shadow-lg shadow-emerald-600/20">
            Salvar Dados Bancários
          </button>
        </section>
      </div>
    </div>
  );
};

export default Settings;
