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
  const { activeTab, setActiveTab } = useApp();

  return (
    <nav className="glass-nav sticky bottom-0 inset-x-0 z-30 select-none pb-safe">
      <div className="flex items-center justify-around py-2 px-3 max-w-md mx-auto">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all duration-300 ${
                isActive ? 'text-[#dfb76c]' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              {isActive && (
                <span className="absolute -top-1 w-8 h-1 rounded-full bg-gradient-to-r from-[#dfb76c] to-[#a599e0] shadow-[0_0_10px_#dfb76c]" />
              )}
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110' : 'scale-100'}`} />
              </div>
              <span className={`text-[10px] mt-1 font-medium transition-all ${isActive ? 'font-semibold text-white' : 'text-stone-400'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
