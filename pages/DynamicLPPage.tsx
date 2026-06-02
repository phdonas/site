import React, { useState, useEffect } from 'react';
import { DataService } from '../services/dataService';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../services/firebase';
import { Mail, CheckCircle2, ChevronRight, Lock, ShieldCheck, ArrowRight } from 'lucide-react';

const DynamicLPPage = () => {
    const [lp, setLp] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [ddi, setDdi] = useState('+55');
    const [whatsappNumber, setWhatsappNumber] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [origem, setOrigem] = useState('direto');
    const [startTime] = useState(Date.now());

    useEffect(() => {
        const handleLocationChange = () => {
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
            if (src) {
                setOrigem(src);
            }

            const fullPath = window.location.hash.split('/lp/')[1];
            const slugFromHash = fullPath ? fullPath.split('?')[0] : null;

            if (slugFromHash) {
                DataService.getLPBySlug(slugFromHash).then(data => {
                    if (data) {
                        setLp(data);
                        document.title = data.pageTitle || 'Material Gratuito';
                    }
                    setLoading(false);
                });
            } else {
                setLoading(false);
            }
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
