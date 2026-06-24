import React, { useState, useEffect } from 'react';
import { DataService } from '../services/dataService';
import { Article } from '../types';
import ScrollReveal from '../components/ui/ScrollReveal';
import { NewsletterForm } from '../components/ui/NewsletterForm';

interface Props {
  articleId: string;
  activePillar?: string;
}

const ArticleDetailPage: React.FC<Props> = ({ articleId }) => {
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    window.scrollTo({ top: 0, behavior: 'instant' });

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await DataService.getArticleById(articleId);
        if (!mounted) return;
        if (data) {
          setArticle(data);
          document.title = data.seoTitle || `${data.title} | Prof. Paulo H. Donassolo`;
          const metaDesc = document.querySelector('meta[name="description"]');
          const content = data.seoDescription || data.excerpt;
          if (metaDesc) metaDesc.setAttribute('content', content);
          else {
            const m = document.createElement('meta');
            m.name = 'description'; m.content = content;
            document.head.appendChild(m);
          }
        } else {
          setError('Artigo não encontrado.');
        }
      } catch {
        if (mounted) setError('Não foi possível carregar o artigo. Verifique sua conexão.');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => { mounted = false; };
  }, [articleId]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--cream)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 40, height: 40, border: '2px solid var(--rule)', borderTopColor: 'var(--gold)', borderRadius: '50%', margin: '0 auto 1rem', animation: 'spin 1s linear infinite' }} />
          <p style={{ fontFamily: 'var(--fm)', fontSize: '.5rem', letterSpacing: '.18em', color: 'var(--ink-3)', textTransform: 'uppercase' }}>
            Carregando
          </p>
        </div>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  if (error || !article) {
    return (
      <main style={{ minHeight: '100vh', background: 'var(--cream)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8rem 5vw', textAlign: 'center' }}>
        <div style={{ maxWidth: 480 }}>
          <h1 style={{ fontFamily: 'var(--fd)', fontSize: '2rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '1rem' }}>
            Artigo não encontrado.
          </h1>
          <p style={{ fontSize: '.9rem', color: 'var(--ink-3)', lineHeight: 1.75, marginBottom: '2rem' }}>
            {error || 'Não conseguimos localizar este conteúdo.'}
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => window.location.reload()} className="btn-navy">Tentar novamente</button>
            <a href="#/conteudo" className="btn-ghost-ink">Ver todos os artigos →</a>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main style={{ background: 'var(--cream)' }}>
      {/* Header */}
      <header style={{ paddingTop: '8rem', paddingBottom: '4rem', background: 'var(--cream)' }}>
        <div style={{ maxWidth: 760, margin: '0 auto', padding: '0 5vw' }}>
          <ScrollReveal>
            <a href="#/conteudo" style={{
              fontFamily: 'var(--fm)', fontSize: '.5rem', letterSpacing: '.14em', textTransform: 'uppercase',
              color: 'var(--ink-3)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '.5rem',
              marginBottom: '2.5rem',
            }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--ink-3)')}
            >
              ← Todos os artigos
            </a>

            {article.category && (
              <div className="eyebrow" style={{ marginBottom: '1.2rem' }}>{article.category}</div>
            )}

            <h1 style={{
              fontFamily: 'var(--fd)', fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: 700,
              lineHeight: 1.15, color: 'var(--ink)', letterSpacing: '-.02em', marginBottom: '1.5rem',
            }}>
              {article.title}
            </h1>

            <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '.8rem' }}>
                <div style={{
                  width: 36, height: 36, background: 'var(--navy)', borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <span style={{ fontFamily: 'var(--fm)', fontSize: '.42rem', color: 'rgba(243,239,230,.6)', letterSpacing: '.06em' }}>PHD</span>
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--fd)', fontSize: '.9rem', fontWeight: 700, color: 'var(--ink)' }}>
                    Prof. Paulo H. Donassolo
                  </div>
                  {article.date && (
                    <div style={{ fontFamily: 'var(--fm)', fontSize: '.48rem', letterSpacing: '.1em', color: 'var(--ink-3)' }}>
                      {new Date(article.date).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </header>

      {/* Cover image */}
      {(article.imageUrl || (article as any).coverImage) && (
        <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 5vw', marginBottom: '4rem' }}>
          <div style={{ aspectRatio: '16/9', overflow: 'hidden', background: 'var(--navy)' }}>
            <img
              src={(article as any).coverImage || article.imageUrl}
              alt={article.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        </div>
      )}

      {/* Content */}
      <article style={{ maxWidth: 760, margin: '0 auto', padding: '0 5vw 6rem' }}>
        <div
          className="article-content"
          dangerouslySetInnerHTML={{ __html: (article.content || '').replace(/&nbsp;/g, ' ') }}
        />

        {article.tags && article.tags.length > 0 && (
          <div style={{ marginTop: '3rem', display: 'flex', gap: '.5rem', flexWrap: 'wrap' }}>
            {article.tags.map(tag => (
              <span key={tag} style={{
                fontFamily: 'var(--fm)', fontSize: '.45rem', letterSpacing: '.12em', textTransform: 'uppercase',
                color: 'var(--ink-3)', border: '1px solid var(--rule)', padding: '.3rem .7rem',
              }}>
                {tag}
              </span>
            ))}
          </div>
        )}
      </article>

      {/* Newsletter CTA */}
      <section style={{ background: 'var(--navy)', padding: '6rem 0' }}>
        <div style={{ maxWidth: 760, margin: '0 auto', padding: '0 5vw', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
          <ScrollReveal>
            <div className="eyebrow" style={{ color: 'rgba(243,239,230,.35)', borderColor: 'var(--gold)', marginBottom: '1rem' }}>
              Newsletter
            </div>
            <h2 style={{ fontFamily: 'var(--fd)', fontSize: '1.6rem', fontWeight: 700, color: 'rgba(243,239,230,.9)', marginBottom: '1rem', lineHeight: 1.3 }}>
              Receba o próximo artigo em primeira mão.
            </h2>
            <p style={{ fontSize: '.85rem', color: 'rgba(243,239,230,.4)', lineHeight: 1.7 }}>
              Uma ideia aplicável por semana. Sem spam.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={2}>
            <NewsletterForm />
          </ScrollReveal>
        </div>
      </section>

      {/* Back */}
      <div style={{ textAlign: 'center', padding: '3rem 5vw', background: 'var(--cream)' }}>
        <a href="#/conteudo" className="btn-ghost-ink">← Ver todos os artigos</a>
      </div>

    </main>
  );
};

export default ArticleDetailPage;
