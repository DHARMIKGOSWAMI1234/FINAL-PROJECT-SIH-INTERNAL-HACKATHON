import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { FirestoreService } from '../services/firestore';
import { GlassCard } from '../components/common/GlassCard';
import { MagneticButton } from '../components/common/MagneticButton';
import { UserAvatar } from '../components/common/UserAvatar';
import { Save, User, Mail, MapPin, Ruler, Loader2, ShieldCheck } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, updateUserProfile } = useAuth();
  const { showToast } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [farmLocation, setFarmLocation] = useState('');
  const [farmSize, setFarmSize] = useState<string>('');

  const [initialLoading, setInitialLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Load real profile from Firestore & Firebase Auth on mount
  useEffect(() => {
    let isMounted = true;

    async function loadProfile() {
      if (!user) {
        setInitialLoading(false);
        return;
      }

      try {
        const firestoreProfile = await FirestoreService.getUserProfile(user.uid);
        if (isMounted) {
          setName(firestoreProfile?.displayName || user.displayName || '');
          setEmail(user.email || '');
          setFarmLocation(firestoreProfile?.farmLocation || '');
          setFarmSize(
            firestoreProfile?.farmSize !== undefined && firestoreProfile?.farmSize !== null
              ? firestoreProfile.farmSize.toString()
              : ''
          );
        }
      } catch {
        if (isMounted) {
          setName(user.displayName || '');
          setEmail(user.email || '');
        }
      } finally {
        if (isMounted) {
          setInitialLoading(false);
        }
      }
    }

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    try {
      const parsedSize = farmSize.trim() ? parseFloat(farmSize.trim()) : null;

      // 1. Update Cloud Firestore user document under users/{uid}
      await FirestoreService.saveUserProfile({
        uid: user.uid,
        displayName: name.trim(),
        email: user.email,
        photoURL: user.photoURL,
        farmLocation: farmLocation.trim(),
        farmSize: isNaN(Number(parsedSize)) ? null : parsedSize,
      });

      // 2. Update Firebase Auth user profile if display name changed
      if (name.trim() !== user.displayName) {
        await updateUserProfile({
          displayName: name.trim(),
        });
      }

      showToast(
        'Profile Saved',
        'Your profile details have been saved successfully.',
        'success'
      );
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Could not save profile.';
      showToast('Save Failed', errMsg, 'warning');
    } finally {
      setSaving(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="pt-36 pb-20 flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="h-10 w-10 text-emerald-500 animate-spin" />
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
          Loading farmer profile...
        </p>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-20 mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in duration-300">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Farmer Profile
        </h1>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 font-medium">
          Manage your personal information and farm profile.
        </p>
      </div>

      {/* Main Profile Form Card */}
      <GlassCard className="border border-emerald-500/20 dark:border-white/10 p-6 sm:p-8 bg-white dark:bg-[#121614] shadow-lg space-y-6">
        {/* User Identity Header */}
        <div className="flex items-center gap-4 pb-6 border-b border-slate-200 dark:border-white/10">
          <UserAvatar
            photoURL={user?.photoURL}
            name={name || user?.displayName}
            email={email || user?.email}
            size="xl"
            className="ring-4 ring-emerald-500/20 shadow-glow-sm"
          />
          <div className="min-w-0">
            <h2 className="text-xl font-black text-slate-900 dark:text-white truncate">
              {name || user?.displayName || 'Farmer'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
              {email || user?.email}
            </p>
            {farmLocation ? (
              <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-bold mt-1">
                <MapPin className="h-3 w-3" />
                {farmLocation}
              </span>
            ) : (
              <span className="text-[11px] text-slate-400 dark:text-slate-500 italic mt-1 block">
                No location set
              </span>
            )}
          </div>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSave} className="space-y-5">
          {/* Full Name */}
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5 flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-emerald-500" />
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Rajesh Sharma"
              className="w-full glass-panel rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none border border-slate-300 dark:border-white/10 focus:border-emerald-500 bg-white dark:bg-[#171C19]"
            />
          </div>

          {/* Email Address (Read-Only) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-emerald-500" />
                Email Address
              </label>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-white/5 px-2 py-0.5 rounded-full">
                <ShieldCheck className="h-3 w-3 text-emerald-500" />
                Firebase Auth Managed
              </span>
            </div>
            <input
              type="email"
              value={email}
              readOnly
              disabled
              className="w-full glass-panel rounded-xl px-4 py-2.5 text-xs text-slate-500 dark:text-slate-400 bg-slate-100/70 dark:bg-white/5 border border-slate-200 dark:border-white/5 cursor-not-allowed select-none"
            />
          </div>

          {/* Farm Location */}
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5 flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-emerald-500" />
              Farm Location / Region
            </label>
            <input
              type="text"
              value={farmLocation}
              onChange={(e) => setFarmLocation(e.target.value)}
              placeholder="e.g. Nashik, Maharashtra, India"
              className="w-full glass-panel rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none border border-slate-300 dark:border-white/10 focus:border-emerald-500 bg-white dark:bg-[#171C19]"
            />
          </div>

          {/* Farm Size */}
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5 flex items-center gap-1.5">
              <Ruler className="h-3.5 w-3.5 text-emerald-500" />
              Farm Size (Acres)
            </label>
            <input
              type="number"
              min="0"
              step="0.1"
              value={farmSize}
              onChange={(e) => setFarmSize(e.target.value)}
              placeholder="e.g. 5.5"
              className="w-full glass-panel rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none border border-slate-300 dark:border-white/10 focus:border-emerald-500 bg-white dark:bg-[#171C19]"
            />
          </div>

          {/* Save Button */}
          <div className="pt-3">
            <MagneticButton
              size="md"
              variant="primary"
              disabled={saving}
              className="bg-emerald-600 hover:bg-emerald-500 text-white border-none shadow-md font-bold text-xs"
            >
              {saving ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Saving to Cloud...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  <span>Save Profile</span>
                </div>
              )}
            </MagneticButton>
          </div>
        </form>
      </GlassCard>
    </div>
  );
};
