import React from 'react';
import { PILLARS, getIcon } from '../constants';
import { useSiteConfig } from '../contexts/SiteConfigContext';

const PillarGrid: React.FC = () => {
  const { config } = useSiteConfig();

  return (
    <section className="py-24 px-6 max-w-6xl mx-auto">
      <div className="text-center mb-16 max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">{config.sections?.pillars?.title || "Pilares de Conhecimento"}</h2>
        <p className="text-gray-500 text-lg font-medium">{config.sections?.pillars?.subtitle || "Explore os temas que fundamentam nossa metodologia de ensino e consultoria."}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {PILLARS.map((pillar) => (
          <div 
            key={pillar.id}
            className="bg-white rounded-3xl p-10 card-shadow flex flex-col justify-between min-h-[400px]"
          >
            <div>
              <div 
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-8"
                style={{ backgroundColor: pillar.accentColor + '15', color: pillar.accentColor }}
              >
                {getIcon(pillar.icon)}
              </div>
              <h3 className="text-4xl font-bold mb-4">{pillar.title}</h3>
              <p className="text-lg text-gray-500 font-medium leading-relaxed">
                {pillar.description}
              </p>
            </div>
            <div className="mt-8">
              <a 
                href={`#/pilares#${pillar.id}`}
                className="inline-flex items-center text-lg font-semibold text-blue-600 hover:underline"
              >
                Saiba mais <span className="ml-1 text-2xl">›</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PillarGrid;
