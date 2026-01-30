
import React from 'react';

const Navbar: React.FC = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 apple-blur border-b border-gray-200/50">
      <div className="max-w-6xl mx-auto px-6 h-12 flex items-center justify-between text-xs font-medium tracking-tight text-gray-800">
        <div className="flex items-center gap-8">
          <a href="#/" className="text-lg font-bold tracking-tighter hover:opacity-70 transition-opacity">PH DONASSOLO</a>
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
