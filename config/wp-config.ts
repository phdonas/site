
/**
 * Configurações de conexão com o WordPress Headless
 */
export const WP_CONFIG = {
  // Garantir que a URL termina sem barra para facilitar concatenação
  BASE_URL: 'https://www.phdonassolo.com/wordpress',
  
  ENDPOINTS: {
    POSTS: '/posts',
    MEDIA: '/media',
    CATEGORIES: '/categories',
    COURSES: '/cursos', 
    BOOKS: '/livros'
  },
  
  USE_LIVE_DATA: true 
};
