import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShieldCheck, 
  Smartphone, 
  Cloud, 
  Key, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle,
  Sparkles,
  Layers,
  Terminal,
  Share2
} from 'lucide-react';
import { Language } from '../types';
import { translations } from '../i18n/translations';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const GuideModal: React.FC<GuideModalProps> = ({
  isOpen,
  onClose,
  language,
}) => {
  const t = translations[language];
  const [activeTab, setActiveTab] = useState<'security' | 'android' | 'hosting'>('security');
  const [serverKeyStatus, setServerKeyStatus] = useState<{ hasApiKey: boolean; checked: boolean }>({
    hasApiKey: false,
    checked: false,
  });

  useEffect(() => {
    if (isOpen) {
      fetch('/api/status')
        .then((res) => res.json())
        .then((data) => {
          setServerKeyStatus({ hasApiKey: Boolean(data.hasApiKey), checked: true });
        })
        .catch(() => {
          setServerKeyStatus({ hasApiKey: false, checked: true });
        });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-md">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {t.deployment.title}
              </h3>
              <p className="text-xs text-slate-400">
                {t.deployment.subtitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950/30 px-3 pt-2 gap-1 overflow-x-auto">
          <button
            onClick={() => setActiveTab('security')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-t-xl transition-all border-b-2 ${
              activeTab === 'security'
                ? 'border-blue-500 text-blue-400 bg-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{t.apiGuide}</span>
          </button>
          
          <button
            onClick={() => setActiveTab('android')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-t-xl transition-all border-b-2 ${
              activeTab === 'android'
                ? 'border-blue-500 text-blue-400 bg-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>{t.pwaGuide}</span>
          </button>

          <button
            onClick={() => setActiveTab('hosting')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-t-xl transition-all border-b-2 ${
              activeTab === 'hosting'
                ? 'border-blue-500 text-blue-400 bg-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cloud className="w-3.5 h-3.5" />
            <span>{t.deployGuide}</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
          {activeTab === 'security' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              {/* Server Key Status Banner */}
              <div className={`p-4 rounded-2xl border flex items-start gap-3 ${
                serverKeyStatus.hasApiKey
                  ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                  : 'bg-amber-950/30 border-amber-500/40 text-amber-200'
              }`}>
                {serverKeyStatus.hasApiKey ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                )}
                <div>
                  <h4 className="font-semibold text-sm">
                    {serverKeyStatus.hasApiKey
                      ? 'Server Gemini API Key is Connected'
                      : 'Waiting for Server GEMINI_API_KEY'}
                  </h4>
                  <p className="text-xs mt-1 text-slate-300">
                    {serverKeyStatus.hasApiKey
                      ? 'Your backend Express proxy is successfully receiving the GEMINI_API_KEY environment variable. All requests from mobile and web clients are fully protected.'
                      : 'To chat with Gemini, configure your API key in Google AI Studio Settings > Secrets, or set GEMINI_API_KEY in your hosting environment.'}
                  </p>
                </div>
              </div>

              {/* Explanations */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
                <h4 className="font-bold text-white text-sm flex items-center gap-2">
                  <Key className="w-4 h-4 text-cyan-400" />
                  {t.deployment.securingApiTitle}
                </h4>
                <p className="text-slate-400 text-xs">
                  {t.deployment.securingApiDesc}
                </p>

                <div className="bg-[#050811] p-3 rounded-xl border border-slate-800/80 font-mono text-[11px] text-slate-300 space-y-1">
                  <div className="text-slate-500">// Architecture flow:</div>
                  <div className="text-cyan-400">Android/Web Client ──&gt; POST /api/chat ──&gt; Express Server</div>
                  <div className="text-emerald-400">Express Server (process.env.GEMINI_API_KEY) ──&gt; Google Gemini AI</div>
                  <div className="text-indigo-400">Response ──&gt; Express Server ──&gt; Android/Web Client</div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
                <h4 className="font-semibold text-white text-xs uppercase tracking-wide">
                  Where to set your API Key:
                </h4>
                <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-400">
                  <li><strong className="text-white">In Google AI Studio:</strong> Open the top or side menu, go to <strong>Settings &gt; Secrets</strong>, and make sure <code className="bg-slate-800 text-cyan-300 px-1 py-0.5 rounded">GEMINI_API_KEY</code> is enabled.</li>
                  <li><strong className="text-white">In Local Development:</strong> Create a <code className="bg-slate-800 text-cyan-300 px-1 py-0.5 rounded">.env</code> file in the project root with <code className="bg-slate-800 text-cyan-300 px-1 py-0.5 rounded">GEMINI_API_KEY=AIzaSy...</code>.</li>
                  <li><strong className="text-white">In Cloud Production:</strong> Add <code className="bg-slate-800 text-cyan-300 px-1 py-0.5 rounded">GEMINI_API_KEY</code> in your host's Environment Variables panel.</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'android' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="p-4 rounded-2xl bg-blue-950/30 border border-blue-500/30 text-blue-200">
                <h4 className="font-bold text-sm text-white flex items-center gap-2 mb-1">
                  <Smartphone className="w-4 h-4 text-cyan-400" />
                  {t.deployment.androidTipsTitle}
                </h4>
                <p className="text-xs text-slate-300">
                  {t.deployment.androidTipsDesc}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="w-6 h-6 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold text-xs mb-2">1</div>
                  <h5 className="font-semibold text-white text-xs mb-1">Open in Chrome</h5>
                  <p className="text-[11px] text-slate-400">Launch Chrome or Samsung Internet on your Android phone and paste your app URL.</p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="w-6 h-6 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold text-xs mb-2">2</div>
                  <h5 className="font-semibold text-white text-xs mb-1">Tap 3-Dots Menu</h5>
                  <p className="text-[11px] text-slate-400">Tap the browser menu icon (⋮) at top right and choose "Add to Home screen".</p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="w-6 h-6 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold text-xs mb-2">3</div>
                  <h5 className="font-semibold text-white text-xs mb-1">Enjoy Full-Screen</h5>
                  <p className="text-[11px] text-slate-400">Amar AI Hub now opens like a native mobile app with voice speech input and audio read-aloud!</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                <h5 className="font-semibold text-white text-xs mb-2">Mobile Superpowers:</h5>
                <ul className="space-y-1.5 text-xs text-slate-400">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span><strong>Microphone Voice Typing:</strong> Tap the mic icon to dictate queries in Bengali, Hindi, or English.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span><strong>Text-to-Speech:</strong> Tap "Listen" on any AI reply to have it spoken aloud in natural accents.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span><strong>Dark Theme:</strong> Saves battery on AMOLED / OLED Android displays.</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'hosting' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
                <h4 className="font-bold text-white text-sm mb-1">
                  {t.deployment.freeHostingTitle}
                </h4>
                <p className="text-xs text-slate-400">
                  Because Amar AI Hub is a full-stack React + Express app, deploy it to any free container or node hosting platform:
                </p>
              </div>

              {t.deployment.hostingOptions.map((opt, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <h5 className="font-bold text-white text-sm flex items-center gap-2">
                      <Cloud className="w-4 h-4 text-blue-400" />
                      {opt.name}
                    </h5>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {opt.tier}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 font-medium">Platform: {opt.platform}</p>

                  <div className="space-y-1.5 pt-1">
                    {opt.steps.map((st, sidx) => (
                      <div key={sidx} className="flex items-start gap-2 text-xs text-slate-300">
                        <span className="text-blue-400 font-mono font-bold">{sidx + 1}.</span>
                        <span>{st}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">Preview & Publish in Google AI Studio:</span>
                <span className="text-cyan-400 font-medium">Click "Share" at top right</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="text-[11px] text-slate-500">
            Amar AI Hub • Built with Google Gemini
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs shadow-md transition-all active:scale-95"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
};
