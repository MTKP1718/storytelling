import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { StoryQuizScreen } from '../components/StoryQuizScreen';
import { WordScrambleGame } from '../components/WordScrambleGame';
import { StoryReaderScreen } from '../components/StoryReaderScreen';
import { ParentDashboard } from '../components/ParentDashboard';
import type { QuizQuestion, ChildProfile, WordPuzzle, CompletedStoryRecord } from '../types';
import { MOCK_STORIES } from '../data/mockStories';

describe('Comprehension Engine', () => {
  const mockProfile: ChildProfile = {
    name: 'Oliver',
    avatar: 'starlight_wizard',
    age: 8,
    ageGroup: '6-8',
    readingMode: 'read_to_me',
    totalStars: 5,
    earnedBadges: [MOCK_STORIES[0].badge],
    history: [],
  };

  const sampleQuestions: QuizQuestion[] = [
    {
      id: 'q1',
      scenarioText: 'Two knights need to share a golden loaf.',
      questionPrompt: 'How should Sir Leo slice the loaf?',
      conceptSkillTested: 'Visual Fraction Division',
      conceptExplanation: 'Cutting into two equal pieces makes halves.',
      characterClueOnMistake: 'Think about fairness!',
      visualType: 'concept_balance',
      options: [
        { id: 'opt1-a', label: 'Slice into 2 exactly equal halves', isCorrect: true },
        { id: 'opt1-b', label: 'Give one knight a huge chunk and the other crumbs', isCorrect: false },
        { id: 'opt1-c', label: 'Throw the bread in the river', isCorrect: false },
      ],
    },
    {
      id: 'q2',
      scenarioText: 'What is the top number of a fraction called?',
      questionPrompt: 'Identify the numerator',
      conceptSkillTested: 'Numerator & Denominator Vocabulary',
      conceptExplanation: 'The numerator counts the pieces you have.',
      characterClueOnMistake: 'Numerator is on top!',
      visualType: 'concept_balance',
      options: [
        { id: 'opt2-a', label: 'The Numerator', isCorrect: true },
        { id: 'opt2-b', label: 'The Denominator', isCorrect: false },
      ],
    },
  ];

  const samplePuzzles: WordPuzzle[] = [
    {
      id: 'p1',
      targetWord: 'HALF',
      scrambledLetters: ['F', 'L', 'A', 'H'],
      riddleClue: 'One of two equal parts!',
      educationalMeaning: 'Divided into two equal portions.',
      conceptCategory: 'Fractions',
    },
    {
      id: 'p2',
      targetWord: 'PIE',
      scrambledLetters: ['E', 'I', 'P'],
      riddleClue: 'A tasty circle we can divide!',
      educationalMeaning: 'A round treat.',
      conceptCategory: 'Fractions',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('StoryQuizScreen - Score & Star Rating Calculations', () => {
    it('awards 5 stars and full score when answering all questions correctly on first try', () => {
      const onCompleteQuiz = vi.fn();

      render(
        <StoryQuizScreen
          questions={sampleQuestions}
          childProfile={mockProfile}
          storyTitle="The Feast of the Two Forest Knights"
          onCompleteQuiz={onCompleteQuiz}
        />
      );

      // Question 1: choose correct option
      const correctOpt1 = screen.getByRole('button', { name: /Slice into 2 exactly equal halves/i });
      fireEvent.click(correctOpt1);

      // Click "Next Trial" button
      const nextBtn1 = screen.getByRole('button', { name: /Next Trial/i });
      fireEvent.click(nextBtn1);

      // Question 2: choose correct option
      const correctOpt2 = screen.getByRole('button', { name: /The Numerator/i });
      fireEvent.click(correctOpt2);

      // Click final finish button
      const finishBtn = screen.getByRole('button', { name: /Claim Your Hero Badge/i });
      fireEvent.click(finishBtn);

      expect(onCompleteQuiz).toHaveBeenCalledWith({
        score: 2,
        total: 2,
        stars: 5,
        masteredSkills: expect.arrayContaining([
          'Visual Fraction Division',
          'Numerator & Denominator Vocabulary',
        ]),
        growthAreas: [],
      });
    });

    it('provides supportive character hint on mistake and adjusts star rating correctly', () => {
      const onCompleteQuiz = vi.fn();

      render(
        <StoryQuizScreen
          questions={sampleQuestions}
          childProfile={mockProfile}
          storyTitle="The Feast of the Two Forest Knights"
          onCompleteQuiz={onCompleteQuiz}
        />
      );

      // Question 1: choose incorrect option first
      const wrongOpt1 = screen.getByRole('button', { name: /Give one knight a huge chunk/i });
      fireEvent.click(wrongOpt1);

      // Character clue should be displayed
      expect(screen.getByText(/Think about fairness!/i)).toBeInTheDocument();

      // Now click the correct option
      const correctOpt1 = screen.getByRole('button', { name: /Slice into 2 exactly equal halves/i });
      fireEvent.click(correctOpt1);

      // Advance to Question 2
      const nextBtn1 = screen.getByRole('button', { name: /Next Trial/i });
      fireEvent.click(nextBtn1);

      // Question 2: choose correct option on first try
      const correctOpt2 = screen.getByRole('button', { name: /The Numerator/i });
      fireEvent.click(correctOpt2);

      // Finish quiz
      const finishBtn = screen.getByRole('button', { name: /Claim Your Hero Badge/i });
      fireEvent.click(finishBtn);

      // 1 first-try out of 2 => ratio 0.5 => 4 stars
      expect(onCompleteQuiz).toHaveBeenCalledWith({
        score: 1,
        total: 2,
        stars: 4,
        masteredSkills: ['Numerator & Denominator Vocabulary'],
        growthAreas: ['Visual Fraction Division'],
      });
    });

    it('calculates 3 stars when score ratio is under 50%', () => {
      const threeQuestions: QuizQuestion[] = [
        ...sampleQuestions,
        {
          id: 'q3',
          scenarioText: 'Question 3',
          questionPrompt: 'Prompt 3',
          conceptSkillTested: 'Skill 3',
          conceptExplanation: 'Explanation',
          characterClueOnMistake: 'Hint 3',
          visualType: 'concept_balance',
          options: [
            { id: 'opt3-a', label: 'Correct 3', isCorrect: true },
            { id: 'opt3-b', label: 'Wrong 3', isCorrect: false },
          ],
        },
      ];

      const onCompleteQuiz = vi.fn();

      render(
        <StoryQuizScreen
          questions={threeQuestions}
          childProfile={mockProfile}
          storyTitle="Testing 3 Stars"
          onCompleteQuiz={onCompleteQuiz}
        />
      );

      // Miss Q1 first try
      fireEvent.click(screen.getByRole('button', { name: /Give one knight a huge chunk/i }));
      fireEvent.click(screen.getByRole('button', { name: /Slice into 2 exactly equal halves/i }));
      fireEvent.click(screen.getByRole('button', { name: /Next Trial/i }));

      // Miss Q2 first try
      fireEvent.click(screen.getByRole('button', { name: /The Denominator/i }));
      fireEvent.click(screen.getByRole('button', { name: /The Numerator/i }));
      fireEvent.click(screen.getByRole('button', { name: /Next Trial/i }));

      // Answer Q3 correctly on first try
      fireEvent.click(screen.getByRole('button', { name: /Correct 3/i }));
      fireEvent.click(screen.getByRole('button', { name: /Claim Your Hero Badge/i }));

      // 1 out of 3 = 33% => 3 stars
      expect(onCompleteQuiz).toHaveBeenCalledWith(
        expect.objectContaining({
          score: 1,
          total: 3,
          stars: 3,
        })
      );
    });
  });

  describe('WordScrambleGame - Riddle Answers & Word Unlocking', () => {
    it('allows placing tiles, using hints, resetting rack, and solving all words', () => {
      const onCompleteAllWords = vi.fn();

      render(
        <WordScrambleGame
          puzzles={samplePuzzles}
          childProfile={mockProfile}
          onCompleteAllWords={onCompleteAllWords}
        />
      );

      // Verify clue and riddle text
      expect(screen.getByText(/One of two equal parts!/i)).toBeInTheDocument();

      // Click "Magic Letter Hint" to auto-place next correct letter ('H')
      const hintBtn = screen.getByRole('button', { name: /Magic Letter Hint/i });
      fireEvent.click(hintBtn);

      // Placed tile 'H' should now be in the target slots
      expect(screen.getByText('H')).toBeInTheDocument();

      // Click "Reset Tiles" to return tiles
      const resetBtn = screen.getByRole('button', { name: /Reset Tiles/i });
      fireEvent.click(resetBtn);

      // Use hints to solve the first word completely ('HALF')
      fireEvent.click(hintBtn); // H
      fireEvent.click(hintBtn); // A
      fireEvent.click(hintBtn); // L
      fireEvent.click(hintBtn); // F

      // Word solved banner should appear
      expect(screen.getByText(/Brilliant Spelling!/i)).toBeInTheDocument();

      // Click advance to next word
      const nextWordBtn = screen.getByRole('button', { name: /Next Word Puzzle/i });
      fireEvent.click(nextWordBtn);

      // Second puzzle ('PIE')
      expect(screen.getByText(/A tasty circle we can divide!/i)).toBeInTheDocument();

      // Solve second word using hints
      const hintBtn2 = screen.getByRole('button', { name: /Magic Letter Hint/i });
      fireEvent.click(hintBtn2); // P
      fireEvent.click(hintBtn2); // I
      fireEvent.click(hintBtn2); // E

      // Click "Enter Concept Assessment!"
      const completeBtn = screen.getByRole('button', { name: /Enter Concept Assessment/i });
      fireEvent.click(completeBtn);

      expect(onCompleteAllWords).toHaveBeenCalledWith(2);
    });

    it('triggers skip callback when skip button is clicked', () => {
      const onSkip = vi.fn();

      render(
        <WordScrambleGame
          puzzles={samplePuzzles}
          childProfile={mockProfile}
          onCompleteAllWords={vi.fn()}
          onSkip={onSkip}
        />
      );

      const skipBtn = screen.getByRole('button', { name: /Skip to Quiz/i });
      fireEvent.click(skipBtn);
      expect(onSkip).toHaveBeenCalled();
    });
  });

  describe('StoryReaderScreen - Chapter Progression & Keyword Inspection', () => {
    it('navigates chapters sequentially and unlocks word scramble on final chapter', () => {
      const onNavigate = vi.fn();
      const onOpenWordScramble = vi.fn();
      const mockStory = MOCK_STORIES[0];

      render(
        <StoryReaderScreen
          story={mockStory}
          childProfile={mockProfile}
          readingMode="read_to_me"
          onNavigate={onNavigate}
          onOpenWordScramble={onOpenWordScramble}
        />
      );

      // Starts at Scroll 1
      expect(screen.getByText(/Scroll 1 of 3/i)).toBeInTheDocument();

      // Navigate to Chapter 2
      const turnPageBtn = screen.getByRole('button', { name: /Turn Page/i });
      fireEvent.click(turnPageBtn);
      expect(screen.getByText(/Scroll 2 of 3/i)).toBeInTheDocument();

      // Navigate to Chapter 3
      fireEvent.click(turnPageBtn);
      expect(screen.getByText(/Scroll 3 of 3/i)).toBeInTheDocument();

      // On chapter 3, button becomes "Word Magic"
      const wordMagicBtn = screen.getByRole('button', { name: /Word Magic/i });
      fireEvent.click(wordMagicBtn);
      expect(onOpenWordScramble).toHaveBeenCalled();
    });

    it('allows opening interactive concept keyword definitions modal', () => {
      const mockStory = MOCK_STORIES[0];

      render(
        <StoryReaderScreen
          story={mockStory}
          childProfile={mockProfile}
          readingMode="read_to_me"
          onNavigate={vi.fn()}
          onOpenWordScramble={vi.fn()}
        />
      );

      // Click any highlighted keyword in chapter 1
      const keywordButtons = screen.getAllByRole('button', { name: /halves|equal parts|half/i });
      if (keywordButtons.length > 0) {
        fireEvent.click(keywordButtons[0]);
        // Modal should open showing concept definition
        expect(screen.getByText(/Child-Friendly Meaning/i)).toBeInTheDocument();
      }
    });
  });

  describe('ParentDashboard - Mastery Percentage & Aggregate Calculations', () => {
    it('calculates comprehension score percentage and totals accurately', () => {
      const history: CompletedStoryRecord[] = [
        {
          id: 'rec-1',
          storyId: 's1',
          topic: 'Fractions',
          title: 'Forest Knights',
          badgeTitle: 'Halves Master',
          badgeIcon: '🛡️',
          completedAt: 'Today',
          score: 3,
          totalQuestions: 3, // 100%
          wordsMastered: 3,
          stars: 5,
          timeSpentSeconds: 300,
          ageAtCompletion: 8,
          masteredSkills: ['Skill A', 'Skill B'],
          growthAreas: [],
          conversationStarters: ['Prompt 1', 'Discussion 1'],
        },
        {
          id: 'rec-2',
          storyId: 's2',
          topic: 'Photosynthesis',
          title: 'Solar Plants',
          badgeTitle: 'Sun Master',
          badgeIcon: '🍃',
          completedAt: 'Yesterday',
          score: 2,
          totalQuestions: 3, // 66.6% -> combined: 5/6 = 83%
          wordsMastered: 2,
          stars: 4,
          timeSpentSeconds: 300,
          ageAtCompletion: 8,
          masteredSkills: ['Skill C'],
          growthAreas: ['Skill D'],
          conversationStarters: ['Prompt 2', 'Discussion 2'],
        },
      ];

      render(
        <ParentDashboard
          childProfile={{ ...mockProfile, history }}
          isOpen={true}
          onClose={vi.fn()}
          onOpenPrintCertificate={vi.fn()}
        />
      );

      // Unlock with PIN
      const pinInput = screen.getByPlaceholderText(/Enter 4-digit PIN/i);
      fireEvent.change(pinInput, { target: { value: '1234' } });
      fireEvent.click(screen.getByRole('button', { name: /Unlock Insights/i }));

      // 5 / 6 questions = 83%
      expect(screen.getByText('83%')).toBeInTheDocument();
      // Total words: 3 + 2 = 5 Words
      expect(screen.getByText(/5 Words/i)).toBeInTheDocument();
      // Average stars: (5 + 4) / 2 = 4.5
      expect(screen.getByText('4.5')).toBeInTheDocument();
      // Total time: (300 + 300) = 600s = 10 mins
      expect(screen.getByText(/10 mins/i)).toBeInTheDocument();
    });
  });
});
