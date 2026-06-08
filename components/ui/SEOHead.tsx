import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}

const SITE_URL = 'https://www.phdonassolo.com';

const DEFAULT = {
  title: 'Prof. Paulo H. Donassolo — Mentoria, Consultoria e Cursos',
  description: 'Mais de 25 anos de gestão comercial e 20 anos em sala de aula. Mentoria, consultoria e cursos para gestores e equipes comerciais.',
  image: `${SITE_URL}/og-image.jpg`,
  url: SITE_URL,
};

const SEOHead: React.FC<SEOHeadProps> = ({ title, description, image, url }) => {
  const finalTitle = title || DEFAULT.title;
  const finalDescription = description || DEFAULT.description;
  const finalImage = image || DEFAULT.image;
  const finalUrl = url || DEFAULT.url;

  return (
    <Helmet>
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:image" content={finalImage} />
      <meta property="og:url" content={finalUrl} />
      <meta name="twitter:card" content="summary_large_image" />
    </Helmet>
  );
};

export default SEOHead;
