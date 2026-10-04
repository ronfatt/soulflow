import React from 'react';
import { 
  Calendar, 
  Crown, 
  ArrowRight,
  Flame,
  Clock,
  Sparkles,
  Play,
  Check,
  Moon,
  Wind,
  Heart,
  Compass,
  Sun
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Program } from '../types';
import { SectionHeader } from '../components/Common/SectionHeader';

export const JourneyView: React.FC = () => {
  const { 
    programs, 
    openProgramDetail, 
    openDailySession,
    userProgramProgress, 
    streakInfo,
    t 
  } = useApp();

  // Find the active program (e.g. 14-Day Stress Reset or highest progress)
  const activeProgramId = Object.keys(userProgramProgress)[0] || 'e0000000-0000-0000-0000-000000000002';
  const activeProgram = programs.find(p => p.id === activeProgramId) || programs[1];
  const activeProgress = userProgramProgress[activeProgram?.id || ''] || {
    current_day: 5,
    completed_days: [1, 2, 3, 4],
    progress_percentage: 35,
  };

  // Section categorization
  const sleepPrograms = programs.filter(p => p.category === 'sleep');
  const stressPrograms = programs.filter(p => p.category === 'stress_relief');
  const emotionalPrograms = programs.filter(p => p.category === 'emotional_healing');
  const focusPrograms = programs.filter(p => p.category === 'focus');
  const spiritualPrograms = programs.filter(p => p.category === 'spiritual');
  const recommendedPrograms = [programs[0], programs[2]];

  const renderJourneyCard = (program: Program, isHero = false) => {
    const progData = userProgramProgress[program.id];
    const completedCount = progData?.completed_days?.length || 0;
    const progressPct = progData?.progress_percentage || 0;
    const currentDay = progData?.current_day || 1;
    const hasStarted = Boolean(progData);
    const isPremium = Boolean(program.is_premium || program.tier !== 'free');

    return (
      <div
        key={program.id}
        onClick={() => openProgramDetail(program)}
        className={`group relative rounded-[28px] overflow-hidden specular-card hover:border-[#dfb76c]/40 transition-all duration-300 cursor-pointer shadow-xl active:scale-[0.985] ${
          isHero ? 'w-full' : 'flex-shrink-0 w-72'
        }`}
      >
        {/* Cover Image */}
        <div className="relative h-40 w-full overflow-hidden">
          <img 
            src={program.coverUrl} 
            alt={program.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d1022] via-[#0d1022]/40 to-black/30" />

          {/* Top Badges */}
          <div className="absolute top-3 inset-x-3 flex items-center justify-between">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-black/65 backdrop-blur-md text-[#dfb76c] border border-white/10 flex items-center space-x-1 font-mono">
              <Calendar className="w-3 h-3" />
              <span>{t('daysCount', { days: program.totalDays })}</span>
            </span>

            {isPremium && (
              <span className="px-2.5 py-0.5 rounded-full text-[9px] font-medium bg-black/65 backdrop-blur-md text-[#dfb76c] border border-[#dfb76c]/30 flex items-center space-x-1 font-mono">
                <Crown className="w-2.5 h-2.5 fill-[#dfb76c]" />
                <span>{t('premiumBadge')}</span>
              </span>
            )}
          </div>

          {/* Bottom Duration & Difficulty Pill */}
          <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[10px] text-stone-300 font-mono">
            <span>{program.difficulty}</span>
            <span className="flex items-center space-x-1 text-[#dfb76c]">
              <Clock className="w-3 h-3" />
              <span>{program.totalDurationFormatted || `${program.totalDays * 20}m`}</span>
            </span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-4 space-y-3">
          <div>
            <h3 className="font-serif text-[15px] font-medium text-white leading-snug group-hover:text-[#f3cf7a] transition-colors line-clamp-1">
              {program.title}
            </h3>
            <p className="text-xs text-stone-300 mt-1 line-clamp-2 font-light leading-relaxed">
              {program.subtitle}
            </p>
          </div>

          {/* Progress bar */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-stone-400">
                {hasStarted ? t('dayOf', { current: currentDay, total: program.totalDays }) : t('notStarted')}
              </span>
              <span className="text-[#dfb76c] font-semibold">{t('percentComplete', { percent: progressPct })}</span>
            </div>
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#a599e0] via-[#dfb76c] to-[#f3cf7a] rounded-full transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          {/* Footer Guide & Action */}
          <div className="pt-2 border-t border-white/[0.04] flex items-center justify-between">
            <div className="flex items-center space-x-2 min-w-0 pr-2">
              <img 
                src={program.mentorAvatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80'} 
                alt={program.mentorName}
                className="w-5 h-5 rounded-full object-cover border border-[#dfb76c]/40" 
              />
              <span className="text-[11px] text-stone-300 truncate font-light">
                {program.mentorName}
              </span>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                openProgramDetail(program);
              }}
              className="text-xs font-semibold text-[#dfb76c] hover:text-[#f3cf7a] flex items-center space-x-0.5 flex-shrink-0"
            >
              <span>{hasStarted ? t('continueAction') : t('exploreAction')}</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-7 pb-24 pt-3 px-4 max-w-md mx-auto animate-fade-in select-none relative">
      {/* Subtle Ambient Glow Orb */}
      <div className="absolute -top-10 inset-x-0 h-72 pointer-events-none bg-gradient-to-b from-[#18233e]/30 via-[#101429]/10 to-transparent blur-3xl -z-10" />

      {/* Page Header */}
      <div>
        <div className="flex items-center space-x-1.5 text-xs text-[#a599e0] font-medium tracking-wide">
          <Sparkles className="w-3.5 h-3.5 text-[#dfb76c]" />
          <span>{t('curatedPaths')}</span>
        </div>
        <h1 className="font-serif text-[26px] font-medium tracking-tight text-white/95 mt-0.5">
          {t('journeyTitle')}
        </h1>
        <p className="text-xs text-stone-400 font-light mt-0.5 tracking-wide">
          {t('journeySub')}
        </p>
      </div>

      {/* Subtle Streak Card */}
      <div className="p-4 rounded-3xl specular-card flex items-center justify-between shadow-xl">
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#dfb76c]/20 to-[#a599e0]/20 border border-[#dfb76c]/30 flex items-center justify-center text-[#dfb76c] shadow-gold-glow">
            <Flame className="w-5 h-5 fill-current" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="text-sm font-semibold text-white">{t('streakTitle', { days: streakInfo.currentStreak })}</span>
              <span className="text-[10px] text-[#dfb76c] bg-[#dfb76c]/15 px-2 py-0.5 rounded-full font-mono border border-[#dfb76c]/30">
                {t('streakLongest', { days: streakInfo.longestStreak })}
              </span>
            </div>
            <p className="text-[11px] text-stone-400 font-light mt-0.5">
              {t('streakSub')}
            </p>
          </div>
        </div>
      </div>

      {/* SECTION A: CONTINUE YOUR JOURNEY */}
      {activeProgram && (
        <div className="space-y-3">
          <SectionHeader 
            title={t('continueJourney')} 
            subtitle={t('continueJourneySub')}
            icon={Flame}
          />

          <div 
            onClick={() => {
              openDailySession(activeProgram, activeProgress.current_day);
            }}
            className="group relative p-4 rounded-3xl bg-gradient-to-r from-[#181d3d] via-[#13172e] to-[#0d1022] border border-[#dfb76c]/30 hover:border-[#dfb76c]/60 transition-all cursor-pointer shadow-xl active:scale-[0.98]"
          >
            <div className="flex items-center space-x-4">
              <div className="relative w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 shadow-lg border border-white/10">
                <img 
                  src={activeProgram.coverUrl} 
                  alt={activeProgram.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <Play className="w-5 h-5 text-[#dfb76c] fill-[#dfb76c] ml-0.5" />
                </div>
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] text-[#dfb76c] font-bold uppercase tracking-wider font-mono">
                    {t('dayOf', { current: activeProgress.current_day, total: activeProgram.totalDays })}
                  </span>
                  <span className="text-[10px] text-stone-500">•</span>
                  <span className="text-[10px] text-stone-400 font-mono">
                    {t('percentComplete', { percent: activeProgress.progress_percentage })}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white truncate mt-0.5">
                  {activeProgram.title}
                </h3>
                <p className="text-xs text-stone-300 truncate font-light">
                  {t('guidedBy', { name: activeProgram.mentorName })}
                </p>

                {/* Progress bar line */}
                <div className="mt-2 flex items-center space-x-2">
                  <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#a599e0] via-[#dfb76c] to-[#f3cf7a] rounded-full" 
                      style={{ width: `${activeProgress.progress_percentage}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-[#dfb76c] font-semibold">{t('resumeBadge')}</span>
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
          icon={Sparkles}
        />
        <div className="flex space-x-3.5 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4">
          {recommendedPrograms.map(p => renderJourneyCard(p))}
        </div>
      </div>

      {/* SECTION C: SLEEP PROGRAMS */}
      <div className="space-y-3">
        <SectionHeader 
          title={t('sleepPrograms')} 
          subtitle={t('sleepProgramsSub')}
          icon={Moon}
        />
        <div className="flex space-x-3.5 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4">
          {sleepPrograms.map(p => renderJourneyCard(p))}
        </div>
      </div>

      {/* SECTION D: STRESS RELIEF PROGRAMS */}
      <div className="space-y-3">
        <SectionHeader 
          title={t('stressPrograms')} 
          subtitle={t('stressProgramsSub')}
          icon={Wind}
        />
        <div className="flex space-x-3.5 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4">
          {stressPrograms.map(p => renderJourneyCard(p))}
        </div>
      </div>

      {/* SECTION E: EMOTIONAL HEALING */}
      <div className="space-y-3">
        <SectionHeader 
          title={t('emotionalPrograms')} 
          subtitle={t('emotionalProgramsSub')}
          icon={Heart}
        />
        <div className="flex space-x-3.5 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4">
          {emotionalPrograms.map(p => renderJourneyCard(p))}
        </div>
      </div>

      {/* SECTION F: FOCUS & PRODUCTIVITY */}
      <div className="space-y-3">
        <SectionHeader 
          title={t('focusPrograms')} 
          subtitle={t('focusProgramsSub')}
          icon={Compass}
        />
        <div className="flex space-x-3.5 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4">
          {focusPrograms.map(p => renderJourneyCard(p))}
        </div>
      </div>

      {/* SECTION G: SPIRITUAL GROWTH */}
      <div className="space-y-3">
        <SectionHeader 
          title={t('spiritualPrograms')} 
          subtitle={t('spiritualProgramsSub')}
          icon={Sun}
        />
        <div className="flex space-x-3.5 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4">
          {spiritualPrograms.map(p => renderJourneyCard(p))}
        </div>
      </div>
    </div>
  );
};
