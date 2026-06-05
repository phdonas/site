import React, { useState } from 'react';
import ScrollReveal from '../components/ui/ScrollReveal';
import FAQAccordion from '../components/ui/FAQAccordion';

const MENSAGEM = encodeURIComponent(
  'Olá Paulo. Gostaria de conversar sobre a Mentoria Comercial. Posso agendar um diagnóstico inicial sem compromisso?'
);

const fases = [
  {
    num: '01', nome: 'Diagnóstico', tag: 'Semanas 1–3',
    desc: 'Mapeamos o processo de vendas e gestão atual, identificamos os gargalos reais e entendemos como a equipe está estruturada e gerida.',
    entregavel: 'Relatório de Diagnóstico Comercial',
  },
  {
    num: '02', nome: 'Plano', tag: 'Semanas 4–5',
    desc: 'Definimos as 3 prioridades de trabalho e construímos o plano de ação semana a semana — o que atacar, como e em que ordem.',
    entregavel: 'Plano de Ação estruturado',
  },
  {
    num: '03', nome: 'Implementação', tag: 'Semanas 5–10',
    desc: 'Executamos o plano com acompanhamento semanal. Cada sessão tem pauta definida, registro e ações claras para a semana seguinte.',
    entregavel: 'Relatório de Execução do Programa',
  },
  {
    num: '04', nome: 'Consolidação', tag: 'Semanas 11–12',
    desc: 'Avaliamos os resultados, documentamos o que ficou funcionando e construímos o plano de continuidade para as próximas 4 semanas sem o mentor.',
    entregavel: 'Relatório Final do Programa',
  },
];

const inclusos = [
  '12 sessões individuais de 60 a 90 minutos — uma por semana.',
  'Relatório de Diagnóstico Comercial completo.',
  'Plano de Ação estruturado por semana.',
  'Templates, ferramentas e frameworks aplicáveis imediatamente.',
  'Suporte por WhatsApp entre sessões (dias úteis, 9h–18h Lisboa).',
  'Relatório Final com evolução e próximos passos.',
];

const paraQuem = [
  'Dono, empreendedor ou gestor comercial de uma PME de indústria ou distribuição.',
  'Sua equipe de vendas não está atingindo o potencial que você sabe que ela tem.',
  'Você precisa entrar nas negociações importantes para elas fecharem.',
  'As metas existem, mas o processo para atingi-las não está claro para ninguém.',
  'Você quer crescer sem depender só de você para que as vendas aconteçam.',
];

const naoParaQuem = [
  'Quem quer receitas prontas, respostas rápidas ou soluções mágicas.',
  'Quem busca palestra ou treinamento pontual sem acompanhamento.',
  'Quem não está disposto a executar entre as sessões.',
  'Quem não tem tempo para desenvolver a gestão comercial e as pessoas.',
];

const faqItems = [
  {
    question: 'As sessões são presenciais ou online?',
    answer: 'Online, via Google Meet, Zoom ou Teams. Isso permite flexibilidade de horário e atendimento independente de localização — atendo empresas em todo o Brasil e Portugal.',
  },
  {
    question: 'O que acontece se eu precisar remarcar uma sessão?',
    answer: 'Sem problema. Avise com pelo menos 24 horas de antecedência e remarcamos sem custo.',
  },
  {
    question: 'Como funciona o suporte por WhatsApp?',
    answer: 'Disponível de segunda a sexta, das 9h às 18h (horário de Lisboa). Para dúvidas rápidas sobre o que foi discutido na sessão. Questões mais complexas ficam para a próxima sessão.',
  },
  {
    question: 'Em quanto tempo vejo resultados?',
    answer: 'As primeiras mudanças de processo começam na Fase 2 — semana 5. O programa é de implementação, não de teoria, e os resultados dependem também do seu trabalho.',
  },
  {
    question: 'Posso continuar após os 90 dias?',
    answer: 'Sim. Na Sessão 12 apresentamos as opções de continuidade — nova rodada de mentoria, consultoria direta ou acesso aos cursos online para a equipe.',
  },
];

