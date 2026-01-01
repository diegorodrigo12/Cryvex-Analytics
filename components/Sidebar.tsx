
import React from 'react';
import { View } from '../types';

interface SidebarProps {
  currentView: View;
  setCurrentView: (view: View) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView, isOpen, setIsOpen }) => {
  const menuItems: { id: View; label: string; icon: string }[] = [
    { id: 'dashboard', label: 'Painel Geral', icon: '📊' },
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
      ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
    `}>
      <div className="p-6">
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

      <div className="absolute bottom-0 left-0 w-full p-6 border-t border-slate-800">
        <div className="bg-slate-800/50 rounded-2xl p-4">
          <p className="text-xs text-slate-500 mb-1">Status do Mercado</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-sm font-medium text-slate-300">Conectado</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
