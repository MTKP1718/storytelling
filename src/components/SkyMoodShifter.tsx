import React, { useState, useEffect, useRef } from 'react';
import {
  Sun,
  Sunset,
  Moon,
  Volume2,
  VolumeX,
  Clock,
  Sparkles,
  Bell,
  X,
  Sliders,
} from 'lucide-react';
import { useThemeMood, CLIMATE_PRESETS } from '../context/ThemeMoodContext';
import type { TimeOfDay, JapaneseClimate } from '../context/ThemeMoodContext';
import { ambientAudio } from '../utils/ambientAudio';
import { sound } from '../utils/audio';

export const SkyMoodShifter: React.FC = () => {
  const {
    timeOfDay,
    climate,
    isAutoTimeOfDay,
    ambientSoundEnabled,
    soundVolume,
    setTimeOfDay,
    setClimate,
    setIsAutoTimeOfDay,
    toggleAmbientSound,
    setSoundVolume,
    currentPreset,
  } = useThemeMood();

  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement | null>(null);

  // Sync Audio Engine with Context State
  useEffect(() => {
    if (ambientSoundEnabled) {
      ambientAudio.play(climate);
      ambientAudio.setVolume(soundVolume);
    } else {
      ambientAudio.stop();
    }
  }, [ambientSoundEnabled, climate]);

  useEffect(() => {
    ambientAudio.setVolume(soundVolume);
  }, [soundVolume]);

  // Click outside to close popover
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const timeOptions: { id: TimeOfDay; label: string; japanese: string; icon: typeof Sun }[] = [
    { id: 'morning', label: 'Morning', japanese: '朝', icon: Sun },
    { id: 'evening', label: 'Evening', japanese: '夕方', icon: Sunset },
    { id: 'night', label: 'Night', japanese: '夜', icon: Moon },
  ];

  const handleSelectTime = (t: TimeOfDay) => {
    sound.playTilePlace();
    setTimeOfDay(t);
  };

  const handleSelectClimate = (c: JapaneseClimate) => {
    sound.playStarChime(1.2);
    setClimate(c);
  };

  const handleRingBell = () => {
    sound.playStarChime(0.9);
    ambientAudio.ringTempleBell(0.65);
  };

  const getTimeIcon = () => {
    switch (timeOfDay) {
      case 'morning':
        return <Sun className="w-3.5 h-3.5 text-amber-300" />;
      case 'evening':
        return <Sunset className="w-3.5 h-3.5 text-orange-400" />;
      case 'night':
      default:
        return <Moon className="w-3.5 h-3.5 text-indigo-300" />;
    }
  };

  return (
    <div className="relative" ref={popoverRef}>
      {/* Floating Pill Trigger in Navbar */}
      <button
        type="button"
        onClick={() => {
          sound.playTilePlace();
          setIsOpen((prev) => !prev);
        }}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border shadow-sm ${
          isOpen
            ? 'bg-gradient-to-r from-[#5B42F3]/40 to-[#FFD166]/30 border-[#FFD166] text-[#FFD166] ring-2 ring-[#FFD166]/40 scale-102'
            : 'bg-[#151930]/90 hover:bg-[#1E2447] border-[#333C6B] text-[#FFFDF7]/90 hover:border-[#FFD166]/50'
        }`}
        title="Open Sky & Mood Shifter"
      >
        {/* Climate Icon */}
        <span className="text-sm">{currentPreset.icon}</span>

        {/* Time Icon & Label */}
        <div className="hidden sm:flex items-center gap-1">
          {getTimeIcon()}
          <span className="capitalize">{timeOfDay}</span>
        </div>

        {/* Ambient Sound Indicator */}
        <div className="flex items-center gap-1 pl-1 border-l border-white/10">
          {ambientSoundEnabled ? (
            <div className="flex items-center gap-0.5" title="Nature Sound Playing">
              <span className="w-1 h-2 bg-[#2EC4B6] rounded-full animate-pulse" />
              <span className="w-1 h-3.5 bg-[#FFD166] rounded-full animate-pulse delay-75" />
              <span className="w-1 h-2 bg-[#2EC4B6] rounded-full animate-pulse delay-150" />
            </div>
          ) : (
            <VolumeX className="w-3 h-3 text-gray-400" />
          )}
        </div>
      </button>

      {/* Floating Sky & Mood Shifter Popover Card */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2.5 w-80 sm:w-96 rounded-3xl p-5 bg-[#14182E]/95 backdrop-blur-2xl border-2 border-[#FFD166]/40 shadow-[0_15px_40px_rgba(0,0,0,0.5)] z-50 animate-scale-up text-[#FFFDF7]">
          {/* Card Header */}
          <div className="flex items-center justify-between pb-3.5 border-b border-[#333C6B]/60 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#5B42F3] to-[#FFD166] flex items-center justify-center text-sm shadow-md">
                <span>⛩️</span>
              </div>
              <div>
                <h3 className="font-storybook text-sm font-bold text-[#FFD166] flex items-center gap-1.5">
                  <span>Sky & Mood Shifter</span>
                  <span className="text-[10px] text-[#2EC4B6] font-mono">(天候 & 気分)</span>
                </h3>
                <p className="text-[10px] text-[#FFFDF7]/70">
                  Japanese climates & living soundscapes
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="w-7 h-7 rounded-lg bg-[#242A4A] hover:bg-[#333C6B] text-[#FFFDF7]/70 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Section 1: Time of Day (時刻) */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-[11px] font-bold text-[#FFD166] uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3 h-3 text-[#FFD166]" />
                <span>Time of Day (時刻):</span>
              </label>

              {/* Auto Clock Sync Toggle */}
              <button
                type="button"
                onClick={() => {
                  sound.playTilePlace();
                  setIsAutoTimeOfDay(!isAutoTimeOfDay);
                }}
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border transition-all cursor-pointer ${
                  isAutoTimeOfDay
                    ? 'bg-[#2EC4B6]/20 border-[#2EC4B6] text-[#2EC4B6]'
                    : 'bg-[#151930] border-[#333C6B] text-gray-400 hover:text-white'
                }`}
              >
                {isAutoTimeOfDay ? '● Auto Real-Time' : '○ Manual Time'}
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {timeOptions.map((opt) => {
                const Icon = opt.icon;
                const isSelected = timeOfDay === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleSelectTime(opt.id)}
                    className={`p-2.5 rounded-2xl flex flex-col items-center gap-1 border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-gradient-to-b from-[#5B42F3]/40 to-[#1B1F38] border-[#FFD166] text-[#FFD166] shadow-md ring-2 ring-[#FFD166]/30 scale-102'
                        : 'bg-[#0D1020]/80 border-[#333C6B]/60 text-[#FFFDF7]/80 hover:bg-[#1C2140] hover:border-[#FFD166]/40'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-xs font-bold">{opt.label}</span>
                    <span className="text-[10px] opacity-60 font-mono">{opt.japanese}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Japanese Climate Seasons (日本の気候) */}
          <div className="mb-4">
            <label className="block text-[11px] font-bold text-[#FFD166] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-[#FFD166]" />
              <span>Climate Season (季節 & 天候):</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-44 overflow-y-auto pr-1">
              {CLIMATE_PRESETS.map((preset) => {
                const isSelected = climate === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleSelectClimate(preset.id)}
                    className={`p-2.5 rounded-2xl text-left border transition-all cursor-pointer flex items-center gap-2.5 ${
                      isSelected
                        ? 'bg-gradient-to-r from-[#241A47] to-[#1E2447] border-[#FFD166] shadow-md ring-2 ring-[#FFD166]/40 scale-102'
                        : 'bg-[#0D1020]/80 border-[#333C6B]/60 hover:border-[#FFD166]/40 hover:bg-[#1C2140]'
                    }`}
                  >
                    <span className="text-2xl shrink-0">{preset.icon}</span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-bold text-[#FFFDF7] truncate">
                          {preset.name}
                        </span>
                        <span className="text-[10px] text-[#2EC4B6] font-mono shrink-0">
                          {preset.japanese}
                        </span>
                      </div>
                      <p className="text-[9px] text-[#FFFDF7]/60 truncate">
                        {preset.particleType}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: Nature Soundscape Controller (自然の音) */}
          <div className="p-3.5 rounded-2xl bg-[#0D1020]/90 border border-[#333C6B]">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[11px] font-bold text-[#FFD166] uppercase tracking-wider flex items-center gap-1.5">
                <Sliders className="w-3 h-3 text-[#FFD166]" />
                <span>Nature Soundscape</span>
              </span>

              {/* Sound ON/OFF Toggle */}
              <button
                type="button"
                onClick={() => {
                  sound.playTilePlace();
                  toggleAmbientSound();
                }}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold transition-all cursor-pointer border ${
                  ambientSoundEnabled
                    ? 'bg-[#2EC4B6] text-[#0D1020] border-[#2EC4B6] shadow-sm'
                    : 'bg-[#151930] text-gray-400 border-[#333C6B] hover:text-white'
                }`}
              >
                {ambientSoundEnabled ? (
                  <>
                    <Volume2 className="w-3 h-3" />
                    <span>ON</span>
                  </>
                ) : (
                  <>
                    <VolumeX className="w-3 h-3" />
                    <span>OFF</span>
                  </>
                )}
              </button>
            </div>

            {/* Volume Slider */}
            <div className="flex items-center gap-2.5 mb-2.5">
              <Volume2 className="w-3.5 h-3.5 text-[#2EC4B6] shrink-0" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={soundVolume}
                onChange={(e) => setSoundVolume(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-[#242A4A] rounded-lg appearance-none cursor-pointer accent-[#FFD166]"
              />
              <span className="text-[10px] font-mono text-[#FFD166] font-bold w-8 text-right">
                {Math.round(soundVolume * 100)}%
              </span>
            </div>

            {/* Temple Bell Chime Action */}
            <button
              type="button"
              onClick={handleRingBell}
              className="w-full py-1.5 px-3 rounded-xl bg-[#242A4A] hover:bg-[#333C6B] border border-[#FFD166]/30 hover:border-[#FFD166] text-[#FFD166] text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <Bell className="w-3.5 h-3.5" />
              <span>Ring Temple Bell (梵鐘)</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
