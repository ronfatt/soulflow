import React from 'react';
import { Sparkles, Star, Users } from 'lucide-react';
import { Mentor } from '../../types';

interface MentorCardProps {
  mentor: Mentor;
  onSelect: (mentor: Mentor) => void;
  layout?: 'card' | 'compact' | 'featured';
}

export const MentorCard: React.FC<MentorCardProps> = ({
  mentor,
  onSelect,
  layout = 'card',
}) => {
  if (layout === 'compact') {
    return (
      <div
        onClick={() => onSelect(mentor)}
        className="group flex flex-col items-center text-center p-3 rounded-2xl bg-[#0f1224] border border-white/5 hover:border-[#dfb76c]/40 transition-all cursor-pointer active:scale-95 flex-shrink-0 w-28"
      >
        <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-white/10 group-hover:border-[#dfb76c] transition-all shadow-md mb-2">
          <img
            src={mentor.avatarUrl}
            alt={mentor.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        <h4 className="text-xs font-bold text-white truncate w-full">{mentor.name}</h4>
        <p className="text-[10px] text-stone-400 truncate w-full mt-0.5">{mentor.specialization}</p>
      </div>
    );
  }

  return (
    <div
      onClick={() => onSelect(mentor)}
      className="group relative rounded-[28px] overflow-hidden specular-card cursor-pointer shadow-xl transition-all duration-300 hover:border-[#dfb76c]/40 active:scale-[0.985]"
    >
      <div className="relative h-32 w-full overflow-hidden">
        <img
          src={mentor.coverUrl}
          alt={mentor.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e1226] via-[#0e1226]/60 to-transparent" />
      </div>

      <div className="px-4 pb-4 -mt-10 relative z-10">
        <div className="flex items-end justify-between">
          <div className="flex items-end space-x-3">
            <img
              src={mentor.avatarUrl}
              alt={mentor.name}
              className="w-14 h-14 rounded-2xl object-cover border-2 border-[#dfb76c] shadow-gold-glow"
            />
            <div className="pb-0.5 min-w-0">
              <h3 className="font-serif text-sm font-medium text-white flex items-center space-x-1 truncate">
                <span>{mentor.name}</span>
                <Sparkles className="w-3 h-3 text-[#dfb76c]" />
              </h3>
              <p className="text-[10px] text-[#a599e0] truncate font-medium">{mentor.title}</p>
            </div>
          </div>

          <div className="text-right flex-shrink-0 pl-1">
            <span className="text-[11px] font-bold text-[#dfb76c] block font-mono">★ {mentor.rating}</span>
            <span className="text-[9px] text-stone-400">
              {(mentor.followersCount / 1000).toFixed(1)}k students
            </span>
          </div>
        </div>

        <p className="text-[11px] text-stone-300 mt-2.5 line-clamp-2 leading-relaxed font-light">
          {mentor.bio}
        </p>

        <div className="mt-2.5 pt-2 border-t border-white/[0.05] flex items-center justify-between text-[10px] text-stone-400 font-mono">
          <span>Specialization:</span>
          <span className="text-[#dfb76c] font-medium truncate max-w-[170px]">{mentor.specialization}</span>
        </div>
      </div>
    </div>
  );
};
