import React from 'react';
import { 
  Home, 
  Compass, 
  MapPin, 
  Library, 
  User, 
  Sparkles, 
  Crown, 
  BookOpen, 
  Award, 
  ShieldCheck, 
  Smartphone, 
  Flame,
  Radio,
  Sliders
} from 'lucide-react';
import { useApp, MainTab } from '../../context/AppContext';

interface DesktopSidebarProps {
  onSwitchToMobile: () => void;
}

export const DesktopSidebar: React.FC<DesktopSidebarProps> = ({ onSwitchToMobile }) => {
  const { 
    activeTab, 
    setActiveTab, 
    user, 
    streakInfo,
    setShowMembershipModal, 
    setShowOnboarding, 
    setIsMentorView, 
    setIsAdminView, 
    openAISanctuary, 
    journalEntries,
    language 
  } = useApp();

  const navItems: Array<{ id: MainTab; label: string; icon: React.ElementType; badge?: string }> = [
    { id: 'home', label: '首页推荐', icon: Home },
    { id: 'explore', label: '探索声景', icon: Compass },
    { id: 'journey', label: '蜕变旅程', icon: MapPin, badge: `${streakInfo.currentStreak}天` },
    { id: 'library', label: '圣殿藏馆', icon: Library },
    { id: 'profile', label: '个人中心', icon: User },
  ];

  return (
    <aside className="w-72 h-screen fixed top-0 left-0 bg-[#070913]/98 backdrop-blur-3xl border-r border-white/[0.08] flex flex-col justify-between p-5 z-40 select-none overflow-y-auto no-scrollbar shadow-2xl">
      {/* Brand Header */}
      <div className="space-y-6">
        <div className="flex items-center space-x-3 px-2 pt-2">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#dfb76c] to-[#f3cf7a] text-[#0a0c16] flex items-center justify-center shadow-gold-glow flex-shrink-0">
            <Radio className="w-5 h-5 fill-current" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-serif text-lg font-bold tracking-wider text-white">SOULFLOW</span>
              <span className="w-2 h-2 rounded-full bg-[#dfb76c] animate-pulse" />
            </div>
            <p className="text-[11px] text-stone-400 font-light tracking-wide">
              心流 • 身心灵空间音频
            </p>
          </div>
        </div>

        {/* Primary Navigation Menu */}
        <nav className="space-y-1.5 pt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-medium transition-all group ${
                  isActive
                    ? 'bg-gradient-to-r from-[#dfb76c] to-[#f3cf7a] text-[#0a0c16] font-semibold shadow-gold-glow'
                    : 'text-stone-300 hover:text-white hover:bg-white/[0.06]'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 transition-transform ${isActive ? 'scale-110 text-[#0a0c16]' : 'text-[#dfb76c] group-hover:scale-110'}`} />
                  <span className="tracking-wide text-sm">{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                    isActive ? 'bg-black/20 text-[#0a0c16]' : 'bg-[#dfb76c]/15 text-[#dfb76c] border border-[#dfb76c]/30'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* 1v1 AI Spiritual Guide Card */}
        <div className="p-4 rounded-3xl bg-gradient-to-br from-[#1c1735]/90 via-[#101428]/95 to-[#0b0e1e] border border-[#dfb76c]/30 shadow-xl space-y-3 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-[#dfb76c]/10 blur-2xl pointer-events-none" />
          
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl overflow-hidden border border-[#dfb76c]/50 p-0.5 shadow-md flex-shrink-0">
              <img 
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80" 
                alt="Alicia" 
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] text-[#dfb76c] font-bold block">1V1 心灵导师</span>
              <h4 className="text-xs font-semibold text-white truncate">AI 倾听与声学处方</h4>
            </div>
          </div>

          <p className="text-[11px] text-stone-300 leading-relaxed font-light">
            感到疲惫或焦虑？与导师深度倾听，定制音乐疗愈仪式。
          </p>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => openAISanctuary('chat')}
              className="py-2 px-2.5 rounded-xl bg-gradient-to-r from-[#dfb76c] to-[#f3cf7a] text-[#0a0c16] font-bold text-xs flex items-center justify-center space-x-1 shadow-gold-glow hover:scale-[1.02] active:scale-95 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>开始倾听</span>
            </button>
            <button
              onClick={() => openAISanctuary('journal')}
              className="py-2 px-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-stone-200 text-xs font-medium flex items-center justify-center space-x-1 border border-white/10 active:scale-95 transition-all"
            >
              <BookOpen className="w-3 h-3 text-[#dfb76c]" />
              <span>日志 ({journalEntries.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Area: Membership Status & View Switcher */}
      <div className="space-y-3 pt-4 border-t border-white/[0.08]">
        {/* Membership Banner Card */}
        <div 
          onClick={() => setShowMembershipModal(true)}
          className="p-3.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 cursor-pointer transition-all flex items-center justify-between group"
        >
          <div className="flex items-center space-x-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-[#dfb76c]/15 text-[#dfb76c] flex items-center justify-center flex-shrink-0 border border-[#dfb76c]/30">
              <Crown className="w-4 h-4 fill-current" />
            </div>
            <div className="min-w-0">
              <span className="text-xs font-semibold text-white block truncate">
                {user.membershipStatus === 'free' ? '升级圣殿会员' : '尊享 VIP 会员'}
              </span>
              <span className="text-[10px] text-stone-400 truncate block">
                {user.membershipStatus === 'free' ? '畅听无损 432Hz 空间音频' : '特权生效中'}
              </span>
            </div>
          </div>
          <span className="text-[10px] text-[#dfb76c] font-semibold group-hover:translate-x-0.5 transition-transform flex-shrink-0">
            查看 →
          </span>
        </div>

        {/* Quick Management Portals */}
        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <button
            onClick={() => setIsMentorView(true)}
            className="py-2 px-2.5 rounded-xl bg-[#141830] hover:bg-[#1c2244] text-purple-300 border border-purple-500/20 flex items-center justify-center space-x-1.5 transition-colors"
          >
            <Award className="w-3.5 h-3.5 text-purple-400" />
            <span>导师工作台</span>
          </button>
          <button
            onClick={() => setIsAdminView(true)}
            className="py-2 px-2.5 rounded-xl bg-[#141830] hover:bg-[#1c2244] text-[#dfb76c] border border-[#dfb76c]/20 flex items-center justify-center space-x-1.5 transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#dfb76c]" />
            <span>管理后台</span>
          </button>
        </div>

        {/* Switch to Mobile Mode Toggle */}
        <button
          onClick={onSwitchToMobile}
          className="w-full py-2.5 px-3 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] text-stone-300 hover:text-white border border-white/10 text-xs font-medium flex items-center justify-center space-x-2 transition-all active:scale-95"
        >
          <Smartphone className="w-3.5 h-3.5 text-[#dfb76c]" />
          <span>切换至手机端真机模拟</span>
        </button>
      </div>
    </aside>
  );
};
