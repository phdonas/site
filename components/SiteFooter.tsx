import React from 'react';

const SiteFooter: React.FC = () => (
  <footer className="site-footer">
    <div style={{ maxWidth: 1240, margin: '0 auto' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr 1fr 1fr',
        gap: '3.5rem',
        paddingBottom: '3.5rem',
        borderBottom: '1px solid rgba(243,239,230,.06)',
        marginBottom: '2rem',
      }} className="ft-grid">
        <div>
          <div style={{ fontFamily: 'var(--fd)', fontSize: '1.2rem', fontWeight: 700, color: 'rgba(243,239,230,.85)', marginBottom: '.7rem' }}>
            <strong>Prof. Paulo H. Donassolo</strong>
          </div>
          <p style={{ fontSize: '.8rem', color: 'rgba(243,239,230,.28)', lineHeight: 1.65, maxWidth: 220 }}>
            Mentoria · Consultoria · Cursos e Formações · Conteúdo
          </p>
          <div style={{ marginTop: '1.5rem' }}>
            <a href="#/admin" style={{ fontFamily: 'var(--fm)', fontSize: '.5rem', letterSpacing: '.2em', textTransform: 'uppercase', color: 'rgba(243,239,230,.15)', textDecoration: 'none', transition: 'color .2s' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'rgba(243,239,230,.4)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(243,239,230,.15)')}>
              Admin
            </a>
          </div>
        </div>

        <FooterCol title="Serviços" links={[
          { href: '#/mentoria', label: 'Mentoria' },
          { href: '#/consultoria', label: 'Consultoria' },
          { href: '#/cursos', label: 'Cursos e Formações' },
          { href: '#/conteudo', label: 'Conteúdo' },
        ]} />

        <FooterCol title="Acesso" links={[
          { href: '#/area-do-aluno', label: 'Área do Aluno' },
          { href: '#/cursos', label: 'Cursos Udemy' },
          { href: '#/recursos', label: 'Livros Amazon' },
          { href: '#/recursos', label: 'Ferramentas' },
        ]} />

        <FooterCol title="Institucional" links={[
          { href: '#/prof-paulo', label: 'Prof. Paulo' },
          { href: '#/fale-comigo', label: 'Fale Comigo' },
          { href: '#/terms', label: 'Termos de Uso' },
          { href: '#/privacy', label: 'Privacidade' },
        ]} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ fontFamily: 'var(--fm)', fontSize: '.52rem', letterSpacing: '.08em', color: 'rgba(243,239,230,.18)' }}>
          © {new Date().getFullYear()} Prof. Paulo H. Donassolo · Todos os direitos reservados
        </div>
        <div style={{ fontFamily: 'var(--fm)', fontSize: '.5rem', letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--gold)', opacity: .3 }}>
          Pessoas · Processos · Gestão · Resultados
        </div>
      </div>
    </div>

    <style>{`
      @media (max-width: 768px) {
        .ft-grid { grid-template-columns: 1fr 1fr !important; gap: 2.5rem !important; }
      }
      @media (max-width: 480px) {
        .ft-grid { grid-template-columns: 1fr !important; }
      }
    `}</style>
  </footer>
);

const FooterCol: React.FC<{ title: string; links: { href: string; label: string }[] }> = ({ title, links }) => (
  <div>
    <div style={{ fontFamily: 'var(--fm)', fontSize: '.55rem', letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--gold)', opacity: .6, marginBottom: '1.4rem' }}>
      {title}
    </div>
    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '.7rem' }}>
      {links.map(l => (
        <li key={l.href}>
          <a href={l.href} style={{ fontSize: '.82rem', color: 'rgba(243,239,230,.35)', textDecoration: 'none', transition: 'color .2s' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'rgba(243,239,230,.75)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(243,239,230,.35)')}>
            {l.label}
          </a>
        </li>
      ))}
    </ul>
  </div>
);

export default SiteFooter;
