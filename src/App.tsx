import { useState, useEffect } from 'react';
import type {
  ScreenState,
  ChildProfile,
  Story,
  CompletedStoryRecord,
  WorldThemeId,
  StoryChapter,
} from './types';
import { MOCK_STORIES } from './data/mockStories';
import { sound } from './utils/audio';
import { LivingBackground } from './components/LivingBackground';
import { Navbar } from './components/Navbar';
import { HeroLandingScreen } from './components/HeroLandingScreen';
import { StoryConfigScreen } from './components/StoryConfigScreen';
import { StoryReaderScreen } from './components/StoryReaderScreen';
import { WordScrambleGame } from './components/WordScrambleGame';
import { StoryQuizScreen } from './components/StoryQuizScreen';
import { RewardScreen } from './components/RewardScreen';
import { ParentDashboard } from './components/ParentDashboard';
import { PrintCertificateModal } from './components/PrintCertificateModal';
import { StoryWeaver150Collection } from './components/StoryWeaver150Collection';
import type { StoryWeaverBook } from './data/storyWeaver150Books';

const DEFAULT_PROFILE: ChildProfile = {
  name: 'Oliver',
  avatar: 'starlight_wizard',
  age: 8,
  ageGroup: '6-8',
  readingMode: 'read_to_me',
  totalStars: 5,
  earnedBadges: [MOCK_STORIES[0].badge],
  history: [],
};

