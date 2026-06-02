import React, { useState } from 'react';
import { CheckCircle2, AlertCircle, Loader2, Mail, User, Phone, ArrowRight } from 'lucide-react';

const AreaAlunoEmBreve = () => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    const formData = new FormData(e.currentTarget);
    const params = new URLSearchParams();
    params.append('unm', formData.get('name') as string);
    params.append('uem', formData.get('email') as string);
    params.append('utel', formData.get('phone') as string);
    params.append('umsg', 'Pre-cadastro Area Aluno - Maio 2026');

    try {
      const response = await fetch('./form-handler.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json'
        },
        body: params.toString()
      });

      const text = await response.text();
      let result;
      
      try {
        result = JSON.parse(text);
      } catch (e) {
        console.error('Resposta não-JSON do servidor:', text);
        setStatus('error');
        setErrorMessage('O servidor retornou uma resposta inválida. Por favor, tente novamente.');
        return;
      }

      if (result.success) {
        setStatus('success');
      } else {
        setStatus('error');
        setErrorMessage(result.message || 'Ocorreu um erro ao enviar seus dados.');
      }
    } catch (error) {
      console.error('Erro de conexão:', error);
      setStatus('error');
      setErrorMessage('Erro de conexão. Por favor, verifique sua internet ou tente novamente.');
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] flex flex-col items-center justify-center p-6 relative overflow-hidden pt-24">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-teal-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-xl w-full relative z-10">
        {/* Header / Logo */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-6">
            <div className="w-3 h-3 bg-teal-500 rounded-full animate-pulse" />
            <span className="text-xs font-bold tracking-[0.2em] text-gray-400 uppercase">PH Donassolo • PHD Academy</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-gray-900 mb-4">
            Área do Aluno <span className="text-blue-600">em Breve</span>
          </h1>
          <p className="text-lg text-gray-500 leading-relaxed">
            Estamos preparando uma experiência de aprendizado transformadora. 
            A liberação oficial ocorrerá na <span className="text-gray-900 font-bold underline decoration-blue-600/30">primeira semana de maio de 2026</span>.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-[32px] p-8 md:p-10 border border-white shadow-2xl shadow-blue-500/5">
          {status === 'success' ? (
            <div className="text-center py-8 animate-in fade-in zoom-in duration-500">
              <div className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-teal-600" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Inscrição Confirmada!</h2>
              <p className="text-gray-500">
                Obrigado pelo seu interesse. Você será o primeiro a saber quando a plataforma estiver liberada.
              </p>
              <button 
                onClick={() => setStatus('idle')}
                className="mt-8 text-sm font-bold text-blue-600 hover:underline transition-all"
              >
                Voltar
              </button>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <h2 className="text-xl font-bold mb-2 text-gray-900">Pré-cadastro de Alunos</h2>
                <p className="text-sm text-gray-500">
                  Informe seus dados abaixo para receber o aviso de liberação e garantir condições exclusivas de lançamento.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">
                    Nome Completo
                  </label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      placeholder="Como deseja ser chamado?"
                      className="w-full bg-white border border-gray-200 rounded-xl py-3.5 pl-12 pr-4 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 transition-all text-gray-900"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">
                    E-mail Principal
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      placeholder="seu@email.com"
                      className="w-full bg-white border border-gray-200 rounded-xl py-3.5 pl-12 pr-4 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 transition-all text-gray-900"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="phone" className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">
                    WhatsApp (Opcional)
                  </label>
                  <div className="relative group">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      placeholder="(00) 00000-0000"
                      className="w-full bg-white border border-gray-200 rounded-xl py-3.5 pl-12 pr-4 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 transition-all text-gray-900"
                    />
                  </div>
                </div>

                {/* LGPD Consent */}
                <div className="flex items-start gap-3 pt-2">
                  <div className="flex items-center h-5">
                    <input
                      id="consent"
                      name="consent"
                      type="checkbox"
                      required
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600/20 transition-all cursor-pointer"
                    />
                  </div>
                  <label htmlFor="consent" className="text-[11px] leading-tight text-gray-500 cursor-pointer select-none">
                    Concordo em fornecer meus dados para que o PH Donassolo possa entrar em contato comigo para avisar sobre a liberação da Área do Aluno e outras comunicações relevantes (LGPD).
                  </label>
                </div>

                {status === 'error' && (
                  <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <p>{errorMessage}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full group relative flex items-center justify-center gap-2 bg-gray-900 text-white py-4 rounded-xl font-bold hover:bg-blue-600 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed shadow-xl hover:shadow-blue-600/20"
                >
                  {status === 'loading' ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Processando...</span>
                    </>
                  ) : (
                    <>
                      <span>Quero receber o aviso de liberação</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            </>
          )}
        </div>

        {/* Footer info */}
        <p className="text-center mt-12 text-[11px] text-gray-400 uppercase tracking-widest font-medium">
          Prof. Paulo Donassolo • Todos os direitos reservados © 2026
        </p>
      </div>
    </div>
  );
};

export default AreaAlunoEmBreve;
