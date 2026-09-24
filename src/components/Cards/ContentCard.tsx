import React from 'react';
import { Play, Pause, Heart, Crown, Clock } from 'lucide-react';
import { Track } from '../../types';
import { useAudio } from '../../context/AudioContext';
import { useApp } from '../../context/AppContext';

interface ContentCardProps {
  track: Track;
  layout?: 'card' | 'row' | 'hero';
  onPlayList?: Track[];
}

export const ContentCard: React.FC<ContentCardProps> = ({ 
  track, 
  layout = 'card',
  onPlayList 
}) => {
  const { currentTrack, isPlaying, playTrack, togglePlay } = useAudio();
  const { favorites, toggleFavorite, user, setShowMembershipModal, canAccessPremiumContent } = useApp();

  const isCurrent = currentTrack?.id === track.id;
  const isCurrentlyPlaying = isCurrent && isPlaying;
  const isFav = favorites.includes(track.id);
  const isPremiumTrack = Boolean(track.is_premium || track.isPremium || (track.tier && track.tier !== 'free'));
  const access = canAccessPremiumContent(track.tier, 'track');
  const isLocked = !access.canAccess;

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLocked) {
      setShowMembershipModal(true);
      return;
    }
    if (isCurrent) {
      togglePlay();
    } else {
      playTrack(track, onPlayList);
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(track.id);
  };

  // Hero layout for featured spotlight
  if (layout === 'hero') {
    return (
      <div 
        onClick={handlePlayClick}
        className="group relative w-full h-64 rounded-[32px] overflow-hidden cursor-pointer shadow-2xl transition-all duration-500 active:scale-[0.98] border border-white/10"
      >
        <img 
          src={track.coverUrl} 
          alt={track.title}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
        />
        {/* Cinematic multi-stop gradient for flawless readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#060812] via-[#060812]/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#060812]/60 via-transparent to-transparent" />

        {/* Top Floating Chips */}
        <div className="absolute top-4 inset-x-4 flex items-center justify-between z-10">
          <span className="px-3 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-black/60 backdrop-blur-md text-[#dfb76c] border border-[#dfb76c]/30 flex items-center space-x-1.5 shadow-lg">
            <span className="w-1.5 h-1.5 rounded-full bg-[#dfb76c] animate-pulse" />
            <span>Featured Sound Bath</span>
          </span>

          {isPremiumTrack && (
            <span className="p-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[#dfb76c]">
              <Crown className="w-3.5 h-3.5 fill-[#dfb76c]" />
            </span>
          )}
        </div>

        {/* Bottom Metadata & Play Control */}
        <div className="absolute bottom-4 inset-x-4 flex items-end justify-between z-10">
          <div className="max-w-[75%] space-y-1">
            <span className="text-[11px] font-medium text-[#a599e0] uppercase tracking-wider block">
              {track.categoryLabel} • {track.durationFormatted}
            </span>
            <h3 className="text-lg font-bold text-white leading-snug drop-shadow-md">
              {track.title}
            </h3>
            <p className="text-xs text-stone-300 font-light truncate">
              {track.artistOrMentor}
            </p>
          </div>

          <button
            onClick={handlePlayClick}
            className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#dfb76c] to-[#f3cf7a] text-[#0a0c16] flex items-center justify-center shadow-gold-glow group-hover:scale-110 active:scale-95 transition-transform"
            aria-label={isCurrentlyPlaying ? 'Pause' : 'Play'}
          >
            {isCurrentlyPlaying ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 fill-current ml-0.5" />
            )}
          </button>
        </div>
      </div>
    );
  }

  // Row layout for lists
  if (layout === 'row') {
    return (
      <div 
        onClick={handlePlayClick}
        className={`group flex items-center justify-between p-2.5 rounded-2xl transition-all duration-300 cursor-pointer active:scale-[0.98] ${
          isCurrent 
            ? 'bg-[#181d39] border border-[#a599e0]/50 shadow-soft-glow' 
            : 'bg-[#0f1226]/80 hover:bg-[#161a35] border border-white/[0.04]'
        }`}
      >
        <div className="flex items-center space-x-3 min-w-0">
          <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 border border-white/5">
            <img 
              src={track.coverUrl} 
              alt={track.title} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
            />
            <div className={`absolute inset-0 flex items-center justify-center transition-opacity ${
              isCurrentlyPlaying ? 'bg-black/50 opacity-100' : 'bg-black/30 opacity-0 group-hover:opacity-100'
            }`}>
              {isCurrentlyPlaying ? (
                <div className="flex items-center space-x-0.5">
                  <span className="w-0.5 bg-[#dfb76c] eq-1 rounded-full"></span>
                  <span className="w-0.5 bg-[#dfb76c] eq-2 rounded-full"></span>
                  <span className="w-0.5 bg-[#dfb76c] eq-3 rounded-full"></span>
                </div>
              ) : (
                <Play className="w-4 h-4 text-white fill-white ml-0.5" />
              )}
            </div>
          </div>

          <div className="min-w-0 pr-1">
            <h4 className={`text-xs font-semibold leading-tight truncate ${isCurrent ? 'text-[#c4b5fd]' : 'text-stone-100'}`}>
              {track.title}
            </h4>
            <p className="text-[11px] text-stone-400 mt-0.5 truncate font-light">
              {track.artistOrMentor} • <span className="text-[#a599e0] font-mono">{track.durationFormatted}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-1.5 flex-shrink-0 ml-2">
          {isPremiumTrack && (
            <Crown className="w-3.5 h-3.5 text-[#dfb76c] fill-[#dfb76c]" />
          )}
          <button 
            onClick={handleFavoriteClick}
            className="p-1.5 text-stone-400 hover:text-[#dfb76c] transition-colors rounded-full"
            aria-label="Favorite"
          >
            <Heart className={`w-3.5 h-3.5 ${isFav ? 'text-[#dfb76c] fill-[#dfb76c]' : ''}`} />
          </button>
        </div>
      </div>
    );
  }

  // Primary Standard Card layout
  return (
    <div 
      onClick={handlePlayClick}
      className={`group relative flex flex-col rounded-[26px] overflow-hidden cursor-pointer transition-all duration-500 active:scale-[0.97] ${
        isCurrent 
          ? 'ring-2 ring-[#dfb76c] shadow-gold-glow bg-[#141830]' 
          : 'bg-[#0f1224] hover:bg-[#141830] border border-white/[0.06] hover:border-white/15'
      }`}
    >
      {/* Photography Cover */}
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <img 
          src={track.coverUrl} 
          alt={track.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
        />
        {/* Soft vignette overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f1224] via-transparent to-black/25" />

        {/* Top Badges */}
        <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between">
          <span className="px-2 py-0.5 rounded-full text-[9px] font-semibold tracking-wider bg-black/60 backdrop-blur-md text-stone-300 border border-white/10 uppercase">
            {track.categoryLabel}
          </span>
          {isPremiumTrack && (
            <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-black/60 backdrop-blur-md text-[#dfb76c] border border-[#dfb76c]/40 flex items-center space-x-0.5">
              <Crown className="w-2.5 h-2.5 fill-[#dfb76c]" />
              <span>PRO</span>
            </span>
          )}
        </div>

        {/* Floating Play Circle */}
        <button
          onClick={handlePlayClick}
          className={`absolute bottom-2.5 right-2.5 w-9 h-9 rounded-full flex items-center justify-center shadow-lg transition-transform duration-300 ${
            isCurrentlyPlaying
              ? 'bg-[#dfb76c] text-[#0a0c16] scale-105'
              : 'bg-white/90 text-[#0a0c16] hover:bg-white hover:scale-110 active:scale-95'
          }`}
          aria-label={isCurrentlyPlaying ? 'Pause' : 'Play'}
        >
          {isCurrentlyPlaying ? (
            <Pause className="w-3.5 h-3.5 fill-current" />
          ) : (
            <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
          )}
        </button>

        {/* Duration pill */}
        <div className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[10px] text-stone-300 font-mono flex items-center space-x-1">
          <Clock className="w-2.5 h-2.5 text-stone-400" />
          <span>{track.durationFormatted}</span>
        </div>
      </div>

      {/* Info Body */}
      <div className="p-3 flex flex-col justify-between flex-grow">
        <div>
          <h3 className={`text-xs font-semibold leading-snug line-clamp-1 ${
            isCurrent ? 'text-[#c4b5fd]' : 'text-stone-100 group-hover:text-white'
          }`}>
            {track.title}
          </h3>
          <p className="text-[11px] text-stone-400 mt-0.5 line-clamp-1 font-light">
            {track.artistOrMentor}
          </p>
        </div>

        <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-white/[0.04] text-[10px]">
          <span className="capitalize text-[#a599e0] font-medium tracking-tight">
            #{track.mood}
          </span>
          <button
            onClick={handleFavoriteClick}
            className="p-1 text-stone-400 hover:text-[#dfb76c] transition-colors"
          >
            <Heart className={`w-3.5 h-3.5 ${isFav ? 'text-[#dfb76c] fill-[#dfb76c]' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  );
};
