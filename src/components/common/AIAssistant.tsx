import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { ApiService } from '../../services/api';
import { X, Send, Mic, User, Minus, Globe, Image as ImageIcon, Sparkles, Sprout, TestTube, Search, Activity } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';
import { useToast } from '../../context/ToastContext';
import { FertilizerMascot } from './FertilizerMascot';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export const AIAssistant: React.FC = () => {
  const { language, changeLanguage, availableLanguages } = useLanguage();
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const { isListening, toggleListening, isSupported } = useSpeechRecognition({
    language,
    onTranscript: (text) => setInput(text),
    onError: (err) => {
      showToast(t('aiAssistant.voiceInput', 'Voice Input'), err, 'error');
    },
  });

  React.useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open-ai-assistant', handleOpen);
    return () => window.removeEventListener('open-ai-assistant', handleOpen);
  }, []);

  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // Initialize welcome message
  useEffect(() => {
    setMessages((prev) => {
      if (prev.length === 0 || (prev.length === 1 && prev[0].id === 'm1')) {
        return [
          {
            id: 'm1',
            sender: 'ai',
            text: t(
              'aiAssistant.welcomeMessage',
              "Hello! 👋 I'm your AGRISENSE Assistant. Ask me anything to improve your crop yield!"
            ),
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ];
      }
      return prev;
    });
  }, [language, t]);

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      setHasNewMessage(false);
    }
  }, [messages, isLoading, isOpen]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (isLoading || !query.trim()) return;

    const userMsg: ChatMessage = {
      id: `u_${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsLoading(true);

    try {
      const response = await ApiService.sendAIMessage(query, language);
      const aiMsg: ChatMessage = {
        id: `ai_${Date.now()}`,
        sender: 'ai',
        text: response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);
      if (!isOpen) setHasNewMessage(true);
    } catch {
      // Fallback AI Response
      const aiMsg: ChatMessage = {
        id: `ai_${Date.now()}`,
        sender: 'ai',
        text: t(
          'aiAssistant.fallbackMsg',
          'For optimal crop yield, ensure balanced NPK top-dressing based on your soil moisture and growth stage.'
        ),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMicClick = () => {
    if (!isSupported) {
      showToast(
        t('aiAssistant.voiceInput', 'Voice Input'),
        'Speech recognition is not supported by your browser.',
        'warning'
      );
      return;
    }
    toggleListening(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const currentLangObj = availableLanguages.find((l) => l.code === language) || availableLanguages[0];

  return (
    <>
      {/* ── Collapsed Floating Mascot Trigger Button ── */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3">
          <button
            onClick={() => setIsOpen(true)}
            data-tour="ai-assistant"
            aria-label={t('aiAssistant.orbTooltip', 'Ask AI Assistant')}
            className="group relative flex items-center justify-center cursor-pointer focus:outline-none transition-transform duration-300 hover:scale-105 active:scale-95"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            {/* Outer Glow Halo */}
            <div className="absolute inset-0 rounded-full bg-cyan-500/20 blur-lg pointer-events-none animate-pulse scale-125" />

            {/* Mascot SVG Avatar */}
            <div className="relative z-10 p-1 rounded-full bg-gradient-to-b from-cyan-400 via-blue-600 to-slate-900 shadow-2xl border-2 border-white/40 dark:border-cyan-400/40">
              <FertilizerMascot
                state={isListening ? 'listening' : isLoading ? 'thinking' : 'idle'}
                size={68}
                showBadge={hasNewMessage}
              />
            </div>
          </button>
        </div>
      )}

      {/* ── Expanded AI Assistant Window ── */}
      {isOpen && (
        <div className="fixed bottom-3 right-3 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-1.5rem)] sm:w-[410px] h-[600px] rounded-3xl border border-slate-200 dark:border-slate-800/80 shadow-2xl overflow-hidden flex flex-col bg-white dark:bg-[#0B0F17]/95 animate-in slide-in-from-bottom-5 duration-300 backdrop-blur-2xl">
          {/* Header Bar */}
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800/80 bg-slate-50/90 dark:bg-slate-900/90 px-4 py-3.5">
            <div className="flex items-center gap-3">
              {/* Mascot Headshot Avatar */}
              <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 p-0.5 shadow-md shadow-cyan-500/20">
                <div className="h-full w-full rounded-2xl bg-[#090D16] flex items-center justify-center overflow-hidden">
                  <FertilizerMascot state={isListening ? 'listening' : 'avatar'} size={36} />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 border-2 border-white dark:border-[#0B0F17]" />
              </div>

              <div>
                <div className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span>{t('aiAssistant.windowTitle', 'AGRISENSE Assistant')}</span>
                  <Sparkles className="h-3 w-3 text-cyan-400" />
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-cyan-600 dark:text-cyan-400 font-extrabold">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  <span>{t('aiAssistant.subtitle', 'Your Smart Farming Companion 🌱')}</span>
                </div>
              </div>
            </div>

            {/* Header Controls */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10 hover:text-slate-700 dark:hover:text-white transition-colors cursor-pointer"
                title={t('aiAssistant.minimize', 'Minimize')}
                aria-label={t('aiAssistant.minimize', 'Minimize')}
              >
                <Minus className="h-4 w-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-xl p-1.5 text-slate-400 hover:bg-rose-500/20 hover:text-rose-500 transition-colors cursor-pointer"
                title={t('aiAssistant.close', 'Close')}
                aria-label={t('aiAssistant.close', 'Close')}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Messages Body Viewport */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Welcome Capability Card */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 p-4 space-y-3 shadow-sm">
              <div className="flex items-center gap-2.5">
                <FertilizerMascot state="avatar" size={32} />
                <div>
                  <h4 className="text-xs font-black text-slate-900 dark:text-white">
                    Hello! 👋 {t('aiAssistant.companionIntro', "I'm your AGRISENSE Assistant")}
                  </h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">
                    I can help you with:
                  </p>
                </div>
              </div>

              {/* Interactive Capability Badges */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => handleSend(t('aiAssistant.suggested1', 'What fertilizer should I use for wheat?'))}
                  className="flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 dark:bg-emerald-500/10 px-2.5 py-1.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/20 transition-all cursor-pointer text-left"
                >
                  <Sprout className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                  <span className="truncate">Fertilizer Recs</span>
                </button>

                <button
                  onClick={() => handleSend(t('aiAssistant.suggested3', 'How to cure soil pH imbalance?'))}
                  className="flex items-center gap-1.5 rounded-xl border border-cyan-500/30 bg-cyan-500/10 dark:bg-cyan-500/10 px-2.5 py-1.5 text-[10px] font-bold text-cyan-700 dark:text-cyan-300 hover:bg-cyan-500/20 transition-all cursor-pointer text-left"
                >
                  <TestTube className="h-3.5 w-3.5 shrink-0 text-cyan-500" />
                  <span className="truncate">Soil Analysis</span>
                </button>

                <button
                  onClick={() => handleSend(t('aiAssistant.suggested2', 'Why are my crop leaves turning yellow?'))}
                  className="flex items-center gap-1.5 rounded-xl border border-blue-500/30 bg-blue-500/10 dark:bg-blue-500/10 px-2.5 py-1.5 text-[10px] font-bold text-blue-700 dark:text-blue-300 hover:bg-blue-500/20 transition-all cursor-pointer text-left"
                >
                  <Activity className="h-3.5 w-3.5 shrink-0 text-blue-500" />
                  <span className="truncate">Crop Health</span>
                </button>

                <button
                  onClick={() => handleSend(t('aiAssistant.suggested4', 'Explain optimal NPK split timing'))}
                  className="flex items-center gap-1.5 rounded-xl border border-sky-500/30 bg-sky-500/10 dark:bg-sky-500/10 px-2.5 py-1.5 text-[10px] font-bold text-sky-700 dark:text-sky-300 hover:bg-sky-500/20 transition-all cursor-pointer text-left"
                >
                  <Search className="h-3.5 w-3.5 shrink-0 text-sky-500" />
                  <span className="truncate">NPK Timing</span>
                </button>
              </div>

              <div className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 italic text-center pt-1 border-t border-slate-200 dark:border-slate-800">
                Ask me anything to improve your crop yield! 🌾
              </div>
            </div>

            {/* Chat Messages */}
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-[#090D16] border border-cyan-500/30 p-0.5 shadow-sm mt-1">
                    <FertilizerMascot state="avatar" size={24} />
                  </div>
                )}

                <div
                  className={`max-w-[82%] rounded-2xl px-4 py-3 text-xs font-semibold leading-relaxed shadow-sm ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-br-none'
                      : 'bg-slate-100 dark:bg-slate-800/90 text-slate-900 dark:text-slate-100 rounded-bl-none border border-slate-200 dark:border-slate-700/60'
                  }`}
                >
                  <div>{msg.text}</div>
                  <div className="mt-1 text-[9px] opacity-60 text-right font-mono">{msg.timestamp}</div>
                </div>

                {msg.sender === 'user' && (
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white font-bold text-xs mt-1 shadow-sm">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2.5 items-center text-xs text-slate-500 dark:text-slate-400 italic pl-1">
                <FertilizerMascot state="thinking" size={28} />
                <span className="font-semibold animate-pulse text-cyan-500 dark:text-cyan-400">
                  AI Companion calculating...
                </span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Preset Suggested Questions Scroller */}
          <div className="px-3 py-2 border-t border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/90 flex gap-1.5 overflow-x-auto no-scrollbar">
            <button
              onClick={() => handleSend(t('aiAssistant.suggested1', 'What fertilizer should I use for wheat?'))}
              className="shrink-0 text-[10px] font-bold rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1.5 text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 border border-slate-200 dark:border-slate-700/60 transition-colors cursor-pointer flex items-center gap-1"
            >
              <Sprout className="h-3 w-3 text-emerald-500" />
              <span>{t('aiAssistant.suggested1', 'What fertilizer should I use for wheat?')}</span>
            </button>
            <button
              onClick={() => handleSend(t('aiAssistant.suggested2', 'Why are my crop leaves turning yellow?'))}
              className="shrink-0 text-[10px] font-bold rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1.5 text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 border border-slate-200 dark:border-slate-700/60 transition-colors cursor-pointer flex items-center gap-1"
            >
              <Activity className="h-3 w-3 text-blue-500" />
              <span>{t('aiAssistant.suggested2', 'Why are my crop leaves turning yellow?')}</span>
            </button>
          </div>

          {/* Voice & Text Input Bar */}
          <div className="border-t border-slate-200 dark:border-slate-800/80 p-3 flex items-center gap-2 bg-white dark:bg-[#0B0F17]">
            <button
              onClick={handleMicClick}
              className={`p-2.5 rounded-2xl border transition-colors cursor-pointer ${
                isListening
                  ? 'bg-rose-500 border-rose-500 text-white shadow-lg shadow-rose-500/30 animate-pulse'
                  : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700/60 text-slate-600 dark:text-cyan-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
              title={t('aiAssistant.voiceInput', 'Voice Input')}
              aria-label={t('aiAssistant.voiceInput', 'Voice Input')}
            >
              <Mic className="h-4 w-4" />
            </button>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                isListening
                  ? t('aiAssistant.micSimulated', 'Listening... Speak your crop question')
                  : t('aiAssistant.placeholder', 'Ask about your crops, soil or fertilizers...')
              }
              aria-label={t('aiAssistant.placeholder', 'Ask about your crops, soil or fertilizers...')}
              className="flex-1 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-2.5 text-xs font-semibold text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-500"
            />

            <button
              onClick={() => handleSend()}
              disabled={isLoading || !input.trim()}
              className={`p-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white transition-all shadow-md shadow-emerald-500/20 ${
                isLoading || !input.trim()
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:from-emerald-600 hover:to-teal-600 active:scale-95 cursor-pointer'
              }`}
              title={t('aiAssistant.send', 'Send')}
              aria-label={t('aiAssistant.send', 'Send')}
            >
              <Send className="h-4 w-4" />
            </button>
          </div>

          {/* Bottom Utility & Tagline Footer */}
          <div className="border-t border-slate-200 dark:border-slate-800/80 px-3 py-2 bg-slate-50 dark:bg-slate-950/90 flex items-center justify-between text-[10px]">
            {/* Language Switcher Dropdown Toggle */}
            <div className="relative">
              <button
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-2.5 py-1 font-bold text-slate-700 dark:text-slate-300 hover:border-cyan-500 transition-colors cursor-pointer"
              >
                <Globe className="h-3 w-3 text-cyan-400" />
                <span>{currentLangObj.flag} {currentLangObj.nativeName}</span>
              </button>

              {showLangMenu && (
                <div className="absolute bottom-8 left-0 z-50 w-32 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-1 shadow-xl space-y-0.5">
                  {availableLanguages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        changeLanguage(l.code);
                        setShowLangMenu(false);
                      }}
                      className={`w-full text-left px-2.5 py-1 rounded-lg text-[10px] font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                        language === l.code
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span>{l.flag}</span>
                      <span>{l.nativeName}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Upload Image Button */}
            <button
              onClick={() => showToast(t('aiAssistant.uploadImage', 'Upload Leaf Image'), '📷 Image Diagnosis Module - Coming Soon!', 'info')}
              className="flex items-center gap-1 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-2.5 py-1 font-bold text-slate-700 dark:text-slate-300 hover:border-cyan-500 transition-colors cursor-pointer"
            >
              <ImageIcon className="h-3 w-3 text-cyan-400" />
              <span>Upload Image</span>
            </button>

            {/* Tagline */}
            <div className="hidden sm:block text-[9px] font-mono text-slate-400 dark:text-slate-500">
              Smarter Soil • Better Crops
            </div>
          </div>
        </div>
      )}
    </>
  );
};
