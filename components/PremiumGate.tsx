
import React, { useState } from 'react';

// ==========================================================
// CONFIGURAÇÕES DE PAGAMENTO REAL (ALTERE AQUI)
// ==========================================================
const SEUS_DADOS_PAGAMENTO = {
  // 1. Sua chave PIX (CPF, E-mail, Telefone ou Chave Aleatória)
  pixKey: "suachave@email.com", 
  
  // 2. Seu nome completo (como aparece no banco)
  nomeRecebedor: "NOME DO PROPRIETARIO", 
  
  // 3. Sua cidade (sem acentos)
  cidade: "SAO PAULO", 

  // 4. Link do Stripe ou Mercado Pago (Gerado no painel deles)
  stripeLink: "https://buy.stripe.com/seu_link_real_aqui",

  // 5. Código PIX Copia e Cola (Gerado no seu App do Banco)
  // Recomendo gerar um PIX de valor estático (ex: R$ 49,00) no seu banco 
  // e colar o código "Copia e Cola" inteiro aqui:
  pixCopiaECola: "00020126360014BR.GOV.BCB.PIX0114suachave@email.com520400005303986540549.005802BR5913NOME_DA_LOJA6009SAO_PAULO62070503***6304E2B1"
};

interface PremiumGateProps {
  user: { email: string, plan: 'Free' | 'Pro' };
  onUpgrade: () => void;
}

