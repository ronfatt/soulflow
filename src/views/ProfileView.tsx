import React, { useState } from 'react';
import { 
  Crown, 
  Sparkles, 
  MapPin, 
  Heart, 
  Download, 
  Gift, 
  Bell, 
  Globe, 
  Settings, 
  HelpCircle, 
  LogOut, 
  ChevronRight, 
  ShieldCheck, 
  Sliders, 
  LayoutDashboard,
  Check,
  Copy,
  Award,
  Users
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ProfileView: React.FC = () => {
  const { 
    user, 
    setShowMembershipModal, 
    setShowOnboarding, 
    setShowAuthModal, 
    setIsAdminView, 
    setIsMentorView,
    setActiveTab, 
    showToast,
    mentors,
    followingMentors,
    streakInfo,
    openMentorDetail,
    language,
    setLanguage,
    t
  } = useApp();

  const [copiedReferral, setCopiedReferral] = useState(false);
  const [showReferralModal, setShowReferralModal] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  const followedMentorsList = mentors.filter(m => followingMentors.includes(m.id));
  const referringMentor = mentors.find(m => m.referralCode === user.referredByCode);

  const handleCopyCode = () => {
    navigator.clipboard.writeText('SOUL-ALICIA2026');
    setCopiedReferral(true);
    showToast(t('codeCopied'));
    setTimeout(() => setCopiedReferral(false), 3000);
  };

  const handleLogout = () => {
    setShowAuthModal(true);
    showToast(language === 'zh' ? '已安全退出登录' : 'Logged out of session');
  };

  const handleSwitchLanguage = (lang: 'zh' | 'en') => {
    setLanguage(lang);
    setShowLanguageModal(false);
    showToast(lang === 'zh' ? '已切换至 简体中文（默认）' : 'Language switched to English (US)');
  };

  const menuSections = [
    {
      title: t('profilePractice'),
      items: [
        { 
          label: language === 'zh' ? '我的会员订阅' : 'My Subscription', 
          icon: Crown, 
          value: user.membershipStatus === 'free' ? t('planFree') : (user.membershipStatus === 'premium' ? t('planPremium') : t('planPremiumPlus')), 
          action: () => setShowMembershipModal(true), 
          highlight: true 
        },
        { 
          label: language === 'zh' ? '我的蜕变旅程' : 'My Journey', 
          icon: MapPin, 
          value: `${streakInfo.currentStreak} ${t('days')}`, 
          action: () => setActiveTab('journey') 
        },
        { 
          label: language === 'zh' ? '已关注导师' : 'Following Mentors', 
          icon: Users, 
          value: t('followingCount', { count: followedMentorsList.length }), 
          action: () => setActiveTab('explore') 
        },
        { 
          label: language === 'zh' ? '圣殿收藏' : 'Favorite Content', 
          icon: Heart, 
          action: () => setActiveTab('library') 
        },
        { 
          label: language === 'zh' ? '离线缓存' : 'Downloads', 
          icon: Download, 
          action: () => setActiveTab('library') 
        },
      ],
    },
    {
      title: t('profileReferrals'),
      items: [
        { 
          label: t('myReferralCode'), 
          icon: Gift, 
          value: 'SOUL-ALICIA', 
          action: () => setShowReferralModal(true) 
        },
        { 
          label: t('mentorPartnerPortal'), 
          icon: Award, 
          value: t('mentorCommissions'), 
          highlight: true, 
          action: () => setIsMentorView(true) 
        },
      ],
    },
    {
      title: t('profileSettings'),
      items: [
        { 
          label: language === 'zh' ? '推送与正念提醒' : 'Notification Settings', 
          icon: Bell, 
          value: language === 'zh' ? '已开启' : 'Enabled', 
          action: () => showToast(language === 'zh' ? '每日晨起与睡前正念提醒已就绪' : 'Notifications are active') 
        },
        { 
          label: t('languageSetting'), 
          icon: Globe, 
          value: language === 'zh' ? '简体中文' : 'English', 
          highlight: true,
          action: () => setShowLanguageModal(true) 
        },
        { 
          label: language === 'zh' ? '身心健康定制问卷' : 'Wellness Personalization', 
          icon: Sliders, 
          action: () => setShowOnboarding(true) 
        },
        { 
          label: language === 'zh' ? '账户与安全' : 'Account Settings', 
          icon: Settings, 
          action: () => showToast(language === 'zh' ? '账户认证状态良好' : 'Account is verified') 
        },
        { 
          label: language === 'zh' ? '专属客服与圣殿指引' : 'Help Center & Support', 
          icon: HelpCircle, 
          action: () => showToast('support@soulflow.wellness') 
        },
      ],
    },
  ];

  return (
    <div className="space-y-6 pb-28 pt-3 px-4 max-w-md mx-auto animate-fade-in relative">
      {/* Subtle Ambient Glow */}
      <div className="absolute -top-10 inset-x-0 h-64 pointer-events-none bg-gradient-to-b from-[#1b1c38]/30 to-transparent blur-3xl -z-10" />

      {/* Top Profile Card */}
      <div className="relative p-5 rounded-3xl specular-card shadow-2xl text-center">
        {/* Switch buttons to Mentor & Admin Portals */}
        <div className="absolute top-4 right-4 flex items-center space-x-1.5">
          <button
            onClick={() => setIsMentorView(true)}
            className="p-1.5 px-2.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/25 text-purple-300 text-xs flex items-center space-x-1 transition-all active:scale-95"
            title="Mentor Partner Portal"
          >
            <Award className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-[10px] font-semibold">Mentor</span>
          </button>

          <button
            onClick={() => setIsAdminView(true)}
            className="p-1.5 px-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-stone-300 hover:text-white text-xs flex items-center space-x-1 transition-all active:scale-95"
            title="Admin Dashboard"
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-[#dfb76c]" />
            <span className="text-[10px] font-semibold">Admin</span>
          </button>
        </div>

        {/* Profile Avatar */}
        <div className="relative w-20 h-20 rounded-full mx-auto overflow-hidden border-2 border-[#dfb76c] shadow-gold-glow mb-3">
          <img 
            src={user.avatarUrl} 
            alt={user.name} 
            className="w-full h-full object-cover" 
          />
        </div>

        <h2 className="font-serif text-xl font-medium text-white tracking-tight">{user.name}</h2>
        <p className="text-xs text-stone-400 mt-0.5 tracking-wide">{user.email}</p>

        {/* Referred by Banner if applicable */}
        {referringMentor && (
          <div className="mt-2 inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-[#dfb76c]/15 border border-[#dfb76c]/30 text-[10px] text-[#dfb76c] font-medium">
            <Sparkles className="w-3 h-3" />
            <span>{t('referredBy', { name: referringMentor.name })}</span>
          </div>
        )}

        {/* Membership Badge */}
        <div className="mt-3 inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#dfb76c]/15 border border-[#dfb76c]/30 text-[#dfb76c] text-xs font-semibold">
          <Crown className="w-3.5 h-3.5 fill-current" />
          <span className="uppercase tracking-wider">
            {user.membershipStatus === 'free' ? t('freeMemberBadge') : `SoulFlow ${user.membershipStatus === 'premium' ? 'Pro' : 'VIP'}`}
          </span>
        </div>

        {/* Subtle Streak Stats Grid */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-white/5 text-center">
          <div>
            <span className="text-sm font-bold text-white block font-mono">{streakInfo.currentStreak} {t('days')}</span>
            <span className="text-[9px] text-stone-400 uppercase tracking-wider">{language === 'zh' ? '连续修习' : 'Current Streak'}</span>
          </div>
          <div className="border-x border-white/5">
            <span className="text-sm font-bold text-[#dfb76c] block font-mono">{streakInfo.longestStreak} {t('days')}</span>
            <span className="text-[9px] text-stone-400 uppercase tracking-wider">{language === 'zh' ? '历史最佳' : 'Longest Streak'}</span>
          </div>
          <div>
            <span className="text-sm font-bold text-white block font-mono">{user.totalMinutesListened} {t('minutes')}</span>
            <span className="text-[9px] text-stone-400 uppercase tracking-wider">{language === 'zh' ? '心流静修' : 'Mindful Audio'}</span>
          </div>
        </div>
      </div>

      {/* FOLLOWING SECTION: Following Mentors */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
            {language === 'zh' ? `关注的导师 (${followedMentorsList.length})` : `Following (${followedMentorsList.length})`}
          </h3>
          <button
            onClick={() => setActiveTab('explore')}
            className="text-[11px] font-semibold text-[#dfb76c] hover:underline"
          >
            {language === 'zh' ? '探索导师智库 →' : 'Discover Guides →'}
          </button>
        </div>

        {followedMentorsList.length > 0 ? (
          <div className="flex space-x-2.5 overflow-x-auto no-scrollbar pb-1">
            {followedMentorsList.map(mentor => (
              <div
                key={mentor.id}
                onClick={() => openMentorDetail(mentor)}
                className="p-3 rounded-2xl bg-[#121528] hover:bg-[#181c35] border border-white/5 hover:border-[#dfb76c]/30 transition-all cursor-pointer flex items-center space-x-2.5 flex-shrink-0 w-52"
              >
                <img
                  src={mentor.avatarUrl}
                  alt={mentor.name}
                  className="w-10 h-10 rounded-xl object-cover border border-[#dfb76c]/30 flex-shrink-0"
                />
                <div className="min-w-0 pr-1">
                  <h4 className="text-xs font-bold text-white truncate">{mentor.name}</h4>
                  <p className="text-[10px] text-stone-400 truncate mt-0.5">{mentor.specialization}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-[#121528] border border-white/5 text-center text-xs text-stone-400">
            {language === 'zh' 
              ? '你尚未关注任何导师。探索世界级导师，定制你的专属身心修习。' 
              : "You haven't followed any mentors yet. Explore trusted guides to personalize your practices."}
          </div>
        )}
      </div>

      {/* Menu Sections */}
      {menuSections.map((sec, idx) => (
        <div key={idx} className="space-y-2">
          <h3 className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider px-2">
            {sec.title}
          </h3>

          <div className="rounded-2xl bg-[#121528] border border-white/5 divide-y divide-white/5 overflow-hidden">
            {sec.items.map((item, i) => {
              const Icon = item.icon;
              return (
                <button
                  key={i}
                  onClick={item.action}
                  className="w-full p-3.5 flex items-center justify-between text-left hover:bg-white/5 transition-colors group"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-1.5 rounded-xl ${item.highlight ? 'bg-[#dfb76c]/20 text-[#dfb76c]' : 'bg-white/5 text-stone-400 group-hover:text-stone-200'}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-medium text-stone-200 group-hover:text-white">
                      {item.label}
                    </span>
                  </div>

                  <div className="flex items-center space-x-1.5 text-xs text-stone-400">
                    {item.value && (
                      <span className={`text-[11px] font-medium ${item.highlight ? 'text-[#dfb76c] font-semibold' : ''}`}>
                        {item.value}
                      </span>
                    )}
                    <ChevronRight className="w-4 h-4 text-stone-500 group-hover:text-stone-300" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {/* Logout button */}
      <button
        onClick={handleLogout}
        className="w-full py-3 rounded-2xl bg-red-500/10 hover:bg-red-500/15 border border-red-500/20 text-red-300 text-xs font-semibold flex items-center justify-center space-x-2 transition-colors"
      >
        <LogOut className="w-4 h-4" />
        <span>{t('logout')}</span>
      </button>

      {/* Language Switcher Modal */}
      {showLanguageModal && (
        <div 
          onClick={() => setShowLanguageModal(false)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm bg-[#15192e] border border-white/10 rounded-3xl p-5 space-y-4"
          >
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#dfb76c]/15 text-[#dfb76c] flex items-center justify-center border border-[#dfb76c]/30">
                <Globe className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">{t('switchLanguageModalTitle')}</h3>
                <p className="text-[11px] text-stone-400">选择应用界面首选语言</p>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <button
                onClick={() => handleSwitchLanguage('zh')}
                className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                  language === 'zh' 
                    ? 'bg-[#dfb76c]/15 border-[#dfb76c]/60 text-white shadow-gold-glow' 
                    : 'bg-white/5 border-white/5 text-stone-300 hover:bg-white/10'
                }`}
              >
                <div>
                  <span className="text-xs font-bold block text-white">简体中文（默认）</span>
                  <span className="text-[10px] text-stone-400">东方心流美学与无损身心疗愈</span>
                </div>
                {language === 'zh' && (
                  <div className="w-5 h-5 rounded-full bg-[#dfb76c] text-[#0a0c16] flex items-center justify-center">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}
              </button>

              <button
                onClick={() => handleSwitchLanguage('en')}
                className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                  language === 'en' 
                    ? 'bg-[#dfb76c]/15 border-[#dfb76c]/60 text-white shadow-gold-glow' 
                    : 'bg-white/5 border-white/5 text-stone-300 hover:bg-white/10'
                }`}
              >
                <div>
                  <span className="text-xs font-bold block text-white">English (US)</span>
                  <span className="text-[10px] text-stone-400">Spatial Audio & Global Sacred Frequencies</span>
                </div>
                {language === 'en' && (
                  <div className="w-5 h-5 rounded-full bg-[#dfb76c] text-[#0a0c16] flex items-center justify-center">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}
              </button>
            </div>

            <button
              onClick={() => setShowLanguageModal(false)}
              className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-stone-300 text-xs font-medium"
            >
              {t('doneAction')}
            </button>
          </div>
        </div>
      )}

      {/* Referral Code Modal */}
      {showReferralModal && (
        <div 
          onClick={() => setShowReferralModal(false)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm bg-[#15192e] border border-white/10 rounded-3xl p-5 space-y-4 text-center"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#dfb76c]/20 border border-[#dfb76c]/40 flex items-center justify-center text-[#dfb76c] mx-auto shadow-gold-glow">
              <Gift className="w-6 h-6" />
            </div>

            <h3 className="text-base font-bold text-white">{t('giftDaysTitle')}</h3>
            <p className="text-xs text-stone-300 leading-relaxed">
              {t('giftDaysDesc')}
            </p>

            <div className="p-3 bg-black/50 border border-white/10 rounded-xl flex items-center justify-between">
              <span className="font-mono font-bold text-sm text-[#dfb76c]">SOUL-ALICIA2026</span>
              <button
                onClick={handleCopyCode}
                className="px-3 py-1 rounded-lg bg-[#dfb76c]/20 text-[#dfb76c] text-xs font-semibold flex items-center space-x-1"
              >
                {copiedReferral ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedReferral ? (language === 'zh' ? '已复制' : 'Copied') : (language === 'zh' ? '复制' : 'Copy')}</span>
              </button>
            </div>

            <button
              onClick={() => setShowReferralModal(false)}
              className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-stone-300 text-xs font-medium"
            >
              {t('doneAction')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
