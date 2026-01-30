
import React from 'react';
import { User, Home, TrendingUp, Zap } from 'lucide-react';
import { Pillar, Article, Course, Resource } from './types';

export const PILLARS: Pillar[] = [
  {
    id: 'prof-paulo',
    title: 'Prof. Paulo',
    description: 'Educação e mentoria acadêmica de alta performance para profissionais modernos.',
    icon: 'User',
    accentColor: '#0071e3',
    link: '#/pillar/prof-paulo'
  },
  {
    id: 'consultoria-imobiliaria',
    title: 'Consultor Imobiliário',
    description: 'Estratégias de investimento e curadoria imobiliária com foco em rentabilidade.',
    icon: 'Home',
    accentColor: '#ac39ff',
    link: '#/pillar/consultoria'
  },
  {
    id: '4050oumais',
    title: '4050oumais',
    description: 'Longevidade produtiva e novos horizontes para quem está no auge da experiência.',
    icon: 'TrendingUp',
    accentColor: '#ff3030',
    link: '#/pillar/4050oumais'
  },
  {
    id: 'academia-do-gas',
    title: 'Academia do Gás',
    description: 'Treinamento especializado para o setor de energia e GLP.',
    icon: 'Zap',
    accentColor: '#f56300',
    link: '#/pillar/academia-gas'
  }
];

export const MOCK_ARTICLES: Article[] = [
  {
    id: '1',
    title: 'O Futuro da Educação Híbrida',
    pillarId: 'prof-paulo',
    category: 'Educação',
    excerpt: 'Como a tecnologia está moldando a nova sala de aula e o papel do mentor.',
    content: 'Full content here...',
    date: '2024-05-15',
    imageUrl: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '2',
    title: 'Ciclos Imobiliários em 2024',
    pillarId: 'consultoria-imobiliaria',
    category: 'Mercado',
    excerpt: 'Análise profunda sobre onde investir nas grandes capitais brasileiras.',
    content: 'Full content here...',
    date: '2024-05-10',
    imageUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '3',
    title: 'A Economia da Longevidade',
    pillarId: '4050oumais',
    category: 'Carreira',
    excerpt: 'Por que o público sênior é a nova fronteira do consumo inteligente.',
    content: 'Full content here...',
    date: '2024-05-08',
    imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '4',
    title: 'Segurança no Manuseio de GLP',
    pillarId: 'academia-do-gas',
    category: 'Técnico',
    excerpt: 'Normas fundamentais e boas práticas para revendas de gás.',
    content: 'Full content here...',
    date: '2024-04-22',
    imageUrl: 'https://images.unsplash.com/photo-1581094288338-2314dddb7ecc?auto=format&fit=crop&q=80&w=800'
  }
];

export const MOCK_RESOURCES: Resource[] = [
  { id: 'r1', name: 'Simulador de Viabilidade Imobiliária', category: 'Planilhas', type: 'EXCEL', size: '2.4 MB', url: '#' },
  { id: 'r2', name: 'Guia de Longevidade Ativa 2024', category: 'E-books', type: 'PDF', size: '15.8 MB', url: '#' },
  { id: 'r3', name: 'Checklist para Revendedores de Gás', category: 'Checklists', type: 'WORD', size: '450 KB', url: '#' },
  { id: 'r4', name: 'Template de Mentoria Profissional', category: 'Guias', type: 'PDF', size: '1.2 MB', url: '#' },
];

export const MOCK_COURSES: Course[] = [
  { id: 'c1', name: 'Master em Investimento Imobiliário' },
  { id: 'c2', name: 'Metodologia Prof. Paulo' },
  { id: 'c3', name: 'Segurança no Setor de Gás' }
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
