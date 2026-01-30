
import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { SITE_CONFIG } from '../config/site-config';

const ContactPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulação de envio - aqui você integraria com EmailJS ou similar
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <main className="pt-24 min-h-screen flex items-center justify-center bg-white px-6 text-center">
        <div className="max-w-md">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce"><Send size={32} /></div>
          <h1 className="text-4xl font-bold mb-4">Mensagem Enviada.</h1>
          <p className="text-xl text-gray-500 mb-8">Obrigado! Responderemos para o seu e-mail em até 24h.</p>
          <button onClick={() => setSubmitted(false)} className="apple-link font-bold text-lg underline">Enviar outra mensagem</button>
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
            <p className="text-2xl text-gray-500 font-medium mb-12">Dúvidas sobre cursos ou consultoria? Estamos aqui.</p>
            <div className="space-y-8">
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center"><Mail className="text-gray-600" /></div>
                <div><p className="text-xs font-bold text-gray-400 uppercase tracking-widest">E-mail</p><p className="text-lg font-semibold">{SITE_CONFIG.email_contato}</p></div>
              </div>
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center"><Phone className="text-gray-600" /></div>
                <div><p className="text-xs font-bold text-gray-400 uppercase tracking-widest">WhatsApp</p><p className="text-lg font-semibold">Clique no botão flutuante ao lado</p></div>
              </div>
            </div>
          </div>
          <div className="bg-[#f5f5f7] rounded-[48px] p-12">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input type="text" required placeholder="Seu nome" className="w-full px-6 py-4 bg-white rounded-2xl outline-none focus:ring-2 focus:ring-blue-500" />
                <input type="email" required placeholder="seu@email.com" className="w-full px-6 py-4 bg-white rounded-2xl outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <select className="w-full px-6 py-4 bg-white rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 appearance-none">
                <option>Consultoria Imobiliária</option>
                <option>Mentoria Individual</option>
                <option>Academia do Gás</option>
              </select>
              <textarea rows={4} required placeholder="Como podemos ajudar?" className="w-full px-6 py-4 bg-white rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 resize-none"></textarea>
              <button type="submit" className="w-full bg-blue-600 text-white py-5 rounded-2xl text-lg font-bold hover:bg-blue-700 shadow-xl transition-all">Enviar Mensagem</button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ContactPage;
