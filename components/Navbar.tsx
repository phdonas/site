import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';
import { SITE_CONFIG as STATIC_CONFIG } from '../config/site-config';
import { useSiteConfig } from '../contexts/SiteConfigContext';

interface NavbarProps {
  currentRoute?: string;
}

const Navbar: React.FC<NavbarProps> = ({ currentRoute = '#/' }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { config } = useSiteConfig();

  // Caso o config ainda não tenha carregado as páginas internas, use um fallback seguro
  const pagesConfig = config.pages || STATIC_CONFIG.pages;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Início', href: '#/' },
    { name: 'Pilares', href: '#/pilares' },
    ...(pagesConfig?.articles?.visible !== false ? [{ name: 'Artigos', href: '#/artigos' }] : []),
    ...(pagesConfig?.downloads?.visible !== false ? [{ name: 'Ferramentas', href: '#/ferramentas' }] : []),
    ...(pagesConfig?.courses?.visible !== false ? [{ name: 'Livros e Cursos', href: '#/livros' }] : []),
    { name: 'Trilhas', href: '#/trilhas' },
    ...(pagesConfig?.contact?.visible !== false ? [{ name: 'Contato', href: '#/contato' }] : []),
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="#/" className="flex items-center gap-3 group">
            <div className="w-2 h-2 bg-green-500 rounded-full group-hover:scale-110 transition-transform"></div>
            <span className="text-xl font-bold tracking-tight">PH DONASSOLO</span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-all"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:flex items-center gap-4">
            <a
              href="#/area-aluno"
              className="relative px-6 py-2.5 text-white text-sm font-bold rounded-[12px] bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-500 hover:to-teal-400 transition-all duration-300 shadow-[0_4px_20px_rgba(37,99,235,0.3)] hover:shadow-[0_4px_25px_rgba(20,184,166,0.5)] hover:-translate-y-0.5 overflow-hidden group flex items-center justify-center"
            >
              <span className="relative z-10 flex items-center gap-2">
                Área do Aluno
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-all"
                >
                  {link.name}
                </a>
              ))}
              <a
                href="#/area-aluno"
                onClick={() => setMobileMenuOpen(false)}
                className="mx-4 mt-4 px-6 py-3 bg-gradient-to-r from-blue-600 to-teal-500 text-white text-sm font-bold rounded-xl hover:from-blue-500 hover:to-teal-400 transition-all text-center shadow-lg"
              >
                Área do Aluno →
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
