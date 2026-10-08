import React, { useState } from 'react';
import { Sparkles, BookOpen, Star, Compass, Wand2, Shield, ArrowRight } from 'lucide-react';
import type { AvatarId, ChildProfile, ScreenState } from '../types';
import { AVATAR_OPTIONS } from '../data/mockStories';
import { sound } from '../utils/audio';
import { sanitizeChildName } from '../utils/security';
import { AnimatedCharacter } from './AnimatedCharacter';
import { ShootingStars } from './ShootingStars';
import { StoryCard } from './StoryCard';

interface HeroLandingScreenProps {
  childProfile: ChildProfile;
  onUpdateProfile: (updates: Partial<ChildProfile>) => void;
  onNavigate: (screen: ScreenState) => void;
  onOpenParentGate: () => void;
}

const AVATAR_THEME_BADGES: Record<string, { icon: string; label: string }> = {
  starlight_wizard: { icon: '🪄', label: 'Wand' },
  forest_elf: { icon: '🌿', label: 'Leaf' },
  baby_dragon: { icon: '🔥', label: 'Flame' },
  sky_explorer: { icon: '🧭', label: 'Compass' },
  ocean_mermaid: { icon: '🐚', label: 'Shell' },
  scholar_owl: { icon: '🦉', label: 'Scroll' },
  stargazer: { icon: '🔭', label: 'Lens' },
  faun_sprite: { icon: '🍃', label: 'Sprout' },
  magic_unicorn: { icon: '🦄', label: 'Horn' },
  cosmic_sorceress: { icon: '🔮', label: 'Orb' },
  celestial_fox: { icon: '🦊', label: 'Stars' },
  brave_knight: { icon: '⚔️', label: 'Shield' },
};

