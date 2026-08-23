import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCommandPalette } from '../../context/CommandPaletteContext';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { MOCK_CROPS } from '../../data/crops';
import { MOCK_FERTILIZERS } from '../../data/fertilizers';
import { MOCK_ARTICLES } from '../../data/articles';
import { Search, Sprout, FlaskConical, BookOpen, Sun, Moon, Sparkles, Navigation, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const CommandPalette: React.FC = () => {
  const { isOpen, closePalette } = useCommandPalette();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isDark, setTheme } = useTheme();
  const { language, changeLanguage } = useLanguage();
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (isOpen) setQuery('');
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredCrops = MOCK_CROPS.filter(
    (c) =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      (c.localNames[language] && c.localNames[language].toLowerCase().includes(query.toLowerCase()))
  );

  const filteredFertilizers = MOCK_FERTILIZERS.filter(
    (f) =>
      f.name.toLowerCase().includes(query.toLowerCase()) ||
      f.npkRatio.includes(query)
  );

  const filteredArticles = MOCK_ARTICLES.filter((a) =>
    a.title.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelectRoute = (path: string) => {
    navigate(path);
    closePalette();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="glass-panel w-full max-w-2xl overflow-hidden rounded-2xl shadow-2xl border border-emerald-500/30">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 border-b border-emerald-500/20 px-4 py-3.5">
          <Search className="h-5 w-5 text-emerald-500" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('dashboard.searchPlaceholder')}
            className="w-full bg-transparent text-sm font-medium text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
            autoFocus
          />
          <kbd className="hidden sm:inline-flex items-center gap-1 rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-500">
            ESC
          </kbd>
          <button onClick={closePalette} className="p-1 text-slate-400 hover:text-slate-100">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Results Body */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-4">
          {/* Action Quick Links */}
          {!query && (
            <div>
              <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Quick Navigation & Actions
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 mt-1">
                <button
                  onClick={() => handleSelectRoute('/advisor')}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-emerald-500/15 hover:text-emerald-500 transition-colors text-left"
                >
                  <Sparkles className="h-4 w-4 text-emerald-500" />
                  <span>Start AI Soil Recommendation</span>
                </button>
                <button
                  onClick={() => handleSelectRoute('/dashboard')}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-emerald-500/15 hover:text-emerald-500 transition-colors text-left"
                >
                  <Navigation className="h-4 w-4 text-emerald-500" />
                  <span>Open Farmer Dashboard</span>
                </button>
                <button
                  onClick={() => {
                    setTheme(isDark ? 'light' : 'dark');
                    closePalette();
                  }}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-emerald-500/15 hover:text-emerald-500 transition-colors text-left"
                >
                  {isDark ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-indigo-400" />}
                  <span>Toggle {isDark ? 'Light' : 'Dark'} Mode</span>
                </button>
                <button
                  onClick={() => {
                    changeLanguage(language === 'en' ? 'hi' : language === 'hi' ? 'gu' : 'en');
                    closePalette();
                  }}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-emerald-500/15 hover:text-emerald-500 transition-colors text-left"
                >
                  <Sparkles className="h-4 w-4 text-emerald-500" />
                  <span>Switch Language ({language.toUpperCase()})</span>
                </button>
              </div>
            </div>
          )}

          {/* Crops Results */}
          {filteredCrops.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Crops ({filteredCrops.length})
              </div>
              <div className="space-y-1 mt-1">
                {filteredCrops.slice(0, 4).map((crop) => (
                  <button
                    key={crop.id}
                    onClick={() => handleSelectRoute(`/crops/${crop.id}`)}
                    className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-emerald-500/15 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <Sprout className="h-4 w-4 text-emerald-500" />
                      <span className="font-semibold">{crop.name}</span>
                      <span className="text-[10px] text-slate-400">{crop.category} • {crop.season}</span>
                    </div>
                    <span className="text-[10px] font-medium text-emerald-400">NPK {crop.idealNPK.n}-{crop.idealNPK.p}-{crop.idealNPK.k}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Fertilizers Results */}
          {filteredFertilizers.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Fertilizers ({filteredFertilizers.length})
              </div>
              <div className="space-y-1 mt-1">
                {filteredFertilizers.slice(0, 4).map((fert) => (
                  <button
                    key={fert.id}
                    onClick={() => handleSelectRoute(`/fertilizers/${fert.id}`)}
                    className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-emerald-500/15 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <FlaskConical className="h-4 w-4 text-amber-500" />
                      <span className="font-semibold">{fert.name}</span>
                    </div>
                    <span className="text-[10px] rounded bg-emerald-500/20 px-2 py-0.5 text-emerald-400 font-mono">
                      {fert.npkRatio}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Articles Results */}
          {filteredArticles.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Insights & Guides ({filteredArticles.length})
              </div>
              <div className="space-y-1 mt-1">
                {filteredArticles.slice(0, 3).map((article) => (
                  <button
                    key={article.id}
                    onClick={() => handleSelectRoute(`/insights/${article.id}`)}
                    className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-emerald-500/15 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <BookOpen className="h-4 w-4 text-blue-400" />
                      <span className="font-semibold truncate max-w-sm">{article.title}</span>
                    </div>
                    <span className="text-[10px] text-slate-400">{article.readTime}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
