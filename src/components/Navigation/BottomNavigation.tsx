import React from 'react';
import { Home, Compass, MapPin, Library, User } from 'lucide-react';
import { useApp, MainTab } from '../../context/AppContext';

interface TabItem {
  id: MainTab;
  label: string;
  icon: React.ElementType;
}

const TABS: TabItem[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'explore', label: 'Explore', icon: Compass },
  { id: 'journey', label: 'Journey', icon: MapPin },
  { id: 'library', label: 'Library', icon: Library },
  { id: 'profile', label: 'Profile', icon: User },
];

export const BottomNavigation: React.FC = () => {
  const { activeTab, setActiveTab, t } = useApp();

  const tabs: Array<{ id: MainTab; label: string; icon: React.ElementType }> = [
    { id: 'home', label: t('navHome'), icon: Home },
    { id: 'explore', label: t('navExplore'), icon: Compass },
    { id: 'journey', label: t('navJourney'), icon: MapPin },
    { id: 'library', label: t('navLibrary'), icon: Library },
    { id: 'profile', label: t('navProfile'), icon: User },
  ];

  return (
    <nav className="sticky bottom-0 inset-x-0 z-30 select-none bg-[#090b16]/92 backdrop-blur-2xl border-t border-white/[0.07] pb-safe shadow-[0_-10px_30px_rgba(0,0,0,0.6)]">
      <div className="flex items-center justify-around py-2 px-3 max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all duration-300 active:scale-95 ${
                isActive ? 'text-[#dfb76c]' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-all duration-300 ${isActive ? 'scale-110 text-[#dfb76c] stroke-[2.2]' : 'scale-100 stroke-[1.7]'}`} />
              </div>
              
              <span className={`text-[10px] mt-1 font-medium transition-all ${
                isActive ? 'font-semibold text-white' : 'text-stone-400'
              }`}>
                {tab.label}
              </span>

              {/* Luminous micro-indicator */}
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-[#dfb76c] shadow-[0_0_8px_#dfb76c] mt-0.5 animate-pulse" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