const MentoriaPage: React.FC = () => (
  <main>
    {/* Hero */}
    <section style={{ background: 'var(--cream)', paddingTop: '8rem', paddingBottom: '6rem' }}>
      <div className="sec-wrap" style={{ maxWidth: 760, margin: '0 auto', padding: '0 5vw' }}>
        <ScrollReveal>
          <div className="eyebrow" style={{ marginBottom: '1.5rem' }}>Mentoria Comercial</div>
          <h1 style={{
            fontFamily: 'var(--fd)', fontSize: 'clamp(2.4rem, 5vw, 3.6rem)', fontWeight: 700,
            lineHeight: 1.12, color: 'var(--ink)', letterSpacing: '-.02em', marginBottom: '1.6rem',
          }}>
            90 dias. Diagnóstico,<br />
            <em style={{ color: 'var(--gold)' }}>plano e implementação.</em>
          </h1>
          <p style={{ fontSize: '1rem', color: 'var(--ink-3)', lineHeight: 1.75, marginBottom: '2.5rem', maxWidth: 560 }}>
            Para empreendedores, empresários e gestores comerciais de PMEs que querem estruturar a área de vendas com método — e parar de depender deles mesmos para que as negociações importantes fechem.
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <a href={`#/fale-comigo?mensagem=${MENSAGEM}`} className="btn-navy">Quero conhecer o programa</a>
            <button
              onClick={() => document.getElementById('como-funciona')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-ghost-ink"
              style={{ fontFamily: 'inherit', fontSize: '.84rem' }}
            >
              Ver como funciona
            </button>
          </div>
        </ScrollReveal>
      </div>
    </section>

    {/* O Problema */}
    <section style={{ background: 'var(--cream-d)', padding: '5rem 0' }}>
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '0 5vw' }}>
        <ScrollReveal>
          <div className="eyebrow" style={{ marginBottom: '2rem' }}>O problema</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              'A equipe de vendas existe, mas o processo depende de você para funcionar.',
              'Sua empresa está crescendo e você está perdendo o controle da gestão.',
              'As metas são definidas, mas o caminho para atingi-las não está claro para ninguém.',
              'Os vendedores perdem negócios que poderiam ter fechado — e você não sabe onde está o gargalo.',
              'Você gerencia resultado final, não o processo que gera o resultado.',
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: '1.2rem', alignItems: 'flex-start', padding: '1.4rem 1.6rem', background: 'var(--cream)', border: '1px solid var(--rule)' }}>
                <span style={{ fontFamily: 'var(--fm)', fontSize: '.5rem', color: 'var(--ink-3)', marginTop: '.1rem', flexShrink: 0 }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <p style={{ fontSize: '.9rem', color: 'var(--ink-2)', lineHeight: 1.65 }}>{item}</p>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '2rem', borderLeft: '2px solid var(--gold)', paddingLeft: '1.2rem' }}>
            <p style={{ fontFamily: 'var(--fd)', fontSize: '1rem', fontStyle: 'italic', color: 'var(--navy)', lineHeight: 1.65 }}>
              O problema raramente é o vendedor. Geralmente está na falta de um processo de gestão, de um método de trabalho e de acompanhamento real das vendas. É exatamente isso que resolvemos juntos nos 90 dias.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>

    {/* Para quem é */}
    <section style={{ background: 'var(--cream)', padding: '5rem 0' }}>
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '0 5vw' }}>
        <ScrollReveal>
          <div className="eyebrow" style={{ marginBottom: '2rem' }}>Para quem é</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '.8rem', marginBottom: '2.5rem' }}>
            {paraQuem.map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <span style={{ color: 'var(--gold)', fontSize: '1.1rem', flexShrink: 0, marginTop: '.1rem' }}>✓</span>
                <p style={{ fontSize: '.9rem', color: 'var(--ink-2)', lineHeight: 1.65 }}>{item}</p>
              </div>
            ))}
          </div>

          <div style={{ fontFamily: 'var(--fm)', fontSize: '.52rem', letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: '1rem', marginTop: '2rem' }}>
            Não é para quem
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '.6rem' }}>
            {naoParaQuem.map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <span style={{ color: 'var(--ink-3)', fontSize: '.9rem', flexShrink: 0 }}>—</span>
                <p style={{ fontSize: '.85rem', color: 'var(--ink-3)', lineHeight: 1.65 }}>{item}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>

    {/* Como funciona */}
    <section id="como-funciona" style={{ background: 'var(--navy)', padding: '6rem 0' }}>
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '0 5vw' }}>
        <ScrollReveal>
          <div className="eyebrow" style={{ color: 'rgba(243,239,230,.35)', borderColor: 'var(--gold)', marginBottom: '1rem' }}>Como funciona</div>
          <h2 style={{
            fontFamily: 'var(--fd)', fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 700,
            color: 'rgba(243,239,230,.9)', letterSpacing: '-.02em', marginBottom: '3rem',
          }}>
            90 dias. 12 sessões. 4 fases.
          </h2>
        </ScrollReveal>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {fases.map((fase, i) => (
            <ScrollReveal key={fase.num} delay={((i % 4) + 1) as 1 | 2 | 3 | 4}>
              <div style={{
                display: 'grid', gridTemplateColumns: '80px 1fr', gap: '2rem',
                padding: '2rem 0', borderBottom: i < fases.length - 1 ? '1px solid var(--rule-n)' : 'none',
                alignItems: 'start',
              }}>
                <div className={`fase-dot ${i === fases.length - 1 ? 'fase-dot-last' : ''}`}>
                  <span className={`fase-dot-n ${i === fases.length - 1 ? 'fase-dot-n-last' : ''}`}>{fase.num}</span>
                </div>
                <div>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'baseline', marginBottom: '.6rem', flexWrap: 'wrap' }}>
                    <h3 style={{ fontFamily: 'var(--fd)', fontSize: '1.2rem', fontWeight: 700, color: 'rgba(243,239,230,.85)' }}>
                      {fase.nome}
                    </h3>
                    <span style={{ fontFamily: 'var(--fm)', fontSize: '.5rem', letterSpacing: '.14em', color: 'var(--gold)', opacity: .7 }}>
                      {fase.tag}
                    </span>
                  </div>
                  <p style={{ fontSize: '.85rem', color: 'rgba(243,239,230,.4)', lineHeight: 1.7, marginBottom: '1rem' }}>
                    {fase.desc}
                  </p>
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: '.5rem',
                    fontSize: '.78rem', color: 'rgba(243,239,230,.35)',
                    background: 'rgba(243,239,230,.05)', border: '1px solid rgba(243,239,230,.08)',
                    padding: '.35rem .8rem',
                  }}>
                    <span style={{ color: 'var(--gold)', fontSize: '.55rem' }}>▪</span>
                    {fase.entregavel}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>

    {/* O que está incluído */}
    <section style={{ background: 'var(--cream-d)', padding: '5rem 0' }}>
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '0 5vw' }}>
        <ScrollReveal>
          <div className="eyebrow" style={{ marginBottom: '2rem' }}>O que está incluído</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {inclusos.map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <span style={{ color: 'var(--gold)', fontSize: '1.1rem', flexShrink: 0, marginTop: '.1rem' }}>✓</span>
                <p style={{ fontSize: '.9rem', color: 'var(--ink-2)', lineHeight: 1.65 }}>{item}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>

    {/* Sobre o mentor */}
    <section style={{ background: 'var(--cream)', padding: '5rem 0' }}>
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '0 5vw' }}>
        <ScrollReveal>
          <div className="eyebrow" style={{ marginBottom: '2rem' }}>Quem conduz</div>
          <h3 style={{ fontFamily: 'var(--fd)', fontSize: '1.8rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '.4rem' }}>
            Prof. Paulo H. Donassolo
          </h3>
          <p style={{ fontFamily: 'var(--fm)', fontSize: '.5rem', letterSpacing: '.14em', color: 'var(--gold)', marginBottom: '1.8rem' }}>
            Professor · Consultor · Mentor Comercial
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '.8rem' }}>
            {[
              'Mais de 25 anos como Gerente e Diretor Comercial em indústrias de bens de consumo e distribuição.',
              'Mais de 20 anos como professor de MBA e pós-graduação em Vendas, Negociação e Gestão Comercial — ESPM e Unisinos.',
              'Autor de livros sobre gestão comercial, vendas e negociação.',
              'Mestre em Administração de Empresas, MBA em Marketing Estratégico e MBA em Gestão por Processos.',
              'Formador certificado pelo IEFP (Portugal).',
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <span style={{ color: 'var(--gold)', fontSize: '1.1rem', flexShrink: 0, marginTop: '.1rem' }}>✓</span>
                <p style={{ fontSize: '.9rem', color: 'var(--ink-2)', lineHeight: 1.65 }}>{item}</p>
              </div>
            ))}
          </div>
          <a href="#/prof-paulo" className="btn-ghost-ink" style={{ display: 'inline-block', marginTop: '2rem' }}>
            Ver perfil completo →
          </a>
        </ScrollReveal>
      </div>
    </section>

    {/* FAQ */}
    <section style={{ background: 'var(--cream-d)', padding: '5rem 0' }}>
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '0 5vw' }}>
        <ScrollReveal>
          <div className="eyebrow" style={{ marginBottom: '2rem' }}>Perguntas frequentes</div>
          <FAQAccordion items={faqItems} />
        </ScrollReveal>
      </div>
    </section>

    {/* CTA Final */}
    <section style={{ background: 'var(--navy)', padding: '7rem 0', textAlign: 'center' }}>
      <div style={{ maxWidth: 560, margin: '0 auto', padding: '0 5vw' }}>
        <ScrollReveal>
          <div className="eyebrow" style={{ color: 'rgba(243,239,230,.35)', justifyContent: 'center', borderColor: 'transparent', marginBottom: '1.5rem' }}>
            Próximo passo
          </div>
          <h2 style={{ fontFamily: 'var(--fd)', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 700, color: 'rgba(243,239,230,.9)', letterSpacing: '-.02em', marginBottom: '1.2rem', lineHeight: 1.2 }}>
            Comece com uma sessão de diagnóstico gratuita.
          </h2>
          <p style={{ fontSize: '.9rem', color: 'rgba(243,239,230,.4)', lineHeight: 1.75, marginBottom: '2.5rem' }}>
            30 minutos. Olhamos juntos onde sua área comercial está travando e o que faz mais sentido atacar primeiro. Sem compromisso.
          </p>
          <a href={`#/fale-comigo?mensagem=${MENSAGEM}`} className="btn-primary">
            Agendar diagnóstico gratuito
          </a>
        </ScrollReveal>
      </div>
    </section>
  </main>
);

export default MentoriaPage;
