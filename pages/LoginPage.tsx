import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebase';

const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      window.location.hash = '#/admin';
    } catch (error: any) {
      console.error(error);
      alert('Email ou senha inválidos. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen pt-32 px-6 flex items-center justify-center bg-[#fbfbfd]">
      <div className="max-w-[400px] w-full text-center">
        <div className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight mb-2">Acesso Restrito</h1>
          <p className="text-gray-500 font-medium">Alunos e Administradores</p>
        </div>

        <div className="bg-white p-8 rounded-[40px] card-shadow text-left border border-gray-100/50">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="E-mail"
                required
                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all text-lg"
              />
            </div>
            <div>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
            <p className="text-xs text-gray-400 font-medium italic">
              Dica: use email para acessar o painel administrativo.
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
