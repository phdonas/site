
import React from 'react';

const LeadForm: React.FC = () => {
  return (
    <section className="py-24 px-6 bg-white border-t border-gray-100">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-4xl font-bold tracking-tight mb-4">Mantenha-se atualizado.</h2>
        <p className="text-xl text-gray-500 mb-10">
          Receba notificações sobre novos artigos, cursos e materiais exclusivos diretamente no seu e-mail.
        </p>
        <form className="flex flex-col sm:flex-row gap-4" onSubmit={(e) => e.preventDefault()}>
          <input 
            type="email" 
            placeholder="Seu melhor e-mail" 
            className="flex-1 px-6 py-4 bg-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all text-lg"
            required
          />
          <button 
            type="submit"
            className="bg-black text-white px-8 py-4 rounded-2xl text-lg font-semibold hover:bg-gray-800 transition-all"
          >
            Inscrever-se
          </button>
        </form>
        <p className="mt-6 text-sm text-gray-400">
          Respeitamos sua privacidade. Cancele a inscrição a qualquer momento.
        </p>
      </div>
    </section>
  );
};

export default LeadForm;
