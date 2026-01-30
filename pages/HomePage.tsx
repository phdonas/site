
import React, { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import PillarGrid from '../components/PillarGrid';
import ArticleGallery from '../components/ArticleGallery';
import ServicesSection from '../components/ServicesSection';
import LeadForm from '../components/LeadForm';
import { DataService } from '../services/dataService';

const HomePage: React.FC = () => {
  const [videos, setVideos] = useState<any[]>([]);

  useEffect(() => {
    const loadVideos = async () => {
      const data = await DataService.getVideos();
      setVideos(data);
    };
    loadVideos();
  }, []);

  return (
    <main>
      <Hero />
      <PillarGrid />
      <ServicesSection />
      
      {/* Dynamic Short Videos Section */}
      <section className="py-24 px-6 bg-black text-white overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Aulas Curtas & Insights</h2>
            <p className="text-gray-400 text-lg font-medium">Conteúdo rápido para quem busca evolução constante.</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {videos.length > 0 ? videos.map((video) => (
              <div key={video.id} className="aspect-[9/16] bg-gray-900 rounded-[32px] overflow-hidden relative group cursor-pointer border border-white/5 hover:border-white/20 transition-all">
                <img 
                  src={video.thumb} 
                  alt={video.title}
                  className="w-full h-full object-cover opacity-50 group-hover:opacity-70 group-hover:scale-105 transition-all duration-700"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center group-hover:scale-110 transition-transform border border-white/20">
                    <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[14px] border-l-white border-b-[8px] border-b-transparent ml-1"></div>
                  </div>
                </div>
                <div className="absolute bottom-6 left-6 right-6">
                  <p className="text-sm font-bold leading-tight drop-shadow-lg">{video.title}</p>
                </div>
              </div>
            )) : (
              <div className="col-span-full py-20 text-center text-gray-500 font-medium">
                Suba vídeos na categoria "videos" do WordPress para exibi-los aqui.
              </div>
            )}
          </div>
        </div>
      </section>

      <ArticleGallery />

      <LeadForm />
    </main>
  );
};

export default HomePage;
