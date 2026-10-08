import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Star,
  BookOpen,
  Printer,
  Shield,
  Award,
} from 'lucide-react';
import type { Story, ChildProfile, ScreenState } from '../types';
import { sound } from '../utils/audio';
import { AnimatedCharacter } from './AnimatedCharacter';
import { StoryCard } from './StoryCard';

interface RewardScreenProps {
  story: Story;
  childProfile: ChildProfile;
  starsEarned: number;
  score: number;
  totalQuestions: number;
  wordsMastered: number;
  onNavigate: (screen: ScreenState) => void;
  onOpenPrintModal: () => void;
  onOpenParentGate: () => void;
}

export const RewardScreen: React.FC<RewardScreenProps> = ({
  story,
  childProfile,
  starsEarned,
  score,
  totalQuestions,
  wordsMastered,
  onNavigate,
  onOpenPrintModal,
  onOpenParentGate,
}) => {
  useEffect(() => {
    sound.playCelebrationFanfare();

    // Multistage confetti burst
    const end = Date.now() + 2.5 * 1000;
    const colors = ['#FFD166', '#5B42F3', '#2EC4B6', '#FF9F68', '#FFFDF7'];

    (function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors,
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  }, []);

  return (
    <div className="relative w-full max-w-4xl mx-auto px-2 sm:px-4 py-6 z-10 selection:bg-amber-400 selection:text-slate-950">
      {/* Grand Celebration StoryCard (150 Books Style) */}
      <StoryCard
        variant="accent"
        badge="🏆 Quest Victorious! ✨"
        badgeIcon={<Sparkles className="w-3.5 h-3.5 text-amber-300" />}
        className="p-6 sm:p-10 shadow-2xl text-center relative overflow-hidden"
      >
        {/* Ambient background glow circles matching 150 Books */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-gradient-to-br from-amber-400/20 via-rose-500/15 to-transparent blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-gradient-to-tr from-teal-400/15 via-indigo-500/15 to-transparent blur-3xl pointer-events-none" />

        {/* Confetti Ribbon Banner */}
        <div className="relative z-10 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-400/25 to-rose-400/20 border border-amber-400/60 text-amber-300 text-xs sm:text-sm font-black uppercase tracking-wider mb-4 shadow-lg animate-bounce">
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Quest Victorious!</span>
          <Sparkles className="w-4 h-4 text-amber-300" />
        </div>

        <h1 className="relative z-10 font-storybook text-3xl sm:text-5xl font-extrabold text-white mb-2 drop-shadow-md leading-tight">
          Honor & Glory to{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-rose-300 to-teal-300">
            {childProfile.name}!
          </span>
        </h1>

        <p className="relative z-10 text-sm sm:text-base text-white/85 max-w-lg mx-auto mb-6 font-medium leading-relaxed">
          You conquered the challenges of "{story.title}" and unlocked the sacred wisdom of {story.topic}!
        </p>

        {/* Golden Star Rating */}
        <div className="relative z-10 flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3, 4, 5].map((starNum) => {
            const isFilled = starNum <= starsEarned;
            return (
              <div
                key={starNum}
                className="transition-transform duration-300 hover:scale-125"
                style={{ animationDelay: `${starNum * 0.15}s` }}
              >
                <Star
                  className={`w-9 h-9 sm:w-12 sm:h-12 ${
                    isFilled
                      ? 'fill-amber-400 text-amber-400 filter drop-shadow-[0_0_12px_rgba(251,191,36,0.8)]'
                      : 'text-[#333C6B] fill-[#1B1F38]'
                  }`}
                />
              </div>
            );
          })}
        </div>

        {/* The Badge Showcase Card (150 Books Featured Card) */}
        <div className="relative z-10 max-w-md mx-auto bg-gradient-to-b from-[#242A4E] to-[#14182E] rounded-3xl p-7 border-2 border-amber-400/60 shadow-2xl mb-8">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-400 text-slate-950 px-4 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow-md whitespace-nowrap">
            New Badge Unlocked!
          </div>

          {/* Celebrating Character & Badge Icon Medallion */}
          <div className="flex items-center justify-center gap-4 mb-4 mt-2">
            <div className="avatar-sticker-container w-20 h-20 shrink-0 shadow-xl">
              <AnimatedCharacter avatarId={childProfile.avatar} size="md" emotion="celebrating" />
            </div>
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-400 via-rose-400 to-amber-300 flex items-center justify-center text-4xl shadow-2xl border-4 border-white animate-float">
              {story.badge.icon}
            </div>
          </div>

          <h2 className="font-storybook text-2xl font-extrabold text-white mb-1">
            {story.badge.title}
          </h2>
          <div className="mb-3">
            <span className="text-xs font-black uppercase tracking-wider text-teal-300 bg-teal-400/10 px-3 py-1 rounded-full border border-teal-400/30 inline-block shadow-sm">
              Rank: Grand Explorer of {story.topic}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-white/85 italic leading-relaxed font-medium">
            "{story.badge.description}"
          </p>
        </div>

        {/* Learning Summary Grid */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-xl mx-auto mb-8">
          <div className="bg-[#151933]/90 p-4 rounded-2xl border border-[#333C6B]/70 shadow-lg">
            <p className="font-storybook text-2xl font-black text-teal-300">
              {score}/{totalQuestions}
            </p>
            <p className="text-xs text-white/70 font-semibold mt-1">Trials Mastered</p>
          </div>

          <div className="bg-[#151933]/90 p-4 rounded-2xl border border-[#333C6B]/70 shadow-lg">
            <p className="font-storybook text-2xl font-black text-amber-300">{wordsMastered}</p>
            <p className="text-xs text-white/70 font-semibold mt-1">Magic Words Spelled</p>
          </div>

          <div className="bg-[#151933]/90 p-4 rounded-2xl border border-[#333C6B]/70 shadow-lg">
            <p className="font-storybook text-2xl font-black text-rose-300">100%</p>
            <p className="text-xs text-white/70 font-semibold mt-1">Story Completed</p>
          </div>
        </div>

        {/* Hero's Badges Hall of Fame / Badge Collection */}
        {childProfile.earnedBadges && childProfile.earnedBadges.length > 0 && (
          <div className="relative z-10 mb-8 pt-6 border-t border-[#333C6B]/60 text-left">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-storybook text-lg sm:text-xl font-extrabold text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-300" />
                <span>{childProfile.name}'s Badge Collection</span>
              </h3>
              <span className="text-xs font-black uppercase tracking-wider text-amber-300 bg-amber-500/20 border border-amber-400/40 px-3 py-1 rounded-full shadow-sm">
                {childProfile.earnedBadges.length} Unlocked
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
              {childProfile.earnedBadges.map((badgeItem) => (
                <div
                  key={badgeItem.id}
                  className="bg-[#151933]/90 rounded-2xl p-3.5 border border-[#333C6B]/70 hover:border-amber-400/50 shadow-md flex items-center gap-3 transition-all"
                >
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400/20 to-rose-400/20 border border-amber-400/40 flex items-center justify-center text-2xl shrink-0 shadow-inner">
                    {badgeItem.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-storybook text-xs sm:text-sm font-bold text-white truncate">
                      {badgeItem.title}
                    </h4>
                    <p className="text-[11px] text-white/60 truncate font-medium">
                      {badgeItem.description}
                    </p>
                    <span className="text-[9px] font-black uppercase tracking-wider text-teal-300 bg-teal-500/20 border border-teal-400/40 px-2 py-0.5 rounded-full inline-block mt-1">
                      Conquered
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-lg mx-auto">
          {/* Print Certificate CTA */}
          <button
            type="button"
            onClick={() => {
              sound.playStarChime();
              onOpenPrintModal();
            }}
            className="w-full sm:w-auto flex-1 min-h-[48px] py-3.5 px-6 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-600 text-white font-black text-sm flex items-center justify-center gap-2 shadow-xl hover:scale-105 transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Official Certificate</span>
          </button>

          {/* Read Another Story */}
          <button
            type="button"
            onClick={() => {
              sound.playPageFlip();
              onNavigate('story_config');
            }}
            className="w-full sm:w-auto flex-1 min-h-[48px] py-3.5 px-6 rounded-2xl gold-foil-button font-black text-slate-950 text-sm flex items-center justify-center gap-2 shadow-xl cursor-pointer hover:scale-102 transition-transform"
          >
            <BookOpen className="w-4 h-4 text-slate-950" />
            <span>Embark on Another Quest</span>
          </button>
        </div>

        {/* Parent Sanctum link */}
        <div className="relative z-10 mt-8 border-t border-[#333C6B]/40 pt-4 text-center">
          <button
            onClick={() => {
              sound.playStarChime();
              onOpenParentGate();
            }}
            className="min-h-[48px] px-3 py-2 inline-flex items-center gap-1.5 text-xs font-bold text-amber-300 hover:text-white transition-colors cursor-pointer"
          >
            <Shield className="w-3.5 h-3.5 text-amber-400" />
            <span>Parents & Teachers: View Skill Diagnosis & Conversation Starters &rarr;</span>
          </button>
        </div>
      </StoryCard>
    </div>
  );
};