const PremiumGate: React.FC<PremiumGateProps> = ({ user, onUpgrade }) => {
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<'options' | 'pix' | 'verifying'>('options');
  const [copied, setCopied] = useState(false);

  const startCheckout = () => {
    if (user.plan === 'Pro') return;
    setShowCheckout(true);
    setCheckoutStep('options');
  };

  const handleStripeRedirect = () => {
    // Abre seu link real do Stripe em outra aba
    window.open(SEUS_DADOS_PAGAMENTO.stripeLink, '_blank');
    setCheckoutStep('verifying');
  };

  const copyPix = () => {
    navigator.clipboard.writeText(SEUS_DADOS_PAGAMENTO.pixCopiaECola);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const simulateSuccess = () => {
    // IMPORTANTE: Em um app real com backend, o upgrade acontece via Webhook.
    // Aqui, o usuário clica no botão após pagar para "forçar" a entrada no Pro.
    onUpgrade();
    setShowCheckout(false);
  };

  return (
    <div className="max-w-5xl mx-auto py-12 px-4 relative">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-extrabold text-white mb-4">Eleve seu Trade ao <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Próximo Nível</span></h2>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          Desbloqueie ferramentas exclusivas e insights de IA ilimitados com ativação imediata.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Card Plano Free */}
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl relative opacity-80">
          <h3 className="text-xl font-bold text-white mb-2">Plano Gratuito</h3>
          <p className="text-slate-500 text-sm mb-6">Essencial para iniciantes.</p>
          <div className="text-3xl font-bold text-white mb-8">R$ 0<span className="text-sm font-normal text-slate-500">/mês</span></div>
          
          <ul className="space-y-4 mb-10">
            {['Dashboard Básico', '3 Alertas ativos', 'IA Analysis (5/dia)'].map(feature => (
              <li key={feature} className="flex items-center gap-3 text-slate-400 text-sm">
                <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                {feature}
              </li>
            ))}
          </ul>
          
          <button disabled className="w-full py-3 bg-slate-800 text-slate-500 rounded-xl font-bold">
            {user.plan === 'Free' ? 'Seu Plano Atual' : 'Plano Básico'}
          </button>
        </div>

        {/* Card Plano Pro */}
        <div className={`bg-slate-900 border-2 ${user.plan === 'Pro' ? 'border-amber-500' : 'border-indigo-500'} p-8 rounded-3xl relative shadow-2xl shadow-indigo-500/10 transition-all`}>
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
            Mais Vendido
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Cryvex Pro</h3>
          <p className="text-slate-500 text-sm mb-6">Para decisões rápidas e lucros reais.</p>
          <div className="text-3xl font-bold text-white mb-8">R$ 49<span className="text-sm font-normal text-slate-500">/mês</span></div>
          
          <ul className="space-y-4 mb-10">
            {['Alertas Ilimitados', 'Notificações via WhatsApp', 'IA Pro sem limites', 'Indicadores de Volume Real'].map(feature => (
              <li key={feature} className="flex items-center gap-3 text-slate-200 text-sm font-medium">
                <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                {feature}
              </li>
            ))}
          </ul>
          
          <button 
            onClick={startCheckout}
            disabled={user.plan === 'Pro'}
            className={`w-full py-4 ${user.plan === 'Pro' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-indigo-600 hover:bg-indigo-500 text-white'} rounded-xl font-bold transition-all shadow-xl shadow-indigo-600/30 active:scale-[0.98]`}
          >
            {user.plan === 'Pro' ? 'Assinatura Ativa' : 'Assinar e Começar Agora'}
          </button>
        </div>
      </div>

      {/* Modal de Checkout Real */}
      {showCheckout && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center">
              <div>
                <h4 className="text-lg font-bold text-white">Pagamento Seguro</h4>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Gateway Criptografado</p>
              </div>
              <button onClick={() => setShowCheckout(false)} className="text-slate-500 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="p-8">
              {checkoutStep === 'options' && (
                <div className="space-y-4">
                  <button 
                    onClick={handleStripeRedirect}
                    className="w-full flex items-center justify-between p-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-2xl transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-bold text-white">Cartão / Apple Pay</p>
                        <p className="text-[10px] text-slate-500 font-bold uppercase">Stripe Checkout</p>
                      </div>
                    </div>
                  </button>

                  <button 
                    onClick={() => setCheckoutStep('pix')}
                    className="w-full flex items-center justify-between p-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-2xl transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L4.5 20.29L5.21 21L12 18L18.79 21L19.5 20.29L12 2Z"/></svg>
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-bold text-white">PIX Instantâneo</p>
                        <p className="text-[10px] text-slate-500 font-bold uppercase">Aprovação em 2 min</p>
                      </div>
                    </div>
                  </button>
                </div>
              )}

              {checkoutStep === 'pix' && (
                <div className="text-center space-y-6">
                  <div className="bg-white p-4 rounded-2xl inline-block shadow-xl">
                    {/* Gera o QR Code com base no SEU código real */}
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(SEUS_DADOS_PAGAMENTO.pixCopiaECola)}`} 
                      alt="PIX QR Code" 
                      className="w-40 h-40" 
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <p className="text-xs text-slate-400">Copie a chave e pague no app do seu banco:</p>
                    <div className="flex items-center gap-2 bg-slate-800 p-3 rounded-xl border border-slate-700">
                      <code className="text-[10px] text-slate-300 font-mono flex-1 truncate">{SEUS_DADOS_PAGAMENTO.pixCopiaECola}</code>
                      <button 
                        onClick={copyPix}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all ${copied ? 'bg-emerald-600' : 'bg-indigo-600'}`}
                      >
                        {copied ? 'Copiado' : 'Copiar'}
                      </button>
                    </div>
                  </div>

                  <button 
                    onClick={() => setCheckoutStep('verifying')}
                    className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-2xl border border-slate-700"
                  >
                    Já fiz o pagamento
                  </button>
                </div>
              )}

              {checkoutStep === 'verifying' && (
                <div className="text-center space-y-6 py-4">
                  <div className="animate-spin w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto"></div>
                  <div>
                    <h5 className="text-xl font-bold text-white">Processando Acesso</h5>
                    <p className="text-sm text-slate-500 mt-2 px-6">
                      Aguardamos a confirmação do banco. Se você já pagou, clique abaixo para liberar.
                    </p>
                  </div>
                  <button 
                    onClick={simulateSuccess}
                    className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl shadow-lg"
                  >
                    Confirmar e Entrar no PRO
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="mt-20 flex flex-col items-center opacity-40">
        <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mb-6">Parceiros de Segurança</p>
        <div className="flex gap-12 grayscale">
          <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" alt="Stripe" className="h-5" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/a/a2/Logo_Pix.png" alt="PIX" className="h-5" />
        </div>
      </div>
    </div>
  );
};

export default PremiumGate;
