import React, { useEffect, useState } from 'react';
import ScrollReveal from '../components/ui/ScrollReveal';
import { DataService } from '../services/dataService';

const CATEGORIAS = ['Todos', 'Gestão Comercial', 'Vendas', 'Liderança', 'Negociação', 'Carreira'];

const ConteudoPage: React.FC = () => {
  const [artigos, setArtigos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoria, setCategoria] = useState('Todos');

  useEffect(() => {
    DataService.getArticles(30).then(data => {
      setArtigos(data);
      setLoading(false);
    });
  }, []);

  const filtrados = categoria === 'Todos'
    ? artigos
    : artigos.filter(a => a.category === categoria);

  return (
    <main>
      {/* Hero */}
      <section style={{ background: 'var(--cream)', paddingTop: '8rem', paddingBottom: '5rem' }}>
        <div className="sec-wrap">
          <ScrollReveal>
            <div className="eyebrow" style={{ marginBottom: '1.5rem' }}>Conteúdo</div>
            <h1 style={{
              fontFamily: 'var(--fd)', fontSize: 'clamp(2.4rem, 4vw, 3.4rem)', fontWeight: 700,
              lineHeight: 1.12, color: 'var(--ink)', letterSpacing: '-.02em', marginBottom: '1.2rem',
            }}>
              Gestão comercial na prática.<br />
              <em style={{ color: 'var(--navy)' }}>Sem teoria vazia.</em>
            </h1>
            <p style={{ fontSize: '1rem', color: 'var(--ink-3)', lineHeight: 1.75, maxWidth: 520 }}>
              Artigos, reflexões e ferramentas sobre vendas, gestão de equipes, liderança comercial e desenvolvimento de carreira.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Filtros */}
      <section style={{ background: 'var(--cream-d)', borderBottom: '1px solid var(--rule)', padding: '1.2rem 0', position: 'sticky', top: 62, zIndex: 50 }}>
        <div className="sec-wrap">
          <div style={{ display: 'flex', gap: '.6rem', flexWrap: 'wrap' }}>
            {CATEGORIAS.map(cat => (
              <button key={cat} onClick={() => setCategoria(cat)} style={{
                fontFamily: 'var(--fm)', fontSize: '.5rem', letterSpacing: '.14em', textTransform: 'uppercase',
                padding: '.45rem 1rem', border: '1px solid', cursor: 'pointer', transition: 'all .2s',
                background: categoria === cat ? 'var(--navy)' : 'transparent',
                color: categoria === cat ? 'var(--cream)' : 'var(--ink-3)',
                borderColor: categoria === cat ? 'var(--navy)' : 'var(--rule)',
              }}>
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid de artigos */}
      <section style={{ background: 'var(--cream)', padding: '5rem 0' }}>
        <div className="sec-wrap">
          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
              {[...Array(6)].map((_, i) => (
                <div key={i} style={{ background: 'var(--cream-d)', height: 280 }} />
              ))}
            </div>
          ) : filtrados.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '5rem 0' }}>
              <p style={{ fontFamily: 'var(--fd)', fontSize: '1.4rem', color: 'var(--ink-3)', fontStyle: 'italic' }}>
                Nenhum artigo encontrado nesta categoria.
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
              {filtrados.map((a, i) => (
                <ScrollReveal key={a.id} delay={((i % 3) + 1) as 1 | 2 | 3}>
                  <a href={`#/artigo/${a.id}`} style={{ display: 'block', textDecoration: 'none' }} className="card-hover">
                    <div style={{
                      aspectRatio: '16/9', background: 'var(--navy)', marginBottom: '1.2rem', overflow: 'hidden',
                    }}>
                      {(a.coverImage || a.imageUrl) && (
                        <img src={a.coverImage || a.imageUrl} alt={a.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .5s' }} />
                      )}
                    </div>
                    <div style={{ fontFamily: 'var(--fm)', fontSize: '.48rem', letterSpacing: '.16em', textTransform: 'uppercase', color: 'var(--gold)', opacity: .7, marginBottom: '.6rem' }}>
                      {a.category || 'Gestão Comercial'}
                    </div>
                    <h3 style={{ fontFamily: 'var(--fd)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--ink)', lineHeight: 1.3, marginBottom: '.5rem' }}>
                      {a.title}
                    </h3>
                    <p style={{ fontSize: '.82rem', color: 'var(--ink-3)', lineHeight: 1.6 }}>
                      {(a.excerpt || a.summary || '').substring(0, 100)}…
                    </p>
                    <div style={{ marginTop: '1rem', fontFamily: 'var(--fm)', fontSize: '.5rem', letterSpacing: '.1em', color: 'var(--ink-3)' }}>
                      {a.date ? new Date(a.date).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}
                    </div>
                  </a>
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default ConteudoPage;
