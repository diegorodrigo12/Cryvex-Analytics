
import React, { useState, useEffect } from 'react';
import { Alert, CryptoCurrency } from '../types';

interface AlertsProps {
  alerts: Alert[];
  setAlerts: React.Dispatch<React.SetStateAction<Alert[]>>;
  cryptos: CryptoCurrency[];
  pendingAlert: {coinId: string, intent: 'buy' | 'sell'} | null;
  clearPending: () => void;
  currency: 'usd' | 'brl';
}

const Alerts: React.FC<AlertsProps> = ({ alerts, setAlerts, cryptos, pendingAlert, clearPending, currency }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [newAlert, setNewAlert] = useState<{coinId: string, val: number, condition: string, intent: 'buy' | 'sell'}>({
    coinId: cryptos[0]?.id || 'bitcoin',
    val: 0,
    condition: 'price_above',
    intent: 'buy'
  });

  const symbol = currency === 'brl' ? 'R$' : '$';

  useEffect(() => {
    if (pendingAlert) {
      const coin = cryptos.find(c => c.id === pendingAlert.coinId);
      setNewAlert({
        coinId: pendingAlert.coinId,
        val: coin ? coin.price : 0,
        condition: pendingAlert.intent === 'buy' ? 'price_below' : 'price_above',
        intent: pendingAlert.intent
      });
      setShowAdd(true);
      clearPending();
    }
  }, [pendingAlert, cryptos, clearPending]);

  const handleAdd = () => {
    const alert: Alert = {
      id: Math.random().toString(36).substr(2, 9),
      coinId: newAlert.coinId,
      condition: newAlert.condition as any,
      value: newAlert.val,
      active: true,
      createdAt: Date.now(),
      intent: newAlert.intent
    };
    setAlerts([...alerts, alert]);
    setShowAdd(false);
  };

  const removeAlert = (id: string) => {
    setAlerts(alerts.filter(a => a.id !== id));
  };

  const getIconUrl = (symbolStr: string) => `https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/${symbolStr.toLowerCase()}.png`;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Centro de Alertas ({currency.toUpperCase()})</h2>
          <p className="text-slate-500 text-sm">Gerencie suas ordens de compra e venda automatizadas.</p>
        </div>
        <button 
          onClick={() => {
            setShowAdd(true);
            setNewAlert({ ...newAlert, val: cryptos.find(c => c.id === newAlert.coinId)?.price || 0 });
          }}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-medium transition-all"
        >
          Novo Alerta Manual
        </button>
      </div>

      {showAdd && (
        <div className="bg-slate-900 border border-indigo-500/30 p-6 rounded-3xl shadow-2xl space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">Configurar Alerta de {newAlert.intent === 'buy' ? 'Compra' : 'Venda'}</h3>
            <div className="flex gap-2 p-1 bg-slate-800 rounded-lg">
              <button 
                onClick={() => setNewAlert({...newAlert, intent: 'buy', condition: 'price_below'})}
                className={`px-3 py-1 text-[10px] font-bold rounded uppercase ${newAlert.intent === 'buy' ? 'bg-emerald-500 text-white' : 'text-slate-500'}`}
              >
                Compra
              </button>
              <button 
                onClick={() => setNewAlert({...newAlert, intent: 'sell', condition: 'price_above'})}
                className={`px-3 py-1 text-[10px] font-bold rounded uppercase ${newAlert.intent === 'sell' ? 'bg-rose-500 text-white' : 'text-slate-500'}`}
              >
                Venda
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-xs text-slate-500 uppercase font-bold tracking-wider">Ativo</label>
              <select 
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-slate-200 focus:ring-2 focus:ring-indigo-500/50 outline-none"
                value={newAlert.coinId}
                onChange={(e) => {
                  const coin = cryptos.find(c => c.id === e.target.value);
                  setNewAlert({...newAlert, coinId: e.target.value, val: coin?.price || 0});
                }}
              >
                {cryptos.map(c => <option key={c.id} value={c.id}>{c.name} ({c.symbol})</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs text-slate-500 uppercase font-bold tracking-wider">Disparador</label>
              <select 
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-slate-200 focus:ring-2 focus:ring-indigo-500/50 outline-none"
                value={newAlert.condition}
                onChange={(e) => setNewAlert({...newAlert, condition: e.target.value})}
              >
                <option value="price_above">Preço ACIMA de ({symbol})</option>
                <option value="price_below">Preço ABAIXO de ({symbol})</option>
                <option value="rsi_level">RSI atinge (0-100)</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs text-slate-500 uppercase font-bold tracking-wider">Valor Alvo</label>
              <div className="relative">
                <span className="absolute left-3 top-3.5 text-slate-500 font-mono text-sm">{symbol}</span>
                <input 
                  type="number" 
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 pl-7 text-slate-200 font-mono focus:ring-2 focus:ring-indigo-500/50 outline-none" 
                  value={newAlert.val}
                  onChange={(e) => setNewAlert({...newAlert, val: parseFloat(e.target.value)})}
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <button onClick={() => setShowAdd(false)} className="px-6 py-2 text-slate-400 hover:text-slate-200 font-medium transition-colors">Cancelar</button>
            <button 
              onClick={handleAdd} 
              className={`px-8 py-2 rounded-xl text-white font-bold transition-all shadow-lg ${newAlert.intent === 'buy' ? 'bg-emerald-600 shadow-emerald-600/20' : 'bg-rose-600 shadow-rose-600/20'}`}
            >
              Confirmar Alerta de {newAlert.intent === 'buy' ? 'Compra' : 'Venda'}
            </button>
          </div>
        </div>
      )}

      <div className="grid gap-4">
        {alerts.length === 0 ? (
          <div className="bg-slate-900/50 border border-dashed border-slate-800 p-16 text-center rounded-3xl">
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-500">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <p className="text-slate-400 font-medium">Nenhuma estratégia de trade ativa.</p>
            <p className="text-sm text-slate-600 mt-1">Seus alertas de compra e venda aparecerão aqui.</p>
          </div>
        ) : (
          alerts.map(alert => {
            const coin = cryptos.find(c => c.id === alert.coinId);
            const isBuy = alert.intent === 'buy';
            return (
              <div key={alert.id} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center justify-between hover:border-slate-700 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${isBuy ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-rose-500/10 border-rose-500/30'} overflow-hidden`}>
                    {coin && (
                      <img 
                        src={getIconUrl(coin.symbol)} 
                        alt={coin.symbol} 
                        className="w-7 h-7 object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${coin.symbol}&background=1e293b&color=6366f1&bold=true`;
                        }}
                      />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-white">{coin?.name}</p>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${isBuy ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'}`}>
                        {isBuy ? 'ALVO COMPRA' : 'ALVO VENDA'}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500">
                      Disparo: <span className="text-slate-300">{alert.condition.replace('price_', '').replace('level', '').replace('_', ' ')}</span> de <span className="font-mono text-indigo-400 font-bold">{symbol}{alert.value.toLocaleString()}</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right hidden sm:block">
                    <p className="text-[10px] text-slate-500 uppercase font-bold">Preço Atual</p>
                    <p className="font-mono text-sm">{symbol}{coin?.price.toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={() => removeAlert(alert.id)} className="p-3 text-slate-500 hover:text-rose-400 transition-all rounded-xl hover:bg-rose-500/10">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Alerts;
