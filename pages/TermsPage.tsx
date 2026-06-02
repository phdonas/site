import React, { useEffect } from 'react';
import { Shield } from 'lucide-react';

const TermsPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="min-h-screen pt-32 pb-24 px-6 bg-[#fbfbfd]">
      <div className="max-w-3xl mx-auto">
        <div className="mb-12">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6">
            <Shield className="text-blue-600" size={32} />
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">Termos de Uso</h1>
          <p className="text-gray-500 text-lg">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
        </div>

        <div className="prose prose-lg text-gray-600">
          <h2 className="text-2xl font-bold text-black mb-4 mt-8">1. Aceitação dos Termos</h2>
          <p className="mb-6">
            Ao acessar e usar a plataforma PH Donassolo, você concorda em cumprir e ficar vinculado a estes Termos de Uso.
            Se você não concordar com qualquer parte destes termos, não deverá acessar nossos serviços.
          </p>

          <h2 className="text-2xl font-bold text-black mb-4 mt-8">2. Uso da Plataforma e Área do Aluno</h2>
          <p className="mb-6">
            A Área do Aluno e todos os materiais nela contidos (cursos, vídeos, planilhas, PDFs) são de uso exclusivo e intransferível do titular da conta.
            É estritamente proibido o compartilhamento de senhas, revenda ou distribuição não autorizada do material.
          </p>

          <h2 className="text-2xl font-bold text-black mb-4 mt-8">3. Propriedade Intelectual</h2>
          <p className="mb-6">
            Todo o conteúdo presente no site e na Área do Aluno, incluindo logotipos, textos, gráficos, imagens, áudios e vídeos, é de propriedade exclusiva da PH Donassolo e protegido pelas leis de direitos autorais.
          </p>

          <h2 className="text-2xl font-bold text-black mb-4 mt-8">4. Cancelamento e Reembolso</h2>
          <p className="mb-6">
            As políticas de cancelamento e reembolso obedecem à legislação vigente (Código de Defesa do Consumidor). Para compras virtuais, o usuário tem o prazo de 7 dias de garantia incondicional a partir da data de liberação do acesso.
          </p>

          <h2 className="text-2xl font-bold text-black mb-4 mt-8">5. Modificações dos Termos</h2>
          <p className="mb-6">
            A PH Donassolo reserva-se o direito de alterar estes Termos de Uso a qualquer momento. Modificações entram em vigor imediatamente após a publicação no site. O uso contínuo da plataforma implica na aceitação das alterações.
          </p>
        </div>
      </div>
    </main>
  );
};

export default TermsPage;
