import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

/**
 * Ponto de entrada principal. 
 * O index.html carrega este arquivo via Babel.
 */
const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}