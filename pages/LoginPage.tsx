
import React, { useState } from 'react';

const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulação de login
    setTimeout(() => {
      setLoading(false);
      alert('Sistema de Área do Aluno em desenvolvimento. Em breve você poderá acessar seus cursos pagos aqui.');
    }, 1500);
  };

  return (
    <main className="min-h-screen pt-32 px-6 flex items-center justify-center bg-[#fbfbfd]">
      <div className="max-w-[400px] w-full text-center">
        <div className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight mb-2">Área do Aluno</h1>
          <p className="text-gray-500 font-medium">Acesse seu conteúdo exclusivo.</p>
        </div>

        <div className="bg-white p-8 rounded-[40px] card-shadow text-left border border-gray-100/50">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input 
                type="email" 
                placeholder="E-mail"
                required
                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all text-lg"
              />
            </div>
            <div>
              <input 
                type="password" 
                placeholder="Senha"
                required
                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all text-lg"
              />
            </div>
            <button 
              disabled={loading}
              className={`w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Verificando...' : 'Entrar'}
            </button>
          </form>
          
          <div className="mt-8 flex flex-col gap-4 text-center">
            <a href="#" className="text-sm font-medium text-blue-600 hover:underline">Esqueceu a senha?</a>
            <div className="h-[1px] bg-gray-100 w-full my-2"></div>
            <p className="text-sm text-gray-400 font-medium">
              Ainda não é aluno? <br />
              <a href="#/livros" className="text-blue-600 font-bold hover:underline">Conheça nossos cursos</a>
            </p>
          </div>
        </div>
        
        <p className="mt-12 text-[11px] text-gray-400 leading-relaxed px-8">
          Ao entrar, você concorda com nossos termos de uso. <br />
          Sua privacidade é nossa prioridade absoluta.
        </p>
      </div>
    </main>
  );
};

export default LoginPage;
