import React from 'react';
import { Play, Pause, ChevronUp, X } from 'lucide-react';
import { useAudio } from '../../context/AudioContext';

export const MiniPlayer: React.FC = () => {
  const { 
    currentTrack, 
    isPlaying, 
    togglePlay, 
    progress, 
    openPlayer, 
    pause 
  } = useAudio();

  if (!currentTrack) return null;

  return (
    <div 
      onClick={openPlayer}
      className="group relative mx-3.5 mb-2 rounded-2xl bg-[#12162e]/90 backdrop-blur-2xl border border-white/10 shadow-2xl p-2.5 cursor-pointer transition-all duration-300 hover:bg-[#181d3d] active:scale-[0.99] z-40 select-none"
    >
      {/* Top micro progress bar */}
      <div className="absolute top-0 inset-x-3.5 h-[2px] bg-white/[0.08] rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-[#a599e0] via-[#dfb76c] to-[#f3cf7a] transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex items-center justify-between mt-0.5 px-0.5">
        {/* Track Info & Artwork */}
        <div className="flex items-center space-x-3 min-w-0 flex-1">
          <div className="relative w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 border border-white/10 shadow-md">
            <img 
              src={currentTrack.coverUrl} 
              alt={currentTrack.title} 
              className={`w-full h-full object-cover transition-transform duration-700 ${isPlaying ? 'scale-105' : 'scale-100'}`}
            />
          </div>

          <div className="min-w-0 pr-2">
            <div className="flex items-center space-x-1.5">
              {isPlaying && (
                <div className="flex items-center space-x-0.5 flex-shrink-0">
                  <span className="w-0.5 bg-[#dfb76c] eq-1 rounded-full"></span>
                  <span className="w-0.5 bg-[#dfb76c] eq-2 rounded-full"></span>
                  <span className="w-0.5 bg-[#dfb76c] eq-3 rounded-full"></span>
                </div>
              )}
              <h4 className="text-xs font-semibold text-white truncate tracking-tight">
                {currentTrack.title}
              </h4>
            </div>
            <p className="text-[10px] text-stone-400 truncate font-light mt-0.5">
              {currentTrack.artistOrMentor} • <span className="text-[#a599e0] font-mono">{currentTrack.durationFormatted}</span>
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-1.5 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={togglePlay}
            className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#dfb76c] to-[#f3cf7a] text-[#0a0c16] flex items-center justify-center shadow-gold-glow hover:scale-105 active:scale-90 transition-transform"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className="w-3.5 h-3.5 fill-current" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
            )}
          </button>

          <button
            onClick={openPlayer}
            className="p-1.5 text-stone-400 hover:text-white transition-colors"
            aria-label="Expand player"
          >
            <ChevronUp className="w-4 h-4" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              pause();
            }}
            className="p-1 text-stone-500 hover:text-stone-300 transition-colors"
            aria-label="Close"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
