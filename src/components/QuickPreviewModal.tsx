import React, { useState } from 'react';
import {
  X,
  BookOpen,
  Volume2,
  VolumeX,
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import type { StoryWeaverBook } from '../data/storyWeaver150Books';
import { READING_LEVEL_INFO } from '../data/storyWeaver150Books';
import { BookCoverIllustration } from './BookCoverIllustration';
import { sound } from '../utils/audio';
import { tts } from '../utils/tts';

interface QuickPreviewModalProps {
  book: StoryWeaverBook | null;
  isOpen: boolean;
  onClose: () => void;
  onReadBook: (book: StoryWeaverBook) => void;
  onShareBook: (book: StoryWeaverBook) => void;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
}

export const QuickPreviewModal: React.FC<QuickPreviewModalProps> = ({
  book,
  isOpen,
  onClose,
  onReadBook,
  onShareBook,
  isBookmarked,
  onToggleBookmark,
}) => {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  if (!isOpen || !book) return null;

  const levelData = READING_LEVEL_INFO[book.level];
  const samplePages = book.samplePages || [];
  const currentPage = samplePages[currentPageIndex] || samplePages[0];

  const handleToggleAudio = () => {
    if (isPlayingAudio) {
      tts.stop();
      setIsPlayingAudio(false);
    } else {
      sound.playStarChime();
      setIsPlayingAudio(true);
      const textToRead = `${book.title}. Page ${currentPage.pageNumber}. ${currentPage.text}`;
      tts.speak(textToRead, {
        rate: 0.9,
        onEnd: () => setIsPlayingAudio(false),
        onError: () => setIsPlayingAudio(false),
      });
    }
  };

  const handleNextPage = () => {
    if (currentPageIndex < samplePages.length - 1) {
      sound.playPageFlip();
      tts.stop();
      setIsPlayingAudio(false);
      setCurrentPageIndex((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPageIndex > 0) {
      sound.playPageFlip();
      tts.stop();
      setIsPlayingAudio(false);
      setCurrentPageIndex((prev) => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div
        className="relative w-full max-w-4xl bg-[#14182E] text-white rounded-3xl p-6 sm:p-8 border-2 border-amber-400/40 shadow-2xl my-8 animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => {
            sound.playTilePlace();
            tts.stop();
            onClose();
          }}
          className="absolute top-4 right-4 min-w-[48px] min-h-[48px] w-12 h-12 rounded-full bg-[#242A4A] hover:bg-[#333C6B] text-white flex items-center justify-center transition-colors cursor-pointer z-20 shadow-md"
          aria-label="Close Preview"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2 mb-6 pb-4 border-b border-[#333C6B]/60 pr-14">
          <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/40">
            Story Preview
          </span>
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${levelData.badgeClass}`}>
            {levelData.name}
          </span>
          <span className="text-xs text-white/60 hidden sm:inline">
            • Free & Open Source under {book.license}
          </span>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Left Column: Book Cover and Quick Info */}
          <div className="md:col-span-5 flex flex-col items-center">
            <div className="w-52 sm:w-60 shadow-2xl mb-4">
              <BookCoverIllustration book={book} size="md" />
            </div>

            <div className="w-full bg-[#0D1020] p-4 rounded-2xl border border-[#333C6B] text-xs space-y-2">
              <div className="flex justify-between text-white/80">
                <span className="text-white/50">Author:</span>
                <span className="font-bold text-amber-200">{book.author}</span>
              </div>
              <div className="flex justify-between text-white/80">
                <span className="text-white/50">Illustrator:</span>
                <span className="font-bold text-teal-300">{book.illustrator}</span>
              </div>
              <div className="flex justify-between text-white/80">
                <span className="text-white/50">Pages:</span>
                <span className="font-bold">{book.pageCount} Pages</span>
              </div>
              <div className="flex justify-between text-white/80">
                <span className="text-white/50">Original Language:</span>
                <span className="font-bold text-sky-300">{book.originalLanguage}</span>
              </div>
              <div className="pt-2 border-t border-white/10 flex flex-wrap gap-1">
                {book.languages.map((lang) => (
                  <span
                    key={lang}
                    className="px-2 py-0.5 rounded-md bg-white/5 text-[10px] text-white/70 font-mono"
                  >
                    {lang}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Sample Page Reader & Synopsis */}
          <div className="md:col-span-7 flex flex-col justify-between h-full">
            <div>
              <h2 className="font-storybook text-2xl sm:text-3xl font-extrabold text-white mb-2 leading-tight">
                {book.title}
              </h2>
              <p className="text-xs sm:text-sm font-semibold text-amber-200/90 mb-4">
                {book.subtitle}
              </p>

              {/* Sample Page Interactive Reader Card */}
              <div className="bg-[#FAF5E6] text-[#2C2416] p-6 rounded-2xl border-2 border-[#EADBBA] shadow-inner mb-6 relative">
                {/* Sample Page Top Bar */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#EADBBA] text-xs font-bold text-[#8C6D23]">
                  <div className="flex items-center gap-1.5 uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>Sample Excerpt • Page {currentPage.pageNumber} of {samplePages.length}</span>
                  </div>

                  <button
                    onClick={handleToggleAudio}
                    className={`min-h-[36px] px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      isPlayingAudio
                        ? 'bg-amber-500 text-slate-950 animate-pulse'
                        : 'bg-[#2C2416]/10 hover:bg-[#2C2416]/20 text-[#2C2416]'
                    }`}
                  >
                    {isPlayingAudio ? (
                      <>
                        <VolumeX className="w-3.5 h-3.5" />
                        <span>Pause Audio</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Listen to Sample</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Sample Page Text */}
                <p className="font-storybook text-base sm:text-lg leading-relaxed text-[#1B1F38] font-semibold mb-4 min-h-[72px]">
                  "{currentPage.text}"
                </p>

                {/* Scene illustration description */}
                <div className="p-3 rounded-xl bg-amber-100/60 border border-amber-200/80 text-xs italic text-[#4E4466]">
                  <span className="font-bold text-[#8C6D23] not-italic mr-1">Illustrated Scene:</span>
                  {currentPage.scenePrompt}
                </div>

                {/* Page Turner Controls */}
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#EADBBA]">
                  <button
                    onClick={handlePrevPage}
                    disabled={currentPageIndex === 0}
                    className="min-h-[40px] px-3 py-1.5 rounded-xl border border-[#D5C29E] bg-white hover:bg-amber-50 text-xs font-bold text-[#1B1F38] flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>Previous</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    {samplePages.map((_, idx) => (
                      <div
                        key={idx}
                        className={`w-2 h-2 rounded-full transition-all ${
                          idx === currentPageIndex ? 'w-5 bg-amber-600' : 'bg-amber-300'
                        }`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={handleNextPage}
                    disabled={currentPageIndex === samplePages.length - 1}
                    className="min-h-[40px] px-3 py-1.5 rounded-xl border border-[#D5C29E] bg-white hover:bg-amber-50 text-xs font-bold text-[#1B1F38] flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <span>Next Page</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Synopsis paragraph */}
              <div className="mb-6">
                <h4 className="text-xs font-bold text-white/50 uppercase tracking-wider mb-1.5">
                  Full Story Synopsis:
                </h4>
                <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
                  {book.synopsis}
                </p>
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-[#333C6B]/60">
              <button
                onClick={() => {
                  sound.playStarChime();
                  tts.stop();
                  onReadBook(book);
                }}
                className="flex-1 min-h-[48px] px-6 py-3.5 rounded-2xl gold-foil-button text-base font-black flex items-center justify-center gap-2 shadow-xl hover:scale-102 transition-transform cursor-pointer"
              >
                <BookOpen className="w-5 h-5 text-slate-950" />
                <span>Read Full Storybook</span>
              </button>

              <button
                onClick={() => {
                  sound.playStarChime();
                  onToggleBookmark();
                }}
                className={`min-h-[48px] px-4 py-3 rounded-2xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  isBookmarked
                    ? 'bg-rose-500/20 border-rose-400 text-rose-300'
                    : 'bg-[#23294C] border-[#333C6B] text-white/80 hover:text-white'
                }`}
              >
                <Heart className={`w-4 h-4 ${isBookmarked ? 'fill-rose-400 text-rose-400' : ''}`} />
                <span>{isBookmarked ? 'Bookmarked' : 'Save'}</span>
              </button>

              <button
                onClick={() => {
                  sound.playTilePlace();
                  onShareBook(book);
                }}
                className="min-h-[48px] px-4 py-3 rounded-2xl bg-[#23294C] hover:bg-[#333C6B] border border-[#333C6B] text-white/80 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
