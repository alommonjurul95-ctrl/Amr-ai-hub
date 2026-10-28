import React from 'react';
import { 
  Sparkles, 
  Smartphone, 
  Globe2, 
  ShieldCheck, 
  Cpu, 
  ArrowRight,
  Code,
  Mail,
  PenTool,
  HelpCircle
} from 'lucide-react';
import { Language } from '../types';
import { translations } from '../i18n/translations';

interface WelcomeScreenProps {
  language: Language;
  onSelectPrompt: (promptText: string) => void;
  selectedModelName: string;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  language,
  onSelectPrompt,
  selectedModelName,
}) => {
  const t = translations[language];

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'mail':
        return <Mail className="w-4 h-4 text-emerald-400" />;
      case 'code':
        return <Code className="w-4 h-4 text-cyan-400" />;
      case 'globe':
        return <Globe2 className="w-4 h-4 text-indigo-400" />;
      case 'sparkles':
      default:
        return <Sparkles className="w-4 h-4 text-amber-400" />;
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 text-center max-w-2xl mx-auto my-auto animate-in fade-in duration-500">
      {/* Brand Icon with glowing ring */}
      <div className="relative mb-5 group">
        <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-400 opacity-60 blur-lg group-hover:opacity-90 transition duration-500" />
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-gradient-to-tr from-slate-900 to-slate-800 border border-slate-700/80 flex items-center justify-center shadow-2xl">
          <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-cyan-400" />
        </div>
      </div>

      {/* Main Headings */}
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white mb-2">
        {t.welcomeTitle}
      </h2>
      <p className="text-sm sm:text-base font-medium text-blue-400/90 mb-3">
        {t.welcomeSubtitle}
      </p>
      <p className="text-xs sm:text-sm text-slate-400 max-w-lg mb-6 leading-relaxed">
        {t.welcomeDescription}
      </p>

      {/* Feature Badges for Android & AI */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-800 text-[11px] sm:text-xs text-slate-300 font-medium">
          <Smartphone className="w-3.5 h-3.5 text-blue-400" />
          <span>Android Ready</span>
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-800 text-[11px] sm:text-xs text-slate-300 font-medium">
          <Globe2 className="w-3.5 h-3.5 text-indigo-400" />
          <span>বাংলা • हिंदी • English</span>
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-800 text-[11px] sm:text-xs text-slate-300 font-medium">
          <Cpu className="w-3.5 h-3.5 text-cyan-400" />
          <span>{selectedModelName}</span>
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-800 text-[11px] sm:text-xs text-slate-300 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Zero Client Key Leakage</span>
        </div>
      </div>

      {/* Suggested Starter Prompts */}
      <div className="w-full">
        <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>{t.suggestedPromptsTitle}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-left">
          {t.suggestedPrompts.map((item, idx) => (
            <button
              key={idx}
              onClick={() => onSelectPrompt(item.prompt)}
              className="group p-3 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800/90 hover:border-blue-500/40 text-left transition-all duration-200 active:scale-[0.98] shadow-sm hover:shadow-md hover:shadow-blue-900/10"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="flex items-center gap-2 text-xs font-semibold text-slate-200 group-hover:text-blue-300">
                  {getIcon(item.icon)}
                  {item.label}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all" />
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed group-hover:text-slate-300">
                "{item.prompt}"
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
