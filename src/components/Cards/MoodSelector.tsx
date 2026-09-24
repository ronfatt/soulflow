import React from 'react';
import { Moon, Wind, Sparkles, Feather, Compass, Sun } from 'lucide-react';
import { ContentMood } from '../../types';
import { useApp } from '../../context/AppContext';

interface MoodOption {
  key: ContentMood;
  label: string;
  frequency: string;
  icon: React.ElementType;
  glowColor: string;
  activeBorder: string;
  activeBg: string;
}

const MOODS: MoodOption[] = [
  { 
    key: 'sleep', 
    label: 'Sleep', 
    frequency: 'Delta 3Hz', 
    icon: Moon, 
    glowColor: 'rgba(99, 102, 241, 0.4)',
    activeBorder: 'border-indigo-400/80',
    activeBg: 'from-indigo-950/90 via-[#131633] to-[#0c0e1e]'
  },
  { 
    key: 'stress', 
    label: 'Stress', 
    frequency: '396Hz Reset', 
    icon: Wind, 
    glowColor: 'rgba(165, 153, 224, 0.4)',
    activeBorder: 'border-purple-400/80',
    activeBg: 'from-[#231b3e] via-[#17162e] to-[#0c0e1e]'
  },
  { 
    key: 'relax', 
    label: 'Relax', 
    frequency: '432Hz Calm', 
    icon: Feather, 
    glowColor: 'rgba(212, 175, 55, 0.35)',
    activeBorder: 'border-[#dfb76c]/80',
    activeBg: 'from-[#282115] via-[#1a1724] to-[#0c0e1e]'
  },
  { 
    key: 'meditation', 
    label: 'Meditation', 
    frequency: 'Theta 6Hz', 
    icon: Sparkles, 
    glowColor: 'rgba(192, 132, 252, 0.4)',
    activeBorder: 'border-violet-400/80',
    activeBg: 'from-[#2c1845] via-[#1c1432] to-[#0c0e1e]'
  },
  { 
    key: 'focus', 
    label: 'Focus', 
    frequency: 'Alpha 10Hz', 
    icon: Compass, 
    glowColor: 'rgba(56, 189, 248, 0.35)',
    activeBorder: 'border-sky-400/80',
    activeBg: 'from-[#102742] via-[#121c32] to-[#0c0e1e]'
  },
  { 
    key: 'spiritual', 
    label: 'Spiritual', 
    frequency: '528Hz DNA', 
    icon: Sun, 
    glowColor: 'rgba(223, 183, 108, 0.45)',
    activeBorder: 'border-[#f3cf7a]/90',
    activeBg: 'from-[#382711] via-[#211a21] to-[#0c0e1e]'
  },
];

export const MoodSelector: React.FC = () => {
  const { selectedMood, setSelectedMood } = useApp();

  return (
    <div className="w-full">
      <div className="flex items-baseline justify-between mb-3 px-0.5">
        <h3 className="text-sm font-semibold tracking-tight text-white/90">
          How are you feeling today?
        </h3>
        <span className="text-[10px] font-semibold text-[#dfb76c] tracking-wider uppercase font-mono">
          Acoustic Tuning
        </span>
      </div>

      {/* Grid of 6 tactile mood cards */}
      <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-6">
        {MOODS.map((item) => {
          const Icon = item.icon;
          const isSelected = selectedMood === item.key;

          return (
            <button
              key={item.key}
              onClick={() => setSelectedMood(item.key)}
              style={{
                boxShadow: isSelected ? `0 10px 24px -2px ${item.glowColor}` : 'none',
              }}
              className={`relative flex flex-col items-center justify-center p-3 rounded-2xl transition-all duration-300 active:scale-[0.96] border ${
                isSelected
                  ? `${item.activeBorder} bg-gradient-to-b ${item.activeBg} scale-[1.03]`
                  : 'border-white/5 bg-[#0e1124]/70 hover:bg-[#151933] hover:border-white/10'
              }`}
            >
              {isSelected && (
                <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-[#dfb76c] shadow-[0_0_8px_#dfb76c]" />
              )}
              
              <div className={`p-2 rounded-xl mb-1.5 transition-all duration-300 ${
                isSelected 
                  ? 'bg-white/15 text-[#f5e4b8] scale-110' 
                  : 'bg-white/[0.04] text-stone-400'
              }`}>
                <Icon className="w-4 h-4" />
              </div>

              <span className={`text-xs font-semibold tracking-tight transition-colors ${
                isSelected ? 'text-white' : 'text-stone-300'
              }`}>
                {item.label}
              </span>
              
              <span className={`text-[9px] font-mono mt-0.5 tracking-tight transition-colors ${
                isSelected ? 'text-[#dfb76c]' : 'text-stone-500'
              }`}>
                {item.frequency}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
