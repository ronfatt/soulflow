import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Track, RecentlyPlayedRecord } from '../types';
import { audioEngine } from '../utils/audioEngine';
import { useApp } from './AppContext';
import { TRACKS } from '../data/mockData';

export type RepeatMode = 'off' | 'all' | 'one';

interface AudioContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  progress: number; // 0 to 100
  volume: number;
  isMuted: boolean;
  isLooping: boolean;
  isShuffling: boolean;
  repeatMode: RepeatMode;
  shuffleMode: boolean;
  isPlayerOpen: boolean;
  queue: Track[];
  sleepTimer: number | null; // minutes or null
  sleepTimerRemaining: number | null; // seconds remaining
  recentlyPlayed: RecentlyPlayedRecord[];
  playTrack: (track: Track, queueList?: Track[], resumeProgress?: number) => void;
  togglePlay: () => void;
  pause: () => void;
  resume: () => void;
  seek: (seconds: number) => void;
  nextTrack: () => void;
  prevTrack: () => void;
  toggleLoop: () => void;
  cycleRepeatMode: () => void;
  toggleShuffle: () => void;
  setVolume: (val: number) => void;
  toggleMute: () => void;
  setSleepTimerMinutes: (minutes: number | null) => void;
  openPlayer: () => void;
  closePlayer: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { recordListeningHistory, user } = useApp();
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolumeState] = useState<number>(0.85);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>('all');
  const [shuffleMode, setShuffleMode] = useState<boolean>(false);
  const [isPlayerOpen, setIsPlayerOpen] = useState<boolean>(false);
  const [queue, setQueue] = useState<Track[]>([]);
  const [sleepTimer, setSleepTimer] = useState<number | null>(null);
  const [sleepTimerRemaining, setSleepTimerRemaining] = useState<number | null>(null);

  // Recently played with progress tracking
  const [recentlyPlayed, setRecentlyPlayed] = useState<RecentlyPlayedRecord[]>(() => {
    const saved = localStorage.getItem('soulflow_recently_played_records');
    if (saved) {
      try { return JSON.parse(saved); } catch (_) {}
    }
    // Default initial seeded items for seamless demo experience
    return [
      {
        content_id: 'd0000000-0000-0000-0000-000000000001',
        user_id: user?.id || '00000000-0000-0000-0000-000000001001',
        played_at: new Date(Date.now() - 3600000).toISOString(),
        progress: 1104, // 18:24
        duration: 1800,
        track: TRACKS[0],
      },
      {
        content_id: 'd0000000-0000-0000-0000-000000000002',
        user_id: user?.id || '00000000-0000-0000-0000-000000001001',
        played_at: new Date(Date.now() - 86400000).toISOString(),
        progress: 420,
        duration: 900,
        track: TRACKS[1],
      },
    ];
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize HTML Audio element
  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'auto';
    audioRef.current = audio;

    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      if (audio.duration && !isNaN(audio.duration)) {
        setDuration(audio.duration);
      }

      // Periodically update progress in recentlyPlayed
      if (currentTrack && audio.currentTime > 2) {
        setRecentlyPlayed(prev => {
          const existing = prev.find(p => p.content_id === currentTrack.id);
          const currentSeconds = Math.floor(audio.currentTime);
          const totalSeconds = Math.floor(audio.duration || currentTrack.durationSeconds);
          
          const updatedRecord: RecentlyPlayedRecord = {
            content_id: currentTrack.id,
            user_id: user?.id || 'user-1',
            played_at: new Date().toISOString(),
            progress: currentSeconds,
            duration: totalSeconds,
            track: currentTrack,
          };

          const filtered = prev.filter(p => p.content_id !== currentTrack.id);
          const next = [updatedRecord, ...filtered].slice(0, 20);
          localStorage.setItem('soulflow_recently_played_records', JSON.stringify(next));
          return next;
        });
      }
    };

    const onLoadedMetadata = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        setDuration(audio.duration);
      }
    };

    const onEnded = () => {
      if (repeatMode === 'one') {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      } else {
        nextTrack();
      }
    };

    const onError = () => {
      console.log('Stream note: Activating SoulFlow harmonic ambient engine fallback');
      if (currentTrack) {
        audioEngine.startHarmonicAmbient(currentTrack.mood);
      }
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);

    return () => {
      audio.pause();
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
      audioEngine.stop();
    };
  }, [repeatMode, currentTrack]);

  // Handle sleep timer countdown
  useEffect(() => {
    if (!sleepTimerRemaining || sleepTimerRemaining <= 0) return;

    const timer = setInterval(() => {
      setSleepTimerRemaining(prev => {
        if (!prev || prev <= 1) {
          pause();
          setSleepTimer(null);
          return null;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [sleepTimerRemaining]);

  const playTrack = (track: Track, queueList?: Track[], resumeProgress?: number) => {
    setCurrentTrack(track);
    setDuration(track.durationSeconds);
    const startSec = resumeProgress !== undefined ? resumeProgress : 0;
    setCurrentTime(startSec);

    if (recordListeningHistory) {
      recordListeningHistory(track.id);
    }

    if (queueList && queueList.length > 0) {
      setQueue(queueList);
    }

    // Immediately record to recentlyPlayed
    setRecentlyPlayed(prev => {
      const updatedRecord: RecentlyPlayedRecord = {
        content_id: track.id,
        user_id: user?.id || 'user-1',
        played_at: new Date().toISOString(),
        progress: startSec,
        duration: track.durationSeconds,
        track,
      };
      const filtered = prev.filter(p => p.content_id !== track.id);
      const next = [updatedRecord, ...filtered].slice(0, 20);
      localStorage.setItem('soulflow_recently_played_records', JSON.stringify(next));
      return next;
    });

    if (audioRef.current) {
      audioRef.current.src = track.audioUrl;
      audioRef.current.currentTime = startSec;
      audioRef.current.volume = isMuted ? 0 : volume;

      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            audioEngine.startHarmonicAmbient(track.mood);
          })
          .catch((err) => {
            console.log('Browser audio policy fallback:', err);
            setIsPlaying(true);
            audioEngine.startHarmonicAmbient(track.mood);
          });
      }
    }
  };

  const togglePlay = () => {
    if (!currentTrack) return;
    if (isPlaying) {
      pause();
    } else {
      resume();
    }
  };

  const pause = () => {
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
    }
    audioEngine.stop();
  };

  const resume = () => {
    if (!currentTrack) return;
    setIsPlaying(true);
    if (audioRef.current && audioRef.current.src) {
      audioRef.current.play().catch(() => {});
    }
    audioEngine.startHarmonicAmbient(currentTrack.mood);
  };

  const seek = (seconds: number) => {
    setCurrentTime(seconds);
    if (audioRef.current) {
      audioRef.current.currentTime = seconds;
    }
  };

  const nextTrack = () => {
    if (!currentTrack || queue.length === 0) return;
    const currentIndex = queue.findIndex(t => t.id === currentTrack.id);
    let nextIndex = currentIndex + 1;
    if (shuffleMode) {
      nextIndex = Math.floor(Math.random() * queue.length);
    } else if (nextIndex >= queue.length) {
      if (repeatMode === 'off') return;
      nextIndex = 0;
    }
    playTrack(queue[nextIndex], queue);
  };

  const prevTrack = () => {
    if (!currentTrack || queue.length === 0) return;
    const currentIndex = queue.findIndex(t => t.id === currentTrack.id);
    let prevIndex = currentIndex - 1;
    if (prevIndex < 0) {
      prevIndex = queue.length - 1;
    }
    playTrack(queue[prevIndex], queue);
  };

  const toggleLoop = () => {
    setRepeatMode(prev => (prev === 'one' ? 'all' : 'one'));
  };

  const cycleRepeatMode = () => {
    setRepeatMode(prev => {
      if (prev === 'off') return 'all';
      if (prev === 'all') return 'one';
      return 'off';
    });
  };

  const toggleShuffle = () => {
    setShuffleMode(prev => !prev);
  };

  const setVolume = (val: number) => {
    setVolumeState(val);
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : val;
    }
    audioEngine.setVolume(val);
  };

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (audioRef.current) {
      audioRef.current.volume = nextMuted ? 0 : volume;
    }
    if (nextMuted) {
      audioEngine.setVolume(0);
    } else {
      audioEngine.setVolume(volume);
    }
  };

  const setSleepTimerMinutes = (minutes: number | null) => {
    setSleepTimer(minutes);
    if (minutes === null) {
      setSleepTimerRemaining(null);
    } else {
      setSleepTimerRemaining(minutes * 60);
    }
  };

  const openPlayer = () => setIsPlayerOpen(true);
  const closePlayer = () => setIsPlayerOpen(false);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <AudioContext.Provider
      value={{
        currentTrack,
        isPlaying,
        currentTime,
        duration: duration || (currentTrack?.durationSeconds || 180),
        progress,
        volume,
        isMuted,
        isLooping: repeatMode === 'one',
        isShuffling: shuffleMode,
        repeatMode,
        shuffleMode,
        isPlayerOpen,
        queue,
        sleepTimer,
        sleepTimerRemaining,
        recentlyPlayed,
        playTrack,
        togglePlay,
        pause,
        resume,
        seek,
        nextTrack,
        prevTrack,
        toggleLoop,
        cycleRepeatMode,
        toggleShuffle,
        setVolume,
        toggleMute,
        setSleepTimerMinutes,
        openPlayer,
        closePlayer,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};
