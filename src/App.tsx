import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { WelcomeScreen } from './components/WelcomeScreen';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { ModelSelectorModal } from './components/ModelSelectorModal';
import { GuideModal } from './components/GuideModal';
import { Language, Message, ChatSession, ModelOption } from './types';
import { translations } from './i18n/translations';
import { Loader2, Sparkles, AlertCircle } from 'lucide-react';

const STORAGE_KEY_SESSIONS = 'amar_ai_hub_sessions';
const STORAGE_KEY_LANG = 'amar_ai_hub_language';
const STORAGE_KEY_MODEL = 'amar_ai_hub_model';

const DEFAULT_MODELS: ModelOption[] = [
  {
    id: 'gemini-3.8-flash',
    name: 'Gemini 3.8 Flash',
    tag: 'Recommended',
    badge: 'Fast & Smart',
    description: 'Fastest general-purpose model with strong multilingual fluency in Bengali, Hindi, and English.',
    isDefault: true,
  },
  {
    id: 'gemini-3.1-flash-lite',
    name: 'Gemini 3.1 Flash Lite',
    tag: 'Ultra-Fast',
    badge: 'Lightweight',
    description: 'Extremely quick responses with lowest latency, ideal for low-bandwidth mobile connections.',
    isDefault: false,
  },
  {
    id: 'gemini-4-argon',
    name: 'Gemini 4 Argon',
    tag: 'Deep Reasoning',
    badge: 'Advanced',
    description: 'Flagship reasoning and STEM problem-solving model for complex prompts and code analysis.',
    isDefault: false,
  },
];

