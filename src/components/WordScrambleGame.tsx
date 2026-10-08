import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, RotateCcw, Lightbulb, CheckCircle2, ArrowRight, Wand2, Shuffle } from 'lucide-react';
import type { WordPuzzle, ChildProfile } from '../types';
import { sound } from '../utils/audio';
import { AnimatedCharacter } from './AnimatedCharacter';
import { StoryCard } from './StoryCard';

interface WordScrambleGameProps {
  puzzles: WordPuzzle[];
  childProfile: ChildProfile;
  onCompleteAllWords: (wordsMastered: number) => void;
  onSkip?: () => void;
}

interface TileItem {
  id: string;
  char: string;
}

export const WordScrambleGame: React.FC<WordScrambleGameProps> = ({
  puzzles,
  childProfile,
  onCompleteAllWords,
  onSkip,
}) => {
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
  const currentPuzzle = puzzles[currentPuzzleIndex] || puzzles[0];

  // Available tiles in rack
  const [availableTiles, setAvailableTiles] = useState<TileItem[]>([]);
  // Placed tiles in target slots
  const [placedTiles, setPlacedTiles] = useState<(TileItem | null)[]>([]);
  // Word solved state
  const [isWordSolved, setIsWordSolved] = useState(false);
  // Hint used count
  const [hintsUsed, setHintsUsed] = useState(0);

  // Initialize or reset puzzle rack
  useEffect(() => {
    if (!currentPuzzle) return;
    const targetWord = currentPuzzle.targetWord.toUpperCase();
    const letters = currentPuzzle.scrambledLetters.length > 0
      ? currentPuzzle.scrambledLetters
      : targetWord.split('').sort(() => Math.random() - 0.5);

    const tiles: TileItem[] = letters.map((char, idx) => ({
      id: `${char}-${idx}-${Date.now()}`,
      char: char.toUpperCase(),
    }));

    setAvailableTiles(tiles);
    setPlacedTiles(new Array(targetWord.length).fill(null));
    setIsWordSolved(false);
  }, [currentPuzzleIndex, currentPuzzle]);

  const targetLength = currentPuzzle ? currentPuzzle.targetWord.length : 0;

  // Handle placing a tile into the next available slot
  const handleSelectTile = (tile: TileItem) => {
    if (isWordSolved) return;
    const firstEmptyIndex = placedTiles.findIndex((t) => t === null);
    if (firstEmptyIndex === -1) return;

    sound.playTilePlace();

    const newPlaced = [...placedTiles];
    newPlaced[firstEmptyIndex] = tile;
    setPlacedTiles(newPlaced);

    setAvailableTiles(availableTiles.filter((t) => t.id !== tile.id));

    // Check if fully placed
    const checkWord = newPlaced.map((t) => (t ? t.char : '')).join('');
    if (checkWord.length === targetLength) {
      if (checkWord === currentPuzzle.targetWord.toUpperCase()) {
        triggerWordSuccess();
      } else {
        sound.playGentleClue();
      }
    }
  };

  // Handle removing a placed tile back to rack
  const handleRemovePlacedTile = (index: number) => {
    if (isWordSolved) return;
    const tile = placedTiles[index];
    if (!tile) return;

    sound.playTilePlace();
    const newPlaced = [...placedTiles];
    newPlaced[index] = null;
    setPlacedTiles(newPlaced);
    setAvailableTiles([...availableTiles, tile]);
  };

  // Clear all placed tiles back to rack
  const handleResetRack = () => {
    sound.playTilePlace();
    const targetWord = currentPuzzle.targetWord.toUpperCase();
    const all = [...availableTiles, ...(placedTiles.filter(Boolean) as TileItem[])];
    setPlacedTiles(new Array(targetWord.length).fill(null));
    setAvailableTiles(all);
  };

  // Shuffle remaining tiles
  const handleShuffleLetters = () => {
    sound.playTilePlace();
    setAvailableTiles((prev) => [...prev].sort(() => Math.random() - 0.5));
  };

  // Provide hint: auto-place the next correct character
  const handleUseHint = () => {
    if (isWordSolved) return;
    sound.playStarChime(1.4);
    setHintsUsed((prev) => prev + 1);

    const targetWord = currentPuzzle.targetWord.toUpperCase();
    // Find first mismatch or empty slot
    let targetIndex = -1;
    for (let i = 0; i < targetWord.length; i++) {
      if (!placedTiles[i] || placedTiles[i]?.char !== targetWord[i]) {
        targetIndex = i;
        break;
      }
    }

    if (targetIndex === -1) return;

    const neededChar = targetWord[targetIndex];

    // Find tile with this char
    let foundTile: TileItem | null = null;
    let foundInPlacedIndex = -1;

    // Check available tiles first
    foundTile = availableTiles.find((t) => t.char === neededChar) || null;

    if (!foundTile) {
      // Find from incorrect placed positions after targetIndex
      for (let i = targetIndex + 1; i < placedTiles.length; i++) {
        if (placedTiles[i]?.char === neededChar) {
          foundTile = placedTiles[i];
          foundInPlacedIndex = i;
          break;
        }
      }
    }

    if (!foundTile) return;

    const newPlaced = [...placedTiles];
    // If targetIndex was occupied by wrong tile, return it
    if (newPlaced[targetIndex]) {
      setAvailableTiles((prev) => [...prev, newPlaced[targetIndex]!]);
    }

    if (foundInPlacedIndex !== -1) {
      newPlaced[foundInPlacedIndex] = null;
    } else {
      setAvailableTiles((prev) => prev.filter((t) => t.id !== foundTile!.id));
    }

    newPlaced[targetIndex] = foundTile;
    setPlacedTiles(newPlaced);

    // Check victory
    const checkWord = newPlaced.map((t) => (t ? t.char : '')).join('');
    if (checkWord === targetWord) {
      triggerWordSuccess();
    }
  };

  // Celebration when word is spelled correctly
  const triggerWordSuccess = () => {
    setIsWordSolved(true);
    sound.playCorrectSparkle();
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.65 },
      colors: ['#FFD166', '#2EC4B6', '#5B42F3', '#FF9F68'],
    });
  };

  const handleAdvanceNextWord = () => {
    sound.playStarChime(1.2);
    if (currentPuzzleIndex < puzzles.length - 1) {
      setCurrentPuzzleIndex(currentPuzzleIndex + 1);
    } else {
      sound.playCelebrationFanfare();
      onCompleteAllWords(puzzles.length);
    }
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto px-2 sm:px-4 py-6 z-10 selection:bg-amber-400 selection:text-slate-950">
      {/* 150 Books Themed Word Magic StoryCard */}
      <StoryCard
        variant="accent"
        badge="🧩 Word Magic Riddle"
        badgeIcon={<Sparkles className="w-3.5 h-3.5 text-amber-300" />}
        className="p-6 sm:p-10 shadow-2xl relative overflow-hidden"
      >
        {/* Ambient background glow matching 150 Books hero */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-gradient-to-br from-amber-400/20 via-rose-500/15 to-transparent blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-gradient-to-tr from-teal-400/15 via-indigo-500/15 to-transparent blur-3xl pointer-events-none" />

        {/* Top Header Section */}
        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-[#333C6B]/60 pb-6 mb-6">
          <div className="text-center sm:text-left">
            <h1 className="font-storybook text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight drop-shadow-md">
              Word Magic{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-rose-300 to-teal-300">
                Scramble
              </span>
            </h1>
            <p className="text-sm sm:text-base text-white/85 mt-2 font-medium leading-relaxed">
              The magical words from the story scattered into sparkling tiles! Help your companion reassemble them.
            </p>
          </div>

          {/* Progress Indicator Pill */}
          <div className="flex items-center gap-2.5 bg-[#1A1F3C] px-4 py-2.5 rounded-xl border border-[#333C6B] shadow-md shrink-0">
            <span className="text-xs font-black uppercase tracking-wider text-teal-300">Word</span>
            <div className="flex items-center gap-1.5">
              {puzzles.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-3 h-3 rounded-full transition-all ${
                    idx === currentPuzzleIndex
                      ? 'bg-amber-400 scale-125 shadow-md shadow-amber-400/50'
                      : idx < currentPuzzleIndex
                      ? 'bg-teal-400'
                      : 'bg-[#333C6B]'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs font-black uppercase tracking-wider text-amber-300">
              {currentPuzzleIndex + 1} of {puzzles.length}
            </span>
          </div>
        </div>

        {/* Animal Companion Speech Card */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-center bg-[#151933]/90 rounded-3xl p-6 sm:p-8 border-2 border-amber-400/40 mb-8 shadow-xl">
          <div className="md:col-span-3 flex justify-center">
            <div className="avatar-sticker-container w-24 h-24 sm:w-28 sm:h-28 shadow-xl">
              <AnimatedCharacter
                avatarId={childProfile.avatar}
                size="lg"
                emotion={isWordSolved ? 'celebrating' : 'thinking'}
              />
            </div>
          </div>

          <div className="md:col-span-9">
            <div className="text-xs sm:text-sm font-black text-amber-300 uppercase tracking-wider mb-2 flex items-center gap-2">
              <Wand2 className="w-4 h-4 text-amber-400" />
              <span>Your Animal Companion's Riddle Clue:</span>
            </div>
            <p className="font-storybook text-lg sm:text-xl font-bold text-white leading-relaxed italic mb-3">
              "{currentPuzzle.riddleClue}"
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-400/40 text-xs font-black uppercase tracking-wider">
              <span>Category: {currentPuzzle.conceptCategory}</span>
            </div>
          </div>
        </div>

        {/* Target Word Slot Cards (Where child places tiles) */}
        <div className="relative z-10 mb-8">
          <p className="text-xs font-black text-center text-amber-300/90 uppercase tracking-wider mb-3">
            Tap letters or slots to arrange:
          </p>

          <div className="flex items-center justify-center gap-2.5 sm:gap-4 flex-wrap">
            {placedTiles.map((slotTile, idx) => {
              const isFilled = slotTile !== null;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleRemovePlacedTile(idx)}
                  className={`min-w-[48px] min-h-[56px] w-14 h-16 sm:w-18 sm:h-20 rounded-2xl font-storybook font-black text-2xl sm:text-3xl flex items-center justify-center transition-all cursor-pointer relative ${
                    isWordSolved
                      ? 'bg-gradient-to-r from-teal-400 via-emerald-400 to-teal-300 text-slate-950 border-2 border-white shadow-xl shadow-teal-400/50 animate-bounce'
                      : isFilled
                      ? 'bg-gradient-to-b from-amber-300 via-amber-400 to-amber-500 text-slate-950 border-2 border-white shadow-lg shadow-amber-400/30 hover:scale-105 active:translate-y-1'
                      : 'bg-[#0D1020]/90 border-2 border-dashed border-amber-400/50 hover:border-amber-400 text-transparent shadow-[0_0_15px_rgba(251,191,36,0.15)]'
                  }`}
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  {slotTile ? slotTile.char : ''}
                  {!slotTile && (
                    <span className="text-xs text-amber-400/40 font-sans font-black">
                      {idx + 1}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Letter Rack (Touchable, physical-feeling letter card tiles) */}
        <div className="relative z-10 p-5 sm:p-6 rounded-2xl bg-[#0D1020]/90 border-2 border-[#333C6B] mb-8 text-center shadow-inner">
          <p className="text-xs font-black text-white/60 uppercase tracking-wider mb-3">
            Scattered Letter Tiles:
          </p>

          <div className="flex items-center justify-center gap-2.5 sm:gap-3.5 flex-wrap min-h-[64px]">
            {availableTiles.length === 0 && !isWordSolved && (
              <p className="text-xs text-white/60 italic font-medium">All tiles are placed! Check your spelling above.</p>
            )}

            {availableTiles.map((tile) => (
              <button
                key={tile.id}
                type="button"
                onClick={() => handleSelectTile(tile)}
                className="min-w-[48px] min-h-[48px] w-12 h-14 sm:w-14 sm:h-16 bg-white text-slate-900 font-storybook font-black text-xl sm:text-2xl rounded-2xl shadow-xl border-b-4 border-amber-400 active:translate-y-1 hover:scale-110 transition-all cursor-pointer flex items-center justify-center select-none"
              >
                {tile.char}
              </button>
            ))}
          </div>
        </div>

        {/* Word Solved Reward Box */}
        {isWordSolved && (
          <div className="relative z-10 mb-8 p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-teal-500/20 via-amber-400/15 to-emerald-500/20 border-2 border-teal-400/60 text-center animate-fade-in shadow-xl">
            <div className="flex items-center justify-center gap-2 text-teal-300 font-storybook font-extrabold text-lg sm:text-xl mb-1.5">
              <CheckCircle2 className="w-6 h-6 text-teal-300" />
              <span>Brilliant Spelling! You Mastered "{currentPuzzle.targetWord}"</span>
            </div>
            <p className="text-sm text-white/90 max-w-md mx-auto font-medium leading-relaxed">
              <span className="font-bold text-amber-300">Meaning: </span>
              {currentPuzzle.educationalMeaning}
            </p>
          </div>
        )}

        {/* Mini-Game Action Button Cards */}
        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#333C6B]/60">
          <div className="flex items-center gap-2.5 w-full sm:w-auto flex-wrap">
            <button
              type="button"
              onClick={handleResetRack}
              disabled={isWordSolved || placedTiles.every((t) => t === null)}
              className="min-h-[44px] flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#1A1F3C] border border-[#333C6B] text-xs font-bold text-white/80 hover:text-white hover:border-amber-400/50 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <RotateCcw className="w-4 h-4 text-amber-300" />
              <span>Reset Tiles</span>
            </button>

            <button
              type="button"
              onClick={handleShuffleLetters}
              disabled={isWordSolved || availableTiles.length <= 1}
              className="min-h-[44px] flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#1A1F3C] border border-[#333C6B] text-xs font-bold text-white/80 hover:text-white hover:border-amber-400/50 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <Shuffle className="w-4 h-4 text-teal-300" />
              <span>Shuffle Letters</span>
            </button>

            <button
              type="button"
              onClick={handleUseHint}
              disabled={isWordSolved}
              className="min-h-[44px] flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400/20 to-rose-400/20 border border-amber-400/50 text-xs font-bold text-amber-300 hover:border-amber-400 hover:text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <Lightbulb className="w-4 h-4 text-amber-300" />
              <span>Magic Letter Hint{hintsUsed > 0 ? ` (${hintsUsed})` : ''}</span>
            </button>
          </div>

          {isWordSolved ? (
            <button
              type="button"
              onClick={handleAdvanceNextWord}
              className="min-h-[48px] w-full sm:w-auto px-8 py-3.5 rounded-2xl gold-foil-button text-base font-black flex items-center justify-center gap-2 shadow-2xl cursor-pointer hover:scale-102 transition-transform text-slate-950"
            >
              <span>
                {currentPuzzleIndex < puzzles.length - 1
                  ? `Next Word Puzzle (${currentPuzzleIndex + 2}/${puzzles.length})`
                  : 'Enter Concept Assessment! ✨'}
              </span>
              <ArrowRight className="w-5 h-5 text-slate-950" />
            </button>
          ) : (
            onSkip && (
              <button
                type="button"
                onClick={onSkip}
                className="min-h-[48px] px-4 py-2 inline-flex items-center text-xs font-bold text-white/60 hover:text-white transition-colors cursor-pointer"
              >
                Skip to Quiz &rarr;
              </button>
            )
          )}
        </div>
      </StoryCard>
    </div>
  );
};
