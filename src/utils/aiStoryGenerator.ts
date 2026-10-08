import type { Story, WorldThemeId, AgeGroup } from '../types';

export interface GenerateStoryParams {
  topic: string;
  theme: WorldThemeId;
  age: AgeGroup;
  childName: string;
  apiKey?: string;
}

/**
 * Generate a dynamic fairy tale using Google Gemini API or intelligent procedural story weaver fallback.
 */
export async function generateStoryWithAI(params: GenerateStoryParams): Promise<Story> {
  const { topic, theme, age, childName, apiKey } = params;

  // If user provided a Gemini API key, attempt structured JSON generation
  if (apiKey && apiKey.trim().length > 10) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey.trim()}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `You are Story Teacher, a world-class children's author and pedagogical expert.
Generate an enchanting fairy tale about the school concept: "${topic}".
Child Name: "${childName}".
Target Age Group: "${age}".
World Theme: "${theme}".

Return ONLY a valid JSON object (no markdown, no backticks, just raw JSON) following this EXACT schema:
{
  "id": "custom-${Date.now()}",
  "topic": "${topic}",
  "title": "A magical storybook title",
  "theme": "${theme}",
  "targetAge": "${age}",
  "estimatedMinutes": 5,
  "coverBlurb": "2-sentence warm blurb",
  "badge": {
    "id": "badge-${Date.now()}",
    "title": "Title of the unlocked quest badge",
    "icon": "✨",
    "color": "#FFD166",
    "description": "Inspiring explanation of what child mastered"
  },
  "chapters": [
    {
      "id": 1,
      "chapterNumber": 1,
      "title": "Chapter 1 Title",
      "sceneIllustration": "scene_name",
      "illustrationAlt": "Scene description",
      "text": "Chapter text adapted for child age ${age} introducing ${childName} and the school concept naturally in the plot.",
      "highlightedKeywords": {
        "keyword1": {
          "word": "Keyword",
          "phonics": "KEE-word",
          "definition": "Simple definition",
          "analogy": "Friendly child analogy",
          "icon": "⭐"
        }
      }
    },
    {
      "id": 2,
      "chapterNumber": 2,
      "title": "Chapter 2 Title",
      "sceneIllustration": "scene_name",
      "illustrationAlt": "Scene description",
      "text": "Chapter 2 advancing the adventure with cause-and-effect reasoning.",
      "highlightedKeywords": {}
    },
    {
      "id": 3,
      "chapterNumber": 3,
      "title": "Chapter 3 Title",
      "sceneIllustration": "scene_name",
      "illustrationAlt": "Scene description",
      "text": "Chapter 3 resolving the dilemma through mastery of the concept.",
      "highlightedKeywords": {}
    }
  ],
  "wordPuzzles": [
    {
      "id": "w1",
      "targetWord": "SHORTWORD",
      "scrambledLetters": ["O", "R", "D", "W"],
      "riddleClue": "Riddle hint for the child guide to say",
      "educationalMeaning": "Meaning in context of ${topic}",
      "conceptCategory": "Concept"
    },
    {
      "id": "w2",
      "targetWord": "SECONDWORD",
      "scrambledLetters": [],
      "riddleClue": "Riddle hint",
      "educationalMeaning": "Meaning",
      "conceptCategory": "Concept"
    },
    {
      "id": "w3",
      "targetWord": "THIRDWORD",
      "scrambledLetters": [],
      "riddleClue": "Riddle hint",
      "educationalMeaning": "Meaning",
      "conceptCategory": "Concept"
    }
  ],
  "quizQuestions": [
    {
      "id": "q1",
      "scenarioText": "Story-immersed question",
      "questionPrompt": "What should the hero do?",
      "visualType": "science_lab",
      "visualHintText": "Supportive visual clue",
      "options": [
        {"id": "o1", "label": "Correct Option", "isCorrect": true},
        {"id": "o2", "label": "Plausible Distractor", "isCorrect": false},
        {"id": "o3", "label": "Fun Distractor", "isCorrect": false}
      ],
      "characterClueOnMistake": "Friendly in-character whisper",
      "conceptExplanation": "Clear educational takeaway",
      "conceptSkillTested": "Specific educational skill"
    }
  ],
  "conversationStarters": [
    "Discussion prompt 1 for dinner table or classroom",
    "Discussion prompt 2"
  ],
  "parentDiagnosis": {
    "masteredSkills": ["Core skill 1", "Core skill 2"],
    "growthAreas": ["Next step 1"],
    "homeActivityIdea": "A fun 5-minute home activity"
  }
}`,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.7,
              responseMimeType: 'application/json',
            },
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const jsonText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (jsonText) {
          const parsed = JSON.parse(jsonText);
          return parsed as Story;
        }
      }
    } catch (err) {
      console.warn('Gemini API call failed or timed out, falling back to procedural story weaver:', err);
    }
  }

  // Fallback: Smart Procedural Story Weaver
  return synthesizeProceduralStory(topic, theme, age, childName);
}

