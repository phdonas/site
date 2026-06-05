import React from 'react';
import ScrollReveal from '../components/ui/ScrollReveal';

const PrivacyPage: React.FC = () => (
  <main style={{ background: 'var(--cream)', paddingTop: '8rem', paddingBottom: '7rem' }}>
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '0 5vw' }}>
      <ScrollReveal>
        <div className="eyebrow" style={{ marginBottom: '1.5rem' }}>Legal</div>
        <h1 style={{
          fontFamily: 'var(--fd)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700,
          color: 'var(--ink)', letterSpacing: '-.02em', marginBottom: '.8rem',
        }}>
          Política de Privacidade
        </h1>
        <p style={{ fontFamily: 'var(--fm)', fontSize: '.5rem', letterSpacing: '.1em', color: 'var(--ink-3)', marginBottom: '3.5rem' }}>
          Última atualização: Março de 2024
        </p>
      </ScrollReveal>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
        {[
          {
            titulo: '1. Introdução',
            conteudo: 'Esta Política de Privacidade descreve como o site Prof. Paulo H. Donassolo coleta, utiliza e protege suas informações. Ao utilizar nosso site, você concorda com as práticas descritas aqui.',
          },
          {
            titulo: '2. Coleta de Dados',
            conteudo: 'Coletamos informações que você nos fornece voluntariamente, como nome e e-mail via formulários de contato ou newsletter, e dados de navegação anônimos (cookies) para melhorar a experiência do usuário via Google Analytics.',
          },
          {
            titulo: '3. Uso das Informações',
            conteudo: 'Os dados coletados são utilizados para fornecer suporte e responder a dúvidas sobre cursos e consultoria, e para enviar atualizações sobre novos conteúdos (caso inscrito na newsletter).',
          },
          {
            titulo: '4. Segurança',
            conteudo: 'Implementamos medidas de segurança técnicas e organizacionais para proteger seus dados pessoais contra acesso não autorizado ou perda.',
          },
          {
            titulo: '5. Seus Direitos',
            conteudo: 'Conforme a LGPD, você tem o direito de acessar, corrigir ou solicitar a exclusão de seus dados pessoais a qualquer momento através do e-mail paulo@phdonassolo.com.',
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
        <div style={{ marginTop: '4rem', padding: '2rem', background: 'var(--cream-d)', border: '1px solid var(--rule)' }}>
          <p style={{ fontSize: '.82rem', color: 'var(--ink-3)', lineHeight: 1.75 }}>
            Esta política pode ser atualizada periodicamente. Recomendamos a revisão desta página regularmente para se manter informado sobre como protegemos seus dados.
          </p>
        </div>

        <div style={{ marginTop: '2rem' }}>
          <a href="#/" className="btn-ghost-ink">← Voltar para o início</a>
        </div>
      </ScrollReveal>
    </div>
  </main>
);

export default PrivacyPage;
