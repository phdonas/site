import React, { ReactNode, useEffect } from 'react';

interface Props {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

export const Modal: React.FC<Props> = ({ open, onClose, children }) => {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ background: 'var(--cream)', maxWidth: 480, width: '100%', padding: '2.5rem', position: 'relative' }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: '1rem', right: '1rem',
            background: 'none', border: 'none', cursor: 'pointer',
            fontFamily: 'var(--fd)', fontSize: '1.5rem', color: 'var(--ink-3)',
            lineHeight: 1
          }}
          aria-label="Fechar"
        >×</button>
        {children}
      </div>
    </div>
  );
};
