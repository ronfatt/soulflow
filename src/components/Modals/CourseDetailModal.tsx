import React from 'react';
import { X, Play, Clock, Crown, Sparkles, BookOpen } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAudio } from '../../context/AudioContext';

export const CourseDetailModal: React.FC = () => {
  const { selectedCourse, closeDetailModal, user, setShowMembershipModal } = useApp();
  const { playTrack } = useAudio();

  if (!selectedCourse) return null;

  const isLocked = selectedCourse.tier === 'premium_plus' && user.membershipStatus !== 'premium_plus';

  const handlePlayLesson = (lesson: { title: string; audioUrl: string; durationFormatted: string; summary: string }) => {
    if (isLocked) {
      setShowMembershipModal(true);
      return;
    }
    // Launch lesson audio
    playTrack({
      id: `lesson-${Date.now()}`,
      title: lesson.title,
      artistOrMentor: selectedCourse.mentorName,
      category: 'mentor_courses',
      categoryLabel: 'Mentor Course',
      mood: 'meditation',
      durationSeconds: 1500,
      durationFormatted: lesson.durationFormatted,
      coverUrl: selectedCourse.coverUrl,
      audioUrl: lesson.audioUrl,
      tier: 'premium_plus',
      plays: 5400,
      likes: 1200,
      description: lesson.summary,
      published: true,
    });
  };

  return (
    <div 
      onClick={closeDetailModal}
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg bg-[#0e1124] border border-white/10 rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl text-white max-h-[92vh] flex flex-col"
      >
        <div className="relative h-44 w-full overflow-hidden flex-shrink-0">
          <img 
            src={selectedCourse.coverUrl} 
            alt={selectedCourse.title} 
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0e1124] via-[#0e1124]/40 to-black/40" />

          <button 
            onClick={closeDetailModal}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center text-white"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="absolute bottom-3 left-6 right-6">
            <span className="px-2 py-0.5 rounded-full bg-[#a599e0]/20 text-[#c4b5fd] text-[10px] font-bold uppercase tracking-wider border border-[#a599e0]/30">
              Mentor Masterclass
            </span>
            <h2 className="text-lg font-bold text-white mt-1 leading-snug">{selectedCourse.title}</h2>
          </div>
        </div>

        <div className="p-6 flex-1 overflow-y-auto no-scrollbar space-y-4">
          <div className="flex items-center space-x-3 p-3 rounded-2xl bg-[#141830] border border-white/5">
            <img 
              src={selectedCourse.mentorAvatar} 
              alt={selectedCourse.mentorName} 
              className="w-10 h-10 rounded-xl object-cover border border-[#dfb76c]"
            />
            <div>
              <h4 className="text-xs font-bold text-white">{selectedCourse.mentorName}</h4>
              <p className="text-[11px] text-stone-400">Master Instructor • {selectedCourse.durationHours} Hours total</p>
            </div>
          </div>

          <p className="text-xs text-stone-300 leading-relaxed">
            {selectedCourse.description}
          </p>

          <div className="space-y-2.5">
            <h3 className="text-sm font-semibold text-white">Course Curriculum</h3>
            {selectedCourse.lessons.map((lesson) => (
              <div 
                key={lesson.id}
                onClick={() => handlePlayLesson(lesson)}
                className="p-3 rounded-2xl bg-[#121528] hover:bg-[#181c35] border border-white/5 cursor-pointer transition-all flex items-center justify-between"
              >
                <div className="flex items-center space-x-3 min-w-0 pr-2">
                  <span className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-xs font-bold text-stone-400 flex-shrink-0">
                    {lesson.lessonNumber}
                  </span>
                  <div className="min-w-0">
                    <h5 className="text-xs font-semibold text-white truncate">{lesson.title}</h5>
                    <p className="text-[10px] text-stone-400 mt-0.5 line-clamp-1">{lesson.summary}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 flex-shrink-0">
                  <span className="text-[10px] text-stone-400 font-mono">{lesson.durationFormatted}</span>
                  <button className="w-8 h-8 rounded-full bg-[#dfb76c] text-[#0a0c16] flex items-center justify-center">
                    <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
