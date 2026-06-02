import React from 'react';
import { useSiteConfig } from '../contexts/SiteConfigContext';

const Hero: React.FC = () => {
  const { config } = useSiteConfig();
  
  const heroStyle = config.hero.backgroundImage 
    ? { backgroundImage: `url(${config.hero.backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } 
    : { backgroundColor: 'white' };

  return (
    <section className="pt-32 pb-20 px-6 text-center relative min-h-[70vh] flex items-center" style={heroStyle}>
      {config.hero.backgroundImage && <div className="absolute inset-0 bg-white/85 backdrop-blur-[2px]"></div>}
      
      <div className="max-w-4xl mx-auto relative z-10 w-full">
        <h2 className="text-xl font-semibold text-orange-500 mb-2">{config.hero.tag}</h2>
        <h1 
          className="text-5xl md:text-7xl font-bold tracking-tight mb-6"
          dangerouslySetInnerHTML={{ __html: config.hero.title.replace(/\n/g, '<br />') }}
        ></h1>
        <p className="text-xl md:text-2xl text-gray-800 font-medium mb-10 max-w-2xl mx-auto leading-relaxed">
          {config.hero.subtitle}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <a 
            href={config.hero.buttonLink || "#/pilares"} 
            className="bg-blue-600 text-white px-8 py-3 rounded-full text-lg font-medium hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg shadow-blue-500/30"
          >
            {config.hero.buttonText || "Explorar Conteúdo"}
          </a>
          <a 
            href="#/livros" 
            className="apple-link text-lg font-medium group"
          >
            Ver Livros e Cursos <span className="inline-block transform group-hover:translate-x-1 transition-transform">→</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
