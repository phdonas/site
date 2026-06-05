import React, { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  center?: boolean;
  className?: string;
}

export const Eyebrow: React.FC<Props> = ({ children, center, className = '' }) => (
  <div className={`eyebrow ${center ? 'eyebrow-center' : ''} ${className}`}>
    {children}
  </div>
);
