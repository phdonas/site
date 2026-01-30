
import React, { useState } from 'react';
import { askAssistant } from '../services/gemini';
import { MessageSquare, X, Send } from 'lucide-react';

const AIChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{role: 'user'|'ai', content: string}[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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
        <div className="bg-white w-80 md:w-96 h-[500px] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-gray-100">
          <div className="p-4 bg-gray-50 border-b flex items-center justify-between">
            <span className="font-bold text-sm tracking-tight">ASSISTENTE DIGITAL</span>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-black">
              <X size={20} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm leading-relaxed">
            <div className="bg-blue-50 p-3 rounded-2xl rounded-tl-none mr-8">
              Olá! Como posso ajudar você hoje com os conteúdos e serviços do Paulo Donassolo?
            </div>
            {messages.map((m, i) => (
              <div 
                key={i} 
                className={`${m.role === 'user' ? 'bg-gray-100 ml-8' : 'bg-blue-50 mr-8'} p-3 rounded-2xl ${m.role === 'user' ? 'rounded-tr-none' : 'rounded-tl-none'}`}
              >
                {m.content}
              </div>
            ))}
            {isLoading && <div className="text-gray-400 italic">Digitando...</div>}
          </div>
          <div className="p-4 border-t flex items-center gap-2">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Pergunte algo..."
              className="flex-1 bg-gray-100 rounded-full px-4 py-2 outline-none focus:ring-1 focus:ring-blue-400"
            />
            <button 
              onClick={handleSend}
              className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors"
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
