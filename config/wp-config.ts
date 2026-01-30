
/**
 * Configurações de conexão com o WordPress Headless
 */
export const WP_CONFIG = {
  // Agora apontando para a subpasta onde o WordPress foi movido
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
