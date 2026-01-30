
import React, { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import PillarGrid from '../components/PillarGrid';
import ArticleGallery from '../components/ArticleGallery';
import ServicesSection from '../components/ServicesSection';
import LeadForm from '../components/LeadForm';
import { DataService } from '../services/dataService';
import { X, Play } from 'lucide-react';

const HomePage: React.FC = () => {
  const [videos, setVideos] = useState<any[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<any | null>(null);
  const [loadingVideos, setLoadingVideos] = useState(true);

  useEffect(() => {
    const loadVideos = async () => {
      setLoadingVideos(true);
      const data = await DataService.getVideos(4); // Apenas 4 vídeos para rapidez extrema
      setVideos(data);
      setLoadingVideos(false);
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
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="max-w-xl">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Aulas Curtas & Insights</h2>
              <p className="text-gray-400 text-lg font-medium">Conteúdo visual direto ao ponto para sua evolução.</p>
            </div>
            <a href="#/artigos" className="text-blue-500 font-bold flex items-center gap-2 hover:underline">
              Ver todos os vídeos <Play size={16} />
            </a>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {loadingVideos ? (
              [...Array(4)].map((_, i) => (
                <div key={i} className="aspect-[9/16] bg-gray-900 rounded-[32px] animate-pulse"></div>
              ))
            ) : videos.length > 0 ? videos.map((video) => (
              <div 
                key={video.id} 
                onClick={() => setSelectedVideo(video)}
                className="aspect-[9/16] bg-gray-900 rounded-[32px] overflow-hidden relative group cursor-pointer border border-white/5 hover:border-white/20 transition-all"
              >
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
                Publique posts no seu WP com a categoria 'videos' para vê-los aqui.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Video Modal Player */}
      {selectedVideo && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-10">
          <div 
            className="absolute inset-0 bg-black/95 backdrop-blur-2xl" 
            onClick={() => setSelectedVideo(null)}
          ></div>
          <div className="relative w-full max-w-4xl bg-[#1c1c1e] rounded-[40px] overflow-hidden shadow-2xl border border-white/10 animate-in fade-in zoom-in duration-300">
            <button 
              onClick={() => setSelectedVideo(null)}
              className="absolute top-6 right-6 z-10 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
            >
              <X size={24} />
            </button>
            <div className="p-6 md:p-12">
              <h3 className="text-2xl font-bold mb-8 pr-12">{selectedVideo.title}</h3>
              <div 
                className="wp-video-container aspect-video rounded-3xl overflow-hidden bg-black flex items-center justify-center"
                dangerouslySetInnerHTML={{ __html: selectedVideo.content }}
              />
            </div>
          </div>
        </div>
      )}

      <ArticleGallery limit={4} />
      <LeadForm />
    </main>
  );
};

export default HomePage;
