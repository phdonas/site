
import React, { useState, useEffect } from 'react';
import { DataService } from '../services/dataService';

const Navbar: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    DataService.testConnection().then(setIsConnected);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 apple-blur border-b border-gray-200/50">
      <div className="max-w-6xl mx-auto px-6 h-12 flex items-center justify-between text-xs font-medium tracking-tight text-gray-800">
        <div className="flex items-center gap-8">
          <a href="#/" className="flex items-center gap-2 group">
            <span className="text-lg font-bold tracking-tighter group-hover:opacity-70 transition-opacity">PH DONASSOLO</span>
            {isConnected && (
              <span className="flex h-1.5 w-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" title="WordPress Conectado"></span>
            )}
          </a>
          <div className="hidden md:flex items-center gap-6">
            <a href="#/artigos" className="hover:text-black transition-colors">Artigos</a>
            <a href="#/servicos" className="hover:text-black transition-colors">Serviços</a>
            <a href="#/downloads" className="hover:text-black transition-colors">Downloads</a>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <a href="#/contato" className="hover:text-black transition-colors">Contato</a>
          <a 
            href="#/login" 
            className="bg-blue-600 text-white px-3 py-1 rounded-full hover:bg-blue-700 transition-colors"
          >
            Área do Aluno
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
