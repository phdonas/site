
import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const ContactPage: React.FC = () => {
  const [formState, setFormState] = useState({ name: '', email: '', message: '', subject: 'consultoria' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // In a real app, send data to backend
  };

  if (submitted) {
    return (
      <main className="pt-24 min-h-screen flex items-center justify-center bg-white px-6">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
            <Send size={32} />
          </div>
          <h1 className="text-4xl font-bold mb-4">Mensagem Enviada.</h1>
          <p className="text-xl text-gray-500 mb-8">
            Obrigado pelo contato! O Prof. Paulo ou alguém de nossa equipe responderá em breve.
          </p>
          <button 
            onClick={() => setSubmitted(false)}
            className="apple-link font-bold text-lg"
          >
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
              Tem alguma dúvida sobre cursos, consultoria ou quer agendar uma palestra? Estamos aqui para ouvir.
            </p>
            
            <div className="space-y-8">
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center">
                  <Mail className="text-gray-600" size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">E-mail Profissional</p>
                  <p className="text-lg font-semibold">contato@phdonassolo.com</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center">
                  <Phone className="text-gray-600" size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">WhatsApp / Telefone</p>
                  <p className="text-lg font-semibold">+55 (00) 00000-0000</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center">
                  <MapPin className="text-gray-600" size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Localização</p>
                  <p className="text-lg font-semibold">São Paulo / Remoto</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#f5f5f7] rounded-[48px] p-12">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Nome</label>
                  <input 
                    type="text" 
                    required
                    className="w-full px-6 py-4 bg-white rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm"
                    placeholder="Seu nome"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">E-mail</label>
                  <input 
                    type="email" 
                    required
                    className="w-full px-6 py-4 bg-white rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm"
                    placeholder="seu@email.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Assunto</label>
                <select className="w-full px-6 py-4 bg-white rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm appearance-none cursor-pointer">
                  <option value="consultoria">Consultoria Imobiliária / Gás</option>
                  <option value="mentoria">Mentoria Individual</option>
                  <option value="cursos">Dúvidas sobre Cursos</option>
                  <option value="outros">Outros assuntos</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Mensagem</label>
                <textarea 
                  rows={4}
                  required
                  className="w-full px-6 py-4 bg-white rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm resize-none"
                  placeholder="Como podemos ajudar?"
                ></textarea>
              </div>
              <button 
                type="submit"
                className="w-full bg-blue-600 text-white py-5 rounded-2xl text-lg font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
              >
                Enviar Mensagem
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ContactPage;
