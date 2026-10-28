import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { 
  Copy, 
  Check, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  User, 
  Bot, 
  AlertTriangle,
  Cpu
} from 'lucide-react';
import { Message, Language } from '../types';
import { translations } from '../i18n/translations';

interface ChatMessageProps {
  message: Message;
  language: Language;
  onRetry?: (text: string) => void;
  isLast?: boolean;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  language,
  onRetry,
}) => {
  const t = translations[language];
  const [copied, setCopied] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const isUser = message.role === 'user';
  const isError = Boolean(message.error);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const handleToggleSpeak = () => {
    if (!('speechSynthesis' in window)) {
      alert(t.errors.speechNotSupported);
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    window.speechSynthesis.cancel(); // Stop any ongoing speech
    const cleanText = message.text.replace(/[`*_#[\]()]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);

    if (language === 'bn') {
      utterance.lang = 'bn-BD';
    } else if (language === 'hi') {
      utterance.lang = 'hi-IN';
    } else {
      utterance.lang = 'en-US';
    }

    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    window.speechSynthesis.speak(utterance);
    setIsPlayingAudio(true);
  };

  const formattedTime = new Date(message.timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div
      className={`flex gap-3 px-3 py-3.5 sm:px-4 sm:py-4 transition-colors ${
        isUser ? 'justify-end' : 'justify-start'
      }`}
    >
      {/* Bot Avatar */}
      {!isUser && (
        <div className="shrink-0 w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white shadow-md shadow-cyan-900/30">
          {isError ? (
            <AlertTriangle className="w-4 h-4 text-amber-300" />
          ) : (
            <Bot className="w-4 h-4 text-white" />
          )}
        </div>
      )}

      {/* Message Bubble Container */}
      <div
        className={`relative max-w-[88%] sm:max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
          isUser
            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-xs font-normal'
            : isError
            ? 'bg-red-950/40 border border-red-500/30 text-red-200 rounded-bl-xs'
            : 'bg-slate-900/90 border border-slate-800 text-slate-100 rounded-bl-xs'
        }`}
      >
        {/* Model or status tag for AI */}
        {!isUser && (
          <div className="flex items-center justify-between gap-2 mb-1.5 pb-1 border-b border-slate-800/60 text-[10px] text-slate-400 font-medium">
            <span className="flex items-center gap-1 text-cyan-400 font-semibold">
              <Cpu className="w-3 h-3" />
              {message.modelUsed || 'Gemini'}
            </span>
            <span>{formattedTime}</span>
          </div>
        )}

        {/* Message Content */}
        <div className="prose prose-invert prose-sm max-w-none break-words leading-relaxed text-[13px] sm:text-sm">
          {isUser ? (
            <p className="whitespace-pre-wrap">{message.text}</p>
          ) : (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ node, inline, className, children, ...props }: any) {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline ? (
                    <div className="relative my-2.5 rounded-lg overflow-hidden border border-slate-800 bg-[#060913]">
                      <div className="flex items-center justify-between px-3 py-1 bg-slate-800/80 text-[11px] text-slate-400 font-mono">
                        <span>{match ? match[1] : 'code'}</span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(String(children).replace(/\n$/, ''));
                          }}
                          className="hover:text-white transition-colors"
                        >
                          Copy
                        </button>
                      </div>
                      <pre className="p-3 text-xs overflow-x-auto text-emerald-300">
                        <code {...props}>{children}</code>
                      </pre>
                    </div>
                  ) : (
                    <code className="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 text-xs font-mono" {...props}>
                      {children}
                    </code>
                  );
                },
                p({ children }) {
                  return <p className="mb-2 last:mb-0">{children}</p>;
                },
                ul({ children }) {
                  return <ul className="list-disc pl-4 mb-2 space-y-1">{children}</ul>;
                },
                ol({ children }) {
                  return <ol className="list-decimal pl-4 mb-2 space-y-1">{children}</ol>;
                },
                h1({ children }) {
                  return <h1 className="text-base font-bold text-white mt-2 mb-1">{children}</h1>;
                },
                h2({ children }) {
                  return <h2 className="text-sm font-bold text-white mt-2 mb-1">{children}</h2>;
                },
                h3({ children }) {
                  return <h3 className="text-xs font-bold text-white mt-1.5 mb-1">{children}</h3>;
                }
              }}
            >
              {message.text}
            </ReactMarkdown>
          )}
        </div>

        {/* User timestamp */}
        {isUser && (
          <div className="text-[10px] text-blue-200/70 text-right mt-1">
            {formattedTime}
          </div>
        )}

        {/* Action Buttons for AI responses */}
        {!isUser && !isError && (
          <div className="flex items-center justify-between pt-2 mt-2 border-t border-slate-800/60 text-slate-400">
            <div className="flex items-center gap-1">
              {/* Copy response */}
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 px-2 py-1 rounded-md hover:bg-slate-800 hover:text-white text-xs transition-colors"
                title={t.copy}
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-[11px] text-emerald-400 font-medium">{t.copied}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span className="text-[11px]">{t.copy}</span>
                  </>
                )}
              </button>

              {/* Text to Speech */}
              <button
                onClick={handleToggleSpeak}
                className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs transition-colors ${
                  isPlayingAudio
                    ? 'bg-blue-600/20 text-cyan-400'
                    : 'hover:bg-slate-800 hover:text-white'
                }`}
                title={isPlayingAudio ? t.stopReading : t.readAloud}
              >
                {isPlayingAudio ? (
                  <>
                    <VolumeX className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                    <span className="text-[11px] text-cyan-400">{t.stopReading}</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5" />
                    <span className="text-[11px]">{t.readAloud}</span>
                  </>
                )}
              </button>
            </div>

            {/* Retry button */}
            {onRetry && (
              <button
                onClick={() => onRetry(message.text)}
                className="flex items-center gap-1 px-2 py-1 rounded-md hover:bg-slate-800 hover:text-white text-xs transition-colors"
                title={t.retry}
              >
                <RotateCcw className="w-3 h-3" />
                <span className="text-[11px]">{t.retry}</span>
              </button>
            )}
          </div>
        )}

        {/* Retry button on error */}
        {isError && onRetry && (
          <div className="pt-2 mt-2 border-t border-red-500/20 flex justify-end">
            <button
              onClick={() => onRetry(message.text)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-600/30 hover:bg-red-600/50 text-red-200 text-xs font-medium transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t.retry}</span>
            </button>
          </div>
        )}
      </div>

      {/* User Avatar */}
      {isUser && (
        <div className="shrink-0 w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-800 flex items-center justify-center text-white shadow-md">
          <User className="w-4 h-4 text-blue-100" />
        </div>
      )}
    </div>
  );
};
