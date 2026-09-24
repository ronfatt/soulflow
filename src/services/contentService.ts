import { supabase, isLiveSupabaseConfigured } from '../lib/supabase';
import { Track, Mentor, Program, Course } from '../types';
import { TRACKS, MENTORS, PROGRAMS, COURSES } from '../data/mockData';

// Content Service handles database interactions for Music, Mentors, Programs, and Courses
export const contentService = {
  async fetchTracks(): Promise<Track[]> {
    if (isLiveSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('music')
        .select('*')
        .eq('is_published', true)
        .order('plays', { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map(item => ({
          id: item.id,
          title: item.title,
          artistOrMentor: item.artist_or_mentor,
          mentorId: item.mentor_id,
          category: item.category,
          categoryLabel: item.category_label,
          mood: item.mood,
          durationSeconds: item.duration_seconds,
          durationFormatted: item.duration_formatted,
          coverUrl: item.cover_url,
          audioUrl: item.audio_url,
          tier: item.tier,
          plays: item.plays,
          likes: item.likes,
          description: item.description,
          published: item.is_published,
        }));
      }
    }
    // Fallback to local DB repository
    const local = localStorage.getItem('soulflow_db_tracks');
    return local ? JSON.parse(local) : TRACKS;
  },

  async fetchMentors(): Promise<Mentor[]> {
    if (isLiveSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('mentors')
        .select('*')
        .eq('is_suspended', false)
        .order('rating', { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map(m => ({
          id: m.id,
          name: m.name,
          title: m.title,
          bio: m.bio,
          avatarUrl: m.avatar_url,
          coverUrl: m.cover_url,
          specialization: m.specialization,
          followersCount: m.followers_count,
          studentsCount: m.students_count,
          rating: Number(m.rating),
          referralCode: m.referral_code,
          commissionPercentage: Number(m.commission_percentage),
          isFeatured: m.is_featured,
        }));
      }
    }
    const local = localStorage.getItem('soulflow_db_mentors');
    return local ? JSON.parse(local) : MENTORS;
  },

  async fetchPrograms(): Promise<Program[]> {
    if (isLiveSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('programs')
        .select('*, program_days(*)')
        .eq('is_published', true);

      if (!error && data && data.length > 0) {
        return data.map(p => ({
          id: p.id,
          title: p.title,
          subtitle: p.subtitle,
          description: p.description,
          mentorId: p.mentor_id,
          mentorName: 'Master Guide',
          coverUrl: p.cover_url,
          totalDays: p.total_days,
          tier: p.tier,
          category: (p.category as any) || 'guided_meditation',
          difficulty: p.difficulty,
          lessons: (p.program_days || []).map((d: any) => ({
            dayNumber: d.day_number,
            title: d.title,
            durationMinutes: d.duration_minutes,
            summary: d.summary,
            trackId: d.track_id,
            isCompleted: false,
          })),
        }));
      }
    }
    const local = localStorage.getItem('soulflow_db_programs');
    return local ? JSON.parse(local) : PROGRAMS;
  },

  async fetchCourses(): Promise<Course[]> {
    if (isLiveSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('courses')
        .select('*, course_lessons(*)')
        .eq('is_published', true);

      if (!error && data && data.length > 0) {
        return data.map(c => ({
          id: c.id,
          title: c.title,
          mentorId: c.mentor_id,
          mentorName: 'Alicia Sterling',
          mentorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
          coverUrl: c.cover_url,
          totalLessons: c.total_lessons,
          durationHours: Number(c.duration_hours),
          tier: c.tier,
          description: c.description,
          lessons: (c.course_lessons || []).map((l: any) => ({
            id: l.id,
            lessonNumber: l.lesson_number,
            title: l.title,
            durationFormatted: l.duration_formatted,
            audioUrl: l.audio_url,
            summary: l.summary,
          })),
        }));
      }
    }
    return COURSES;
  },

  async createTrack(trackData: Omit<Track, 'id' | 'plays' | 'likes'>): Promise<Track> {
    const newTrack: Track = {
      ...trackData,
      id: crypto.randomUUID(),
      plays: 0,
      likes: 0,
    };

    if (isLiveSupabaseConfigured()) {
      await supabase.from('music').insert({
        id: newTrack.id,
        title: newTrack.title,
        artist_or_mentor: newTrack.artistOrMentor,
        category: newTrack.category,
        category_label: newTrack.categoryLabel,
        mood: newTrack.mood,
        duration_seconds: newTrack.durationSeconds,
        duration_formatted: newTrack.durationFormatted,
        cover_url: newTrack.coverUrl,
        audio_url: newTrack.audioUrl,
        tier: newTrack.tier,
        description: newTrack.description,
        is_published: newTrack.published,
      });
    }

    return newTrack;
  },

  async updateTrack(id: string, updates: Partial<Track>): Promise<void> {
    if (isLiveSupabaseConfigured()) {
      const dbUpdates: Record<string, any> = {};
      if (updates.title) dbUpdates.title = updates.title;
      if (updates.published !== undefined) dbUpdates.is_published = updates.published;
      if (updates.tier) dbUpdates.tier = updates.tier;
      await supabase.from('music').update(dbUpdates).eq('id', id);
    }
  },

  async deleteTrack(id: string): Promise<void> {
    if (isLiveSupabaseConfigured()) {
      await supabase.from('music').delete().eq('id', id);
    }
  },

  async createMentor(mentorData: Omit<Mentor, 'id' | 'followersCount' | 'studentsCount' | 'rating'>): Promise<Mentor> {
    const newMentor: Mentor = {
      ...mentorData,
      id: crypto.randomUUID(),
      followersCount: 1,
      studentsCount: 0,
      rating: 5.0,
    };

    if (isLiveSupabaseConfigured()) {
      await supabase.from('mentors').insert({
        id: newMentor.id,
        name: newMentor.name,
        title: newMentor.title,
        bio: newMentor.bio,
        avatar_url: newMentor.avatarUrl,
        cover_url: newMentor.coverUrl,
        specialization: newMentor.specialization,
        referral_code: newMentor.referralCode,
        commission_percentage: newMentor.commissionPercentage,
      });

      await supabase.from('mentor_referral_codes').insert({
        id: crypto.randomUUID(),
        mentor_id: newMentor.id,
        code: newMentor.referralCode,
        trial_days: 7,
        discount_percentage: 15.0,
      });
    }

    return newMentor;
  },
};
