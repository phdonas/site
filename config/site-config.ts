
/**
 * Configurações globais do site.
 * Nota: Para alterações permanentes no servidor, edite este arquivo.
 * Para testes rápidos, o Admin agora salva no LocalStorage.
 */

const DEFAULT_CONFIG = {
  name: "PH Donassolo",
  email_contato: "paulo@phdonassolo.com",
  whatsapp: "351910298213", 
  whatsapp_display: "+351 910 298 213", 
  whatsapp_message: "Olá Paulo, vim pelo site e gostaria de saber mais sobre seu trabalho.",
  
  hero: {
    visible: true,
    title: "Conhecimento para o que vem a seguir.",
    subtitle: "Hub de conteúdo exclusivo sobre profissionais de vendas, mercado imobiliário e longevidade ativa.",
    tag: "Site Oficial",
    backgroundImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2000",
    buttonText: "Explorar Conteúdo",
    buttonLink: "#/artigos"
  },
  
  assistant: {
    visible: true,
    name: "Assistente Digital PH",
    welcome_message: "Olá! Sou o assistente do Prof. Paulo. Como posso ajudar você hoje com nossos conteúdos, cursos ou consultorias?",
    instructions: "Você é o assistente virtual de Prof. Paulo Donassolo. Seu tom deve ser profissional, elegante e prestativo (estilo Apple). Priorize informações sobre os 4 pilares: Professor Paulo, Consultoria Imobiliária, 4050oumais e Academia do Gás."
  },
  
  sections: {
    pillars: {
      visible: true,
      title: "Pilares de Conhecimento",
      subtitle: "Explore os temas que fundamentam nossa metodologia."
    },
    services: {
      visible: true,
      title: "Como posso ajudar?",
      subtitle: "Conheça nossas soluções para impulsionar seus resultados."
    },
    videos: {
      visible: true,
      title: "Aulas Curtas & Insights",
      subtitle: "Conteúdo visual direto ao ponto para sua evolução.",
      linkText: "Ver todos os vídeos"
    },
    articles: {
      visible: true,
      title: "Insights & Pensamento",
      subtitle: "Os últimos artigos divididos por pilares de conhecimento."
    },
    leadForm: {
      visible: true,
      title: "Receba as últimas atualizações"
    }
  },

  pages: {
    articles: {
      visible: true,
      title: "Artigos & Insights",
      subtitle: "Reflexões profundas sobre mercado, vendas e desenvolvimento."
    },
    downloads: {
      visible: true,
      title: "Ferramentas e Materiais",
      subtitle: "Acesse e baixe conteúdos práticos desenvolvidos para acelerar seus resultados."
    },
    courses: {
      visible: true,
      title: "Cursos e Livros Recomendados",
      subtitle: "Aprofunde seu conhecimento com nossa curadoria de materiais."
    },
    contact: {
      visible: true,
      title: "Fale Conosco",
      subtitle: "Entre em contato para palestras, consultorias ou dúvidas em geral."
    }
  },
  
  footer: {
    description: "Hub de conteúdos especializados para profissionais, empreendedores e interessados em buscar a excelência em seus pilares de vida e carreira.",
    copyright: `Copyright © ${new Date().getFullYear()} Prof. PH Donassolo. Todos os direitos reservados.`
  }
};

// Tenta carregar do cache para o Admin funcionar dinamicamente
const getSavedConfig = () => {
  const saved = localStorage.getItem('phd_site_config');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      return DEFAULT_CONFIG;
    }
  }
  return DEFAULT_CONFIG;
};

export const SITE_CONFIG = getSavedConfig();
