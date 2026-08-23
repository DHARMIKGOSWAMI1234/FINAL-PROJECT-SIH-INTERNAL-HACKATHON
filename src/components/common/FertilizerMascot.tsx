import React from 'react';

export type MascotState = 'idle' | 'listening' | 'thinking' | 'typing' | 'avatar';

interface FertilizerMascotProps {
  state?: MascotState;
  size?: number | string;
  className?: string;
  showBadge?: boolean;
}

export const FertilizerMascot: React.FC<FertilizerMascotProps> = ({
  state = 'idle',
  size = 64,
  className = '',
  showBadge = false,
}) => {
  const numericSize = typeof size === 'number' ? size : parseInt(size, 10) || 64;

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{ width: numericSize, height: numericSize }}
    >
      {/* ── Listening Audio Soundwave Rings ── */}
      {state === 'listening' && (
        <>
          <div className="absolute inset-0 rounded-full border-2 border-emerald-400/60 animate-ping opacity-75 pointer-events-none scale-125" />
          <div className="absolute inset-0 rounded-full border-2 border-emerald-500/40 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite] pointer-events-none scale-150" />
        </>
      )}

      {/* ── Thinking / Loading Outer Glow ── */}
      {state === 'thinking' && (
        <div className="absolute inset-0 rounded-full bg-emerald-500/30 blur-md animate-pulse pointer-events-none scale-110" />
      )}

      {/* ── Main SVG Mascot Graphic ── */}
      <svg
        viewBox={state === 'avatar' ? '14 8 92 84' : '0 0 120 120'}
        width={numericSize}
        height={numericSize}
        className={`w-full h-full drop-shadow-md transition-transform duration-300 ${
          state === 'idle' ? 'animate-[mascot-bob_3s_ease-in-out_infinite]' : ''
        }`}
        aria-label="AGRISENSE Companion Mascot"
      >
        <defs>
          {/* Hat Gradient */}
          <linearGradient id="hatGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="50%" stopColor="#d97706" />
            <stop offset="100%" stopColor="#92400e" />
          </linearGradient>

          {/* Leaf / Sprout Gradient */}
          <linearGradient id="leafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4ade80" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>

          {/* Robot Head Chrome Gradient */}
          <linearGradient id="chromeHead" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="60%" stopColor="#f1f5f9" />
            <stop offset="100%" stopColor="#cbd5e1" />
          </linearGradient>

          {/* Visor Screen Gradient */}
          <linearGradient id="visorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#020617" />
          </linearGradient>

          {/* Green Eye LED Glow */}
          <radialGradient id="eyeLED" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#a7f3d0" />
            <stop offset="40%" stopColor="#34d399" />
            <stop offset="100%" stopColor="#059669" />
          </radialGradient>

          {/* Scarf / Cape Gradient */}
          <linearGradient id="scarfGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#047857" />
          </linearGradient>

          {/* Soft Drop Shadow Filter */}
          <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* ── Scarf / Cape Background Drapes ── */}
        <path
          d="M 38 78 Q 20 86 26 106 Q 60 115 94 106 Q 100 86 82 78 Z"
          fill="url(#scarfGrad)"
        />
        <path
          d="M 45 80 L 35 110 L 52 106 Z"
          fill="#047857"
          opacity="0.8"
        />

        {/* ── Body (Lower Torso) ── */}
        <rect x="42" y="74" width="36" height="26" rx="12" fill="url(#chromeHead)" stroke="#cbd5e1" strokeWidth="1.5" />
        {/* Chest Leaf Badge */}
        <circle cx="60" cy="87" r="7" fill="#065f46" />
        <circle cx="60" cy="87" r="5" fill="url(#leafGrad)" filter="url(#softGlow)" />
        <path d="M 58 89 Q 60 84 63 85" stroke="#ffffff" strokeWidth="1" fill="none" strokeLinecap="round" />

        {/* ── Hands / Arms ── */}
        {/* Left Arm holding little soil & sprout */}
        <rect x="26" y="80" width="14" height="8" rx="4" fill="#cbd5e1" transform="rotate(-15 26 80)" />
        <ellipse cx="24" cy="88" rx="6" ry="4" fill="#78350f" /> {/* Soil mound */}
        <path d="M 24 88 C 24 82, 21 80, 20 78 C 24 80, 26 82, 24 88" fill="#4ade80" /> {/* Left leaf */}
        <path d="M 24 88 C 24 82, 27 80, 28 78 C 26 80, 24 82, 24 88" fill="#22c55e" /> {/* Right leaf */}

        {/* Right Arm giving Thumbs-Up */}
        <rect x="80" y="80" width="14" height="8" rx="4" fill="#cbd5e1" transform="rotate(15 80 80)" />
        <circle cx="94" cy="84" r="5" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1" />
        <path d="M 94 82 L 94 77" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" /> {/* Thumbs up */}

        {/* ── Scarf Knot at Neck ── */}
        <ellipse cx="60" cy="76" rx="10" ry="5" fill="#047857" />
        <circle cx="60" cy="76" r="3.5" fill="#34d399" />

        {/* ── Neck Joint ── */}
        <rect x="52" y="66" width="16" height="8" rx="3" fill="#64748b" />

        {/* ── Robot Head Shell ── */}
        <rect x="28" y="26" width="64" height="44" rx="20" fill="url(#chromeHead)" stroke="#cbd5e1" strokeWidth="1.5" />

        {/* Head Side Ear Cups / Headphones */}
        {/* Left Ear */}
        <rect x="20" y="36" width="10" height="20" rx="5" fill="#059669" />
        <rect x="22" y="39" width="4" height="14" rx="2" fill="#34d399" />
        {/* Right Ear */}
        <rect x="90" y="36" width="10" height="20" rx="5" fill="#059669" />
        <rect x="94" y="39" width="4" height="14" rx="2" fill="#34d399" />

        {/* ── Dark Glossy Visor Screen ── */}
        <rect x="34" y="32" width="52" height="32" rx="14" fill="url(#visorGrad)" stroke="#1e293b" strokeWidth="1" />
        {/* Visor Specular Reflection */}
        <path d="M 38 36 Q 60 34 82 36 Q 78 40 42 40 Z" fill="#ffffff" opacity="0.15" />

        {/* ── LED Visor Face Expressions ── */}
        {state === 'thinking' ? (
          /* Thinking expression: Glance up + animated dots */
          <g>
            <ellipse cx="48" cy="44" rx="4" ry="4" fill="url(#eyeLED)" filter="url(#softGlow)" />
            <ellipse cx="72" cy="44" rx="4" ry="4" fill="url(#eyeLED)" filter="url(#softGlow)" />
            {/* Thinking Mouth */}
            <circle cx="60" cy="54" r="2.5" fill="#34d399" />
          </g>
        ) : state === 'listening' ? (
          /* Listening expression: Wide happy glowing eyes + sound arcs */
          <g>
            <ellipse cx="48" cy="46" rx="5" ry="6" fill="url(#eyeLED)" filter="url(#softGlow)" />
            <ellipse cx="72" cy="46" rx="5" ry="6" fill="url(#eyeLED)" filter="url(#softGlow)" />
            <ellipse cx="49" cy="45" rx="2" ry="2" fill="#ffffff" opacity="0.9" />
            <ellipse cx="73" cy="45" rx="2" ry="2" fill="#ffffff" opacity="0.9" />
            {/* Happy Smile */}
            <path d="M 52 54 Q 60 60 68 54" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          </g>
        ) : (
          /* Idle / Standard Happy Curved Eyes (^ ^) */
          <g>
            {/* Left Eye Arc */}
            <path d="M 43 47 Q 49 40 55 47" stroke="#34d399" strokeWidth="3.5" strokeLinecap="round" fill="none" filter="url(#softGlow)" />
            {/* Right Eye Arc */}
            <path d="M 65 47 Q 71 40 77 47" stroke="#34d399" strokeWidth="3.5" strokeLinecap="round" fill="none" filter="url(#softGlow)" />
            {/* Cute Smile Arc */}
            <path d="M 53 54 Q 60 58 67 54" stroke="#34d399" strokeWidth="2" strokeLinecap="round" fill="none" />
          </g>
        )}

        {/* ── Farmer Straw Hat ── */}
        {/* Hat Crown Base */}
        <path d="M 38 28 Q 60 12 82 28 Z" fill="url(#hatGrad)" />
        {/* Hat Crown Weave lines */}
        <path d="M 45 23 Q 60 16 75 23" stroke="#b45309" strokeWidth="1" fill="none" opacity="0.5" />
        {/* Hat Crown Top Notch */}
        <ellipse cx="60" cy="18" rx="12" ry="4" fill="#d97706" opacity="0.4" />

        {/* Hat Band (Dark Green) */}
        <path d="M 36 27 Q 60 22 84 27 L 85 30 Q 60 25 35 30 Z" fill="#047857" />

        {/* Straw Hat Brim (Curved Oval) */}
        <ellipse cx="60" cy="30" rx="38" ry="7" fill="url(#hatGrad)" stroke="#b45309" strokeWidth="1" />
        <ellipse cx="60" cy="31" rx="35" ry="5" fill="#f59e0b" opacity="0.3" />

        {/* ── Leaf / Sprout on Straw Hat ── */}
        <g transform="translate(36, 18) rotate(-20)">
          {/* Stem */}
          <path d="M 6 12 Q 8 6 10 0" stroke="#15803d" strokeWidth="2" fill="none" strokeLinecap="round" />
          {/* Left Leaf */}
          <path d="M 9 5 C 2 3, 0 -2, 7 0 C 10 2, 9 5, 9 5" fill="url(#leafGrad)" />
          {/* Right Leaf */}
          <path d="M 9 3 C 16 1, 18 -4, 11 -2 C 8 0, 9 3, 9 3" fill="#4ade80" />
        </g>
      </svg>

      {/* ── Optional Status Badge ── */}
      {showBadge && (
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 z-20">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white dark:border-[#090D16]" />
        </span>
      )}
    </div>
  );
};
