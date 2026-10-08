import React, { useState, useMemo } from 'react';
import {
  Search,
  X,
  Sparkles,
  BookOpen,
  Filter,
  ArrowUpDown,
  Headphones,
  Heart,
  Eye,
  Share2,
  Globe,
  LayoutGrid,
  List,
  Check,
  ChevronDown,
  BookMarked,
  Flame,
  Languages,
  RotateCcw,
} from 'lucide-react';
import type { StoryWeaverBook } from '../data/storyWeaver150Books';
import {
  CURATED_150_BOOKS,
  READING_LEVEL_INFO,
  STORYWEAVER_LANGUAGES,
  QUICK_CATEGORIES,
} from '../data/storyWeaver150Books';
import { BookCoverIllustration } from './BookCoverIllustration';
import { EditorSpotlightCarousel } from './EditorSpotlightCarousel';
import { QuickPreviewModal } from './QuickPreviewModal';
import { QuickShareModal } from './QuickShareModal';
import { sound } from '../utils/audio';
import { sanitizeSearchQuery } from '../utils/security';

interface StoryWeaver150CollectionProps {
  onSelectBookToRead: (book: StoryWeaverBook) => void;
  onNavigateHome: () => void;
  onOpenCreateQuest: () => void;
}

export const StoryWeaver150Collection: React.FC<StoryWeaver150CollectionProps> = ({
  onSelectBookToRead,
  onNavigateHome: _onNavigateHome,
  onOpenCreateQuest: _onOpenCreateQuest,
}) => {
  // Search & Filtering State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevels, setSelectedLevels] = useState<number[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'most_read' | 'staff_picks' | 'level' | 'title'>('staff_picks');
  const [viewMode, setViewMode] = useState<'grid' | 'compact'>('grid');

  // Modals & Bookmarks State
  const [previewBook, setPreviewBook] = useState<StoryWeaverBook | null>(null);
  const [shareBook, setShareBook] = useState<StoryWeaverBook | null>(null);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(['sw-ammachi-machines', 'sw-fat-king']);
  const [exploredBookIds, setExploredBookIds] = useState<string[]>([
    'sw-fat-king',
    'sw-ammachi-machines',
    'sw-gappu-dance',
  ]);

  // Language Dropdown open state
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);

  // Spotlight books (3 gems)
  const spotlightBooks = useMemo(() => {
    return CURATED_150_BOOKS.filter((b) => b.isEditorSpotlight);
  }, []);

  // Filtered and Sorted books
  const filteredBooks = useMemo(() => {
    return CURATED_150_BOOKS.filter((book) => {
      // Search query
      const cleanQuery = sanitizeSearchQuery(searchQuery, 60).toLowerCase();
      if (cleanQuery) {
        const matchesTitle = book.title.toLowerCase().includes(cleanQuery);
        const matchesAuthor = book.author.toLowerCase().includes(cleanQuery);
        const matchesIllustrator = book.illustrator.toLowerCase().includes(cleanQuery);
        const matchesSynopsis = book.synopsis.toLowerCase().includes(cleanQuery);
        const matchesCategory = book.categories.some((c) => c.toLowerCase().includes(cleanQuery));
        if (!matchesTitle && !matchesAuthor && !matchesIllustrator && !matchesSynopsis && !matchesCategory) {
          return false;
        }
      }

      // Reading Levels multi-select
      if (selectedLevels.length > 0 && !selectedLevels.includes(book.level)) {
        return false;
      }

      // Language filter
      if (selectedLanguage !== 'all') {
        const selectedLangObj = STORYWEAVER_LANGUAGES.find((l) => l.id === selectedLanguage);
        if (selectedLangObj && !book.languages.includes(selectedLangObj.name)) {
          return false;
        }
      }

      // Category filter
      if (selectedCategory !== 'all') {
        if (!book.categories.includes(selectedCategory)) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'most_read') {
        return parseFloat(b.readCount) - parseFloat(a.readCount);
      }
      if (sortBy === 'level') {
        return a.level - b.level;
      }
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      // Staff Picks (default)
      return (b.isEditorSpotlight ? 1 : 0) - (a.isEditorSpotlight ? 1 : 0);
    });
  }, [searchQuery, selectedLevels, selectedLanguage, selectedCategory, sortBy]);

  // Active filters count
  const activeFiltersCount =
    (selectedLevels.length > 0 ? 1 : 0) +
    (selectedLanguage !== 'all' ? 1 : 0) +
    (selectedCategory !== 'all' ? 1 : 0) +
    (searchQuery.trim() ? 1 : 0);

  const handleClearAllFilters = () => {
    sound.playTilePlace();
    setSearchQuery('');
    setSelectedLevels([]);
    setSelectedLanguage('all');
    setSelectedCategory('all');
    setSortBy('staff_picks');
  };

  const handleToggleLevel = (lvl: number) => {
    sound.playTilePlace();
    setSelectedLevels((prev) =>
      prev.includes(lvl) ? prev.filter((l) => l !== lvl) : [...prev, lvl]
    );
  };

  const handleToggleBookmark = (id: string) => {
    setBookmarkedIds((prev) =>
      prev.includes(id) ? prev.filter((bId) => bId !== id) : [...prev, id]
    );
  };

  const handleRead = (book: StoryWeaverBook) => {
    sound.playStarChime();
    if (!exploredBookIds.includes(book.id)) {
      setExploredBookIds((prev) => [...prev, book.id]);
    }
    onSelectBookToRead(book);
  };

  return (
    <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 z-10 selection:bg-amber-400 selection:text-slate-950">
      {/* Modals */}
      <QuickPreviewModal
        book={previewBook}
        isOpen={Boolean(previewBook)}
        onClose={() => setPreviewBook(null)}
        onReadBook={handleRead}
        onShareBook={(b) => {
          setPreviewBook(null);
          setShareBook(b);
        }}
        isBookmarked={previewBook ? bookmarkedIds.includes(previewBook.id) : false}
        onToggleBookmark={() => previewBook && handleToggleBookmark(previewBook.id)}
      />

      <QuickShareModal
        book={shareBook}
        isOpen={Boolean(shareBook)}
        onClose={() => setShareBook(null)}
      />

      {/* 1. Hero Section: Playful, Vibrant, & Warm Editorial Aesthetic */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#1C2140] via-[#151933] to-[#0D1022] border-2 border-amber-400/40 p-6 sm:p-10 md:p-12 mb-10 shadow-2xl text-center md:text-left">
        {/* Decorative background glow & elements */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-gradient-to-br from-amber-400/20 via-rose-500/15 to-transparent blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-gradient-to-tr from-teal-400/15 via-indigo-500/15 to-transparent blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl">
            {/* Celebratory Anniversary Ribbon */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-400/25 to-rose-400/20 border border-amber-400/60 text-amber-300 text-xs sm:text-sm font-black uppercase tracking-wider mb-4 shadow-lg">
              <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
              <span>Celebrating 10 Years of StoryWeaver</span>
              <span className="hidden sm:inline">• 150 Books Campaign</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-storybook text-3xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight mb-4 drop-shadow-md">
              150 Books to Read{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-rose-300 to-teal-300">
                & Cherish
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base md:text-lg text-white/85 leading-relaxed font-medium mb-6">
              A curated milestone collection of open-source illustrated children's stories by{' '}
              <strong className="text-amber-300">Pratham Books</strong>. Empowering parents, teachers, and children
              to discover the sheer joy of reading in their mother tongues.
            </p>

            {/* Live Search Input Bar */}
            <div className="relative max-w-xl mb-6">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-amber-300">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title, author, topic (e.g. 'coconut', 'monsoon', 'dance')..."
                maxLength={60}
                className="w-full min-h-[52px] pl-12 pr-12 rounded-2xl bg-[#0D1020]/90 border-2 border-amber-400/40 focus:border-amber-400 text-white font-medium text-sm sm:text-base placeholder:text-white/40 shadow-xl outline-none transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/60 hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Quick-Jump Category Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-white/60 mr-1 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>Jump to:</span>
              </span>
              {QUICK_CATEGORIES.slice(1, 7).map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    sound.playTilePlace();
                    setSelectedCategory(selectedCategory === cat.id ? 'all' : cat.id);
                  }}
                  className={`min-h-[36px] px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-amber-400 text-slate-950 font-black shadow-md scale-105'
                      : 'bg-white/10 hover:bg-white/20 text-white/90 border border-white/10'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Right Hero Feature: Interactive Reading Progress & Goal Tracker */}
          <div className="w-full md:w-80 bg-gradient-to-b from-[#242A4E] to-[#14182E] p-6 rounded-3xl border-2 border-amber-400/40 shadow-2xl relative">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-black uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                <BookMarked className="w-4 h-4 text-amber-400" />
                <span>Reading Goal</span>
              </span>
              <span className="text-xs font-extrabold text-teal-300 bg-teal-400/10 px-2 py-0.5 rounded-full border border-teal-400/30">
                10-Year Quest
              </span>
            </div>

            <div className="mb-3">
              <div className="flex items-baseline justify-between mb-1">
                <span className="font-storybook text-3xl font-extrabold text-white">
                  {exploredBookIds.length}
                </span>
                <span className="text-xs text-white/70 font-semibold">of 150 Books Explored</span>
              </div>

              {/* Animated Progress Bar */}
              <div className="w-full h-3 rounded-full bg-black/40 overflow-hidden p-0.5 border border-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-teal-400 via-amber-400 to-rose-400 transition-all duration-700 shadow-md"
                  style={{
                    width: `${Math.min(100, Math.max(5, (exploredBookIds.length / 150) * 100))}%`,
                  }}
                />
              </div>
            </div>

            <p className="text-xs text-white/80 leading-relaxed mb-4">
              {exploredBookIds.length >= 10
                ? '🏆 Super Reader! You’ve unlocked boundless wonders across multiple mother tongues!'
                : '🌱 Read open-source stories aloud with your children to build their bilingual confidence.'}
            </p>

            <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs">
              <div className="flex items-center gap-1 text-rose-300 font-bold">
                <Heart className="w-3.5 h-3.5 fill-current" />
                <span>{bookmarkedIds.length} Saved</span>
              </div>
              <span className="text-amber-300 font-bold">Free Forever • CC-BY 4.0</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Editor's Spotlight Carousel Section */}
      <EditorSpotlightCarousel
        spotlightBooks={spotlightBooks}
        onReadBook={handleRead}
        onPreviewBook={(b) => setPreviewBook(b)}
        onShareBook={(b) => setShareBook(b)}
        isBookmarked={(id) => bookmarkedIds.includes(id)}
        onToggleBookmark={handleToggleBookmark}
      />

      {/* 3. Sticky Filter & Sort Toolbar */}
      <div className="sticky top-16 z-30 mb-8 py-3 bg-[#111428]/95 backdrop-blur-xl border-y border-[#333C6B]/80 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Left: Reading Level Pills Multi-Select */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-white/50 uppercase tracking-wider flex items-center gap-1 mr-1">
              <Filter className="w-3.5 h-3.5" />
              <span>Level:</span>
            </span>

            {([1, 2, 3, 4] as const).map((lvl) => {
              const info = READING_LEVEL_INFO[lvl];
              const isSelected = selectedLevels.includes(lvl);
              return (
                <button
                  key={lvl}
                  onClick={() => handleToggleLevel(lvl)}
                  className={`min-h-[42px] px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer border ${
                    isSelected
                      ? `${info.badgeClass} ring-2 ring-amber-400/50 shadow-md scale-102 font-black`
                      : 'bg-[#1A1F3C] text-white/70 border-[#333C6B] hover:text-white hover:border-white/30'
                  }`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: info.dotColor }}
                  />
                  <span>{info.short}</span>
                  {isSelected && <Check className="w-3.5 h-3.5" />}
                </button>
              );
            })}
          </div>

          {/* Right: Language Dropdown, Sort, View Toggle & Clear All */}
          <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
            {/* Language Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                className="min-h-[42px] px-3.5 py-1.5 rounded-xl bg-[#1A1F3C] border border-[#333C6B] text-white text-xs font-bold flex items-center gap-2 hover:border-amber-400/50 transition-colors cursor-pointer"
              >
                <Languages className="w-4 h-4 text-amber-300" />
                <span>
                  {selectedLanguage === 'all'
                    ? 'All Languages'
                    : STORYWEAVER_LANGUAGES.find((l) => l.id === selectedLanguage)?.name || 'Language'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-white/60" />
              </button>

              {isLangDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#151933] border-2 border-amber-400/40 shadow-2xl p-2 z-50 animate-scale-up">
                  <div className="text-[10px] font-black uppercase tracking-wider text-white/50 px-2.5 py-1">
                    Select Language
                  </div>
                  {STORYWEAVER_LANGUAGES.map((lang) => (
                    <button
                      key={lang.id}
                      onClick={() => {
                        sound.playTilePlace();
                        setSelectedLanguage(lang.id);
                        setIsLangDropdownOpen(false);
                      }}
                      className={`w-full min-h-[36px] px-3 py-1.5 rounded-xl text-left text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                        selectedLanguage === lang.id
                          ? 'bg-amber-400 text-slate-950 font-bold'
                          : 'text-white/80 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <span>{lang.name}</span>
                      <span className="text-[11px] opacity-70">{lang.native}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 bg-[#1A1F3C] px-3 py-1 rounded-xl border border-[#333C6B]">
              <ArrowUpDown className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              <select
                value={sortBy}
                onChange={(e) => {
                  sound.playTilePlace();
                  setSortBy(e.target.value as any);
                }}
                className="bg-transparent text-xs text-white font-bold outline-none cursor-pointer pr-2"
              >
                <option value="staff_picks" className="bg-[#151933] text-white">Staff Picks</option>
                <option value="most_read" className="bg-[#151933] text-white">Most Read</option>
                <option value="level" className="bg-[#151933] text-white">Reading Level</option>
                <option value="title" className="bg-[#151933] text-white">Title (A-Z)</option>
              </select>
            </div>

            {/* Grid / List View Toggle */}
            <div className="hidden sm:flex items-center bg-[#1A1F3C] p-1 rounded-xl border border-[#333C6B]">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                  viewMode === 'grid' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-white/60 hover:text-white'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('compact')}
                className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                  viewMode === 'compact' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-white/60 hover:text-white'
                }`}
                title="Compact List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Clear All Filters button */}
            {activeFiltersCount > 0 && (
              <button
                onClick={handleClearAllFilters}
                className="min-h-[42px] px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-400/40 text-rose-300 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset ({activeFiltersCount})</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Result Count and Active Filters Bar */}
      <div className="flex items-center justify-between mb-6 text-xs text-white/70">
        <div>
          Showing <strong className="text-white font-bold">{filteredBooks.length}</strong> of{' '}
          <strong className="text-amber-300 font-bold">150 Curated Books</strong>
          {selectedCategory !== 'all' && (
            <span> in <span className="text-teal-300 font-bold">{selectedCategory}</span></span>
          )}
        </div>

        {searchQuery && (
          <div className="text-amber-200">
            Filtering by: <span className="italic font-bold">"{searchQuery}"</span>
          </div>
        )}
      </div>

      {/* 4. The 150 Curated Collection Grid */}
      {filteredBooks.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-[#151933]/60 border-2 border-dashed border-[#333C6B] my-8">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="font-storybook text-2xl font-bold text-white mb-2">No Stories Matched</h3>
          <p className="text-sm text-white/70 max-w-md mx-auto mb-6">
            We couldn't find any books matching your selected filters. Try clearing some criteria to explore more open-source tales!
          </p>
          <button
            onClick={handleClearAllFilters}
            className="px-6 py-3 rounded-2xl gold-foil-button text-sm font-bold shadow-md cursor-pointer"
          >
            Clear All Filters & Reset
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-16">
          {filteredBooks.map((book) => {
            const levelInfo = READING_LEVEL_INFO[book.level];
            const isSaved = bookmarkedIds.includes(book.id);

            return (
              <div
                key={book.id}
                className="group relative rounded-3xl bg-[#151933]/90 hover:bg-[#1B2040] border border-[#333C6B]/70 hover:border-amber-400/50 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-between overflow-hidden p-4"
              >
                {/* Floating Bookmark Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    sound.playStarChime();
                    handleToggleBookmark(book.id);
                  }}
                  className={`absolute top-6 right-6 z-20 w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-md ${
                    isSaved
                      ? 'bg-rose-500 text-white shadow-rose-500/50 scale-105'
                      : 'bg-black/40 backdrop-blur-md text-white/70 hover:text-white hover:bg-black/70'
                  }`}
                  title={isSaved ? 'Bookmarked' : 'Add to Reading List'}
                >
                  <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                </button>

                {/* Cover Image with Smooth Hover Zoom */}
                <div
                  className="cursor-pointer mb-3 relative overflow-hidden rounded-2xl"
                  onClick={() => setPreviewBook(book)}
                >
                  <div className="transform group-hover:scale-104 transition-transform duration-300">
                    <BookCoverIllustration book={book} size="md" />
                  </div>

                  {/* Hover Overlay with Preview button */}
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-bold text-xs pointer-events-none">
                    <Eye className="w-4 h-4 text-amber-300" />
                    <span>Quick Preview</span>
                  </div>
                </div>

                {/* Book Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    {/* Level Badge & Micro-indicators Bar */}
                    <div className="flex items-center justify-between gap-1 mb-2">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${levelInfo.badgeClass}`}
                      >
                        {levelInfo.short}
                      </span>

                      <div className="flex items-center gap-1.5 text-[10px] text-white/60">
                        {book.hasAudio && (
                          <span title="Read-along audio" className="text-teal-300 flex items-center gap-0.5">
                            <Headphones className="w-3 h-3" />
                            <span className="hidden sm:inline">Audio</span>
                          </span>
                        )}
                        <span className="text-amber-300/90 font-bold">{book.readCount}</span>
                      </div>
                    </div>

                    {/* Book Title */}
                    <h3
                      onClick={() => setPreviewBook(book)}
                      className="font-storybook text-base sm:text-lg font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-1 mb-1 cursor-pointer"
                    >
                      {book.title}
                    </h3>

                    {/* Author & Illustrator */}
                    <p className="text-xs text-white/70 font-medium truncate mb-2">
                      By <span className="text-amber-200 font-semibold">{book.author}</span>
                    </p>

                    {/* Synopsis snippet */}
                    <p className="text-xs text-white/60 line-clamp-2 leading-relaxed mb-4">
                      {book.synopsis}
                    </p>
                  </div>

                  {/* Card Bottom CTA Bar */}
                  <div className="pt-3 border-t border-[#333C6B]/50 flex items-center justify-between gap-2">
                    <button
                      onClick={() => handleRead(book)}
                      className="flex-1 min-h-[40px] px-3 py-2 rounded-xl gold-foil-button text-xs font-black flex items-center justify-center gap-1.5 shadow-sm hover:scale-102 transition-transform cursor-pointer"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-slate-950" />
                      <span>Read Now</span>
                    </button>

                    <button
                      onClick={() => setShareBook(book)}
                      className="min-h-[40px] min-w-[40px] p-2 rounded-xl bg-[#23294C] hover:bg-[#333C6B] text-white/70 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                      title="Share story"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Compact List View */
        <div className="space-y-3 mb-16">
          {filteredBooks.map((book) => {
            const levelInfo = READING_LEVEL_INFO[book.level];
            const isSaved = bookmarkedIds.includes(book.id);

            return (
              <div
                key={book.id}
                className="p-4 rounded-2xl bg-[#151933]/90 hover:bg-[#1B2040] border border-[#333C6B] flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-16 h-20 shrink-0 cursor-pointer rounded-lg overflow-hidden"
                    onClick={() => setPreviewBook(book)}
                  >
                    <BookCoverIllustration book={book} size="sm" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${levelInfo.badgeClass}`}>
                        {levelInfo.short}
                      </span>
                      <span className="text-xs text-teal-300 font-semibold">
                        {book.languages.length} Languages
                      </span>
                      {book.hasAudio && (
                        <span className="text-xs text-amber-300 flex items-center gap-0.5">
                          <Headphones className="w-3 h-3" />
                          Audio
                        </span>
                      )}
                    </div>
                    <h3
                      onClick={() => setPreviewBook(book)}
                      className="font-storybook font-bold text-white text-base hover:text-amber-300 cursor-pointer"
                    >
                      {book.title}
                    </h3>
                    <p className="text-xs text-white/70">
                      By <span className="font-semibold text-amber-200">{book.author}</span> • Illus:{' '}
                      {book.illustrator}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => handleToggleBookmark(book.id)}
                    className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                      isSaved ? 'bg-rose-500/20 text-rose-300 border-rose-400' : 'bg-[#23294C] text-white/70 border-[#333C6B]'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                  </button>
                  <button
                    onClick={() => setPreviewBook(book)}
                    className="px-3.5 py-2 rounded-xl bg-[#23294C] hover:bg-[#333C6B] text-xs font-bold text-white transition-colors cursor-pointer"
                  >
                    Preview
                  </button>
                  <button
                    onClick={() => handleRead(book)}
                    className="px-4 py-2 rounded-xl gold-foil-button text-xs font-black shadow-sm cursor-pointer"
                  >
                    Read
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 5. StoryWeaver Open-License Impact Banner & Mission Statement */}
      <section className="rounded-3xl bg-gradient-to-br from-[#103E39] via-[#0E2E2A] to-[#0A1D1A] border-2 border-[#2EC4B6]/50 p-8 sm:p-12 mb-16 shadow-2xl relative overflow-hidden text-center sm:text-left">
        <div className="absolute right-0 top-0 w-80 h-80 rounded-full bg-[#2EC4B6]/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#2EC4B6]/20 border border-[#2EC4B6]/40 text-[#2EC4B6] text-xs font-black uppercase tracking-wider mb-3">
              <Globe className="w-3.5 h-3.5" />
              <span>Open Educational Resource (OER)</span>
            </div>
            <h2 className="font-storybook text-2xl sm:text-4xl font-extrabold text-white leading-tight mb-3">
              “Every child deserves stories in their mother tongue.”
            </h2>
            <p className="text-sm sm:text-base text-white/85 leading-relaxed font-medium mb-6">
              StoryWeaver by <strong>Pratham Books</strong> is a digital repository of multilingual children's books
              dedicated to creating storybooks for children everywhere. All 150 curated books are published under
              permissive Creative Commons (CC-BY 4.0) licenses, free to read, translate, print, and cherish forever.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-3.5 rounded-2xl bg-black/30 border border-white/10">
                <span className="block font-storybook text-2xl font-black text-[#FFD166]">10M+</span>
                <span className="text-[11px] text-white/70 font-semibold uppercase tracking-wider">Children Reached</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-black/30 border border-white/10">
                <span className="block font-storybook text-2xl font-black text-[#2EC4B6]">350+</span>
                <span className="text-[11px] text-white/70 font-semibold uppercase tracking-wider">Mother Tongues</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-black/30 border border-white/10">
                <span className="block font-storybook text-2xl font-black text-rose-300">60,000+</span>
                <span className="text-[11px] text-white/70 font-semibold uppercase tracking-wider">Stories Created</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-black/30 border border-white/10">
                <span className="block font-storybook text-2xl font-black text-sky-300">100% Free</span>
                <span className="text-[11px] text-white/70 font-semibold uppercase tracking-wider">CC-BY 4.0 Open</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 rounded-3xl bg-black/40 border border-[#2EC4B6]/30 text-center">
            <div className="text-4xl mb-3">🎉📚</div>
            <h4 className="font-storybook text-xl font-bold text-white mb-1">
              Celebrating 10 Years
            </h4>
            <p className="text-xs text-white/70 mb-4">
              Join millions of teachers, authors, and translators weaving stories for a brighter world.
            </p>
            <a
              href="https://storyweaver.org.in"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-[#2EC4B6] hover:bg-[#28ad9f] text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-lg transition-transform hover:scale-102 cursor-pointer"
            >
              <span>Explore StoryWeaver.org.in &rarr;</span>
            </a>
          </div>
        </div>
      </section>

      {/* 6. Clean, Compact Multilingual Footer */}
      <footer className="pt-8 pb-12 border-t border-[#333C6B]/60 text-xs text-white/60">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-amber-400 to-rose-400 flex items-center justify-center text-slate-950 font-black text-xs">
                ✨
              </div>
              <span className="font-serif text-sm font-bold text-white">StoryWeaver 150 Collection</span>
            </div>
            <p className="text-[11px] leading-relaxed text-white/60">
              Honoring 10 extraordinary years of open-source children's literature, multilingual literacy, and community translations.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Reading Levels</h5>
            <ul className="space-y-1.5 text-[11px]">
              <li><button onClick={() => setSelectedLevels([1])} className="hover:text-amber-300 cursor-pointer">Level 1: First Words (Ages 3–5)</button></li>
              <li><button onClick={() => setSelectedLevels([2])} className="hover:text-amber-300 cursor-pointer">Level 2: Early Reader (Ages 6–8)</button></li>
              <li><button onClick={() => setSelectedLevels([3])} className="hover:text-amber-300 cursor-pointer">Level 3: Reading Alone (Ages 9–10)</button></li>
              <li><button onClick={() => setSelectedLevels([4])} className="hover:text-amber-300 cursor-pointer">Level 4: Advanced (Ages 11–12)</button></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Educators & Parents</h5>
            <ul className="space-y-1.5 text-[11px]">
              <li><span className="hover:text-white cursor-pointer">Classroom Read-Aloud Guides</span></li>
              <li><span className="hover:text-white cursor-pointer">Bilingual Mother Tongue Toolkits</span></li>
              <li><span className="hover:text-white cursor-pointer">Creative Commons CC-BY 4.0 Terms</span></li>
              <li><span className="hover:text-white cursor-pointer">Printable Reading Certificates</span></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Multilingual Story Mission</h5>
            <p className="text-[11px] leading-relaxed mb-3">
              Stories available in Hindi, Marathi, Tamil, Kannada, Telugu, Bengali, French, Spanish, and 340+ languages.
            </p>
            <div className="text-[10px] text-teal-300 font-bold">
              Powered by Pratham Books & Story Teacher
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px]">
          <div>
            © 2015–2026 Pratham Books & StoryWeaver. Content licensed under CC-BY 4.0.
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-white cursor-pointer">Privacy</span>
            <span>•</span>
            <span className="hover:text-white cursor-pointer">Accessibility</span>
            <span>•</span>
            <span className="hover:text-white cursor-pointer">Open Licensing</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
