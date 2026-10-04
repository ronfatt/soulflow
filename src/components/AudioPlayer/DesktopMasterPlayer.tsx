import React from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Repeat, 
  Repeat1, 
  Shuffle, 
  Heart, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Moon, 
  Waves, 
  Wind,
  Sparkles
} from 'lucide-react';
import { useAudio } from '../../context/AudioContext';
import { useApp } from '../../context/AppContext';

export const DesktopMasterPlayer: React.FC = () => {
  const { 
    currentTrack, 
    isPlaying, 
    currentTime, 
    duration, 
    progress, 
    volume, 
    isMuted, 
    repeatMode, 
    shuffleMode, 
    sleepTimerRemaining, 
    togglePlay, 
    seek, 
    nextTrack, 
    prevTrack, 
    cycleRepeatMode, 
    toggleShuffle, 
    setVolume, 
    toggleMute, 
    openPlayer 
  } = useAudio();

  const { favorites, toggleFavorite, showToast } = useApp();

  if (!currentTrack) return null;

  const isFav = favorites.includes(currentTrack.id);

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    const targetSeconds = (val / 100) * duration;
    seek(targetSeconds);
  };

  return (
    <footer className="fixed bottom-0 inset-x-0 h-24 bg-[#080a14]/95 backdrop-blur-3xl border-t border-white/[0.08] z-50 px-6 sm:px-8 flex items-center justify-between select-none shadow-[0_-10px_40px_rgba(0,0,0,0.85)]">
      {/* Top thin luminous progress indicator line */}
      <div className="absolute top-0 inset-x-0 h-[2px] bg-white/[0.06] overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-[#a599e0] via-[#dfb76c] to-[#f3cf7a] transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* LEFT: Current Track Details */}
      <div className="flex items-center space-x-4 w-1/4 min-w-[220px]">
        <div 
          onClick={openPlayer}
          className="relative w-14 h-14 rounded-2xl overflow-hidden flex-shrink-0 cursor-pointer group shadow-xl border border-white/10"
        >
          <img 
            src={currentTrack.coverUrl} 
            alt={currentTrack.title}
            className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ${isPlaying ? 'scale-105' : 'scale-100'}`}
          />
          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Maximize2 className="w-5 h-5 text-white" />
          </div>
        </div>

        <div className="min-w-0 pr-2">
          <div className="flex items-center space-x-2">
            <h4 
              onClick={openPlayer}
              className="text-sm font-semibold text-white truncate tracking-tight hover:text-[#dfb76c] transition-colors cursor-pointer"
            >
              {currentTrack.title}
            </h4>
          </div>
          <p className="text-xs text-stone-400 truncate mt-0.5 font-light">
            {currentTrack.artistOrMentor}
          </p>
          <div className="flex items-center space-x-2 mt-1">
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#dfb76c]/15 text-[#dfb76c] font-mono font-medium border border-[#dfb76c]/30">
              {currentTrack.categoryLabel}
            </span>
          </div>
        </div>

        {/* Favorite Button */}
        <button
          onClick={() => toggleFavorite(currentTrack.id)}
          className="p-2 text-stone-400 hover:text-white transition-colors active:scale-90 flex-shrink-0"
          title={isFav ? '已收藏' : '添加收藏'}
        >
          <Heart className={`w-5 h-5 ${isFav ? 'text-[#dfb76c] fill-[#dfb76c]' : ''}`} />
        </button>
      </div>

      {/* CENTER: Playback Controls & Scrubber Timeline */}
      <div className="flex flex-col items-center justify-center max-w-xl w-2/4 px-4 space-y-1.5">
        {/* Playback Controls Row */}
        <div className="flex items-center space-x-6">
          <button
            onClick={toggleShuffle}
            className={`p-2 rounded-full transition-colors ${
              shuffleMode ? 'text-[#dfb76c] bg-[#dfb76c]/15' : 'text-stone-400 hover:text-white'
            }`}
            title={shuffleMode ? '已开启随机播放' : '随机播放'}
          >
            <Shuffle className="w-4 h-4" />
          </button>

          <button
            onClick={prevTrack}
            className="p-2 text-stone-300 hover:text-white active:scale-90 transition-transform"
            title="上一首"
          >
            <SkipBack className="w-5 h-5 fill-current" />
          </button>

          <button
            onClick={togglePlay}
            className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#dfb76c] to-[#f3cf7a] text-[#0a0c16] flex items-center justify-center shadow-gold-glow hover:scale-105 active:scale-95 transition-transform"
            title={isPlaying ? '暂停' : '播放'}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 fill-current ml-0.5" />
            )}
          </button>

          <button
            onClick={nextTrack}
            className="p-2 text-stone-300 hover:text-white active:scale-90 transition-transform"
            title="下一首"
          >
            <SkipForward className="w-5 h-5 fill-current" />
          </button>

          <button
            onClick={cycleRepeatMode}
            className={`p-2 rounded-full transition-colors ${
              repeatMode !== 'off' ? 'text-[#dfb76c] bg-[#dfb76c]/15' : 'text-stone-400 hover:text-white'
            }`}
            title={`循环模式: ${repeatMode === 'one' ? '单曲循环' : (repeatMode === 'all' ? '列表循环' : '关闭')}`}
          >
            {repeatMode === 'one' ? <Repeat1 className="w-4 h-4" /> : <Repeat className="w-4 h-4" />}
          </button>
        </div>

        {/* Scrubber Timeline */}
        <div className="w-full flex items-center space-x-3">
          <span className="text-[11px] text-stone-400 font-mono w-10 text-right">
            {formatTime(currentTime)}
          </span>

          <div className="flex-1 relative flex items-center group">
            <input
              type="range"
              min="0"
              max="100"
              value={progress || 0}
              onChange={handleSeekChange}
              className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#dfb76c] group-hover:h-1.5 transition-all"
            />
          </div>

          <span className="text-[11px] text-stone-400 font-mono w-10 text-left">
            {formatTime(duration)}
          </span>
        </div>
      </div>

      {/* RIGHT: Tools & Volume Control */}
      <div className="flex items-center justify-end space-x-4 w-1/4 min-w-[220px]">
        {/* Sleep Timer Indicator */}
        {sleepTimerRemaining && (
          <span className="text-[10px] text-[#dfb76c] bg-[#dfb76c]/15 px-2.5 py-1 rounded-full font-mono flex items-center space-x-1 border border-[#dfb76c]/30">
            <Moon className="w-3 h-3" />
            <span>{Math.ceil(sleepTimerRemaining / 60)}分后停止</span>
          </span>
        )}

        {/* Volume Control */}
        <div className="flex items-center space-x-2 w-32">
          <button 
            onClick={toggleMute} 
            className="text-stone-400 hover:text-white transition-colors"
            title={isMuted ? '取消静音' : '静音'}
          >
            {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#dfb76c]"
          />
        </div>

        {/* Expand to Cinematic Fullscreen Player */}
        <button
          onClick={openPlayer}
          className="p-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-stone-300 hover:text-white border border-white/10 transition-all active:scale-95 flex items-center space-x-1.5 text-xs font-medium"
          title="展开沉浸式全屏播放器"
        >
          <Maximize2 className="w-4 h-4 text-[#dfb76c]" />
          <span className="hidden xl:inline">全屏模式</span>
        </button>
      </div>
    </footer>
  );
};
