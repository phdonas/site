import React from 'react';

const EstiloNegociadorPage: React.FC = () => {
  return (
    <main className="min-h-screen pt-32 px-6 bg-[#fbfbfd] pb-24">
      <div className="max-w-[760px] mx-auto">
        <div className="w-full bg-[#0f0e0c] rounded-[30px] shadow-2xl overflow-hidden border border-gray-200" style={{ height: '900px' }}>
          <iframe 
            src="/ferramentas/estilo_negociador/index.html" 
            title="Teste Estilo Negociador"
            className="w-full h-full border-none"
          />
        </div>
      </div>
    </main>
  );
};

export default EstiloNegociadorPage;
