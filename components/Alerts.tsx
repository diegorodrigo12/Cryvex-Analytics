
import React, { useState } from 'react';
import { Alert, CryptoCurrency } from '../types';

interface AlertsProps {
  alerts: Alert[];
  setAlerts: React.Dispatch<React.SetStateAction<Alert[]>>;
  cryptos: CryptoCurrency[];
}

const Alerts: React.FC<AlertsProps> = ({ alerts, setAlerts, cryptos }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [newAlert, setNewAlert] = useState<{coinId: string, val: number, condition: string}>({
    coinId: cryptos[0].id,
    val: 0,
    condition: 'price_above'
  });

  const handleAdd = () => {
    const alert: Alert = {
      id: Math.random().toString(36).substr(2, 9),
      coinId: newAlert.coinId,
      condition: newAlert.condition as any,
      value: newAlert.val,
      active: true,
      createdAt: Date.now()
    };
    setAlerts([...alerts, alert]);
    setShowAdd(false);
  };

  const removeAlert = (id: string) => {
    setAlerts(alerts.filter(a => a.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Seus Alertas</h2>
          <p className="text-slate-500 text-sm">Monitore o mercado automaticamente enquanto você dorme.</p>
        </div>
        <button 
          onClick={() => setShowAdd(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-medium transition-all"
        >
          Novo Alerta
        </button>
      </div>

      {showAdd && (
        <div className="bg-slate-900 border border-indigo-500/30 p-6 rounded-2xl shadow-xl space-y-4">
          <h3 className="text-lg font-bold text-white">Configurar Alerta</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-slate-500 mb-1">Criptoativo</label>
              <select 
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-slate-200"
                value={newAlert.coinId}
                onChange={(e) => setNewAlert({...newAlert, coinId: e.target.value})}
              >
                {cryptos.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Condição</label>
              <select 
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-slate-200"
                value={newAlert.condition}
                onChange={(e) => setNewAlert({...newAlert, condition: e.target.value})}
              >
                <option value="price_above">Preço acima de</option>
                <option value="price_below">Preço abaixo de</option>
                <option value="rsi_level">RSI igual ou maior que</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Valor</label>
              <input 
                type="number" 
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-slate-200" 
                placeholder="Ex: 50000"
                value={newAlert.val}
                onChange={(e) => setNewAlert({...newAlert, val: parseFloat(e.target.value)})}
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setShowAdd(false)} className="px-4 py-2 text-slate-400 hover:text-slate-200">Cancelar</button>
            <button onClick={handleAdd} className="bg-indigo-600 px-6 py-2 rounded-xl text-white font-bold">Criar Alerta</button>
          </div>
        </div>
      )}

      <div className="grid gap-4">
        {alerts.length === 0 ? (
          <div className="bg-slate-900/50 border border-dashed border-slate-800 p-12 text-center rounded-2xl">
            <p className="text-slate-500">Nenhum alerta ativo no momento.</p>
          </div>
        ) : (
          alerts.map(alert => {
            const coin = cryptos.find(c => c.id === alert.coinId);
            return (
              <div key={alert.id} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center font-bold">
                    {coin?.symbol[0]}
                  </div>
                  <div>
                    <p className="font-bold text-white">{coin?.name} Alerta</p>
                    <p className="text-sm text-slate-500">
                      Notificar quando o {alert.condition.replace('_', ' ')} atingir <b>{alert.value}</b>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className={`px-2 py-1 rounded text-[10px] font-bold ${alert.active ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-500/10 text-slate-500'}`}>
                    {alert.active ? 'ATIVO' : 'DESATIVADO'}
                  </div>
                  <button onClick={() => removeAlert(alert.id)} className="p-2 text-slate-500 hover:text-rose-400 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
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
