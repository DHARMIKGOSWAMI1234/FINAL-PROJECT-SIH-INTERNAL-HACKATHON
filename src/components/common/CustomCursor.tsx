import React, { useEffect, useState, useCallback } from 'react';
import { Sprout } from 'lucide-react';

export const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: -200, y: -200 });
  const [hoverType, setHoverType] = useState<'default' | 'agri' | 'ai' | 'warning' | 'view'>('default');
  const [isClicking, setIsClicking] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Detect touch / coarse pointer devices — skip custom cursor entirely
    if (
      window.matchMedia('(pointer: coarse)').matches ||
      'ontouchstart' in window
    ) {
      setIsTouchDevice(true);
      return;
    }

    // Apply cursor:none at the document root so every element — including
    // portals, modals, tooltips, dropdowns rendered outside #root — inherits it.
    const root = document.documentElement;
    root.style.setProperty('cursor', 'none', 'important');

    return () => {
      // Restore default cursor when component unmounts
      root.style.removeProperty('cursor');
    };
  }, []);

  const getHoverType = useCallback((target: HTMLElement | null) => {
    if (!target) return 'default';
    if (target.closest('[data-cursor="ai"], .ai-trigger')) return 'ai';
    if (target.closest('[data-cursor="warning"]')) return 'warning';
    if (target.closest('[data-cursor="view"], img')) return 'view';
    if (
      target.closest(
        'button, a, input, select, textarea, [data-interactive], .glass-card, [role="button"], [role="link"], [role="menuitem"], [role="tab"], [tabindex]'
      )
    )
      return 'agri';
    return 'default';
  }, []);

  useEffect(() => {
    if (isTouchDevice) return;

    const onMouseMove = (e: MouseEvent) => {
      setIsVisible(true);
      setPosition({ x: e.clientX, y: e.clientY });
      setHoverType(getHoverType(e.target as HTMLElement | null));
    };

    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);
    const onMouseDown = () => setIsClicking(true);
    const onMouseUp = () => setIsClicking(false);

    // Use document (not window) for leave/enter so portals outside #root work
    document.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mouseup', onMouseUp);

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, [isTouchDevice, getHoverType]);

  if (isTouchDevice || !isVisible) return null;

  const isHovered = hoverType !== 'default';
  const cursorSize = hoverType === 'view' ? 56 : isHovered ? 48 : 34;
  const halfSize = cursorSize / 2;

  const ringColors: Record<typeof hoverType, string> = {
    default: 'border-emerald-500/60 bg-emerald-500/10 shadow-sm',
    agri: 'border-emerald-500 bg-emerald-500/20 shadow-[0_0_12px_rgba(16,185,129,0.6)]',
    ai: 'border-cyan-400 bg-cyan-400/20 shadow-[0_0_12px_rgba(34,211,238,0.6)]',
    warning: 'border-amber-400 bg-amber-400/20 shadow-[0_0_12px_rgba(251,191,36,0.6)]',
    view: 'border-white bg-black/60 text-white text-[10px] font-extrabold uppercase tracking-widest',
  };

  const iconColors: Record<typeof hoverType, string> = {
    default: 'text-emerald-500',
    agri: 'text-emerald-500',
    ai: 'text-cyan-400',
    warning: 'text-amber-400',
    view: 'text-white',
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        transform: `translate3d(${position.x - halfSize}px, ${position.y - halfSize}px, 0)`,
        width: cursorSize,
        height: cursorSize,
        pointerEvents: 'none',
        zIndex: 99999,
        transition: 'width 0.15s ease, height 0.15s ease',
        willChange: 'transform',
      }}
      className={`flex items-center justify-center rounded-full border ${ringColors[hoverType]} ${
        isClicking ? 'scale-75' : 'scale-100'
      } transition-transform duration-75`}
    >
      {hoverType === 'view' ? (
        <span>VIEW</span>
      ) : (
        <Sprout
          className={`${isHovered ? 'h-5 w-5' : 'h-4 w-4'} ${iconColors[hoverType]} transition-all duration-150`}
        />
      )}
    </div>
  );
};
