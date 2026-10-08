import React from 'react';
import type { StoryWeaverBook } from '../data/storyWeaver150Books';

interface BookCoverIllustrationProps {
  book: StoryWeaverBook;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const BookCoverIllustration: React.FC<BookCoverIllustrationProps> = ({
  book,
  size = 'md',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-24 h-32 text-xs',
    md: 'w-full aspect-[3/4]',
    lg: 'w-64 h-[340px]',
    xl: 'w-80 h-[420px]',
  }[size];

  return (
    <div
      className={`relative rounded-2xl overflow-hidden shadow-xl border border-white/20 select-none group-hover:shadow-2xl transition-all duration-300 ${sizeClasses} ${className}`}
      style={{
        background: `linear-gradient(145deg, ${
          book.coverTheme.accent === '#FFD166'
            ? '#D97706, #B45309, #78350F'
            : book.coverTheme.accent === '#2EC4B6'
            ? '#0F766E, #115E59, #134E4A'
            : book.coverTheme.accent === '#FF7B66'
            ? '#E11D48, #BE123C, #881337'
            : book.coverTheme.accent === '#7E69FF'
            ? '#4338CA, #3730A3, #312E81'
            : book.coverTheme.accent === '#A855F7'
            ? '#7E22CE, #6B21A8, #581C87'
            : '#1E293B, #0F172A, #020617'
        })`,
      }}
    >
      {/* Texture pattern overlay */}
      <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

      {/* Book spine simulation on the left */}
      <div className="absolute top-0 bottom-0 left-0 w-3 bg-gradient-to-r from-black/40 via-white/15 to-transparent z-10" />

      {/* Decorative Book Header ribbon */}
      <div className="relative z-10 p-4 sm:p-5 flex flex-col justify-between h-full text-white">
        {/* Top: StoryWeaver / Pratham Books watermark & level */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20 text-[10px] font-bold tracking-wider uppercase text-amber-200">
            <span>Level {book.level}</span>
          </div>

          <div className="w-8 h-8 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center text-sm shadow-inner border border-white/20">
            {book.hasAudio ? '🎧' : '📖'}
          </div>
        </div>

        {/* Center: Thematic Illustration Symbol & Art Canvas */}
        <div className="my-auto flex flex-col items-center justify-center py-2 relative">
          {/* Subtle glow orb */}
          <div
            className="w-24 h-24 sm:w-32 sm:h-32 rounded-full blur-2xl opacity-40 absolute"
            style={{ backgroundColor: book.coverTheme.accent }}
          />

          {/* Main Visual Emoji & Motifs */}
          <div className="relative text-5xl sm:text-6xl drop-shadow-[0_8px_16px_rgba(0,0,0,0.5)] transform group-hover:scale-110 transition-transform duration-300">
            {book.coverTheme.iconEmoji}
          </div>

          {/* Whimsical subtitle banner */}
          <div className="mt-3 px-3 py-1 rounded-full bg-black/30 backdrop-blur-sm border border-white/10 text-[11px] font-medium text-white/90 text-center max-w-[90%] truncate">
            {book.categories[0] || 'StoryWeaver Classic'}
          </div>
        </div>

        {/* Bottom: Book Title & Credits */}
        <div className="pt-3 border-t border-white/20 bg-gradient-to-t from-black/60 to-transparent -mx-4 -mb-4 p-4 rounded-b-2xl">
          <h4 className="font-storybook text-base sm:text-lg font-black leading-tight text-white drop-shadow-md line-clamp-2 mb-1">
            {book.title}
          </h4>
          <p className="text-[11px] text-white/80 font-medium truncate">
            By <span className="font-bold text-amber-200">{book.author}</span>
          </p>
          <div className="flex items-center justify-between mt-1 text-[10px] text-white/70">
            <span>Illus: {book.illustrator}</span>
            <span className="font-bold text-amber-300">{book.readCount} reads</span>
          </div>
        </div>
      </div>
    </div>
  );
};