/**
 * Intelligent procedural story weaver creating richly-tailored tales for any school topic.
 */
function synthesizeProceduralStory(
  topic: string,
  theme: WorldThemeId,
  age: AgeGroup,
  childName: string
): Story {
  const cleanTopic = topic.trim() || 'The Magic of Discovery';
  const cleanName = childName.trim() || 'Young Hero';

  const themeMeta = {
    tree_kingdom: {
      place: 'The Enchanted Hollow Woods',
      companion: 'Barnaby the Clever Fox',
      setting: 'towering ancient oaks and glowing bioluminescent moss',
      badgeColor: '#2EC4B6',
      badgeIcon: '🌳',
    },
    cosmic_quest: {
      place: 'The Starlight Constellation Glade',
      companion: 'Orion the Brass-Spectacled Owl',
      setting: 'twinkling starlight streams and floating asteroid crystals',
      badgeColor: '#5B42F3',
      badgeIcon: '🚀',
    },
    detective_guild: {
      place: 'The Cobblestone Mystery Guild',
      companion: 'Inspector Pip with his Magnifying Scroll',
      setting: 'warm gaslit streetlamps and towering secret parchment libraries',
      badgeColor: '#FF9F68',
      badgeIcon: '🔍',
    },
    ocean_whispers: {
      place: 'The Luminescent Coral Citadel',
      companion: 'Celeste the Sea-Sprite',
      setting: 'gentle glowing bubble currents and singing pearl reefs',
      badgeColor: '#2EC4B6',
      badgeIcon: '🌊',
    },
  }[theme];

  // Pick suitable scramble words based on topic
  const sanitizedWords = extractScrambleWords(cleanTopic);

  return {
    id: `tale-${Date.now()}`,
    topic: cleanTopic,
    title: `${cleanName} and the Secret of ${cleanTopic}`,
    theme,
    targetAge: age,
    estimatedMinutes: 5,
    coverBlurb: `Step inside ${themeMeta.place} as ${cleanName} and ${themeMeta.companion} embark on an unforgettable quest to uncover the wonder of ${cleanTopic}!`,
    badge: {
      id: `badge-${Date.now()}`,
      title: `Champion of ${cleanTopic}`,
      icon: themeMeta.badgeIcon,
      color: themeMeta.badgeColor,
      description: `Awarded to ${cleanName} for courageously exploring and mastering ${cleanTopic} with wisdom and curiosity!`,
    },
    chapters: [
      {
        id: 1,
        chapterNumber: 1,
        title: `The Riddle at ${themeMeta.place}`,
        sceneIllustration: 'chapter1_scene',
        illustrationAlt: `${cleanName} discovers a glowing ancient puzzle scroll surrounded by ${themeMeta.setting}.`,
        text: `As the golden twilight cast long, dancing shadows across ${themeMeta.place}, ${cleanName} noticed a shimmering seal carved into an ancient doorway. Beside it sat ${themeMeta.companion}, whose eyes sparkled with excitement. "Look closely, ${cleanName}!" they whispered. "This gateway will only open for someone who understands ${cleanTopic}." The air smelled of sweet pine and starlight honey. On the stone table, a glowing question hovered in warm golden runes, waiting for a brave mind to study its clues.`,
        highlightedKeywords: {
          concept: {
            word: 'Concept',
            phonics: 'KON-sept',
            definition: 'A big, fascinating idea or rule that explains how the world around us works.',
            analogy: 'Like the master blueprint of a magic castle!',
            icon: '💡',
          },
          curiosity: {
            word: 'Curiosity',
            phonics: 'kyoor-ee-OSS-ih-tee',
            definition: 'The eager desire to learn, explore, and understand new things.',
            analogy: 'The spark inside your heart that asks "Why does that happen?"',
            icon: '✨',
          },
        },
      },
      {
        id: 2,
        chapterNumber: 2,
        title: 'The Great Discovery',
        sceneIllustration: 'chapter2_scene',
        illustrationAlt: `${cleanName} and their animal friend carefully testing the puzzle pieces.`,
        text: `To solve the magical trial, ${cleanName} had to observe how each part of ${cleanTopic} connected to the next. "Remember," guided ${themeMeta.companion}, "every great mystery is made of simple, beautiful steps." With steady hands and careful reasoning, ${cleanName} arranged the enchanted tokens in perfect harmony. Step by step, the puzzle clicked into place. The ancient runes pulsed with warm amber light, rewarding the patience and keen eyes of our young scholar!`,
        highlightedKeywords: {
          harmony: {
            word: 'Harmony',
            phonics: 'HAR-muh-nee',
            definition: 'When different parts work together in perfect balance and agreement.',
            analogy: 'Like different musical notes creating a lovely song together.',
            icon: '🎵',
          },
          pattern: {
            word: 'Pattern',
            phonics: 'PAT-ern',
            definition: 'A repeating arrangement or rule that helps us predict what comes next.',
            analogy: 'Like alternating stripes on a warm knit scarf.',
            icon: '🧩',
          },
        },
      },
      {
        id: 3,
        chapterNumber: 3,
        title: 'The Gateway Swings Open',
        sceneIllustration: 'chapter3_scene',
        illustrationAlt: `The great enchanted doorway swings open, bathing ${cleanName} in starlight.`,
        text: `With a joyful resonant chime that echoed across ${themeMeta.setting}, the heavy doors unlocked! A gentle breeze carried sparkling golden confetti through the open archway. "You have done it, ${cleanName}!" cheered ${themeMeta.companion}, doing a celebratory twirl. "You did not just memorize a rule; you understood the heart of ${cleanTopic}!" Through the doorway lay a kingdom of wonder, where the lessons learned today would forever light the path ahead.`,
        highlightedKeywords: {
          wisdom: {
            word: 'Wisdom',
            phonics: 'WIZ-dum',
            definition: 'Using knowledge, experience, and good judgment to make kind and smart choices.',
            analogy: 'The golden lantern that guides your decisions.',
            icon: '🦉',
          },
        },
      },
    ],
    wordPuzzles: [
      {
        id: `puzzle-1-${Date.now()}`,
        targetWord: sanitizedWords[0],
        scrambledLetters: shuffleWord(sanitizedWords[0]),
        riddleClue: `Spell the first magic key that unlocked the secrets of ${cleanTopic}!`,
        educationalMeaning: `A foundational building block of ${cleanTopic}.`,
        conceptCategory: cleanTopic,
      },
      {
        id: `puzzle-2-${Date.now()}`,
        targetWord: sanitizedWords[1],
        scrambledLetters: shuffleWord(sanitizedWords[1]),
        riddleClue: `Spell the action that ${cleanName} took with their friend to master the puzzle!`,
        educationalMeaning: `Working through challenges with focus and inquiry.`,
        conceptCategory: cleanTopic,
      },
      {
        id: `puzzle-3-${Date.now()}`,
        targetWord: sanitizedWords[2],
        scrambledLetters: shuffleWord(sanitizedWords[2]),
        riddleClue: `Spell the rewarding treasure gained by every true explorer!`,
        educationalMeaning: `The lasting reward of understanding how the universe works.`,
        conceptCategory: cleanTopic,
      },
    ],
    quizQuestions: [
      {
        id: `q-gen-1`,
        scenarioText: `When ${cleanName} first arrived at the doorway, what guided them to unlock the mystery of ${cleanTopic}?`,
        questionPrompt: `What is the best way to approach a brand new school concept?`,
        visualType: 'concept_balance',
        visualHintText: 'Patience, careful observation, and asking questions.',
        options: [
          { id: 'opt-gen-1-1', label: 'Observing the clues step-by-step with curiosity', isCorrect: true },
          { id: 'opt-gen-1-2', label: 'Giving up when the first attempt looks tricky', isCorrect: false },
          { id: 'opt-gen-1-3', label: 'Ignoring the rules and guessing randomly', isCorrect: false },
        ],
        characterClueOnMistake: `${themeMeta.companion} whispers: "Remember how we looked at the puzzle together? Patience and curiosity always find the key!"`,
        conceptExplanation: `Approaching new concepts step-by-step leads to genuine understanding and mastery.`,
        conceptSkillTested: 'Inquiry mindset & conceptual observation',
      },
      {
        id: `q-gen-2`,
        scenarioText: `In our story about ${cleanTopic}, why was ${themeMeta.companion} so proud of ${cleanName}?`,
        questionPrompt: `What was the most magical achievement of the quest?`,
        visualType: 'concept_balance',
        visualHintText: 'Understanding how and why things work, not just guessing.',
        options: [
          { id: 'opt-gen-2-1', label: `Understanding the true meaning of ${cleanTopic} from the heart`, isCorrect: true },
          { id: 'opt-gen-2-2', label: 'Running away as fast as possible', isCorrect: false },
          { id: 'opt-gen-2-3', label: 'Finding a bag of shiny rocks', isCorrect: false },
        ],
        characterClueOnMistake: `Take a deep breath! ${themeMeta.companion} celebrated your curiosity and new understanding!`,
        conceptExplanation: `True learning comes from seeing how concepts connect to each other.`,
        conceptSkillTested: `Comprehension of ${cleanTopic}`,
      },
      {
        id: `q-gen-3`,
        scenarioText: `If a younger friend asked ${cleanName} to explain ${cleanTopic}, what advice would you share?`,
        questionPrompt: `How can we share our wisdom with others?`,
        visualType: 'concept_balance',
        visualHintText: 'Explaining with kindness and clear examples.',
        options: [
          { id: 'opt-gen-3-1', label: 'Show them how each step connects, just like our story showed us', isCorrect: true },
          { id: 'opt-gen-3-2', label: 'Tell them it is a secret that no one can learn', isCorrect: false },
          { id: 'opt-gen-3-3', label: 'Ask them to memorize words without understanding', isCorrect: false },
        ],
        characterClueOnMistake: `Remember how kindness and teaching help everyone grow together!`,
        conceptExplanation: `Teaching a concept to another person is the ultimate demonstration of mastery.`,
        conceptSkillTested: 'Communication and synthesis of learning',
      },
    ],
    conversationStarters: [
      `"How did ${cleanName} use curiosity to solve the mystery of ${cleanTopic} today?"`,
      `"Can you think of a place in our home or neighborhood where we see ${cleanTopic} in action?"`,
    ],
    parentDiagnosis: {
      masteredSkills: [
        `Grasps the foundational narrative and purpose of ${cleanTopic}`,
        `Connects story events to core concepts with high engagement`,
        `Demonstrates perseverance and positive attitude toward new challenges`,
      ],
      growthAreas: [
        `Explore real-world experiments or library books related to ${cleanTopic}`,
        `Ask child to re-tell the story in their own words to strengthen retention`,
      ],
      homeActivityIdea: `Have the child draw a one-page "Magic Comic" illustrating the main lesson of ${cleanTopic} with their favorite animal guide!`,
    },
  };
}

function extractScrambleWords(topic: string): [string, string, string] {
  const clean = topic.toUpperCase().replace(/[^A-Z\s]/g, '');
  const words = clean.split(/\s+/).filter((w) => w.length >= 3 && w.length <= 7);

  const defaults = ['SOLVE', 'SHARE', 'BRAVE', 'LIGHT', 'THINK', 'LEARN'];
  const res: string[] = [];

  for (const w of words) {
    if (!res.includes(w)) res.push(w);
    if (res.length === 3) break;
  }

  while (res.length < 3) {
    for (const d of defaults) {
      if (!res.includes(d)) {
        res.push(d);
        break;
      }
    }
  }

  return [res[0], res[1], res[2]];
}

function shuffleWord(word: string): string[] {
  const letters = word.split('');
  let shuffled = [...letters];
  let attempts = 0;
  // Ensure the scrambled letters aren't already spelled correctly
  while (attempts < 10 && shuffled.join('') === word) {
    shuffled = shuffled.sort(() => Math.random() - 0.5);
    attempts++;
  }
  return shuffled;
}
