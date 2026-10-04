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
import { MiniPlayer } from './components/AudioPlayer/MiniPlayer';
import { FullScreenPlayer } from './components/AudioPlayer/FullScreenPlayer';
import { MentorProfileModal } from './components/Modals/MentorProfileModal';
import { ProgramDetailModal } from './components/Modals/ProgramDetailModal';
import { DailySessionModal } from './components/Modals/DailySessionModal';
import { CourseDetailModal } from './components/Modals/CourseDetailModal';
import { MembershipModal } from './components/Modals/MembershipModal';
import { CheckoutModal } from './components/Modals/CheckoutModal';
import { OnboardingModal } from './components/Modals/OnboardingModal';
import { AuthModal } from './components/Modals/AuthModal';
import { Smartphone, Monitor, ShieldCheck, Sparkles, Wifi, Battery, Award, ChevronDown, Compass } from 'lucide-react';

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
    language,
    t 
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
    <div className="relative min-h-screen bg-[#05070e] text-[#faf8f5] flex flex-col items-center justify-center p-0 md:p-6 select-none font-sans overflow-hidden">
      {/* Studio Ambient Aura Orbs (Desktop) */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden hidden md:block">
        <div className="absolute -top-40 left-1/4 w-[500px] h-[500px] rounded-full bg-[#1b1c38]/25 blur-[120px]" />
        <div className="absolute -bottom-40 right-1/4 w-[500px] h-[500px] rounded-full bg-[#2a2215]/20 blur-[130px]" />
      </div>

      {/* Top Desktop Studio Bar */}
      <header className="hidden md:flex items-center justify-between w-full max-w-5xl mb-4 px-4 text-xs text-stone-400 z-10">
        <div className="flex items-center space-x-2.5">
          <span className="w-2 h-2 rounded-full bg-[#dfb76c] shadow-[0_0_10px_#dfb76c] animate-pulse" />
          <span className="font-serif tracking-widest text-[#f5e4b8] font-medium text-sm">SOULFLOW</span>
          <span className="text-[10px] text-stone-500 font-mono tracking-wider">
            {language === 'zh' ? '• 心流身心灵空间音频旗舰版' : '• SPATIAL WELLNESS RELEASE'}
          </span>
        </div>

        <div className="flex items-center space-x-2.5">
          {/* Hardware Device Mode Toggle */}
          <div className="flex items-center bg-[#0d1020]/90 p-1 rounded-2xl border border-white/[0.08] shadow-lg backdrop-blur-xl">
            <button
              onClick={() => setIsMobileFrame(true)}
              className={`px-3 py-1.5 rounded-xl flex items-center space-x-1.5 transition-all text-xs ${
                isMobileFrame ? 'bg-gradient-to-r from-[#dfb76c] to-[#f3cf7a] text-[#0a0c16] font-semibold shadow-sm' : 'text-stone-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>{language === 'zh' ? '掌上真机' : 'Studio Handset'}</span>
            </button>

            <button
              onClick={() => setIsMobileFrame(false)}
              className={`px-3 py-1.5 rounded-xl flex items-center space-x-1.5 transition-all text-xs ${
                !isMobileFrame ? 'bg-gradient-to-r from-[#dfb76c] to-[#f3cf7a] text-[#0a0c16] font-semibold shadow-sm' : 'text-stone-400 hover:text-white'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>{language === 'zh' ? '宽屏模式' : 'Expanded View'}</span>
            </button>
          </div>

          {/* Discreet Portals Menu */}
          <div className="relative">
            <button
              onClick={() => setShowPortalMenu(!showPortalMenu)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-2xl bg-[#0d1020]/90 hover:bg-[#151933] border border-white/[0.08] text-stone-300 hover:text-white transition-all text-xs backdrop-blur-xl"
            >
              <Compass className="w-3.5 h-3.5 text-[#dfb76c]" />
              <span>{language === 'zh' ? '系统入口与管理' : 'Portals & Views'}</span>
              <ChevronDown className="w-3 h-3 text-stone-500" />
            </button>

            {showPortalMenu && (
              <div 
                className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#0e1226]/95 backdrop-blur-2xl border border-white/10 shadow-2xl p-1.5 z-50 animate-fade-in"
                onMouseLeave={() => setShowPortalMenu(false)}
              >
                <button
                  onClick={() => { setShowOnboarding(true); setShowPortalMenu(false); }}
                  className="w-full px-3 py-2 rounded-xl text-left text-xs text-stone-300 hover:text-white hover:bg-white/5 flex items-center space-x-2 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#dfb76c]" />
                  <span>{language === 'zh' ? '身心偏好问卷 (Onboarding)' : 'Onboarding Journey'}</span>
                </button>

                <button
                  onClick={() => { setIsMentorView(true); setIsAdminView(false); setShowPortalMenu(false); }}
                  className="w-full px-3 py-2 rounded-xl text-left text-xs text-purple-300 hover:bg-purple-500/10 flex items-center space-x-2 transition-colors"
                >
                  <Award className="w-3.5 h-3.5 text-purple-400" />
                  <span>{language === 'zh' ? '导师合伙人工作台' : 'Mentor Partner Portal'}</span>
                </button>

                <button
                  onClick={() => { setIsAdminView(true); setIsMentorView(false); setShowPortalMenu(false); }}
                  className="w-full px-3 py-2 rounded-xl text-left text-xs text-[#dfb76c] hover:bg-[#dfb76c]/10 flex items-center space-x-2 transition-colors"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[#dfb76c]" />
                  <span>{language === 'zh' ? '总后台分销中枢' : 'Admin Commission Hub'}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Container / Mobile Device Wrapper (Space Black Titanium Chassis) */}
      <div 
        className={`relative w-full overflow-hidden transition-all duration-300 z-10 ${
          isMobileFrame 
            ? 'max-w-[424px] h-[100dvh] md:h-[880px] md:rounded-[54px] md:border-[11px] md:border-[#181a26] md:shadow-[0_30px_90px_rgba(0,0,0,0.95),_inset_0_0_0_1px_rgba(255,255,255,0.08)] bg-[#080a14] flex flex-col ring-1 ring-white/[0.08]' 
            : 'max-w-2xl min-h-screen md:min-h-[90vh] md:rounded-3xl md:border border-white/10 bg-[#080a14] flex flex-col shadow-2xl'
        }`}
      >
        {/* iOS Dynamic Island & Status Bar (Simulated on top) */}
        <div className="sticky top-0 z-40 bg-[#080a14]/90 backdrop-blur-xl pt-2 px-6 pb-1 flex items-center justify-between text-xs text-stone-300 font-medium select-none">
          <span className="text-[12px] font-semibold tracking-tight">9:41</span>
          
          {/* Dynamic Island pill with TrueDepth camera sensor reflection */}
          <div className="w-28 h-6 bg-black rounded-full flex items-center justify-between px-2.5 border border-white/[0.06] shadow-inner">
            <span className="w-2 h-2 rounded-full bg-[#dfb76c] animate-pulse" />
            <span className="text-[9px] text-[#f5e4b8] font-mono tracking-tighter">
              {language === 'zh' ? '432Hz 疗愈' : '432Hz Bath'}
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

        {/* Fullscreen Player Modal */}
        <FullScreenPlayer />

        {/* Detail & Action Modals */}
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

        {/* Toast Notification Banner */}
        {toastMessage && (
          <div className="fixed sm:absolute bottom-20 inset-x-4 z-50 flex justify-center pointer-events-none animate-bounce-short">
            <div className="px-4 py-2.5 rounded-2xl bg-[#1a1f3a]/95 backdrop-blur-xl border border-[#dfb76c]/40 text-[#f5e4b8] text-xs font-semibold shadow-2xl flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-[#dfb76c] flex-shrink-0" />
              <span>{toastMessage}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
