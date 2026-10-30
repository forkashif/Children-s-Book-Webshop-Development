import React from 'react';

export const StarDivider: React.FC<{ flip?: boolean; className?: string }> = ({ className = '' }) => {
  return (
    <div className={`w-full border-t border-[#E4DFD5] ${className}`} aria-hidden="true" />
  );
};

export const LittleStarsRow: React.FC<{ className?: string }> = ({ className = '' }) => {
  return null;
};

