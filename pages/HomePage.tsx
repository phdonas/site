
import React from 'react';
import Hero from '../components/Hero';
import PillarGrid from '../components/PillarGrid';
import ArticleGallery from '../components/ArticleGallery';
import ServicesSection from '../components/ServicesSection';
import LeadForm from '../components/LeadForm';

const HomePage: React.FC = () => {
  return (
    <main>
      <Hero />
      <PillarGrid />
      <ServicesSection />
      
      {/* Short Videos Section - Moved Up */}
      <section className="py-20 px-6 bg-black text-white overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center">Aulas Curtas & Insights</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-[9/16] bg-gray-800 rounded-3xl overflow-hidden relative group cursor-pointer">
                <img 
                  src={`https://picsum.photos/400/700?random=${i + 10}`} 
                  alt="Video thumbnail"
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
                    <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[14px] border-l-white border-b-[8px] border-b-transparent ml-1"></div>
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-sm font-semibold leading-tight">Insight #{i}: Estratégia Digital</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ArticleGallery />

      <LeadForm />
    </main>
  );
};

export default HomePage;
