
/**
 * Configurações de conexão com o WordPress Headless
 */
export const WP_CONFIG = {
  // Ativando um proxy robusto para ignorar bloqueios de CORS do servidor
  CORS_PROXY: 'https://api.allorigins.win/raw?url=', 
  
  // URL base da API do seu WordPress
  BASE_URL: 'https://phdonassolo.com/wp-json/wp/v2',
  
  ENDPOINTS: {
    POSTS: '/posts',
    MEDIA: '/media',
    CATEGORIES: '/categories',
    COURSES: '/cursos', 
    BOOKS: '/livros'
  },
  
  USE_LIVE_DATA: true 
};
