import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Unlock,
  X,
  CheckCircle,
  Lightbulb,
  MessageCircle,
  Printer,
  Calendar,
  Star,
} from 'lucide-react';
import type { ChildProfile, CompletedStoryRecord, Story } from '../types';
import { MOCK_STORIES } from '../data/mockStories';
import { sound } from '../utils/audio';

interface ParentDashboardProps {
  childProfile: ChildProfile;
  isOpen: boolean;
  onClose: () => void;
  onOpenPrintCertificate: (story: Story, stars: number) => void;
}

export const ParentDashboard: React.FC<ParentDashboardProps> = ({
  childProfile,
  isOpen,
  onClose,
  onOpenPrintCertificate,
}) => {
  // Gate authentication state
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [mathAnswer, setMathAnswer] = useState('');
  const [gateError, setGateError] = useState('');

  // Default math problem: 8 x 7 = 56
  const num1 = 8;
  const num2 = 7;
  const correctMath = num1 * num2; // 56
  const defaultPin = '1234';

  if (!isOpen) return null;

  const handleVerifyGate = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === defaultPin || parseInt(mathAnswer.trim(), 10) === correctMath) {
      sound.playCorrectSparkle();
      setIsUnlocked(true);
      setGateError('');
    } else {
      sound.playGentleClue();
      setGateError('Incorrect PIN or math answer. Please try again!');
    }
  };

  // Compile history (use mock pre-populated history if none exists yet)
  const historyList: CompletedStoryRecord[] =
    childProfile.history.length > 0
      ? childProfile.history
      : [
          {
            id: 'sample-1',
            storyId: 'fractions-halves',
            topic: 'Fractions & Equal Parts',
            title: 'The Feast of the Two Forest Knights',
            badgeTitle: 'Master of Equal Halves',
            badgeIcon: '🛡️',
            completedAt: 'Yesterday, 6:30 PM',
            score: 3,
            totalQuestions: 3,
            wordsMastered: 3,
            stars: 5,
            timeSpentSeconds: 320,
            ageAtCompletion: childProfile.age,
            masteredSkills: [
              'Divides wholes into equal fractional parts with visual models',
              'Recognizes numerators (counted parts) and denominators (total parts)',
              'Understands equivalent fractions (2/4 is equal to 1/2)',
            ],
            growthAreas: [
              'Practice fractions with unequal looking shapes to test conservation',
            ],
            conversationStarters: [
              'Next time we slice a sandwich or apple at home, ask: "Can you show me how to cut this into halves, and then into fourths?"',
              'Ask: "Why did the knights make sure the two slices were exactly equal instead of one being bigger?"',
            ],
          },
        ];

  const totalWords = historyList.reduce((acc, h) => acc + h.wordsMastered, 0);
  const avgStars = (
    historyList.reduce((acc, h) => acc + h.stars, 0) / Math.max(1, historyList.length)
  ).toFixed(1);
  const totalTimeSpentSeconds = historyList.reduce((acc, h) => acc + (h.timeSpentSeconds || 300), 0);
  const totalTimeMins = Math.max(1, Math.round(totalTimeSpentSeconds / 60));
  const totalQuestionsSum = historyList.reduce((acc, h) => acc + h.totalQuestions, 0);
  const totalCorrectSum = historyList.reduce((acc, h) => acc + h.score, 0);
  const comprehensionScore = Math.round((totalCorrectSum / Math.max(1, totalQuestionsSum)) * 100);

  // Collect all unique mastered skills & growth areas
  const allMastered = Array.from(new Set(historyList.flatMap((h) => h.masteredSkills)));
  const allGrowth = Array.from(new Set(historyList.flatMap((h) => h.growthAreas)));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#14182E] text-[#FFFDF7] rounded-3xl p-6 sm:p-8 border-2 border-[#5B42F3]/60 shadow-2xl my-8 animate-scale-up">
        {/* Header Close */}
        <button
          onClick={() => {
            sound.playTilePlace();
            onClose();
          }}
          className="absolute top-4 right-4 min-w-[48px] min-h-[48px] w-12 h-12 rounded-full bg-[#242A4A] hover:bg-[#333C6B] text-[#FFFDF7] flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Gate Protection View if locked */}
        {!isUnlocked ? (
          <div className="max-w-md mx-auto text-center py-8">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-[#5B42F3] to-[#7E69FF] flex items-center justify-center shadow-lg mb-4">
              <Lock className="w-8 h-8 text-white" />
            </div>

            <h2 className="font-storybook text-2xl font-bold text-[#FFD166] mb-1">
              Parent & Teacher Sanctum
            </h2>
            <p className="text-xs sm:text-sm text-[#FFFDF7]/70 mb-6">
              To view your child’s learning analytics and diagnostic skill reports, please solve the challenge below:
            </p>

            <form onSubmit={handleVerifyGate} className="space-y-4">
              <div className="bg-[#0D1020] p-4 rounded-2xl border border-[#333C6B] text-left">
                <label className="block text-xs font-bold text-[#2EC4B6] uppercase tracking-wider mb-2">
                  Adult Verification Math Challenge:
                </label>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-lg font-bold text-[#FFD166]">
                    {num1} × {num2} = ?
                  </span>
                  <input
                    type="number"
                    value={mathAnswer}
                    onChange={(e) => setMathAnswer(e.target.value)}
                    placeholder="Answer"
                    className="flex-1 px-3 py-2 rounded-xl bg-[#151930] border border-[#333C6B] text-sm text-[#FFFDF7] focus:border-[#FFD166] outline-none font-bold"
                  />
                </div>
              </div>

              <div className="text-xs text-gray-400 font-semibold">
                — OR ENTER 4-DIGIT PIN (DEFAULT: <span className="font-mono text-[#FFD166]">1234</span>) —
              </div>

              <input
                type="password"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="Enter 4-digit PIN..."
                maxLength={6}
                className="w-full px-4 py-2.5 rounded-xl bg-[#0D1020] border border-[#333C6B] text-center text-sm tracking-widest text-[#FFFDF7] focus:border-[#FFD166] outline-none"
              />

              {gateError && (
                <p className="text-xs font-bold text-[#FF9F68] animate-shake">
                  {gateError}
                </p>
              )}

              <button
                type="submit"
                className="w-full min-h-[48px] py-3.5 rounded-2xl gold-foil-button text-sm font-extrabold shadow-lg cursor-pointer flex items-center justify-center gap-2 hover:scale-102 transition-transform"
              >
                <Unlock className="w-4 h-4 text-[#1A1423]" />
                <span>Unlock Insights Dashboard</span>
              </button>
            </form>
          </div>
        ) : (
          /* Unlocked Parent & Teacher Analytics Insight Cards */
          <div>
            {/* Header */}
            <div className="border-b border-[#333C6B]/60 pb-5 mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2EC4B6]/20 border border-[#2EC4B6]/50 text-[#2EC4B6] text-xs font-bold uppercase tracking-wider mb-2">
                <ShieldCheck className="w-4 h-4" />
                <span>Verified Adult Dashboard</span>
              </div>
              <h1 className="font-storybook text-2xl sm:text-3xl font-extrabold text-[#FFFDF7]">
                {childProfile.name}'s Learning & Skill Insights
              </h1>
              <p className="text-xs sm:text-sm text-[#FFFDF7]/70 mt-1">
                Actionable comprehension analytics, diagnostic evaluations, and dinner-table conversation starters.
              </p>
            </div>

            {/* Card 6: Top Metric Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mb-8">
              {/* Metric 1: Comprehension Score */}
              <div className="bg-[#1A2040] p-4.5 rounded-2xl border border-[#FFD166]/30 shadow-md">
                <p className="text-2xl sm:text-3xl font-black text-[#FFD166]">{comprehensionScore}%</p>
                <p className="text-xs font-bold text-[#FFFDF7]/70 mt-1 uppercase tracking-wider">Comprehension Score</p>
              </div>

              {/* Metric 2: Story Quest Time */}
              <div className="bg-[#1A2040] p-4.5 rounded-2xl border border-[#2EC4B6]/30 shadow-md">
                <p className="text-2xl sm:text-3xl font-black text-[#2EC4B6]">{totalTimeMins} mins</p>
                <p className="text-xs font-bold text-[#FFFDF7]/70 mt-1 uppercase tracking-wider">Story Quest Time</p>
              </div>

              {/* Metric 3: Vocabulary Mastered */}
              <div className="bg-[#1A2040] p-4.5 rounded-2xl border border-[#7E69FF]/30 shadow-md">
                <p className="text-2xl sm:text-3xl font-black text-[#7E69FF]">{totalWords} Words</p>
                <p className="text-xs font-bold text-[#FFFDF7]/70 mt-1 uppercase tracking-wider">Vocabulary Mastered</p>
              </div>

              {/* Metric 4: Average Stars */}
              <div className="bg-[#1A2040] p-4.5 rounded-2xl border border-[#FF9F68]/30 shadow-md">
                <div className="flex items-center gap-1.5 text-2xl sm:text-3xl font-black text-[#FF9F68]">
                  <span>{avgStars}</span>
                  <Star className="w-5 h-5 fill-[#FF9F68]" />
                </div>
                <p className="text-xs font-bold text-[#FFFDF7]/70 mt-1 uppercase tracking-wider">Avg Star Rating</p>
              </div>
            </div>

            {/* Two-Column Insight Cards: Strengths Card & Growth Card */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
              {/* Strengths Card: Emerald Tinted */}
              <div className="rounded-3xl p-6 border-2 border-emerald-500/30 bg-emerald-950/20 shadow-lg">
                <div className="flex items-center gap-2 text-sm font-extrabold text-emerald-400 uppercase tracking-wider mb-3">
                  <CheckCircle className="w-5 h-5" />
                  <span>Strengths & Mastered Concepts</span>
                </div>
                <ul className="space-y-2.5 text-xs sm:text-sm text-[#FFFDF7]/90">
                  {allMastered.map((skill, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className="text-emerald-400 font-bold shrink-0 mt-0.5">✓</span>
                      <span className="leading-relaxed">{skill}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Growth Card: Amber Tinted */}
              <div className="rounded-3xl p-6 border-2 border-amber-500/30 bg-amber-950/20 shadow-lg">
                <div className="flex items-center gap-2 text-sm font-extrabold text-[#FF9F68] uppercase tracking-wider mb-3">
                  <Lightbulb className="w-5 h-5" />
                  <span>Growth Areas & Gentle Review</span>
                </div>
                <ul className="space-y-2.5 text-xs sm:text-sm text-[#FFFDF7]/90">
                  {allGrowth.map((area, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className="text-[#FF9F68] font-bold shrink-0 mt-0.5">💡</span>
                      <span className="leading-relaxed">{area}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Dinner Table Conversation Starters: Parchment Card */}
            <div className="bg-[#FFFDF7] text-[#2C2416] rounded-3xl p-6 sm:p-7 border-2 border-[#E8DCC4] shadow-md mb-8">
              <div className="flex items-center gap-2 text-sm font-black text-[#8C6D23] uppercase tracking-wider mb-2">
                <MessageCircle className="w-4 h-4 text-[#8C6D23]" />
                <span>Dinner Table Conversation Starters</span>
              </div>
              <p className="text-xs font-semibold text-[#665538] mb-4">
                Bridge the fairy tale into everyday wonder with these real-world discussion prompts:
              </p>
              <div className="space-y-3">
                {historyList[0]?.conversationStarters?.map((prompt, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-[#FAF5E6] border border-[#E0D1B0] text-xs sm:text-sm font-semibold italic text-[#2C2416] shadow-xs"
                  >
                    💬 "{prompt}"
                  </div>
                ))}
              </div>
            </div>

            {/* Completed Quests History & Certificate Printing */}
            <div>
              <h3 className="text-sm font-bold text-[#FFD166] uppercase tracking-wider mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Completed Quests & Printable Certificates:</span>
              </h3>

              <div className="space-y-3">
                {historyList.map((record) => {
                  const matchingStory =
                    MOCK_STORIES.find((s) => s.id === record.storyId) || MOCK_STORIES[0];

                  return (
                    <div
                      key={record.id}
                      className="bg-[#151933]/90 rounded-2xl p-4.5 border border-[#333C6B]/70 hover:border-amber-400/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md transition-all"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400/20 to-rose-400/20 border border-amber-400/40 flex items-center justify-center text-2xl shadow-inner">
                          {record.badgeIcon}
                        </div>
                        <div>
                          <h4 className="font-storybook text-sm sm:text-base font-bold text-white">
                            {record.title}
                          </h4>
                          <p className="text-xs text-teal-300 font-semibold">
                            Topic: {record.topic} • {record.completedAt}
                          </p>
                          <div className="flex items-center gap-1 text-xs text-amber-300 mt-0.5 font-bold">
                            {'★'.repeat(record.stars)} ({record.score}/{record.totalQuestions} trials correct)
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          sound.playStarChime();
                          onOpenPrintCertificate(matchingStory, record.stars);
                        }}
                        className="min-h-[48px] px-4 py-3 rounded-xl bg-[#2EC4B6]/20 hover:bg-[#2EC4B6] text-[#2EC4B6] hover:text-white border border-[#2EC4B6]/50 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm"
                      >
                        <Printer className="w-4 h-4" />
                        <span>Print Certificate</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
