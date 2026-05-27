"use client";

import { useState } from "react";

const CheckIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <circle cx="9" cy="9" r="9" fill="#c9a84c" fillOpacity="0.15" />
    <path d="M5 9l3 3 5-5" stroke="#c9a84c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ArrowRight = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const fases = [
  {
    numero: "01",
    nome: "Diagnóstico",
    semanas: "Semanas 1 a 3",
    descricao: "Mapeamos o processo de vendas e de gestão atual, identificamos os gargalos reais e entendemos como a equipe está estruturada e gerida.",
    entregavel: "Relatório de Diagnóstico Comercial",
  },
  {
    numero: "02",
    nome: "Plano",
    semanas: "Semanas 4 e 5",
    descricao: "Definimos as 3 prioridades de trabalho e construímos o plano de ação semana a semana — o que atacar, como e em que ordem.",
    entregavel: "Plano de Ação estruturado",
  },
  {
    numero: "03",
    nome: "Implementação",
    semanas: "Semanas 5 a 10",
    descricao: "Executamos o plano com acompanhamento semanal. Cada sessão tem pauta definida, registro e ações claras para a semana seguinte.",
    entregavel: "Relatório de Execução do Programa",
  },
  {
    numero: "04",
    nome: "Consolidação",
    semanas: "Semanas 11 e 12",
    descricao: "Avaliamos os resultados, documentamos o que ficou funcionando e construímos o plano de continuidade para as próximas 4 semanas sem o mentor.",
    entregavel: "Relatório Final do Programa",
  },
];

const inclusos = [
  "12 sessões - uma por semana - individuais de 60 a 90 minutos.",
  "Relatório de Diagnóstico Comercial completo.",
  "Plano de Ação estruturado por semana.",
  "Templates, ferramentas e frameworks aplicáveis imediatamente.",
  "Suporte por WhatsApp entre sessões (dias úteis).",
  "Relatório Final com evolução e próximos passos.",
];

const paraQuem = [
  "Você é dono, empreendedor ou gestor comercial de uma PME de indústria ou distribuição.",
  "Sua equipe de vendas não está atingindo o potencial que você sabe que ela tem.",
  "Você precisa entrar nas negociações importantes para elas fecharem.",
  "As metas existem, mas o processo para atingi-las não está claro.",
  "Você quer crescer sem depender só de você para que as vendas aconteçam.",
];

const naoParaQuem = [
  "Quem quer receitas prontas, respostas rápidas ou soluções mágicas.",
  "Quem busca palestra ou treinamento pontual sem acompanhamento.",
  "Quem não está disposto a executar entre as sessões.",
  "Quem não tem tempo para desenvolver a gestão comercial e as pessoas."
];

const faq = [
  {
    pergunta: "As sessões são presenciais ou online?",
    resposta: "Online, via Google Meet, Zoom ou Teams. Isso permite flexibilidade de horário e atendimento independente de localização — atendo empresas em todo o Brasil e Portugal.",
  },
  {
    pergunta: "O que acontece se eu precisar remarcar uma sessão?",
    resposta: "Sem problema. Avise com pelo menos 24 horas de antecedência e remarcamos sem custo.",
  },
  {
    pergunta: "Como funciona o suporte por WhatsApp?",
    resposta: "Disponível de segunda a sexta, das 9h às 18h (horário de Lisboa / 6h às 15h Brasília). Para dúvidas rápidas sobre o que foi discutido na sessão e situações que surgem no dia a dia. Questões mais complexas ficam para a próxima sessão.",
  },
  {
    pergunta: "Em quanto tempo vejo resultados?",
    resposta: "As primeiras mudanças de processo começam na Fase 2 — semana 5. O programa é de implementação, não de teoria, e por isso os resultados dependem também do seu trabalho.",
  },
  {
    pergunta: "Posso continuar após os 90 dias?",
    resposta: "Sim. Na Sessão 12 apresentamos as opções de continuidade — nova rodada de mentoria, consultoria direta ou acesso aos cursos online para a equipe.",
  },
];

const MENSAGEM_CONTATO = "Olá Paulo. Eu gostaria de conversar com você sobre o trabalho de Mentoria. Tenho interesse em saber mais. Podemos agendar um diagnóstico inicial sem compromisso e sem custos?";

