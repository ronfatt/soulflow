import React, { useState, useEffect } from 'react';
import { 
  ChevronDown, 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Repeat, 
  Repeat1, 
  Shuffle, 
  Heart, 
  Download, 
  Share2, 
  Moon, 
  Volume2, 
  VolumeX, 
  Crown, 
  Sparkles, 
  Wind,
  Waves,
  Flame,
  Trees,
  CloudRain,
  Bell
} from 'lucide-react';
import { useAudio } from '../../context/AudioContext';
import { useApp } from '../../context/AppContext';
import { audioEngine } from '../../utils/audioEngine';

export const FullScreenPlayer: React.FC = () => {
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
    isPlayerOpen, 
    sleepTimerRemaining, 
    togglePlay, 
    seek, 
    nextTrack, 
    prevTrack, 
    cycleRepeatMode, 
    toggleShuffle, 
    setVolume, 
    toggleMute, 
    setSleepTimerMinutes, 
    closePlayer 
  } = useAudio();

  const { 
    favorites, 
    toggleFavorite, 
    downloads, 
    toggleDownload, 
    showToast, 
    openMentorDetail, 
    mentors,
    t,
    language
  } = useApp();

  const [showSleepModal, setShowSleepModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showAmbientModal, setShowAmbientModal] = useState(false);
  const [isBreathGuideActive, setIsBreathGuideActive] = useState(false);
  const [breathMode, setBreathMode] = useState<'4-7-8' | 'box' | 'calm'>('4-7-8');
  const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');

  // Ambient sound layering state
  const [ambientLayers, setAmbientLayers] = useState({
    rain: { active: true, volume: 40, name: '午夜细雨', icon: CloudRain },
    ocean: { active: false, volume: 50, name: '纯净浪潮', icon: Waves },
    fire: { active: false, volume: 30, name: '暮色暖柴', icon: Flame },
    forest: { active: false, volume: 45, name: '深山松涛', icon: Trees },
    bowl: { active: true, volume: 35, name: '水晶颂钵', icon: Bell },
  });

  // Connect to real acoustic ambient generator
  useEffect(() => {
    if (!isPlaying) {
      Object.keys(ambientLayers).forEach(k => {
        const engineKey = k === 'ocean' ? 'waves' : (k === 'forest' ? 'wind' : k);
        audioEngine.setAmbientLayer(engineKey, 0);
      });
      return;
    }
    Object.entries(ambientLayers).forEach(([key, item]) => {
      const engineKey = key === 'ocean' ? 'waves' : (key === 'forest' ? 'wind' : key);
      audioEngine.setAmbientLayer(engineKey, item.active ? item.volume : 0);
    });
  }, [ambientLayers, isPlaying]);

  // Dynamic Breathing Cycle based on Selected Mode
  useEffect(() => {
    if (!isBreathGuideActive || !isPlaying) return;

    let timeout: ReturnType<typeof setTimeout>;

    const runCycle = () => {
      setBreathPhase('Inhale');
      const inhaleTime = 4000;
      
      timeout = setTimeout(() => {
        if (breathMode === 'calm') {
          setBreathPhase('Exhale');
          timeout = setTimeout(runCycle, 6000);
        } else if (breathMode === '4-7-8') {
          setBreathPhase('Hold');
          timeout = setTimeout(() => {
            setBreathPhase('Exhale');
            timeout = setTimeout(runCycle, 8000);
          }, 7000);
        } else {
          // box
          setBreathPhase('Hold');
          timeout = setTimeout(() => {
            setBreathPhase('Exhale');
            timeout = setTimeout(() => {
              setBreathPhase('Hold');
              timeout = setTimeout(runCycle, 4000);
            }, 4000);
          }, 4000);
        }
      }, inhaleTime);
    };

    runCycle();
    return () => clearTimeout(timeout);
  }, [isBreathGuideActive, isPlaying, breathMode]);

  if (!isPlayerOpen || !currentTrack) return null;

  const isFav = favorites.includes(currentTrack.id);
  const isDownloaded = downloads.includes(currentTrack.id);

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

  const handleMentorClick = () => {
    if (currentTrack.mentorId) {
      const mentor = mentors.find(m => m.id === currentTrack.mentorId);
      if (mentor) {
        closePlayer();
        openMentorDetail(mentor);
      }
    }
  };

  const getBreathLabel = () => {
    if (language === 'zh') {
      if (breathPhase === 'Inhale') return '吸 气';
      if (breathPhase === 'Hold') return '屏 息';
      return '呼 气';
    }
    return breathPhase;
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#05070e] text-[#f7f5f0] select-none overflow-y-auto no-scrollbar animate-fade-in">
      {/* Background cinematic aura */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-30 blur-3xl scale-125 transition-all duration-1000"
        style={{
          backgroundImage: `url(${currentTrack.coverUrl})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
        }}
      />
      <div className="fixed inset-0 bg-gradient-to-b from-[#05070e]/85 via-[#090b17]/92 to-[#05070e] pointer-events-none" />

      {/* Main Container */}
      <div className="relative z-10 flex flex-col justify-between min-h-screen px-6 py-6 max-w-md mx-auto w-full">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between pt-1">
          <button 
            onClick={closePlayer}
            className="w-10 h-10 rounded-full bg-white/[0.06] hover:bg-white/10 active:scale-90 flex items-center justify-center text-stone-300 hover:text-white transition-all"
            aria-label="Minimize"
          >
            <ChevronDown className="w-5 h-5" />
          </button>

          <div className="text-center">
            <span className="text-[10px] uppercase tracking-widest text-[#dfb76c] font-semibold font-mono block">
              {t('nowSanctuary')}
            </span>
            <span className="text-xs text-stone-300 capitalize flex items-center justify-center space-x-1 mt-0.5 font-light">
              <span>{currentTrack.categoryLabel}</span>
              {currentTrack.tier !== 'free' && (
                <Crown className="w-3 h-3 text-[#dfb76c] inline ml-1 fill-[#dfb76c]" />
              )}
            </span>
          </div>

          <div className="flex items-center space-x-1.5">
            {/* Mindful Breath Guide Toggle */}
            <button
              onClick={() => {
                setIsBreathGuideActive(!isBreathGuideActive);
                showToast(isBreathGuideActive ? '已退出呼吸引导' : '已开启深长身心呼吸引导');
              }}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                isBreathGuideActive ? 'bg-[#dfb76c] text-[#0a0c16] shadow-gold-glow' : 'bg-white/[0.06] text-stone-300'
              }`}
              title={t('mindfulBreathGuide')}
            >
              <Wind className="w-4 h-4" />
            </button>

            {/* Sleep Timer button */}
            <button 
              onClick={() => setShowSleepModal(true)}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                sleepTimerRemaining ? 'bg-[#dfb76c]/20 text-[#dfb76c] border border-[#dfb76c]/40' : 'bg-white/[0.06] text-stone-300 hover:text-white'
              }`}
              aria-label={t('sleepTimerTitle')}
            >
              <Moon className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Large Album Artwork with Meditative Respiration Glow */}
        <div className="my-auto py-4 flex flex-col items-center">
          <div className="relative">
            {/* Mindful breathing aura halo */}
            <div className={`w-64 h-64 sm:w-72 sm:h-72 rounded-[36px] overflow-hidden shadow-2xl border border-white/10 relative ${
              isPlaying ? 'animate-breath' : ''
            }`}>
              <img 
                src={currentTrack.coverUrl} 
                alt={currentTrack.title}
                className="w-full h-full object-cover"
              />

              {/* Breath Guide HUD Overlay with Multi-Mode Switcher */}
              {isBreathGuideActive && (
                <div className="absolute inset-0 bg-black/65 backdrop-blur-md flex flex-col items-center justify-between p-4 animate-fade-in z-20">
                  {/* Mode Pill Switcher */}
                  <div className="flex items-center space-x-1 bg-black/50 p-1 rounded-full border border-white/10 text-[10px] font-mono">
                    <button
                      onClick={() => setBreathMode('4-7-8')}
                      className={`px-2.5 py-0.5 rounded-full transition-all ${breathMode === '4-7-8' ? 'bg-[#dfb76c] text-[#0a0c16] font-bold' : 'text-stone-300'}`}
                    >
                      4-7-8 助眠
                    </button>
                    <button
                      onClick={() => setBreathMode('box')}
                      className={`px-2.5 py-0.5 rounded-full transition-all ${breathMode === 'box' ? 'bg-[#dfb76c] text-[#0a0c16] font-bold' : 'text-stone-300'}`}
                    >
                      箱式平衡
                    </button>
                    <button
                      onClick={() => setBreathMode('calm')}
                      className={`px-2.5 py-0.5 rounded-full transition-all ${breathMode === 'calm' ? 'bg-[#dfb76c] text-[#0a0c16] font-bold' : 'text-stone-300'}`}
                    >
                      4-6 舒缓
                    </button>
                  </div>

                  {/* Pulsing Orb */}
                  <div className={`w-32 h-32 rounded-full border-2 border-[#dfb76c] flex items-center justify-center transition-all duration-1000 ${
                    breathPhase === 'Inhale' 
                      ? 'scale-125 bg-[#dfb76c]/25 shadow-[0_0_40px_rgba(223,183,108,0.4)]' 
                      : breathPhase === 'Hold' 
                      ? 'scale-115 bg-purple-500/25 shadow-[0_0_35px_rgba(165,153,224,0.3)]' 
                      : 'scale-90 bg-transparent'
                  }`}>
                    <span className="font-serif text-lg font-medium text-white tracking-widest">
                      {getBreathLabel()}
                    </span>
                  </div>

                  <span className="text-[11px] text-stone-300 font-light">
                    {t('breathingSubtitle')}
                  </span>
                </div>
              )}
            </div>

            {/* Acoustic frequency indicator badge */}
            <div className="absolute -bottom-3 inset-x-0 flex justify-center">
              <span className="px-3 py-1 rounded-full bg-[#12162d]/90 backdrop-blur-md border border-white/10 text-[10px] text-[#f5e4b8] font-mono tracking-wider shadow-lg flex items-center space-x-1.5">
                <Sparkles className="w-3 h-3 text-[#dfb76c]" />
                <span>{t('harmonicBath')}</span>
              </span>
            </div>
          </div>

          {/* Title & Artist */}
          <div className="mt-7 text-center max-w-xs">
            <h2 className="font-serif text-xl font-medium tracking-tight text-white leading-snug">
              {currentTrack.title}
            </h2>
            <button
              onClick={handleMentorClick}
              className="text-xs text-[#a599e0] hover:text-[#c4b5fd] font-medium mt-1.5 transition-colors underline-offset-4 hover:underline inline-block"
            >
              {currentTrack.artistOrMentor}
            </button>
          </div>
        </div>

        {/* Bottom Playback Section */}
        <div className="space-y-6 pb-3">
          {/* Scrubber Timeline */}
          <div className="space-y-1.5">
            <div className="relative flex items-center">
              <input
                type="range"
                min="0"
                max="100"
                value={progress || 0}
                onChange={handleSeekChange}
                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#dfb76c] focus:outline-none"
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-stone-400 font-mono">
              <span>{formatTime(currentTime)}</span>
              <span>-{formatTime(Math.max(0, duration - currentTime))}</span>
            </div>
          </div>

          {/* Subtle Meditative Waveform Ambient Visualizer */}
          <div className="flex items-center justify-center space-x-1 h-6 my-1">
            {[45, 70, 90, 60, 100, 80, 50, 85, 95, 65, 75, 55, 90, 70, 85, 60, 80, 45, 70, 85, 55, 65, 40].map((h, i) => (
              <span
                key={i}
                className={`w-1 rounded-full transition-all duration-300 ${
                  isPlaying 
                    ? 'bg-gradient-to-t from-[#dfb76c] to-[#a599e0]' 
                    : 'bg-white/10'
                }`}
                style={{
                  height: isPlaying ? `${Math.max(20, Math.round(h * ((i % 2 === 0 ? Math.sin(currentTime * 2 + i) : Math.cos(currentTime * 1.5 + i)) * 0.35 + 0.65)))}%` : '15%',
                }}
              />
            ))}
          </div>

          {/* Primary Controls Row */}
          <div className="flex items-center justify-between px-2">
            <button
              onClick={toggleShuffle}
              className={`p-2.5 rounded-full transition-colors ${
                shuffleMode ? 'text-[#dfb76c] bg-[#dfb76c]/15' : 'text-stone-400 hover:text-white'
              }`}
              title={shuffleMode ? 'Shuffle active' : 'Shuffle off'}
              aria-label="Shuffle"
            >
              <Shuffle className="w-4 h-4" />
            </button>

            <button
              onClick={prevTrack}
              className="p-3 text-stone-300 hover:text-white active:scale-90 transition-transform"
              aria-label="Previous"
            >
              <SkipBack className="w-6 h-6 fill-current" />
            </button>

            {/* Play/Pause Button with Golden Pulse Ring */}
            <button
              onClick={togglePlay}
              className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#dfb76c] to-[#f3cf7a] text-[#0a0c16] flex items-center justify-center shadow-gold-glow hover:scale-105 active:scale-95 transition-transform"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="w-7 h-7 fill-current" />
              ) : (
                <Play className="w-7 h-7 fill-current ml-1" />
              )}
            </button>

            <button
              onClick={nextTrack}
              className="p-3 text-stone-300 hover:text-white active:scale-90 transition-transform"
              aria-label="Next"
            >
              <SkipForward className="w-6 h-6 fill-current" />
            </button>

            <button
              onClick={cycleRepeatMode}
              className={`p-2.5 rounded-full transition-colors ${
                repeatMode !== 'off' ? 'text-[#dfb76c] bg-[#dfb76c]/15' : 'text-stone-400 hover:text-white'
              }`}
              title={`Repeat: ${repeatMode}`}
              aria-label="Repeat"
            >
              {repeatMode === 'one' ? <Repeat1 className="w-4 h-4" /> : <Repeat className="w-4 h-4" />}
            </button>
          </div>

          {/* Action Tools Row: Favorite, Sleep Timer, Ambient Mixer, Download, Share */}
          <div className="flex items-center justify-around pt-3 border-t border-white/[0.06]">
            <button
              onClick={() => toggleFavorite(currentTrack.id)}
              className="flex flex-col items-center space-y-1 text-stone-400 hover:text-white transition-colors p-2 active:scale-90"
            >
              <Heart className={`w-5 h-5 ${isFav ? 'text-[#dfb76c] fill-[#dfb76c]' : ''}`} />
              <span className="text-[10px]">{t('favoriteAction')}</span>
            </button>

            {/* Ambient Soundscapes Mixer */}
            <button
              onClick={() => setShowAmbientModal(true)}
              className="flex flex-col items-center space-y-1 text-stone-400 hover:text-[#dfb76c] transition-colors p-2 active:scale-90"
            >
              <div className="relative">
                <Waves className="w-5 h-5" />
                <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-[#dfb76c] animate-pulse" />
              </div>
              <span className="text-[10px]">{language === 'zh' ? '自然伴音' : 'Ambience'}</span>
            </button>

            <button
              onClick={() => setShowSleepModal(true)}
              className={`flex flex-col items-center space-y-1 transition-colors p-2 active:scale-90 ${
                sleepTimerRemaining ? 'text-[#dfb76c]' : 'text-stone-400 hover:text-white'
              }`}
            >
              <Moon className="w-5 h-5" />
              <span className="text-[10px]">
                {sleepTimerRemaining ? `${Math.ceil(sleepTimerRemaining / 60)}m` : (language === 'zh' ? '定时' : 'Timer')}
              </span>
            </button>

            <button
              onClick={() => toggleDownload(currentTrack.id)}
              className="flex flex-col items-center space-y-1 text-stone-400 hover:text-white transition-colors p-2 active:scale-90"
            >
              <Download className={`w-5 h-5 ${isDownloaded ? 'text-emerald-400' : ''}`} />
              <span className="text-[10px]">{isDownloaded ? (language === 'zh' ? '已缓存' : 'Offline') : t('downloadAction')}</span>
            </button>

            <button
              onClick={() => setShowShareModal(true)}
              className="flex flex-col items-center space-y-1 text-stone-400 hover:text-white transition-colors p-2 active:scale-90"
            >
              <Share2 className="w-5 h-5" />
              <span className="text-[10px]">{t('shareAction')}</span>
            </button>
          </div>

          {/* Volume Slider */}
          <div className="flex items-center space-x-3 px-4 pt-1">
            <button onClick={toggleMute} className="text-stone-400 hover:text-white">
              {isMuted || volume === 0 ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#a599e0]"
            />
          </div>
        </div>
      </div>

      {/* Ambient Soundscapes Layering Modal */}
      {showAmbientModal && (
        <div 
          onClick={() => setShowAmbientModal(false)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-4 animate-fade-in"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm specular-card border border-white/15 rounded-3xl p-5 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-serif text-sm font-semibold text-white flex items-center space-x-2">
                <Waves className="w-4 h-4 text-[#dfb76c]" />
                <span>{t('ambientMixerTitle')}</span>
              </h3>
              <button 
                onClick={() => setShowAmbientModal(false)}
                className="text-stone-400 hover:text-white text-xs uppercase"
              >
                {language === 'zh' ? '关闭' : 'Close'}
              </button>
            </div>

            <p className="text-xs text-stone-300 font-light leading-relaxed">
              {t('ambientMixerSub')}
            </p>

            <div className="space-y-3 pt-1">
              {Object.entries(ambientLayers).map(([key, item]) => {
                const Icon = item.icon;
                return (
                  <div key={key} className="flex items-center space-x-3 p-2.5 rounded-2xl bg-white/[0.04] border border-white/5">
                    <button
                      onClick={() => {
                        setAmbientLayers(prev => ({
                          ...prev,
                          [key]: { ...item, active: !item.active }
                        }));
                        showToast(`${item.name}已${!item.active ? '开启伴音' : '关闭'}`);
                      }}
                      className={`p-2 rounded-xl transition-all ${item.active ? 'bg-[#dfb76c] text-[#0a0c16] shadow-gold-glow' : 'bg-white/5 text-stone-400'}`}
                    >
                      <Icon className="w-4 h-4" />
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className={`font-medium ${item.active ? 'text-white' : 'text-stone-400'}`}>
                          {item.name}
                        </span>
                        <span className="text-[10px] font-mono text-[#dfb76c]">
                          {item.active ? `${item.volume}%` : '关'}
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={item.active ? item.volume : 0}
                        disabled={!item.active}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          setAmbientLayers(prev => ({
                            ...prev,
                            [key]: { ...item, volume: val, active: val > 0 }
                          }));
                        }}
                        className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#dfb76c]"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Sleep Timer Picker Modal */}
      {showSleepModal && (
        <div 
          onClick={() => setShowSleepModal(false)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-4 animate-fade-in"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm specular-card border border-white/15 rounded-3xl p-5 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-serif text-sm font-semibold text-white flex items-center space-x-2">
                <Moon className="w-4 h-4 text-[#dfb76c]" />
                <span>{t('sleepTimerTitle')}</span>
              </h3>
              <button 
                onClick={() => setShowSleepModal(false)}
                className="text-stone-400 hover:text-white text-xs uppercase"
              >
                {language === 'zh' ? '关闭' : 'Close'}
              </button>
            </div>

            <p className="text-xs text-stone-300 font-light">
              {language === 'zh' ? '到达设定时间后，音量将柔和淡出直至静止，伴你安然入睡。' : 'Audio gently fades out so you can sleep undisturbed.'}
            </p>

            <div className="grid grid-cols-2 gap-2">
              {[5, 15, 30, 45, 60].map((mins) => (
                <button
                  key={mins}
                  onClick={() => {
                    setSleepTimerMinutes(mins);
                    setShowSleepModal(false);
                    showToast(language === 'zh' ? `已设置 ${mins} 分钟后停止播放` : `Timer set for ${mins}m`);
                  }}
                  className="py-2.5 px-3 rounded-xl bg-white/[0.04] hover:bg-[#dfb76c]/20 border border-white/5 hover:border-[#dfb76c]/40 text-stone-200 text-xs font-medium transition-all"
                >
                  {mins} {t('minutes')}
                </button>
              ))}
              <button
                onClick={() => {
                  setSleepTimerMinutes(null);
                  setShowSleepModal(false);
                  showToast(language === 'zh' ? '已取消定时关闭' : 'Timer cancelled');
                }}
                className="py-2.5 px-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-300 text-xs font-medium transition-all"
              >
                {t('sleepTimerCancel')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div 
          onClick={() => setShowShareModal(false)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-4 animate-fade-in"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm specular-card border border-white/15 rounded-3xl p-5 space-y-4"
          >
            <h3 className="font-serif text-sm font-semibold text-white">
              {language === 'zh' ? '分享正念声疗' : 'Share Practice'}
            </h3>
            <p className="text-xs text-stone-300 font-light">
              {language === 'zh' ? `将《${currentTrack.title}》的平静心流传递给身边的朋友：` : `Send "${currentTrack.title}" to someone who needs stillness:`}
            </p>
            <div className="p-3 bg-black/40 rounded-xl text-xs text-stone-300 font-mono truncate border border-white/10 select-all">
              https://soulflow.app/track/{currentTrack.id}
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(`https://soulflow.app/track/${currentTrack.id}`);
                setShowShareModal(false);
                showToast(language === 'zh' ? '专属试听链接已复制到剪贴板 ✨' : 'Link copied to clipboard ✨');
              }}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#dfb76c] to-[#f3cf7a] text-[#0a0c16] font-semibold text-xs shadow-gold-glow active:scale-95 transition-transform"
            >
              {language === 'zh' ? '复制分享链接' : 'Copy Link'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
