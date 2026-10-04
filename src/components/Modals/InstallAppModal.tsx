import React, { useState, useEffect } from 'react';
import { Smartphone, Download, Share, PlusSquare, X, Check, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface InstallAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallAppModal: React.FC<InstallAppModalProps> = ({ isOpen, onClose }) => {
  const { language } = useApp();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const ios = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(ios);

    // Detect if already installed as PWA standalone
    const standalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true;
    setIsStandalone(standalone);

    // Listen for Android beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        onClose();
      }
      setDeferredPrompt(null);
    }
  };

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm bg-[#0e1124] border border-white/10 rounded-t-3xl sm:rounded-3xl p-6 text-white space-y-5 shadow-2xl relative"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-stone-300"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center space-x-3.5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#dfb76c]/20 to-[#a599e0]/20 border border-[#dfb76c]/40 flex items-center justify-center shadow-gold-glow flex-shrink-0">
            <Smartphone className="w-7 h-7 text-[#dfb76c]" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-[#dfb76c] font-bold uppercase tracking-wider">
              {language === 'zh' ? '独立 App 模式' : 'Standalone Native Mode'}
            </span>
            <h3 className="text-base font-bold text-white">
              {language === 'zh' ? '安装到手机桌面' : 'Install to Home Screen'}
            </h3>
          </div>
        </div>

        {isStandalone ? (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-2">
            <Check className="w-6 h-6 text-emerald-400 mx-auto" />
            <p className="text-xs text-emerald-200 font-medium">
              {language === 'zh' ? '你当前已在独立 App 模式下运行 SoulFlow' : 'SoulFlow is already running in standalone mode'}
            </p>
          </div>
        ) : isIOS ? (
          /* iOS Safari Step-by-Step Instructions */
          <div className="space-y-3 pt-1">
            <p className="text-xs text-stone-300 font-light leading-relaxed">
              {language === 'zh'
                ? '在 iPhone Safari 中只需 3 秒即可将 SoulFlow 添加为全屏原生应用，享受沉浸式无边框体验：'
                : 'Add SoulFlow to your iPhone Home Screen in 3 seconds for a full-screen, native experience:'}
            </p>

            <div className="space-y-2.5 text-xs text-stone-200">
              <div className="flex items-center space-x-3 p-3 rounded-2xl bg-white/[0.04] border border-white/5">
                <div className="w-7 h-7 rounded-xl bg-[#dfb76c]/20 text-[#dfb76c] flex items-center justify-center font-bold font-mono">
                  1
                </div>
                <div className="flex-1 flex items-center space-x-1.5">
                  <span>{language === 'zh' ? '点击底部的' : 'Tap the'}</span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-white/10 text-white font-semibold space-x-1">
                    <Share className="w-3 h-3 text-[#dfb76c]" />
                    <span>{language === 'zh' ? '分享' : 'Share'}</span>
                  </span>
                  <span>{language === 'zh' ? '按钮' : 'button'}</span>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 rounded-2xl bg-white/[0.04] border border-white/5">
                <div className="w-7 h-7 rounded-xl bg-[#dfb76c]/20 text-[#dfb76c] flex items-center justify-center font-bold font-mono">
                  2
                </div>
                <div className="flex-1 flex items-center space-x-1.5">
                  <span>{language === 'zh' ? '滑动选择' : 'Scroll & select'}</span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-white/10 text-white font-semibold space-x-1">
                    <PlusSquare className="w-3 h-3 text-[#dfb76c]" />
                    <span>{language === 'zh' ? '添加到主屏幕' : 'Add to Home Screen'}</span>
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 rounded-2xl bg-white/[0.04] border border-white/5">
                <div className="w-7 h-7 rounded-xl bg-[#dfb76c]/20 text-[#dfb76c] flex items-center justify-center font-bold font-mono">
                  3
                </div>
                <div>
                  <span>{language === 'zh' ? '点击右上角「添加」，即可从桌面随时一键开启心流。' : 'Tap "Add" in top-right corner to finish.'}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Android / Desktop Install */
          <div className="space-y-4 pt-1">
            <p className="text-xs text-stone-300 font-light leading-relaxed">
              {language === 'zh'
                ? '一键将 SoulFlow 安装为手机独立应用，获得更快加载速度、离线圣殿缓存与全屏纯净静修模式。'
                : 'Install SoulFlow as an independent app for faster launch, offline playback and zero browser distraction.'}
            </p>

            <button
              onClick={handleInstallClick}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#dfb76c] via-[#f3cf7a] to-[#d4af37] text-[#0a0c16] font-bold text-xs shadow-gold-glow flex items-center justify-center space-x-2 active:scale-95 transition-transform"
            >
              <Download className="w-4 h-4" />
              <span>{language === 'zh' ? '立即安装到手机桌面' : 'Install to Home Screen'}</span>
            </button>
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-stone-300 text-xs font-medium"
        >
          {language === 'zh' ? '知道了' : 'Got it'}
        </button>
      </div>
    </div>
  );
};
