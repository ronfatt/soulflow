import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  X, 
  Send, 
  Heart, 
  Music, 
  Flame, 
  Moon, 
  BookOpen, 
  Check, 
  Play, 
  Compass, 
  Clock, 
  ShieldCheck, 
  Smile, 
  Plus, 
  Edit3, 
  Trash2, 
  ChevronRight, 
  ChevronDown, 
  Volume2, 
  Feather,
  RotateCcw
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import { useAudio } from '../../context/AudioContext';
import { aiSanctuaryService } from '../../services/aiSanctuaryService';
import { AIMessage, HealingRitual, SoulJournalEntry, Track } from '../../types';
import { audioEngine } from '../../utils/audioEngine';

export const AISanctuaryModal: React.FC = () => {
  const { 
    showAISanctuary, 
    closeAISanctuary, 
    aiSanctuaryTab, 
    user, 
    tracks, 
    journalEntries, 
    saveJournalEntry, 
    updateJournalNotes, 
    deleteJournalEntry, 
    language, 
    showToast 
  } = useApp();

  const { playTrack } = useAudio();

  const isZh = language === 'zh';
  const [activeTab, setActiveTab] = useState<'chat' | 'journal' | 'rituals'>(aiSanctuaryTab);

  // Sync tab when opened with initial tab
  useEffect(() => {
    setActiveTab(aiSanctuaryTab);
  }, [aiSanctuaryTab, showAISanctuary]);

  // Chat conversation state
  const [messages, setMessages] = useState<AIMessage[]>(() => aiSanctuaryService.getInitialMessages(language));
  const [inputText, setInputText] = useState('');
  const [stepCount, setStepCount] = useState(1);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Journal tab states
  const [journalFilter, setJournalFilter] = useState<string>('all');
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
  const [editingNotes, setEditingNotes] = useState('');
  const [showNewEntryForm, setShowNewEntryForm] = useState(false);
  const [newMood, setNewMood] = useState('');
  const [newSensation, setNewSensation] = useState('');
  const [newNotes, setNewNotes] = useState('');

  // Rituals tab states
  const [expandedRitualId, setExpandedRitualId] = useState<string | null>('ritual-432-heart');

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (activeTab === 'chat') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, activeTab]);

  if (!showAISanctuary) return null;

  // Handle User Message Submission
  const handleSendMessage = (textToSend?: string) => {
    const content = (textToSend || inputText).trim();
    if (!content) return;

    const userMsg: AIMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // Simulate spiritual mentor contemplative response delay
    setTimeout(() => {
      const { reply } = aiSanctuaryService.processUserInput(content, stepCount, user.id, language);
      setMessages(prev => [...prev, reply]);
      setStepCount(prev => prev + 1);
      setIsTyping(false);
    }, 900);
  };

  // Reset conversation to start over
  const handleResetChat = () => {
    setMessages(aiSanctuaryService.getInitialMessages(language));
    setStepCount(1);
    showToast(isZh ? '已重置心灵对话，准备开始新的倾听' : 'Sanctuary session refreshed');
  };

  // Trigger audio playback for prescription track
  const handlePlayPrescriptionTrack = (trackId: string) => {
    const targetTrack = tracks.find(t => t.id === trackId) || tracks[0];
    playTrack(targetTrack);
    showToast(isZh ? `正在为你沐浴播放：《${targetTrack.title}》` : `Playing: ${targetTrack.title}`);
  };

  // Start complete healing ritual with ambient soundscape synthesis
  const handleStartRitual = (ritual: HealingRitual) => {
    const targetTrack = tracks.find(t => t.id === ritual.recommendedTrackId) || tracks[0];
    playTrack(targetTrack);

    if (ritual.recommendedAmbientLayer) {
      audioEngine.setAmbientLayer(ritual.recommendedAmbientLayer, 40);
    }

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#dfb76c', '#f3cf7a', '#a599e0']
      });
    } catch (_) {}

    showToast(isZh 
      ? `已启动「${ritual.title}」• ${ritual.frequency} 音流浸润中` 
      : `Initiated ${ritual.title} with harmonic synthesis`
    );
  };

  // Save Quick Journal Entry
  const handleCreateCustomJournal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMood.trim()) return;

    const entry: SoulJournalEntry = {
      id: `journal-custom-${Date.now()}`,
      userId: user.id,
      createdAt: new Date().toISOString(),
      moodState: newMood,
      somaticFeeling: newSensation,
      summary: isZh 
        ? `记录了自主觉察日记「${newMood}」，沉淀当下的所思所感。` 
        : `Self-recorded mindfulness journal on "${newMood}".`,
      affirmation: isZh 
        ? '“当下的每一个呼吸，都是我给自己的爱与滋养。”' 
        : '"Every breath in this moment is love and nourishment for myself."',
      userNotes: newNotes,
      tags: ['日常觉察', newMood.slice(0, 4)]
    };

    saveJournalEntry(entry);
    setShowNewEntryForm(false);
    setNewMood('');
    setNewSensation('');
    setNewNotes('');
    showToast(isZh ? '身心灵日志已创建' : 'Journal entry added');
  };

  // Filter journal entries
  const filteredJournals = journalEntries.filter(entry => {
    if (journalFilter === 'all') return true;
    return entry.tags.some(t => t.includes(journalFilter)) || entry.moodState.includes(journalFilter);
  });

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-2xl flex items-center justify-center p-0 md:p-4 animate-fade-in select-none"
      onClick={closeAISanctuary}
    >
      <div 
        className="w-full h-full md:h-[90vh] max-w-lg bg-[#0a0d1b] border border-white/10 md:rounded-3xl flex flex-col overflow-hidden shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient Studio Orb */}
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-[#dfb76c]/10 blur-[100px] pointer-events-none -z-10" />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-[#3d2963]/15 blur-[100px] pointer-events-none -z-10" />

        {/* Modal Top Bar */}
        <div className="px-5 pt-4 pb-3 border-b border-white/[0.08] bg-[#0c1024]/90 backdrop-blur-xl flex items-center justify-between z-20">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-2xl overflow-hidden border border-[#dfb76c]/50 p-0.5 shadow-gold-glow">
                <img 
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80" 
                  alt="Alicia" 
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#0c1024] animate-pulse" />
            </div>

            <div>
              <div className="flex items-center space-x-1.5">
                <h3 className="font-serif text-sm font-semibold text-white">
                  {isZh ? '心灵导师 Alicia' : 'Sanctuary Guide Alicia'}
                </h3>
                <span className="px-1.5 py-0.5 rounded-full bg-[#dfb76c]/15 text-[#dfb76c] text-[9px] font-mono font-bold">
                  AI 1v1
                </span>
              </div>
              <p className="text-[10px] text-stone-400 font-light flex items-center space-x-1">
                <Sparkles className="w-2.5 h-2.5 text-[#dfb76c]" />
                <span>{isZh ? '432Hz 能量场已连接 • 专属倾听中' : 'Acoustic field active • Deep listening'}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {activeTab === 'chat' && (
              <button
                onClick={handleResetChat}
                title={isZh ? '重新开启对话' : 'Reset session'}
                className="w-8 h-8 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-stone-400 hover:text-white flex items-center justify-center transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              onClick={closeAISanctuary}
              className="w-8 h-8 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-stone-400 hover:text-white flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Navigation Switch */}
        <div className="flex items-center justify-around px-4 py-2 border-b border-white/[0.06] bg-[#080b18]">
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              activeTab === 'chat' 
                ? 'bg-[#dfb76c]/15 text-[#dfb76c] font-semibold border border-[#dfb76c]/30 shadow-gold-glow' 
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isZh ? '心灵倾听' : '1v1 Consultation'}</span>
          </button>

          <button
            onClick={() => setActiveTab('journal')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all relative ${
              activeTab === 'journal' 
                ? 'bg-[#dfb76c]/15 text-[#dfb76c] font-semibold border border-[#dfb76c]/30 shadow-gold-glow' 
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{isZh ? '身心灵日志' : 'Soul Journal'}</span>
            <span className="w-4 h-4 rounded-full bg-white/10 text-stone-300 text-[10px] flex items-center justify-center font-mono">
              {journalEntries.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('rituals')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              activeTab === 'rituals' 
                ? 'bg-[#dfb76c]/15 text-[#dfb76c] font-semibold border border-[#dfb76c]/30 shadow-gold-glow' 
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>{isZh ? '疗愈仪式' : 'Healing Rituals'}</span>
          </button>
        </div>

        {/* ============================================================== */}
        {/* TAB 1: 1v1 CHAT SANCTUARY                                      */}
        {/* ============================================================== */}
        {activeTab === 'chat' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 no-scrollbar">
              {messages.map((msg) => (
                <div 
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} space-y-1.5 animate-fade-in`}
                >
                  <div className="flex items-center space-x-2 text-[10px] text-stone-500 px-1">
                    <span>{msg.sender === 'ai' ? (isZh ? '导师 Alicia' : 'Alicia') : (isZh ? '我' : 'Me')}</span>
                    <span>•</span>
                    <span>{msg.timestamp}</span>
                  </div>

                  {/* Message Bubble */}
                  <div 
                    className={`max-w-[88%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-[#181d36] text-[#f5e4b8] border border-[#dfb76c]/25 rounded-tr-sm shadow-md'
                        : 'bg-[#10142a]/95 text-stone-200 border border-white/10 rounded-tl-sm shadow-lg'
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.text}</p>

                    {/* Prescription Card embedded inside message */}
                    {msg.musicPrescription && (
                      <div className="mt-3.5 pt-3 border-t border-white/10 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono text-[#dfb76c] uppercase font-bold tracking-wider flex items-center space-x-1">
                            <Sparkles className="w-3 h-3 text-[#dfb76c]" />
                            <span>{isZh ? '身心灵听音处方' : 'Prescribed Acoustic Healing'}</span>
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-[#dfb76c]/15 text-[#dfb76c] text-[10px] font-mono font-semibold">
                            {msg.musicPrescription.frequency}
                          </span>
                        </div>

                        <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-1 text-[11px] text-stone-300">
                          <p className="text-white font-semibold flex items-center space-x-1">
                            <span>🎯</span>
                            <span>{isZh ? `疗愈目标：${msg.musicPrescription.targetBenefit}` : `Target: ${msg.musicPrescription.targetBenefit}`}</span>
                          </p>
                          <p className="text-[11px] text-stone-400 leading-normal">
                            💡 {msg.musicPrescription.listeningMethod}
                          </p>
                        </div>

                        {/* Direct Play Prescription Button */}
                        <button
                          onClick={() => handlePlayPrescriptionTrack(msg.musicPrescription!.trackId)}
                          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#dfb76c] to-[#f3cf7a] text-[#0a0c16] font-bold text-xs shadow-gold-glow flex items-center justify-center space-x-2 active:scale-98 transition-transform"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>{isZh ? `即刻播放处方曲目：《${msg.musicPrescription.trackTitle}》` : `Play Prescription Track`}</span>
                        </button>
                      </div>
                    )}

                    {/* Ritual Recommendation Card */}
                    {msg.ritualRecommendation && (
                      <div className="mt-3.5 p-3.5 rounded-2xl bg-gradient-to-br from-[#1d1633] to-[#12162b] border border-[#a599e0]/30 space-y-2.5">
                        <div className="flex items-center space-x-2 text-purple-300">
                          <Flame className="w-4 h-4 text-[#dfb76c]" />
                          <span className="text-xs font-bold text-white">
                            {msg.ritualRecommendation.title}
                          </span>
                        </div>

                        <p className="text-[11px] text-stone-300 leading-relaxed">
                          {msg.ritualRecommendation.subtitle}
                        </p>

                        <div className="flex items-center justify-between text-[10px] text-stone-400 font-mono">
                          <span>⏱️ {msg.ritualRecommendation.durationMinutes} {isZh ? '分钟仪式' : 'mins'}</span>
                          <span>🌊 {msg.ritualRecommendation.frequency}</span>
                        </div>

                        {/* One Click Start Ritual */}
                        <button
                          onClick={() => handleStartRitual(msg.ritualRecommendation!)}
                          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#8a68d8] via-[#dfb76c] to-[#f3cf7a] text-[#0a0c16] font-bold text-xs shadow-gold-glow flex items-center justify-center space-x-2 active:scale-98 transition-transform"
                        >
                          <Flame className="w-3.5 h-3.5 fill-current text-[#0a0c16]" />
                          <span>{isZh ? '一键开启专属疗愈仪式' : 'Start Sacred Ritual Now'}</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Interactive Quick Option Pills */}
                  {msg.quickOptions && msg.quickOptions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1 max-w-[95%]">
                      {msg.quickOptions.map((opt, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendMessage(opt)}
                          className="text-[11px] px-3 py-1.5 rounded-xl bg-[#141830] hover:bg-[#dfb76c]/15 text-stone-300 hover:text-[#dfb76c] border border-white/10 hover:border-[#dfb76c]/40 transition-all text-left shadow-sm active:scale-95"
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Typing contemplative indicator */}
              {isTyping && (
                <div className="flex items-center space-x-2 text-stone-400 text-xs py-2 px-1">
                  <div className="w-5 h-5 rounded-full bg-[#dfb76c]/20 border border-[#dfb76c]/40 flex items-center justify-center">
                    <Sparkles className="w-3 h-3 text-[#dfb76c] animate-spin" />
                  </div>
                  <span className="italic text-[11px] text-[#dfb76c]/80">
                    {isZh ? 'Alicia 正在感应你的身心能量并凝结处方...' : 'Alicia is holding space for you...'}
                  </span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className="p-3 border-t border-white/[0.08] bg-[#090c1a]">
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
                className="flex items-center space-x-2"
              >
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={isZh ? '向 Alicia 倾诉此刻的情绪或身体感受...' : 'Share what you are feeling in your heart or body...'}
                    className="w-full pl-4 pr-3 py-2.5 rounded-2xl bg-black/40 border border-white/10 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-[#dfb76c]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="w-10 h-10 rounded-2xl bg-gradient-to-r from-[#dfb76c] to-[#f3cf7a] text-[#0a0c16] flex items-center justify-center shadow-gold-glow hover:brightness-105 active:scale-95 transition-all disabled:opacity-30 disabled:pointer-events-none flex-shrink-0"
                >
                  <Send className="w-4 h-4 ml-0.5" />
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: SOUL JOURNAL                                           */}
        {/* ============================================================== */}
        {activeTab === 'journal' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Journal Header Bar */}
            <div className="px-4 py-3 bg-[#0d1022] border-b border-white/[0.06] flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-white flex items-center space-x-1.5">
                  <Feather className="w-3.5 h-3.5 text-[#dfb76c]" />
                  <span>{isZh ? '个人身心灵觉察档案' : 'Personal Soul Journal'}</span>
                </h4>
                <p className="text-[10px] text-stone-400 mt-0.5">
                  {isZh ? `已累计记录 ${journalEntries.length} 次身心觉察与处方` : `${journalEntries.length} reflection entries recorded`}
                </p>
              </div>

              <button
                onClick={() => setShowNewEntryForm(!showNewEntryForm)}
                className="px-2.5 py-1.5 rounded-xl bg-[#dfb76c]/15 hover:bg-[#dfb76c]/25 border border-[#dfb76c]/30 text-[#dfb76c] text-[11px] font-medium flex items-center space-x-1 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isZh ? '新建觉察' : 'New Entry'}</span>
              </button>
            </div>

            {/* Quick Filter Pills */}
            <div className="px-4 py-2 flex items-center space-x-1.5 overflow-x-auto no-scrollbar border-b border-white/[0.04]">
              {['all', '助眠', '释压', '432Hz', '迷走神经'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => setJournalFilter(tag)}
                  className={`text-[10px] px-2.5 py-1 rounded-full whitespace-nowrap transition-all ${
                    journalFilter === tag 
                      ? 'bg-[#dfb76c] text-[#0a0c16] font-bold' 
                      : 'bg-white/[0.05] text-stone-400 hover:text-white'
                  }`}
                >
                  {tag === 'all' ? (isZh ? '全部日志' : 'All') : tag}
                </button>
              ))}
            </div>

            {/* New Entry Form (Expandable) */}
            {showNewEntryForm && (
              <form onSubmit={handleCreateCustomJournal} className="p-4 bg-[#141830] border-b border-white/10 space-y-3 animate-fade-in">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#dfb76c]">
                    {isZh ? '记录当下身心状态' : 'Record Somatic State'}
                  </span>
                  <button 
                    type="button" 
                    onClick={() => setShowNewEntryForm(false)}
                    className="text-stone-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <input
                  type="text"
                  value={newMood}
                  onChange={(e) => setNewMood(e.target.value)}
                  placeholder={isZh ? '此刻的心情标签（如：午后疲惫、轻微焦虑、平静欢喜）' : 'Mood state (e.g. Afternoon fatigue, anxious)'}
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-[#dfb76c]"
                  required
                />

                <input
                  type="text"
                  value={newSensation}
                  onChange={(e) => setNewSensation(e.target.value)}
                  placeholder={isZh ? '身体部位感受（如：肩颈酸紧、眼眶酸涩）' : 'Somatic feeling in body'}
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-[#dfb76c]"
                />

                <textarea
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder={isZh ? '写下此刻想对自己说的话，或感悟记录...' : 'Personal reflection or gratitude note...'}
                  rows={2}
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-[#dfb76c] resize-none"
                />

                <button
                  type="submit"
                  className="w-full py-2 rounded-xl bg-gradient-to-r from-[#dfb76c] to-[#f3cf7a] text-[#0a0c16] font-bold text-xs shadow-gold-glow"
                >
                  {isZh ? '保存到身心灵日志' : 'Save to Soul Journal'}
                </button>
              </form>
            )}

            {/* Journal Entries List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 no-scrollbar">
              {filteredJournals.length === 0 ? (
                <div className="py-12 text-center text-stone-400 space-y-2">
                  <BookOpen className="w-8 h-8 text-stone-600 mx-auto" />
                  <p className="text-xs">{isZh ? '暂无匹配的日志记录' : 'No journal entries yet'}</p>
                </div>
              ) : (
                filteredJournals.map((entry) => (
                  <div 
                    key={entry.id}
                    className="p-4 rounded-2xl bg-[#101428] border border-white/[0.08] space-y-3 shadow-md hover:border-white/20 transition-all"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-mono text-stone-500">
                          {new Date(entry.createdAt).toLocaleDateString()} {new Date(entry.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <h4 className="text-xs font-bold text-white mt-0.5 flex items-center space-x-1.5">
                          <span>{entry.moodState}</span>
                        </h4>
                      </div>

                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => {
                            setEditingEntryId(entry.id);
                            setEditingNotes(entry.userNotes || '');
                          }}
                          className="p-1 rounded-lg text-stone-400 hover:text-white hover:bg-white/10 transition-colors"
                          title={isZh ? '编辑心得随笔' : 'Edit notes'}
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteJournalEntry(entry.id)}
                          className="p-1 rounded-lg text-stone-400 hover:text-rose-400 hover:bg-white/10 transition-colors"
                          title={isZh ? '删除' : 'Delete'}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Somatic feeling */}
                    {entry.somaticFeeling && (
                      <p className="text-[11px] text-stone-400 italic">
                        {isZh ? '身体觉察：' : 'Body check: '}{entry.somaticFeeling}
                      </p>
                    )}

                    {/* Summary */}
                    <p className="text-xs text-stone-300 leading-relaxed">
                      {entry.summary}
                    </p>

                    {/* Affirmation Box */}
                    {entry.affirmation && (
                      <div className="p-2.5 rounded-xl bg-[#dfb76c]/10 border border-[#dfb76c]/20 text-[11px] text-[#f3cf7a] italic font-serif leading-relaxed">
                        {entry.affirmation}
                      </div>
                    )}

                    {/* Prescribed track & ritual shortcuts */}
                    {(entry.recommendedTrackTitle || entry.recommendedRitualTitle) && (
                      <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                        <span className="text-[10px] text-stone-400">
                          {entry.recommendedRitualTitle || entry.recommendedTrackTitle}
                        </span>

                        {entry.recommendedTrackId && (
                          <button
                            onClick={() => handlePlayPrescriptionTrack(entry.recommendedTrackId!)}
                            className="px-2.5 py-1 rounded-lg bg-[#dfb76c]/20 hover:bg-[#dfb76c]/30 text-[#dfb76c] text-[10px] font-semibold flex items-center space-x-1"
                          >
                            <Play className="w-2.5 h-2.5 fill-current" />
                            <span>{isZh ? '重温此曲' : 'Play again'}</span>
                          </button>
                        )}
                      </div>
                    )}

                    {/* Personal Notes / Gratitude */}
                    {editingEntryId === entry.id ? (
                      <div className="pt-2 border-t border-white/5 space-y-2">
                        <textarea
                          value={editingNotes}
                          onChange={(e) => setEditingNotes(e.target.value)}
                          placeholder={isZh ? '记录你实践后的心得或感恩清单...' : 'Record your thoughts or gratitude...'}
                          rows={2}
                          className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:outline-none focus:border-[#dfb76c] resize-none"
                        />
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => setEditingEntryId(null)}
                            className="px-2.5 py-1 rounded-lg bg-white/10 text-xs text-stone-300"
                          >
                            {isZh ? '取消' : 'Cancel'}
                          </button>
                          <button
                            onClick={() => {
                              updateJournalNotes(entry.id, editingNotes);
                              setEditingEntryId(null);
                            }}
                            className="px-3 py-1 rounded-lg bg-[#dfb76c] text-[#0a0c16] text-xs font-bold shadow-sm"
                          >
                            {isZh ? '保存' : 'Save'}
                          </button>
                        </div>
                      </div>
                    ) : entry.userNotes ? (
                      <div className="pt-2 border-t border-white/5">
                        <p className="text-[11px] text-stone-300 bg-white/[0.02] p-2 rounded-lg border border-white/5 leading-relaxed">
                          ✍️ <span className="font-semibold text-stone-400">{isZh ? '我的心得：' : 'My Notes: '}</span>
                          {entry.userNotes}
                        </p>
                      </div>
                    ) : null}

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 pt-1">
                      {entry.tags.map((tag, idx) => (
                        <span key={idx} className="text-[9px] px-2 py-0.5 rounded-full bg-white/[0.04] text-stone-400">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: HEALING RITUALS CATALOG                                 */}
        {/* ============================================================== */}
        {activeTab === 'rituals' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
            <div className="text-center space-y-1 pb-1">
              <span className="text-[10px] font-mono text-[#dfb76c] font-bold uppercase tracking-wider">
                {isZh ? '圣殿疗愈法门' : 'Sacred Ritual Protocols'}
              </span>
              <h3 className="text-sm font-bold text-white">
                {isZh ? '经典身心灵重调仪式' : 'Curated Healing Ceremonies'}
              </h3>
              <p className="text-[11px] text-stone-400">
                {isZh ? '结合特定声波频率、迷走神经呼吸与身体重锚定' : 'Combined acoustic intervals and vagal regulation'}
              </p>
            </div>

            <div className="space-y-3">
              {aiSanctuaryService.getRituals().map((ritual) => {
                const isExpanded = expandedRitualId === ritual.id;

                return (
                  <div
                    key={ritual.id}
                    className="p-4 rounded-2xl bg-[#101428] border border-white/[0.08] space-y-3 shadow-lg"
                  >
                    <div 
                      onClick={() => setExpandedRitualId(isExpanded ? null : ritual.id)}
                      className="flex items-start justify-between cursor-pointer"
                    >
                      <div className="flex-1 pr-2">
                        <div className="flex items-center space-x-2">
                          <span className="px-2 py-0.5 rounded-full bg-[#dfb76c]/15 text-[#dfb76c] font-mono text-[9px] font-bold">
                            {ritual.frequency}
                          </span>
                          <span className="text-[10px] text-stone-400 font-mono">
                            ⏱️ {ritual.durationMinutes} {isZh ? '分钟' : 'mins'}
                          </span>
                        </div>

                        <h4 className="text-xs font-bold text-white mt-1">
                          {ritual.title}
                        </h4>
                        <p className="text-[11px] text-stone-400 mt-0.5">
                          {ritual.subtitle}
                        </p>
                      </div>

                      <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-stone-400">
                        {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="space-y-3 pt-2 border-t border-white/5 animate-fade-in">
                        <p className="text-xs text-stone-300 leading-relaxed font-light">
                          {ritual.description}
                        </p>

                        {/* Steps List */}
                        <div className="space-y-2">
                          {ritual.steps.map((step) => (
                            <div key={step.stepNumber} className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                              <div className="flex items-center justify-between text-xs font-semibold text-[#f5e4b8]">
                                <span>{step.stepNumber}. {step.title}</span>
                                {step.duration && <span className="text-[10px] font-mono text-stone-500">{step.duration}</span>}
                              </div>
                              <p className="text-[11px] text-stone-300 leading-normal">
                                {step.instruction}
                              </p>
                            </div>
                          ))}
                        </div>

                        {/* Start Ritual CTA */}
                        <button
                          onClick={() => handleStartRitual(ritual)}
                          className="w-full py-3 rounded-xl bg-gradient-to-r from-[#dfb76c] via-[#f3cf7a] to-[#d4af37] text-[#0a0c16] font-bold text-xs shadow-gold-glow flex items-center justify-center space-x-2 active:scale-98 transition-transform"
                        >
                          <Flame className="w-4 h-4 fill-current" />
                          <span>{isZh ? '一键开始此疗愈仪式' : 'Start Ceremony Now'}</span>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