export function App() {
  // Screen state
  const [currentScreen, setCurrentScreen] = useState<ScreenState>('landing');
  // Active story
  const [currentStory, setCurrentStory] = useState<Story>(MOCK_STORIES[0]);
  // Sound mute state
  const [isMuted, setIsMuted] = useState(sound.getIsMuted());

  // Child profile loaded from localStorage
  const [childProfile, setChildProfile] = useState<ChildProfile>(() => {
    try {
      const saved = localStorage.getItem('story_teacher_child_profile');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return DEFAULT_PROFILE;
  });

  // Flow State
  const [wordsMasteredCount, setWordsMasteredCount] = useState(3);
  const [quizResults, setQuizResults] = useState<{
    score: number;
    total: number;
    stars: number;
  }>({ score: 3, total: 3, stars: 5 });

  // Modals
  const [isParentGateOpen, setIsParentGateOpen] = useState(false);
  const [printModalStory, setPrintModalStory] = useState<{
    story: Story;
    stars: number;
  } | null>(null);

  // Sync profile to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('story_teacher_child_profile', JSON.stringify(childProfile));
    } catch {
      // ignore
    }
  }, [childProfile]);

  const handleToggleMute = () => {
    const next = sound.toggleMute();
    setIsMuted(next);
  };

  const handleUpdateProfile = (updates: Partial<ChildProfile>) => {
    setChildProfile((prev) => ({ ...prev, ...updates }));
  };

  const handleSelectStory = (story: Story) => {
    setCurrentStory(story);
  };

  const handleCompleteWordScramble = (wordsMastered: number) => {
    setWordsMasteredCount(wordsMastered);
    setCurrentScreen('quiz');
  };

  const handleCompleteQuiz = (results: {
    score: number;
    total: number;
    stars: number;
    masteredSkills: string[];
    growthAreas: string[];
  }) => {
    setQuizResults({
      score: results.score,
      total: results.total,
      stars: results.stars,
    });

    // Add to history and profile stars
    const newRecord: CompletedStoryRecord = {
      id: `record-${Date.now()}`,
      storyId: currentStory.id,
      topic: currentStory.topic,
      title: currentStory.title,
      badgeTitle: currentStory.badge.title,
      badgeIcon: currentStory.badge.icon,
      completedAt: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      score: results.score,
      totalQuestions: results.total,
      wordsMastered: wordsMasteredCount,
      stars: results.stars,
      timeSpentSeconds: 300,
      ageAtCompletion: childProfile.age,
      masteredSkills:
        results.masteredSkills.length > 0
          ? results.masteredSkills
          : currentStory.parentDiagnosis.masteredSkills,
      growthAreas:
        results.growthAreas.length > 0
          ? results.growthAreas
          : currentStory.parentDiagnosis.growthAreas,
      conversationStarters: currentStory.conversationStarters,
    };

    setChildProfile((prev) => ({
      ...prev,
      totalStars: prev.totalStars + results.stars,
      earnedBadges: prev.earnedBadges.some((b) => b.id === currentStory.badge.id)
        ? prev.earnedBadges
        : [...prev.earnedBadges, currentStory.badge],
      history: [newRecord, ...prev.history],
    }));

    setCurrentScreen('reward');
  };

  const handleSelectStoryWeaverBook = (swBook: StoryWeaverBook) => {
    sound.playStarChime(1.2);
    // Map categories to world theme
    let theme: WorldThemeId = 'tree_kingdom';
    if (swBook.categories.includes('STEM Stories')) theme = 'cosmic_quest';
    else if (swBook.categories.includes('Nature & Animals')) theme = 'tree_kingdom';
    else if (swBook.categories.includes('Bedtime')) theme = 'ocean_whispers';
    else if (swBook.categories.includes('Humour')) theme = 'detective_guild';

    const chapters: StoryChapter[] = swBook.samplePages.map((sp) => {
      const words = sp.text.split(/\s+/).filter((w) => w.length > 4);
      const highlightWord = words[0]?.replace(/[^a-zA-Z]/g, '') || swBook.title.split(' ')[0];
      const lower = highlightWord.toLowerCase();

      return {
        id: sp.pageNumber,
        chapterNumber: sp.pageNumber,
        title: `Chapter ${sp.pageNumber}: ${swBook.title}`,
        text: sp.text,
        sceneIllustration: 'scenic',
        illustrationAlt: sp.scenePrompt,
        highlightedKeywords: {
          [lower]: {
            word: highlightWord,
            phonics: `/${lower}/`,
            definition: `A magical learning keyword in "${swBook.title}".`,
            analogy: `Think of how ${sp.scenePrompt.toLowerCase()}`,
            icon: swBook.coverTheme.iconEmoji.split(' ')[0] || '✨',
          },
        },
      };
    });

    const adaptedStory: Story = {
      id: swBook.id,
      topic: swBook.title,
      title: swBook.title,
      theme,
      targetAge: childProfile.ageGroup,
      estimatedMinutes: Math.max(3, Math.round(swBook.pageCount * 0.5)),
      coverBlurb: swBook.synopsis,
      badge: {
        id: `badge-${swBook.id}`,
        title: `Scholar of ${swBook.title}`,
        icon: swBook.coverTheme.iconEmoji.split(' ')[0] || '📚',
        color: swBook.coverTheme.accent || '#FFD166',
        description: `Conquered the open-source classic "${swBook.title}" on StoryWeaver.`,
      },
      chapters: chapters.length > 0 ? chapters : MOCK_STORIES[0].chapters,
      wordPuzzles: [
        {
          id: `wp-${swBook.id}-1`,
          targetWord: swBook.title.split(' ')[0].toUpperCase(),
          educationalMeaning: `A key word from "${swBook.title}".`,
          scrambledLetters: swBook.title.split(' ')[0].toUpperCase().split('').sort(() => Math.random() - 0.5),
          riddleClue: `Spell the first word of "${swBook.title}"!`,
          conceptCategory: swBook.categories[0] || 'Literature',
        },
        {
          id: `wp-${swBook.id}-2`,
          targetWord: 'READ',
          educationalMeaning: 'The superpower of exploring worlds through books.',
          scrambledLetters: ['D', 'A', 'E', 'R'],
          riddleClue: 'What we do when we open a StoryWeaver book!',
          conceptCategory: 'Reading',
        },
      ],
      quizQuestions: [
        {
          id: `qq-${swBook.id}-1`,
          scenarioText: swBook.synopsis,
          questionPrompt: `Who created the beautiful illustrations for "${swBook.title}"?`,
          conceptSkillTested: 'Story Attribution & Literacy',
          conceptExplanation: `${swBook.illustrator} brought this world to life with colorful illustrations!`,
          characterClueOnMistake: `Take another look at the credits on the front cover!`,
          visualType: 'concept_balance',
          options: [
            { id: 'opt-1', label: swBook.illustrator, isCorrect: true },
            { id: 'opt-2', label: 'Captain Clockwork', isCorrect: false },
            { id: 'opt-3', label: 'The Moon Spirit', isCorrect: false },
            { id: 'opt-4', label: 'Inspector Fox', isCorrect: false },
          ],
        },
        {
          id: `qq-${swBook.id}-2`,
          scenarioText: `StoryWeaver provides stories under CC-BY 4.0 so children everywhere can read in their mother tongue.`,
          questionPrompt: `Why is reading stories in multiple languages wonderful?`,
          conceptSkillTested: 'Multilingual Appreciation',
          conceptExplanation: `Reading in mother tongues builds pride, empathy, and bridges across diverse cultures!`,
          characterClueOnMistake: `Think about how happy children are when they read stories in their own language!`,
          visualType: 'concept_balance',
          options: [
            { id: 'opt-a', label: 'It connects communities and sparks creativity worldwide', isCorrect: true },
            { id: 'opt-b', label: 'Books can only be read once', isCorrect: false },
            { id: 'opt-c', label: 'Only computers can read books', isCorrect: false },
            { id: 'opt-d', label: 'Libraries are meant to stay closed', isCorrect: false },
          ],
        },
      ],
      conversationStarters: [
        `"What did you enjoy most about ${swBook.title}?"`,
        `"StoryWeaver translates books into 350+ mother tongues. Which language would you like to read this story in next?"`,
      ],
      parentDiagnosis: {
        masteredSkills: ['Multilingual vocabulary recognition', 'Narrative listening and comprehension'],
        growthAreas: ['Exploring parallel bilingual texts', 'Creative storytelling in mother tongue'],
        homeActivityIdea: `Pick a favorite page from "${swBook.title}" and try translating two sentences into your home language together!`,
      },
    };

    setCurrentStory(adaptedStory);
    setCurrentScreen('reader');
  };

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden flex flex-col bg-[#0B0F19] text-[#FFFDF7] font-sans selection:bg-amber-400 selection:text-slate-900">
      {/* Layer 0: Dynamic Climate Background & Ambient Canvas (Fixed behind everything) */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <LivingBackground theme={currentStory.theme} />
      </div>

      {/* Layer 10: Top Navigation Bar */}
      <Navbar
        className="sticky top-0 z-40 w-full"
        currentTab={
          currentScreen === 'landing'
            ? 'home'
            : currentScreen === 'story_config'
            ? 'create'
            : currentScreen === 'library'
            ? 'library'
            : currentScreen === 'word_scramble'
            ? 'games'
            : currentScreen === 'reward'
            ? 'badges'
            : 'home'
        }
        onSelectTab={(tab) => {
          if (tab === 'home') setCurrentScreen('landing');
          else if (tab === 'create') setCurrentScreen('story_config');
          else if (tab === 'library') setCurrentScreen('library');
          else if (tab === 'games') setCurrentScreen('word_scramble');
          else if (tab === 'badges') setCurrentScreen('reward');
        }}
        starsCount={childProfile.totalStars}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        onOpenParentGate={() => setIsParentGateOpen(true)}
      />

      {/* Layer 20: Centered Content Area with Responsive Constraint */}
      <main
        className={`relative z-10 flex-1 w-full ${
          currentScreen === 'library' ? 'max-w-7xl' : 'max-w-5xl'
        } mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 pb-28 md:pb-12 flex flex-col justify-start items-center`}
      >
        {currentScreen === 'landing' && (
          <HeroLandingScreen
            childProfile={childProfile}
            onUpdateProfile={handleUpdateProfile}
            onNavigate={setCurrentScreen}
            onOpenParentGate={() => setIsParentGateOpen(true)}
          />
        )}

        {currentScreen === 'library' && (
          <StoryWeaver150Collection
            onSelectBookToRead={handleSelectStoryWeaverBook}
            onNavigateHome={() => setCurrentScreen('landing')}
            onOpenCreateQuest={() => setCurrentScreen('story_config')}
          />
        )}

        {currentScreen === 'story_config' && (
          <StoryConfigScreen
            childProfile={childProfile}
            onSelectStory={handleSelectStory}
            onNavigate={setCurrentScreen}
            onUpdateReadingMode={(mode) => handleUpdateProfile({ readingMode: mode })}
          />
        )}

        {currentScreen === 'reader' && (
          <StoryReaderScreen
            story={currentStory}
            childProfile={childProfile}
            readingMode={childProfile.readingMode}
            onNavigate={setCurrentScreen}
            onOpenWordScramble={() => setCurrentScreen('word_scramble')}
          />
        )}

        {currentScreen === 'word_scramble' && (
          <WordScrambleGame
            puzzles={currentStory.wordPuzzles}
            childProfile={childProfile}
            onCompleteAllWords={handleCompleteWordScramble}
            onSkip={() => setCurrentScreen('quiz')}
          />
        )}

        {currentScreen === 'quiz' && (
          <StoryQuizScreen
            questions={currentStory.quizQuestions}
            childProfile={childProfile}
            storyTitle={currentStory.title}
            onCompleteQuiz={handleCompleteQuiz}
          />
        )}

        {currentScreen === 'reward' && (
          <RewardScreen
            story={currentStory}
            childProfile={childProfile}
            starsEarned={quizResults.stars}
            score={quizResults.score}
            totalQuestions={quizResults.total}
            wordsMastered={wordsMasteredCount}
            onNavigate={setCurrentScreen}
            onOpenPrintModal={() =>
              setPrintModalStory({ story: currentStory, stars: quizResults.stars })
            }
            onOpenParentGate={() => setIsParentGateOpen(true)}
          />
        )}
      </main>

      {/* Gate-Protected Parent & Teacher Dashboard Modal */}
      <ParentDashboard
        childProfile={childProfile}
        isOpen={isParentGateOpen}
        onClose={() => setIsParentGateOpen(false)}
        onOpenPrintCertificate={(story, stars) =>
          setPrintModalStory({ story, stars })
        }
      />

      {/* Printable Certificate Modal */}
      {printModalStory && (
        <PrintCertificateModal
          story={printModalStory.story}
          childProfile={childProfile}
          starsEarned={printModalStory.stars}
          onClose={() => setPrintModalStory(null)}
        />
      )}
    </div>
  );
}

export default App;
