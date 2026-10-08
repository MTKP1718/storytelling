import React, { useState } from 'react';
import { X, Copy, Check, Share2, MessageCircle, Mail, GraduationCap } from 'lucide-react';
import type { StoryWeaverBook } from '../data/storyWeaver150Books';
import { sound } from '../utils/audio';

const XTwitterIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

interface QuickShareModalProps {
  book: StoryWeaverBook | null;
  isOpen: boolean;
  onClose: () => void;
}

export const QuickShareModal: React.FC<QuickShareModalProps> = ({ book, isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !book) return null;

  const shareUrl = window.location.origin + `?book=${book.id}`;
  const shareText = `Check out "${book.title}" on StoryWeaver's 150 Books Campaign! A wonderful open-source children's storybook by ${book.author}.`;

  const handleCopyLink = () => {
    sound.playCorrectSparkle();
    navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const shareOptions = [
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      icon: MessageCircle,
      color: 'bg-emerald-600 hover:bg-emerald-500 text-white',
      url: `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText}\n${shareUrl}`)}`,
    },
    {
      id: 'classroom',
      name: 'Google Classroom',
      icon: GraduationCap,
      color: 'bg-amber-600 hover:bg-amber-500 text-white',
      url: `https://classroom.google.com/share?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(book.title)}`,
    },
    {
      id: 'twitter',
      name: 'Twitter / X',
      icon: XTwitterIcon,
      color: 'bg-slate-800 hover:bg-slate-700 text-white',
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
    },
    {
      id: 'email',
      name: 'Email Teacher / Parent',
      icon: Mail,
      color: 'bg-indigo-600 hover:bg-indigo-500 text-white',
      url: `mailto:?subject=${encodeURIComponent(`Free Storybook: ${book.title}`)}&body=${encodeURIComponent(`${shareText}\n\nRead online: ${shareUrl}`)}`,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div
        className="relative w-full max-w-md bg-[#14182E] text-white rounded-3xl p-6 sm:p-7 border-2 border-amber-400/40 shadow-2xl my-8 animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => {
            sound.playTilePlace();
            onClose();
          }}
          className="absolute top-4 right-4 min-w-[48px] min-h-[48px] w-12 h-12 rounded-full bg-[#242A4A] hover:bg-[#333C6B] text-white flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-amber-400/20 text-amber-300 flex items-center justify-center border border-amber-400/40">
            <Share2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-storybook text-xl font-bold text-white">Share This Story</h3>
            <p className="text-xs text-white/60">Inspire a young reader today</p>
          </div>
        </div>

        {/* Book Mini Card */}
        <div className="p-3.5 rounded-2xl bg-[#0D1020] border border-[#333C6B] mb-5 flex items-center gap-3">
          <div className="text-3xl p-2 rounded-xl bg-white/10">{book.coverTheme.iconEmoji}</div>
          <div className="min-w-0 flex-1">
            <h4 className="font-storybook font-bold text-white text-sm truncate">{book.title}</h4>
            <p className="text-xs text-amber-200/80">By {book.author}</p>
            <p className="text-[10px] text-teal-300">Level {book.level} • {book.languages.length} Languages</p>
          </div>
        </div>

        {/* Share buttons grid */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          {shareOptions.map((opt) => {
            const Icon = opt.icon;
            return (
              <a
                key={opt.id}
                href={opt.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => sound.playStarChime()}
                className={`min-h-[48px] p-3 rounded-2xl ${opt.color} flex items-center justify-center gap-2 font-bold text-xs shadow-md transition-all hover:scale-102 cursor-pointer`}
              >
                <Icon className="w-4 h-4" />
                <span>{opt.name}</span>
              </a>
            );
          })}
        </div>

        {/* Copy Link field */}
        <div className="p-2 rounded-2xl bg-[#0D1020] border border-[#333C6B] flex items-center gap-2">
          <input
            type="text"
            readOnly
            value={shareUrl}
            className="flex-1 bg-transparent px-3 text-xs text-white/80 font-mono outline-none truncate"
          />
          <button
            onClick={handleCopyLink}
            className="min-h-[40px] px-4 py-2 rounded-xl gold-foil-button text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-slate-950" />
                <span className="text-slate-950 font-black">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-950" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        {copied && (
          <p className="text-xs text-center text-teal-300 font-bold mt-2 animate-fade-in">
            ✨ Story link copied to clipboard! Ready to share with your class.
          </p>
        )}
      </div>
    </div>
  );
};
