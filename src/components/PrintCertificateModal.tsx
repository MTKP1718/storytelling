import React from 'react';
import { X, Printer, Sparkles } from 'lucide-react';
import type { Story, ChildProfile } from '../types';
import { sound } from '../utils/audio';

interface PrintCertificateModalProps {
  story: Story;
  childProfile: ChildProfile;
  starsEarned?: number;
  onClose: () => void;
}

export const PrintCertificateModal: React.FC<PrintCertificateModalProps> = ({
  story,
  childProfile,
  starsEarned = 5,
  onClose,
}) => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const handlePrint = () => {
    sound.playStarChime();
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-y-auto">
      {/* Container */}
      <div className="relative w-full max-w-3xl bg-[#FFFDF7] text-[#1B1F38] rounded-3xl p-6 sm:p-10 shadow-2xl border-4 border-[#C49746] my-8 animate-scale-up">
        {/* Modal Controls Bar (Hidden during print) */}
        <div className="no-print flex items-center justify-between border-b-2 border-[#EADBBA] pb-4 mb-6">
          <div className="flex items-center gap-2 text-xs font-bold text-[#8C6D23] uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-[#FB8500]" />
            <span>Printable Official Certificate of Bravery & Wisdom</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="min-h-[48px] flex items-center gap-2 px-5 py-2.5 rounded-xl gold-foil-button text-xs font-extrabold shadow-md cursor-pointer hover:scale-102 transition-transform"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save PDF</span>
            </button>

            <button
              onClick={() => {
                sound.playTilePlace();
                onClose();
              }}
              className="min-w-[48px] min-h-[48px] w-12 h-12 rounded-full bg-[#EADBBA]/60 hover:bg-[#FFD166] flex items-center justify-center text-[#2D283E] transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Certificate Page */}
        <div className="certificate-page relative bg-[#FFFDF7] p-8 sm:p-12 border-8 border-double border-[#C49746] rounded-2xl text-center shadow-inner">
          {/* Ornate Gold Corner Borders */}
          <div className="absolute top-2 left-2 text-[#C49746] text-xl font-serif">❖</div>
          <div className="absolute top-2 right-2 text-[#C49746] text-xl font-serif">❖</div>
          <div className="absolute bottom-2 left-2 text-[#C49746] text-xl font-serif">❖</div>
          <div className="absolute bottom-2 right-2 text-[#C49746] text-xl font-serif">❖</div>

          {/* Certificate Header */}
          <div className="mb-4">
            <p className="font-serif uppercase tracking-[0.25em] text-[#8C6D23] text-xs font-bold mb-1">
              The Grand Academy of Story Teacher
            </p>
            <h1 className="font-storybook text-3xl sm:text-4xl font-extrabold text-[#1B1F38] tracking-wider uppercase">
              Certificate of Bravery & Wisdom
            </h1>
            <div className="w-32 h-1 bg-gradient-to-r from-transparent via-[#C49746] to-transparent mx-auto mt-2" />
          </div>

          {/* Award Recipient Proclamation */}
          <div className="my-6">
            <p className="font-serif italic text-sm text-[#4E4466] mb-2">
              This royal citation is proudly bestowed upon
            </p>
            <h2 className="font-storybook text-3xl sm:text-5xl font-black text-[#5B42F3] tracking-wide mb-3 underline decoration-[#FFD166] decoration-4 underline-offset-8">
              {childProfile.name || 'Noble Hero'}
            </h2>
            <p className="font-serif text-sm sm:text-base text-[#2D283E] max-w-xl mx-auto leading-relaxed mt-4">
              For displaying courageous inquiry, remarkable persistence, and supreme scholarship in conquering the enchanted tale of
            </p>
            <p className="font-storybook text-xl sm:text-2xl font-extrabold text-[#B37D28] mt-2">
              "{story.title}"
            </p>
            <p className="text-xs font-bold text-[#1F8E84] uppercase tracking-widest mt-1">
              School Concept Mastered: {story.topic}
            </p>
          </div>

          {/* Golden Seal & Stars */}
          <div className="my-6 flex items-center justify-center gap-6">
            {/* Themed Badge Stamp */}
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#FFD166] to-[#FB8500] border-4 border-white shadow-md flex items-center justify-center text-4xl">
              {story.badge.icon}
            </div>

            <div className="text-left">
              <div className="flex items-center gap-1 text-[#FB8500] text-lg mb-1">
                {'★'.repeat(starsEarned)}{'☆'.repeat(5 - starsEarned)}
              </div>
              <p className="font-serif text-xs font-bold text-[#1B1F38]">
                Badge Awarded: {story.badge.title}
              </p>
              <p className="text-[11px] text-gray-600 italic">
                Official Quest Seal of Arboria
              </p>
            </div>
          </div>

          {/* Signatures & Date Line */}
          <div className="mt-8 pt-6 border-t border-[#EADBBA] grid grid-cols-2 gap-8 text-xs font-serif text-[#4E4466]">
            <div>
              <div className="border-b border-[#1B1F38] pb-1 font-cursive text-base text-[#1B1F38] min-h-[24px]">
                {childProfile.name ? `Mentor of ${childProfile.name}` : 'Parent / Teacher'}
              </div>
              <p className="mt-1 uppercase tracking-wider font-bold text-[10px]">
                Parent / Teacher Signature
              </p>
            </div>

            <div>
              <div className="border-b border-[#1B1F38] pb-1 font-mono text-xs text-[#1B1F38] min-h-[24px]">
                {currentDate}
              </div>
              <p className="mt-1 uppercase tracking-wider font-bold text-[10px]">
                Date of Conferral
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
