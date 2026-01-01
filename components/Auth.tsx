
import React, { useState } from 'react';

interface AuthProps {
  onLogin: (email: string) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      onLogin(email);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full"></div>

      <div className="w-full max-w-md z-10">
        <div className="flex items-center justify-center gap-3 mb-10">
          <div className="w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center font-bold text-2xl text-white shadow-2xl shadow-indigo-500/20">C</div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Cryvex<span className="text-indigo-400">.</span></h1>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-2">{isLogin ? 'Bem-vindo de volta' : 'Crie sua conta'}</h2>
          <p className="text-slate-500 text-sm mb-8">
            {isLogin ? 'Entre para acessar seu painel de trading.' : 'Comece a analisar o mercado cripto de forma inteligente.'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">E-mail</label>
              <input 
                type="email" 
                required
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Senha</label>
              <input 
                type="password" 
                required
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button 
              type="submit" 
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-600/20 transition-all"
            >
              {isLogin ? 'Entrar no Painel' : 'Criar Conta Grátis'}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-800 text-center">
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-slate-400 hover:text-indigo-400 transition-colors"
            >
              {isLogin ? 'Não tem uma conta? Cadastre-se' : 'Já possui uma conta? Entre aqui'}
            </button>
          </div>
        </div>

        <p className="mt-10 text-center text-xs text-slate-600">
          Ao entrar, você concorda com nossos Termos de Uso e Política de Privacidade.
        </p>
      </div>
    </div>
  );
};

export default Auth;
