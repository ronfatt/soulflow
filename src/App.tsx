import React from 'react';
import { useApp } from './context/AppContext';
import { useAudio } from './context/AudioContext';
import { HomeView } from './views/HomeView';
import { ExploreView } from './views/ExploreView';
import { JourneyView } from './views/JourneyView';
import { LibraryView } from './views/LibraryView';
import { ProfileView } from './views/ProfileView';
import { AdminDashboardView } from './views/AdminDashboardView';
import { MentorDashboardView } from './views/MentorDashboardView';
import { BottomNavigation } from './components/Navigation/BottomNavigation';
import { DesktopSidebar } from './components/Navigation/DesktopSidebar';
import { MiniPlayer } from './components/AudioPlayer/MiniPlayer';
import { DesktopMasterPlayer } from './components/AudioPlayer/DesktopMasterPlayer';
import { FullScreenPlayer } from './components/AudioPlayer/FullScreenPlayer';
import { MentorProfileModal } from './components/Modals/MentorProfileModal';
import { ProgramDetailModal } from './components/Modals/ProgramDetailModal';
import { DailySessionModal } from './components/Modals/DailySessionModal';
import { CourseDetailModal } from './components/Modals/CourseDetailModal';
import { MembershipModal } from './components/Modals/MembershipModal';
import { CheckoutModal } from './components/Modals/CheckoutModal';
import { OnboardingModal } from './components/Modals/OnboardingModal';
import { AuthModal } from './components/Modals/AuthModal';
import { AISanctuaryModal } from './components/AISanctuary/AISanctuaryModal';
import { 
  Smartphone, 
  Monitor, 
  ShieldCheck, 
  Sparkles, 
  Wifi, 
  Battery, 
  Award, 
  ChevronDown, 
  Compass, 
  BookOpen,
  Crown
} from 'lucide-react';

