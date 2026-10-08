import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

export type TimeOfDay = 'morning' | 'evening' | 'night';
export type JapaneseClimate =
  | 'sakura_spring'
  | 'tsuyu_rain'
  | 'arashi_storm'
  | 'kaze_mountain_wind'
  | 'fuyu_snow';

export interface ClimatePreset {
  id: JapaneseClimate;
  name: string;
  japanese: string;
  icon: string;
  soundUrl: string;
  particleType: 'sakura' | 'rain' | 'storm' | 'wind' | 'snow';
  defaultTime: TimeOfDay;
  description: string;
  accentColor: string;
}

export const CLIMATE_PRESETS: ClimatePreset[] = [
  {
    id: 'sakura_spring',
    name: 'Sakura Breeze',
    japanese: '桜',
    icon: '🌸',
    soundUrl: '/audio/gentle_wind_petals.mp3',
    particleType: 'sakura',
    defaultTime: 'morning',
    description: 'Gentle spring wind carrying cherry blossom petals across ancient pagoda courtyards.',
    accentColor: '#F472B6',
  },
  {
    id: 'tsuyu_rain',
    name: 'Tsuyu Rain',
    japanese: '梅雨',
    icon: '🌧️',
    soundUrl: '/audio/japanese_gentle_rain.mp3',
    particleType: 'rain',
    defaultTime: 'evening',
    description: 'Calming early-summer plum rains pattering gently on cedar wood eaves.',
    accentColor: '#38BDF8',
  },
  {
    id: 'arashi_storm',
    name: 'Summer Tempest',
    japanese: '嵐',
    icon: '⛈️',
    soundUrl: '/audio/thunder_storm_ambient.mp3',
    particleType: 'storm',
    defaultTime: 'night',
    description: 'Heavy summer rain with rolling distant thunder and soft ambient lightning.',
    accentColor: '#A78BFA',
  },
  {
    id: 'kaze_mountain_wind',
    name: 'Mountain Wind',
    japanese: '風',
    icon: '🍃',
    soundUrl: '/audio/bamboo_wind.mp3',
    particleType: 'wind',
    defaultTime: 'morning',
    description: 'Whispering mountain gusts dancing through bamboo groves and stone paths.',
    accentColor: '#34D399',
  },
  {
    id: 'fuyu_snow',
    name: 'Silent Snow',
    japanese: '冬',
    icon: '❄️',
    soundUrl: '/audio/soft_winter_breeze.mp3',
    particleType: 'snow',
    defaultTime: 'night',
    description: 'Quiet, drifting Hokkaido snowfall dusting lanterns and enchanted rooftops.',
    accentColor: '#93C5FD',
  },
];

export interface MoodState {
  timeOfDay: TimeOfDay;
  climate: JapaneseClimate;
  isAutoTimeOfDay: boolean;
  ambientSoundEnabled: boolean;
  soundVolume: number; // 0 to 1
  isDucked: boolean;
  setTimeOfDay: (time: TimeOfDay) => void;
  setClimate: (climate: JapaneseClimate) => void;
  setIsAutoTimeOfDay: (auto: boolean) => void;
  setAmbientSoundEnabled: (enabled: boolean) => void;
  toggleAmbientSound: () => void;
  setSoundVolume: (volume: number) => void;
  setIsDucked: (ducked: boolean) => void;
  currentPreset: ClimatePreset;
}

const ThemeMoodContext = createContext<MoodState | null>(null);

const STORAGE_KEYS = {
  TIME_OF_DAY: 'story_teacher_time_of_day',
  CLIMATE: 'story_teacher_climate',
  AUTO_TIME: 'story_teacher_auto_time',
  SOUND_ENABLED: 'story_teacher_ambient_sound_enabled',
  VOLUME: 'story_teacher_sound_volume',
};

// Calculate time of day based on current hour
export const getLocalTimeOfDay = (): TimeOfDay => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 17) return 'morning'; // 5:00 AM - 4:59 PM
  if (hour >= 17 && hour < 21) return 'evening'; // 5:00 PM - 8:59 PM
  return 'night'; // 9:00 PM - 4:59 AM
};

