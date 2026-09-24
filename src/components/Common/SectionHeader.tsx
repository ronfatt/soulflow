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
    <div className={`flex items-end justify-between px-0.5 ${className}`}>
      <div className="space-y-0.5 min-w-0 pr-2">
        <div className="flex items-center space-x-2">
          {Icon && <Icon className="w-4 h-4 text-[#dfb76c] flex-shrink-0" />}
          <h2 className="text-base font-semibold text-white tracking-tight truncate">
            {title}
          </h2>
          {count !== undefined && (
            <span className="text-xs font-mono text-stone-400">
              ({count})
            </span>
          )}
          {badge && (
            <span className="px-1.5 py-0.2 rounded-full bg-[#dfb76c]/15 text-[#dfb76c] text-[9px] font-mono font-semibold uppercase tracking-wider border border-[#dfb76c]/30">
              {badge}
            </span>
          )}
        </div>
        {subtitle && (
          <p className="text-[11px] text-stone-400 font-light truncate">
            {subtitle}
          </p>
        )}
      </div>

      {actionText && onAction && (
        <button
          onClick={onAction}
          className="text-xs font-medium text-[#dfb76c] hover:text-[#f3cf7a] transition-colors flex items-center flex-shrink-0 pb-0.5"
        >
          <span>{actionText}</span>
          <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
        </button>
      )}
    </div>
  );
};
