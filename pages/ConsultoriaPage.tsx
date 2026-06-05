import React from 'react';
import ScrollReveal from '../components/ui/ScrollReveal';
import FAQAccordion from '../components/ui/FAQAccordion';

const MENSAGEM = encodeURIComponent(
  'Olá Paulo. Gostaria de conversar sobre o trabalho de Consultoria. Podemos agendar uma reunião de diagnóstico?'
);

const etapas = [
  {
    num: '01', nome: 'Diagnóstico',
    desc: 'Mapeamento completo do processo comercial: estrutura da equipe, indicadores, pipeline, gestão e cultura de vendas.',
    entregavel: 'Relatório de Diagnóstico Comercial',
  },
  {
    num: '02', nome: 'Estruturação',
    desc: 'Definição do processo comercial ideal, papéis e responsabilidades, metas e indicadores, e plano de implementação.',
    entregavel: 'Manual do Processo Comercial',
  },
  {
    num: '03', nome: 'Ativação',
    desc: 'Treinamento da equipe, acompanhamento em campo, ajustes e implantação das ferramentas de gestão.',
    entregavel: 'Relatório de Execução',
  },
  {
    num: '04', nome: 'Sustentação',
    desc: 'Transferência de responsabilidade para a liderança interna. O time opera com o novo processo de forma autônoma.',
    entregavel: 'Plano de Continuidade',
  },
];

const areas = [
  {
    titulo: 'Diagnóstico Comercial',
    desc: 'Avaliação profunda do processo de vendas, da equipe, da gestão e dos indicadores para identificar os gargalos reais.',
  },
  {
    titulo: 'Estruturação de Processos',
    desc: 'Desenho ou redesenho do funil de vendas, etapas, critérios de avanço, responsabilidades e cadência de atividades.',
  },
  {
    titulo: 'Treinamento de Equipes',
    desc: 'Programas customizados de capacitação para vendedores e líderes comerciais — técnica de vendas, gestão e negociação.',
  },
  {
    titulo: 'Gestão e Liderança Comercial',
    desc: 'Implantação de rotinas de gestão: reuniões de pipeline, 1:1, relatórios de campo e rituais de acompanhamento.',
  },
  {
    titulo: 'Indicadores e Dashboards',
    desc: 'Definição dos KPIs corretos para cada etapa do funil e construção dos painéis de acompanhamento da gestão.',
  },
  {
    titulo: 'Onboarding e Ramp-up',
    desc: 'Estruturação do processo de entrada de novos vendedores para reduzir o tempo até a primeira venda.',
  },
];

const faqItems = [
  {
    question: 'Qual é a duração mínima de um projeto de consultoria?',
    answer: 'Depende do escopo. Um diagnóstico isolado pode ser concluído em 3 a 4 semanas. Um projeto completo de estruturação e ativação costuma durar de 3 a 6 meses.',
  },
  {
    question: 'A consultoria é presencial ou remota?',
    answer: 'Ambas. Os diagnósticos e treinamentos podem ser feitos remotamente ou presencialmente dependendo da localização e necessidade do cliente. Atendemos empresas no Brasil e em Portugal.',
  },
  {
    question: 'Vocês trabalham com quais setores?',
    answer: 'Especialização em indústria de bens de consumo, distribuição e serviços B2B. Empresas com equipes comerciais de 3 a 80 pessoas.',
  },
  {
    question: 'Como é definido o valor do projeto?',
    answer: 'O valor é definido após o diagnóstico inicial — que é gratuito. O investimento depende do escopo, do tamanho da equipe e da complexidade do projeto.',
  },
];

