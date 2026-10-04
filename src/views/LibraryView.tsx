import React, { useState } from 'react';
import { 
  Heart, 
  ListMusic, 
  Download, 
  History, 
  Bookmark, 
  Plus, 
  Play, 
  FolderPlus, 
  Trash2,
  Calendar,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAudio } from '../context/AudioContext';
import { ContentCard } from '../components/Cards/ContentCard';

export const LibraryView: React.FC = () => {
  const { 
    favorites, 
    downloads, 
    playlists, 
    listeningHistory, 
    tracks, 
    programs, 
    createPlaylist, 
    openProgramDetail,
    setShowMembershipModal,
    user,
    t 
  } = useApp();

  const { playTrack, recentlyPlayed } = useAudio();
  const [activeSection, setActiveSection] = useState<'favorites' | 'playlists' | 'downloads' | 'history' | 'saved_programs'>('favorites');
  const [showNewPlaylistModal, setShowNewPlaylistModal] = useState(false);
  const [newPlaylistTitle, setNewPlaylistTitle] = useState('');

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatPlayedAt = (isoString?: string) => {
    if (!isoString) return '刚刚';
    try {
      const date = new Date(isoString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      if (diffMins < 1) return '刚刚';
      if (diffMins < 60) return `${diffMins} 分钟前`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours} 小时前`;
      return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    } catch {
      return '最近';
    }
  };

  // Resolved entities
  const favoriteTracks = tracks.filter(t => favorites.includes(t.id));
  const downloadTracks = tracks.filter(t => downloads.includes(t.id));
  const historyTracks = tracks.filter(t => listeningHistory.includes(t.id));
  const recentCount = recentlyPlayed.length > 0 ? recentlyPlayed.length : historyTracks.length;

  const handleCreatePlaylist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlaylistTitle.trim()) return;
    createPlaylist(newPlaylistTitle.trim());
    setNewPlaylistTitle('');
    setShowNewPlaylistModal(false);
  };

  return (
    <div className="space-y-6 pb-24 pt-3 px-4 max-w-md mx-auto animate-fade-in">
      {/* Title & Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-[26px] font-medium tracking-tight text-white/95">
            {t('libraryTitle')}
          </h1>
          <p className="text-xs text-stone-400 font-light mt-0.5 tracking-wide">
            {t('librarySub')}
          </p>
        </div>

        <button
          onClick={() => setShowNewPlaylistModal(true)}
          className="p-2 rounded-2xl bg-[#dfb76c] text-[#0a0c16] hover:bg-[#f3cf7a] transition-all flex items-center space-x-1 shadow-gold-glow"
          title={t('createPlaylist')}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Segmented Section Tabs */}
      <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-1">
        {[
          { key: 'favorites', label: t('tabFavorites'), count: favoriteTracks.length, icon: Heart },
          { key: 'playlists', label: t('tabPlaylists'), count: playlists.length, icon: ListMusic },
          { key: 'downloads', label: t('tabDownloads'), count: downloadTracks.length, icon: Download },
          { key: 'history', label: t('tabHistory'), count: recentCount, icon: History },
          { key: 'saved_programs', label: t('tabSavedPrograms'), count: programs.length, icon: Bookmark },
        ].map(item => {
          const Icon = item.icon;
          const isActive = activeSection === item.key;
          return (
            <button
              key={item.key}
              onClick={() => setActiveSection(item.key as any)}
              className={`px-3 py-2 rounded-2xl text-xs font-medium whitespace-nowrap transition-all flex items-center space-x-1.5 border ${
                isActive 
                  ? 'bg-gradient-to-r from-[#dfb76c] to-[#f3cf7a] text-[#0a0c16] font-semibold border-transparent shadow-gold-glow' 
                  : 'bg-[#121528] border-white/5 text-stone-400 hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-black/20 text-[#0a0c16]' : 'bg-white/10 text-stone-400'}`}>
                {item.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Section Content */}
      {activeSection === 'favorites' && (
        <div className="space-y-3">
          {favoriteTracks.length > 0 ? (
            <div className="space-y-2">
              {favoriteTracks.map(track => (
                <ContentCard key={track.id} track={track} layout="row" onPlayList={favoriteTracks} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 px-4 rounded-3xl bg-[#121528] border border-white/5 space-y-2">
              <Heart className="w-8 h-8 text-stone-600 mx-auto" />
              <p className="text-sm font-semibold text-white">{t('noFavorites')}</p>
            </div>
          )}
        </div>
      )}

      {activeSection === 'playlists' && (
        <div className="space-y-3.5">
          <div className="grid grid-cols-2 gap-3">
            {playlists.map(pl => {
              const count = pl.trackIds.length;
              return (
                <div 
                  key={pl.id}
                  className="group relative p-3 rounded-2xl bg-[#121528] border border-white/5 hover:border-[#dfb76c]/40 transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div className="relative aspect-square w-full rounded-xl overflow-hidden mb-2.5">
                    <img 
                      src={pl.coverUrl} 
                      alt={pl.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                    />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-9 h-9 rounded-full bg-[#dfb76c] text-[#0a0c16] flex items-center justify-center">
                        <Play className="w-4 h-4 fill-current ml-0.5" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold text-white truncate">{pl.title}</h3>
                    <p className="text-[10px] text-stone-400 mt-0.5">{count} tracks • {pl.createdAt}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeSection === 'downloads' && (
        <div className="space-y-3">
          {user.membershipStatus === 'free' ? (
            <div className="text-center py-12 px-6 rounded-3xl bg-gradient-to-b from-[#181c35] to-[#121528] border border-[#dfb76c]/30 space-y-3">
              <Download className="w-9 h-9 text-[#dfb76c] mx-auto" />
              <h3 className="text-base font-bold text-white">{t('offlineNoticeTitle')}</h3>
              <p className="text-xs text-stone-300 leading-relaxed max-w-xs mx-auto">
                {t('offlineNoticeSub')}
              </p>
              <button
                onClick={() => setShowMembershipModal(true)}
                className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-[#dfb76c] to-[#f3cf7a] text-[#0a0c16] font-bold text-xs shadow-gold-glow"
              >
                {t('upgradeNow')}
              </button>
            </div>
          ) : downloadTracks.length > 0 ? (
            <div className="space-y-2">
              {downloadTracks.map(track => (
                <ContentCard key={track.id} track={track} layout="row" onPlayList={downloadTracks} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 px-4 rounded-3xl bg-[#121528] border border-white/5 space-y-2">
              <Download className="w-8 h-8 text-stone-600 mx-auto" />
              <p className="text-sm font-semibold text-white">{t('noDownloads')}</p>
            </div>
          )}
        </div>
      )}

      {activeSection === 'history' && (
        <div className="space-y-2.5">
          {recentlyPlayed.length > 0 ? (
            recentlyPlayed.map((record) => {
              const track = record.track;
              const duration = record.duration || track.durationSeconds || 1;
              const percent = Math.min(100, Math.round((record.progress / duration) * 100));
              return (
                <div
                  key={`${record.content_id}-${record.played_at}`}
                  onClick={() => playTrack(track, undefined, record.progress)}
                  className="group p-3 rounded-2xl bg-[#0f1226]/80 hover:bg-[#161a35] border border-white/[0.04] hover:border-[#dfb76c]/30 transition-all cursor-pointer flex flex-col space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 min-w-0">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 border border-white/5">
                        <img 
                          src={track.coverUrl} 
                          alt={track.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                        />
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <Play className="w-4 h-4 text-white fill-white ml-0.5" />
                        </div>
                      </div>

                      <div className="min-w-0 pr-2">
                        <h4 className="text-xs font-semibold text-stone-100 group-hover:text-white truncate">
                          {track.title}
                        </h4>
                        <p className="text-[11px] text-stone-400 mt-0.5 truncate font-light">
                          {track.artistOrMentor} • <span className="text-[#a599e0]">{formatPlayedAt(record.played_at)}</span>
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        playTrack(track, undefined, record.progress);
                      }}
                      className="px-2.5 py-1 rounded-full bg-[#dfb76c]/15 text-[#dfb76c] hover:bg-[#dfb76c] hover:text-[#0a0c16] text-[10px] font-semibold transition-colors flex items-center space-x-1 flex-shrink-0"
                    >
                      <Play className="w-2.5 h-2.5 fill-current" />
                      <span>Continue</span>
                    </button>
                  </div>

                  {/* Progress Line */}
                  <div className="flex items-center space-x-2 text-[10px] text-stone-400 font-mono">
                    <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-[#a599e0] to-[#dfb76c] rounded-full" 
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <span>{formatTime(record.progress)} / {formatTime(duration)}</span>
                  </div>
                </div>
              );
            })
          ) : historyTracks.length > 0 ? (
            historyTracks.map(track => (
              <ContentCard key={track.id} track={track} layout="row" onPlayList={historyTracks} />
            ))
          ) : (
            <div className="text-center py-16 px-4 rounded-3xl bg-[#121528] border border-white/5 space-y-2">
              <History className="w-8 h-8 text-stone-600 mx-auto" />
              <p className="text-sm font-semibold text-white">No recently played tracks</p>
              <p className="text-xs text-stone-400">Your recent sound baths and meditation sessions will appear here.</p>
            </div>
          )}
        </div>
      )}

      {activeSection === 'saved_programs' && (
        <div className="space-y-3">
          {programs.map(prog => (
            <div
              key={prog.id}
              onClick={() => openProgramDetail(prog)}
              className="p-3.5 rounded-2xl bg-[#121528] hover:bg-[#181c35] border border-white/5 transition-all cursor-pointer flex items-center justify-between"
            >
              <div className="flex items-center space-x-3">
                <img 
                  src={prog.coverUrl} 
                  alt={prog.title}
                  className="w-12 h-12 rounded-xl object-cover" 
                />
                <div>
                  <h4 className="text-xs font-bold text-white">{prog.title}</h4>
                  <p className="text-[11px] text-stone-400">{prog.totalDays} Days • {prog.mentorName}</p>
                </div>
              </div>
              <span className="text-xs font-semibold text-[#dfb76c]">View</span>
            </div>
          ))}
        </div>
      )}

      {/* Create Custom Playlist Modal */}
      {showNewPlaylistModal && (
        <div 
          onClick={() => setShowNewPlaylistModal(false)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm bg-[#15192e] border border-white/10 rounded-3xl p-5 space-y-4"
          >
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <FolderPlus className="w-5 h-5 text-[#dfb76c]" />
              <span>{t('createPlaylistPrompt')}</span>
            </h3>

            <form onSubmit={handleCreatePlaylist} className="space-y-3">
              <div>
                <label className="text-xs text-stone-400 block mb-1">{t('tabPlaylists')}</label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={newPlaylistTitle}
                  onChange={(e) => setNewPlaylistTitle(e.target.value)}
                  placeholder={t('playlistNamePlaceholder')}
                  className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-stone-500 focus:outline-none focus:border-[#dfb76c]"
                />
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewPlaylistModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 text-xs font-medium"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#dfb76c] to-[#f3cf7a] text-[#0a0c16] text-xs font-bold shadow-gold-glow"
                >
                  {t('confirmCreate')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
