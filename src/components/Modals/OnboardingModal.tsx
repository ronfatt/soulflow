import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Check, 
  Clock 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

const IMPROVEMENT_GOALS = [
  'Deep Sleep',
  'Cortisol Reset',
  'Alpha Flow',
  'Emotional Healing',
  'Stillness',
  'Spiritual Depth',
  'Body Scanning',
  'Breath Mastery',
];

const SESSION_DURATIONS = [
  { label: '5m', value: 5, sub: 'Micro reset' },
  { label: '10m', value: 10, sub: 'Daily ritual' },
  { label: '20m', value: 20, sub: 'Deep state' },
  { label: '30m+', value: 30, sub: 'Sound bath' },
];

export const OnboardingModal: React.FC = () => {
  const { showOnboarding, setShowOnboarding, showToast } = useApp();
  const [step, setStep] = useState(1);
  const [selectedGoals, setSelectedGoals] = useState<string[]>(['Deep Sleep', 'Cortisol Reset']);
  const [selectedDuration, setSelectedDuration] = useState<number>(15);

  if (!showOnboarding) return null;

  const toggleGoal = (goal: string) => {
    setSelectedGoals(prev => 
      prev.includes(goal) ? prev.filter(g => g !== goal) : [...prev, goal]
    );
  };

  const handleFinish = () => {
    setShowOnboarding(false);
    showToast('Your acoustic sanctuary is prepared. 🌿');
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#05070e] text-[#f7f5f0] flex flex-col justify-between p-6 max-w-md mx-auto overflow-y-auto no-scrollbar animate-fade-in select-none">
      {/* Top progress indicator */}
      <div className="flex items-center justify-between pt-3">
        <div className="flex items-center space-x-1.5">
          {[1, 2, 3, 4].map(s => (
            <div 
              key={s} 
              className={`h-1 rounded-full transition-all duration-500 ${
                s === step ? 'w-8 bg-[#dfb76c]' : s < step ? 'w-3 bg-[#a599e0]' : 'w-2 bg-white/20'
              }`}
            />
          ))}
        </div>
        <button 
          onClick={handleFinish}
          className="text-xs text-stone-400 hover:text-white transition-colors"
        >
          Skip
        </button>
      </div>

      {/* Slide Content */}
      <div className="my-auto py-6">
        {step === 1 && (
          <div className="flex flex-col items-center text-center space-y-6 animate-fade-in">
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-[36px] overflow-hidden shadow-2xl border border-white/10">
              <img 
                src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=900&q=85" 
                alt="Find Your Inner Balance"
                className="w-full h-full object-cover" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#05070e] via-transparent to-transparent" />
            </div>
            <div className="space-y-2 max-w-xs">
              <span className="text-[10px] font-mono font-semibold text-[#dfb76c] uppercase tracking-widest">
                Welcome to SoulFlow
              </span>
              <h2 className="text-2xl font-bold tracking-tight text-white">
                Find Your Inner Balance
              </h2>
              <p className="text-xs text-stone-300 font-light leading-relaxed">
                Step into a sanctuary calibrated for your nervous system through primordial acoustic frequencies.
              </p>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col items-center text-center space-y-6 animate-fade-in">
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-[36px] overflow-hidden shadow-2xl border border-white/10">
              <img 
                src="https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=900&q=85" 
                alt="Music That Supports Your Mind"
                className="w-full h-full object-cover" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#05070e] via-transparent to-transparent" />
            </div>
            <div className="space-y-2 max-w-xs">
              <span className="text-[10px] font-mono font-semibold text-[#a599e0] uppercase tracking-widest">
                Harmonic Science
              </span>
              <h2 className="text-2xl font-bold tracking-tight text-white">
                Music That Supports Your Mind
              </h2>
              <p className="text-xs text-stone-300 font-light leading-relaxed">
                432Hz crystal sound baths, 528Hz Solfeggio miracles, and delta waves engineered to dissolve tension in minutes.
              </p>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col items-center text-center space-y-6 animate-fade-in">
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-[36px] overflow-hidden shadow-2xl border border-white/10">
              <img 
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=900&q=85" 
                alt="Guided By Trusted Mentors"
                className="w-full h-full object-cover" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#05070e] via-transparent to-transparent" />
            </div>
            <div className="space-y-2 max-w-xs">
              <span className="text-[10px] font-mono font-semibold text-[#dfb76c] uppercase tracking-widest">
                Global Masters
              </span>
              <h2 className="text-2xl font-bold tracking-tight text-white">
                Guided By Trusted Mentors
              </h2>
              <p className="text-xs text-stone-300 font-light leading-relaxed">
                Learn with master sound healers and Stanford sleep neuroscientists sharing profound transformative rituals.
              </p>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-5 animate-fade-in">
            <div className="text-center space-y-1">
              <span className="text-[10px] font-mono font-semibold text-[#dfb76c] uppercase tracking-widest">
                Personal Sanctuary
              </span>
              <h2 className="text-xl font-bold text-white">
                What would you like to improve?
              </h2>
              <p className="text-xs text-stone-400 font-light">
                Select areas for your customized recommendations:
              </p>
            </div>

            {/* Goals multi-select */}
            <div className="grid grid-cols-2 gap-2">
              {IMPROVEMENT_GOALS.map((goal) => {
                const isSelected = selectedGoals.includes(goal);
                return (
                  <button
                    key={goal}
                    onClick={() => toggleGoal(goal)}
                    className={`py-2.5 px-3 rounded-2xl border text-xs font-medium flex items-center justify-between transition-all active:scale-95 ${
                      isSelected
                        ? 'border-[#dfb76c] bg-[#dfb76c]/15 text-[#f5e4b8] font-semibold shadow-gold-glow'
                        : 'border-white/10 bg-[#0f1224] text-stone-300 hover:border-white/20'
                    }`}
                  >
                    <span>{goal}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#dfb76c]" />}
                  </button>
                );
              })}
            </div>

            {/* Preferred session duration */}
            <div className="pt-2">
              <label className="text-xs text-stone-300 font-medium block mb-2">
                Preferred session duration:
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {SESSION_DURATIONS.map((dur) => (
                  <button
                    key={dur.value}
                    onClick={() => setSelectedDuration(dur.value)}
                    className={`py-2.5 rounded-2xl border text-center transition-all active:scale-95 ${
                      selectedDuration === dur.value
                        ? 'border-[#dfb76c] bg-[#dfb76c]/15 text-white font-bold shadow-gold-glow'
                        : 'border-white/5 bg-[#0f1224] text-stone-400'
                    }`}
                  >
                    <span className="text-xs block font-semibold">{dur.label}</span>
                    <span className="text-[9px] text-stone-500 block">{dur.sub}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom CTA Button */}
      <div className="pb-4">
        {step < 4 ? (
          <button
            onClick={() => setStep(step + 1)}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#dfb76c] to-[#f3cf7a] text-[#0a0c16] font-bold text-sm flex items-center justify-center space-x-2 shadow-gold-glow hover:brightness-105 active:scale-[0.98] transition-all"
          >
            <span>Continue</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleFinish}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#dfb76c] via-[#f3cf7a] to-[#a599e0] text-[#0a0c16] font-bold text-sm flex items-center justify-center space-x-2 shadow-gold-glow hover:brightness-105 active:scale-[0.98] transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Enter SoulFlow</span>
          </button>
        )}
      </div>
    </div>
  );
};
