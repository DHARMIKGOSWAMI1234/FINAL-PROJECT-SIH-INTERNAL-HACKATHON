import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { LanguageSwitcher } from '../common/LanguageSwitcher';
import { Search, Bell, Sun, Moon, Menu } from 'lucide-react';

interface DashboardHeaderProps {
  onOpenMobileMenu: () => void;
  onOpenSearch: () => void;
  onOpenNotifications: () => void;
  unreadNotificationsCount?: number;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  onOpenMobileMenu,
  onOpenSearch,
  onOpenNotifications,
  unreadNotificationsCount = 2,
}) => {
  const { t } = useTranslation();
  const { isDark, setTheme } = useTheme();
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#F8FAFC]/85 dark:bg-[#080B0A]/85 backdrop-blur-xl border-b border-black/5 dark:border-white/10 px-4 sm:px-8 flex items-center justify-between transition-colors">
      {/* Left: Mobile Toggle & Page Greeting */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          aria-label="Open Sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div>
          <h1 className="text-base sm:text-lg font-black text-slate-900 dark:text-warmwhite leading-none">
            {t('dashboard.greeting', { name: user?.displayName || 'Dharmik' })}
          </h1>
          <p className="text-[11px] text-slate-500 dark:text-mutedgray hidden sm:block mt-0.5">
            {t('dashboard.subtitle')}
          </p>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Search Command Trigger (Ctrl + K) */}
        <button
          onClick={onOpenSearch}
          className="flex items-center gap-2 rounded-2xl bg-black/5 dark:bg-white/5 px-3 py-1.5 text-xs text-slate-500 dark:text-slate-400 hover:border-blue-500/40 border border-transparent transition-all"
        >
          <Search className="h-4 w-4 text-blue-500" />
          <span className="hidden md:inline">{t('dashboard.searchPlaceholder')}</span>
          <kbd className="hidden md:inline-flex items-center rounded-lg bg-white dark:bg-charcoal-card px-1.5 py-0.5 text-[10px] font-mono border border-black/10 dark:border-white/10">
            ⌘K
          </kbd>
        </button>

        {/* Language Switcher */}
        <LanguageSwitcher />

        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(isDark ? 'light' : 'dark')}
          className="p-2 rounded-2xl glass-panel text-slate-700 dark:text-warmwhite hover:border-blue-500/50 transition-colors shadow-sm"
          aria-label="Toggle Theme"
        >
          {isDark ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-blue-500" />}
        </button>

        {/* Notifications Trigger */}
        <button
          onClick={onOpenNotifications}
          className="relative p-2 rounded-2xl glass-panel text-slate-700 dark:text-warmwhite hover:border-blue-500/50 transition-colors shadow-sm"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          {unreadNotificationsCount > 0 && (
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-blue-500 animate-ping" />
          )}
          {unreadNotificationsCount > 0 && (
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-blue-500" />
          )}
        </button>
      </div>
    </header>
  );
};