export const ThemeMoodProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAutoTimeOfDay, setIsAutoTimeOfDayState] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.AUTO_TIME);
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  const [timeOfDay, setTimeOfDayState] = useState<TimeOfDay>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TIME_OF_DAY);
      if (saved === 'morning' || saved === 'evening' || saved === 'night') {
        return saved;
      }
    } catch {
      // ignore
    }
    return getLocalTimeOfDay();
  });

  const [climate, setClimateState] = useState<JapaneseClimate>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CLIMATE);
      if (
        saved === 'sakura_spring' ||
        saved === 'tsuyu_rain' ||
        saved === 'arashi_storm' ||
        saved === 'kaze_mountain_wind' ||
        saved === 'fuyu_snow'
      ) {
        return saved;
      }
    } catch {
      // ignore
    }
    return 'sakura_spring';
  });

  const [ambientSoundEnabled, setAmbientSoundEnabledState] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SOUND_ENABLED);
      return saved !== null ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });

  const [soundVolume, setSoundVolumeState] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.VOLUME);
      if (saved !== null) {
        const val = parseFloat(saved);
        if (!isNaN(val) && val >= 0 && val <= 1) return val;
      }
    } catch {
      // ignore
    }
    return 0.45;
  });

  const [isDucked, setIsDucked] = useState<boolean>(false);

  // Periodically check local time if auto mode is enabled
  useEffect(() => {
    if (!isAutoTimeOfDay) return;
    const updateTime = () => {
      const current = getLocalTimeOfDay();
      setTimeOfDayState(current);
    };
    updateTime();
    const interval = setInterval(updateTime, 60 * 1000); // Check every minute
    return () => clearInterval(interval);
  }, [isAutoTimeOfDay]);

  // Sync to root element dataset & attributes
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      root.setAttribute('data-time-of-day', timeOfDay);
      root.setAttribute('data-climate', climate);
    }
  }, [timeOfDay, climate]);

  const setTimeOfDay = useCallback((time: TimeOfDay) => {
    setIsAutoTimeOfDayState(false);
    setTimeOfDayState(time);
    try {
      localStorage.setItem(STORAGE_KEYS.TIME_OF_DAY, time);
      localStorage.setItem(STORAGE_KEYS.AUTO_TIME, JSON.stringify(false));
    } catch {
      // ignore
    }
  }, []);

  const setIsAutoTimeOfDay = useCallback((auto: boolean) => {
    setIsAutoTimeOfDayState(auto);
    try {
      localStorage.setItem(STORAGE_KEYS.AUTO_TIME, JSON.stringify(auto));
    } catch {
      // ignore
    }
    if (auto) {
      const current = getLocalTimeOfDay();
      setTimeOfDayState(current);
      try {
        localStorage.setItem(STORAGE_KEYS.TIME_OF_DAY, current);
      } catch {
        // ignore
      }
    }
  }, []);

  const setClimate = useCallback((c: JapaneseClimate) => {
    setClimateState(c);
    try {
      localStorage.setItem(STORAGE_KEYS.CLIMATE, c);
    } catch {
      // ignore
    }
  }, []);

  const setAmbientSoundEnabled = useCallback((enabled: boolean) => {
    setAmbientSoundEnabledState(enabled);
    try {
      localStorage.setItem(STORAGE_KEYS.SOUND_ENABLED, JSON.stringify(enabled));
    } catch {
      // ignore
    }
  }, []);

  const toggleAmbientSound = useCallback(() => {
    setAmbientSoundEnabledState((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(STORAGE_KEYS.SOUND_ENABLED, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  const setSoundVolume = useCallback((vol: number) => {
    const clamped = Math.max(0, Math.min(1, vol));
    setSoundVolumeState(clamped);
    try {
      localStorage.setItem(STORAGE_KEYS.VOLUME, String(clamped));
    } catch {
      // ignore
    }
  }, []);

  const currentPreset = useMemo(() => {
    return CLIMATE_PRESETS.find((p) => p.id === climate) || CLIMATE_PRESETS[0];
  }, [climate]);

  const value = useMemo(
    () => ({
      timeOfDay,
      climate,
      isAutoTimeOfDay,
      ambientSoundEnabled,
      soundVolume,
      isDucked,
      setTimeOfDay,
      setClimate,
      setIsAutoTimeOfDay,
      setAmbientSoundEnabled,
      toggleAmbientSound,
      setSoundVolume,
      setIsDucked,
      currentPreset,
    }),
    [
      timeOfDay,
      climate,
      isAutoTimeOfDay,
      ambientSoundEnabled,
      soundVolume,
      isDucked,
      setTimeOfDay,
      setClimate,
      setIsAutoTimeOfDay,
      setAmbientSoundEnabled,
      toggleAmbientSound,
      setSoundVolume,
      currentPreset,
    ]
  );

  return <ThemeMoodContext.Provider value={value}>{children}</ThemeMoodContext.Provider>;
};

export const useThemeMood = (): MoodState => {
  const context = useContext(ThemeMoodContext);
  if (!context) {
    throw new Error('useThemeMood must be used within a ThemeMoodProvider');
  }
  return context;
};
