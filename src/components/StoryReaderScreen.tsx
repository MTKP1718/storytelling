import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  HelpCircle,
  Wand2,
  BookOpen,
} from 'lucide-react';
import type { Story, ConceptDefinition, ScreenState, ChildProfile } from '../types';
import { sound } from '../utils/audio';
import { tts } from '../utils/tts';
import { ConceptDefinitionModal } from './ConceptDefinitionModal';
import { StoryCard } from './StoryCard';
import { AnimatedCharacter } from './AnimatedCharacter';

interface StoryReaderScreenProps {
  story: Story;
  childProfile?: ChildProfile;
  readingMode: 'read_to_me' | 'read_myself';
  onNavigate: (screen: ScreenState) => void;
  onOpenWordScramble: () => void;
}

export const StoryReaderScreen: React.FC<StoryReaderScreenProps> = ({
  story,
  childProfile,
  readingMode: _readingMode,
  onNavigate,
  onOpenWordScramble,
}) => {
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [selectedConcept, setSelectedConcept] = useState<ConceptDefinition | null>(null);
  const [isPlayingTTS, setIsPlayingTTS] = useState(false);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('large');
  const [currentHighlightWord, setCurrentHighlightWord] = useState<string | null>(null);

  const currentChapter = story.chapters[currentChapterIndex] || story.chapters[0];
  const isLastChapter = currentChapterIndex === story.chapters.length - 1;

  // Cleanup TTS on unmount
  useEffect(() => {
    return () => {
      tts.stop();
    };
  }, []);

  // Stop TTS when chapter changes
  useEffect(() => {
    tts.stop();
    setIsPlayingTTS(false);
    setCurrentHighlightWord(null);
  }, [currentChapterIndex]);

  // Handle Play/Pause TTS
  const handleToggleTTS = () => {
    if (isPlayingTTS) {
      tts.pause();
      setIsPlayingTTS(false);
    } else {
      sound.playStarChime(1.1);
      setIsPlayingTTS(true);
      tts.speak(currentChapter.text, {
        rate: 0.88,
        onBoundary: (charIndex) => {
          const textAfter = currentChapter.text.slice(charIndex);
          const match = textAfter.match(/^\w+/);
          if (match) {
            setCurrentHighlightWord(match[0].toLowerCase());
          }
        },
        onEnd: () => {
          setIsPlayingTTS(false);
          setCurrentHighlightWord(null);
        },
        onError: () => {
          setIsPlayingTTS(false);
        },
      });
    }
  };

  const handleRestartTTS = () => {
    tts.stop();
    setIsPlayingTTS(false);
    handleToggleTTS();
  };

  const handleNextChapter = () => {
    if (currentChapterIndex < story.chapters.length - 1) {
      sound.playPageFlip();
      setCurrentChapterIndex(currentChapterIndex + 1);
    } else {
      sound.playStarChime(1.3);
      onOpenWordScramble();
    }
  };

  const handlePrevChapter = () => {
    if (currentChapterIndex > 0) {
      sound.playPageFlip();
      setCurrentChapterIndex(currentChapterIndex - 1);
    }
  };

  const fontSizeClass = {
    normal: 'text-base sm:text-lg leading-relaxed',
    large: 'text-lg sm:text-xl leading-loose',
    xlarge: 'text-xl sm:text-2xl leading-loose',
  }[fontSize];

  // Helper to render text with clickable glowing keywords
  const renderInteractiveText = (text: string) => {
    const keywords = currentChapter.highlightedKeywords;
    const keywordKeys = Object.keys(keywords);

    if (keywordKeys.length === 0) {
      return <span>{text}</span>;
    }

    const regex = new RegExp(`\\b(${keywordKeys.join('|')})\\b`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, index) => {
      const lower = part.toLowerCase();
      const concept = keywords[lower];

      if (concept) {
        const isCurrentlySpoken = currentHighlightWord === lower;
        return (
          <button
            key={index}
            type="button"
            onClick={() => {
              sound.playStarChime();
              setSelectedConcept(concept);
            }}
            className={`inline-flex items-center gap-1 font-extrabold px-2.5 py-1 mx-0.5 rounded-xl transition-all cursor-pointer select-none ${
              isCurrentlySpoken
                ? 'bg-[#FFD166] text-[#1B1F38] scale-105 shadow-lg shadow-[#FFD166]/50'
                : 'bg-[#5B42F3]/20 hover:bg-[#5B42F3]/40 text-[#5B42F3] border border-[#7E69FF]/50 hover:border-[#5B42F3] shadow-sm'
            }`}
          >
            <span>{part}</span>
            <span className="text-xs">{concept.icon || '✨'}</span>
          </button>
        );
      }

      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="relative w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 z-10 selection:bg-amber-400 selection:text-slate-950">
      {/* Concept Definition Modal Popup */}
      <ConceptDefinitionModal
        concept={selectedConcept}
        onClose={() => setSelectedConcept(null)}
      />

      {/* Top Reader Controls Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-8 sm:mb-10 bg-[#151933]/90 backdrop-blur-md p-3.5 sm:p-4 rounded-2xl border border-[#333C6B] shadow-xl">
        {/* Navigation back */}
        <button
          onClick={() => {
            sound.playTilePlace();
            tts.stop();
            onNavigate('story_config');
          }}
          className="min-h-[48px] px-4 py-2.5 rounded-xl flex items-center gap-2 text-xs sm:text-sm font-bold text-white/80 hover:text-white hover:bg-[#23294C] transition-all cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4 text-amber-300" />
          <span>Exit Story</span>
        </button>

        {/* Chapter Progress Tabs */}
        <div className="flex items-center gap-1.5 bg-[#0D1020] p-1 rounded-xl border border-[#333C6B]/60 overflow-x-auto max-w-full">
          {story.chapters.map((chap, idx) => (
            <button
              key={chap.id}
              onClick={() => {
                sound.playPageFlip();
                setCurrentChapterIndex(idx);
              }}
              className={`min-h-[40px] px-3.5 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                idx === currentChapterIndex
                  ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-sm'
                  : 'text-white/70 hover:text-white hover:bg-[#23294C]'
              }`}
            >
              Ch. {chap.chapterNumber}
            </button>
          ))}
        </div>

        {/* Audio Narration and Font Size tools */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          {/* Read Aloud Button */}
          <button
            onClick={handleToggleTTS}
            title={isPlayingTTS ? 'Pause Narration' : 'Listen Aloud'}
            className={`min-h-[48px] min-w-[48px] flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all shadow-sm cursor-pointer ${
              isPlayingTTS
                ? 'bg-amber-400 text-slate-950 animate-pulse shadow-md shadow-amber-400/40'
                : 'bg-gradient-to-r from-amber-400/20 to-purple-500/20 border border-amber-400/50 text-amber-300 hover:border-amber-400 hover:text-white'
            }`}
          >
            {isPlayingTTS ? (
              <>
                <Pause className="w-4 h-4" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Read to Me</span>
              </>
            )}
          </button>

          {isPlayingTTS && (
            <button
              onClick={handleRestartTTS}
              title="Restart from beginning"
              className="min-w-[48px] min-h-[48px] flex items-center justify-center rounded-xl bg-[#23294C] hover:bg-[#333C6B] text-white transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4 text-amber-300" />
            </button>
          )}

          {/* Font Size Selector */}
          <div className="flex items-center bg-[#0D1020] rounded-xl border border-[#333C6B] p-1">
            <button
              onClick={() => setFontSize('normal')}
              title="Normal Text"
              className={`min-w-[40px] min-h-[40px] sm:min-w-[44px] sm:min-h-[44px] rounded-lg text-xs font-bold flex items-center justify-center transition-all cursor-pointer ${
                fontSize === 'normal' ? 'bg-amber-400 text-slate-950 font-black shadow-sm' : 'text-gray-400 hover:text-white'
              }`}
            >
              A
            </button>
            <button
              onClick={() => setFontSize('large')}
              title="Large Text (Dyslexia Friendly)"
              className={`min-w-[40px] min-h-[40px] sm:min-w-[44px] sm:min-h-[44px] rounded-lg text-xs font-bold flex items-center justify-center transition-all cursor-pointer ${
                fontSize === 'large' ? 'bg-amber-400 text-slate-950 font-black shadow-sm' : 'text-gray-400 hover:text-white'
              }`}
            >
              A+
            </button>
            <button
              onClick={() => setFontSize('xlarge')}
              title="Extra Large Text"
              className={`min-w-[40px] min-h-[40px] sm:min-w-[44px] sm:min-h-[44px] rounded-lg text-xs font-bold flex items-center justify-center transition-all cursor-pointer ${
                fontSize === 'xlarge' ? 'bg-amber-400 text-slate-950 font-black shadow-sm' : 'text-gray-400 hover:text-white'
              }`}
            >
              A++
            </button>
          </div>
        </div>
      </div>

      {/* Two-Column Responsive Layout with generous top clearance for badges */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start pt-2">
        {/* Left Column (~45% width: lg:col-span-5) - Illustrated Chapter Card & Companion */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <StoryCard
            variant="glass"
            badge={`⭐ Chapter ${currentChapter.chapterNumber} of ${story.chapters.length}`}
            badgeIcon={<Sparkles className="w-3.5 h-3.5 text-amber-300" />}
            className="p-5 sm:p-6 shadow-2xl relative overflow-visible flex flex-col max-h-[82vh]"
          >
            {/* Scrollable Container with Visible Scrollbar and Generous Bottom Padding */}
            <div className="overflow-y-auto max-h-[calc(82vh-3.5rem)] pr-2 magic-scrollbar space-y-4 pb-6 sm:pb-8">
              {/* Illustrated Vignette Header */}
              <div className="rounded-2xl bg-gradient-to-br from-[#242A4A] via-[#1B1F38] to-[#14182E] border border-amber-400/25 p-4 sm:p-5 text-center flex flex-col items-center justify-center gap-2.5 shadow-inner">
                <div className="flex items-center justify-center gap-4 text-4xl">
                  <span className="animate-float">
                    {story.theme === 'tree_kingdom' ? '🌳' : story.theme === 'cosmic_quest' ? '🚀' : story.theme === 'ocean_whispers' ? '🌊' : '🔍'}
                  </span>
                  <span className="text-3xl animate-float-slow">
                    {story.badge.icon}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-amber-300 font-semibold italic max-w-sm leading-relaxed">
                  "{currentChapter.illustrationAlt}"
                </p>
              </div>

              {/* Living Companion Sticker Container */}
              <div className="flex flex-col items-center justify-center py-4 bg-[#0D1020]/70 rounded-2xl border border-[#333C6B]/60 shadow-inner">
                <div className="avatar-sticker-container w-28 h-28 sm:w-32 sm:h-32 shadow-xl">
                  <AnimatedCharacter
                    avatarId={childProfile?.avatar || 'starlight_wizard'}
                    size="md"
                    emotion={isPlayingTTS ? 'happy' : 'idle'}
                  />
                </div>
                <div className="mt-2 text-center">
                  <span className="text-xs font-black uppercase tracking-wider text-teal-300 block">
                    {childProfile?.name || 'Noble Hero'}'s Companion
                  </span>
                  <span className="text-[11px] text-white/70 italic font-medium">
                    Listening along with you ✨
                  </span>
                </div>
              </div>

              {/* Keyword Glossary Card */}
              {Object.keys(currentChapter.highlightedKeywords).length > 0 && (
                <div className="bg-[#151933]/90 rounded-2xl p-4 border border-[#333C6B]/70 shadow-md">
                  <div className="flex items-center gap-2 text-xs font-black text-amber-300 uppercase tracking-wider mb-2.5">
                    <HelpCircle className="w-4 h-4 text-amber-400" />
                    <span>Magical Concept Runes:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(currentChapter.highlightedKeywords).map(([key, def]) => (
                      <button
                        key={key}
                        onClick={() => {
                          sound.playStarChime();
                          setSelectedConcept(def);
                        }}
                        className="min-h-[40px] px-3 py-1.5 rounded-xl bg-[#1A1F3C] border border-amber-400/40 hover:border-amber-400 text-xs font-bold text-white flex items-center gap-1.5 shadow-sm hover:scale-105 transition-all cursor-pointer"
                      >
                        <span>{def.icon}</span>
                        <span>{def.word}</span>
                        <span className="text-[10px] text-teal-300 font-mono">({def.phonics})</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </StoryCard>
        </div>

        {/* Right Column (~55% width: lg:col-span-7) - Story Prose & Navigation */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <StoryCard
            variant="parchment"
            badge={`📖 Quest Scroll • Chapter ${currentChapter.chapterNumber}`}
            badgeIcon={<BookOpen className="w-3.5 h-3.5 text-amber-800" />}
            className="p-6 sm:p-8 shadow-2xl relative overflow-visible flex flex-col max-h-[82vh]"
          >
            {/* Story Title & Chapter Header (Fixed Header, never scrolled away) */}
            <div className="border-b-2 border-[#EADBBA] pb-4 mb-3 text-center shrink-0">
              <div className="inline-flex items-center gap-1.5 text-xs font-black tracking-widest uppercase text-amber-800 bg-amber-100/90 px-3.5 py-1 rounded-full mb-2 border border-amber-300/70 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Scroll {currentChapter.chapterNumber} of {story.chapters.length}</span>
              </div>

              <h1 className="font-storybook text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1B1F38] mb-1 leading-tight">
                {currentChapter.title}
              </h1>

              <p className="text-xs sm:text-sm font-semibold text-[#6B5E87]">
                From: <span className="italic font-bold">"{story.title}"</span>
              </p>
            </div>

            {/* Narrative Text Container with Dedicated Visible Scrollbar and Generous Bottom Padding */}
            <div className={`flex-1 overflow-y-auto pr-3 sm:pr-4 py-3 parchment-scrollbar text-[#231E33] font-medium max-w-[72ch] mx-auto ${fontSizeClass} selection:bg-amber-300 selection:text-slate-900 tracking-wide pb-8 sm:pb-10`}>
              <p className="leading-relaxed sm:leading-loose">{renderInteractiveText(currentChapter.text)}</p>
            </div>

            {/* Chapter Navigation Buttons (Fixed footer at bottom of card) */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 mt-auto border-t-2 border-[#EADBBA] shrink-0 bg-[#FFFDF7]">
              <button
                type="button"
                onClick={handlePrevChapter}
                disabled={currentChapterIndex === 0}
                className={`min-h-[48px] w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm transition-all ${
                  currentChapterIndex === 0
                    ? 'opacity-30 cursor-not-allowed text-gray-400 bg-[#FAF5E6]'
                    : 'bg-[#FAF5E6] text-[#1B1F38] hover:bg-[#EADBBA] border border-[#D5C29E] cursor-pointer'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous Chapter</span>
              </button>

              {isLastChapter ? (
                <button
                  type="button"
                  onClick={handleNextChapter}
                  className="min-h-[48px] w-full sm:w-auto px-7 py-3.5 rounded-2xl gold-foil-button text-base font-black flex items-center justify-center gap-2.5 shadow-xl cursor-pointer hover:scale-102 transition-transform text-slate-950"
                >
                  <Wand2 className="w-5 h-5 text-slate-950" />
                  <span>Play "Word Magic" Mini-Game! &rarr;</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNextChapter}
                  className="min-h-[48px] w-full sm:w-auto px-6 py-3.5 rounded-2xl violet-magic-button text-sm font-black flex items-center justify-center gap-2 shadow-md cursor-pointer hover:scale-102 transition-transform text-white"
                >
                  <span>Turn Page &rarr; ({currentChapterIndex + 2}/{story.chapters.length})</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </StoryCard>
        </div>
      </div>
    </div>
  );
};
