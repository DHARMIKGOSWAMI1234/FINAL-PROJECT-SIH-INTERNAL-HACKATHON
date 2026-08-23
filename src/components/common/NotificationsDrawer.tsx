import React, { useState } from 'react';
import { StorageService } from '../../services/storage';
import { UserNotification } from '../../types';
import { Bell, X, CheckCheck, Info, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const NotificationsDrawer: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<UserNotification[]>(() =>
    StorageService.getNotifications()
  );
  const { t } = useTranslation();

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllRead = () => {
    const updated = StorageService.markAllNotificationsRead();
    setNotifications(updated);
  };

  const handleMarkRead = (id: string) => {
    const updated = StorageService.markNotificationRead(id);
    setNotifications(updated);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="glass-panel relative flex items-center justify-center p-2.5 rounded-xl text-slate-700 dark:text-slate-200 hover:border-emerald-500/50 transition-colors"
        aria-label="Notifications"
      >
        <Bell className="h-4 w-4 text-emerald-500" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-white shadow-glow-sm">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="glass-panel absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl p-4 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150 border border-emerald-500/30">
          <div className="flex items-center justify-between pb-3 border-b border-emerald-500/20">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-emerald-500" />
              <span className="text-xs font-bold text-slate-800 dark:text-slate-100">{t('nav.notifications')}</span>
              {unreadCount > 0 && (
                <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                  {unreadCount} new
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={handleMarkAllRead}
                title="Mark all as read"
                className="p-1 text-slate-400 hover:text-emerald-400 rounded-lg hover:bg-white/10"
              >
                <CheckCheck className="h-4 w-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-white/10"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto pt-2 space-y-2">
            {notifications.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">No notifications</div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => handleMarkRead(n.id)}
                  className={`rounded-xl p-3 text-xs transition-colors cursor-pointer ${
                    n.read
                      ? 'bg-slate-500/5 text-slate-500 dark:text-slate-400'
                      : 'bg-emerald-500/10 border border-emerald-500/20 text-slate-800 dark:text-slate-100 font-medium'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    {n.type === 'success' ? (
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500 mt-0.5" />
                    ) : n.type === 'warning' ? (
                      <AlertTriangle className="h-4 w-4 shrink-0 text-amber-500 mt-0.5" />
                    ) : (
                      <Info className="h-4 w-4 shrink-0 text-blue-400 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <div className="font-bold">{n.title}</div>
                      <div className="text-[11px] mt-0.5 opacity-90">{n.message}</div>
                      <div className="text-[9px] mt-1 text-slate-400 opacity-70">{n.timestamp}</div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
