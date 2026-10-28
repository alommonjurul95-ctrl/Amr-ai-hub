import React from 'react';
import { Menu, Plus, Sparkles, BookOpen, Globe, Cpu } from 'lucide-react';
import { Language, ModelOption } from '../types';
import { translations } from '../i18n/translations';

interface HeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  selectedModel: string;
  models: ModelOption[];
  onOpenModelModal: () => void;
  onToggleSidebar: () => void;
  onNewChat: () => void;
  onOpenGuideModal: () => void;
  sessionCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onLanguageChange,
  selectedModel,
  models,
  onOpenModelModal,
  onToggleSidebar,
  onNewChat,
  onOpenGuideModal,
  sessionCount,
}) => {
  const t = translations[language];
  const currentModel = models.find(m => m.id === selectedModel) || models[0];

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-3.5 py-2.5 sm:px-6 sm:py-3 bg-[#0b0f19]/90 backdrop-blur-md border-b border-slate-800/80">
      {/* Left section: Drawer toggle & Brand */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={onToggleSidebar}
          aria-label="Toggle chat history"
          className="relative p-2 text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-xl transition-colors active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
        >
          <Menu className="w-5 h-5" />
          {sessionCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white shadow">
              {sessionCount > 9 ? '9+' : sessionCount}
            </span>
          )}
        </button>

        <div className="flex items-center gap-2 select-none cursor-pointer" onClick={onNewChat}>
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 p-[1.5px] shadow-lg shadow-blue-500/20">
            <div className="w-full h-full bg-[#0b0f19] rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
            </div>
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-blue-200 bg-clip-text text-transparent flex items-center gap-1.5">
              <span>{t.appName}</span>
              <span className="hidden sm:inline-block text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                PRO
              </span>
            </h1>
            <p className="hidden md:block text-[11px] text-slate-400 font-medium">
              {t.tagline}
            </p>
          </div>
        </div>
      </div>

      {/* Right actions: Model pill, Language switcher, Guide button, New Chat */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Model selection trigger */}
        <button
          onClick={onOpenModelModal}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 text-xs text-slate-200 font-medium transition-all active:scale-95"
          title="Switch AI Model"
        >
          <Cpu className="w-3.5 h-3.5 text-cyan-400" />
          <span className="max-w-[80px] sm:max-w-[120px] truncate">{currentModel?.name || 'Gemini'}</span>
        </button>

        {/* Language switcher pills */}
        <div className="flex items-center p-0.5 rounded-xl bg-slate-900 border border-slate-800">
          <button
            onClick={() => onLanguageChange('en')}
            className={`px-2 py-1 text-xs font-semibold rounded-lg transition-all ${
              language === 'en'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            EN
          </button>
          <button
            onClick={() => onLanguageChange('bn')}
            className={`px-2 py-1 text-xs font-semibold rounded-lg transition-all ${
              language === 'bn'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            বাং
          </button>
          <button
            onClick={() => onLanguageChange('hi')}
            className={`px-2 py-1 text-xs font-semibold rounded-lg transition-all ${
              language === 'hi'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            हिं
          </button>
        </div>

        {/* Guide / Deployment modal trigger */}
        <button
          onClick={onOpenGuideModal}
          aria-label="Open deployment guide"
          className="p-2 text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-xl transition-colors active:scale-95"
          title={t.guidesTitle}
        >
          <BookOpen className="w-4 h-4 text-slate-300 hover:text-cyan-400" />
        </button>

        {/* New Chat quick button */}
        <button
          onClick={onNewChat}
          className="flex items-center gap-1 px-2.5 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold rounded-xl shadow-md shadow-blue-600/20 active:scale-95 transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{t.newChat}</span>
        </button>
      </div>
    </header>
  );
};
