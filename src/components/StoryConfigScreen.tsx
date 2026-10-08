import React, { useState } from 'react';
import {
  Sparkles,
  BookOpen,
  Volume2,
  Eye,
  Key,
  Compass,
  TreePine,
  Rocket,
  Search,
  Waves,
  Wand2,
  ChevronDown,
  ChevronUp,
  Flame,
  ArrowLeft,
  Check,
} from 'lucide-react';
import type { ChildProfile, Story, WorldThemeId, ScreenState } from '../types';
import { MOCK_STORIES } from '../data/mockStories';
import { generateStoryWithAI } from '../utils/aiStoryGenerator';
import { sound } from '../utils/audio';
import { StoryCard } from './StoryCard';
import { AnimatedCharacter } from './AnimatedCharacter';

interface StoryConfigScreenProps {
  childProfile: ChildProfile;
  onSelectStory: (story: Story) => void;
  onNavigate: (screen: ScreenState) => void;
  onUpdateReadingMode: (mode: 'read_to_me' | 'read_myself') => void;
}

const PRESET_TOPICS = [
  {
    topic: 'Fractions & Equal Parts',
    icon: '🍕',
    subject: 'Math',
    desc: 'Fair sharing, numerators, denominators, and halving the royal pie.',
    defaultTheme: 'tree_kingdom' as const,
    mockId: 'fractions-halves',
  },
  {
    topic: 'Photosynthesis & Solar Plants',
    icon: '🍃',
    subject: 'Biology',
    desc: 'How leaves use sunlight, water, and air to cook food and oxygen.',
    defaultTheme: 'tree_kingdom' as const,
    mockId: 'photosynthesis-leaves',
  },
  {
    topic: 'Gravity & The Invisible Pull',
    icon: '🍎',
    subject: 'Physics',
    desc: 'Why dropped apples tumble down and how planets orbit the sun.',
    defaultTheme: 'cosmic_quest' as const,
    mockId: 'gravity-space',
  },
  {
    topic: 'The Water Cycle & Weather',
    icon: '💧',
    subject: 'Earth Science',
    desc: 'The journey of evaporation into vapor, clouds, and rainfall.',
    defaultTheme: 'ocean_whispers' as const,
    mockId: 'water-cycle',
  },
  {
    topic: 'Addition with Regrouping',
    icon: '➕',
    subject: 'Math',
    desc: 'Carrying bundles of ten to build tall magical towers.',
    defaultTheme: 'detective_guild' as const,
  },
  {
    topic: 'The Secret of Ancient Pyramids',
    icon: '🏛️',
    subject: 'History & Geometry',
    desc: 'Triangles, stability, levers, and architectural marvels.',
    defaultTheme: 'tree_kingdom' as const,
  },
];

const THEMES: {
  id: WorldThemeId;
  name: string;
  tagline: string;
  icon: React.ReactNode;
  bgGradient: string;
  borderColor: string;
  features: string;
}[] = [
  {
    id: 'tree_kingdom',
    name: 'The Enchanted Tree Kingdom',
    tagline: 'Ancient hollow oaks, talking woodland animals & glowing moss',
    icon: <TreePine className="w-6 h-6 text-[#2EC4B6]" />,
    bgGradient: 'from-[#19322D] to-[#12221F]',
    borderColor: 'border-[#2EC4B6]',
    features: 'Hollow oak doors • Glowing mushrooms • Animal sages',
  },
  {
    id: 'cosmic_quest',
    name: 'Cosmic Starlight Quest',
    tagline: 'Constellations, asteroid gliders & weightless gravity gardens',
    icon: <Rocket className="w-6 h-6 text-[#7E69FF]" />,
    bgGradient: 'from-[#231A47] to-[#161033]',
    borderColor: 'border-[#7E69FF]',
    features: 'Starlight scrolls • Orbiting rings • Moon gravity',
  },
  {
    id: 'detective_guild',
    name: 'Detective Mystery Guild',
    tagline: 'Victorian cobblestones, magnifying glasses & clue scrolls',
    icon: <Search className="w-6 h-6 text-[#FF9F68]" />,
    bgGradient: 'from-[#3A281E] to-[#241A14]',
    borderColor: 'border-[#FF9F68]',
    features: 'Lantern-lit streets • Riddle libraries • Brass gear clocks',
  },
  {
    id: 'ocean_whispers',
    name: 'Ocean Whispers',
    tagline: 'Luminescent coral citadels, bubble currents & singing tides',
    icon: <Waves className="w-6 h-6 text-[#2EC4B6]" />,
    bgGradient: 'from-[#14303B] to-[#0D1E26]',
    borderColor: 'border-[#2EC4B6]',
    features: 'Pearl palaces • Bioluminescent fish • Ocean tide songs',
  },
];

