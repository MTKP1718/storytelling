import React from 'react';

export interface StoryCardProps {
  variant?: 'glass' | 'parchment' | 'accent';
  badge?: string;
  badgeIcon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

export const StoryCard: React.FC<StoryCardProps> = ({
  variant = 'glass',
  badge,
  badgeIcon,
  children,
  className = '',
  onClick,
  hoverable = false,
}) => {
  const variantStyles = {
    glass:
      'bg-gradient-to-br from-[#1C2140] via-[#151933] to-[#0D1022] text-white border-2 border-amber-400/40 shadow-2xl backdrop-blur-xl',
    parchment:
      'bg-[#FFFDF7] text-[#2C2416] border-2 border-amber-400/30 shadow-[0_12px_35px_rgba(44,36,22,0.12)]',
    accent:
      'bg-gradient-to-br from-[#242A4E] via-[#161A30] to-[#0E1224] text-white border-2 border-amber-400/50 shadow-2xl backdrop-blur-xl',
  };

  const badgeBadgeColors = {
    glass: 'bg-gradient-to-r from-amber-400/25 to-rose-400/20 border-amber-400/60 text-amber-300 shadow-lg',
    parchment: 'bg-amber-100/90 text-amber-900 border-amber-400/70 shadow-sm',
    accent: 'bg-gradient-to-r from-amber-400/30 via-rose-400/25 to-amber-500/20 border-amber-400/70 text-amber-300 shadow-lg',
  };

  return (
    <div
      onClick={onClick}
      className={`relative rounded-3xl p-6 sm:p-8 transition-all duration-300 overflow-visible ${
        variantStyles[variant]
      } ${
        hoverable ? 'hover:-translate-y-1.5 hover:shadow-2xl hover:border-amber-400/70 cursor-pointer' : ''
      } ${className}`}
    >
      {/* Optional Top Floating Pill Badge (150 Books Ribbon Style) */}
      {badge && (
        <div
          className={`absolute -top-3.5 left-6 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black tracking-wider uppercase border z-20 shadow-lg ${
            badgeBadgeColors[variant]
          }`}
        >
          {badgeIcon}
          <span>{badge}</span>
        </div>
      )}

      {children}
    </div>
  );
};
