import React, { useMemo } from 'react';
import { 
  Sparkles, 
  Crown, 
  Play, 
  ChevronRight, 
  Calendar, 
  Clock, 
  Moon, 
  Wind, 
  Compass, 
  Heart, 
  Sun,
  Flame,
  Radio
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAudio } from '../context/AudioContext';
import { MoodSelector } from '../components/Cards/MoodSelector';
import { ContentCard } from '../components/Cards/ContentCard';
import { MentorCard } from '../components/Cards/MentorCard';
import { SectionHeader } from '../components/Common/SectionHeader';

export const HomeView: React.FC = () => {
  const { 
    user, 
    tracks, 
    mentors, 
    programs, 
    selectedMood, 
    openMentorDetail, 
    openProgramDetail, 
    openDailySession,
    userProgramProgress,
    followingMentors,
    setShowMembershipModal,
    setActiveTab,
    t,
    language
  } = useApp();

  const { playTrack, recentlyPlayed } = useAudio();

  // Dynamic Poetic Greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('greetingMorning');
    if (hour < 18) return t('greetingAfternoon');
    return t('greetingEvening');
  };

  // Continue Your Journey (Program Progress)
  const activeJourneyProg = userProgramProgress['e0000000-0000-0000-0000-000000000002'] || Object.values(userProgramProgress)[0];
  const activeJourneyProgram = programs.find(p => p.id === activeJourneyProg?.program_id) || programs[1];

  // From Mentors You Follow
  const followedTracks = useMemo(() => {
    return tracks.filter(t => t.mentorId && followingMentors.includes(t.mentorId));
  }, [tracks, followingMentors]);

  // Featured Mentor spotlight (e.g. Dr. Maya Chen)
  const featuredMentor = mentors.find(m => m.id === 'b0000000-0000-0000-0000-000000000005') || mentors[0];

  // Section A: Continue Listening (Most recent item with progress)
  const continueItem = recentlyPlayed.length > 0 ? recentlyPlayed[0] : null;
  const continueTrack = continueItem ? continueItem.track : tracks[0];
  const continueProgressSec = continueItem ? continueItem.progress : 1104; // 18:24
  const continueDurationSec = continueTrack.durationSeconds || 1800;
  const continuePercent = Math.min(100, Math.round((continueProgressSec / continueDurationSec) * 100));

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Section B: Recommended For You (Personalized mix matching goals & duration)
  const recommendedTracks = useMemo(() => {
    return tracks
      .filter(t => t.mood === selectedMood || t.category === 'healing_music' || t.category === 'sleep')
      .slice(0, 6);
  }, [tracks, selectedMood]);

  // Section C: Based on Your Mood (Dynamically curated per user selection)
  const moodCurations = useMemo(() => {
    const isZh = language === 'zh';
    switch (selectedMood) {
      case 'sleep':
        return [
          { label: isZh ? '深度助眠脑波' : 'Deep Sleep Music', track: tracks.find(t => t.title === 'Deep Sleep Frequency') || tracks[0] },
          { label: isZh ? '午夜柔雨声景' : 'Rain Soundscape', track: tracks.find(t => t.title.includes('Midnight Rain')) || tracks[7] },
          { label: isZh ? '月夜止念冥想' : 'Night Meditation', track: tracks.find(t => t.title === 'Moonlight Meditation') || tracks[1] },
          { label: isZh ? '432Hz 沉浸入梦' : 'Sleep Journey', track: tracks.find(t => t.title.includes('Deep Sleep 432Hz')) || tracks[0] },
        ];
      case 'stress':
        return [
          { label: isZh ? '焦虑释放与重置' : 'Anxiety Release', track: tracks.find(t => t.title === 'Release Anxiety') || tracks[1] },
          { label: isZh ? '空灵疗愈钢琴' : 'Calm Piano', track: tracks.find(t => t.title === 'Healing Piano') || tracks[5] },
          { label: isZh ? '迷走神经平息呼吸' : 'Breathing Meditation', track: tracks.find(t => t.title.includes('Anxiety Release & Vagus')) || tracks[1] },
          { label: isZh ? '潮汐正念音疗' : 'Ocean Soundscape', track: tracks.find(t => t.title === 'Ocean Mind') || tracks[2] },
        ];
      case 'focus':
        return [
          { label: isZh ? '晨间清透心流' : 'Morning Clarity', track: tracks.find(t => t.title === 'Morning Clarity') || tracks[3] },
          { label: isZh ? 'Alpha 脑波深潜' : 'Alpha Entrainment', track: tracks.find(t => t.title.includes('Alpha Clarity')) || tracks[5] },
          { label: isZh ? '清醒共振频率' : 'Focus Resonance', track: tracks.find(t => t.title.includes('Morning Energy')) || tracks[3] },
          { label: isZh ? '深度工作钢琴' : 'Deep Flow Piano', track: tracks.find(t => t.title === 'Healing Piano') || tracks[6] },
        ];
      case 'meditation':
        return [
          { label: isZh ? '内在沉静定心' : 'Inner Stillness', track: tracks.find(t => t.title === 'Inner Stillness') || tracks[8] },
          { label: isZh ? '无执空灵觉知' : 'Non-Dual Presence', track: tracks.find(t => t.title.includes('Stillness Within')) || tracks[8] },
          { label: isZh ? '森林大地扎根' : 'Forest Grounding', track: tracks.find(t => t.title === 'Forest Breath') || tracks[4] },
          { label: isZh ? '慈悲心轮共振' : 'Heart Resonance', track: tracks.find(t => t.title.includes('Heart Chakra')) || tracks[6] },
        ];
      case 'relax':
        return [
          { label: isZh ? '澄澈海浪音疗' : 'Ocean Mind', track: tracks.find(t => t.title === 'Ocean Mind') || tracks[2] },
          { label: isZh ? '温润治愈琴韵' : 'Healing Piano', track: tracks.find(t => t.title === 'Healing Piano') || tracks[6] },
          { label: isZh ? '暮色海岸沉思' : 'Coastal Twilight', track: tracks.find(t => t.title.includes('Ocean Healing')) || tracks[2] },
          { label: isZh ? '松针清风吐纳' : 'Forest Breath', track: tracks.find(t => t.title === 'Forest Breath') || tracks[4] },
        ];
      case 'spiritual':
        return [
          { label: isZh ? '索菲吉奥神圣频波' : 'Sacred Solfeggio', track: tracks.find(t => t.title.includes('528Hz Miracle')) || tracks[4] },
          { label: isZh ? '超然灵性定境' : 'Inner Stillness', track: tracks.find(t => t.title === 'Inner Stillness') || tracks[8] },
          { label: isZh ? '432Hz 能量声波浴' : 'Heart Chakra Bath', track: tracks.find(t => t.title.includes('Heart Chakra')) || tracks[6] },
          { label: isZh ? '禅修合一当下' : 'Zen Presence', track: tracks.find(t => t.title.includes('Stillness Within')) || tracks[8] },
        ];
      default:
        return tracks.slice(0, 4).map(t => ({ label: t.categoryLabel, track: t }));
    }
  }, [selectedMood, tracks, language]);

  // Section D: Featured Programs
  const featuredPrograms = programs.slice(0, 2);

  // Section E: Featured Mentors
  const featuredMentors = mentors.slice(0, 6);

  // Section F: New This Week
  const newThisWeek = useMemo(() => {
    return [...tracks].reverse().slice(0, 5);
  }, [tracks]);

  return (
    <div className="space-y-7 pb-24 pt-3 px-4 max-w-md mx-auto animate-fade-in select-none relative">
      {/* Subtle Ambient Glow Orb */}
      <div className="absolute -top-10 inset-x-0 h-72 pointer-events-none bg-gradient-to-b from-[#241a3e]/30 via-[#18112c]/10 to-transparent blur-3xl -z-10" />

      {/* Top Greeting Header */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <div className="flex items-center space-x-1.5 text-xs text-[#a599e0] font-medium tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-[#dfb76c]" />
            <span>{getGreeting()}, {user.name.split(' ')[0]}</span>
          </div>
          <h1 className="font-serif text-[26px] font-medium tracking-tight text-white/95 mt-0.5">
            SoulFlow
          </h1>
        </div>

        {/* Membership Status Badge Button */}
        <button
          onClick={() => setShowMembershipModal(true)}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all active:scale-95 ${
            user.membershipStatus === 'free'
              ? 'bg-[#dfb76c]/15 border-[#dfb76c]/40 text-[#dfb76c] hover:bg-[#dfb76c]/25 shadow-gold-glow'
              : 'bg-white/[0.08] border-white/[0.15] text-white hover:bg-white/[0.12]'
          }`}
        >
          <Crown className="w-3.5 h-3.5 fill-current" />
          <span className="capitalize font-mono text-[11px]">{user.membershipStatus === 'free' ? 'Upgrade' : user.membershipStatus}</span>
        </button>
      </div>

      {/* Main Mood Prompt: "How are you feeling today?" */}
      <MoodSelector />

      {/* CONTINUE YOUR JOURNEY */}
      {activeJourneyProgram && activeJourneyProg && (
        <div className="space-y-2.5">
          <SectionHeader 
            title={t('continueJourney')} 
            subtitle={t('continueJourneySub')}
            actionText={t('allJourneys')}
            onAction={() => setActiveTab('journey')}
          />

          <div 
            onClick={() => openDailySession(activeJourneyProgram, activeJourneyProg.current_day)}
            className="group relative p-4 rounded-3xl specular-card hover:border-[#dfb76c]/50 transition-all cursor-pointer shadow-xl active:scale-[0.985]"
          >
            <div className="flex items-center space-x-3.5">
              <div className="relative w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 shadow-lg border border-white/10">
                <img 
                  src={activeJourneyProgram.coverUrl} 
                  alt={activeJourneyProgram.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <Play className="w-5 h-5 text-[#dfb76c] fill-[#dfb76c] ml-0.5" />
                </div>
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] text-[#dfb76c] font-bold uppercase tracking-wider font-mono">
                    {t('dayOf', { current: activeJourneyProg.current_day, total: activeJourneyProgram.totalDays })}
                  </span>
                  <span className="text-[10px] text-stone-500">•</span>
                  <span className="text-[10px] text-stone-300 font-mono">
                    {t('percentComplete', { percent: activeJourneyProg.progress_percentage })}
                  </span>
                </div>

                <h3 className="font-serif text-sm font-medium text-white truncate mt-0.5">
                  {activeJourneyProgram.title}
                </h3>
                <p className="text-xs text-stone-400 truncate font-light">
                  {t('guidedBy', { name: activeJourneyProgram.mentorName })}
                </p>

                {/* Progress bar preview */}
                <div className="mt-2 flex items-center space-x-2">
                  <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#a599e0] via-[#dfb76c] to-[#f3cf7a] rounded-full" 
                      style={{ width: `${activeJourneyProg.progress_percentage}%` }}
                    />
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      openDailySession(activeJourneyProgram, activeJourneyProg.current_day);
                    }}
                    className="text-[10px] text-[#dfb76c] font-semibold hover:underline"
                  >
                    Day {activeJourneyProg.current_day} →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION A: CONTINUE LISTENING */}
      {continueTrack && (
        <div className="space-y-2.5">
          <SectionHeader 
            title={t('continueListening')} 
            subtitle={t('continueListeningSub')}
            badge={t('resumeBadge')}
          />

          <div 
            onClick={() => playTrack(continueTrack, undefined, continueProgressSec)}
            className="group relative p-3.5 rounded-3xl specular-card hover:border-[#dfb76c]/40 transition-all duration-300 cursor-pointer shadow-xl active:scale-[0.985]"
          >
            <div className="flex items-center space-x-3.5">
              <div className="relative w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 shadow-lg border border-white/5">
                <img 
                  src={continueTrack.coverUrl} 
                  alt={continueTrack.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                </div>
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center space-x-1.5">
                  <span className="text-[10px] text-[#dfb76c] font-medium uppercase tracking-wider font-mono">
                    {continueTrack.categoryLabel}
                  </span>
                  <span className="text-[10px] text-stone-500">•</span>
                  <span className="text-[10px] text-stone-400 font-mono">
                    {formatTime(continueProgressSec)}
                  </span>
                </div>

                <h3 className="font-serif text-sm font-medium text-white truncate mt-0.5">
                  {continueTrack.title}
                </h3>
                <p className="text-xs text-stone-400 truncate font-light">
                  {continueTrack.artistOrMentor}
                </p>

                {/* Progress bar preview */}
                <div className="mt-2.5 flex items-center space-x-2">
                  <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#a599e0] via-[#dfb76c] to-[#f3cf7a] rounded-full transition-all" 
                      style={{ width: `${continuePercent}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-stone-400 font-mono">
                    {formatTime(continueProgressSec)} / {formatTime(continueDurationSec)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION B: RECOMMENDED FOR YOU */}
      <div className="space-y-3">
        <SectionHeader 
          title={t('recommendedForYou')} 
          subtitle={t('recommendedSub')}
          actionText={t('seeAll')}
          onAction={() => setActiveTab('explore')}
        />

        {/* Horizontal scroll cards */}
        <div className="flex space-x-3.5 overflow-x-auto no-scrollbar pb-1 pt-0.5 -mx-4 px-4">
          {recommendedTracks.map(track => (
            <div key={track.id} className="w-48 flex-shrink-0">
              <ContentCard track={track} layout="card" onPlayList={recommendedTracks} />
            </div>
          ))}
        </div>
      </div>

      {/* SECTION C: BASED ON YOUR MOOD (Dynamic) */}
      <div className="space-y-3 p-4 rounded-[30px] specular-card shadow-xl">
        <SectionHeader 
          title={t('basedOnMood')} 
          subtitle={t('basedOnMoodSub', { mood: selectedMood })}
          badge={`#${selectedMood}`}
        />

        {/* 4 Mood-curated practices */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          {moodCurations.map((item, idx) => (
            <div key={idx} className="space-y-1">
              <span className="text-[10px] font-mono text-[#dfb76c] uppercase tracking-wider block px-1 truncate">
                {item.label}
              </span>
              <ContentCard track={item.track} layout="card" onPlayList={moodCurations.map(m => m.track)} />
            </div>
          ))}
        </div>
      </div>

      {/* SECTION D: FEATURED PROGRAMS */}
      <div className="space-y-3">
        <SectionHeader 
          title={t('featuredPrograms')} 
          subtitle={t('featuredProgramsSub')}
          actionText={t('allJourneys')}
          onAction={() => setActiveTab('journey')}
        />

        <div className="space-y-3">
          {featuredPrograms.map(prog => (
            <div 
              key={prog.id}
              onClick={() => openProgramDetail(prog)}
              className="relative overflow-hidden rounded-[28px] p-5 specular-card cursor-pointer group shadow-xl hover:border-[#dfb76c]/40 transition-all active:scale-[0.985]"
            >
              <div className="absolute -right-8 -bottom-8 w-40 h-40 rounded-full bg-[#dfb76c]/10 blur-3xl group-hover:bg-[#dfb76c]/20 transition-all" />

              <div className="relative z-10 flex items-start justify-between">
                <div className="space-y-1 max-w-[75%]">
                  <div className="flex items-center space-x-1.5 text-[10px] font-bold text-[#dfb76c] uppercase tracking-wider font-mono">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{t('daysCount', { days: prog.totalDays })} • {prog.difficulty}</span>
                  </div>
                  <h3 className="font-serif text-[17px] font-medium text-white leading-tight">
                    {prog.title}
                  </h3>
                  <p className="text-xs text-stone-300 font-light line-clamp-1">
                    {t('guidedBy', { name: prog.mentorName })}
                  </p>
                </div>

                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#dfb76c] to-[#f3cf7a] text-[#0a0c16] flex items-center justify-center shadow-gold-glow flex-shrink-0 group-hover:scale-105 active:scale-90 transition-transform">
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FROM MENTORS YOU FOLLOW */}
      {followedTracks.length > 0 && (
        <div className="space-y-3">
          <SectionHeader 
            title={t('fromMentorsYouFollow')} 
            subtitle={t('fromMentorsYouFollowSub')}
            icon={Sparkles}
          />
          <div className="flex space-x-3.5 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4">
            {followedTracks.map(track => (
              <div key={track.id} className="w-48 flex-shrink-0">
                <ContentCard track={track} layout="card" onPlayList={followedTracks} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FEATURED MENTOR SPOTLIGHT */}
      {featuredMentor && (
        <div className="space-y-3">
          <SectionHeader 
            title={t('featuredMentor')} 
            subtitle={t('featuredMentorSub')}
            actionText={t('viewProfile')}
            onAction={() => openMentorDetail(featuredMentor)}
          />
          <MentorCard 
            mentor={featuredMentor} 
            layout="card" 
            onSelect={openMentorDetail} 
          />
        </div>
      )}

      {/* SECTION E: ALL MENTORS SHORTCUT */}
      <div className="space-y-3">
        <SectionHeader 
          title={t('exploreMentors')} 
          subtitle={t('exploreMentorsSub')}
          actionText={t('seeAll')}
          onAction={() => setActiveTab('explore')}
        />

        {/* Horizontal scroll mentor avatars */}
        <div className="flex space-x-3 overflow-x-auto no-scrollbar pb-1 pt-0.5 -mx-4 px-4">
          {featuredMentors.map(mentor => (
            <MentorCard 
              key={mentor.id} 
              mentor={mentor} 
              layout="compact" 
              onSelect={openMentorDetail} 
            />
          ))}
        </div>
      </div>

      {/* SECTION F: NEW THIS WEEK */}
      <div className="space-y-3">
        <SectionHeader 
          title={t('newThisWeek')} 
          subtitle={t('newThisWeekSub')}
          actionText={t('seeAll')}
          onAction={() => setActiveTab('explore')}
        />

        <div className="grid grid-cols-2 gap-3.5">
          {newThisWeek.map(track => (
            <ContentCard 
              key={track.id} 
              track={track} 
              layout="card" 
              onPlayList={newThisWeek} 
            />
          ))}
        </div>
      </div>
    </div>
  );
};