export const StoryConfigScreen: React.FC<StoryConfigScreenProps> = ({
  childProfile,
  onSelectStory,
  onNavigate,
  onUpdateReadingMode,
}) => {
  const [selectedTopic, setSelectedTopic] = useState('Fractions & Equal Parts');
  const [customTopicInput, setCustomTopicInput] = useState('');
  const [selectedTheme, setSelectedTheme] = useState<WorldThemeId>('tree_kingdom');
  const [readingMode, setReadingMode] = useState<'read_to_me' | 'read_myself'>(
    childProfile.readingMode || 'read_to_me'
  );
  const [apiKey, setApiKey] = useState('');
  const [showApiKeySettings, setShowApiKeySettings] = useState(false);
  const [isWeaving, setIsWeaving] = useState(false);
  const [weavingStep, setWeavingStep] = useState('');

  const activeTopic = customTopicInput.trim() || selectedTopic;
  const currentThemeObj = THEMES.find((t) => t.id === selectedTheme) || THEMES[0];

  const handleStartStory = async () => {
    sound.playStarChime();
    setIsWeaving(true);
    setWeavingStep('Consulting the ancient storybook scrolls...');

    // Check if the topic matches one of our rich pre-crafted mock stories directly
    const matchingMock = MOCK_STORIES.find(
      (m) =>
        m.topic.toLowerCase() === activeTopic.toLowerCase() ||
        (m.id === 'fractions-halves' && activeTopic.includes('Fraction')) ||
        (m.id === 'photosynthesis-leaves' && activeTopic.includes('Photosynthesis')) ||
        (m.id === 'gravity-space' && activeTopic.includes('Gravity')) ||
        (m.id === 'water-cycle' && activeTopic.includes('Water'))
    );

    if (matchingMock && !apiKey.trim() && !customTopicInput.trim()) {
      setTimeout(() => {
        setWeavingStep('Illuminating the pages with golden ink...');
      }, 500);

      setTimeout(() => {
        setIsWeaving(false);
        sound.playPageFlip();
        onSelectStory(matchingMock);
        onNavigate('reader');
      }, 1100);
      return;
    }

    // Dynamic AI or procedural story synthesis
    try {
      setTimeout(() => {
        setWeavingStep(`Weaving ${childProfile.name}'s quest into ${selectedTheme}...`);
      }, 400);

      const generated = await generateStoryWithAI({
        topic: activeTopic,
        theme: selectedTheme,
        age: childProfile.ageGroup,
        childName: childProfile.name || 'Young Scholar',
        apiKey: apiKey.trim(),
      });

      setIsWeaving(false);
      sound.playPageFlip();
      onSelectStory(generated);
      onNavigate('reader');
    } catch (err) {
      console.error(err);
      setIsWeaving(false);
      // Fallback to default
      onSelectStory(MOCK_STORIES[0]);
      onNavigate('reader');
    }
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pt-4 sm:pt-6 z-10 flex flex-col gap-10 sm:gap-12 selection:bg-amber-400 selection:text-slate-950">
      {/* Weaving Story Loading Overlay */}
      {isWeaving && (
        <div className="fixed inset-0 z-50 bg-[#101426]/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-fade-in">
          <div className="relative w-32 h-32 mb-6 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#FFD166] to-[#5B42F3] animate-spin blur-lg opacity-80" />
            <div className="w-28 h-28 rounded-full bg-[#1B1F38] border-2 border-[#FFD166] flex items-center justify-center relative z-10 shadow-2xl">
              <Wand2 className="w-12 h-12 text-[#FFD166] animate-bounce" />
            </div>
          </div>
          <h2 className="font-storybook text-3xl sm:text-4xl font-extrabold text-white mb-3">
            Weaving Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-rose-300 to-teal-300">Enchanted Tale...</span>
          </h2>
          <p className="text-lg sm:text-xl text-white/90 font-semibold max-w-md animate-pulse">
            {weavingStep}
          </p>
          <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-400/40 text-xs font-black uppercase tracking-wider">
            <span>Adapting concepts for Age {childProfile.age} ({childProfile.ageGroup})</span>
          </div>
        </div>
      )}

      {/* Screen Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 pb-6 border-b border-[#333C6B]/60">
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-400/25 to-rose-400/20 border border-amber-400/60 text-amber-300 text-xs sm:text-sm font-black uppercase tracking-wider mb-3 shadow-lg">
            <Wand2 className="w-4 h-4 text-amber-300" />
            <span>Step 2 of 4: Craft Your Quest</span>
          </div>
          <h1 className="font-storybook text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight drop-shadow-md">
            Choose Your{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-rose-300 to-teal-300">
              Magical Tale
            </span>
          </h1>
          <p className="text-base sm:text-lg text-white/85 mt-2 max-w-2xl font-medium leading-relaxed">
            Transform any school topic or curiosity into an illustrated bedtime or classroom adventure.
          </p>
        </div>

        <div className="flex items-center gap-3.5 bg-[#1A1F3C] px-5 py-3 rounded-2xl border border-[#333C6B] shadow-xl self-start sm:self-auto">
          <div className="text-right">
            <p className="text-xs text-teal-300 font-black uppercase tracking-wider">Adventurer</p>
            <p className="font-storybook text-base sm:text-lg font-bold text-white">{childProfile.name || 'Hero'}</p>
          </div>
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-amber-400 to-rose-400 text-slate-950 font-black flex items-center justify-center text-sm shadow-md border border-white/20">
            {childProfile.age}y
          </div>
        </div>
      </div>

      {/* SECTION 1: ✨ 1. Learning Topic */}
      <StoryCard
        variant="glass"
        badge="✨ 1. Learning Topic"
        badgeIcon={<Sparkles className="w-4 h-4 text-amber-300" />}
        className="p-6 sm:p-8 mt-2 relative overflow-visible"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h2 className="font-storybook text-xl sm:text-2xl font-extrabold text-white leading-tight flex items-center gap-2.5">
              <span>Select or Type School Concept</span>
            </h2>
            <p className="text-sm text-white/70 mt-1 font-medium">
              Choose from curated curriculum topics or type any custom concept.
            </p>
          </div>
          <span className="self-start sm:self-auto text-xs font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-400/40 shadow-sm">
            6 Presets Available
          </span>
        </div>

        {/* Presets Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mb-6">
          {PRESET_TOPICS.map((preset) => {
            const isSelected = selectedTopic === preset.topic && !customTopicInput;
            return (
              <button
                key={preset.topic}
                type="button"
                onClick={() => {
                  sound.playTilePlace();
                  setSelectedTopic(preset.topic);
                  setCustomTopicInput('');
                  if (preset.defaultTheme) setSelectedTheme(preset.defaultTheme);
                }}
                className={`min-h-[96px] text-left p-5 sm:p-6 rounded-3xl transition-all cursor-pointer relative flex flex-col justify-between ${
                  isSelected
                    ? 'bg-gradient-to-br from-[#242A4E] to-[#151933] border-2 border-amber-400 ring-2 ring-amber-400/50 shadow-2xl scale-[1.02]'
                    : 'bg-[#151933]/90 hover:bg-[#1B2040] border border-[#333C6B]/70 hover:border-amber-400/50 shadow-xl hover:shadow-2xl'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span className="text-3xl sm:text-4xl drop-shadow-md">{preset.icon}</span>
                    <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-400/40">
                      {preset.subject}
                    </span>
                  </div>
                  <h3 className="font-storybook text-base sm:text-lg font-bold text-white mb-2 leading-snug">
                    {preset.topic}
                  </h3>
                  <p className="text-xs sm:text-sm text-white/70 line-clamp-2 leading-relaxed font-medium">
                    {preset.desc}
                  </p>
                </div>

                {isSelected && (
                  <div className="mt-3 flex items-center gap-1.5 text-xs font-black text-amber-300">
                    <Check className="w-4 h-4 text-amber-300" />
                    <span>Selected Topic</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Custom Input */}
        <div className="p-5 sm:p-6 rounded-2xl bg-[#0D1020]/90 border-2 border-[#333C6B] flex flex-col md:flex-row items-stretch md:items-center gap-4 shadow-inner">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-black text-amber-300 uppercase tracking-wider whitespace-nowrap">
            <Flame className="w-4 h-4 text-amber-400" />
            <span>Or Custom Concept:</span>
          </div>
          <input
            type="text"
            value={customTopicInput}
            onChange={(e) => setCustomTopicInput(e.target.value)}
            placeholder="e.g. Volcanoes, Long Division, Ancient Egypt, Roman Aqueducts, Mitosis..."
            className="flex-1 w-full min-h-[52px] sm:min-h-[56px] px-5 py-3.5 rounded-xl bg-[#151933] border-2 border-[#333C6B] focus:border-amber-400 text-base text-white font-medium placeholder:text-white/40 outline-none transition-all shadow-md"
          />
        </div>
      </StoryCard>

      {/* SECTION 2: 🧭 2. World & Realm */}
      <StoryCard
        variant="glass"
        badge="🧭 2. World & Realm"
        badgeIcon={<Compass className="w-4 h-4 text-amber-300" />}
        className="p-6 sm:p-8 mt-2 relative overflow-visible"
      >
        <div className="mb-6">
          <h2 className="font-storybook text-xl sm:text-2xl font-extrabold text-white leading-tight mb-1">
            Choose the Fairy Tale Setting:
          </h2>
          <p className="text-sm text-white/70 font-medium">
            Select the magical world where this educational adventure takes place.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 mb-6">
          {THEMES.map((theme) => {
            const isSelected = selectedTheme === theme.id;
            return (
              <button
                key={theme.id}
                type="button"
                onClick={() => {
                  sound.playTilePlace();
                  setSelectedTheme(theme.id);
                }}
                className={`min-h-[110px] text-left p-5 sm:p-6 rounded-3xl transition-all cursor-pointer relative bg-gradient-to-br ${
                  theme.bgGradient
                } ${
                  isSelected
                    ? 'border-2 border-amber-400 ring-2 ring-amber-400/50 shadow-2xl scale-[1.01]'
                    : 'border border-[#333C6B]/70 hover:border-amber-400/50 opacity-90 hover:opacity-100 shadow-xl'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center shadow-md">
                      {theme.icon}
                    </div>
                    <h3 className="font-storybook text-base sm:text-lg font-bold text-white">
                      {theme.name}
                    </h3>
                  </div>
                  {isSelected && (
                    <span className="text-xs font-black uppercase tracking-wider text-amber-300 bg-amber-500/20 border border-amber-400/40 px-3 py-1 rounded-full shadow-sm">
                      Active Realm
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-white/85 mb-2.5 font-medium leading-relaxed">
                  {theme.tagline}
                </p>
                <p className="text-xs text-teal-300 font-bold">
                  {theme.features}
                </p>
              </button>
            );
          })}
        </div>

        {/* Optional Custom Gemini API Key Collapsible */}
        <div className="mt-6 border-t border-[#333C6B]/50 pt-5">
          <button
            type="button"
            onClick={() => setShowApiKeySettings(!showApiKeySettings)}
            className="min-h-[48px] px-3 py-2 rounded-xl flex items-center gap-2.5 text-xs sm:text-sm font-bold text-amber-300 hover:text-white transition-colors cursor-pointer"
          >
            <Key className="w-4 h-4 text-amber-400" />
            <span>Optional: Connect Custom Gemini AI Key (For Limitless Custom Topics)</span>
            {showApiKeySettings ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showApiKeySettings && (
            <div className="mt-3 p-5 rounded-2xl bg-[#0D1020]/90 border-2 border-[#333C6B] text-xs sm:text-sm shadow-inner">
              <p className="text-white/80 mb-3 leading-relaxed font-medium">
                Story Teacher works completely offline with our built-in fairy tales! If you have a Google Gemini API Key, enter it here to dynamically synthesize fairy tales on any imaginable topic.
              </p>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter Gemini API Key (e.g., AIzaSy...)"
                className="w-full min-h-[48px] px-4 py-3 rounded-xl bg-[#151933] border-2 border-[#333C6B] text-sm text-white font-semibold outline-none focus:border-amber-400 transition-all"
              />
            </div>
          )}
        </div>
      </StoryCard>

      {/* SECTION 3: 🧙 3. Your Quest Companion */}
      <StoryCard
        variant="accent"
        badge="🧙 3. Your Quest Companion"
        badgeIcon={<Sparkles className="w-4 h-4 text-amber-300" />}
        className="p-6 sm:p-8 mt-2 relative overflow-visible"
      >
        {/* Companion Overview Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center bg-[#151933]/90 rounded-3xl p-6 sm:p-8 border border-[#333C6B]/70 shadow-2xl mb-8">
          {/* Avatar Visual & Badge */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center text-center">
            <div className="avatar-sticker-container w-32 h-32 sm:w-40 sm:h-40 mb-3 shadow-xl">
              <AnimatedCharacter avatarId={childProfile.avatar} size="lg" emotion="happy" />
            </div>
            <h3 className="font-storybook text-xl sm:text-2xl font-extrabold text-white">
              {childProfile.name || 'Hero'} & Companion
            </h3>
            <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-teal-300 bg-teal-400/10 px-3 py-1 rounded-full border border-teal-400/30 inline-block mt-1 shadow-sm">
              Age {childProfile.age} • Level Explorer
            </span>
          </div>

          {/* Speech Bubble & Active Summary */}
          <div className="lg:col-span-8 flex flex-col justify-between">
            <div className="p-5 sm:p-6 rounded-2xl bg-[#0D1020]/90 border-2 border-amber-400/40 shadow-xl mb-4 relative">
              <div className="text-xs sm:text-sm font-black text-amber-300 uppercase tracking-wider mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Companion's Personal Quest Message:</span>
              </div>
              <p className="font-storybook text-base sm:text-lg font-bold text-white leading-relaxed italic">
                "I packed my spellbook and I'm ready to explore <span className="text-amber-300 font-bold">"{activeTopic}"</span> with you in <span className="text-teal-300 font-bold">{currentThemeObj.name}</span>!"
              </p>
            </div>

            {/* Quest Configuration Pill Summary */}
            <div className="p-4 rounded-xl bg-[#1A1F3C] border border-[#333C6B] flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <span className="text-white/60 font-semibold">Concept:</span>
                <span className="text-white font-bold">{activeTopic}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-white/60 font-semibold">Realm:</span>
                <span className="text-teal-300 font-bold">{currentThemeObj.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-white/60 font-semibold">Target:</span>
                <span className="text-amber-300 font-bold">Ages {childProfile.ageGroup}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Reading Mode & Pedagogical Profile Subgrid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-3xl bg-[#0D1020]/90 border border-[#333C6B]/70 mb-8 shadow-inner">
          {/* Reading Mode Selector */}
          <div>
            <h3 className="text-xs sm:text-sm font-black text-amber-300 uppercase tracking-wider mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-amber-300" />
              <span>Select Reading Style:</span>
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  sound.playTilePlace();
                  setReadingMode('read_to_me');
                  onUpdateReadingMode('read_to_me');
                }}
                className={`min-h-[64px] flex flex-col items-center justify-center text-center p-3.5 rounded-2xl border-2 transition-all cursor-pointer ${
                  readingMode === 'read_to_me'
                    ? 'bg-amber-400 text-slate-950 font-black border-2 border-amber-300 shadow-xl scale-[1.02]'
                    : 'bg-[#1A1F3C] border-[#333C6B] text-white/80 hover:text-white hover:bg-[#22284D]'
                }`}
              >
                <Volume2 className={`w-6 h-6 mb-1 ${readingMode === 'read_to_me' ? 'text-slate-950' : 'text-amber-300'}`} />
                <span className="text-xs sm:text-sm font-black">Read to Me</span>
                <span className={`text-[11px] font-bold ${readingMode === 'read_to_me' ? 'text-slate-900' : 'text-teal-300'}`}>Aloud Narration</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  sound.playTilePlace();
                  setReadingMode('read_myself');
                  onUpdateReadingMode('read_myself');
                }}
                className={`min-h-[64px] flex flex-col items-center justify-center text-center p-3.5 rounded-2xl border-2 transition-all cursor-pointer ${
                  readingMode === 'read_myself'
                    ? 'bg-amber-400 text-slate-950 font-black border-2 border-amber-300 shadow-xl scale-[1.02]'
                    : 'bg-[#1A1F3C] border-[#333C6B] text-white/80 hover:text-white hover:bg-[#22284D]'
                }`}
              >
                <Eye className={`w-6 h-6 mb-1 ${readingMode === 'read_myself' ? 'text-slate-950' : 'text-teal-300'}`} />
                <span className="text-xs sm:text-sm font-black">I'll Read Solo</span>
                <span className={`text-[11px] font-bold ${readingMode === 'read_myself' ? 'text-slate-900' : 'text-white/60'}`}>Self-Paced</span>
              </button>
            </div>
          </div>

          {/* Pedagogical Age Profile Indicator */}
          <div>
            <h3 className="text-xs sm:text-sm font-black text-amber-300 uppercase tracking-wider mb-3">
              Pedagogical Profile:
            </h3>
            <div className="p-4 rounded-2xl bg-[#151933] border border-[#333C6B] text-xs sm:text-sm space-y-2">
              <div className="flex justify-between text-white font-bold">
                <span>Target: Ages {childProfile.ageGroup}</span>
                <span className="text-teal-300 font-bold">
                  {childProfile.ageGroup === '6-8'
                    ? '250–350 Words'
                    : childProfile.ageGroup === '9-10'
                    ? '400–550 Words'
                    : '600–750 Words'}
                </span>
              </div>
              <p className="text-white/75 text-xs leading-relaxed font-medium">
                {childProfile.ageGroup === '6-8' &&
                  'Concrete visual metaphors, gentle phonics, and recurring rhythm designed for beginning readers.'}
                {childProfile.ageGroup === '9-10' &&
                  'Cause-and-effect reasoning with core curriculum concepts framed as mystery runes.'}
                {childProfile.ageGroup === '11-12' &&
                  'Rich narrative tension requiring deduction of school principles to save the fairy tale kingdom.'}
              </p>
            </div>
          </div>
        </div>

        {/* Primary Action Button: Weave This Story */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#333C6B]/60">
          <button
            type="button"
            onClick={() => {
              sound.playTilePlace();
              onNavigate('landing');
            }}
            className="min-h-[48px] px-5 py-3 inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-white/70 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Character Selection</span>
          </button>

          <button
            type="button"
            onClick={handleStartStory}
            className="w-full sm:w-auto min-h-[58px] sm:min-h-[64px] px-10 py-5 rounded-2xl gold-foil-button text-lg sm:text-xl font-black flex items-center justify-center gap-3 shadow-2xl hover:scale-[1.02] transition-transform cursor-pointer"
          >
            <Sparkles className="w-6 h-6 text-[#1A1423]" />
            <span>Weave This Fairy Tale &rarr;</span>
          </button>
        </div>
      </StoryCard>
    </div>
  );
};
