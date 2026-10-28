import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, Trash2, Loader2, Sparkles } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../i18n/translations';

interface ChatInputProps {
  language: Language;
  onSendMessage: (text: string) => void;
  isLoading: boolean;
  onClearChat: () => void;
  hasMessages: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  language,
  onSendMessage,
  isLoading,
  onClearChat,
  hasMessages,
}) => {
  const t = translations[language];
  const [text, setText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);

  // Auto-resize textarea height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      // Cap at 130px (approx 5 lines on mobile)
      textareaRef.current.style.height = `${Math.min(scrollHeight, 130)}px`;
    }
  }, [text]);

  // Voice speech-to-text recognition setup (Android Chrome friendly)
  const toggleVoiceInput = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(t.errors.speechNotSupported);
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;

      if (language === 'bn') {
        recognition.lang = 'bn-BD';
      } else if (language === 'hi') {
        recognition.lang = 'hi-IN';
      } else {
        recognition.lang = 'en-US';
      }

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setText(prev => (prev ? `${prev} ${transcript}` : transcript));
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error('Speech recognition error:', err);
      setIsListening(false);
    }
  };

  const handleSend = () => {
    if (!text.trim() || isLoading) return;
    onSendMessage(text.trim());
    setText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="sticky bottom-0 z-20 w-full bg-[#090d16]/95 backdrop-blur-lg border-t border-slate-800/80 px-3 py-2.5 sm:px-6 sm:py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
      <div className="max-w-4xl mx-auto flex flex-col gap-1.5">
        
        {/* Top utility row: Clear Chat & Voice indicator */}
        <div className="flex items-center justify-between px-1 text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5">
            {isListening ? (
              <span className="flex items-center gap-1 text-red-400 font-medium animate-pulse">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                Listening...
              </span>
            ) : (
              <span className="hidden sm:inline-flex items-center gap-1 text-slate-400">
                <Sparkles className="w-3 h-3 text-cyan-400" />
                Press Enter to send, Shift + Enter for new line
              </span>
            )}
          </div>

          {hasMessages && (
            <button
              onClick={onClearChat}
              className="flex items-center gap-1 px-2 py-0.5 rounded text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
              title={t.clearChat}
            >
              <Trash2 className="w-3 h-3" />
              <span>{t.clearChat}</span>
            </button>
          )}
        </div>

        {/* Input box */}
        <div className="relative flex items-end gap-1.5 sm:gap-2 p-1.5 sm:p-2 rounded-2xl bg-slate-900/90 border border-slate-700/80 focus-within:border-blue-500/80 focus-within:ring-2 focus-within:ring-blue-500/20 shadow-lg shadow-black/40 transition-all">
          
          {/* Voice Typing Button (Android Mobile Friendly) */}
          <button
            onClick={toggleVoiceInput}
            className={`p-2 rounded-xl transition-all active:scale-90 ${
              isListening
                ? 'bg-red-500/20 text-red-400 animate-pulse'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
            title="Voice input"
            aria-label="Voice input"
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            rows={1}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t.inputPlaceholder}
            className="flex-1 max-h-32 bg-transparent border-0 text-slate-100 placeholder-slate-400 text-sm sm:text-base resize-none focus:outline-none py-1.5 px-1 leading-relaxed font-normal"
          />

          {/* Send / Loading Button */}
          <button
            onClick={handleSend}
            disabled={!text.trim() || isLoading}
            aria-label={t.send}
            className={`p-2.5 rounded-xl flex items-center justify-center transition-all ${
              text.trim() && !isLoading
                ? 'bg-gradient-to-tr from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md shadow-blue-600/30 active:scale-95'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
