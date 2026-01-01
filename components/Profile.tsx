
import React from 'react';

interface ProfileProps {
  user: {
    email: string;
    name?: string;
    phone?: string;
    plan: 'Free' | 'Pro';
  };
}

const Profile: React.FC<ProfileProps> = ({ user }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center gap-6 pb-8 border-b border-slate-800">
        <div className="relative">
          <div className="w-24 h-24 rounded-3xl bg-indigo-600 flex items-center justify-center text-4xl font-bold text-white shadow-2xl shadow-indigo-600/30">
            {user.name?.charAt(0) || user.email.charAt(0).toUpperCase()}
          </div>
          <div className={`absolute -bottom-2 -right-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg ${user.plan === 'Pro' ? 'bg-amber-500 text-white' : 'bg-slate-700 text-slate-300'}`}>
            {user.plan}
          </div>
        </div>
        <div>
          <h2 className="text-3xl font-black text-white">{user.name || 'Usuário Cryvex'}</h2>
          <p className="text-slate-500 text-sm mt-1">{user.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Informações Pessoais</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] text-slate-600 uppercase font-bold mb-1">Nome Completo</label>
              <p className="text-white font-medium">{user.name || 'Não informado'}</p>
            </div>
            <div>
              <label className="block text-[10px] text-slate-600 uppercase font-bold mb-1">E-mail de Acesso</label>
              <p className="text-white font-medium">{user.email}</p>
            </div>
            <div>
              <label className="block text-[10px] text-slate-600 uppercase font-bold mb-1">Telefone / WhatsApp</label>
              <p className="text-white font-medium">{user.phone || 'Não informado'}</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Estatísticas da Conta</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-800">
              <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Alertas Ativos</p>
              <p className="text-2xl font-black text-indigo-400">03</p>
            </div>
            <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-800">
              <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Plano Atual</p>
              <p className="text-lg font-black text-white">{user.plan}</p>
            </div>
          </div>
          <button className="w-full py-3 bg-indigo-600/10 hover:bg-indigo-600 text-indigo-400 hover:text-white border border-indigo-600/20 rounded-xl text-xs font-bold transition-all">
            Ver Histórico de Trades
          </button>
        </div>
      </div>

      <div className="bg-rose-500/5 border border-rose-500/20 p-8 rounded-3xl">
        <h4 className="text-rose-400 font-bold mb-2">Zona de Perigo</h4>
        <p className="text-slate-500 text-sm mb-6">Ao deletar sua conta, todos os seus alertas, watchlists e histórico de pagamento serão removidos permanentemente.</p>
        <button className="px-6 py-2 bg-rose-600/10 hover:bg-rose-600 text-rose-500 hover:text-white border border-rose-500/20 rounded-xl text-xs font-bold transition-all">
          Remover Conta Permanentemente
        </button>
      </div>
    </div>
  );
};

export default Profile;
