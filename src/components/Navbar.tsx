import React from 'react';
import {
  BookOpen,
  Sparkles,
  Wand2,
  Library,
  Puzzle,
  Award,
  ShieldCheck,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { sound } from '../utils/audio';
import { SkyMoodShifter } from './SkyMoodShifter';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  activeAvatar?: { name: string; id: string; accentColor?: string };
  starsCount?: number;
  isMuted?: boolean;
  onToggleMute?: () => void;
  onOpenParentGate: () => void;
  className?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  starsCount = 0,
  isMuted = false,
  onToggleMute,
  onOpenParentGate,
  className = '',
}) => {
  const navItems = [
    { id: 'create', label: 'New Quest', icon: Wand2 },
    { id: 'library', label: '150 Books ✨', icon: Library },
    { id: 'games', label: 'Word Magic', icon: Puzzle },
    { id: 'badges', label: 'Badges', icon: Award },
  ];

  const handleTabClick = (tabId: string) => {
    sound.playStarChime();
    onSelectTab(tabId);
  };

  return (
    <>
      {/* Top Bar (Desktop & Mobile) */}
      <header
        className={`sticky top-0 z-40 w-full pt-safe border-b border-[#FFD166]/20 bg-[#1B1F38]/90 backdrop-blur-md shadow-[0_4px_20px_rgba(255,209,102,0.1)] transition-colors ${className}`}
      >
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => handleTabClick('home')}
            className="flex items-center gap-2.5 group cursor-pointer focus:outline-none"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#5B42F3] to-[#FFD166] p-0.5 shadow-md group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#1B1F38] rounded-[14px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-[#FFD166] animate-pulse" />
              </div>
            </div>
            <div className="text-left">
              <span className="block font-serif text-lg font-bold text-white tracking-wide">
                Story Teacher
              </span>
              <span className="block text-[10px] text-amber-200/80 -mt-1 font-medium tracking-wider uppercase">
                Magic Learning
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5 bg-black/20 p-1.5 rounded-full border border-white/10">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-[#FFD166]/20 to-[#FF9F68]/20 border border-[#FFD166]/60 text-[#FFD166] shadow-[0_0_12px_rgba(255,209,102,0.2)]'
                      : 'text-purple-200/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Controls: Sky & Mood Shifter, Stars, Audio, & Parent Gate */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Sky & Mood Shifter (Japanese Climate & Time of Day Switcher) */}
            <SkyMoodShifter />

            {/* Star Counter */}
            <div className="hidden xs:flex items-center gap-1.5 bg-amber-500/10 border border-amber-400/30 px-2.5 sm:px-3 py-1 rounded-full text-amber-300 text-xs font-bold shadow-inner">
              <Sparkles className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{starsCount} ⭐</span>
            </div>

            {/* Background Sound Toggle */}
            <button
              onClick={() => {
                if (onToggleMute) onToggleMute();
              }}
              title={isMuted ? 'Unmute audio' : 'Mute audio'}
              className="p-2 rounded-xl text-purple-200/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-[#FFD166]" />}
            </button>

            {/* Grown-Up Gate Button */}
            <button
              onClick={() => {
                sound.playStarChime();
                onOpenParentGate();
              }}
              className="flex items-center gap-1.5 bg-[#5B42F3]/30 hover:bg-[#5B42F3]/50 text-purple-200 border border-[#5B42F3]/50 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">Parents</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar (Fixed at bottom on phones < 768px with Safe Area Guard) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#1B1F38]/95 backdrop-blur-lg border-t border-[#FFD166]/20 px-3 pt-2 pb-[calc(env(safe-area-inset-bottom)+0.6rem)] flex items-center justify-around shadow-[0_-4px_20px_rgba(0,0,0,0.4)]">
        {/* Home option on mobile bar */}
        <button
          onClick={() => handleTabClick('home')}
          className={`min-w-[48px] min-h-[48px] flex flex-col items-center justify-center gap-0.5 py-1 px-2.5 rounded-2xl transition-all cursor-pointer ${
            currentTab === 'home' || currentTab === 'landing' ? 'text-[#FFD166] scale-105 font-bold' : 'text-purple-200/60 hover:text-white'
          }`}
        >
          <div className={`p-1.5 rounded-xl ${currentTab === 'home' || currentTab === 'landing' ? 'bg-[#FFD166]/15' : ''}`}>
            <BookOpen className="w-5 h-5" />
          </div>
          <span className="text-[10px] tracking-tight">Home</span>
        </button>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={`min-w-[48px] min-h-[48px] flex flex-col items-center justify-center gap-0.5 py-1 px-2.5 rounded-2xl transition-all cursor-pointer ${
                isActive ? 'text-[#FFD166] scale-105 font-bold' : 'text-purple-200/60 hover:text-white'
              }`}
            >
              <div className={`p-1.5 rounded-xl ${isActive ? 'bg-[#FFD166]/15' : ''}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
