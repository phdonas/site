import React, { ReactNode } from 'react';

interface Props {
  num: string;
  nome: string;
  tag?: string;
  desc: string;
  entregavel?: string;
  isLast?: boolean;
  children?: ReactNode;
}

export const FaseStep: React.FC<Props> = ({ num, nome, tag, desc, entregavel, isLast }) => (
  <div className="fase-row flex items-start gap-10 py-10 border-b border-white/[0.06] last:border-b-0 relative z-[1]">
    <div className={`fase-dot flex-shrink-0 ${isLast ? 'fase-dot-last' : ''}`}>
      <span className={`fase-dot-n ${isLast ? 'fase-dot-n-last' : ''}`}>{num}</span>
    </div>
    <div className="flex-1">
      <div className="flex items-baseline gap-4 mb-3 flex-wrap">
        <span style={{ fontFamily: 'var(--fd)', fontSize: '1.5rem', fontWeight: 700, color: 'rgba(243,239,230,.95)', lineHeight: 1.1 }}>
          {nome}
        </span>
        {tag && (
          <span style={{ fontFamily: 'var(--fm)', fontSize: '.56rem', letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--gold)', fontWeight: 700 }}>
            {tag}
          </span>
        )}
      </div>
      <p style={{ fontSize: '.88rem', color: 'rgba(243,239,230,.65)', lineHeight: 1.7, marginBottom: entregavel ? '1rem' : 0 }}>
        {desc}
      </p>
      {entregavel && (
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: '.6rem',
          fontFamily: 'var(--fm)', fontSize: '.56rem', letterSpacing: '.1em', textTransform: 'uppercase',
          color: 'rgba(243,239,230,.45)', border: '1px solid rgba(243,239,230,.1)', padding: '.3rem .8rem'
        }}>
          <span style={{ color: 'var(--gold)', fontSize: '.5rem' }}>▪</span>
          {entregavel}
        </span>
      )}
    </div>
  </div>
);