export const HeroLandingScreen: React.FC<HeroLandingScreenProps> = ({
  childProfile,
  onUpdateProfile,
  onNavigate,
  onOpenParentGate,
}) => {
  const [isOpeningBook, setIsOpeningBook] = useState(false);
  const [nameInput, setNameInput] = useState(childProfile.name || '');
  const [selectedAvatar, setSelectedAvatar] = useState<AvatarId>(
    childProfile.avatar || 'starlight_wizard'
  );
  const [selectedAge, setSelectedAge] = useState<number>(childProfile.age || 8);
  const [activeCategory, setActiveCategory] = useState<'all' | 'hero' | 'companion' | 'creature'>('all');

  const getAgeGroupLabel = (age: number) => {
    if (age <= 8) return { group: '6-8' as const, title: 'Budding Adventurer', color: 'from-[#FF9F68] to-[#FFD166]' };
    if (age <= 10) return { group: '9-10' as const, title: 'Concept Quest Master', color: 'from-[#2EC4B6] to-[#70A1FF]' };
    return { group: '11-12' as const, title: 'Grand Scholar of Arboria', color: 'from-[#5B42F3] to-[#7E69FF]' };
  };

  const currentAgeInfo = getAgeGroupLabel(selectedAge);
  const selectedAvatarMeta = AVATAR_OPTIONS.find((a) => a.id === selectedAvatar) || AVATAR_OPTIONS[0];

  const filteredAvatars =
    activeCategory === 'all'
      ? AVATAR_OPTIONS
      : AVATAR_OPTIONS.filter((a) => a.category === activeCategory);

  const handleOpenBook = () => {
    sound.playPageFlip();
    sound.playStarChime(1.2);
    setIsOpeningBook(true);

    const trimmedName = sanitizeChildName(nameInput, 25) || 'Young Explorer';
    onUpdateProfile({
      name: trimmedName,
      avatar: selectedAvatar,
      age: selectedAge,
      ageGroup: currentAgeInfo.group,
    });

    setTimeout(() => {
      onNavigate('story_config');
    }, 800);
  };

  return (
    <div className="relative min-h-[calc(100vh-68px)] flex flex-col items-center justify-center px-4 py-8 z-10">
      {/* Looping Multi-Angle Shooting Stars */}
      <ShootingStars />

      {/* Container with 3D perspective transition */}
      <div
        className={`w-full max-w-4xl transition-all duration-700 relative z-10 ${
          isOpeningBook ? 'scale-105 opacity-0 rotate-y-12' : 'scale-100 opacity-100'
        }`}
      >
        {/* Card 1: Hero Welcome & Onboarding Card */}
        <StoryCard
          variant="glass"
          badge="✨ Start Your Quest ✨"
          badgeIcon={<Sparkles className="w-3.5 h-3.5 text-[#FFD166]" />}
          className="relative border-2 border-[#FFD166]/40 shadow-2xl overflow-hidden"
        >
          {/* Subtle Starlight Foil Corner Embellishments */}
          <div className="absolute top-4 right-4 text-[#FFD166]/30 pointer-events-none">
            <Sparkles className="w-8 h-8 animate-spin" style={{ animationDuration: '24s' }} />
          </div>

          {/* Header Title Section */}
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-400/25 to-rose-400/20 border border-amber-400/60 text-amber-300 text-xs sm:text-sm font-black uppercase tracking-wider mb-3 shadow-lg animate-float-slow">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Where School Lessons Turn Into Fairy Tales</span>
            </div>

            <h1 className="font-storybook text-4xl sm:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#FFFDF7] via-[#FFD166] to-[#FF9F68] drop-shadow-md mb-3">
              Once Upon a Concept...
            </h1>

            <p className="text-base sm:text-lg text-[#FFFDF7]/85 font-medium leading-relaxed max-w-[72ch] mx-auto">
              Step into an enchanted storybook where fractions become knight feasts, photosynthesis fuels emerald kitchens, and gravity holds cosmic dances.
            </p>
          </div>

          {/* Quest Board: Profile Configuration */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start bg-[#151930]/80 rounded-3xl p-6 sm:p-8 border border-[#333C6B]/60 shadow-inner">
            {/* Left: Active Character Living Preview Card */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center text-center p-5 bg-gradient-to-b from-[#1E2447] to-[#14182E] rounded-3xl border border-[#FFD166]/30 shadow-lg w-full">
              <div className="relative mb-3">
                {/* Golden halo aura */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#FFD166]/25 to-[#5B42F3]/35 blur-xl animate-pulse" />
                <div className="avatar-sticker-container">
                  <AnimatedCharacter
                    avatarId={selectedAvatar}
                    childName={nameInput || 'Hero'}
                    size="xl"
                    interactive={true}
                    showSpeechBubble={true}
                    speechText={
                      selectedAvatarMeta.speechBubble ||
                      `Ready for our quest, ${nameInput || 'Hero'}!`
                    }
                  />
                </div>
              </div>

              <div className="flex items-center gap-1.5 justify-center mb-1">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-[#FFD166]/20 text-[#FFD166] border border-[#FFD166]/40">
                  {selectedAvatarMeta.category}
                </span>
                <h2 className="font-storybook text-xl font-bold text-[#FFD166]">
                  {selectedAvatarMeta.name}
                </h2>
              </div>

              <p className="text-xs text-[#2EC4B6] font-semibold mb-1">
                {selectedAvatarMeta.title}
              </p>
              <p className="text-xs text-[#FFFDF7]/70 italic max-w-xs mb-3">
                "{selectedAvatarMeta.description}"
              </p>

              <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#FFD166]/15 border border-[#FFD166]/40 text-[11px] text-[#FFD166] font-bold animate-pulse">
                <span>✨ Tap me to spin or wave!</span>
              </div>

              {/* Age Group Title Chip */}
              <div className="mt-3 px-3 py-1 rounded-full bg-gradient-to-r from-[#242A4A] to-[#1E2447] border border-[#FFD166]/30 text-xs font-bold text-[#FFD166]">
                Level: {currentAgeInfo.title}
              </div>
            </div>

            {/* Right: Inputs & Customization Cards */}
            <div className="lg:col-span-7 flex flex-col gap-6 w-full">
              {/* Recessed Parchment Input Card: Adventurer Name */}
              <div className="bg-[#FFFDF7] rounded-2xl p-4 sm:p-5 border-2 border-[#EADBBA] shadow-inner text-[#1B1F38]">
                <label className="block text-xs font-black uppercase tracking-wider text-[#8C6D23] mb-2 flex items-center gap-2">
                  <Compass className="w-4 h-4 text-[#8C6D23]" />
                  <span>Who is embarking on this quest?</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    placeholder="Enter adventurer's name (e.g., Oliver, Elira, Aarav)..."
                    maxLength={25}
                    className="w-full min-h-[48px] px-4 py-3 rounded-xl bg-[#FAF5E6] border border-[#D5C29E] focus:border-[#8C6D23] focus:ring-4 focus:ring-[#8C6D23]/20 text-[#1B1F38] text-base sm:text-lg font-bold placeholder:text-gray-400 outline-none transition-all"
                  />
                  {nameInput.trim().length > 0 && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#2EC4B6] bg-[#2EC4B6]/15 px-2.5 py-1 rounded-full border border-[#2EC4B6]/30">
                      ✨ Brave Reader!
                    </div>
                  )}
                </div>
              </div>

              {/* Card 2: Fantasy Character Selection Cards Grid */}
              <div className="w-full">
                <div className="flex items-center justify-between mb-2.5 flex-wrap gap-2">
                  <label className="text-xs sm:text-sm font-bold text-[#FFD166] uppercase tracking-wider flex items-center gap-1.5">
                    <Wand2 className="w-4 h-4" />
                    <span>Choose Your Fantasy Companion:</span>
                  </label>

                  {/* Category Filter Pills */}
                  <div className="flex items-center gap-1 bg-[#0D1020] p-1 rounded-xl border border-[#333C6B]">
                    {(['all', 'hero', 'companion', 'creature'] as const).map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => {
                          sound.playStarChime(1.1);
                          setActiveCategory(cat);
                        }}
                        className={`min-h-[28px] px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition-all cursor-pointer ${
                          activeCategory === cat
                            ? 'bg-[#5B42F3] text-white shadow-sm'
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 12 Character Responsive Card Grid (3 on mobile, 4 on tablet, 6 on desktop) */}
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5 sm:gap-3.5 w-full justify-items-center max-h-64 sm:max-h-72 overflow-y-auto p-2 rounded-2xl bg-[#0D1020]/70 border border-[#333C6B]/60">
                  {filteredAvatars.map((avatar) => {
                    const isSelected = selectedAvatar === avatar.id;
                    const badgeMeta = AVATAR_THEME_BADGES[avatar.id] || { icon: '✨', label: 'Badge' };

                    return (
                      <button
                        key={avatar.id}
                        type="button"
                        onClick={() => {
                          sound.playTilePlace();
                          setSelectedAvatar(avatar.id);
                        }}
                        className={`relative group flex flex-col items-center justify-between p-2 sm:p-2.5 rounded-2xl transition-all duration-300 cursor-pointer min-w-[48px] min-h-[48px] w-full ${
                          isSelected
                            ? 'bg-gradient-to-b from-[#5B42F3]/40 to-[#1B1F38] border-2 border-[#FFD166] ring-4 ring-[#FFD166] shadow-[0_0_20px_rgba(255,209,102,0.4)] scale-102'
                            : 'bg-[#151930] border border-[#333C6B]/70 hover:border-[#FFD166]/50 hover:bg-[#1E2447] hover:-translate-y-0.5'
                        }`}
                      >
                        {/* Themed Miniature Badge (Wand, Leaf, Flame, Shell, etc.) */}
                        <div
                          className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded-full bg-gradient-to-r from-amber-400/20 to-rose-400/20 border border-amber-400/60 text-[10px] font-black text-amber-300 flex items-center gap-0.5 shadow-sm"
                          title={badgeMeta.label}
                        >
                          <span>{badgeMeta.icon}</span>
                        </div>

                        {/* Character Avatar with Die-Cut Sticker Contour */}
                        <div className="avatar-sticker-container w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center my-0.5">
                          <AnimatedCharacter
                            avatarId={avatar.id}
                            size="sm"
                            interactive={false}
                            className="transition-transform group-hover:scale-110"
                          />
                        </div>

                        {/* Character Name */}
                        <span className="text-[11px] sm:text-xs font-bold text-[#FFFDF7] truncate w-full text-center mt-0.5">
                          {avatar.name}
                        </span>

                        {/* Character Title Pill */}
                        <span className="mt-0.5 px-1.5 py-0.5 rounded-full text-[8.5px] font-bold bg-[#2EC4B6]/15 text-[#2EC4B6] border border-[#2EC4B6]/30 truncate max-w-full">
                          {avatar.title}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Age Picker Horizontal Grid (7 rounded number-cards with 48px touch zone) */}
              <div className="w-full">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs sm:text-sm font-bold text-[#FFD166] uppercase tracking-wider flex items-center gap-2">
                    <Star className="w-4 h-4" />
                    <span>Adventurer's Age (6 to 12):</span>
                  </label>
                  <span className="text-xs font-bold text-[#2EC4B6]">
                    Age {selectedAge} Years Old
                  </span>
                </div>
                <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
                  {[6, 7, 8, 9, 10, 11, 12].map((ageVal) => {
                    const isSelected = selectedAge === ageVal;
                    return (
                      <button
                        key={ageVal}
                        type="button"
                        onClick={() => {
                          sound.playStarChime(0.9 + ageVal * 0.05);
                          setSelectedAge(ageVal);
                        }}
                        className={`min-w-[42px] sm:min-w-[48px] min-h-[48px] py-2.5 sm:py-3 rounded-2xl text-sm font-black transition-all cursor-pointer flex flex-col items-center justify-center ${
                          isSelected
                            ? 'bg-gradient-to-r from-[#FFD166] to-[#FFB703] text-[#1B1F38] shadow-lg shadow-[#FFD166]/30 scale-105 border-2 border-white'
                            : 'bg-[#0D1020] text-[#FFFDF7]/80 border border-[#333C6B] hover:border-[#FFD166]/50 hover:bg-[#1E2447]'
                        }`}
                      >
                        <span>{ageVal}</span>
                        <span className="text-[9px] font-normal opacity-70">yr</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Action Button Card: Dual CTA for Custom Quest & 150 Books Campaign */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={handleOpenBook}
                  className="flex-1 min-h-[52px] py-4 px-6 rounded-2xl gold-foil-button text-base sm:text-lg font-black flex items-center justify-center gap-2.5 shadow-xl cursor-pointer group hover:scale-[1.02] transition-transform"
                >
                  <BookOpen className="w-5 h-5 text-[#1A1423] group-hover:scale-110 transition-transform" />
                  <span>Create Custom Quest 📖</span>
                  <ArrowRight className="w-5 h-5 text-[#1A1423] group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    sound.playStarChime();
                    onNavigate('library');
                  }}
                  className="min-h-[52px] py-4 px-6 rounded-2xl bg-gradient-to-r from-teal-500/25 to-amber-500/25 hover:from-teal-500/40 hover:to-amber-500/40 border-2 border-teal-400/60 hover:border-amber-400 text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 shadow-xl cursor-pointer hover:scale-[1.02] transition-transform"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Explore 150 Books ✨</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Footer Options: Parent Dashboard Access */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#FFFDF7]/60 border-t border-[#333C6B]/40 pt-4 gap-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#FFD166]" />
              <span>Dyslexia-friendly typography • Segmented chapters • Comprehension mini-games</span>
            </div>

            <button
              onClick={() => {
                sound.playStarChime();
                onOpenParentGate();
              }}
              className="flex items-center gap-1.5 text-[#FFD166] hover:text-white font-bold hover:underline transition-colors cursor-pointer"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Parents & Teachers: View Progress & Analytics &rarr;</span>
            </button>
          </div>
        </StoryCard>
      </div>
    </div>
  );
};
