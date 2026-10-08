import React from 'react';
import { Volume2, X, Sparkles, Lightbulb } from 'lucide-react';
import type { ConceptDefinition } from '../types';
import { sound } from '../utils/audio';
import { tts } from '../utils/tts';

interface ConceptDefinitionModalProps {
  concept: ConceptDefinition | null;
  onClose: () => void;
}

export const ConceptDefinitionModal: React.FC<ConceptDefinitionModalProps> = ({
  concept,
  onClose,
}) => {
  if (!concept) return null;

  const handleSpeak = () => {
    sound.playStarChime();
    tts.speakWord(`${concept.word}. ${concept.definition}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-md parchment-card rounded-3xl p-6 sm:p-7 shadow-2xl border-4 border-[#FFD166] animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={() => {
            sound.playTilePlace();
            onClose();
          }}
          className="absolute top-3 right-3 min-w-[48px] min-h-[48px] w-12 h-12 rounded-full bg-[#EADBBA]/60 hover:bg-[#FFD166] text-[#2D283E] flex items-center justify-center transition-colors shadow-sm cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with Icon and Word */}
        <div className="flex items-center gap-3.5 mb-4 pr-12">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#FFD166] to-[#FF9F68] flex items-center justify-center text-3xl shadow-md border-2 border-white shrink-0">
            {concept.icon || '✨'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-storybook text-2xl font-bold text-[#1B1F38]">
                {concept.word}
              </h3>
              <button
                onClick={handleSpeak}
                className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full bg-[#5B42F3]/10 hover:bg-[#5B42F3]/25 text-[#5B42F3] transition-colors cursor-pointer"
                title="Hear pronunciation"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs font-semibold tracking-wide text-[#7E69FF]">
              Pronounced: <span className="font-mono bg-[#EADBBA]/50 px-1.5 py-0.5 rounded text-[#2D283E]">{concept.phonics}</span>
            </p>
          </div>
        </div>

        {/* Definition card */}
        <div className="bg-white/80 rounded-2xl p-4 mb-4 border border-[#EADBBA] shadow-inner">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#FB8500] uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Child-Friendly Meaning</span>
          </div>
          <p className="text-[#1B1F38] text-base sm:text-lg leading-relaxed font-semibold">
            {concept.definition}
          </p>
        </div>

        {/* Real-World Child Analogy */}
        {concept.analogy && (
          <div className="bg-[#2EC4B6]/10 rounded-2xl p-4 border border-[#2EC4B6]/30">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#1F8E84] uppercase tracking-wider mb-1">
              <Lightbulb className="w-3.5 h-3.5" />
              <span>Picture It In Real Life</span>
            </div>
            <p className="text-[#1B1F38] text-sm sm:text-base italic leading-relaxed">
              "{concept.analogy}"
            </p>
          </div>
        )}

        {/* Got it action button */}
        <div className="mt-5 text-center">
          <button
            onClick={() => {
              sound.playStarChime();
              onClose();
            }}
            className="w-full min-h-[48px] py-3.5 px-6 rounded-2xl gold-foil-button text-base font-bold shadow-md cursor-pointer"
          >
            I Understand This Magic Word! ✨
          </button>
        </div>
      </div>
    </div>
  );
};
