import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, ArrowRight, ShieldCheck, CheckCircle, HeartHandshake } from 'lucide-react';
import type { QuizQuestion, ChildProfile, VisualOption } from '../types';
import { sound } from '../utils/audio';
import { AnimatedCharacter } from './AnimatedCharacter';
import { StoryCard } from './StoryCard';

interface StoryQuizScreenProps {
  questions: QuizQuestion[];
  childProfile: ChildProfile;
  storyTitle: string;
  onCompleteQuiz: (results: {
    score: number;
    total: number;
    stars: number;
    masteredSkills: string[];
    growthAreas: string[];
  }) => void;
}

export const StoryQuizScreen: React.FC<StoryQuizScreenProps> = ({
  questions,
  childProfile,
  storyTitle,
  onCompleteQuiz,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const [attemptsOnCurrent, setAttemptsOnCurrent] = useState(0);
  const [correctFirstTries, setCorrectFirstTries] = useState(0);
  const [failedSkills, setFailedSkills] = useState<string[]>([]);
  const [passedSkills, setPassedSkills] = useState<string[]>([]);

  const currentQuestion = questions[currentIndex] || questions[0];

  // Helper to render visual fraction pie graphic
  const renderVisualElement = (visualType: string, visualValue?: string | number) => {
    if (visualType === 'fraction_pie') {
      const valStr = String(visualValue || '1/4');
      const numerator = parseInt(valStr.split('/')[0] || '1', 10);
      const denominator = parseInt(valStr.split('/')[1] || '4', 10);

      // Render 4-slice SVG pie
      const sliceColors = ['#FFD166', '#FFB703', '#FB8500', '#FF9F68'];
      return (
        <svg viewBox="0 0 100 100" className="w-16 h-16 drop-shadow-md">
          <circle cx="50" cy="50" r="46" fill="#242A4A" stroke="#FFD166" strokeWidth="2.5" />
          {/* Slices */}
          {denominator === 4 && (
            <>
              {/* Slice 1 (Top-Right: 0 to 90 deg) */}
              <path
                d="M50 50 L50 6 A44 44 0 0 1 94 50 Z"
                fill={numerator >= 1 ? sliceColors[0] : '#333C6B'}
                stroke="#1B1F38"
                strokeWidth="2"
              />
              {/* Slice 2 (Bottom-Right: 90 to 180 deg) */}
              <path
                d="M50 50 L94 50 A44 44 0 0 1 50 94 Z"
                fill={numerator >= 2 ? sliceColors[1] : '#333C6B'}
                stroke="#1B1F38"
                strokeWidth="2"
              />
              {/* Slice 3 (Bottom-Left: 180 to 270 deg) */}
              <path
                d="M50 50 L50 94 A44 44 0 0 1 6 50 Z"
                fill={numerator >= 3 ? sliceColors[2] : '#333C6B'}
                stroke="#1B1F38"
                strokeWidth="2"
              />
              {/* Slice 4 (Top-Left: 270 to 360 deg) */}
              <path
                d="M50 50 L6 50 A44 44 0 0 1 50 6 Z"
                fill={numerator >= 4 ? sliceColors[3] : '#333C6B'}
                stroke="#1B1F38"
                strokeWidth="2"
              />
            </>
          )}
          <circle cx="50" cy="50" r="6" fill="#FFFDF7" />
        </svg>
      );
    }

    return null;
  };

  const handleSelectOption = (option: VisualOption) => {
    if (isAnswerCorrect) return; // already solved
    sound.playTilePlace();
    setSelectedOptionId(option.id);
    setHasSubmitted(true);

    if (option.isCorrect) {
      sound.playCorrectSparkle();
      setIsAnswerCorrect(true);

      if (attemptsOnCurrent === 0) {
        setCorrectFirstTries((prev) => prev + 1);
        setPassedSkills((prev) => [...prev, currentQuestion.conceptSkillTested]);
      }

      confetti({
        particleCount: 50,
        spread: 50,
        origin: { y: 0.7 },
        colors: ['#FFD166', '#2EC4B6', '#5B42F3'],
      });
    } else {
      sound.playGentleClue();
      setIsAnswerCorrect(false);
      setAttemptsOnCurrent((prev) => prev + 1);

      if (!failedSkills.includes(currentQuestion.conceptSkillTested)) {
        setFailedSkills((prev) => [...prev, currentQuestion.conceptSkillTested]);
      }
    }
  };

  const handleNextQuestion = () => {
    sound.playStarChime();
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOptionId(null);
      setHasSubmitted(false);
      setIsAnswerCorrect(null);
      setAttemptsOnCurrent(0);
    } else {
      // Calculate final stars (3 to 5 stars)
      const ratio = correctFirstTries / Math.max(1, questions.length);
      const stars = ratio >= 0.8 ? 5 : ratio >= 0.5 ? 4 : 3;

      onCompleteQuiz({
        score: correctFirstTries,
        total: questions.length,
        stars,
        masteredSkills: Array.from(new Set(passedSkills)),
        growthAreas: Array.from(new Set(failedSkills)),
      });
    }
  };

  const optionLetters = ['A', 'B', 'C', 'D'];

  return (
    <div className="relative w-full max-w-4xl mx-auto px-2 sm:px-4 py-6 z-10">
      {/* Card 5: Quiz Deck Card */}
      <StoryCard
        variant="glass"
        badge="🛡️ Concept Trial"
        badgeIcon={<ShieldCheck className="w-3.5 h-3.5 text-amber-300" />}
        className="p-6 sm:p-10 shadow-2xl relative overflow-hidden"
      >
        {/* Header Badge & Progress */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-[#333C6B]/60 pb-5 mb-6">
          <div>
            <h1 className="font-storybook text-2xl sm:text-3xl font-extrabold text-white leading-tight">
              Did the Magic Work?
            </h1>
            <p className="text-xs sm:text-sm text-white/70 mt-1 font-medium">
              Solve the dilemmas from "{storyTitle}" by recalling what you learned!
            </p>
          </div>

          {/* Progress Tracker Pill */}
          <div className="flex items-center gap-2.5 bg-[#1A1F3C] px-4 py-2 rounded-xl border border-[#333C6B] shadow-md">
            <span className="text-xs font-black uppercase tracking-wider text-amber-300">Trial</span>
            <div className="flex items-center gap-1.5">
              {questions.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-3 h-3 rounded-full transition-all ${
                    idx === currentIndex
                      ? 'bg-amber-400 scale-125 shadow-md shadow-amber-400/50'
                      : idx < currentIndex
                      ? 'bg-teal-400'
                      : 'bg-[#333C6B]'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs font-black uppercase tracking-wider text-teal-300">
              {currentIndex + 1} of {questions.length}
            </span>
          </div>
        </div>

        {/* Story Dilemma Scenario Card */}
        <div className="bg-[#151933]/90 rounded-3xl p-6 sm:p-7 border-2 border-amber-400/40 mb-6 shadow-xl">
          <div className="text-xs sm:text-sm font-black text-amber-300 uppercase tracking-wider mb-2 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Story Dilemma:</span>
          </div>
          <p className="font-storybook text-lg sm:text-xl font-bold text-white leading-relaxed mb-3">
            "{currentQuestion.scenarioText}"
          </p>
          <p className="text-sm sm:text-base font-bold text-teal-300">
            {currentQuestion.questionPrompt}
          </p>
        </div>

        {/* Choice Cards (Responsive Single-Column List with 58px Min Height) */}
        <div className="w-full flex flex-col gap-3 sm:gap-4 max-w-xl mx-auto mb-6">
          {currentQuestion.options.map((option, optIdx) => {
            const isSelected = selectedOptionId === option.id;
            const isThisCorrect = isSelected && isAnswerCorrect === true;
            const isThisWrong = isSelected && isAnswerCorrect === false;

            return (
              <button
                key={option.id}
                type="button"
                onClick={() => handleSelectOption(option)}
                className={`w-full min-h-[58px] px-5 py-3.5 rounded-2xl border-2 text-left flex items-center justify-between gap-3.5 transition-all cursor-pointer relative group ${
                  isThisCorrect
                    ? 'bg-emerald-500/20 border-emerald-400 ring-2 ring-emerald-400 shadow-lg shadow-emerald-500/20'
                    : isThisWrong
                    ? 'bg-rose-500/20 border-rose-400 ring-2 ring-rose-400 animate-shake shadow-md shadow-rose-500/20'
                    : isSelected
                    ? 'bg-[#1A1F3C] border-amber-400 ring-2 ring-amber-400/40 shadow-lg'
                    : 'bg-[#151933]/90 border-[#333C6B]/70 hover:border-amber-400/50 hover:bg-[#1B2040] shadow-md hover:-translate-y-0.5'
                }`}
              >
                <div className="flex items-center gap-3.5 flex-1 min-w-0">
                  {/* Letter Badge Card (A, B, C, D) */}
                  <div
                    className={`w-9 h-9 shrink-0 rounded-xl flex items-center justify-center font-black text-sm border shadow-inner transition-colors ${
                      isThisCorrect
                        ? 'bg-emerald-500 text-white border-emerald-300'
                        : isThisWrong
                        ? 'bg-rose-500 text-white border-rose-300'
                        : 'bg-[#1A1F3C] text-amber-300 border-amber-400/40 group-hover:border-amber-400'
                    }`}
                  >
                    {optionLetters[optIdx] || optIdx + 1}
                  </div>

                  {/* Visual rendering if available */}
                  {option.visualValue && (
                    <div className="shrink-0 flex items-center justify-center">
                      {renderVisualElement(currentQuestion.visualType, option.visualValue)}
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <span className="font-storybook font-bold text-sm sm:text-base text-[#FFFDF7] block">
                      {option.label}
                    </span>
                    {option.subLabel && (
                      <span className="text-xs text-[#2EC4B6] font-semibold block mt-0.5">
                        {option.subLabel}
                      </span>
                    )}
                  </div>
                </div>

                {isThisCorrect && (
                  <CheckCircle className="w-6 h-6 text-emerald-400 shrink-0 animate-bounce ml-2" />
                )}
              </button>
            );
          })}
        </div>

        {/* In-Character Gentle Companion Hint Box (On Error) */}
        {hasSubmitted && isAnswerCorrect === false && (
          <div className="mb-6 p-5 rounded-2xl bg-amber-500/15 border-2 border-amber-400/50 flex items-start gap-4 animate-fade-in shadow-md">
            <div className="avatar-sticker-container w-16 h-16 shrink-0 shadow-lg">
              <AnimatedCharacter avatarId={childProfile.avatar} size="sm" emotion="thinking" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-xs font-black text-amber-300 uppercase tracking-wider mb-1">
                <HeartHandshake className="w-4 h-4 text-amber-400" />
                <span>Encouraging Companion Clue:</span>
              </div>
              <p className="text-sm font-semibold text-white leading-relaxed italic">
                "{currentQuestion.characterClueOnMistake}"
              </p>
              <p className="text-xs text-teal-300 font-bold mt-2">
                Tip: Try another option above! Every brave learner grows stronger from a riddle!
              </p>
            </div>
          </div>
        )}

        {/* Correct Answer Explanation Box */}
        {hasSubmitted && isAnswerCorrect === true && (
          <div className="mb-6 p-5 rounded-2xl bg-emerald-500/20 border-2 border-emerald-400/60 flex items-center gap-4 animate-fade-in shadow-lg">
            <div className="avatar-sticker-container w-16 h-16 shrink-0 shadow-lg">
              <AnimatedCharacter avatarId={childProfile.avatar} size="sm" emotion="celebrating" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-xs font-black text-emerald-300 uppercase tracking-wider mb-1">
                <CheckCircle className="w-4 h-4 text-emerald-300" />
                <span>Magnificent Deduction!</span>
              </div>
              <p className="text-sm font-medium text-white/95 leading-relaxed">
                {currentQuestion.conceptExplanation}
              </p>
            </div>
          </div>
        )}

        {/* Footer Navigation */}
        <div className="flex items-center justify-end pt-4 border-t border-[#333C6B]/60">
          {isAnswerCorrect ? (
            <button
              type="button"
              onClick={handleNextQuestion}
              className="min-h-[48px] px-8 py-3.5 rounded-2xl gold-foil-button text-base font-black flex items-center gap-2 shadow-2xl cursor-pointer hover:scale-102 transition-transform text-slate-950"
            >
              <span>
                {currentIndex < questions.length - 1
                  ? `Next Trial (${currentIndex + 2}/${questions.length})`
                  : 'Claim Your Hero Badge! ✨'}
              </span>
              <ArrowRight className="w-5 h-5 text-slate-950" />
            </button>
          ) : (
            <p className="text-xs text-white/60 italic py-2 font-medium">
              Tap the correct answer above to proceed to the victory hall!
            </p>
          )}
        </div>
      </StoryCard>
    </div>
  );
};