export const App: React.FC = () => {
  const { 
    activeTab, 
    isAdminView, 
    setIsAdminView, 
    isMentorView, 
    setIsMentorView,
    isMobileFrame, 
    setIsMobileFrame, 
    toastMessage,
    setShowOnboarding,
    setShowMembershipModal,
    showCheckoutModal,
    checkoutParams,
    openCheckoutModal,
    closeCheckoutModal,
    openAISanctuary,
    user
  } = useApp();

  const [showPortalMenu, setShowPortalMenu] = React.useState(false);

  // If in Mentor Portal view
  if (isMentorView) {
    return <MentorDashboardView />;
  }

  // If in Admin Dashboard view, render admin mode directly
  if (isAdminView) {
    return <AdminDashboardView />;
  }

  return (
    <div className="relative min-h-screen bg-[#05070e] text-[#faf8f5] select-none font-sans overflow-x-hidden">
      {/* Studio Ambient Aura Orbs Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 left-1/4 w-[600px] h-[600px] rounded-full bg-[#1b1c38]/25 blur-[140px]" />
        <div className="absolute -bottom-40 right-1/4 w-[600px] h-[600px] rounded-full bg-[#2a2215]/20 blur-[150px]" />
      </div>

      {/* ========================================================= */}
      {/* 1. DESKTOP STUDIO MODE (宽屏桌面端全功能控制面板)            */}
      {/* ========================================================= */}
      {!isMobileFrame ? (
        <div className="relative min-h-screen flex flex-col z-10">
          {/* Fixed Left Navigation Sidebar */}
          <DesktopSidebar onSwitchToMobile={() => setIsMobileFrame(true)} />

          {/* Main Desktop Scrollable Content Canvas */}
          <main className="flex-1 ml-0 lg:ml-72 min-h-screen pb-32 flex flex-col">
            {/* Top Desktop Navigation Header Bar */}
            <header className="sticky top-0 z-30 bg-[#05070e]/85 backdrop-blur-2xl border-b border-white/[0.06] px-6 lg:px-12 py-3.5 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="w-2.5 h-2.5 rounded-full bg-[#dfb76c] shadow-[0_0_12px_#dfb76c] animate-pulse" />
                <span className="text-xs text-stone-300 font-medium">
                  心流空间音频 • 432Hz 索尔菲吉奥纯净母带声场已载入
                </span>
              </div>

              <div className="flex items-center space-x-3">
                {/* Switch to Mobile Frame Button */}
                <button
                  onClick={() => setIsMobileFrame(true)}
                  className="px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-stone-300 hover:text-white border border-white/10 text-xs font-medium flex items-center space-x-1.5 transition-all active:scale-95"
                  title="切换至移动端手机真机模拟"
                >
                  <Smartphone className="w-3.5 h-3.5 text-[#dfb76c]" />
                  <span>切换为手机视图</span>
                </button>

                {/* 1v1 AI Companion Quick Access */}
                <button
                  onClick={() => openAISanctuary('chat')}
                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#dfb76c] to-[#f3cf7a] text-[#0a0c16] text-xs font-bold flex items-center space-x-1.5 shadow-gold-glow hover:scale-105 active:scale-95 transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI 心灵导师 1v1</span>
                </button>

                {/* Membership Badge */}
                <button
                  onClick={() => setShowMembershipModal(true)}
                  className="px-3 py-1.5 rounded-xl bg-[#dfb76c]/15 hover:bg-[#dfb76c]/25 border border-[#dfb76c]/40 text-[#dfb76c] text-xs font-semibold flex items-center space-x-1.5 transition-all"
                >
                  <Crown className="w-3.5 h-3.5 fill-current" />
                  <span>{user.membershipStatus === 'free' ? '升级尊享 VIP' : '尊享会员'}</span>
                </button>

                {/* System Portals Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowPortalMenu(!showPortalMenu)}
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#0d1020] hover:bg-[#151933] border border-white/10 text-stone-300 hover:text-white text-xs transition-all"
                  >
                    <Compass className="w-3.5 h-3.5 text-[#dfb76c]" />
                    <span>系统管理</span>
                    <ChevronDown className="w-3 h-3 text-stone-500" />
                  </button>

                  {showPortalMenu && (
                    <div 
                      className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#0e1226]/98 backdrop-blur-2xl border border-white/10 shadow-2xl p-1.5 z-50 animate-fade-in"
                      onMouseLeave={() => setShowPortalMenu(false)}
                    >
                      <button
                        onClick={() => { openAISanctuary('chat'); setShowPortalMenu(false); }}
                        className="w-full px-3 py-2 rounded-xl text-left text-xs text-[#dfb76c] hover:bg-[#dfb76c]/10 flex items-center space-x-2 font-medium"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-[#dfb76c]" />
                        <span>AI 导师 1v1 倾听与日志</span>
                      </button>

                      <button
                        onClick={() => { setShowOnboarding(true); setShowPortalMenu(false); }}
                        className="w-full px-3 py-2 rounded-xl text-left text-xs text-stone-300 hover:text-white hover:bg-white/5 flex items-center space-x-2"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-stone-400" />
                        <span>身心健康定制问卷</span>
                      </button>

                      <button
                        onClick={() => { setIsMentorView(true); setIsAdminView(false); setShowPortalMenu(false); }}
                        className="w-full px-3 py-2 rounded-xl text-left text-xs text-purple-300 hover:bg-purple-500/10 flex items-center space-x-2"
                      >
                        <Award className="w-3.5 h-3.5 text-purple-400" />
                        <span>导师合伙人工作台</span>
                      </button>

                      <button
                        onClick={() => { setIsAdminView(true); setIsMentorView(false); setShowPortalMenu(false); }}
                        className="w-full px-3 py-2 rounded-xl text-left text-xs text-[#dfb76c] hover:bg-[#dfb76c]/10 flex items-center space-x-2"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-[#dfb76c]" />
                        <span>总后台分销中枢</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </header>

            {/* View Content Display */}
            <div className="flex-1 w-full max-w-7xl mx-auto px-4 lg:px-8 py-6">
              {activeTab === 'home' && <HomeView />}
              {activeTab === 'explore' && <ExploreView />}
              {activeTab === 'journey' && <JourneyView />}
              {activeTab === 'library' && <LibraryView />}
              {activeTab === 'profile' && <ProfileView />}
            </div>
          </main>

          {/* Desktop Master Audio Player Spanning Screen Width */}
          <DesktopMasterPlayer />
        </div>
      ) : (
        /* ========================================================= */
        /* 2. MOBILE PHONE APP MODE (掌上真机模拟器模式)                */
        /* ========================================================= */
        <div className="min-h-screen flex flex-col items-center justify-center p-0 md:p-6">
          {/* Top Desktop Switcher Bar for simulated device */}
          <header className="hidden md:flex items-center justify-between w-full max-w-md mb-3 px-2 text-xs text-stone-400 z-20">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-[#dfb76c] shadow-[0_0_8px_#dfb76c] animate-pulse" />
              <span className="font-serif tracking-widest text-[#f5e4b8] font-medium text-xs">SOULFLOW 心流</span>
            </div>

            <button
              onClick={() => setIsMobileFrame(false)}
              className="px-3 py-1 rounded-xl bg-[#0d1020]/90 hover:bg-[#151933] border border-white/10 text-stone-300 hover:text-white flex items-center space-x-1.5 transition-all text-xs"
            >
              <Monitor className="w-3.5 h-3.5 text-[#dfb76c]" />
              <span>展开桌面控制台</span>
            </button>
          </header>

          {/* Simulated Mobile Phone Chassis */}
          <div className="relative w-full max-w-[424px] h-[100dvh] md:h-[880px] md:rounded-[54px] md:border-[11px] md:border-[#181a26] md:shadow-[0_30px_90px_rgba(0,0,0,0.95),_inset_0_0_0_1px_rgba(255,255,255,0.08)] bg-[#080a14] flex flex-col ring-1 ring-white/[0.08] overflow-hidden z-10">
            {/* iOS Dynamic Island & Simulated Status Bar */}
            <div className="sticky top-0 z-40 bg-[#080a14]/90 backdrop-blur-xl pt-2 px-6 pb-1 flex items-center justify-between text-xs text-stone-300 font-medium select-none">
              <span className="text-[12px] font-semibold tracking-tight">09:41</span>
              
              {/* Dynamic Island pill with sensor indicator */}
              <div className="w-28 h-6 bg-black rounded-full flex items-center justify-between px-2.5 border border-white/[0.06] shadow-inner">
                <span className="w-2 h-2 rounded-full bg-[#dfb76c] animate-pulse" />
                <span className="text-[9px] text-[#f5e4b8] font-mono tracking-tighter">
                  432Hz 疗愈
                </span>
                <div className="w-2 h-2 rounded-full bg-[#0a0d18] border border-white/10" />
              </div>

              <div className="flex items-center space-x-1.5 text-stone-300">
                <Wifi className="w-3.5 h-3.5" />
                <Battery className="w-4 h-4" />
              </div>
            </div>

            {/* Scrollable View Content */}
            <div className="flex-1 overflow-y-auto no-scrollbar relative">
              {activeTab === 'home' && <HomeView />}
              {activeTab === 'explore' && <ExploreView />}
              {activeTab === 'journey' && <JourneyView />}
              {activeTab === 'library' && <LibraryView />}
              {activeTab === 'profile' && <ProfileView />}
            </div>

            {/* Persistent Mini Player at bottom */}
            <div className="sticky bottom-14 z-30">
              <MiniPlayer />
            </div>

            {/* Bottom Navigation */}
            <BottomNavigation />
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. UNIVERSAL MODALS & POPUPS (共享交互式弹窗与全屏播放器)    */}
      {/* ========================================================= */}
      <FullScreenPlayer />
      <MentorProfileModal />
      <ProgramDetailModal />
      <DailySessionModal />
      <CourseDetailModal />
      <MembershipModal onOpenCheckout={(tier, cycle) => openCheckoutModal(tier, cycle)} />
      <CheckoutModal 
        isOpen={showCheckoutModal} 
        onClose={closeCheckoutModal} 
        selectedTier={checkoutParams.tier} 
        initialCycle={checkoutParams.cycle} 
      />
      <OnboardingModal />
      <AuthModal />
      <AISanctuaryModal />

      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-24 inset-x-4 z-50 flex justify-center pointer-events-none animate-bounce-short">
          <div className="px-4 py-2.5 rounded-2xl bg-[#1a1f3a]/95 backdrop-blur-xl border border-[#dfb76c]/40 text-[#f5e4b8] text-xs font-semibold shadow-2xl flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-[#dfb76c] flex-shrink-0" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
};
