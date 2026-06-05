import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--cream-d)' }}>
        <span style={{ fontFamily: 'var(--fm)', fontSize: '.5rem', letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--ink-3)' }}>
          Verificando autenticação...
        </span>
      </main>
    );
  }

  if (!user) {
    window.location.hash = '#/login';
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
