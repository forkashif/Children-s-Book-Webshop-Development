import React, { useState } from 'react';
import { X } from 'lucide-react';

interface NoticeBannerProps {
  text?: string;
}

export const NoticeBanner: React.FC<NoticeBannerProps> = ({ 
  text = "Orders over €45 include tracked shipping to Ireland, the UK, Europe, and North America." 
}) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-[#EFECE4] border-b border-[#E4DFD5] text-[#17181C] text-xs py-2 px-4 relative z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="w-full text-center font-medium tracking-tight">
          <span className="truncate">{text}</span>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="text-[#686C78] hover:text-[#17181C] p-1 transition-colors shrink-0"
          aria-label="Dismiss notice"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

