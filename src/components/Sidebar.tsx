import React, { useState } from 'react';
import { 
  X, 
  Plus, 
  MessageSquare, 
  Trash2, 
  Edit2, 
  Check, 
  ShieldCheck, 
  Sparkles,
  ExternalLink,
  BookOpen
} from 'lucide-react';
import { ChatSession, Language } from '../types';
import { translations } from '../i18n/translations';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: ChatSession[];
  activeSessionId: string | null;
  onSelectSession: (id: string) => void;
  onNewChat: () => void;
  onDeleteSession: (id: string) => void;
  onRenameSession: (id: string, newTitle: string) => void;
  onClearAll: () => void;
  language: Language;
  onOpenGuide: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  sessions,
  activeSessionId,
  onSelectSession,
  onNewChat,
  onDeleteSession,
  onRenameSession,
  onClearAll,
  language,
  onOpenGuide,
}) => {
  const t = translations[language];
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);

  const startEditing = (e: React.MouseEvent, session: ChatSession) => {
    e.stopPropagation();
    setEditingId(session.id);
    setEditTitle(session.title);
  };

  const handleSaveRename = (e: React.MouseEvent | React.FormEvent, id: string) => {
    e.stopPropagation();
    if (editTitle.trim()) {
      onRenameSession(id, editTitle.trim());
    }
    setEditingId(null);
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    onDeleteSession(id);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity md:hidden"
        />
      )}

      {/* Sidebar Drawer */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-72 sm:w-80 flex flex-col bg-[#080c16] border-r border-slate-800/80 transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0 md:w-72 md:flex'
        }`}
      >
        {/* Top header */}
        <div className="p-4 flex items-center justify-between border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
              <Sparkles className="w-4 h-4 text-cyan-400" />
            </div>
            <span className="font-bold text-sm text-slate-200 tracking-wide">
              {t.chatHistory}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 md:hidden"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* New Chat Button */}
        <div className="p-3">
          <button
            onClick={() => {
              onNewChat();
              onClose();
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium text-sm shadow-md shadow-blue-600/20 transition-all active:scale-98"
          >
            <Plus className="w-4 h-4" />
            <span>{t.newChat}</span>
          </button>
        </div>

        {/* Sessions List */}
        <div className="flex-1 overflow-y-auto px-2 py-1 space-y-1">
          {sessions.length === 0 ? (
            <div className="p-6 text-center text-slate-500 text-xs">
              <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-30 text-slate-400" />
              {t.noHistory}
            </div>
          ) : (
            sessions.map((session) => {
              const isActive = session.id === activeSessionId;
              const isEditing = editingId === session.id;

              return (
                <div
                  key={session.id}
                  onClick={() => {
                    onSelectSession(session.id);
                    onClose();
                  }}
                  className={`group relative flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs cursor-pointer transition-all ${
                    isActive
                      ? 'bg-blue-600/15 text-blue-200 border border-blue-500/30 font-semibold'
                      : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                  }`}
                >
                  <MessageSquare className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-blue-400' : 'text-slate-500'}`} />

                  {isEditing ? (
                    <form
                      onSubmit={(e) => handleSaveRename(e, session.id)}
                      className="flex-1 flex items-center gap-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        autoFocus
                        className="w-full bg-slate-900 border border-blue-500/50 rounded px-1.5 py-0.5 text-xs text-white focus:outline-none"
                      />
                      <button
                        type="submit"
                        className="p-1 hover:text-green-400 text-slate-300"
                        title={t.save}
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    </form>
                  ) : (
                    <span className="flex-1 truncate tracking-tight">{session.title}</span>
                  )}

                  {!isEditing && (
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => startEditing(e, session)}
                        className="p-1 text-slate-400 hover:text-blue-400 rounded transition-colors"
                        title={t.rename}
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={(e) => handleDelete(e, session.id)}
                        className="p-1 text-slate-400 hover:text-red-400 rounded transition-colors"
                        title={t.delete}
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer actions */}
        <div className="p-3 border-t border-slate-800/80 space-y-2">
          {sessions.length > 0 && (
            <button
              onClick={() => setConfirmClearOpen(true)}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 text-xs text-red-400/80 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{t.clearHistory}</span>
            </button>
          )}

          <button
            onClick={() => {
              onOpenGuide();
              onClose();
            }}
            className="w-full flex items-center justify-between px-3 py-2 text-xs bg-slate-900/60 hover:bg-slate-800/60 border border-slate-800 rounded-lg text-slate-300 transition-colors"
          >
            <div className="flex items-center gap-2">
              <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
              <span>{t.guidesTitle}</span>
            </div>
            <ExternalLink className="w-3 h-3 text-slate-500" />
          </button>

          <div className="flex items-center justify-center gap-1.5 pt-1 text-[11px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Server Proxy Protected API</span>
          </div>
        </div>

        {/* Clear all confirmation modal */}
        {confirmClearOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 max-w-xs w-full shadow-2xl">
              <h4 className="text-sm font-semibold text-white mb-2">
                {t.clearHistory}
              </h4>
              <p className="text-xs text-slate-400 mb-4">
                {t.confirmClear}
              </p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setConfirmClearOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-800 rounded-lg"
                >
                  {t.cancel}
                </button>
                <button
                  onClick={() => {
                    onClearAll();
                    setConfirmClearOpen(false);
                  }}
                  className="px-3 py-1.5 text-xs bg-red-600 hover:bg-red-500 text-white font-medium rounded-lg shadow"
                >
                  {t.delete}
                </button>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};
