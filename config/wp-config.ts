
/**
 * Configurações de conexão com o WordPress Headless
 */
export const WP_CONFIG = {
  // Se o erro 'Failed to fetch' persistir, você pode ativar o PROXY_URL
  // Exemplo de proxy público: 'https://api.allorigins.win/raw?url='
  CORS_PROXY: '', 
  
  // Certifique-se de que esta URL é exatamente a que aparece em Configurações -> Geral no seu WP
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
