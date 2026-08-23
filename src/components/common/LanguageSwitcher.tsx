import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useToast } from '../../context/ToastContext';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { LanguageCode } from '../../types';

export const LanguageSwitcher: React.FC = () => {
  const { language, changeLanguage, availableLanguages } = useLanguage();
  const { showToast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const currentLangObj = availableLanguages.find((l) => l.code === language) || availableLanguages[0];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (code: LanguageCode, nativeName: string) => {
    changeLanguage(code);
    setIsOpen(false);

    const toastTitles: Record<LanguageCode, string> = {
      en: '🌐 Language Changed',
      hi: '🌐 भाषा बदली गई',
      gu: '🌐 ભાષા બદલાઈ ગઈ',
    };

    const toastMsgs: Record<LanguageCode, string> = {
      en: `Switched to ${nativeName}`,
      hi: `${nativeName} भाषा चुनी गई`,
      gu: `${nativeName} ભાષા પસંદ કરવામાં આવી`,
    };

    showToast(toastTitles[code], toastMsgs[code], 'info');
  };

  return (
    <div ref={dropdownRef} className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="glass-panel flex items-center gap-2 rounded-2xl px-3.5 py-2 text-xs font-semibold text-slate-800 dark:text-warmwhite hover:border-agri-emerald/50 transition-all duration-200"
        aria-label="Select Language"
      >
        <Globe className="h-4 w-4 text-agri-emerald" />
        <span className="font-bold">{currentLangObj.name}</span>
        <ChevronDown className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="glass-panel absolute right-0 mt-2 w-48 rounded-2xl p-1.5 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150 bg-charcoal-card border border-white/10">
          {availableLanguages.map((lang) => {
            const isSelected = lang.code === language;
            return (
              <button
                key={lang.code}
                onClick={() => handleSelect(lang.code, lang.nativeName)}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition-colors ${
                  isSelected
                    ? 'bg-agri-emerald/20 text-agri-emerald font-bold'
                    : 'text-slate-700 dark:text-warmwhite hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-[10px] font-mono font-bold uppercase rounded bg-white/10 px-1.5 py-0.5 text-slate-400">
                    {lang.code}
                  </span>
                  <span>{lang.nativeName}</span>
                </div>
                {isSelected && <Check className="h-4 w-4 text-agri-emerald" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
