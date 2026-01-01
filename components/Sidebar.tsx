
import React from 'react';
import { View } from '../types';

interface SidebarProps {
  currentView: View;
  setCurrentView: (view: View) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onLogout: () => void;
  user: { email: string; plan: 'Free' | 'Pro' };
  isUpdating?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView, isOpen, setIsOpen, onLogout, user, isUpdating }) => {
  const menuItems: { id: View; label: string; icon: string }[] = [
    { id: 'dashboard', label: 'Painel Geral', icon: '📊' },
    { id: 'upcoming', label: 'Lançamentos', icon: '🚀' },
    { id: 'alerts', label: 'Alertas', icon: '🔔' },
    { id: 'news', label: 'Notícias', icon: '📰' },
    { id: 'premium', label: 'Cryvex Pro', icon: '💎' },
  ];

  const handleNav = (id: View) => {
    setCurrentView(id);
    setIsOpen(false);
  };

  return (
    <aside className={`
      fixed lg:static inset-y-0 left-0 z-30 w-64 bg-slate-900 border-r border-slate-800 transition-transform duration-300
      flex flex-col
      ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
    `}>
      <div className="p-6 flex-1">
        <div className="flex items-center gap-2 mb-10">
          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">C</div>
          <h1 className="text-xl font-bold tracking-tight text-white">Cryvex<span className="text-indigo-400">.</span></h1>
        </div>

        <nav className="space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                ${currentView === item.id 
                  ? 'bg-indigo-600/10 text-indigo-400 font-medium border border-indigo-500/20 shadow-lg shadow-indigo-500/5' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}
              `}
            >
              <span className="text-xl group-hover:scale-110 transition-transform">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="p-6 space-y-4 border-t border-slate-800">
        <div className="bg-slate-800/50 rounded-2xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-xs font-bold text-indigo-400">
              {user.email.substring(0, 2).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-slate-300 font-medium truncate">{user.email}</p>
              <p className={`text-[10px] uppercase font-bold tracking-tighter ${user.plan === 'Pro' ? 'text-amber-400' : 'text-slate-500'}`}>
                Plano {user.plan}
              </p>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 py-2 text-xs font-bold text-rose-400 hover:text-rose-300 hover:bg-rose-400/10 rounded-lg transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sair da Conta
          </button>
        </div>

        <div className="flex items-center gap-2 px-2">
          <div className={`w-2 h-2 rounded-full ${isUpdating ? 'bg-indigo-500 animate-ping' : 'bg-emerald-500 animate-pulse'}`}></div>
          <span className="text-xs font-medium text-slate-500">{isUpdating ? 'Sincronizando...' : 'Live Market Feed'}</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
