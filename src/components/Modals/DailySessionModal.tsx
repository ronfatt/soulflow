import React, { useState } from 'react';
import { 
  X, 
  Check, 
  Play, 
  Wind, 
  Sparkles, 
  Music, 
  BookOpen, 
  CheckCircle, 
  Clock, 
  ArrowRight,
  Flame,
  Volume2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAudio } from '../../context/AudioContext';
import { ProgramDayLesson } from '../../types';

export const DailySessionModal: React.FC = () => {
  const { 
    activeDailySession, 
    closeDailySession, 
    userProgramProgress, 
    completeDailyLesson, 
    completeProgramDay,
    tracks,
    showToast,
    openDailySession
  } = useApp();

  const { playTrack, currentTrack, isPlaying } = useAudio();
  const [reflectionText, setReflectionText] = useState('');
  const [showReflectionInput, setShowReflectionInput] = useState(false);

  if (!activeDailySession) return null;

  const { program, dayNumber } = activeDailySession;
  const day = program.days?.find(d => d.day_number === dayNumber) || {
    id: `${program.id}-day-${dayNumber}`,
    program_id: program.id,
    day_number: dayNumber,
    title: `Day ${dayNumber}: Daily Sacred Practice`,
    description: `Mindful restoration for day ${dayNumber}.`,
    intention: 'Allow your mind to let go of urgency and anchor into the present.',
    lessons: [
      { id: `${program.id}-day-${dayNumber}-l1`, content_type: 'breathing' as const, title: '5 min Grounding Breath', duration: 5, sort_order: 1, trackId: 'd0000000-0000-0000-0000-000000000002' },
      { id: `${program.id}-day-${dayNumber}-l2`, content_type: 'meditation' as const, title: '10 min Guided Meditation', duration: 10, sort_order: 2, trackId: 'd0000000-0000-0000-0000-000000000001' },
      { id: `${program.id}-day-${dayNumber}-l3`, content_type: 'healing_music' as const, title: '15 min Acoustic Sound Bath', duration: 15, sort_order: 3, trackId: 'd0000000-0000-0000-0000-000000000003' },
      { id: `${program.id}-day-${dayNumber}-l4`, content_type: 'reflection' as const, title: 'Daily Reflection & Journal', duration: 3, sort_order: 4 },
    ]
  };

  const progress = userProgramProgress[program.id];
  const completedLessons = progress?.completed_lessons || [];
  const isDayCompleted = progress?.completed_days?.includes(dayNumber);

  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'breathing': return Wind;
      case 'meditation': return Sparkles;
      case 'healing_music':
      case 'soundscape': return Music;
      case 'reflection': return BookOpen;
      default: return Sparkles;
    }
  };

  const handlePlayLesson = (lesson: ProgramDayLesson) => {
    const trackId = lesson.trackId || (lesson.content_type === 'breathing' ? 'd0000000-0000-0000-0000-000000000002' : 'd0000000-0000-0000-0000-000000000001');
    const track = tracks.find(t => t.id === trackId) || tracks[0];
    playTrack(track);
  };

  const handleToggleLesson = (lesson: ProgramDayLesson) => {
    completeDailyLesson(program.id, dayNumber, lesson.id);
  };

  const allLessonsDone = day.lessons.every(l => completedLessons.includes(l.id));

  const getContentTypeLabel = (type: string) => {
    switch (type) {
      case 'breathing': return '呼吸调息';
      case 'meditation': return '正念冥想';
      case 'healing_music': return '疗愈声波';
      case 'soundscape': return '自然音境';
      case 'reflection': return '觉察日志';
      default: return '修习单元';
    }
  };

  return (
    <div 
      onClick={closeDailySession}
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto animate-fade-in"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg bg-gradient-to-b from-[#12152a] via-[#0d1020] to-[#070914] border border-white/10 rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl text-white max-h-[92vh] flex flex-col"
      >
        {/* Top Header Bar */}
        <div className="p-5 pb-3 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#dfb76c]/15 text-[#dfb76c] text-[10px] font-mono font-bold uppercase tracking-wider border border-[#dfb76c]/30">
              {program.title}
            </span>
            <span className="text-xs text-stone-400">• 第 {dayNumber} 天 / 共 {program.totalDays} 天</span>
          </div>

          <button 
            onClick={closeDailySession}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-stone-300 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto no-scrollbar space-y-6">
          {/* Day Title & Intention */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-xs font-semibold text-[#a599e0]">
              <Flame className="w-3.5 h-3.5 text-[#dfb76c]" />
              <span>第 {dayNumber} 天 身心调频方案</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white">
              {day.title}
            </h2>
            <p className="text-xs text-stone-300 font-light leading-relaxed">
              {day.description}
            </p>
          </div>

          {/* Today's Intention Card */}
          <div className="p-4 rounded-2xl bg-[#171b35] border border-[#dfb76c]/25 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#dfb76c]/5 rounded-full blur-2xl pointer-events-none" />
            <span className="text-[10px] font-bold text-[#dfb76c] tracking-wider block font-mono">
              今日神圣修习心意
            </span>
            <p className="text-xs text-stone-200 font-light italic mt-1 leading-relaxed">
              "{day.intention || '允许思绪卸下紧迫与焦虑，安然锚定于当下的每一次呼吸。'}"
            </p>
          </div>

          {/* Day Completed Gentle Banner */}
          {(isDayCompleted || allLessonsDone) && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-[#173323] via-[#102419] to-[#0d1c13] border border-emerald-500/40 text-center space-y-1.5 animate-scale-up shadow-lg">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center border border-emerald-500/30">
                <CheckCircle className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">第 {dayNumber} 天 练习已圆满完成</h3>
              <p className="text-xs text-stone-300 font-light">
                今日你已悉心照拂了自己的身心与内在，感谢你的专注与坚持。
              </p>
              {dayNumber < program.totalDays && (
                <button
                  onClick={() => openDailySession(program, dayNumber + 1)}
                  className="mt-2 px-4 py-1.5 rounded-full bg-emerald-500 text-[#0a0c16] text-xs font-semibold hover:bg-emerald-400 transition-colors inline-flex items-center space-x-1"
                >
                  <span>预习第 {dayNumber + 1} 天</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}

          {/* Lessons List */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-stone-400 tracking-wider font-mono">
              今日修习序列（已完成 {day.lessons.filter(l => completedLessons.includes(l.id)).length}/{day.lessons.length}）
            </h3>

            <div className="space-y-2.5">
              {day.lessons.map((lesson, idx) => {
                const isCompleted = completedLessons.includes(lesson.id);
                const Icon = getLessonIcon(lesson.content_type);
                const isAudioPlaying = isPlaying && currentTrack?.id === lesson.trackId;

                return (
                  <div
                    key={lesson.id}
                    className={`p-3.5 rounded-2xl border transition-all ${
                      isCompleted 
                        ? 'bg-[#101526]/80 border-emerald-500/30' 
                        : 'bg-[#101324] border-white/5 hover:border-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center space-x-3 min-w-0">
                        {/* Step Number / Complete Indicator */}
                        <button
                          onClick={() => handleToggleLesson(lesson)}
                          className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs transition-colors flex-shrink-0 ${
                            isCompleted 
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' 
                              : 'bg-white/5 text-stone-400 hover:text-white hover:bg-white/10'
                          }`}
                          title={isCompleted ? '标记为未完成' : '标记为已完成'}
                        >
                          {isCompleted ? <Check className="w-4 h-4" /> : `${idx + 1}`}
                        </button>

                        <div className="min-w-0">
                          <div className="flex items-center space-x-1.5">
                            <Icon className="w-3.5 h-3.5 text-[#dfb76c] flex-shrink-0" />
                            <h4 className={`text-xs font-semibold truncate ${isCompleted ? 'text-stone-300' : 'text-white'}`}>
                              {lesson.title}
                            </h4>
                          </div>
                          <span className="text-[10px] text-stone-400 flex items-center space-x-1 mt-0.5 font-mono">
                            <Clock className="w-2.5 h-2.5" />
                            <span>{lesson.duration} 分钟 • {getContentTypeLabel(lesson.content_type)}</span>
                          </span>
                        </div>
                      </div>

                      {/* Right Controls */}
                      <div className="flex items-center space-x-2 flex-shrink-0">
                        {lesson.content_type !== 'reflection' ? (
                          <button
                            onClick={() => handlePlayLesson(lesson)}
                            className={`p-2 rounded-xl flex items-center justify-center transition-transform active:scale-95 ${
                              isAudioPlaying
                                ? 'bg-[#dfb76c] text-[#0a0c16]'
                                : 'bg-white/10 hover:bg-white/15 text-stone-200'
                            }`}
                            title="播放音频练习"
                          >
                            {isAudioPlaying ? (
                              <Volume2 className="w-3.5 h-3.5 animate-pulse" />
                            ) : (
                              <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                            )}
                          </button>
                        ) : (
                          <button
                            onClick={() => setShowReflectionInput(!showReflectionInput)}
                            className="px-2.5 py-1 rounded-xl bg-white/10 hover:bg-white/15 text-stone-300 text-[10px] font-medium"
                          >
                            {showReflectionInput ? '收起' : '记录觉察'}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Reflection input if open */}
                    {lesson.content_type === 'reflection' && showReflectionInput && (
                      <div className="mt-3 pt-3 border-t border-white/5 space-y-2">
                        <textarea
                          rows={2}
                          value={reflectionText}
                          onChange={(e) => setReflectionText(e.target.value)}
                          placeholder="记录下今日练习带来的灵感洞见或身体的微妙舒展与感知..."
                          className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-stone-200 placeholder-stone-500 focus:outline-none focus:border-[#dfb76c]"
                        />
                        <div className="flex justify-end">
                          <button
                            onClick={() => {
                              handleToggleLesson(lesson);
                              setShowReflectionInput(false);
                              showToast('觉察手记已珍藏于您的圣殿日志 🌿');
                            }}
                            className="px-3 py-1 rounded-xl bg-[#dfb76c] text-[#0a0c16] text-[10px] font-bold"
                          >
                            保存手记
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Complete Day Button */}
          {!isDayCompleted && (
            <button
              onClick={() => {
                completeProgramDay(program.id, dayNumber);
              }}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#dfb76c] to-[#f3cf7a] text-[#0a0c16] font-bold text-xs shadow-gold-glow flex items-center justify-center space-x-2 active:scale-98 transition-transform"
            >
              <CheckCircle className="w-4 h-4" />
              <span>完成今日修习</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