export default function App() {
  // Language State
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_LANG);
    if (saved === 'en' || saved === 'bn' || saved === 'hi') return saved;
    // Check browser language
    const navLang = navigator.language.toLowerCase();
    if (navLang.startsWith('bn')) return 'bn';
    if (navLang.startsWith('hi')) return 'hi';
    return 'en';
  });

  // Model State
  const [models, setModels] = useState<ModelOption[]>(DEFAULT_MODELS);
  const [selectedModel, setSelectedModel] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEY_MODEL) || 'gemini-3.8-flash';
  });

  // Chat Sessions State
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    try {
      const data = localStorage.getItem(STORAGE_KEY_SESSIONS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  });

  const [activeSessionId, setActiveSessionId] = useState<string | null>(() => {
    try {
      const data = localStorage.getItem(STORAGE_KEY_SESSIONS);
      if (data) {
        const parsed: ChatSession[] = JSON.parse(data);
        if (parsed.length > 0) return parsed[0].id;
      }
    } catch {
      // ignore
    }
    return null;
  });

  // UI state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isModelModalOpen, setIsModelModalOpen] = useState(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const t = translations[language];

  // Fetch server models
  useEffect(() => {
    fetch('/api/models')
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data.models)) {
          setModels(data.models);
        }
      })
      .catch((err) => {
        console.warn('Could not fetch server models, using defaults:', err);
      });
  }, []);

  // Save sessions to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(sessions));
    } catch (e) {
      console.warn('Failed to save sessions to localStorage:', e);
    }
  }, [sessions]);

  // Save language to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_LANG, language);
  }, [language]);

  // Save selected model
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_MODEL, selectedModel);
  }, [selectedModel]);

  // Auto-scroll when messages update
  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  const activeSession = sessions.find((s) => s.id === activeSessionId) || null;
  const messages = activeSession ? activeSession.messages : [];

  useEffect(() => {
    scrollToBottom('auto');
  }, [activeSessionId]);

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom('smooth');
    }
  }, [messages.length, isLoading]);

  // Create a brand new session
  const handleNewChat = () => {
    const newSessionId = `chat_${Date.now()}`;
    const newSession: ChatSession = {
      id: newSessionId,
      title: `${t.newChat} ${sessions.length + 1}`,
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      language,
      model: selectedModel,
    };
    setSessions((prev) => [newSession, ...prev]);
    setActiveSessionId(newSessionId);
    setErrorMessage(null);
  };

  // Delete a session
  const handleDeleteSession = (id: string) => {
    setSessions((prev) => {
      const updated = prev.filter((s) => s.id !== id);
      if (activeSessionId === id) {
        setActiveSessionId(updated.length > 0 ? updated[0].id : null);
      }
      return updated;
    });
  };

  // Rename a session
  const handleRenameSession = (id: string, newTitle: string) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, title: newTitle, updatedAt: Date.now() } : s))
    );
  };

  // Clear all sessions
  const handleClearAllSessions = () => {
    setSessions([]);
    setActiveSessionId(null);
  };

  // Clear messages in current session
  const handleClearCurrentChat = () => {
    if (!activeSessionId) return;
    setSessions((prev) =>
      prev.map((s) => (s.id === activeSessionId ? { ...s, messages: [], updatedAt: Date.now() } : s))
    );
    setErrorMessage(null);
  };

  // Send message
  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;
    setErrorMessage(null);

    let currentSessionId = activeSessionId;
    let currentSession = sessions.find((s) => s.id === currentSessionId);

    // If no session exists or active session was deleted, create one
    if (!currentSession) {
      currentSessionId = `chat_${Date.now()}`;
      const title = text.length > 30 ? text.slice(0, 30) + '...' : text;
      currentSession = {
        id: currentSessionId,
        title,
        messages: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
        language,
        model: selectedModel,
      };
      setSessions((prev) => [currentSession!, ...prev]);
      setActiveSessionId(currentSessionId);
    } else if (currentSession.messages.length === 0) {
      // Set title from first user query
      const title = text.length > 30 ? text.slice(0, 30) + '...' : text;
      currentSession.title = title;
    }

    const userMessage: Message = {
      id: `msg_user_${Date.now()}`,
      role: 'user',
      text,
      timestamp: Date.now(),
    };

    // Update session state with user message
    const updatedMessages = [...currentSession.messages, userMessage];
    setSessions((prev) =>
      prev.map((s) =>
        s.id === currentSessionId
          ? { ...s, messages: updatedMessages, updatedAt: Date.now() }
          : s
      )
    );

    setIsLoading(true);

    try {
      // Send to server-side proxy
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          conversationHistory: updatedMessages.slice(0, -1),
          model: selectedModel,
          language: language,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorText = data.error || t.errors.serverError;
        setErrorMessage(errorText);

        const errorBotMessage: Message = {
          id: `msg_bot_${Date.now()}`,
          role: 'model',
          text: errorText,
          timestamp: Date.now(),
          modelUsed: selectedModel,
          error: true,
        };

        setSessions((prev) =>
          prev.map((s) =>
            s.id === currentSessionId
              ? { ...s, messages: [...s.messages, errorBotMessage], updatedAt: Date.now() }
              : s
          )
        );
        return;
      }

      // Add AI Response
      const botMessage: Message = {
        id: `msg_bot_${Date.now()}`,
        role: 'model',
        text: data.reply,
        timestamp: Date.now(),
        modelUsed: data.model || selectedModel,
      };

      setSessions((prev) =>
        prev.map((s) =>
          s.id === currentSessionId
            ? { ...s, messages: [...s.messages, botMessage], updatedAt: Date.now() }
            : s
        )
      );
    } catch (err: any) {
      console.error('Error connecting to backend:', err);
      const networkError = t.errors.connectionError;
      setErrorMessage(networkError);

      const errorBotMessage: Message = {
        id: `msg_bot_${Date.now()}`,
        role: 'model',
        text: networkError,
        timestamp: Date.now(),
        modelUsed: selectedModel,
        error: true,
      };

      setSessions((prev) =>
        prev.map((s) =>
          s.id === currentSessionId
            ? { ...s, messages: [...s.messages, errorBotMessage], updatedAt: Date.now() }
            : s
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Retry prompt
  const handleRetry = (promptText: string) => {
    handleSendMessage(promptText);
  };

  const currentModelName = models.find((m) => m.id === selectedModel)?.name || 'Gemini 3.8 Flash';

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#090d16] text-slate-100 font-sans">
      {/* Sidebar for Mobile Drawer & Desktop History */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={setActiveSessionId}
        onNewChat={handleNewChat}
        onDeleteSession={handleDeleteSession}
        onRenameSession={handleRenameSession}
        onClearAll={handleClearAllSessions}
        language={language}
        onOpenGuide={() => setIsGuideModalOpen(true)}
      />

      {/* Main Chat Canvas */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Top Header */}
        <Header
          language={language}
          onLanguageChange={setLanguage}
          selectedModel={selectedModel}
          models={models}
          onOpenModelModal={() => setIsModelModalOpen(true)}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          onNewChat={handleNewChat}
          onOpenGuideModal={() => setIsGuideModalOpen(true)}
          sessionCount={sessions.length}
        />

        {/* Chat Feed */}
        <main className="flex-1 overflow-y-auto px-1 sm:px-4 py-2 sm:py-4">
          <div className="max-w-4xl mx-auto flex flex-col min-h-full">
            {messages.length === 0 ? (
              <WelcomeScreen
                language={language}
                onSelectPrompt={handleSendMessage}
                selectedModelName={currentModelName}
              />
            ) : (
              <div className="flex-1 space-y-1">
                {messages.map((msg, index) => (
                  <ChatMessage
                    key={msg.id}
                    message={msg}
                    language={language}
                    onRetry={() => {
                      // Find previous user query or retry current text
                      const userQuery = msg.role === 'user' ? msg.text : messages[index - 1]?.text || msg.text;
                      handleRetry(userQuery);
                    }}
                    isLast={index === messages.length - 1}
                  />
                ))}

                {/* Loading indicator */}
                {isLoading && (
                  <div className="flex items-center gap-3 px-3 py-3.5 sm:px-4 sm:py-4">
                    <div className="shrink-0 w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white shadow-md">
                      <Sparkles className="w-4 h-4 text-cyan-200 animate-spin" />
                    </div>
                    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl rounded-bl-xs px-4 py-3 flex items-center gap-2.5 text-xs sm:text-sm text-cyan-300 shadow-sm">
                      <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                      <span>{t.loadingMessage}</span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} className="h-4" />
              </div>
            )}
          </div>
        </main>

        {/* Global Error Banner if any */}
        {errorMessage && (
          <div className="mx-3 sm:mx-6 mb-2 p-2.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span className="truncate">{errorMessage}</span>
            </div>
            <button
              onClick={() => setIsGuideModalOpen(true)}
              className="text-xs text-cyan-400 hover:underline shrink-0 ml-2"
            >
              Troubleshoot Key
            </button>
          </div>
        )}

        {/* Chat Input Area */}
        <ChatInput
          language={language}
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          onClearChat={handleClearCurrentChat}
          hasMessages={messages.length > 0}
        />
      </div>

      {/* Model Selector Modal */}
      <ModelSelectorModal
        isOpen={isModelModalOpen}
        onClose={() => setIsModelModalOpen(false)}
        models={models}
        selectedModel={selectedModel}
        onSelectModel={setSelectedModel}
        language={language}
      />

      {/* Guide & Free Hosting Deployment Modal */}
      <GuideModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
        language={language}
      />
    </div>
  );
}
