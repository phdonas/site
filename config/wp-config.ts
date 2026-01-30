
/**
 * Configurações de conexão com o WordPress Headless
 */
export const WP_CONFIG = {
  // AllOrigins /get é o mais robusto para contornar bloqueios de segurança em modo preview
  CORS_PROXY: 'https://api.allorigins.win/get?url=', 
  
  // URL base da API do seu WordPress
  BASE_URL: 'https://phdonassolo.com/wp-json/wp/v2',
  
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
