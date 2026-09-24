import React from 'react';
import { ChevronRight } from 'lucide-react';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  count?: number;
  actionText?: string;
  onAction?: () => void;
  icon?: React.ElementType;
  badge?: string;
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  count,
  actionText,
  onAction,
  icon: Icon,
  badge,
  className = '',
}) => {
  return (
    <div className={`flex items-baseline justify-between px-0.5 pt-1.5 ${className}`}>
      <div className="space-y-0.5 min-w-0 pr-2">
        <div className="flex items-center space-x-2">
          {Icon && <Icon className="w-4 h-4 text-[#dfb76c] flex-shrink-0" />}
          <h2 className="font-serif text-[17px] font-medium tracking-tight text-white/95 truncate">
            {title}
          </h2>
          {count !== undefined && (
            <span className="text-[11px] font-mono text-stone-400">
              ({count})
            </span>
          )}
          {badge && (
            <span className="px-2 py-0.5 rounded-full bg-[#dfb76c]/15 text-[#dfb76c] text-[9px] font-mono font-medium uppercase tracking-wider border border-[#dfb76c]/30 shadow-sm">
              {badge}
            </span>
          )}
        </div>
        {subtitle && (
          <p className="text-[11px] text-stone-400 font-light truncate tracking-wide">
            {subtitle}
          </p>
        )}
      </div>

      {actionText && onAction && (
        <button
          onClick={onAction}
          className="text-[11px] font-medium tracking-wide text-[#dfb76c] hover:text-[#f3cf7a] transition-all flex items-center flex-shrink-0 active:scale-95 group"
        >
          <span>{actionText}</span>
          <ChevronRight className="w-3.5 h-3.5 ml-0.5 transform group-hover:translate-x-0.5 transition-transform" />
        </button>
      )}
    </div>
  );
};
