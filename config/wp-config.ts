
/**
 * Configurações de conexão com o WordPress Headless
 */
export const WP_CONFIG = {
  BASE_URL: 'https://www.phdonassolo.com/wp-json/wp/v2',
  
  ENDPOINTS: {
    POSTS: '/posts',
    MEDIA: '/media',
    CATEGORIES: '/categories',
    COURSES: '/cursos', 
    BOOKS: '/livros'
  },
  
  USE_LIVE_DATA: true 
};
