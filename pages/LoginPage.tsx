import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebase';

const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      window.location.hash = '#/admin';
    } catch {
      setError('E-mail ou senha inválidos. Verifique e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ minHeight: '100vh', background: 'var(--navy)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 5vw' }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <a href="#/" style={{ fontFamily: 'var(--fd)', fontSize: '1.2rem', fontWeight: 700, color: 'rgba(243,239,230,.85)', textDecoration: 'none' }}>
            Prof. Paulo H. Donassolo
          </a>
          <div style={{ fontFamily: 'var(--fm)', fontSize: '.5rem', letterSpacing: '.18em', textTransform: 'uppercase', color: 'rgba(243,239,230,.25)', marginTop: '.5rem' }}>
            Acesso Administrativo
          </div>
        </div>

        {/* Form */}
        <div style={{ background: 'rgba(243,239,230,.04)', border: '1px solid rgba(243,239,230,.08)', padding: '3rem' }}>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="E-mail"
              required
              className="field-dark"
            />
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Senha"
              required
              className="field-dark"
            />

            {error && (
              <p style={{ fontSize: '.78rem', color: '#e57373', lineHeight: 1.5 }}>{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ marginTop: '.5rem', opacity: loading ? .6 : 1, cursor: loading ? 'not-allowed' : 'pointer', textAlign: 'center' }}
            >
              {loading ? 'Verificando...' : 'Entrar'}
            </button>
          </form>

          <div style={{ marginTop: '2rem', borderTop: '1px solid rgba(243,239,230,.06)', paddingTop: '1.5rem', textAlign: 'center' }}>
            <p style={{ fontFamily: 'var(--fm)', fontSize: '.48rem', letterSpacing: '.1em', color: 'rgba(243,239,230,.15)' }}>
              Acesso restrito a administradores
            </p>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <a href="#/" style={{ fontFamily: 'var(--fm)', fontSize: '.5rem', letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(243,239,230,.2)', textDecoration: 'none' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'rgba(243,239,230,.45)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(243,239,230,.2)')}
          >
            ← Voltar para o site
          </a>
        </div>
      </div>
    </main>
  );
};

export default LoginPage;
