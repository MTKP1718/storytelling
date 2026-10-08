import React from 'react';
import { Sparkles, Volume2, VolumeX, Shield, BookOpen, Star, Home } from 'lucide-react';
import type { ChildProfile, ScreenState } from '../types';
import { sound } from '../utils/audio';
import { AnimatedCharacter } from './AnimatedCharacter';

interface HeaderNavProps {
  currentScreen: ScreenState;
  childProfile: ChildProfile;
  isMuted: boolean;
  onToggleMute: () => void;
  onNavigate: (screen: ScreenState) => void;
  onOpenParentGate: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  currentScreen,
  childProfile,
  isMuted,
  onToggleMute,
  onNavigate,
  onOpenParentGate,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full px-4 py-3 bg-[#101426]/85 backdrop-blur-md border-b border-[#333C6B]/50 transition-all">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
        {/* Logo / Brand */}
        <div className="flex items-center gap-2">
          {currentScreen !== 'landing' && (
            <button
              onClick={() => {
                sound.playPageFlip();
                onNavigate('landing');
              }}
              title="Return to Story Cover"
              className="p-2 rounded-xl bg-[#1B1F38] border border-[#333C6B] hover:border-[#FFD166] text-[#FFD166] transition-colors"
            >
              <Home className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => {
              sound.playStarChime();
              onNavigate('landing');
            }}
            className="flex items-center gap-2.5 text-left group focus:outline-none"
          >
          <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#5B42F3] to-[#FFD166] flex items-center justify-center shadow-lg shadow-[#5B42F3]/30 group-hover:scale-105 transition-transform">
            <BookOpen className="w-5 h-5 text-white" />
            <Sparkles className="w-3.5 h-3.5 text-[#FFD166] absolute -top-1 -right-1 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-storybook text-lg sm:text-xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-[#FFFDF7] via-[#FFD166] to-[#FF9F68]">
                Story Teacher
              </span>
            </div>
            <p className="text-[10px] text-[#2EC4B6] font-semibold tracking-wider uppercase hidden sm:block">
              Fairy Tale School Concepts
            </p>
          </div>
        </button>
        </div>

        {/* Center / User summary */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Child Profile chip */}
          <button
            onClick={() => {
              sound.playStarChime();
              onNavigate('story_config');
            }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1B1F38] border border-[#FFD166]/30 hover:border-[#FFD166] transition-all hover:bg-[#23294C] text-xs sm:text-sm"
          >
            <div className="w-6 h-6 rounded-full overflow-hidden flex items-center justify-center bg-[#23294C]">
              <AnimatedCharacter avatarId={childProfile.avatar} size="sm" className="scale-75" />
            </div>
            <span className="font-bold text-[#FFFDF7] max-w-[80px] sm:max-w-[120px] truncate">
              {childProfile.name || 'Hero'}
            </span>
            <div className="flex items-center gap-0.5 text-[#FFD166] font-extrabold bg-[#FFD166]/15 px-2 py-0.5 rounded-full text-xs">
              <Star className="w-3 h-3 fill-[#FFD166] text-[#FFD166]" />
              <span>{childProfile.totalStars}</span>
            </div>
          </button>

          {/* Sound Mute Toggle */}
          <button
            onClick={() => {
              onToggleMute();
            }}
            aria-label={isMuted ? 'Unmute sounds' : 'Mute sounds'}
            title={isMuted ? 'Sound is Muted' : 'Sound is Active'}
            className="w-9 h-9 rounded-full bg-[#1B1F38] border border-[#333C6B] hover:border-[#FFD166]/60 flex items-center justify-center text-[#FFD166] transition-all hover:scale-105"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-gray-400" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Parent & Teacher Gate */}
          <button
            onClick={() => {
              sound.playStarChime();
              onOpenParentGate();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#242A4A] to-[#1B1F38] border border-[#7E69FF]/50 hover:border-[#7E69FF] text-[#FFFDF7] text-xs sm:text-sm font-semibold transition-all hover:shadow-md hover:shadow-[#5B42F3]/25"
          >
            <Shield className="w-3.5 h-3.5 text-[#7E69FF]" />
            <span className="hidden md:inline">Parent & Teacher</span>
            <span className="md:hidden">Insights</span>
          </button>
        </div>
      </div>
    </header>
  );
};
