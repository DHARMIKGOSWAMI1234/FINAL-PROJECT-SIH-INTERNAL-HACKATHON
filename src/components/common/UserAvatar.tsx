import React, { useState } from 'react';

interface UserAvatarProps {
  photoURL?: string | null;
  name?: string | null;
  email?: string | null;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function getUserInitials(name?: string | null, email?: string | null): string {
  if (name && name.trim()) {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2 && parts[0] && parts[1]) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].slice(0, 2).toUpperCase();
  }
  if (email && email.trim()) {
    const localPart = email.split('@')[0];
    return localPart.slice(0, 2).toUpperCase();
  }
  return 'U';
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  photoURL,
  name,
  email,
  size = 'md',
  className = '',
}) => {
  const [imageError, setImageError] = useState(false);

  const initials = getUserInitials(name, email);

  const sizeClasses = {
    xs: 'h-5 w-5 text-[9px]',
    sm: 'h-6 w-6 text-[10px]',
    md: 'h-8 w-8 text-xs',
    lg: 'h-10 w-10 text-sm font-bold',
    xl: 'h-16 w-16 text-2xl font-black',
  }[size];

  if (photoURL && !imageError) {
    return (
      <img
        src={photoURL}
        alt={name || email || 'User Avatar'}
        onError={() => setImageError(true)}
        className={`${sizeClasses} rounded-full object-cover border border-emerald-500/30 shrink-0 ${className}`}
      />
    );
  }

  return (
    <div
      className={`${sizeClasses} rounded-full bg-gradient-to-tr from-emerald-500 to-lime-500 text-white font-bold flex items-center justify-center shadow-sm shrink-0 uppercase tracking-tight ${className}`}
      aria-label={name || email || 'User Avatar'}
    >
      {initials}
    </div>
  );
};
