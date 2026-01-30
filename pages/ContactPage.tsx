
import React, { useState } from 'react';
import { Mail, MessageCircle, ArrowRight, Send } from 'lucide-react';
import { SITE_CONFIG } from '../config/site-config';

const ContactPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <main className="pt-24 min-h-screen flex items-center justify-center bg-white px-6 text-center">
        <div className="max-w-md animate-in zoom-in duration-500">
          <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
            <Send size={32} />
          </div>
          <h1 className="text-4xl font-bold mb-4 tracking-tight">Mensagem Recebida.</h1>
          <p className="text-xl text-gray-500 mb-8 font-medium">Obrigado! Nossa equipe entrará em contato em até 24 horas.</p>
          <button onClick={() => setSubmitted(false)} className="text-blue-600 font-bold text-lg hover:underline decoration-2 underline-offset-4">
            Enviar outra mensagem
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-24 min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          <div>
            <h1 className="text-6xl font-bold tracking-tight mb-8">Fale conosco.</h1>
            <p className="text-2xl text-gray-500 font-medium mb-12 leading-relaxed">
              Dúvidas sobre cursos, consultoria ou parcerias? Nossa equipe está pronta para ajudar você.
            </p>
            <div className="space-y-10">
              <div className="flex items-start gap-6 group">
                <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors shadow-sm">
                  <Mail size={24} />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">E-mail Corporativo</p>
                  <a href={`mailto:${SITE_CONFIG.email_contato}`} className="text-xl font-bold text-[#1d1d1f] hover:text-blue-600 transition-colors">
                    {SITE_CONFIG.email_contato}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-6 group">
                <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-green-50 group-hover:text-green-600 transition-colors shadow-sm">
                  <MessageCircle size={24} />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">WhatsApp Direto</p>
                  <p className="text-xl font-bold text-[#1d1d1f] leading-tight">
                    Acesse o botão <span className="text-blue-600">Assistente</span> no canto da tela para iniciar uma conversa imediata.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-[#f5f5f7] rounded-[48px] p-8 md:p-12 border border-gray-100/50 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">Nome</label>
                  <input type="text" required placeholder="Ex: Paulo Silva" className="w-full px-6 py-4 bg-white rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 border border-transparent focus:border-blue-200 transition-all font-medium" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">E-mail</label>
                  <input type="email" required placeholder="seu@email.com" className="w-full px-6 py-4 bg-white rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 border border-transparent focus:border-blue-200 transition-all font-medium" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">Assunto de Interesse</label>
                <select className="w-full px-6 py-4 bg-white rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 border border-transparent focus:border-blue-200 transition-all font-medium appearance-none cursor-pointer">
                  <option>Consultoria Imobiliária</option>
                  <option>Mentoria Individual</option>
                  <option>Cursos Online</option>
                  <option>Academia do Gás</option>
                  <option>Outros</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">Sua Mensagem</label>
                <textarea rows={4} required placeholder="Como podemos impulsionar seu projeto hoje?" className="w-full px-6 py-4 bg-white rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 border border-transparent focus:border-blue-200 transition-all font-medium resize-none"></textarea>
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white py-5 rounded-2xl text-lg font-bold hover:bg-blue-700 shadow-xl shadow-blue-500/10 transition-all flex items-center justify-center gap-2 group">
                Enviar Mensagem <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ContactPage;
