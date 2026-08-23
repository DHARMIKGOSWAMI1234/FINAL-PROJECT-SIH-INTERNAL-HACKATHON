import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { LanguageSwitcher } from './LanguageSwitcher';
import { MagneticButton } from './MagneticButton';
import { UserAvatar } from './UserAvatar';
import {
  Sun,
  Moon,
  ArrowRight,
  Sprout,
  LayoutDashboard,
  LogIn,
  User,
  Settings,
  LogOut,
  ChevronDown,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isDark, setTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();
  const [isVisible, setIsVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 20);

      // Fade out navbar when scrolling down past 50px; fade in when scrolling up
      if (currentScrollY > 50 && currentScrollY > lastScrollY) {
        setIsVisible(false);
        setDropdownOpen(false);
      } else {
        setIsVisible(true);
      }
      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown on click outside or Escape key press
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [dropdownOpen]);

  if (location.pathname === '/dashboard') return null;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ease-in-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-6 pointer-events-none'
      } ${
        isScrolled
          ? 'glass-nav py-3 shadow-sm backdrop-blur-xl bg-[#F2F1EC]/90 dark:bg-[#080C0E]/90 border-b border-[#D6D8D3] dark:border-white/[0.08]'
          : 'bg-transparent py-4'
      }`}
    >
      <div className="mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-12">
        <div className="flex items-center justify-between">
          {/* Logo on Left */}
          <Link to="/" className="flex items-center gap-3 group shrink-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#06B6D4] to-[#3B82F6] text-white shadow-glow-cyan transition-all duration-300 group-hover:scale-105">
              <Sprout className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-bold tracking-tight text-[#17212B] dark:text-[#F8FAFC] font-sans leading-none">
                AGRISENSE
              </span>
              <span className="text-[9px] font-mono font-bold text-[#596773] dark:text-[#94A3B8] tracking-wider uppercase mt-0.5">
                {t('nav.subtitleTag', 'Precision Agronomy Engine')}
              </span>
            </div>
          </Link>

          {/* Right Controls: Language, Light/Dark Mode, Account Dropdown/Sign In, Dashboard */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* 1. Language Changing Option */}
            <LanguageSwitcher />

            {/* 2. Light / Dark Mode Option */}
            <button
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              className="p-2.5 rounded-xl border border-[#D6D8D3] dark:border-white/[0.08] bg-[#F8F8F4] dark:bg-[#0F161A] text-[#17212B] dark:text-[#F8FAFC] hover:border-cyan-500/50 transition-colors shadow-sm cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Toggle Theme"
            >
              {isDark ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-slate-700" />}
            </button>

            {/* 3. Account Dropdown / Sign In Option */}
            {isAuthenticated && user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  aria-expanded={dropdownOpen}
                  aria-haspopup="true"
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all text-xs font-bold shadow-sm cursor-pointer min-h-[44px] ${
                    dropdownOpen
                      ? 'border-cyan-500 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400'
                      : 'border-[#D6D8D3] dark:border-white/[0.08] bg-[#F8F8F4] dark:bg-[#0F161A] text-[#17212B] dark:text-[#F8FAFC] hover:border-cyan-500/50'
                  }`}
                  title={user.email || user.displayName}
                >
                  <UserAvatar
                    photoURL={user.photoURL}
                    name={user.displayName}
                    email={user.email}
                    size="xs"
                  />
                  <span className="max-w-[75px] sm:max-w-[110px] truncate">
                    {user.displayName || 'Account'}
                  </span>
                  <ChevronDown
                    className={`h-3 w-3 text-slate-400 transition-transform duration-200 ${
                      dropdownOpen ? 'rotate-180 text-cyan-500' : ''
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 sm:w-72 rounded-2xl border border-[#D6D8D3] dark:border-white/10 bg-[#F8F8F4] dark:bg-[#0F161A] shadow-xl backdrop-blur-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    {/* User Info Header */}
                    <div className="px-4 py-3 border-b border-[#D6D8D3] dark:border-white/5 flex items-center gap-3">
                      <UserAvatar
                        photoURL={user.photoURL}
                        name={user.displayName}
                        email={user.email}
                        size="lg"
                      />
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-bold text-[#17212B] dark:text-[#F8FAFC] truncate">
                          {user.displayName || 'Farmer'}
                        </span>
                        <span
                          className="text-[11px] font-medium text-[#77838D] dark:text-[#94A3B8] truncate"
                          title={user.email}
                        >
                          {user.email}
                        </span>
                      </div>
                    </div>

                    {/* Navigation Items */}
                    <div className="p-1.5 space-y-0.5">
                      <button
                        type="button"
                        onClick={() => {
                          setDropdownOpen(false);
                          navigate('/profile');
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-[#17212B] dark:text-[#F8FAFC] hover:bg-cyan-500/10 hover:text-cyan-600 dark:hover:text-cyan-400 rounded-xl transition-colors text-left cursor-pointer"
                      >
                        <User className="h-4 w-4 text-cyan-500" />
                        <span>{t('nav.profile', 'Profile')}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setDropdownOpen(false);
                          navigate('/settings');
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-[#17212B] dark:text-[#F8FAFC] hover:bg-cyan-500/10 hover:text-cyan-600 dark:hover:text-cyan-400 rounded-xl transition-colors text-left cursor-pointer"
                      >
                        <Settings className="h-4 w-4 text-cyan-500" />
                        <span>{t('nav.settings', 'Settings')}</span>
                      </button>
                    </div>

                    {/* Sign Out Action */}
                    <div className="p-1.5 pt-1 border-t border-[#D6D8D3] dark:border-white/5">
                      <button
                        type="button"
                        onClick={async () => {
                          setDropdownOpen(false);
                          await logout();
                          navigate('/');
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors text-left cursor-pointer"
                      >
                        <LogOut className="h-4 w-4 text-rose-500" />
                        <span>{t('auth.signOut', 'Sign Out')}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <MagneticButton
                size="sm"
                variant="glass"
                onClick={() => navigate('/login')}
                className="border border-[#D6D8D3] dark:border-white/15 bg-[#F8F8F4] dark:bg-[#0F161A] text-[#17212B] dark:text-[#F8FAFC] hover:border-cyan-500/50 hover:text-cyan-600 dark:hover:text-cyan-400 shadow-sm px-3"
              >
                <LogIn className="h-3.5 w-3.5" />
                <span className="font-bold text-xs">{t('nav.signIn', 'Sign In')}</span>
              </MagneticButton>
            )}

            {/* 4. Dashboard Option (Executive Dark Slate SaaS button) */}
            <button
              onClick={() => navigate('/dashboard')}
              className="px-3.5 py-2 rounded-xl bg-[#17212B] hover:bg-[#243342] text-white dark:bg-[#151E24] dark:hover:bg-[#1D2A32] dark:text-[#F8FAFC] border border-[#17212B] dark:border-white/10 shadow-sm font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer min-h-[44px]"
            >
              <LayoutDashboard className="h-3.5 w-3.5 text-cyan-400 hidden sm:block" />
              <span>{t('nav.goToDashboard', 'Dashboard')}</span>
              <ArrowRight className="h-3.5 w-3.5 text-cyan-400" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
