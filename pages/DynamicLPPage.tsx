import React, { useState, useEffect } from 'react';
import { DataService } from '../services/dataService';
import { collection, addDoc, getDoc, doc, serverTimestamp, updateDoc, increment } from 'firebase/firestore';
import { db } from '../services/firebase';
import { Mail, CheckCircle2, ChevronRight, Lock, ShieldCheck, ArrowRight } from 'lucide-react';

// ---- CMS Landing Page view (uses new landing_pages collection) ----

const CmsLPView: React.FC<{ lp: any; slug: string }> = ({ lp, slug }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const isForm = lp.cta_tipo === 'formulario_interno';
  const accent = lp.cor_destaque || '#8f6e4a';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    setSubmitting(true);
    try {
      await addDoc(collection(db, 'leads'), {
        nome: name.trim(),
        email: email.trim(),
        tipo: `lp_${slug}`,
        origem: slug,
        createdAt: serverTimestamp(),
      });
      setSubmitted(true);
    } catch {
      alert('Erro ao enviar. Tente novamente.');
    }
    setSubmitting(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream-d)', fontFamily: 'var(--fb)' }}>
      {/* Nav */}
      <nav style={{ padding: '1.2rem 5vw', borderBottom: '1px solid var(--rule)', background: 'var(--cream)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <a href="#/" style={{ fontFamily: 'var(--fd)', fontSize: '1rem', fontWeight: 700, color: 'var(--ink)', textDecoration: 'none', letterSpacing: '-.01em' }}>
          Prof. Paulo H. Donassolo
        </a>
        <span style={{ fontFamily: 'var(--fm)', fontSize: '.44rem', letterSpacing: '.15em', textTransform: 'uppercase', color: 'var(--ink-3)' }}>
          phdonassolo.com
        </span>
      </nav>

      {/* Content */}
      <main style={{ maxWidth: 960, margin: '0 auto', padding: '4rem 5vw', display: 'grid', gridTemplateColumns: lp.imagem_url ? '1fr 1fr' : '1fr', gap: '3rem', alignItems: 'center' }}>
        {/* Left: text */}
        <div>
          <div style={{ fontFamily: 'var(--fm)', fontSize: '.5rem', letterSpacing: '.2em', textTransform: 'uppercase', color: accent, marginBottom: '.8rem' }}>
            {lp.cta_tipo === 'mentoria' ? 'Mentoria Comercial' : lp.cta_tipo === 'consultoria' ? 'Consultoria' : 'Oferta especial'}
          </div>
          <h1 style={{ fontFamily: 'var(--fd)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, color: 'var(--ink)', lineHeight: 1.1, letterSpacing: '-.02em', marginBottom: '1rem' }}>
            {lp.titulo}
          </h1>
          {lp.subtitulo && (
            <p style={{ fontFamily: 'var(--fd)', fontSize: '1.2rem', fontStyle: 'italic', color: 'var(--ink-2)', marginBottom: '1.2rem' }}>
              {lp.subtitulo}
            </p>
          )}
          {lp.descricao && (
            <p style={{ fontSize: '.92rem', color: 'var(--ink-3)', lineHeight: 1.8, marginBottom: '2rem', maxWidth: 500 }}>
              {lp.descricao}
            </p>
          )}

          {!isForm && (
            <a
              href={lp.cta_link}
              target={lp.cta_tipo === 'hotmart' ? '_blank' : '_self'}
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '.5rem',
                fontFamily: 'var(--fm)', fontSize: '.55rem', letterSpacing: '.15em', textTransform: 'uppercase',
                background: 'var(--navy)', color: 'var(--cream)', border: 'none',
                padding: '1rem 2rem', textDecoration: 'none', cursor: 'pointer',
              }}
            >
              {lp.cta_texto || 'Acessar'} <ArrowRight size={14} />
            </a>
          )}
        </div>

        {/* Right: image or form */}
        <div>
          {lp.imagem_url && !isForm && (
            <img src={lp.imagem_url} alt={lp.titulo} style={{ width: '100%', display: 'block', border: '1px solid var(--rule)' }} />
          )}

          {isForm && (
            <div style={{ background: 'var(--cream)', border: '1px solid var(--rule)', padding: '2rem' }}>
              {!submitted ? (
                <>
                  <div style={{ fontFamily: 'var(--fd)', fontSize: '1.3rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '.6rem' }}>
                    {lp.cta_texto || 'Quero participar'}
                  </div>
                  <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '.8rem' }}>
                      <label style={{ fontFamily: 'var(--fm)', fontSize: '.48rem', letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--ink-3)', display: 'block', marginBottom: '.4rem' }}>Nome completo</label>
                      <input required style={{ width: '100%', padding: '.65rem .9rem', background: 'var(--cream-d)', border: '1px solid var(--rule)', fontFamily: 'var(--fb)', fontSize: '.85rem', color: 'var(--ink)', outline: 'none', boxSizing: 'border-box' as const }} value={name} onChange={e => setName(e.target.value)} placeholder="Seu nome" />
                    </div>
                    <div style={{ marginBottom: '1.2rem' }}>
                      <label style={{ fontFamily: 'var(--fm)', fontSize: '.48rem', letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--ink-3)', display: 'block', marginBottom: '.4rem' }}>Email</label>
                      <input required type="email" style={{ width: '100%', padding: '.65rem .9rem', background: 'var(--cream-d)', border: '1px solid var(--rule)', fontFamily: 'var(--fb)', fontSize: '.85rem', color: 'var(--ink)', outline: 'none', boxSizing: 'border-box' as const }} value={email} onChange={e => setEmail(e.target.value)} placeholder="seu@email.com" />
                    </div>
                    <button
                      type="submit"
                      disabled={submitting}
                      style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '.5rem', fontFamily: 'var(--fm)', fontSize: '.52rem', letterSpacing: '.12em', textTransform: 'uppercase', background: 'var(--navy)', color: 'var(--cream)', border: 'none', padding: '1rem', cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? .6 : 1 }}
                    >
                      {submitting ? 'Enviando...' : <>{lp.cta_texto || 'Confirmar inscrição'} <ArrowRight size={13} /></>}
                    </button>
                  </form>
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                  <CheckCircle2 size={40} style={{ color: 'var(--gold)', marginBottom: '.8rem' }} />
                  <div style={{ fontFamily: 'var(--fd)', fontSize: '1.2rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '.6rem' }}>Recebemos seu contato!</div>
                  <p style={{ fontFamily: 'var(--fb)', fontSize: '.82rem', color: 'var(--ink-3)', lineHeight: 1.7 }}>
                    {lp.meta_description || 'Em breve entraremos em contato.'}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--rule)', padding: '1.5rem 5vw', textAlign: 'center', background: 'var(--cream)' }}>
        <p style={{ fontFamily: 'var(--fm)', fontSize: '.44rem', letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--ink-3)' }}>
          © {new Date().getFullYear()} Prof. Paulo H. Donassolo · Todos os direitos reservados
        </p>
      </footer>
    </div>
  );
};

const DynamicLPPage = () => {
    const [lp, setLp] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isCmsLp, setIsCmsLp] = useState(false);
    const [cmsSlug, setCmsSlug] = useState('');
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [ddi, setDdi] = useState('+55');
    const [whatsappNumber, setWhatsappNumber] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [origem, setOrigem] = useState('direto');
    const [startTime] = useState(Date.now());

    useEffect(() => {
        const handleLocationChange = async () => {
            const getUrlParam = (name: string) => {
                const searchParams = new URLSearchParams(window.location.search);
                if (searchParams.has(name)) return searchParams.get(name);
                const hashParts = window.location.hash.split('?');
                if (hashParts.length > 1) {
                    const hashParams = new URLSearchParams(hashParts[1]);
                    if (hashParams.has(name)) return hashParams.get(name);
                }
                return null;
            };

            const src = getUrlParam('src') || getUrlParam('utm_source') || getUrlParam('source');
            if (src) setOrigem(src);

            const fullPath = window.location.hash.split('/lp/')[1];
            const slugFromHash = fullPath ? fullPath.split('?')[0] : null;

            if (!slugFromHash) { setLoading(false); return; }

            // 1. Try new CMS landing_pages collection first
            try {
                const snap = await getDoc(doc(db, 'landing_pages', slugFromHash));
                if (snap.exists()) {
                    const data = snap.data();
                    // Check expiration
                    if (data.data_expiracao && new Date(data.data_expiracao) < new Date()) {
                        window.location.hash = '#/';
                        return;
                    }
                    // Check published
                    if (!data.publicada) {
                        window.location.hash = '#/';
                        return;
                    }
                    // Increment access counter (fire-and-forget)
                    updateDoc(doc(db, 'landing_pages', slugFromHash), { acessos: increment(1) }).catch(() => {});
                    document.title = data.meta_title || data.titulo || 'Landing Page';
                    setLp(data);
                    setIsCmsLp(true);
                    setCmsSlug(slugFromHash);
                    setLoading(false);
                    return;
                }
            } catch { /* ignore, fall through to legacy */ }

            // 2. Fall back to legacy resource-based LP
            DataService.getLPBySlug(slugFromHash).then(data => {
                if (data) {
                    setLp(data);
                    setIsCmsLp(false);
                    document.title = data.pageTitle || 'Material Gratuito';
                }
                setLoading(false);
            });
        };

        handleLocationChange();
        window.addEventListener('hashchange', handleLocationChange);
        return () => window.removeEventListener('hashchange', handleLocationChange);
    }, []); 

    const [acceptedTerms, setAcceptedTerms] = useState(false);

    // Formatação de telefone BR
    const formatBRNumber = (value: string) => {
        const numbers = value.replace(/\D/g, '');
        if (numbers.length <= 10) {
            return numbers.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3').trim();
        }
        return numbers.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3').trim();
    };

    const handleWhatsappChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        if (ddi === '+55') {
            setWhatsappNumber(formatBRNumber(val));
        } else {
            setWhatsappNumber(val);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const fullWhatsapp = `${ddi} ${whatsappNumber.replace(/\D/g, '')}`;
        const waNumbers = whatsappNumber.replace(/\D/g, '');
        
        if (ddi === '+55' && waNumbers.length < 10) {
            alert("Por favor, insira um WhatsApp válido com DDD.");
            return;
        }

        if (!email || !name) return;
        
        // Validação de Nome Completo (exigida pelo Google Script: validarNome)
        const trimmedName = name.trim();
        const nameParts = trimmedName.split(/\s+/);
        if (trimmedName.length < 3 || nameParts.length < 2) {
            alert("Por favor, insira seu nome completo (mínimo de 3 letras e Nome + Sobrenome).");
            return;
        }

        if (lp.showTerms && !acceptedTerms) {
            alert("Por favor, aceite os termos para continuar.");
            return;
        }

        setIsSubmitting(true);
        console.log("Iniciando envio do lead:", { name, email, fullWhatsapp, origem });
        
        try {
            // Removido envio para Google Script
            const timeSpent = Math.floor((Date.now() - startTime) / 1000);
            
            // Salvando Lead diretamente no Firestore
            await addDoc(collection(db, 'leads'), {
                nome: name.trim(),
                email: email.trim(),
                whatsapp: fullWhatsapp,
                materialId: lp.materialId || 'N/A',
                materialTitle: lp.pageTitle || 'Material',
                origem: origem || 'direto',
                timeSpent: timeSpent,
                createdAt: serverTimestamp()
            });
            
            console.log("Lead salvo com sucesso no Firebase!");

            setSubmitted(true);

            if (lp.redirectUrl) {
                setTimeout(() => {
                    window.location.href = lp.redirectUrl;
                }, 2000);
            }
        } catch (e) {
            console.error("Erro no fetch do lead:", e);
            alert("Erro ao enviar. Tente novamente.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    if (!lp) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 flex-col gap-4">
            <h1 className="text-2xl font-bold">LP não encontrada</h1>
            <a href="#/" className="text-blue-600 font-bold hover:underline">Voltar para a Home</a>
        </div>
    );

    // CMS-managed landing page
    if (isCmsLp) return <CmsLPView lp={lp} slug={cmsSlug} />;

    return (
        <div className="min-h-screen selection:bg-blue-100 selection:text-blue-900" style={{ backgroundColor: lp.bgColor, color: lp.textColor, fontFamily: lp.fontFamily || 'Inter, sans-serif' }}>

            {/* HEADER / NAVIGATION */}
            <nav className="fixed top-0 left-0 right-0 z-50 p-6 flex justify-between items-center backdrop-blur-md bg-white/30 border-b border-white/20">
                <div className="font-black text-xl tracking-tighter uppercase italic">PH DONASSOLO</div>
                <div className="hidden md:flex gap-8 text-[10px] font-bold uppercase tracking-widest opacity-60">
                    <span>Conteúdo Prático</span>
                    <span>Experiência Real</span>
                    <span>Resultados</span>
                </div>
            </nav>

            {/* HERO SECTION */}
            <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                <div className="space-y-8 animate-in fade-in slide-in-from-left-8 duration-700">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest" style={{ backgroundColor: `${lp.primaryColor}15`, color: lp.primaryColor }}>
                        <span className="w-2 h-2 rounded-full bg-current animate-pulse"></span>
                        {lp.badge}
                    </div>

                    <h1 className={`${lp.titleSize} ${lp.titleWeight} leading-[1.05] tracking-tight`}>
                        {lp.titleLine1} <br />
                        <span style={{ color: lp.primaryColor }}>{lp.titleLine2}</span>
                    </h1>

                    <p className="text-lg md:text-xl opacity-70 leading-relaxed max-w-xl">
                        {lp.heroDesc}
                    </p>

                    <div className="space-y-4">
                        {lp.beneficios && lp.beneficios.map((b: string, i: number) => (
                            <div key={i} className="flex items-center gap-3 font-medium">
                                <div className="p-1 rounded-full" style={{ backgroundColor: `${lp.primaryColor}20`, color: lp.primaryColor }}>
                                    <CheckCircle2 size={16} />
                                </div>
                                <span>{b}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* FORM CONTAINER */}
                <div className="animate-in fade-in slide-in-from-right-8 duration-700 delay-200">
                    <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-2xl shadow-black/5 border border-white/40 backdrop-blur-sm relative overflow-hidden group">

                        {/* Glass decoration */}
                        <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full blur-3xl opacity-20" style={{ backgroundColor: lp.primaryColor }}></div>

                        {!submitted ? (
                            <div className="relative z-10">
                                <div className="mb-8">
                                    <h2 className="text-3xl font-bold text-black mb-3">{lp.formTitle}</h2>
                                    <p className="text-gray-400 font-medium">{lp.formSubtitle}</p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">{lp.labelNome || 'Seu Nome'}</label>
                                        <input
                                            type="text"
                                            required
                                            value={name}
                                            onChange={e => setName(e.target.value)}
                                            placeholder={lp.placeholderNome || 'Como deseja ser chamado?'}
                                            className="w-full p-4 bg-gray-50 border border-transparent focus:border-gray-200 focus:bg-white rounded-2xl outline-none transition-all font-medium text-black"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">{lp.labelEmail || 'E-mail Principal'}</label>
                                        <div className="relative">
                                            <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="email"
                                                required
                                                value={email}
                                                onChange={e => setEmail(e.target.value)}
                                                placeholder={lp.placeholderEmail || 'ex: voce@empresa.com'}
                                                className="w-full p-4 pl-12 bg-gray-50 border border-transparent focus:border-gray-200 focus:bg-white rounded-2xl outline-none transition-all font-medium text-black"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">{lp.labelWhatsapp || 'WhatsApp'}</label>
                                        <div className="flex gap-2">
                                            {/* SELETOR DE DDI */}
                                            <div className="relative">
                                                <select 
                                                    value={ddi}
                                                    onChange={(e) => setDdi(e.target.value)}
                                                    className="appearance-none bg-gray-50 border border-transparent focus:border-gray-200 focus:bg-white p-4 pr-10 rounded-2xl outline-none transition-all font-bold text-black text-sm w-[100px]"
                                                >
                                                    <option value="+55">🇧🇷 +55</option>
                                                    <option value="+351">🇵🇹 +351</option>
                                                    <option value="+1">🇺🇸 +1</option>
                                                    <option value="+54">🇦🇷 +54</option>
                                                    <option value="+44">🇬🇧 +44</option>
                                                    <option value="+34">🇪🇸 +34</option>
                                                    <option value="+">🌍 +</option>
                                                </select>
                                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                                    <ChevronRight size={14} className="rotate-90" />
                                                </div>
                                            </div>

                                            {/* INPUT DO NÚMERO */}
                                            <input
                                                type="tel"
                                                required
                                                value={whatsappNumber}
                                                onChange={handleWhatsappChange}
                                                placeholder={lp.placeholderWhatsapp || '(00) 00000-0000'}
                                                className="flex-1 p-4 bg-gray-50 border border-transparent focus:border-gray-200 focus:bg-white rounded-2xl outline-none transition-all font-medium text-black"
                                            />
                                        </div>
                                    </div>

                                    <input type="hidden" name="origem" value={origem} />
                                    {/* Honeypot field for bot protection */}
                                    <input type="text" name="website" value="" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />

                                    {lp.showTerms && (
                                        <div className="flex gap-3 px-1 py-1">
                                            <input
                                                type="checkbox"
                                                id="terms"
                                                checked={acceptedTerms}
                                                onChange={e => setAcceptedTerms(e.target.checked)}
                                                required
                                                className="mt-1 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            />
                                            <label htmlFor="terms" className="text-[11px] text-gray-500 leading-tight">
                                                {lp.termsText || 'Autorizo o uso dos meus dados conforme a LGPD.'}
                                            </label>
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className={`${lp.buttonSize} w-full font-bold flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl hover:brightness-110 disabled:opacity-50`}
                                        style={{ backgroundColor: lp.buttonBgColor, color: lp.buttonTextColor, borderRadius: lp.buttonRadius || '16px' }}
                                    >
                                        {isSubmitting ? (
                                            <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                                        ) : (
                                            <>
                                                {lp.buttonText}
                                                <ArrowRight size={20} />
                                            </>
                                        )}
                                    </button>

                                    <div className="pt-4 flex items-center justify-center gap-4 text-[10px] font-bold uppercase tracking-widest text-gray-300">
                                        <div className="flex items-center gap-1"><Lock size={12} /> Privacy Secure</div>
                                        <div className="flex items-center gap-1"><ShieldCheck size={12} /> 100% Free</div>
                                    </div>
                                </form>
                            </div>
                        ) : (
                            <div className="text-center py-12 space-y-6 relative z-10 animate-in zoom-in-95 duration-500">
                                <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle2 size={48} />
                                </div>
                                <h2 className="text-3xl font-bold text-black">Tudo Pronto!</h2>
                                <p className="text-gray-500 font-medium">{lp.submittedMessage || 'Sua solicitação foi processada. Em instantes você receberá o material.'}</p>
                                
                                {lp.redirectUrl && (
                                    <div className="pt-4">
                                        <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                                            <div className="h-full bg-green-500 animate-progress"></div>
                                        </div>
                                        <p className="text-[10px] uppercase font-bold text-gray-300 mt-2">Redirecionando...</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* FOOTER */}
            <footer className="py-12 px-6 border-t border-black/5 flex flex-col items-center gap-4 opacity-40">
                <div className="font-black tracking-tighter italic">PH DONASSOLO</div>
                <p className="text-[10px] font-bold uppercase tracking-widest">© 2026 Todos os direitos reservados</p>
            </footer>

            <style>{`
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        .animate-progress {
          animation: progress 2s linear forwards;
        }
      `}</style>
        </div>
    );
};

export default DynamicLPPage;
