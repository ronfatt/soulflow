import React from 'react';
import { 
  X, 
  Play, 
  Clock, 
  Calendar, 
  Sparkles, 
  Crown,
  Check,
  Lock,
  ArrowRight,
  Flame,
  Wind,
  Music,
  BookOpen
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAudio } from '../../context/AudioContext';
import { ProgramDay } from '../../types';

export const ProgramDetailModal: React.FC = () => {
  const { 
    selectedProgram, 
    closeDetailModal, 
    user, 
    setShowMembershipModal,
    openDailySession,
    startProgram,
    userProgramProgress,
    mentors,
    openMentorDetail
  } = useApp();

  if (!selectedProgram) return null;

  const mentor = mentors.find(m => m.id === selectedProgram.mentorId);
  const progress = userProgramProgress[selectedProgram.id];
  const currentDay = progress?.current_day || 1;
  const completedDays = progress?.completed_days || [];
  const progressPct = progress?.progress_percentage || 0;
  const isStarted = Boolean(progress);
  const isPremium = Boolean(selectedProgram.is_premium || selectedProgram.tier !== 'free');
  const isUserFree = user.membershipStatus === 'free';

  const handleStartOrContinue = () => {
    if (!isStarted) {
      startProgram(selectedProgram.id);
    }
    // Check if the currentDay is locked
    if (isPremium && isUserFree && currentDay > 1) {
      setShowMembershipModal(true);
      return;
    }
    closeDetailModal();
    openDailySession(selectedProgram, currentDay);
  };

  const handleSelectDay = (dayNum: number) => {
    // Day 1 preview is allowed for free users
    if (isPremium && isUserFree && dayNum > 1) {
      setShowMembershipModal(true);
      return;
    }
    if (!isStarted) {
      startProgram(selectedProgram.id);
    }
    closeDetailModal();
    openDailySession(selectedProgram, dayNum);
  };

  const daysList: ProgramDay[] = selectedProgram.days || Array.from({ length: selectedProgram.totalDays }, (_, i) => ({
    id: `${selectedProgram.id}-d-${i + 1}`,
    program_id: selectedProgram.id,
    day_number: i + 1,
    title: `Day ${i + 1}: Sacred Practice`,
    description: 'Nervous system restoration and guided inner alignment.',
    intention: 'Allow your mind to let go of urgency and anchor into the present.',
    lessons: [
      { id: `${selectedProgram.id}-d-${i + 1}-l1`, content_type: 'breathing', title: '5 min Grounding Breath', duration: 5, sort_order: 1 },
      { id: `${selectedProgram.id}-d-${i + 1}-l2`, content_type: 'meditation', title: '10 min Guided Meditation', duration: 10, sort_order: 2 },
      { id: `${selectedProgram.id}-d-${i + 1}-l3`, content_type: 'healing_music', title: '15 min Acoustic Sound Bath', duration: 15, sort_order: 3 },
      { id: `${selectedProgram.id}-d-${i + 1}-l4`, content_type: 'reflection', title: 'Daily Reflection', duration: 3, sort_order: 4 },
    ]
  }));

  return (
    <div 
      onClick={closeDetailModal}
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto animate-fade-in"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg bg-[#0c0f22] border border-white/10 rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl text-white max-h-[92vh] flex flex-col"
      >
        {/* Large Hero Image */}
        <div className="relative h-56 sm:h-64 w-full overflow-hidden flex-shrink-0">
          <img 
            src={selectedProgram.coverUrl} 
            alt={selectedProgram.title}
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c0f22] via-[#0c0f22]/50 to-black/40" />

          {/* Close Button */}
          <button 
            onClick={closeDetailModal}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-md flex items-center justify-center text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Top Badges */}
          <div className="absolute top-4 left-4 flex items-center space-x-2">
            <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[#dfb76c] text-[10px] font-mono font-bold uppercase tracking-wider border border-[#dfb76c]/30 flex items-center space-x-1">
              <Calendar className="w-3 h-3" />
              <span>{selectedProgram.totalDays} Days</span>
            </span>

            {isPremium && (
              <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[#dfb76c] text-[10px] font-bold border border-[#dfb76c]/40 flex items-center space-x-1">
                <Crown className="w-3 h-3 fill-[#dfb76c]" />
                <span>PREMIUM</span>
              </span>
            )}
          </div>

          {/* Hero Metadata Title */}
          <div className="absolute bottom-4 left-6 right-6">
            <span className="text-[11px] text-[#a599e0] font-semibold uppercase tracking-wider block">
              {selectedProgram.difficulty} • {selectedProgram.totalDurationFormatted || `${selectedProgram.totalDays * 20} mins`}
            </span>
            <h1 className="text-2xl font-bold text-white tracking-tight mt-0.5 leading-snug">
              {selectedProgram.title}
            </h1>
            <p className="text-xs text-stone-300 font-light mt-1 line-clamp-1">
              {selectedProgram.subtitle}
            </p>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 flex-1 overflow-y-auto no-scrollbar space-y-6">
          {/* Mentor Profile Chip */}
          <div 
            onClick={() => {
              if (mentor) {
                closeDetailModal();
                openMentorDetail(mentor);
              }
            }}
            className="p-3 rounded-2xl bg-[#141832] hover:bg-[#1a1f3f] border border-white/5 flex items-center justify-between cursor-pointer transition-colors"
          >
            <div className="flex items-center space-x-3">
              <img 
                src={selectedProgram.mentorAvatar || mentor?.avatarUrl || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80'} 
                alt={selectedProgram.mentorName}
                className="w-11 h-11 rounded-xl object-cover border border-[#dfb76c]/40" 
              />
              <div>
                <span className="text-[10px] text-stone-400 uppercase tracking-wider block font-mono">Guide & Mentor</span>
                <h4 className="text-xs font-bold text-white flex items-center space-x-1">
                  <span>{selectedProgram.mentorName}</span>
                  <Sparkles className="w-3 h-3 text-[#dfb76c]" />
                </h4>
              </div>
            </div>
            <span className="text-xs font-medium text-[#dfb76c]">View Profile →</span>
          </div>

          {/* Primary CTA Button: Start or Continue */}
          <div>
            <button
              onClick={handleStartOrContinue}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#dfb76c] via-[#ecd084] to-[#f3cf7a] text-[#0a0c16] font-bold text-sm shadow-gold-glow flex items-center justify-center space-x-2 active:scale-98 transition-transform"
            >
              <Play className="w-4 h-4 fill-current ml-0.5" />
              <span>{isStarted ? `Continue Journey • Day ${currentDay}` : 'Start Journey'}</span>
            </button>
          </div>

          {/* User Progress Overview */}
          <div className="p-4 rounded-2xl bg-[#13162e] border border-white/5 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-stone-300 font-medium">Your Progress</span>
              <span className="text-[#dfb76c] font-bold font-mono">
                {progressPct}% ({completedDays.length}/{selectedProgram.totalDays} Days Completed)
              </span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#a599e0] via-[#dfb76c] to-[#f3cf7a] rounded-full transition-all duration-700"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-stone-400 font-light pt-0.5">
              <span>Current: Day {currentDay} of {selectedProgram.totalDays}</span>
              <span>{selectedProgram.totalDays - completedDays.length} Days Remaining</span>
            </div>
          </div>

          {/* Program Description */}
          <div className="space-y-1.5">
            <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider font-mono">
              About This Protocol
            </h3>
            <p className="text-xs text-stone-300 font-light leading-relaxed">
              {selectedProgram.description}
            </p>
          </div>

          {/* Program Daily Structure */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider font-mono">
                Daily Curriculum ({selectedProgram.totalDays} Days)
              </h3>
              {isPremium && isUserFree && (
                <span className="text-[10px] text-[#dfb76c] font-medium">Day 1 Free Preview</span>
              )}
            </div>

            <div className="space-y-2.5">
              {daysList.map((day) => {
                const dayNum = day.day_number;
                const isCompleted = completedDays.includes(dayNum);
                const isLocked = isPremium && isUserFree && dayNum > 1;

                return (
                  <div
                    key={day.id}
                    onClick={() => handleSelectDay(dayNum)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      isCompleted 
                        ? 'bg-[#101928] border-emerald-500/30'
                        : isLocked 
                          ? 'bg-[#0f1224]/60 border-white/[0.04] opacity-80'
                          : 'bg-[#121528] border-white/5 hover:border-[#dfb76c]/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 min-w-0 pr-2">
                        {/* Day indicator badge */}
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                          isCompleted
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                            : isLocked 
                              ? 'bg-black/40 text-stone-500 border border-white/5'
                              : 'bg-[#dfb76c]/15 text-[#dfb76c] border border-[#dfb76c]/30'
                        }`}>
                          {isCompleted ? <Check className="w-4 h-4" /> : `D${dayNum}`}
                        </div>

                        <div className="min-w-0">
                          <h4 className="text-xs font-semibold text-white truncate">
                            {day.title}
                          </h4>
                          <p className="text-[11px] text-stone-400 truncate mt-0.5 font-light">
                            {day.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 flex-shrink-0">
                        {isLocked ? (
                          <div className="p-2 rounded-xl bg-black/40 text-[#dfb76c] border border-white/10 flex items-center space-x-1">
                            <Crown className="w-3.5 h-3.5 fill-[#dfb76c]" />
                            <Lock className="w-3 h-3 text-stone-400" />
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 flex items-center justify-center transition-colors">
                            <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Breakdown of day contents: Breathing, Meditation, Soundscape, Reflection */}
                    <div className="mt-2.5 pt-2 border-t border-white/[0.04] flex items-center space-x-3 text-[10px] text-stone-400">
                      <span className="flex items-center space-x-1">
                        <Wind className="w-3 h-3 text-[#dfb76c]" />
                        <span>Breathing</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center space-x-1">
                        <Sparkles className="w-3 h-3 text-[#a599e0]" />
                        <span>Meditation</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center space-x-1">
                        <Music className="w-3 h-3 text-[#dfb76c]" />
                        <span>Sound Bath</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center space-x-1">
                        <BookOpen className="w-3 h-3 text-stone-400" />
                        <span>Reflection</span>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
