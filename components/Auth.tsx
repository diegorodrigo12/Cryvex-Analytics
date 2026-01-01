
import React, { useState, useEffect } from 'react';

interface AuthProps {
  onLogin: (email: string) => void;
}

interface UserRecord {
  name: string;
  email: string;
  phone: string;
  password: string;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [step, setStep] = useState<'form' | 'verify'>('form');
  const [error, setError] = useState<string | null>(null);
  
  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [verificationCode, setVerificationCode] = useState('');

  // Clear errors when switching modes
  useEffect(() => {
    setError(null);
    setStep('form');
  }, [isLogin]);

  const getUsers = (): UserRecord[] => {
    const saved = localStorage.getItem('cryvex_users');
    return saved ? JSON.parse(saved) : [];
  };

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const users = getUsers();

    if (isLogin) {
      // Strict Login Logic
      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
      if (user) {
        onLogin(user.email);
      } else {
        setError('E-mail ou senha incorretos. Verifique seus dados ou crie uma conta.');
      }
    } else {
      // Signup Initial Step
      if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        setError('Este e-mail já está cadastrado.');
        return;
      }
      setStep('verify'); // Move to Email verification
    }
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate code verification (Code is 1234 for demo)
    if (verificationCode === '1234') {
      const users = getUsers();
      const newUser: UserRecord = { name, email, phone, password };
      localStorage.setItem('cryvex_users', JSON.stringify([...users, newUser]));
      onLogin(email);
    } else {
      setError('Código de verificação inválido. Tente "1234".');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full"></div>

      <div className="w-full max-w-md z-10">
        <div className="flex items-center justify-center gap-3 mb-10">
          <div className="w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center font-bold text-2xl text-white shadow-2xl shadow-indigo-500/20">C</div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Cryvex<span className="text-indigo-400">.</span></h1>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl transition-all duration-300">
          {step === 'form' ? (
            <>
              <h2 className="text-2xl font-bold text-white mb-2">
                {isLogin ? 'Bem-vindo de volta' : 'Crie sua conta'}
              </h2>
              <p className="text-slate-500 text-sm mb-6">
                {isLogin ? 'Entre com suas credenciais para acessar o painel.' : 'Preencha os dados abaixo para começar a lucrar.'}
              </p>

              {error && (
                <div className="mb-6 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-xs font-medium flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
                  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {error}
                </div>
              )}

              <form onSubmit={handleAuth} className="space-y-4">
                {!isLogin && (
                  <>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Nome Completo</label>
                      <input 
                        type="text" required
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:ring-2 focus:ring-indigo-500/40 outline-none transition-all"
                        placeholder="Ex: João Silva"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">E-mail</label>
                  <input 
                    type="email" required
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:ring-2 focus:ring-indigo-500/40 outline-none transition-all"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                {!isLogin && (
                   <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Telefone (Opcional)</label>
                    <input 
                      type="tel"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:ring-2 focus:ring-indigo-500/40 outline-none transition-all"
                      placeholder="(11) 99999-9999"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                )}
                
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Senha</label>
                  <input 
                    type="password" required
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:ring-2 focus:ring-indigo-500/40 outline-none transition-all"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <button 
                  type="submit" 
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-600/20 transition-all mt-4 active:scale-[0.98]"
                >
                  {isLogin ? 'Entrar no Painel' : 'Enviar Código para o E-mail'}
                </button>
              </form>
            </>
          ) : (
            <>
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-indigo-500/20">
                  <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Verifique seu e-mail</h2>
                <p className="text-slate-500 text-sm">
                  Enviamos um código de acesso temporário para <br/>
                  <span className="text-indigo-400 font-bold">{email}</span>.
                </p>
              </div>

              {error && (
                <div className="mb-6 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-xs font-medium text-center">
                  {error}
                </div>
              )}

              <form onSubmit={handleVerify} className="space-y-6">
                <div>
                  <label className="block text-center text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Código de 4 dígitos</label>
                  <div className="flex justify-center">
                    <input 
                      type="text" 
                      maxLength={4}
                      autoFocus
                      className="bg-slate-800 border-2 border-slate-700 rounded-2xl px-6 py-4 text-center text-3xl font-bold tracking-[1em] text-white focus:border-indigo-500 outline-none w-48"
                      placeholder="0000"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-600/20 transition-all active:scale-[0.98]"
                >
                  Verificar e Ativar Conta
                </button>

                <div className="text-center space-y-2">
                  <p className="text-[10px] text-slate-600 uppercase font-bold tracking-widest">Não recebeu?</p>
                  <button 
                    type="button"
                    className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors font-medium underline"
                  >
                    Reenviar código agora
                  </button>
                </div>

                <button 
                  type="button"
                  onClick={() => setStep('form')}
                  className="w-full text-xs text-slate-500 hover:text-slate-300 transition-colors font-medium"
                >
                  Voltar para os dados cadastrais
                </button>
              </form>
            </>
          )}

          <div className="mt-8 pt-8 border-t border-slate-800 text-center">
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-slate-400 hover:text-indigo-400 transition-colors font-medium"
            >
              {isLogin ? 'Não tem uma conta? Cadastre-se agora' : 'Já possui uma conta? Faça login'}
            </button>
          </div>
        </div>

        <p className="mt-10 text-center text-[10px] text-slate-600 uppercase font-bold tracking-widest opacity-50">
          Protegido por Cryvex Secure Cloud
        </p>
      </div>
    </div>
  );
};

export default Auth;
