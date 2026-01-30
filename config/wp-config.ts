
/**
 * Configurações de conexão com o WordPress Headless
 */
export const WP_CONFIG = {
  // URL base limpa do site (sem wp-json, pois o DataService tentará múltiplos caminhos)
  BASE_URL: 'https://phdonassolo.com',
  
  ENDPOINTS: {
    POSTS: '/posts',
    MEDIA: '/media',
    CATEGORIES: '/categories',
    COURSES: '/cursos', 
    BOOKS: '/livros'
  },
  
  // Define se o app deve tentar buscar dados reais ou usar apenas exemplos
  USE_LIVE_DATA: true 
};
