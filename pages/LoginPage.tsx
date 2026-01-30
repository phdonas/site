
import React from 'react';

const LoginPage: React.FC = () => {
  return (
    <main className="min-h-screen pt-32 px-6 flex items-center justify-center bg-[#fbfbfd]">
      <div className="max-w-md w-full text-center">
        <h1 className="text-3xl font-bold mb-8">Acesse sua área exclusiva.</h1>
        <div className="bg-white p-8 rounded-3xl card-shadow text-left">
          <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">E-mail ou ID PH</label>
              <input 
                type="text" 
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Senha</label>
              <input 
                type="password" 
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-colors">
              Entrar
            </button>
          </form>
          <div className="mt-8 flex flex-col gap-4 text-center">
            <a href="#" className="apple-link text-sm">Esqueceu a senha?</a>
            <hr />
            <p className="text-sm text-gray-500">
              Não é aluno? <a href="#/" className="apple-link font-semibold">Saiba como se tornar um</a>
            </p>
          </div>
        </div>
        <p className="mt-12 text-xs text-gray-400 leading-relaxed px-4">
          Sua privacidade é nossa prioridade. Este site usa criptografia de ponta a ponta para proteger seus dados e materiais exclusivos.
        </p>
      </div>
    </main>
  );
};

export default LoginPage;
