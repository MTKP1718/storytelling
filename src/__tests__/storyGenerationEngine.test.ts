import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { generateStoryWithAI } from '../utils/aiStoryGenerator';
import type { Story, WorldThemeId, AgeGroup } from '../types';

describe('Story Generation Engine', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Smart Procedural Story Weaver (Offline Fallback)', () => {
    it('generates a complete valid story with 3 chapters, 3 riddles, and quiz questions', async () => {
      const story = await generateStoryWithAI({
        topic: 'Photosynthesis',
        theme: 'tree_kingdom',
        age: '6-8',
        childName: 'Maya',
      });

      expect(story).toBeDefined();
      expect(story.id).toMatch(/^tale-/);
      expect(story.topic).toBe('Photosynthesis');
      expect(story.title).toContain('Maya');
      expect(story.title).toContain('Photosynthesis');
      expect(story.theme).toBe('tree_kingdom');
      expect(story.targetAge).toBe('6-8');
      expect(story.estimatedMinutes).toBeGreaterThan(0);

      // Chapters
      expect(story.chapters).toHaveLength(3);
      story.chapters.forEach((chapter, index) => {
        expect(chapter.chapterNumber).toBe(index + 1);
        expect(chapter.title.length).toBeGreaterThan(0);
        expect(chapter.text.length).toBeGreaterThan(20);
        expect(chapter.highlightedKeywords).toBeDefined();
      });

      // Word puzzles (riddles)
      expect(story.wordPuzzles).toHaveLength(3);
      story.wordPuzzles.forEach((puzzle) => {
        expect(puzzle.targetWord).toBeDefined();
        expect(puzzle.targetWord.length).toBeGreaterThanOrEqual(3);
        expect(puzzle.targetWord.length).toBeLessThanOrEqual(7);
        expect(puzzle.scrambledLetters).toBeDefined();
        expect(puzzle.scrambledLetters.length).toBe(puzzle.targetWord.length);
        expect(puzzle.riddleClue).toBeDefined();
        expect(puzzle.educationalMeaning).toBeDefined();
      });

      // Quiz questions
      expect(story.quizQuestions).toHaveLength(3);
      story.quizQuestions.forEach((q) => {
        expect(q.scenarioText).toBeDefined();
        expect(q.questionPrompt).toBeDefined();
        expect(q.options.length).toBeGreaterThanOrEqual(3);
        const correctOptions = q.options.filter((opt) => opt.isCorrect);
        expect(correctOptions).toHaveLength(1);
        expect(q.characterClueOnMistake).toBeDefined();
        expect(q.conceptExplanation).toBeDefined();
        expect(q.conceptSkillTested).toBeDefined();
      });

      // Conversation starters & Parent diagnosis
      expect(story.conversationStarters).toHaveLength(2);
      expect(story.parentDiagnosis.masteredSkills.length).toBeGreaterThan(0);
      expect(story.parentDiagnosis.growthAreas.length).toBeGreaterThan(0);
      expect(story.parentDiagnosis.homeActivityIdea).toBeDefined();
    });

    it('adapts story setting, companion, and badge based on world theme', async () => {
      const themes: WorldThemeId[] = [
        'tree_kingdom',
        'cosmic_quest',
        'detective_guild',
        'ocean_whispers',
      ];

      for (const theme of themes) {
        const story = await generateStoryWithAI({
          topic: 'Gravity',
          theme,
          age: '9-10',
          childName: 'Leo',
        });

        expect(story.theme).toBe(theme);

        if (theme === 'tree_kingdom') {
          expect(story.badge.icon).toBe('🌳');
          expect(story.coverBlurb).toContain('Barnaby the Clever Fox');
        } else if (theme === 'cosmic_quest') {
          expect(story.badge.icon).toBe('🚀');
          expect(story.coverBlurb).toContain('Orion the Brass-Spectacled Owl');
        } else if (theme === 'detective_guild') {
          expect(story.badge.icon).toBe('🔍');
          expect(story.coverBlurb).toContain('Inspector Pip');
        } else if (theme === 'ocean_whispers') {
          expect(story.badge.icon).toBe('🌊');
          expect(story.coverBlurb).toContain('Celeste the Sea-Sprite');
        }
      }
    });

    it('adapts target age brackets across 6-8, 9-10, and 11-12', async () => {
      const ageBrackets: AgeGroup[] = ['6-8', '9-10', '11-12'];

      for (const age of ageBrackets) {
        const story = await generateStoryWithAI({
          topic: 'The Water Cycle',
          theme: 'ocean_whispers',
          age,
          childName: 'Aarav',
        });

        expect(story.targetAge).toBe(age);
      }
    });

    it('sanitizes empty, blank, or special character inputs without throwing', async () => {
      const story = await generateStoryWithAI({
        topic: '   ',
        theme: 'tree_kingdom',
        age: '6-8',
        childName: '   ',
      });

      expect(story.topic).toBe('The Magic of Discovery');
      expect(story.title).toContain('Young Hero');
      expect(story.title).toContain('The Magic of Discovery');

      // Special characters
      const specialStory = await generateStoryWithAI({
        topic: '!@#$%^&*()_+',
        theme: 'cosmic_quest',
        age: '9-10',
        childName: 'Sam',
      });

      expect(specialStory).toBeDefined();
      expect(specialStory.wordPuzzles).toHaveLength(3);
    });
  });

  describe('Google Gemini API Integration & Graceful Fallback', () => {
    it('successfully parses and returns structured story from Gemini API response', async () => {
      const mockGeminiStory: Partial<Story> = {
        id: 'gemini-custom-123',
        topic: 'Fractions',
        title: 'The Royal Pie Division',
        theme: 'tree_kingdom',
        targetAge: '6-8',
        estimatedMinutes: 6,
        coverBlurb: 'A fun tale about slicing pies.',
        badge: {
          id: 'b-1',
          title: 'Pie Master',
          icon: '🥧',
          color: '#FFD166',
          description: 'Mastered halves and fourths',
        },
        chapters: [
          {
            id: 1,
            chapterNumber: 1,
            title: 'The Baker’s Shop',
            sceneIllustration: 'baker',
            illustrationAlt: 'Baker with pie',
            text: 'Chapter 1 text from AI.',
            highlightedKeywords: {},
          },
        ],
        wordPuzzles: [],
        quizQuestions: [],
        conversationStarters: ['Did you enjoy the pie?', 'How would you slice it into four quarters?'],
        parentDiagnosis: {
          masteredSkills: ['Fractions'],
          growthAreas: ['Equal parts'],
          homeActivityIdea: 'Bake a pie',
        },
      };

      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          candidates: [
            {
              content: {
                parts: [
                  {
                    text: JSON.stringify(mockGeminiStory),
                  },
                ],
              },
            },
          ],
        }),
      });

      globalThis.fetch = mockFetch as unknown as typeof fetch;

      const story = await generateStoryWithAI({
        topic: 'Fractions',
        theme: 'tree_kingdom',
        age: '6-8',
        childName: 'Maya',
        apiKey: 'AIzaSyFakeValidKey1234567890',
      });

      expect(story.id).toBe('gemini-custom-123');
      expect(story.title).toBe('The Royal Pie Division');
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('generativelanguage.googleapis.com'),
        expect.objectContaining({
          method: 'POST',
        })
      );
    });

    it('gracefully falls back to procedural weaver when Gemini API returns HTTP 500 error', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      });

      globalThis.fetch = mockFetch as unknown as typeof fetch;

      const story = await generateStoryWithAI({
        topic: 'Solar Power',
        theme: 'tree_kingdom',
        age: '9-10',
        childName: 'Alex',
        apiKey: 'AIzaSyFakeKeyWithError123456',
      });

      // Should not throw, but fall back to smart procedural synthesis
      expect(story).toBeDefined();
      expect(story.topic).toBe('Solar Power');
      expect(story.chapters).toHaveLength(3);
    });

    it('gracefully falls back to procedural weaver when network request throws an exception', async () => {
      const mockFetch = vi.fn().mockRejectedValue(new Error('Network offline or DNS error'));
      globalThis.fetch = mockFetch as unknown as typeof fetch;

      const story = await generateStoryWithAI({
        topic: 'Magnetism',
        theme: 'cosmic_quest',
        age: '11-12',
        childName: 'Zoe',
        apiKey: 'AIzaSyNetworkFailKey1234567',
      });

      expect(story).toBeDefined();
      expect(story.topic).toBe('Magnetism');
      expect(story.targetAge).toBe('11-12');
      expect(story.wordPuzzles).toHaveLength(3);
    });
  });
});
