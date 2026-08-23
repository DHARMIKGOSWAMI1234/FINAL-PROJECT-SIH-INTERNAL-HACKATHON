import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import {
  Sprout,
  LayoutDashboard,
  FlaskConical,
  BookOpen,
  History,
  Heart,
  Settings,
  HelpCircle,
  Sparkles,
  User,
  LogOut,
  X,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAiAssistant?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, onOpenAiAssistant }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const navItems = [
    { to: '/dashboard', labelKey: 'nav.overview', icon: LayoutDashboard, tourId: 'dashboard' },
    { to: '/advisor', labelKey: 'nav.advisor', icon: FlaskConical, tourId: 'fertilizer-advisor' },
    { to: '/crops', labelKey: 'nav.myCrops', icon: Sprout, tourId: 'my-crops' },
    { to: '/fertilizers', labelKey: 'nav.fertilizerLibrary', icon: BookOpen, tourId: 'fertilizer-library' },
    { to: '/insights', labelKey: 'nav.insights', icon: BookOpen, tourId: 'insights' },
    { to: '/history', labelKey: 'nav.history', icon: History, tourId: 'history' },
    { to: '/favorites', labelKey: 'nav.favorites', icon: Heart },
  ];

  const toolItems = [
    { labelKey: 'nav.aiAssistant', icon: Sparkles, tourId: 'ai-assistant', action: () => { if (onOpenAiAssistant) onOpenAiAssistant(); navigate('/assistant'); } },
    { labelKey: 'nav.soilAnalysis', icon: FlaskConical, action: () => navigate('/advisor') },
  ];

  const preferenceItems = [
    { to: '/settings', labelKey: 'nav.settings', icon: Settings, tourId: 'settings' },
    { to: '/login', labelKey: 'nav.login', icon: User },
    { to: '/about', labelKey: 'nav.help', icon: HelpCircle },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-[260px] bg-white/95 dark:bg-[#080B0A]/95 backdrop-blur-2xl border-r border-slate-200 dark:border-white/10 flex flex-col justify-between transition-all duration-300 shadow-sm ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-6 space-y-7 overflow-y-auto">
          {/* Header Brand */}
          <div className="flex items-center justify-between">
            <NavLink to="/" className="flex items-center gap-3 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 via-cyan-500 to-sky-400 text-white shadow-md transition-transform group-hover:scale-105">
                <Sprout className="h-5.5 w-5.5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black text-slate-900 dark:text-warmwhite leading-none">
                  AGRISENSE
                </span>
                <span className="text-[9px] font-bold text-slate-400 dark:text-blue-400 tracking-wider uppercase mt-1">
                  {t('nav.subtitleTag')}
                </span>
              </div>
            </NavLink>

            {/* Mobile Close Button */}
            <button
              onClick={onClose}
              aria-label="Close sidebar"
              title="Close sidebar"
              className="lg:hidden p-1.5 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Primary Navigation */}
          <div className="space-y-1.5">
            <div className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500 px-3 mb-2">
              {t('nav.mainMenu')}
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onClose}
                  data-tour={item.tourId}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all duration-200 ${
                      isActive
                        ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30 shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
                    }`
                  }
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{t(item.labelKey)}</span>
                </NavLink>
              );
            })}
          </div>

          {/* Tools Section */}
          <div className="space-y-1.5 pt-4 border-t border-black/5 dark:border-white/5">
            <div className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500 px-3 mb-2">
              {t('nav.tools')}
            </div>
            {toolItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    if (item.action) item.action();
                    onClose();
                  }}
                  data-tour={item.tourId}
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white transition-all text-left cursor-pointer"
                >
                  <Icon className="h-4 w-4 text-blue-500 shrink-0" />
                  <span>{t(item.labelKey)}</span>
                </button>
              );
            })}
          </div>

          {/* Preferences */}
          <div className="space-y-1.5 pt-4 border-t border-black/5 dark:border-white/5">
            <div className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500 px-3 mb-2">
              {t('nav.preferences')}
            </div>
            {preferenceItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onClose}
                  data-tour={item.tourId}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all duration-200 ${
                      isActive
                        ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
                    }`
                  }
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{t(item.labelKey)}</span>
                </NavLink>
              );
            })}
          </div>
        </div>

        {/* User Profile Card at Bottom */}
        <div className="p-4 border-t border-black/5 dark:border-white/10 bg-black/5 dark:bg-white/[0.02] flex items-center justify-between gap-2">
          <div
            onClick={() => navigate('/profile')}
            className="flex items-center gap-3 p-1.5 rounded-2xl cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors group flex-1 overflow-hidden"
          >
            <img
              src={user?.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
              alt={user?.displayName || 'Farmer'}
              className="h-9 w-9 rounded-full object-cover border border-blue-500/30 shrink-0"
            />
            <div className="flex-1 overflow-hidden">
              <div className="text-xs font-extrabold text-slate-900 dark:text-warmwhite truncate">
                {user?.displayName || 'Dharmik'}
              </div>
              <div className="text-[10px] text-slate-500 dark:text-mutedgray truncate">
                {user?.email || t('nav.roleFarmer')}
              </div>
            </div>
          </div>
          {user && (
            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              title="Logout"
              className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer shrink-0"
            >
              <LogOut className="h-4 w-4" />
            </button>
          )}
        </div>
      </aside>
    </>
  );
};
