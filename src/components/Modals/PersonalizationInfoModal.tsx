import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Cpu, 
  Clock, 
  Target, 
  Heart, 
  Compass, 
  Moon, 
  Sun, 
  Check, 
  Sliders,
  Layers,
  ArrowRight,
  ShieldCheck,
  Brain
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { 
  personalizationEngine, 
  RuleBasedRecommendationAdapter, 
  AIRecommendationModelAdapter 
} from '../../services/personalizationEngine';

interface PersonalizationInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PersonalizationInfoModal: React.FC<PersonalizationInfoModalProps> = ({ isOpen, onClose }) => {
  const { 
    user, 
    selectedMood, 
    listeningHistory, 
    favorites, 
    tracks, 
    showToast 
  } = useApp();

  const [activeAdapterType, setActiveAdapterType] = useState<'rule' | 'ai'>('rule');

  if (!isOpen) return null;

  const signals = personalizationEngine.buildSignals(
    user,
    selectedMood,
    listeningHistory,
    favorites,
    tracks
  );

  const handleSwitchAdapter = (type: 'rule' | 'ai') => {
    setActiveAdapterType(type);
    if (type === 'ai') {
      personalizationEngine.setAdapter(new AIRecommendationModelAdapter());
      showToast('Switched to SoulFlow Deep Resonance Neural Ranker (AI Adapter)');
    } else {
      personalizationEngine.setAdapter(new RuleBasedRecommendationAdapter());
      showToast('Switched to SoulFlow Heuristic Engine (Rule-Based)');
    }
  };

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto animate-fade-in"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg bg-[#0e1224] border border-white/10 rounded-t-3xl sm:rounded-3xl p-6 text-white max-h-[92vh] overflow-y-auto no-scrollbar shadow-2xl space-y-5"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/5">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#dfb76c] to-[#a599e0] flex items-center justify-center text-[#0a0c16]">
              <Sparkles className="w-4 h-4 fill-current" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight flex items-center space-x-1.5">
                <span>Personalization Engine</span>
                <span className="px-2 py-0.2 rounded-full bg-[#dfb76c]/15 text-[#dfb76c] text-[10px] font-mono border border-[#dfb76c]/30">
                  AI-Ready v1.2
                </span>
              </h3>
              <p className="text-[11px] text-stone-400 font-light">
                Lightweight, signal-based recommendation architecture
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-stone-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 7 Recommendation Signals Live Ingestion */}
        <div className="space-y-2.5">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#dfb76c]">
            Active Recommendation Signals (7)
          </span>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {/* 1. Goals */}
            <div className="p-3 rounded-2xl bg-[#141830] border border-white/5 space-y-1">
              <div className="flex items-center space-x-1 text-stone-400 text-[10px] uppercase font-mono">
                <Target className="w-3 h-3 text-[#dfb76c]" />
                <span>1. Selected Goals</span>
              </div>
              <p className="text-stone-200 font-medium text-[11px] truncate">
                {signals.wellnessGoals.join(', ')}
              </p>
            </div>

            {/* 2. Mood */}
            <div className="p-3 rounded-2xl bg-[#141830] border border-white/5 space-y-1">
              <div className="flex items-center space-x-1 text-stone-400 text-[10px] uppercase font-mono">
                <Compass className="w-3 h-3 text-[#38bdf8]" />
                <span>2. Current Mood</span>
              </div>
              <p className="text-white font-semibold text-[11px] capitalize flex items-center space-x-1">
                <span>#{signals.currentMood}</span>
              </p>
            </div>

            {/* 3. History */}
            <div className="p-3 rounded-2xl bg-[#141830] border border-white/5 space-y-1">
              <div className="flex items-center space-x-1 text-stone-400 text-[10px] uppercase font-mono">
                <Clock className="w-3 h-3 text-[#c084fc]" />
                <span>3. Listening History</span>
              </div>
              <p className="text-stone-200 font-medium text-[11px]">
                {signals.listeningHistory.length} Sessions Logged
              </p>
            </div>

            {/* 4. Duration */}
            <div className="p-3 rounded-2xl bg-[#141830] border border-white/5 space-y-1">
              <div className="flex items-center space-x-1 text-stone-400 text-[10px] uppercase font-mono">
                <Sliders className="w-3 h-3 text-[#dfb76c]" />
                <span>4. Session Duration</span>
              </div>
              <p className="text-stone-200 font-medium text-[11px]">
                {signals.preferredDuration} Minutes Window
              </p>
            </div>

            {/* 5. Time of Day */}
            <div className="p-3 rounded-2xl bg-[#141830] border border-white/5 space-y-1">
              <div className="flex items-center space-x-1 text-stone-400 text-[10px] uppercase font-mono">
                {signals.timeOfDay === 'night' ? <Moon className="w-3 h-3 text-indigo-400" /> : <Sun className="w-3 h-3 text-amber-400" />}
                <span>5. Time of Day</span>
              </div>
              <p className="text-stone-200 font-medium text-[11px] capitalize">
                {signals.timeOfDay} ({signals.currentHour}:00)
              </p>
            </div>

            {/* 6. Favorite Categories */}
            <div className="p-3 rounded-2xl bg-[#141830] border border-white/5 space-y-1">
              <div className="flex items-center space-x-1 text-stone-400 text-[10px] uppercase font-mono">
                <Layers className="w-3 h-3 text-emerald-400" />
                <span>6. Top Categories</span>
              </div>
              <p className="text-stone-200 font-medium text-[11px] truncate">
                {signals.favoriteCategories.length > 0 ? signals.favoriteCategories.join(', ') : 'Sleep, Healing'}
              </p>
            </div>
          </div>
        </div>

        {/* Model Architecture Pluggability Switcher */}
        <div className="p-4 rounded-2xl bg-[#141830] border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-stone-300 flex items-center space-x-1">
              <Cpu className="w-3.5 h-3.5 text-[#dfb76c]" />
              <span>Pluggable Engine Adapter</span>
            </span>
            <span className="text-[10px] text-stone-400 font-mono">Interface: RecommendationModelAdapter</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleSwitchAdapter('rule')}
              className={`p-3 rounded-xl border text-left transition-all ${
                activeAdapterType === 'rule'
                  ? 'bg-[#dfb76c]/15 border-[#dfb76c] text-white shadow-gold-glow'
                  : 'bg-black/20 border-white/5 text-stone-400 hover:text-white'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-white">Heuristic Engine</span>
                {activeAdapterType === 'rule' && <Check className="w-3.5 h-3.5 text-[#dfb76c]" />}
              </div>
              <p className="text-[10px] text-stone-400 leading-snug">
                Zero-latency, 100% deterministic rule scoring across all 7 signals.
              </p>
            </button>

            <button
              onClick={() => handleSwitchAdapter('ai')}
              className={`p-3 rounded-xl border text-left transition-all ${
                activeAdapterType === 'ai'
                  ? 'bg-[#a599e0]/20 border-[#a599e0] text-white shadow-lg'
                  : 'bg-black/20 border-white/5 text-stone-400 hover:text-white'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-white">AI Neural Adapter</span>
                {activeAdapterType === 'ai' && <Check className="w-3.5 h-3.5 text-[#a599e0]" />}
              </div>
              <p className="text-[10px] text-stone-400 leading-snug">
                Extensibility hook for Gemini / DeepMind neural embedding rankers.
              </p>
            </button>
          </div>
        </div>

        {/* Ethical / Wellness Guardrail Notice */}
        <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 text-[11px] text-stone-400 leading-relaxed flex items-start space-x-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
          <span>
            <strong>Wellness Architecture:</strong> This engine personalizes acoustic frequency resonance, session length, and circadian wind-down without acting as an AI therapist.
          </span>
        </div>
      </div>
    </div>
  );
};
