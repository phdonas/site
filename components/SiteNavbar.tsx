import React, { useEffect, useState } from 'react';
import { SITE_CONFIG } from '../config/site-config';

interface Props {
  currentRoute: string;
}

const SiteNavbar: React.FC<Props> = ({ currentRoute }) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [currentRoute]);

  const lmsLiberado = (SITE_CONFIG as any).lms?.liberado ?? false;
  const lmsUrl = (SITE_CONFIG as any).lms?.url ?? '#/area-do-aluno';
  const alunoHref = lmsLiberado ? lmsUrl : '#/area-do-aluno';

  // Um link é "ativo" quando a rota atual corresponde ao seu path.
  // Cursos: ativo em /cursos E em /curso/:slug (página individual).
  const isActive = (href: string): boolean => {
    const path = href.replace(/^#/, ''); // "#/cursos" → "/cursos"
    if (path === '/cursos') {
      return currentRoute === '/cursos' || currentRoute.startsWith('/curso/');
    }
    return currentRoute === path || currentRoute.startsWith(path + '/');
  };

  const linkClass = (href: string) =>
    `nav-link${isActive(href) ? ' nav-link--active' : ''}`;

  const desktopLinks = [
    { href: '#/prof-paulo', label: 'Prof. Paulo' },
    { href: '#/servicos',   label: 'Serviços' },
    { href: '#/cursos',     label: 'Cursos' },
    { href: '#/conteudo',   label: 'Conteúdo' },
  ];

  return (
    <nav className={`site-nav ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-in">
        <a href="#/" className="nav-logo">
          <strong>Prof. Paulo H. Donassolo</strong>
        </a>

        {/* Desktop links */}
        <ul className="nav-links hidden md:flex">
          {desktopLinks.map(item => (
            <li key={item.href}>
              <a href={item.href} className={linkClass(item.href)}>{item.label}</a>
            </li>
          ))}
          <li><a href="#/fale-comigo" className={`${linkClass('#/fale-comigo')} nav-cta`}>Fale Comigo</a></li>
          <li>
            <a
              href={alunoHref}
              className="nav-link nav-aluno"
              {...(lmsLiberado ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            >
              Área do Aluno
            </a>
          </li>
        </ul>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-[5px] p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
        >
          {[0, 1, 2].map(i => (
            <span key={i} style={{
              display: 'block', width: 22, height: 2,
              background: 'var(--ink)',
              transition: 'transform .25s, opacity .25s',
              transformOrigin: 'center',
              transform: menuOpen
                ? i === 0 ? 'translateY(7px) rotate(45deg)'
                  : i === 1 ? 'scaleX(0)'
                  : 'translateY(-7px) rotate(-45deg)'
                : 'none',
              opacity: menuOpen && i === 1 ? 0 : 1,
            }} />
          ))}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          background: 'rgba(243,239,230,.98)',
          backdropFilter: 'blur(20px)',
          borderTop: '1px solid var(--rule)',
          padding: '1.5rem 5vw',
        }}>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            {[
              { href: '#/prof-paulo', label: 'Prof. Paulo' },
              { href: '#/servicos',   label: 'Serviços' },
              { href: '#/cursos',     label: 'Cursos' },
              { href: '#/conteudo',   label: 'Conteúdo' },
              { href: '#/fale-comigo', label: 'Fale Comigo' },
            ].map(item => (
              <li key={item.href}>
                <a href={item.href} className={linkClass(item.href)} style={{ fontSize: '.95rem' }}>
                  {item.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href={alunoHref}
                style={{ fontFamily: 'var(--fm)', fontSize: '.62rem', letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--gold)' }}
                {...(lmsLiberado ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              >
                Área do Aluno
              </a>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default SiteNavbar;
