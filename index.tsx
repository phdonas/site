import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

// Ponto de entrada para o preview e inicialização do sistema
const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}