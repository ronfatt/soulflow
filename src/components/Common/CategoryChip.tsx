import React from 'react';

interface CategoryChipProps {
  label: string;
  icon?: React.ElementType;
  isActive: boolean;
  onClick: () => void;
  count?: number;
  className?: string;
}

export const CategoryChip: React.FC<CategoryChipProps> = ({
  label,
  icon: Icon,
  isActive,
  onClick,
  count,
  className = '',
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3.5 py-2 rounded-2xl text-xs font-medium whitespace-nowrap transition-all duration-300 flex items-center space-x-1.5 border active:scale-95 ${
        isActive
          ? 'bg-gradient-to-r from-[#dfb76c] to-[#f3cf7a] text-[#0a0c16] font-semibold border-transparent shadow-gold-glow'
          : 'bg-[#121528] border-white/5 text-stone-300 hover:text-white hover:border-white/15'
      } ${className}`}
    >
      {Icon && <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#0a0c16]' : 'text-[#dfb76c]'}`} />}
      <span>{label}</span>
      {count !== undefined && (
        <span
          className={`text-[10px] px-1.5 py-0.2 rounded-full ${
            isActive ? 'bg-black/20 text-[#0a0c16]' : 'bg-white/10 text-stone-400'
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );
};
