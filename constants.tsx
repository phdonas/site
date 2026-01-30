
import React from 'react';
import { User, Home, TrendingUp, Zap } from 'lucide-react';
import { Pillar, Article, Course, Resource, Book } from './types';

/**
 * 1. PILARES DE CONTEÚDO
 * Altere as descrições e as cores de destaque de cada pilar aqui.
 */
export const PILLARS: Pillar[] = [
  {
    id: 'prof-paulo',
    title: 'Prof. Paulo',
    description: 'Educação e mentoria acadêmica e profissional de alta performance para profissionais modernos.',
    longDescription: 'Como mentor e professor, Paulo Donassolo aplica metodologias ativas para transformar o trabalho de profissionais que buscam a excelência. Gestores e Profissionais de Vendas.',
    imageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=1200',
    icon: 'User',
    accentColor: '#0071e3',
    link: '#/pilares#prof-paulo'
  },
  {
    id: 'consultoria-imobiliaria',
    title: 'Sou Consultor Imobiliário',
    description: 'Curadoria de Conteúdos para Profissionais que atuam no Mercado Imobiliário.',
    longDescription: 'Conteúdos sobre Gestão de Consultores, Negociação, Profissionalização e outros assuntos importantes para Consultores e Gestores. O objetivo é transformar a forma como Vendedores e Compradores atuam no mercado.',
    imageUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1200',
    icon: 'Home',
    accentColor: '#ac39ff',
    link: '#/pilares#consultoria-imobiliaria'
  },
  {
    id: '4050oumais',
    title: '4050oumais',
    description: 'Longevidade produtiva e novos horizontes para quem está no auge da experiência.',
    longDescription: 'O projeto 4050oumais é um movimento para ressignificar a maturidade no mercado de trabalho. Paulo discute assuntos sobre como profissionais experientes podem se manter relevantes.',
    imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=1200',
    icon: 'TrendingUp',
    accentColor: '#ff3030',
    link: '#/pilares#4050oumais'
  },
  {
    id: 'academia-do-gas',
    title: 'Academia do Gás',
    description: 'Conteúdos e Treinamentos especializado para Empreendedores e Gestores de Revendas.',
    longDescription: 'O Prof. Paulo H. Donassolo e a Academia do Gás oferecem treinamentos e cursos sobre Gestão para revendedores de GLP. Profissionalismo, Qualidade e Rentabilidade para as Revendas.',
    imageUrl: 'https://images.unsplash.com/photo-1581094288338-2314dddb7ecc?auto=format&fit=crop&q=80&w=1200',
    icon: 'Zap',
    accentColor: '#f56300',
    link: '#/pilares#academia-do-gas'
  }
];

/**
 * 2. CURSOS ONLINE
 * Altere os nomes, descrições, imagens e links da Hotmart aqui.
 */
export const MOCK_COURSES: Course[] = [
  { 
    id: 'c1', 
    name: 'Descomplicando o DRE', 
    description: 'O guia definitivo para quem deseja usar esta fundamental para avaliar a saúde da sua empresa.',
    longDescription: 'Aprenda a construir, analisar e utilizar o DRE para rentabilizar o seu negócio.',
    imageUrl: 'https://images.unsplash.com/photo-1460472178825-e51c062365d3?auto=format&fit=crop&q=80&w=800',
    category: 'Educação',
    salesUrl: '//https://www.udemy.com/course/descomplicando-o-dre/',
    videos: []
  },
  { 
    id: 'c2', 
    name: 'Negociação para Vendas: IA+Ferramentas', 
    description: 'Técnicas de Negociação aplicadas às Vendas',
    longDescription: 'Aprenda as técnicas de negociação consolidadasa e com o uso da IA para escalar suas negociações e vendas.',
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800',
    category: 'Educação',
    salesUrl: 'https://www.udemy.com/course/negociacao-para-vendas-tecnicas-ia-professor/',
    videos: []
  }
];

/**
 * 3. LIVROS PUBLICADOS
 * Altere as capas e links de compra (Amazon/Próprio) aqui.
 */
export const MOCK_BOOKS: Book[] = [
  {
    id: 'b1',
    title: 'A Bíblia da Revenda de Gás',
    description: 'Tudo o que você precisa saber para gerir uma revenda de sucesso.',
    imageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800',
    buyUrl: '#'
  },
  {
    id: 'b2',
    title: 'O Novo Investidor Imobiliário',
    description: 'Como navegar pelos ciclos econômicos e encontrar oportunidades.',
    imageUrl: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=800',
    buyUrl: '#'
  }
];

/**
 * 4. MATERIAIS PARA DOWNLOAD
 */
export const MOCK_RESOURCES: Resource[] = [
  { id: 'r1', name: 'Simulador de Viabilidade Imobiliária', category: 'Planilhas', type: 'EXCEL', size: '2.4 MB', url: '#' },
  { id: 'r2', name: 'Guia de Longevidade Ativa 2024', category: 'E-books', type: 'PDF', size: '15.8 MB', url: '#' }
];

/**
 * 5. ARTIGOS DE EXEMPLO (FALLBACK)
 * Usado apenas se a conexão com o WordPress falhar.
 */
export const MOCK_ARTICLES: Article[] = [
  {
    id: '1',
    title: 'Carregando conteúdos do WordPress...',
    pillarId: 'prof-paulo',
    category: 'Status',
    excerpt: 'Se este texto persistir, verifique a conexão do WordPress no Admin.',
    content: `<p>Aguarde enquanto sincronizamos os dados...</p>`,
    date: new Date().toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&q=80&w=1200'
  }
];

export const getIcon = (name: string) => {
  switch (name) {
    case 'User': return <User className="w-8 h-8" />;
    case 'Home': return <Home className="w-8 h-8" />;
    case 'TrendingUp': return <TrendingUp className="w-8 h-8" />;
    case 'Zap': return <Zap className="w-8 h-8" />;
    default: return <User className="w-8 h-8" />;
  }
};
