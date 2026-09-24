import { supabase, isLiveSupabaseConfigured } from '../lib/supabase';
import { Playlist } from '../types';

export const libraryService = {
  async fetchFavorites(userId: string): Promise<string[]> {
    if (isLiveSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('favorites')
        .select('track_id')
        .eq('user_id', userId);

      if (!error && data) {
        return data.map(item => item.track_id);
      }
    }
    const local = localStorage.getItem(`soulflow_favorites_${userId}`);
    return local ? JSON.parse(local) : ['d0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000005'];
  },

  async toggleFavorite(userId: string, trackId: string, currentFavorites: string[]): Promise<string[]> {
    const exists = currentFavorites.includes(trackId);
    const updated = exists ? currentFavorites.filter(id => id !== trackId) : [...currentFavorites, trackId];

    if (isLiveSupabaseConfigured()) {
      if (exists) {
        await supabase.from('favorites').delete().eq('user_id', userId).eq('track_id', trackId);
      } else {
        await supabase.from('favorites').insert({
          id: crypto.randomUUID(),
          user_id: userId,
          track_id: trackId,
        });
      }
    }

    localStorage.setItem(`soulflow_favorites_${userId}`, JSON.stringify(updated));
    return updated;
  },

  async fetchPlaylists(userId: string): Promise<Playlist[]> {
    if (isLiveSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('playlists')
        .select('*, playlist_items(track_id)')
        .eq('user_id', userId);

      if (!error && data) {
        return data.map(pl => ({
          id: pl.id,
          title: pl.title,
          description: pl.description,
          coverUrl: pl.cover_url,
          trackIds: (pl.playlist_items || []).map((item: any) => item.track_id),
          createdAt: pl.created_at.split('T')[0],
        }));
      }
    }
    const local = localStorage.getItem(`soulflow_playlists_${userId}`);
    return local ? JSON.parse(local) : [
      {
        id: 'pl-1',
        title: 'Deep Evening Unwind',
        description: 'Atmospheric bowls & delta waves before sleep',
        coverUrl: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=600&q=80',
        trackIds: ['d0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000003'],
        createdAt: '2026-09-20',
      },
    ];
  },

  async createPlaylist(userId: string, title: string, coverUrl: string, trackIds: string[] = []): Promise<Playlist> {
    const newPlaylist: Playlist = {
      id: crypto.randomUUID(),
      title,
      coverUrl,
      trackIds,
      createdAt: new Date().toISOString().split('T')[0],
    };

    if (isLiveSupabaseConfigured()) {
      await supabase.from('playlists').insert({
        id: newPlaylist.id,
        user_id: userId,
        title: newPlaylist.title,
        cover_url: newPlaylist.coverUrl,
      });

      if (trackIds.length > 0) {
        const items = trackIds.map((tid, idx) => ({
          id: crypto.randomUUID(),
          playlist_id: newPlaylist.id,
          track_id: tid,
          display_order: idx,
        }));
        await supabase.from('playlist_items').insert(items);
      }
    }

    return newPlaylist;
  },

  async addTrackToPlaylist(playlistId: string, trackId: string): Promise<void> {
    if (isLiveSupabaseConfigured()) {
      await supabase.from('playlist_items').insert({
        id: crypto.randomUUID(),
        playlist_id: playlistId,
        track_id: trackId,
      });
    }
  },

  async recordListeningHistory(userId: string, trackId: string): Promise<void> {
    if (isLiveSupabaseConfigured()) {
      await supabase.from('listening_history').insert({
        id: crypto.randomUUID(),
        user_id: userId,
        track_id: trackId,
      });
    }
  },
};
