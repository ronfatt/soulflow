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
import { Smartphone, Monitor, ShieldCheck, Sparkles, Wifi, Battery, Award } from 'lucide-react';

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
    closeCheckoutModal 
  } = useApp();

  // If in Mentor Portal view
  if (isMentorView) {
    return <MentorDashboardView />;
  }

  // If in Admin Dashboard view, render admin mode directly
  if (isAdminView) {
    return <AdminDashboardView />;
  }

  return (
    <div className="min-h-screen bg-[#060810] text-[#faf8f5] flex flex-col items-center justify-center p-0 md:p-6 select-none font-sans">
      {/* Top Desktop Controls Bar (Only on wider screens to switch between iPhone Frame & Fullscreen Responsive + Admin) */}
      <header className="hidden md:flex items-center justify-between w-full max-w-5xl mb-4 px-4 text-xs text-stone-400">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#dfb76c] animate-pulse" />
          <span className="font-semibold text-white tracking-wider">SOULFLOW</span>
          <span className="text-[11px] text-stone-500">• Mind, Body & Spiritual Wellbeing Platform</span>
        </div>

        <div className="flex items-center space-x-2 bg-[#121528] p-1 rounded-2xl border border-white/10 shadow-lg">
          <button
            onClick={() => setIsMobileFrame(true)}
            className={`px-3 py-1.5 rounded-xl flex items-center space-x-1.5 transition-all ${
              isMobileFrame ? 'bg-[#dfb76c] text-[#0a0c16] font-semibold' : 'text-stone-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile Device View</span>
          </button>

          <button
            onClick={() => setIsMobileFrame(false)}
            className={`px-3 py-1.5 rounded-xl flex items-center space-x-1.5 transition-all ${
              !isMobileFrame ? 'bg-[#dfb76c] text-[#0a0c16] font-semibold' : 'text-stone-400 hover:text-white'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Responsive Web</span>
          </button>

          <div className="h-4 w-px bg-white/10 mx-1" />

          <button
            onClick={() => setShowOnboarding(true)}
            className="px-2.5 py-1.5 rounded-xl text-stone-300 hover:text-white hover:bg-white/5 flex items-center space-x-1"
            title="Start Onboarding Tour"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#dfb76c]" />
            <span>Onboarding</span>
          </button>

          <button
            onClick={() => { setIsMentorView(true); setIsAdminView(false); }}
            className="px-2.5 py-1.5 rounded-xl text-purple-300 hover:bg-purple-500/10 flex items-center space-x-1 font-medium transition-all"
            title="Open Mentor Referral & Commission Portal"
          >
            <Award className="w-3.5 h-3.5 text-purple-400" />
            <span>Mentor Portal</span>
          </button>

          <button
            onClick={() => { setIsAdminView(true); setIsMentorView(false); }}
            className="px-2.5 py-1.5 rounded-xl text-[#dfb76c] hover:bg-[#dfb76c]/10 flex items-center space-x-1 font-medium transition-all"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin Console</span>
          </button>
        </div>
      </header>

      {/* Main Container / Mobile Device Wrapper */}
      <div 
        className={`relative w-full overflow-hidden transition-all duration-300 ${
          isMobileFrame 
            ? 'max-w-[430px] h-[100dvh] md:h-[890px] md:rounded-[52px] md:border-[10px] md:border-[#1a1e36] md:shadow-[0_25px_70px_rgba(0,0,0,0.85)] bg-[#080a14] flex flex-col' 
            : 'max-w-2xl min-h-screen md:min-h-[90vh] md:rounded-3xl md:border border-white/10 bg-[#080a14] flex flex-col'
        }`}
      >
        {/* iOS Dynamic Island & Status Bar (Simulated on top) */}
        <div className="sticky top-0 z-40 bg-[#080a14]/90 backdrop-blur-xl pt-2 px-6 pb-1 flex items-center justify-between text-xs text-stone-300 font-medium select-none">
          <span className="text-[12px] font-semibold">9:41</span>
          
          {/* Dynamic Island pill */}
          <div className="w-28 h-6 bg-black rounded-full flex items-center justify-center space-x-2 border border-white/5">
            <span className="w-2 h-2 rounded-full bg-[#dfb76c]/80 animate-pulse" />
            <span className="text-[9px] text-stone-400 font-mono tracking-tighter">432Hz Bath</span>
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
