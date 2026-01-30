
import { MOCK_ARTICLES, MOCK_COURSES, MOCK_BOOKS, MOCK_RESOURCES, PILLARS } from '../constants';
import { Article, Course, Book, Resource, Pillar } from '../types';

/**
 * Este serviço é a ponte para o Headless WordPress.
 * Atualmente ele retorna dados estáticos, mas está estruturado
 * para ser substituído por chamadas `fetch('https://seu-wp.com/wp-json/...')`
 */

export const DataService = {
  // Artigos
  async getArticles(): Promise<Article[]> {
    return MOCK_ARTICLES;
  },

  async getArticleById(id: string): Promise<Article | undefined> {
    return MOCK_ARTICLES.find(a => a.id === id);
  },

  async getArticlesByPillar(pillarId: string): Promise<Article[]> {
    return MOCK_ARTICLES.filter(a => a.pillarId === pillarId);
  },

  // Cursos
  async getCourses(): Promise<Course[]> {
    return MOCK_COURSES;
  },

  async getCourseById(id: string): Promise<Course | undefined> {
    return MOCK_COURSES.find(c => c.id === id);
  },

  // Livros
  async getBooks(): Promise<Book[]> {
    return MOCK_BOOKS;
  },

  // Downloads / Recursos
  async getResources(): Promise<Resource[]> {
    return MOCK_RESOURCES;
  },

  // Pilares
  async getPillars(): Promise<Pillar[]> {
    return PILLARS;
  },

  async getPillarById(id: string): Promise<Pillar | undefined> {
    return PILLARS.find(p => p.id === id);
  }
};
