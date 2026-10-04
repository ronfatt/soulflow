import React, { useState, useMemo } from 'react';
import { 
  Music2, 
  Sparkles, 
  Moon, 
  Waves, 
  Wind, 
  Compass, 
  Heart, 
  Sun, 
  Calendar, 
  Users, 
  Flame, 
  Feather,
  ChevronRight,
  Play
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ContentCard } from '../components/Cards/ContentCard';
import { MentorCard } from '../components/Cards/MentorCard';
import { SearchBar } from '../components/Common/SearchBar';
import { CategoryChip } from '../components/Common/CategoryChip';
import { SectionHeader } from '../components/Common/SectionHeader';
import { Track, Mentor, Program } from '../types';

export const ExploreView: React.FC = () => {
  const { 
    tracks, 
    mentors, 
    programs,
    openMentorDetail,
    openProgramDetail,
    t 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'All' | 'Music' | 'Meditation' | 'Programs' | 'Mentors'>('All');
  const [selectedCategoryShortcut, setSelectedCategoryShortcut] = useState<string>('all');

  // Category shortcuts with localized labels
  const categoryShortcuts = [
    { id: 'healing_music', label: t('catHealingMusic'), icon: Music2 },
    { id: 'sleep', label: t('catSleep'), icon: Moon },
    { id: 'guided_meditation', label: t('catMeditation'), icon: Sparkles },
    { id: 'relaxation', label: t('catRelaxation'), icon: Feather },
    { id: 'focus', label: t('catFocus'), icon: Compass },
    { id: 'soundscape', label: t('catSoundscape'), icon: Waves },
    { id: 'emotional_healing', label: t('catEmotionalHealing'), icon: Heart },
    { id: 'spiritual', label: t('catSpiritual'), icon: Sun },
    { id: 'programs', label: t('catPrograms'), icon: Calendar },
    { id: 'mentors', label: t('catMentors'), icon: Users },
  ];

  // Localized Filters
  const filters: Array<{ id: 'All' | 'Music' | 'Meditation' | 'Programs' | 'Mentors'; label: string }> = [
    { id: 'All', label: t('filterAll') },
    { id: 'Music', label: t('filterMusic') },
    { id: 'Meditation', label: t('filterMeditation') },
    { id: 'Programs', label: t('filterPrograms') },
    { id: 'Mentors', label: t('filterMentors') },
  ];

  // Search Results Filtering
  const isSearching = searchQuery.trim().length > 0 || selectedCategoryShortcut !== 'all' || selectedFilter !== 'All';

  const searchResults = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    // Matching Tracks
    let matchedTracks = tracks.filter(t => {
      const matchText = `${t.title} ${t.artistOrMentor} ${t.categoryLabel} ${t.category} ${t.description}`.toLowerCase();
      const textMatches = !q || matchText.includes(q);
      
      // Filter check
      if (selectedFilter === 'Music') {
        if (t.category !== 'healing_music' && t.category !== 'sleep') return false;
      } else if (selectedFilter === 'Meditation') {
        if (t.category !== 'guided_meditation' && t.category !== 'stress_relief' && t.category !== 'spiritual') return false;
      } else if (selectedFilter === 'Programs' || selectedFilter === 'Mentors') {
        return false;
      }

      // Shortcut check
      if (selectedCategoryShortcut !== 'all') {
        if (selectedCategoryShortcut === 'relaxation') {
          if (t.mood !== 'relax' && t.category !== 'soundscape') return false;
        } else if (selectedCategoryShortcut === 'programs' || selectedCategoryShortcut === 'mentors') {
          return false;
        } else if (t.category !== selectedCategoryShortcut) {
          return false;
        }
      }

      return textMatches;
    });

    // Matching Programs
    let matchedPrograms = programs.filter(p => {
      if (selectedFilter === 'Music' || selectedFilter === 'Meditation' || selectedFilter === 'Mentors') return false;
      if (selectedCategoryShortcut !== 'all' && selectedCategoryShortcut !== 'programs') return false;

      const pText = `${p.title} ${p.subtitle} ${p.mentorName} ${p.description}`.toLowerCase();
      return !q || pText.includes(q);
    });

    // Matching Mentors
    let matchedMentors = mentors.filter(m => {
      if (selectedFilter === 'Music' || selectedFilter === 'Meditation' || selectedFilter === 'Programs') return false;
      if (selectedCategoryShortcut !== 'all' && selectedCategoryShortcut !== 'mentors') return false;

      const mText = `${m.name} ${m.title} ${m.specialization} ${m.bio}`.toLowerCase();
      return !q || mText.includes(q);
    });

    return {
      tracks: matchedTracks,
      programs: matchedPrograms,
      mentors: matchedMentors,
      totalCount: matchedTracks.length + matchedPrograms.length + matchedMentors.length,
    };
  }, [tracks, programs, mentors, searchQuery, selectedFilter, selectedCategoryShortcut]);

  // Curated Collections (when not actively searching)
  const popularNow = useMemo(() => [...tracks].sort((a, b) => b.plays - a.plays).slice(0, 4), [tracks]);
  const newReleases = useMemo(() => [...tracks].reverse().slice(0, 4), [tracks]);
  const sleepCollection = useMemo(() => tracks.filter(t => t.category === 'sleep' || t.mood === 'sleep').slice(0, 4), [tracks]);
  const stressRelief = useMemo(() => tracks.filter(t => t.category === 'stress_relief' || t.mood === 'stress').slice(0, 4), [tracks]);
  const focusProductivity = useMemo(() => tracks.filter(t => t.category === 'focus' || t.mood === 'focus').slice(0, 4), [tracks]);
  const natureSoundscapes = useMemo(() => tracks.filter(t => t.category === 'soundscape').slice(0, 4), [tracks]);

  // Mentor categories filter state with localized labels
  const [mentorCategoryFilter, setMentorCategoryFilter] = useState<string>('All');
  const mentorCategories = [
    { id: 'All', label: t('mentorCatAll') },
    { id: 'Meditation', label: t('mentorCatMeditation') },
    { id: 'Sleep', label: t('mentorCatSleep') },
    { id: 'Sound Healing', label: t('mentorCatSoundHealing') },
    { id: 'Breathwork', label: t('mentorCatBreathwork') },
    { id: 'Emotional Wellness', label: t('mentorCatEmotional') },
    { id: 'Mindfulness', label: t('mentorCatMindfulness') },
    { id: 'Spiritual Growth', label: t('mentorCatSpiritual') },
  ];

  const filteredMentorsList = useMemo(() => {
    if (mentorCategoryFilter === 'All') return mentors;
    return mentors.filter(m => {
      const matchSpec = `${m.specialization} ${m.title} ${m.bio}`.toLowerCase();
      return matchSpec.includes(mentorCategoryFilter.toLowerCase());
    });
  }, [mentors, mentorCategoryFilter]);

  return (
    <div className="space-y-6 pb-24 pt-3 px-4 max-w-md mx-auto animate-fade-in select-none">
      {/* Title */}
      <div>
        <h1 className="font-serif text-[26px] font-medium tracking-tight text-white/95">
          {t('exploreTitle')}
        </h1>
        <p className="text-xs text-stone-400 font-light mt-0.5 tracking-wide">
          {t('exploreSub')}
        </p>
      </div>

      {/* Top Search Bar */}
      <SearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder={t('searchPlaceholder')}
      />

      {/* Category Shortcuts (Horizontal scroll) */}
      <div className="space-y-2">
        <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 px-0.5">
          {t('categoriesLabel')}
        </span>
        <div className="flex space-x-2 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4">
          <CategoryChip
            label={t('allCategories')}
            isActive={selectedCategoryShortcut === 'all'}
            onClick={() => setSelectedCategoryShortcut('all')}
          />
          {categoryShortcuts.map(cat => (
            <CategoryChip
              key={cat.id}
              label={cat.label}
              icon={cat.icon}
              isActive={selectedCategoryShortcut === cat.id}
              onClick={() => setSelectedCategoryShortcut(selectedCategoryShortcut === cat.id ? 'all' : cat.id)}
            />
          ))}
        </div>
      </div>

      {/* Filters (All, Music, Meditation, Programs, Mentors) */}
      <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar pb-1">
        {filters.map(f => (
          <button
            key={f.id}
            onClick={() => setSelectedFilter(f.id)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
              selectedFilter === f.id
                ? 'bg-[#dfb76c] text-[#0a0c16] font-semibold shadow-gold-glow'
                : 'bg-[#121528] text-stone-300 hover:text-white border border-white/5'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* DYNAMIC SEARCH & FILTER RESULTS */}
      {isSearching ? (
        <div className="space-y-6 animate-fade-in">
          <div className="flex items-center justify-between px-0.5 pb-2 border-b border-white/5">
            <span className="text-xs font-semibold text-white">
              {t('resultsFound', { count: searchResults.totalCount })}
            </span>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategoryShortcut('all');
                setSelectedFilter('All');
              }}
              className="text-xs text-[#dfb76c] hover:underline"
            >
              {t('resetFilters')}
            </button>
          </div>

          {/* Matched Tracks */}
          {searchResults.tracks.length > 0 && (
            <div className="space-y-3">
              <SectionHeader title={t('tracksSection')} count={searchResults.tracks.length} />
              <div className="grid grid-cols-2 gap-3.5">
                {searchResults.tracks.map(track => (
                  <ContentCard key={track.id} track={track} layout="card" onPlayList={searchResults.tracks} />
                ))}
              </div>
            </div>
          )}

          {/* Matched Programs */}
          {searchResults.programs.length > 0 && (
            <div className="space-y-3">
              <SectionHeader title={t('programsSection')} count={searchResults.programs.length} />
              <div className="space-y-3">
                {searchResults.programs.map(prog => (
                  <div
                    key={prog.id}
                    onClick={() => openProgramDetail(prog)}
                    className="p-4 rounded-2xl bg-[#121528] border border-white/5 hover:border-[#dfb76c]/40 transition-all cursor-pointer flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3.5 min-w-0 pr-2">
                      <img src={prog.coverUrl} alt={prog.title} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
                      <div className="min-w-0">
                        <span className="text-[10px] text-[#dfb76c] font-mono font-bold">{prog.totalDays} Days</span>
                        <h4 className="text-xs font-bold text-white truncate">{prog.title}</h4>
                        <p className="text-[10px] text-stone-400 truncate">{prog.mentorName}</p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-[#dfb76c] flex-shrink-0">View</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Matched Mentors */}
          {searchResults.mentors.length > 0 && (
            <div className="space-y-3">
              <SectionHeader title={t('mentorsSection')} count={searchResults.mentors.length} />
              <div className="space-y-3">
                {searchResults.mentors.map(mentor => (
                  <MentorCard key={mentor.id} mentor={mentor} onSelect={openMentorDetail} />
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {searchResults.totalCount === 0 && (
            <div className="text-center py-16 px-4 rounded-3xl bg-[#121528] border border-white/5 space-y-2">
              <Sparkles className="w-8 h-8 text-stone-600 mx-auto" />
              <p className="text-sm font-semibold text-white">{t('noResultsTitle')}</p>
              <p className="text-xs text-stone-400">{t('noResultsSub')}</p>
            </div>
          )}
        </div>
      ) : (
        /* CURATED SECTIONS */
        <div className="space-y-7">
          {/* MENTOR DISCOVERY: Learn From Trusted Mentors */}
          <div className="space-y-3.5">
            <SectionHeader 
              title={t('mentorDiscoveryTitle')} 
              subtitle={t('mentorDiscoverySub')}
              icon={Sparkles}
            />

            {/* Mentor Categories Filter */}
            <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar pb-1">
              {mentorCategories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setMentorCategoryFilter(cat.id)}
                  className={`px-3 py-1 rounded-full text-[11px] font-medium transition-all whitespace-nowrap ${
                    mentorCategoryFilter === cat.id
                      ? 'bg-[#dfb76c] text-[#0a0c16] font-semibold shadow-gold-glow'
                      : 'bg-[#121528] text-stone-400 hover:text-white border border-white/5'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Mentor Cards Horizontal Slider */}
            <div className="flex space-x-3.5 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4">
              {filteredMentorsList.map(mentor => (
                <div key={mentor.id} className="w-72 flex-shrink-0">
                  <MentorCard mentor={mentor} onSelect={openMentorDetail} layout="card" />
                </div>
              ))}
            </div>
          </div>

          {/* 1. Popular Now */}
          <div className="space-y-3">
            <SectionHeader 
              title={t('popularNow')} 
              subtitle={t('popularNowSub')} 
              icon={Flame}
            />
            <div className="grid grid-cols-2 gap-3.5">
              {popularNow.map(track => (
                <ContentCard key={track.id} track={track} layout="card" onPlayList={popularNow} />
              ))}
            </div>
          </div>

          {/* 2. New Releases */}
          <div className="space-y-3">
            <SectionHeader 
              title={t('newReleases')} 
              subtitle={t('newReleasesSub')}
              icon={Sparkles}
            />
            <div className="flex space-x-3.5 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4">
              {newReleases.map(track => (
                <div key={track.id} className="w-48 flex-shrink-0">
                  <ContentCard track={track} layout="card" onPlayList={newReleases} />
                </div>
              ))}
            </div>
          </div>

          {/* 3. Sleep Collection */}
          <div className="space-y-3">
            <SectionHeader 
              title={t('sleepCollection')} 
              subtitle={t('sleepCollectionSub')}
              icon={Moon}
            />
            <div className="grid grid-cols-2 gap-3.5">
              {sleepCollection.map(track => (
                <ContentCard key={track.id} track={track} layout="card" onPlayList={sleepCollection} />
              ))}
            </div>
          </div>

          {/* 4. Stress Relief */}
          <div className="space-y-3">
            <SectionHeader 
              title={t('stressRelief')} 
              subtitle={t('stressReliefSub')}
              icon={Wind}
            />
            <div className="grid grid-cols-2 gap-3.5">
              {stressRelief.map(track => (
                <ContentCard key={track.id} track={track} layout="card" onPlayList={stressRelief} />
              ))}
            </div>
          </div>

          {/* 5. Focus & Productivity */}
          <div className="space-y-3">
            <SectionHeader 
              title={t('focusProductivity')} 
              subtitle={t('focusProductivitySub')}
              icon={Compass}
            />
            <div className="grid grid-cols-2 gap-3.5">
              {focusProductivity.map(track => (
                <ContentCard key={track.id} track={track} layout="card" onPlayList={focusProductivity} />
              ))}
            </div>
          </div>

          {/* 6. Nature Soundscapes */}
          <div className="space-y-3">
            <SectionHeader 
              title={t('natureSoundscapes')} 
              subtitle={t('natureSoundscapesSub')}
              icon={Waves}
            />
            <div className="grid grid-cols-2 gap-3.5">
              {natureSoundscapes.map(track => (
                <ContentCard key={track.id} track={track} layout="card" onPlayList={natureSoundscapes} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