export default function MentoriaPage() {
  const [faqAberto, setFaqAberto] = useState(null);

  return (
    <div style={{
      fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
      background: "#0f0f11",
      color: "#e8e0d0",
      minHeight: "100vh",
      overflowX: "hidden",
    }}>

      {/* Hero */}
      <section style={{
        padding: "80px 24px 64px",
        maxWidth: 760,
        margin: "0 auto",
        borderBottom: "1px solid #1e1e24",
      }}>
        <p style={{
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "#c9a84c",
          marginBottom: 20,
        }}>
          Prof. Paulo H. Donassolo
        </p>

        <h1 style={{
          fontSize: "clamp(28px, 5vw, 46px)",
          fontWeight: 400,
          lineHeight: 1.2,
          color: "#f8f6f0",
          marginBottom: 24,
          letterSpacing: "-0.02em",
        }}>
          Mentoria Comercial<br />
          <span style={{ color: "#c9a84c" }}>90 dias.</span> Diagnóstico,<br />
          plano e implementação.
        </h1>

        <p style={{
          fontSize: 17,
          lineHeight: 1.7,
          color: "#c5bcae",
          marginBottom: 36,
          maxWidth: 580,
        }}>
          Para empreendedores, empresários e gestores comerciais de PMEs que querem estruturar ou desenovolver
          a área de vendas com método — e parar de depender deles mesmos para
          que as negociações importantes fechem.
        </p>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <a
            href={`#/contato?mensagem=${encodeURIComponent(MENSAGEM_CONTATO)}`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "#c9a84c",
              color: "#0f0f0f",
              padding: "14px 24px",
              borderRadius: 4,
              fontWeight: 600,
              fontSize: 14,
              textDecoration: "none",
              letterSpacing: "0.02em",
            }}
          >
            Quero conhecer o programa <ArrowRight />
          </a>
          <button
            onClick={() => {
              const element = document.getElementById("como-funciona");
              if (element) {
                element.scrollIntoView({ behavior: "smooth" });
              }
            }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              border: "1px solid #3a3a42",
              background: "none",
              color: "#c5bcae",
              padding: "14px 24px",
              borderRadius: 4,
              fontSize: 14,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Ver como funciona
          </button>
        </div>
      </section>

      {/* Problema */}
      <section style={{
        padding: "64px 24px",
        maxWidth: 760,
        margin: "0 auto",
        borderBottom: "1px solid #1e1e24",
      }}>
        <p style={{
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "#8c8578",
          marginBottom: 32,
        }}>
          O problema
        </p>

        <div style={{ display: "grid", gap: 20 }}>
          {[
            "A equipe de vendas existe, mas o processo depende de você para funcionar.",
            "Sua empresa está crescendo e você está perdendo o controle da gestão.",
            "As metas são definidas, mas o caminho para atingi-las não está claro para ninguém.",
            "Os vendedores perdem negócios que poderiam ter fechado — e você não sabe exatamente onde está o gargalo.",
            "Você gerencia resultado final, não o processo que gera o resultado.",
          ].map((item, i) => (
            <div key={i} style={{
              display: "flex",
              gap: 16,
              alignItems: "flex-start",
              padding: "20px 24px",
              background: "#16161a",
              borderRadius: 6,
              border: "1px solid #222226",
            }}>
              <span style={{
                fontSize: 11,
                fontWeight: 600,
                color: "#8c8578",
                marginTop: 2,
                flexShrink: 0,
                fontVariantNumeric: "tabular-nums",
              }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <p style={{ fontSize: 15, lineHeight: 1.6, color: "#c5bcae", margin: 0 }}>
                {item}
              </p>
            </div>
          ))}
        </div>

        <p style={{
          fontSize: 15,
          lineHeight: 1.7,
          color: "#c9a84c",
          marginTop: 32,
          paddingLeft: 20,
          borderLeft: "2px solid #c9a84c",
        }}>
          O problema raramente é o vendedor. 
          Geralmente o problema está na falta de um processo de gestão e de vendas e 
          na falta de um método de trabalho e de acompanhamento dos vendedores e das vendas.
          É exatamente isso que resolvemos juntos nos 90 dias.
        </p>
      </section>

      {/* Para quem é */}
      <section style={{
        padding: "64px 24px",
        maxWidth: 760,
        margin: "0 auto",
        borderBottom: "1px solid #1e1e24",
      }}>
        <p style={{
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "#8c8578",
          marginBottom: 32,
        }}>
          Para quem é
        </p>

        <div style={{ display: "grid", gap: 10, marginBottom: 40 }}>
          {paraQuem.map((item, i) => (
            <div key={i} style={{
              display: "flex",
              gap: 12,
              alignItems: "flex-start",
            }}>
              <div style={{ marginTop: 2, flexShrink: 0 }}><CheckIcon /></div>
              <p style={{ fontSize: 15, lineHeight: 1.6, color: "#c5bcae", margin: 0 }}>
                {item}
              </p>
            </div>
          ))}
        </div>

        <p style={{
          fontSize: 13,
          fontWeight: 600,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "#a39989",
          marginBottom: 16,
        }}>
          Não é para quem
        </p>

        <div style={{ display: "grid", gap: 8 }}>
          {naoParaQuem.map((item, i) => (
            <div key={i} style={{
              display: "flex",
              gap: 12,
              alignItems: "flex-start",
            }}>
              <span style={{ color: "#c98a8a", fontSize: 14, marginTop: 2, flexShrink: 0 }}>—</span>
              <p style={{ fontSize: 14, lineHeight: 1.6, color: "#c98a8a", margin: 0 }}>
                {item}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Como funciona */}
      <section id="como-funciona" style={{
        padding: "64px 24px",
        maxWidth: 760,
        margin: "0 auto",
        borderBottom: "1px solid #1e1e24",
      }}>
        <p style={{
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "#8c8578",
          marginBottom: 8,
        }}>
          Como funciona
        </p>
        <h2 style={{
          fontSize: 24,
          fontWeight: 400,
          color: "#f8f6f0",
          marginBottom: 40,
          letterSpacing: "-0.01em",
        }}>
          90 dias. 12 sessões. 4 fases.
        </h2>

        <div style={{ display: "grid", gap: 2 }}>
          {fases.map((fase, i) => (
            <div key={i} style={{
              display: "grid",
              gridTemplateColumns: "60px 1fr",
              gap: 24,
              padding: "28px 0",
              borderBottom: i < fases.length - 1 ? "1px solid #222226" : "none",
            }}>
              <div>
                <span style={{
                  fontSize: 28,
                  fontWeight: 300,
                  color: "rgba(201, 168, 76, 0.25)",
                  letterSpacing: "-0.02em",
                  fontVariantNumeric: "tabular-nums",
                }}>
                  {fase.numero}
                </span>
              </div>
              <div>
                <div style={{ display: "flex", gap: 12, alignItems: "baseline", marginBottom: 8, flexWrap: "wrap" }}>
                  <h3 style={{
                    fontSize: 16,
                    fontWeight: 600,
                    color: "#f8f6f0",
                    margin: 0,
                  }}>
                    {fase.nome}
                  </h3>
                  <span style={{
                    fontSize: 11,
                    color: "#c9a84c",
                    fontWeight: 500,
                    letterSpacing: "0.06em",
                  }}>
                    {fase.semanas}
                  </span>
                </div>
                <p style={{
                  fontSize: 14,
                  lineHeight: 1.7,
                  color: "#c5bcae",
                  margin: "0 0 12px",
                }}>
                  {fase.descricao}
                </p>
                <div style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 12,
                  color: "#c5bcae",
                  background: "#1a1a20",
                  padding: "4px 10px",
                  borderRadius: 3,
                  border: "1px solid #33333b",
                }}>
                  <span style={{ color: "#c9a84c", fontSize: 10 }}>▪</span>
                  {fase.entregavel}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* O que está incluído */}
      <section style={{
        padding: "64px 24px",
        maxWidth: 760,
        margin: "0 auto",
        borderBottom: "1px solid #1e1e24",
      }}>
        <p style={{
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "#8c8578",
          marginBottom: 32,
        }}>
          O que está incluído
        </p>

        <div style={{ display: "grid", gap: 14 }}>
          {inclusos.map((item, i) => (
            <div key={i} style={{
              display: "flex",
              gap: 14,
              alignItems: "flex-start",
            }}>
              <div style={{ marginTop: 2, flexShrink: 0 }}><CheckIcon /></div>
              <p style={{ fontSize: 15, lineHeight: 1.6, color: "#c5bcae", margin: 0 }}>
                {item}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Sobre o mentor */}
      <section style={{
        padding: "64px 24px",
        maxWidth: 760,
        margin: "0 auto",
        borderBottom: "1px solid #1e1e24",
      }}>
        <p style={{
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "#8c8578",
          marginBottom: 32,
        }}>
          Quem conduz
        </p>

        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: 24,
        }}>
          <div>
            <h3 style={{
              fontSize: 20,
              fontWeight: 400,
              color: "#f8f6f0",
              marginBottom: 6,
              letterSpacing: "-0.01em",
            }}>
              Prof. Paulo H. Donassolo
            </h3>
            <p style={{
              fontSize: 13,
              color: "#c9a84c",
              marginBottom: 20,
              letterSpacing: "0.04em",
            }}>
              Professor, Consultor e Mentor Comercial
            </p>
            <div style={{ display: "grid", gap: 12 }}>
              {[
                "Mais de 25 anos como Gerente e Diretor Comercial em indústrias de bens de consumo e distribuição.",
                "Mais de 20 anos como professor de MBA e pós-graduação em Vendas, Negociação e Gestão Comercial — ESPM e Unisinos.",
                "Autor de dois livros sobre gestão comercial, vendas e negociação.",
                "Mestre em Administração de Empresas, MBA em Marketing Estratégico e MBA em Gestão por Processos.",
                "Formador certificado pelo IEFP (Portugal).",
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <div style={{ marginTop: 3, flexShrink: 0 }}><CheckIcon /></div>
                  <p style={{ fontSize: 14, lineHeight: 1.6, color: "#c5bcae", margin: 0 }}>
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{
        padding: "64px 24px",
        maxWidth: 760,
        margin: "0 auto",
        borderBottom: "1px solid #1e1e24",
      }}>
        <p style={{
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "#8c8578",
          marginBottom: 32,
        }}>
          Perguntas frequentes
        </p>

        <div style={{ display: "grid", gap: 2 }}>
          {faq.map((item, i) => (
            <div
              key={i}
              style={{
                borderBottom: "1px solid #222226",
              }}
            >
              <button
                onClick={() => setFaqAberto(faqAberto === i ? null : i)}
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 16,
                  padding: "20px 0",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <span style={{
                  fontSize: 15,
                  color: faqAberto === i ? "#f8f6f0" : "#b5ab9a",
                  fontWeight: faqAberto === i ? 500 : 400,
                  lineHeight: 1.4,
                  fontFamily: "'DM Sans', sans-serif",
                }}>
                  {item.pergunta}
                </span>
                <span style={{
                  color: "#c9a84c",
                  fontSize: 18,
                  flexShrink: 0,
                  transform: faqAberto === i ? "rotate(45deg)" : "none",
                  transition: "transform 0.2s",
                }}>
                  +
                </span>
              </button>
              {faqAberto === i && (
                <p style={{
                  fontSize: 14,
                  lineHeight: 1.7,
                  color: "#c5bcae",
                  margin: "0 0 20px",
                  paddingRight: 32,
                }}>
                  {item.resposta}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA Final */}
      <section style={{
        padding: "80px 24px",
        maxWidth: 760,
        margin: "0 auto",
        textAlign: "center",
      }}>
        <p style={{
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "#8c8578",
          marginBottom: 20,
        }}>
          Próximo passo
        </p>
        <h2 style={{
          fontSize: "clamp(22px, 4vw, 34px)",
          fontWeight: 400,
          color: "#f8f6f0",
          marginBottom: 16,
          lineHeight: 1.3,
          letterSpacing: "-0.02em",
        }}>
          Comece com uma sessão de<br />diagnóstico gratuita.
        </h2>
        <p style={{
          fontSize: 15,
          lineHeight: 1.7,
          color: "#c5bcae",
          marginBottom: 36,
          maxWidth: 480,
          margin: "0 auto 36px",
        }}>
          30 minutos. Olhamos juntos onde sua área comercial está travando
          e o que faz mais sentido atacar primeiro. Sem compromisso.
        </p>
        <a
          href={`#/contato?mensagem=${encodeURIComponent(MENSAGEM_CONTATO)}`}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            background: "#c9a84c",
            color: "#0f0f0f",
            padding: "16px 32px",
            borderRadius: 4,
            fontWeight: 700,
            fontSize: 14,
            textDecoration: "none",
            letterSpacing: "0.04em",
            textTransform: "uppercase",
          }}
        >
          Agendar diagnóstico gratuito <ArrowRight />
        </a>
        <p style={{
          fontSize: 12,
          color: "#8c8578",
          marginTop: 20,
        }}>
          ou acesse o formulário de contato
        </p>
      </section>

    </div>
  );
}
