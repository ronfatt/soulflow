import React from 'react';
import { Crown } from 'lucide-react';

interface PremiumBadgeProps {
  label?: string;
  size?: 'sm' | 'md';
  className?: string;
}

export const PremiumBadge: React.FC<PremiumBadgeProps> = ({ 
  label, 
  size = 'sm', 
  className = '' 
}) => {
  const isSm = size === 'sm';
  return (
    <span 
      className={`inline-flex items-center space-x-1 rounded-full font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md text-[#dfb76c] border border-[#dfb76c]/40 ${
        isSm ? 'px-1.5 py-0.5 text-[9px]' : 'px-2.5 py-1 text-[10px]'
      } ${className}`}
    >
      <Crown className={`${isSm ? 'w-2.5 h-2.5' : 'w-3 h-3'} fill-[#dfb76c]`} />
      {label && <span>{label}</span>}
    </span>
  );
};
