import React, { useEffect } from 'react';
import ScrollReveal from '../components/ui/ScrollReveal';

const TermsPage: React.FC = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <main style={{ background: 'var(--cream)', paddingTop: '8rem', paddingBottom: '7rem' }}>
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '0 5vw' }}>
        <ScrollReveal>
          <div className="eyebrow" style={{ marginBottom: '1.5rem' }}>Legal</div>
          <h1 style={{
            fontFamily: 'var(--fd)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700,
            color: 'var(--ink)', letterSpacing: '-.02em', marginBottom: '.8rem',
          }}>
            Termos de Uso
          </h1>
          <p style={{ fontFamily: 'var(--fm)', fontSize: '.5rem', letterSpacing: '.1em', color: 'var(--ink-3)', marginBottom: '3.5rem' }}>
            Última atualização: {new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
          </p>
        </ScrollReveal>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
          {[
            {
              titulo: '1. Aceitação dos Termos',
              conteudo: 'Ao acessar e usar a plataforma Prof. Paulo H. Donassolo, você concorda em cumprir e ficar vinculado a estes Termos de Uso. Se você não concordar com qualquer parte destes termos, não deverá acessar nossos serviços.',
            },
            {
              titulo: '2. Uso da Plataforma e Área do Aluno',
              conteudo: 'A Área do Aluno e todos os materiais nela contidos (cursos, vídeos, planilhas, PDFs) são de uso exclusivo e intransferível do titular da conta. É estritamente proibido o compartilhamento de senhas, revenda ou distribuição não autorizada do material.',
            },
            {
              titulo: '3. Propriedade Intelectual',
              conteudo: 'Todo o conteúdo presente no site e na Área do Aluno, incluindo logotipos, textos, gráficos, imagens, áudios e vídeos, é de propriedade exclusiva do Prof. Paulo H. Donassolo e protegido pelas leis de direitos autorais.',
            },
            {
              titulo: '4. Cancelamento e Reembolso',
              conteudo: 'As políticas de cancelamento e reembolso obedecem à legislação vigente. Para compras virtuais, o usuário tem o prazo de 7 dias de garantia incondicional a partir da data de liberação do acesso.',
            },
            {
              titulo: '5. Modificações dos Termos',
              conteudo: 'O Prof. Paulo H. Donassolo reserva-se o direito de alterar estes Termos de Uso a qualquer momento. Modificações entram em vigor imediatamente após a publicação no site. O uso contínuo da plataforma implica na aceitação das alterações.',
            },
          ].map((s, i) => (
            <ScrollReveal key={s.titulo} delay={((i % 4) + 1) as 1 | 2 | 3 | 4}>
              <div style={{ borderTop: '1px solid var(--rule)', paddingTop: '2rem' }}>
                <h2 style={{ fontFamily: 'var(--fd)', fontSize: '1.2rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '1rem' }}>
                  {s.titulo}
                </h2>
                <p style={{ fontSize: '.9rem', color: 'var(--ink-3)', lineHeight: 1.8 }}>{s.conteudo}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal>
          <div style={{ marginTop: '3rem' }}>
            <a href="#/" className="btn-ghost-ink">← Voltar para o início</a>
          </div>
        </ScrollReveal>
      </div>
    </main>
  );
};

export default TermsPage;
