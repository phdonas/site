
import React from 'react';
import { User, Home, TrendingUp, Zap } from 'lucide-react';
import { Pillar, Article, Course, Resource, Book } from './types';

export const PILLARS: Pillar[] = [
  {
    id: 'prof-paulo',
    title: 'Prof. Paulo',
    description: 'Educação e mentoria acadêmica de alta performance para profissionais modernos.',
    longDescription: 'Como mentor e professor, Paulo Donassolo aplica metodologias ativas para transformar a carreira de educadores e profissionais que buscam excelência técnica e didática. O foco aqui é o desenvolvimento do "ser professor" na era digital.',
    imageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=1200',
    icon: 'User',
    accentColor: '#0071e3',
    link: '#/pilares#prof-paulo'
  },
  {
    id: 'consultoria-imobiliaria',
    title: 'Consultor Imobiliário',
    description: 'Estratégias de investimento e curadoria imobiliária com foco em rentabilidade.',
    longDescription: 'A consultoria imobiliária de Paulo Donassolo vai além da simples transação. Envolve análise macroeconômica, curadoria de ativos e estratégias de saída para investidores que buscam segurança e valorização real de patrimônio.',
    imageUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1200',
    icon: 'Home',
    accentColor: '#ac39ff',
    link: '#/pilares#consultoria-imobiliaria'
  },
  {
    id: '4050oumais',
    title: '4050oumais',
    description: 'Longevidade produtiva e novos horizontes para quem está no auge da experiência.',
    longDescription: 'O projeto 4050oumais é um movimento para ressignificar a maturidade no mercado de trabalho. Paulo ensina como profissionais experientes podem se manter relevantes, produtivos e em constante evolução após os 40 e 50 anos.',
    imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=1200',
    icon: 'TrendingUp',
    accentColor: '#ff3030',
    link: '#/pilares#4050oumais'
  },
  {
    id: 'academia-do-gas',
    title: 'Academia do Gás',
    description: 'Treinamento especializado para o setor de energia e GLP.',
    longDescription: 'Referência no setor de energia, a Academia do Gás oferece treinamentos técnicos, operacionais e de gestão para revendedores de GLP, garantindo segurança e eficiência em um dos mercados mais regulados do país.',
    imageUrl: 'https://images.unsplash.com/photo-1581094288338-2314dddb7ecc?auto=format&fit=crop&q=80&w=1200',
    icon: 'Zap',
    accentColor: '#f56300',
    link: '#/pilares#academia-do-gas'
  }
];

export const MOCK_ARTICLES: Article[] = [
  {
    id: '1',
    title: 'O Futuro da Educação Híbrida',
    pillarId: 'prof-paulo',
    category: 'Educação',
    excerpt: 'Como a tecnologia está moldando a nova sala de aula e o papel do mentor.',
    content: `...`,
    date: '2024-05-15',
    imageUrl: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&q=80&w=1200'
  },
  {
    id: '2',
    title: 'Ciclos Imobiliários em 2024',
    pillarId: 'consultoria-imobiliaria',
    category: 'Mercado',
    excerpt: 'Análise profunda sobre onde investir nas grandes capitais brasileiras.',
    content: `...`,
    date: '2024-05-10',
    imageUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1200'
  },
  {
    id: '3',
    title: 'A Economia da Longevidade',
    pillarId: '4050oumais',
    category: 'Carreira',
    excerpt: 'Por que o público sênior é a nova fronteira do consumo inteligente.',
    content: `...`,
    date: '2024-05-08',
    imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=1200'
  }
];

export const MOCK_COURSES: Course[] = [
  { 
    id: 'c1', 
    name: 'Master em Investimento Imobiliário', 
    description: 'O guia definitivo para quem deseja construir um portfólio sólido e lucrativo.',
    imageUrl: 'https://images.unsplash.com/photo-1460472178825-e51c062365d3?auto=format&fit=crop&q=80&w=800',
    category: 'Imobiliário'
  },
  { 
    id: 'c2', 
    name: 'Metodologia Prof. Paulo', 
    description: 'Transforme seu conhecimento em aulas que engajam e mentorias que entregam resultados.',
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800',
    category: 'Educação'
  },
  { 
    id: 'c3', 
    name: 'Segurança no Setor de Gás', 
    description: 'Especialize sua equipe e evite acidentes com o treinamento padrão ouro da Academia do Gás.',
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800',
    category: 'Energia'
  }
];

export const MOCK_BOOKS: Book[] = [
  {
    id: 'b1',
    title: 'A Bíblia da Revenda de Gás',
    description: 'Tudo o que você precisa saber para gerir uma revenda de sucesso com lucro e segurança.',
    imageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800',
    buyUrl: '#'
  },
  {
    id: 'b2',
    title: 'O Novo Investidor Imobiliário',
    description: 'Como navegar pelos ciclos econômicos e encontrar oportunidades escondidas no mercado brasileiro.',
    imageUrl: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=800',
    buyUrl: '#'
  }
];

export const MOCK_RESOURCES: Resource[] = [
  { id: 'r1', name: 'Simulador de Viabilidade Imobiliária', category: 'Planilhas', type: 'EXCEL', size: '2.4 MB', url: '#' },
  { id: 'r2', name: 'Guia de Longevidade Ativa 2024', category: 'E-books', type: 'PDF', size: '15.8 MB', url: '#' }
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
