export type AvatarId =
  | 'starlight_wizard'
  | 'forest_elf'
  | 'baby_dragon'
  | 'sky_explorer'
  | 'ocean_mermaid'
  | 'scholar_owl'
  | 'stargazer'
  | 'faun_sprite'
  | 'magic_unicorn'
  | 'cosmic_sorceress'
  | 'celestial_fox'
  | 'brave_knight'
  | 'leo'
  | 'mei'
  | 'chloe'
  | 'arjun'
  | 'amara'
  | 'ruby'
  | 'sam'
  | 'aria'
  | 'maya'
  | 'pip'
  | 'barnaby'
  | 'orion'
  | 'celeste'
  | string;

export type CharacterAction = 'idle' | 'sayHi' | 'turnaround' | 'celebrate' | 'thinking';

export type AgeGroup = '6-8' | '9-10' | '11-12';

export type WorldThemeId = 'tree_kingdom' | 'cosmic_quest' | 'detective_guild' | 'ocean_whispers';

export interface AvatarOption {
  id: string;
  name: string;
  title: string;
  category: 'hero' | 'companion' | 'creature';
  speechBubble: string;
  accentColor: string;
  badgeIcon: string;
  description?: string;
  skinTone?: string;
  hairColor?: string;
  shirtColor?: string;
  hasGlasses?: boolean;
  glassesColor?: string;
  accessory?: string;
}

export interface ConceptDefinition {
  word: string;
  phonics: string;
  definition: string;
  analogy: string;
  icon: string;
}

export interface StoryChapter {
  id: number;
  chapterNumber: number;
  title: string;
  sceneIllustration: string; // SVG or scenic description
  illustrationAlt: string;
  text: string;
  highlightedKeywords: Record<string, ConceptDefinition>;
}

export interface WordPuzzle {
  id: string;
  targetWord: string;
  scrambledLetters: string[];
  riddleClue: string;
  educationalMeaning: string;
  conceptCategory: string;
}

export interface VisualOption {
  id: string;
  label: string;
  subLabel?: string;
  visualValue?: string | number;
  isCorrect: boolean;
}

export interface QuizQuestion {
  id: string;
  scenarioText: string;
  questionPrompt: string;
  visualType: 'fraction_pie' | 'science_lab' | 'gravity_drop' | 'water_cycle' | 'concept_balance';
  visualHintText?: string;
  options: VisualOption[];
  characterClueOnMistake: string;
  conceptExplanation: string;
  conceptSkillTested: string;
}

export interface Badge {
  id: string;
  title: string;
  icon: string;
  color: string;
  description: string;
  dateEarned?: string;
}

export interface Story {
  id: string;
  topic: string;
  title: string;
  theme: WorldThemeId;
  targetAge: AgeGroup;
  estimatedMinutes: number;
  coverBlurb: string;
  badge: Badge;
  chapters: StoryChapter[];
  wordPuzzles: WordPuzzle[];
  quizQuestions: QuizQuestion[];
  conversationStarters: [string, string];
  parentDiagnosis: {
    masteredSkills: string[];
    growthAreas: string[];
    homeActivityIdea: string;
  };
}

export interface CompletedStoryRecord {
  id: string;
  storyId: string;
  topic: string;
  title: string;
  badgeTitle: string;
  badgeIcon: string;
  completedAt: string;
  score: number;
  totalQuestions: number;
  wordsMastered: number;
  stars: number; // 3 to 5
  timeSpentSeconds: number;
  ageAtCompletion: number;
  masteredSkills: string[];
  growthAreas: string[];
  conversationStarters: [string, string];
}

export interface ChildProfile {
  name: string;
  avatar: AvatarId;
  age: number;
  ageGroup: AgeGroup;
  readingMode: 'read_to_me' | 'read_myself';
  totalStars: number;
  earnedBadges: Badge[];
  history: CompletedStoryRecord[];
}

export type ScreenState =
  | 'landing'
  | 'story_config'
  | 'reader'
  | 'word_scramble'
  | 'quiz'
  | 'reward'
  | 'library'
  | 'badges'
  | 'parent_dashboard';