const ConsultoriaPage: React.FC = () => (
  <main>
    {/* Hero */}
    <section style={{ background: 'var(--cream)', paddingTop: '8rem', paddingBottom: '6rem' }}>
      <div className="sec-wrap" style={{ maxWidth: 900, margin: '0 auto', padding: '0 5vw' }}>
        <ScrollReveal>
          <div className="eyebrow" style={{ marginBottom: '1.5rem' }}>Consultoria</div>
          <h1 style={{
            fontFamily: 'var(--fd)', fontSize: 'clamp(2.4rem, 5vw, 3.6rem)', fontWeight: 700,
            lineHeight: 1.12, color: 'var(--ink)', letterSpacing: '-.02em', marginBottom: '1.6rem',
          }}>
            Do diagnóstico à execução.<br />
            <em style={{ color: 'var(--navy)' }}>Com resultado mensurável.</em>
          </h1>
          <p style={{ fontSize: '1rem', color: 'var(--ink-3)', lineHeight: 1.75, marginBottom: '2.5rem', maxWidth: 600 }}>
            Estruturamos e ativamos o processo comercial da sua empresa — da estratégia à implementação em campo. Para empresas que querem vender mais com método, consistência e gestão real.
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <a href={`#/fale-comigo?mensagem=${MENSAGEM}`} className="btn-navy">Solicitar diagnóstico gratuito</a>
            <a href="#/mentoria" className="btn-ghost-ink">Ver também: Mentoria →</a>
          </div>
        </ScrollReveal>
      </div>
    </section>

    {/* Áreas de atuação */}
    <section style={{ background: 'var(--navy)', padding: '6rem 0' }}>
      <div className="sec-wrap">
        <ScrollReveal>
          <div className="eyebrow" style={{ color: 'rgba(243,239,230,.35)', borderColor: 'var(--gold)', marginBottom: '1rem' }}>
            Áreas de atuação
          </div>
          <h2 style={{
            fontFamily: 'var(--fd)', fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 700,
            color: 'rgba(243,239,230,.9)', letterSpacing: '-.02em', marginBottom: '3rem',
          }}>
            O que podemos trabalhar juntos.
          </h2>
        </ScrollReveal>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
          {areas.map((a, i) => (
            <ScrollReveal key={a.titulo} delay={((i % 3) + 1) as 1 | 2 | 3}>
              <div style={{
                background: 'rgba(243,239,230,.04)', border: '1px solid rgba(243,239,230,.07)',
                padding: '2rem', position: 'relative', overflow: 'hidden',
              }}>
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: 2,
                  background: 'linear-gradient(90deg, var(--gold), var(--gold-2))',
                }} />
                <h3 style={{ fontFamily: 'var(--fd)', fontSize: '1.1rem', fontWeight: 700, color: 'rgba(243,239,230,.85)', marginBottom: '.8rem' }}>
                  {a.titulo}
                </h3>
                <p style={{ fontSize: '.82rem', color: 'rgba(243,239,230,.35)', lineHeight: 1.65 }}>{a.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>

      <style>{`@media(max-width:768px){.cons-areas{grid-template-columns:1fr 1fr!important}}`}</style>
    </section>

    {/* Metodologia */}
    <section style={{ background: 'var(--cream-d)', padding: '6rem 0' }}>
      <div className="sec-wrap">
        <ScrollReveal>
          <div className="eyebrow" style={{ marginBottom: '1rem' }}>Metodologia</div>
          <h2 style={{
            fontFamily: 'var(--fd)', fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 700,
            color: 'var(--ink)', letterSpacing: '-.02em', marginBottom: '3.5rem',
          }}>
            Um processo com começo, meio e fim.
          </h2>
        </ScrollReveal>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          {etapas.map((e, i) => (
            <ScrollReveal key={e.num} delay={((i % 4) + 1) as 1 | 2 | 3 | 4}>
              <div style={{
                display: 'grid', gridTemplateColumns: '80px 1fr', gap: '2.5rem',
                padding: '2.5rem 0', borderBottom: i < etapas.length - 1 ? '1px solid var(--rule)' : 'none',
              }}>
                <div style={{
                  width: 80, height: 80, border: '1.5px solid var(--gold)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  background: i === etapas.length - 1 ? 'rgba(168,120,40,.06)' : 'transparent',
                }}>
                  <span style={{ fontFamily: 'var(--fd)', fontSize: '1.8rem', fontWeight: 700, color: 'var(--gold)', lineHeight: 1 }}>
                    {e.num}
                  </span>
                </div>
                <div>
                  <h3 style={{ fontFamily: 'var(--fd)', fontSize: '1.3rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '.6rem' }}>
                    {e.nome}
                  </h3>
                  <p style={{ fontSize: '.88rem', color: 'var(--ink-3)', lineHeight: 1.7, marginBottom: '1rem' }}>{e.desc}</p>
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: '.5rem',
                    fontSize: '.78rem', color: 'var(--ink-3)',
                    background: 'var(--cream)', border: '1px solid var(--rule)', padding: '.35rem .8rem',
                  }}>
                    <span style={{ color: 'var(--gold)', fontSize: '.55rem' }}>▪</span>
                    {e.entregavel}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>

    {/* FAQ */}
    <section style={{ background: 'var(--cream)', padding: '5rem 0' }}>
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
            Vamos olhar para o seu processo comercial?
          </h2>
          <p style={{ fontSize: '.9rem', color: 'rgba(243,239,230,.4)', lineHeight: 1.75, marginBottom: '2.5rem' }}>
            Começamos com um diagnóstico gratuito de 30 minutos para entender onde está o gargalo e o que faz mais sentido atacar.
          </p>
          <a href={`#/fale-comigo?mensagem=${MENSAGEM}`} className="btn-primary">
            Solicitar diagnóstico gratuito
          </a>
        </ScrollReveal>
      </div>
    </section>
  </main>
);

export default ConsultoriaPage;
