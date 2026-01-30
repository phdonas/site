
import React, { useState, useEffect, useRef } from 'react';
import { askAssistant } from '../services/gemini';
import { MessageSquare, X, Send, MessageCircle } from 'lucide-react';
import { SITE_CONFIG } from '../config/site-config';

const AIChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{role: 'user'|'ai', content: string}[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    const response = await askAssistant(userMsg);
    setMessages(prev => [...prev, { role: 'ai', content: response }]);
    setIsLoading(false);
  };

  const openWhatsApp = () => {
    const url = `https://wa.me/${SITE_CONFIG.whatsapp}?text=${encodeURIComponent(SITE_CONFIG.whatsapp_message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      {!isOpen ? (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-black text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center gap-2 font-medium"
        >
          <MessageSquare size={20} />
          <span>Falar com Assistente</span>
        </button>
      ) : (
        <div className="bg-white w-80 md:w-96 h-[550px] rounded-[32px] shadow-2xl flex flex-col overflow-hidden border border-gray-100 animate-in slide-in-from-bottom-4 duration-300">
          <div className="p-5 bg-gray-50 border-b flex items-center justify-between">
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-blue-500/20">PH</div>
               <span className="font-bold text-sm tracking-tight uppercase text-gray-500">{SITE_CONFIG.assistant.name}</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-black p-1">
              <X size={20} />
            </button>
          </div>
          
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4 text-sm leading-relaxed bg-white">
            <div className="bg-blue-50 p-4 rounded-2xl rounded-tl-none mr-8 text-[#1d1d1f] font-medium border border-blue-100">
              {SITE_CONFIG.assistant.welcome_message}
            </div>
            {messages.map((m, i) => (
              <div 
                key={i} 
                className={`${m.role === 'user' ? 'bg-gray-100 ml-8' : 'bg-blue-50 mr-8 border border-blue-100'} p-4 rounded-2xl ${m.role === 'user' ? 'rounded-tr-none' : 'rounded-tl-none'} text-[#1d1d1f] font-medium`}
              >
                {m.content}
              </div>
            ))}
            {isLoading && <div className="text-gray-400 italic px-2 animate-pulse">Digitando...</div>}
          </div>

          {/* Atalho WhatsApp interno */}
          <div className="px-5 py-3 border-t border-gray-50 bg-gray-50/50">
            <button 
              onClick={openWhatsApp}
              className="w-full flex items-center justify-center gap-2 py-2 bg-[#25D366] text-white rounded-xl font-bold text-xs hover:opacity-90 transition-opacity shadow-sm"
            >
              <MessageCircle size={16} /> Falar com Paulo no WhatsApp
            </button>
          </div>

          <div className="p-5 border-t flex items-center gap-2 bg-white">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Digite sua dúvida..."
              className="flex-1 bg-gray-100 rounded-2xl px-5 py-3 outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
            />
            <button 
              onClick={handleSend}
              className="bg-blue-600 text-white p-3 rounded-2xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIChat;
