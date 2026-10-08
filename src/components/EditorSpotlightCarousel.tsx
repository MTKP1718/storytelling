import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Headphones,
  Eye,
  Award,
  Share2,
  Heart,
  Globe,
} from 'lucide-react';
import type { StoryWeaverBook } from '../data/storyWeaver150Books';
import { READING_LEVEL_INFO } from '../data/storyWeaver150Books';
import { BookCoverIllustration } from './BookCoverIllustration';
import { sound } from '../utils/audio';

interface EditorSpotlightCarouselProps {
  spotlightBooks: StoryWeaverBook[];
  onReadBook: (book: StoryWeaverBook) => void;
  onPreviewBook: (book: StoryWeaverBook) => void;
  onShareBook: (book: StoryWeaverBook) => void;
  isBookmarked: (bookId: string) => boolean;
  onToggleBookmark: (bookId: string) => void;
}

export const EditorSpotlightCarousel: React.FC<EditorSpotlightCarouselProps> = ({
  spotlightBooks,
  onReadBook,
  onPreviewBook,
  onShareBook,
  isBookmarked,
  onToggleBookmark,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-play timer
  useEffect(() => {
    if (!isAutoPlaying || spotlightBooks.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % spotlightBooks.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, spotlightBooks.length]);

  if (spotlightBooks.length === 0) return null;

  const currentBook = spotlightBooks[currentIndex] || spotlightBooks[0];
  const levelData = READING_LEVEL_INFO[currentBook.level];

  const handlePrev = () => {
    sound.playPageFlip();
    setCurrentIndex((prev) => (prev - 1 + spotlightBooks.length) % spotlightBooks.length);
  };

  const handleNext = () => {
    sound.playPageFlip();
    setCurrentIndex((prev) => (prev + 1) % spotlightBooks.length);
  };

  return (
    <div
      className="relative w-full mb-12"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Header bar */}
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-slate-950 font-black shadow-md">
            <Award className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-storybook text-lg sm:text-xl font-black text-white flex items-center gap-2">
              <span>Editor's Spotlight</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 uppercase tracking-widest font-sans font-bold">
                10-Year Gems
              </span>
            </h3>
            <p className="text-xs text-white/70">
              The most cherished open-source children's stories translated into 50+ mother tongues.
            </p>
          </div>
        </div>

        {/* Slide Controls & Indicators */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5 mr-2">
            {spotlightBooks.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  sound.playTilePlace();
                  setCurrentIndex(idx);
                }}
                className={`transition-all rounded-full cursor-pointer ${
                  idx === currentIndex
                    ? 'w-6 h-2 bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]'
                    : 'w-2 h-2 bg-white/30 hover:bg-white/60'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          <button
            onClick={handlePrev}
            className="w-10 h-10 rounded-xl bg-[#1B1F38]/90 hover:bg-[#282E52] border border-[#333C6B] text-white flex items-center justify-center transition-colors shadow-md cursor-pointer"
            aria-label="Previous spotlight story"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            className="w-10 h-10 rounded-xl bg-[#1B1F38]/90 hover:bg-[#282E52] border border-[#333C6B] text-white flex items-center justify-center transition-colors shadow-md cursor-pointer"
            aria-label="Next spotlight story"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Spotlight Card Container */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#1B1F38]/95 via-[#161A30]/95 to-[#0E1224]/95 border-2 border-amber-400/30 shadow-2xl p-6 sm:p-8 md:p-10 backdrop-blur-xl">
        {/* Ambient background glow matching book accent */}
        <div
          className="absolute -right-20 -top-20 w-80 h-80 rounded-full blur-3xl opacity-25 pointer-events-none"
          style={{ backgroundColor: currentBook.coverTheme.accent }}
        />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10">
          {/* Left Column: Big Illustrated Book Showcase (md:col-span-4) */}
          <div className="md:col-span-5 lg:col-span-4 flex justify-center">
            <div className="relative group cursor-pointer" onClick={() => onPreviewBook(currentBook)}>
              <div className="w-60 sm:w-64 transform group-hover:scale-105 group-hover:-rotate-1 transition-all duration-300">
                <BookCoverIllustration book={currentBook} size="md" />
              </div>

              {/* Quick Preview Badge overlay on cover */}
              <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-bold text-sm">
                <Eye className="w-5 h-5" />
                <span>Quick Preview</span>
              </div>
            </div>
          </div>

          {/* Right Column: Book Details & Reading Actions (md:col-span-7) */}
          <div className="md:col-span-7 lg:col-span-8 flex flex-col justify-between">
            <div>
              {/* Badges Bar: Level, Audio, CC-BY */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${levelData.badgeClass}`}
                >
                  {levelData.short} • {levelData.words}
                </span>

                {currentBook.hasAudio && (
                  <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-teal-500/20 text-teal-300 border border-teal-400/40">
                    <Headphones className="w-3.5 h-3.5" />
                    <span>Read-Along Audio</span>
                  </span>
                )}

                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white/10 text-white/80 border border-white/20">
                  {currentBook.license}
                </span>

                <span className="px-2.5 py-1 rounded-full text-xs font-bold text-amber-300 bg-amber-400/10 border border-amber-400/30">
                  🔥 {currentBook.readCount} Reads
                </span>
              </div>

              {/* Title & Subtitle */}
              <h2 className="font-storybook text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-2">
                {currentBook.title}
              </h2>

              <p className="text-sm sm:text-base font-semibold text-amber-200/90 mb-4">
                {currentBook.subtitle || currentBook.categories.join(' • ')}
              </p>

              {/* Editorial Quote */}
              {currentBook.spotlightQuote && (
                <div className="p-4 rounded-2xl bg-black/40 border border-amber-400/20 mb-4 text-xs sm:text-sm text-white/90 italic leading-relaxed">
                  {currentBook.spotlightQuote}
                </div>
              )}

              {/* Synopsis */}
              <p className="text-sm sm:text-base text-white/80 leading-relaxed mb-5 line-clamp-3 sm:line-clamp-4">
                {currentBook.synopsis}
              </p>

              {/* Credits & Multilingual info */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-[#0D1020]/80 border border-[#333C6B] text-xs mb-6">
                <div>
                  <span className="block text-white/50 font-bold uppercase tracking-wider text-[10px]">
                    Written By
                  </span>
                  <span className="font-extrabold text-white text-sm truncate block">
                    {currentBook.author}
                  </span>
                </div>
                <div>
                  <span className="block text-white/50 font-bold uppercase tracking-wider text-[10px]">
                    Illustrated By
                  </span>
                  <span className="font-extrabold text-white text-sm truncate block">
                    {currentBook.illustrator}
                  </span>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <span className="block text-white/50 font-bold uppercase tracking-wider text-[10px] flex items-center gap-1">
                    <Globe className="w-3 h-3" />
                    <span>Languages</span>
                  </span>
                  <span className="font-bold text-teal-300 text-xs">
                    {currentBook.languages.length} Available
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {/* Read Now Button */}
              <button
                type="button"
                onClick={() => {
                  sound.playStarChime();
                  onReadBook(currentBook);
                }}
                className="min-h-[48px] px-7 py-3 rounded-2xl gold-foil-button font-black text-sm sm:text-base flex items-center gap-2 shadow-xl hover:scale-102 transition-transform cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-slate-950" />
                <span>Read Storybook Now</span>
              </button>

              {/* Quick Preview Button */}
              <button
                type="button"
                onClick={() => {
                  sound.playTilePlace();
                  onPreviewBook(currentBook);
                }}
                className="min-h-[48px] px-5 py-3 rounded-2xl bg-[#23294C] hover:bg-[#333C6B] border border-[#333C6B] text-white font-bold text-sm flex items-center gap-2 transition-all cursor-pointer"
              >
                <Eye className="w-4 h-4" />
                <span>Quick Preview</span>
              </button>

              {/* Bookmark Button */}
              <button
                type="button"
                onClick={() => {
                  sound.playStarChime();
                  onToggleBookmark(currentBook.id);
                }}
                className={`min-h-[48px] min-w-[48px] px-3.5 py-3 rounded-2xl border transition-all flex items-center justify-center cursor-pointer ${
                  isBookmarked(currentBook.id)
                    ? 'bg-rose-500/20 border-rose-400 text-rose-300'
                    : 'bg-[#23294C] border-[#333C6B] text-white/70 hover:text-white'
                }`}
                title={isBookmarked(currentBook.id) ? 'Remove Bookmark' : 'Add to Reading List'}
              >
                <Heart
                  className={`w-4 h-4 ${
                    isBookmarked(currentBook.id) ? 'fill-rose-400 text-rose-400' : ''
                  }`}
                />
              </button>

              {/* Share Button */}
              <button
                type="button"
                onClick={() => {
                  sound.playTilePlace();
                  onShareBook(currentBook);
                }}
                className="min-h-[48px] min-w-[48px] px-3.5 py-3 rounded-2xl bg-[#23294C] hover:bg-[#333C6B] border border-[#333C6B] text-white/70 hover:text-white transition-all flex items-center justify-center cursor-pointer"
                title="Share this book"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
