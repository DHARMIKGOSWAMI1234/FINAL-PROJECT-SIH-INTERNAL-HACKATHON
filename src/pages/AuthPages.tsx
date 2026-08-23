import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { GlassCard } from '../components/common/GlassCard';
import { MagneticButton } from '../components/common/MagneticButton';
import {
  Sprout,
  Lock,
  Mail,
  User,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
} from 'lucide-react';

export const AuthPages: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { login, signup, loginWithGoogle, resetPassword, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const [googleLoading, setGoogleLoading] = useState(false);

  // Determine mode from route path or fallback to 'login'
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>(() => {
    if (location.pathname.includes('signup') || location.pathname.includes('register')) return 'signup';
    if (location.pathname.includes('forgot')) return 'forgot';
    return 'login';
  });

  useEffect(() => {
    if (location.pathname.includes('signup') || location.pathname.includes('register')) {
      setMode('signup');
    } else if (location.pathname.includes('forgot')) {
      setMode('forgot');
    } else {
      setMode('login');
    }
  }, [location.pathname]);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Field validation errors
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const from = (location.state as { from?: { pathname?: string } })?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, location.state, navigate]);

  const validateEmail = (val: string) => {
    if (!val.trim()) return t('auth.errEmailRequired', 'Email address is required.');
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(val.trim())) return t('auth.errEmailInvalid', 'Please enter a valid email address.');
    return '';
  };

  const validatePassword = (val: string) => {
    if (!val) return t('auth.errPasswordRequired', 'Password is required.');
    if (val.length < 6) return t('auth.errPasswordMin', 'Password must be at least 6 characters long.');
    return '';
  };

  const validateName = (val: string) => {
    if (!val.trim()) return t('auth.errNameRequired', 'Full name is required.');
    return '';
  };

  const validateConfirmPassword = (val: string, pass: string) => {
    if (!val) return t('auth.errConfirmPasswordRequired', 'Please confirm your password.');
    if (val !== pass) return t('auth.errPasswordMismatch', 'Passwords do not match.');
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    const newErrors: { name?: string; email?: string; password?: string; confirmPassword?: string } = {};

    if (mode === 'signup') {
      const nameErr = validateName(name);
      if (nameErr) newErrors.name = nameErr;
    }

    const emailErr = validateEmail(email);
    if (emailErr) newErrors.email = emailErr;

    if (mode !== 'forgot') {
      const passErr = validatePassword(password);
      if (passErr) newErrors.password = passErr;
    }

    if (mode === 'signup') {
      const confirmErr = validateConfirmPassword(confirmPassword, password);
      if (confirmErr) newErrors.confirmPassword = confirmErr;
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);

    try {
      const redirectTarget = (location.state as { from?: { pathname?: string } })?.from?.pathname || '/';
      if (mode === 'login') {
        await login(email, password, rememberMe);
        showToast(t('auth.welcomeBack', 'Welcome back!'), t('auth.loginSuccess', 'Signed in successfully!'), 'success');
        navigate(redirectTarget, { replace: true });
      } else if (mode === 'signup') {
        await signup(name, email, password);
        showToast(t('auth.registerSuccess', 'Account created successfully!'), t('auth.loginSuccess', 'Signed in successfully!'), 'success');
        navigate(redirectTarget, { replace: true });
      } else if (mode === 'forgot') {
        await resetPassword(email);
        showToast(t('auth.resetLinkSent', 'Password reset link sent to your email.'), '', 'info');
        setMode('login');
      }
    } catch (err: unknown) {
      const errKey = err instanceof Error ? err.message : 'errNetwork';
      const friendlyMsg = t(`auth.${errKey}`, 'Authentication error. Please check your details and try again.');
      setAuthError(friendlyMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setAuthError(null);
    setGoogleLoading(true);
    try {
      await loginWithGoogle();
      showToast(
        t('auth.welcomeBack', 'Welcome back!'),
        t('auth.loginSuccess', 'Signed in with Google successfully!'),
        'success'
      );
      const from = (location.state as { from?: { pathname?: string } })?.from?.pathname || '/';
      navigate(from, { replace: true });
    } catch (err: unknown) {
      const errKey = err instanceof Error ? err.message : 'errNetwork';
      if (errKey === 'errPopupClosed') {
        // User voluntarily closed the Google popup window
        return;
      }
      const friendlyMsg = t(
        `auth.${errKey}`,
        'Google authentication failed. Please try again.'
      );
      setAuthError(friendlyMsg);
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="pt-28 pb-20 mx-auto max-w-md px-4 space-y-6 animate-in fade-in duration-300">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-500 to-lime-400 p-2.5 text-white mx-auto shadow-glow-emerald">
          <Sprout className="h-7 w-7" />
        </div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">
          {mode === 'login' && t('auth.welcomeBack', 'Welcome back')}
          {mode === 'signup' && t('auth.createAccountTitle', 'Create your AGRISENSE account')}
          {mode === 'forgot' && t('auth.forgotPasswordTitle', 'Reset Password')}
        </h1>
        <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 max-w-xs mx-auto">
          {mode === 'login' && t('auth.loginSubtitle', 'Sign in to continue to your precision agriculture dashboard.')}
          {mode === 'signup' && t('auth.createAccountSubtitle', 'Join AGRISENSE for precision soil advisory & agronomic analytics.')}
          {mode === 'forgot' && t('auth.forgotPasswordSubtitle', 'Enter your email address to receive password reset instructions.')}
        </p>
      </div>

      {/* Main Authentication Glass Card */}
      <GlassCard className="border border-emerald-500/20 dark:border-white/10 p-6 sm:p-8 bg-white dark:bg-[#121614] shadow-md space-y-5">
        {/* Auth Error Banner */}
        {authError && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2 text-rose-700 dark:text-rose-400 text-xs font-bold animate-in slide-in-from-top-2">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{authError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name Field (Register Mode Only) */}
          {mode === 'signup' && (
            <div>
              <label className="text-xs font-extrabold text-slate-800 dark:text-slate-200 block mb-1">
                {t('auth.nameLabel', 'Full Name')}
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors({ ...errors, name: undefined });
                  }}
                  placeholder={t('auth.namePlaceholder', 'Farmer Name')}
                  className={`w-full glass-panel rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none border ${
                    errors.name ? 'border-rose-500' : 'border-slate-300 dark:border-white/10 focus:border-emerald-500'
                  } bg-white dark:bg-[#171C19]`}
                />
              </div>
              {errors.name && (
                <p className="text-[11px] font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1 mt-1">
                  <AlertCircle className="h-3 w-3" />
                  <span>{errors.name}</span>
                </p>
              )}
            </div>
          )}

          {/* Email Field */}
          <div>
            <label className="text-xs font-extrabold text-slate-800 dark:text-slate-200 block mb-1">
              {t('auth.emailLabel', 'Email Address')}
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors({ ...errors, email: undefined });
                }}
                placeholder={t('auth.emailPlaceholder', 'farmer@agritech.com')}
                className={`w-full glass-panel rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none border ${
                  errors.email ? 'border-rose-500' : 'border-slate-300 dark:border-white/10 focus:border-emerald-500'
                } bg-white dark:bg-[#171C19]`}
              />
            </div>
            {errors.email && (
              <p className="text-[11px] font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1 mt-1">
                <AlertCircle className="h-3 w-3" />
                <span>{errors.email}</span>
              </p>
            )}
          </div>

          {/* Password Field (Login & Register Modes) */}
          {mode !== 'forgot' && (
            <div>
              <label className="text-xs font-extrabold text-slate-800 dark:text-slate-200 block mb-1">
                {t('auth.passwordLabel', 'Password')}
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors({ ...errors, password: undefined });
                  }}
                  placeholder={t('auth.passwordPlaceholder', '••••••••')}
                  className={`w-full glass-panel rounded-xl pl-10 pr-10 py-2.5 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none border ${
                    errors.password ? 'border-rose-500' : 'border-slate-300 dark:border-white/10 focus:border-emerald-500'
                  } bg-white dark:bg-[#171C19]`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-[11px] font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1 mt-1">
                  <AlertCircle className="h-3 w-3" />
                  <span>{errors.password}</span>
                </p>
              )}
            </div>
          )}

          {/* Confirm Password Field (Register Mode Only) */}
          {mode === 'signup' && (
            <div>
              <label className="text-xs font-extrabold text-slate-800 dark:text-slate-200 block mb-1">
                {t('auth.confirmPasswordLabel', 'Confirm Password')}
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: undefined });
                  }}
                  placeholder={t('auth.confirmPasswordPlaceholder', '••••••••')}
                  className={`w-full glass-panel rounded-xl pl-10 pr-10 py-2.5 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none border ${
                    errors.confirmPassword ? 'border-rose-500' : 'border-slate-300 dark:border-white/10 focus:border-emerald-500'
                  } bg-white dark:bg-[#171C19]`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-[11px] font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1 mt-1">
                  <AlertCircle className="h-3 w-3" />
                  <span>{errors.confirmPassword}</span>
                </p>
              )}
            </div>
          )}

          {/* Options Bar: Remember Me & Forgot Password (Login Mode) */}
          {mode === 'login' && (
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 h-4 w-4 cursor-pointer"
                />
                <span>{t('auth.rememberMe', 'Remember me')}</span>
              </label>

              <button
                type="button"
                onClick={() => setMode('forgot')}
                className="font-extrabold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
              >
                {t('auth.forgotPassword', 'Forgot password?')}
              </button>
            </div>
          )}

          {/* Submit Button */}
          <MagneticButton
            size="md"
            variant="primary"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white border-none shadow-md mt-2"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin mx-auto" />
            ) : (
              <div className="flex items-center justify-center gap-2 font-black text-xs">
                <span>
                  {mode === 'login' && t('auth.signInBtn', 'Sign In')}
                  {mode === 'signup' && t('auth.createAccountBtn', 'Create Account')}
                  {mode === 'forgot' && t('auth.sendResetLinkBtn', 'Send Reset Link')}
                </span>
                <ArrowRight className="h-4 w-4" />
              </div>
            )}
          </MagneticButton>
        </form>

        {/* Google Sign-In Option (Login & Signup Modes) */}
        {(mode === 'login' || mode === 'signup') && (
          <div className="space-y-4 pt-1">
            <div className="relative flex items-center justify-center">
              <div className="border-t border-slate-300 dark:border-white/10 w-full" />
              <span className="bg-white dark:bg-[#121614] px-3 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap">
                {t('auth.orDivider', 'or continue with')}
              </span>
              <div className="border-t border-slate-300 dark:border-white/10 w-full" />
            </div>

            <button
              type="button"
              disabled={googleLoading || loading}
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl border border-slate-300 dark:border-white/15 bg-white hover:bg-slate-50 dark:bg-[#171C19] dark:hover:bg-[#1f2622] text-slate-800 dark:text-slate-200 text-xs font-bold transition-all shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {googleLoading ? (
                <Loader2 className="h-4 w-4 animate-spin text-emerald-500" />
              ) : (
                <>
                  <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>{t('auth.continueWithGoogle', 'Continue with Google')}</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Footer Navigation Links */}
        <div className="pt-4 border-t border-slate-300 dark:border-white/10 text-center text-xs font-extrabold text-slate-600 dark:text-slate-400">
          {mode === 'login' && (
            <p>
              <span>{t('auth.dontHaveAccount', "Don't have an account?")} </span>
              <button
                type="button"
                onClick={() => setMode('signup')}
                className="text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer ml-1"
              >
                {t('auth.createAccountLink', 'Create Account')}
              </button>
            </p>
          )}

          {mode === 'signup' && (
            <p>
              <span>{t('auth.alreadyHaveAccount', 'Already have an account?')} </span>
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer ml-1"
              >
                {t('auth.signInLink', 'Sign In')}
              </button>
            </p>
          )}

          {mode === 'forgot' && (
            <button
              type="button"
              onClick={() => setMode('login')}
              className="text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
            >
              {t('auth.backToLogin', 'Back to Sign In')}
            </button>
          )}
        </div>
      </GlassCard>
    </div>
  );
};
