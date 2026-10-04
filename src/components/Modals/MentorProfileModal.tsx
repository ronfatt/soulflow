import React, { useState } from 'react';
import { 
  X, 
  Star, 
  Users, 
  GraduationCap, 
  Share2, 
  UserPlus, 
  Check, 
  Copy, 
  Sparkles, 
  Play, 
  BookOpen, 
  Calendar,
  Globe,
  Award,
  Clock,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAudio } from '../../context/AudioContext';
import { ContentCard } from '../Cards/ContentCard';

export const MentorProfileModal: React.FC = () => {
  const { 
    selectedMentor, 
    closeDetailModal, 
    tracks, 
    programs, 
    courses, 
    openProgramDetail, 
    openCourseDetail, 
    showToast,
    isFollowingMentor,
    toggleFollowMentor
  } = useApp();

  const [activeTab, setActiveTab] = useState<'about' | 'music' | 'meditations' | 'programs' | 'courses'>('about');
  const [copiedCode, setCopiedCode] = useState(false);

  if (!selectedMentor) return null;

  const isFollowing = isFollowingMentor(selectedMentor.id);
  const referralLink = `https://appdomain.com/signup?ref=${selectedMentor.referralCode}`;

  // Filter content created by this mentor
  const mentorTracks = tracks.filter(t => t.mentorId === selectedMentor.id || t.artistOrMentor === selectedMentor.name);
  const mentorMusic = mentorTracks.filter(t => t.category === 'healing_music' || t.category === 'sleep' || t.category === 'soundscape');
  const mentorMeditations = mentorTracks.filter(t => t.category === 'guided_meditation' || t.category === 'stress_relief' || t.category === 'spiritual' || t.category === 'focus');
  const mentorPrograms = programs.filter(p => p.mentorId === selectedMentor.id || p.mentorName === selectedMentor.name);
  const mentorCoursesList = courses.filter(c => c.mentorId === selectedMentor.id || c.mentorName === selectedMentor.name);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(selectedMentor.referralCode);
    setCopiedCode(true);
    showToast(`导师专属邀请码 ${selectedMentor.referralCode} 已复制到剪贴板！`);
    setTimeout(() => setCopiedCode(false), 3000);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${selectedMentor.name} 导师主页`,
        text: `邀你加入 SoulFlow 与 ${selectedMentor.name} 导师一同修习。使用邀请码 ${selectedMentor.referralCode} 即可尊享 7 天免费会员！`,
        url: referralLink,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(referralLink);
      showToast(`专属邀请链接已复制：${referralLink}`);
    }
  };

  const tabLabels: Record<'about' | 'music' | 'meditations' | 'programs' | 'courses', string> = {
    about: '导师简介',
    music: '疗愈音乐',
    meditations: '正念冥想',
    programs: '系统计划',
    courses: '大师课'
  };

  return (
    <div 
      onClick={closeDetailModal}
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto animate-fade-in"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-xl bg-[#0c0f20] border border-white/10 rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl text-white max-h-[92vh] flex flex-col"
      >
        {/* Top Cover Banner */}
        <div className="relative h-44 sm:h-52 w-full overflow-hidden flex-shrink-0">
          <img 
            src={selectedMentor.coverUrl} 
            alt={selectedMentor.name}
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c0f20] via-[#0c0f20]/40 to-black/30" />

          {/* Close button */}
          <button 
            onClick={closeDetailModal}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-md flex items-center justify-center text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="px-6 -mt-16 flex-1 overflow-y-auto no-scrollbar pb-6 space-y-5">
          {/* Avatar & Header Info */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="flex items-end space-x-4">
              <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-[#dfb76c] shadow-gold-glow flex-shrink-0 bg-[#121526]">
                <img 
                  src={selectedMentor.avatarUrl} 
                  alt={selectedMentor.name} 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="pb-1">
                <div className="flex items-center space-x-1.5">
                  <h2 className="text-xl font-bold text-white tracking-tight">{selectedMentor.name}</h2>
                  <Sparkles className="w-4 h-4 text-[#dfb76c] fill-[#dfb76c]" />
                </div>
                <p className="text-xs text-[#a599e0] font-medium">{selectedMentor.title}</p>
                <p className="text-[11px] text-stone-400 mt-0.5">{selectedMentor.specialization}</p>
              </div>
            </div>

            {/* Action Buttons: Follow, Share */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => toggleFollowMentor(selectedMentor.id)}
                className={`px-4 py-2 rounded-full text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-md active:scale-95 ${
                  isFollowing 
                    ? 'bg-white/10 text-stone-200 border border-white/10' 
                    : 'bg-gradient-to-r from-[#dfb76c] to-[#f3cf7a] text-[#0a0c16] shadow-gold-glow'
                }`}
              >
                {isFollowing ? <Check className="w-3.5 h-3.5" /> : <UserPlus className="w-3.5 h-3.5" />}
                <span>{isFollowing ? '已关注' : '关注导师'}</span>
              </button>

              <button
                onClick={handleShare}
                className="p-2.5 rounded-full bg-white/10 hover:bg-white/15 text-stone-300 transition-colors"
                title="分享导师邀请链接"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Social Stats Row: Followers, Students, Programs, Courses */}
          <div className="grid grid-cols-4 gap-1 py-3 px-3 rounded-2xl bg-[#141830] border border-white/5 text-center">
            <div>
              <div className="text-sm font-bold text-white font-mono">
                {(selectedMentor.followersCount / 1000).toFixed(1)}k
              </div>
              <span className="text-[9px] text-stone-400 tracking-wider block">关注者</span>
            </div>
            <div className="border-l border-white/5">
              <div className="text-sm font-bold text-white font-mono">
                {(selectedMentor.studentsCount / 1000).toFixed(1)}k
              </div>
              <span className="text-[9px] text-stone-400 tracking-wider block">修习学员</span>
            </div>
            <div className="border-l border-white/5">
              <div className="text-sm font-bold text-[#dfb76c] font-mono">
                {mentorPrograms.length || 1}
              </div>
              <span className="text-[9px] text-stone-400 tracking-wider block">系统计划</span>
            </div>
            <div className="border-l border-white/5">
              <div className="text-sm font-bold text-[#a599e0] font-mono">
                {mentorCoursesList.length || 1}
              </div>
              <span className="text-[9px] text-stone-400 tracking-wider block">大师课程</span>
            </div>
          </div>

          {/* Referral Code Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-[#211d3d] via-[#1a1c35] to-[#1a233b] border border-[#dfb76c]/30 space-y-2.5">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold tracking-wider text-[#dfb76c] font-mono block">
                  导师专属邀请码
                </span>
                <span className="text-base font-bold text-white font-mono tracking-wider">
                  {selectedMentor.referralCode}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleCopyCode}
                  className="px-3 py-1.5 rounded-xl bg-[#dfb76c]/20 hover:bg-[#dfb76c]/30 border border-[#dfb76c]/40 text-[#dfb76c] text-xs font-semibold flex items-center space-x-1"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? '已复制' : '复制邀请码'}</span>
                </button>

                <button
                  onClick={handleShare}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-stone-200 text-xs font-semibold flex items-center space-x-1"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>分享导师</span>
                </button>
              </div>
            </div>

            <p className="text-[11px] text-stone-300 font-light leading-relaxed">
              邀请朋友使用邀请码注册，好友可自动解锁 7 天免费圣殿 VIP 会员。
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center space-x-1 border-b border-white/10 pb-1 overflow-x-auto no-scrollbar">
            {(['about', 'music', 'meditations', 'programs', 'courses'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors flex-shrink-0 ${
                  activeTab === tab
                    ? 'bg-[#dfb76c]/15 text-[#dfb76c] font-semibold border border-[#dfb76c]/30'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                {tabLabels[tab]}
              </button>
            ))}
          </div>

          {/* Tab Content Panels */}
          {activeTab === 'about' && (
            <div className="space-y-4 text-xs text-stone-300 leading-relaxed">
              {/* Biography */}
              <div className="space-y-1">
                <h4 className="text-xs font-bold tracking-wider text-stone-400 font-mono">
                  导师生平与疗愈理念
                </h4>
                <p className="text-stone-300 leading-relaxed font-light">
                  {selectedMentor.bio}
                </p>
              </div>

              {/* Professional Background & Details Grid */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="p-3 rounded-xl bg-[#141830] border border-white/5 space-y-1">
                  <div className="flex items-center space-x-1.5 text-stone-400">
                    <Clock className="w-3.5 h-3.5 text-[#dfb76c]" />
                    <span className="text-[10px] uppercase font-mono">从业资历</span>
                  </div>
                  <span className="text-xs font-bold text-white block">
                    {selectedMentor.experience_years || 12} 年临床与身心修习经验
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[#141830] border border-white/5 space-y-1">
                  <div className="flex items-center space-x-1.5 text-stone-400">
                    <Globe className="w-3.5 h-3.5 text-[#dfb76c]" />
                    <span className="text-[10px] uppercase font-mono">修习语言</span>
                  </div>
                  <span className="text-xs font-bold text-white block">
                    {(selectedMentor.languages || ['中文', '英文']).join('、')}
                  </span>
                </div>
              </div>

              {/* Specialization */}
              <div className="p-3.5 rounded-2xl bg-[#141830] border border-white/5 space-y-1">
                <span className="text-[10px] font-mono tracking-wider text-stone-400">核心专注领域</span>
                <p className="text-xs font-semibold text-white">
                  {selectedMentor.specialization}
                </p>
              </div>

              {/* Certifications & Credentials */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold tracking-wider text-stone-400 font-mono">
                  专业资质与国际认证
                </h4>
                <div className="space-y-1.5">
                  {(selectedMentor.certifications || [
                    '国际声波能量疗愈师认证',
                    '资深正念冥想导师资格',
                    '身心整合减压（MBSR）导师'
                  ]).map((cert, i) => (
                    <div key={i} className="flex items-center space-x-2 text-stone-300 text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                      <span>{cert}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'music' && (
            <div className="space-y-2.5">
              {mentorMusic.length > 0 ? (
                mentorMusic.map(track => (
                  <ContentCard key={track.id} track={track} layout="row" onPlayList={mentorMusic} />
                ))
              ) : (
                <div className="space-y-2">
                  <p className="text-xs text-stone-400 py-3 text-center">精选疗愈音乐：</p>
                  {tracks.slice(0, 2).map(track => (
                    <ContentCard key={track.id} track={track} layout="row" onPlayList={tracks} />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'meditations' && (
            <div className="space-y-2.5">
              {mentorMeditations.length > 0 ? (
                mentorMeditations.map(track => (
                  <ContentCard key={track.id} track={track} layout="row" onPlayList={mentorMeditations} />
                ))
              ) : (
                <div className="space-y-2">
                  <p className="text-xs text-stone-400 py-3 text-center">精选正念冥想：</p>
                  {tracks.slice(2, 4).map(track => (
                    <ContentCard key={track.id} track={track} layout="row" onPlayList={tracks} />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'programs' && (
            <div className="space-y-3">
              {mentorPrograms.length > 0 ? (
                mentorPrograms.map(prog => (
                  <div
                    key={prog.id}
                    onClick={() => {
                      closeDetailModal();
                      openProgramDetail(prog);
                    }}
                    className="p-3.5 rounded-2xl bg-[#141830] hover:bg-[#1a1f3d] border border-white/5 cursor-pointer transition-all flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3 min-w-0 pr-2">
                      <img 
                        src={prog.coverUrl} 
                        alt={prog.title}
                        className="w-12 h-12 rounded-xl object-cover flex-shrink-0" 
                      />
                      <div className="min-w-0">
                        <h4 className="text-xs font-semibold text-white truncate">{prog.title}</h4>
                        <p className="text-[11px] text-stone-400 truncate">{prog.totalDays} 天计划 • {prog.difficulty}</p>
                      </div>
                    </div>
                    <span className="text-xs text-[#dfb76c] font-semibold flex-shrink-0">查看详情 →</span>
                  </div>
                ))
              ) : (
                <div 
                  onClick={() => {
                    closeDetailModal();
                    openProgramDetail(programs[0]);
                  }}
                  className="p-3.5 rounded-2xl bg-[#141830] hover:bg-[#1a1f3d] border border-white/5 cursor-pointer transition-all flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <img src={programs[0].coverUrl} alt="Program" className="w-12 h-12 rounded-xl object-cover" />
                    <div>
                      <h4 className="text-xs font-semibold text-white">{programs[0].title}</h4>
                      <p className="text-[11px] text-stone-400">{programs[0].totalDays} 天计划 • 圣殿特推系统修习方案</p>
                    </div>
                  </div>
                  <span className="text-xs text-[#dfb76c] font-semibold">查看详情 →</span>
                </div>
              )}
            </div>
          )}

          {activeTab === 'courses' && (
            <div className="space-y-3">
              {mentorCoursesList.length > 0 ? (
                mentorCoursesList.map(course => (
                  <div
                    key={course.id}
                    onClick={() => {
                      closeDetailModal();
                      openCourseDetail(course);
                    }}
                    className="p-4 rounded-2xl bg-[#141830] hover:bg-[#1a1f3d] border border-white/5 cursor-pointer transition-all flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3 min-w-0 pr-2">
                      <img 
                        src={course.coverUrl} 
                        alt={course.title}
                        className="w-14 h-14 rounded-xl object-cover flex-shrink-0" 
                      />
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-white truncate">{course.title}</h4>
                        <p className="text-[11px] text-stone-400 mt-0.5 line-clamp-1">{course.description}</p>
                        <span className="text-[10px] text-[#a599e0] font-medium block mt-1">
                          共 {course.totalLessons} 节课 • {course.durationHours} 小时
                        </span>
                      </div>
                    </div>
                    <button className="px-3 py-1.5 rounded-xl bg-white/10 text-xs font-medium text-white flex-shrink-0">
                      查看详情
                    </button>
                  </div>
                ))
              ) : (
                <div 
                  onClick={() => {
                    closeDetailModal();
                    openCourseDetail(courses[0]);
                  }}
                  className="p-4 rounded-2xl bg-[#141830] hover:bg-[#1a1f3d] border border-white/5 cursor-pointer transition-all flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3 min-w-0 pr-2">
                    <img src={courses[0].coverUrl} alt="Course" className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
                    <div>
                      <h4 className="text-xs font-bold text-white">{courses[0].title}</h4>
                      <p className="text-[11px] text-stone-400 mt-0.5 line-clamp-1">{courses[0].description}</p>
                      <span className="text-[10px] text-[#a599e0] font-medium block mt-1">大师课基础研习</span>
                    </div>
                  </div>
                  <button className="px-3 py-1.5 rounded-xl bg-white/10 text-xs font-medium text-white flex-shrink-0">
                    查看详情
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
