import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../context/LanguageContext';
import { Sprout, Send } from 'lucide-react';

export const Footer: React.FC = () => {
  const location = useLocation();
  const { t } = useTranslation();
  const { language, changeLanguage, availableLanguages } = useLanguage();

  if (location.pathname === '/dashboard') return null;

  return (
    <footer className="relative z-10 border-t border-[#D6D8D3] dark:border-white/[0.08] bg-[#EAEAE4] dark:bg-[#0B1115] text-[#17212B] dark:text-[#F8FAFC] pt-16 pb-12 transition-colors">
      <div className="mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-12 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Logo & Tagline */}
          <div className="md:col-span-4 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#06B6D4] to-[#3B82F6] text-white shadow-glow-cyan">
                <Sprout className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-[#17212B] dark:text-[#F8FAFC]">
                AGRISENSE
              </span>
            </Link>
            <p className="text-xs leading-relaxed text-[#596773] dark:text-[#94A3B8] max-w-sm">
              {t('footer.tagline')}
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#06B6D4]">
              Quick Links
            </div>
            <div className="flex flex-col gap-2.5 text-xs text-[#596773] dark:text-[#94A3B8] font-medium">
              <Link to="/advisor" className="hover:text-[#06B6D4] transition-colors">
                {t('nav.advisor')}
              </Link>
              <Link to="/crops" className="hover:text-[#06B6D4] transition-colors">
                {t('nav.crops')}
              </Link>
              <Link to="/fertilizers" className="hover:text-[#06B6D4] transition-colors">
                {t('nav.fertilizers')}
              </Link>
              <Link to="/insights" className="hover:text-[#06B6D4] transition-colors">
                {t('nav.insights')}
              </Link>
              <Link to="/about" className="hover:text-[#06B6D4] transition-colors">
                {t('nav.about')}
              </Link>
            </div>
          </div>

          {/* Language Selection Buttons */}
          <div className="md:col-span-5 space-y-4">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#06B6D4]">
              Language / ભાષા / भाषा
            </div>
            <div className="flex items-center gap-2">
              {availableLanguages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => changeLanguage(lang.code)}
                  className={`rounded-xl px-4 py-2 text-xs font-bold transition-all min-h-[40px] cursor-pointer ${
                    language === lang.code
                      ? 'bg-[#17212B] text-white dark:bg-[#151E24] dark:text-white border border-[#D6D8D3] dark:border-white/20 shadow-sm'
                      : 'bg-[#F8F8F4] dark:bg-white/5 text-[#17212B] dark:text-slate-300 hover:bg-[#FCFCF9] dark:hover:bg-white/10 border border-[#D6D8D3] dark:border-white/[0.08]'
                  }`}
                >
                  {lang.nativeName}
                </button>
              ))}
            </div>

            {/* Subscribe box */}
            <div className="pt-2">
              <div className="text-[11px] font-semibold text-[#596773] dark:text-[#94A3B8] mb-1.5">
                Subscribe for agronomic tips & updates
              </div>
              <div className="flex items-center gap-2 max-w-sm">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full rounded-xl bg-[#F8F8F4] dark:bg-[#151E24] px-3.5 py-2 text-xs text-[#17212B] dark:text-[#F8FAFC] placeholder-slate-400 focus:outline-none border border-[#D6D8D3] dark:border-white/10"
                />
                <button className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-r from-[#06B6D4] to-[#2563EB] text-white hover:opacity-90 transition-all shrink-0 cursor-pointer shadow-glow-cyan">
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#D6D8D3] dark:border-white/[0.08] pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#77838D] dark:text-[#94A3B8] gap-4">
          <div>
            © 2026 AGRISENSE. {t('footer.rights')}
          </div>
          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span>Precision Agritech Engine</span>
            <span>•</span>
            <span>Soil Chemistry AI</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
