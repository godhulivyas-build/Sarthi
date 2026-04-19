import React from 'react';

/** Full-height V2 canvas: warm background, optional top chrome from children. */
export const V2AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen bg-[var(--saarthi-bg)] text-[var(--saarthi-on-surface)] antialiased">{children}</div>
);
