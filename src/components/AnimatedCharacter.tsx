import React, { useState } from 'react';
import type { CharacterAction } from '../types';
import { sound } from '../utils/audio';

interface AnimatedCharacterProps {
  avatarId: string;
  childName?: string;
  action?: CharacterAction;
  emotion?: 'idle' | 'happy' | 'thinking' | 'celebrating';
  onActionComplete?: () => void;
  interactive?: boolean; // When true, clicking triggers turnaround or sayHi
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  showSpeechBubble?: boolean;
  speechText?: string;
  className?: string;
}

export const AnimatedCharacter: React.FC<AnimatedCharacterProps> = ({
  avatarId,
  childName = 'Explorer',
  action = 'idle',
  emotion,
  onActionComplete,
  interactive = true,
  size = 'md',
  showSpeechBubble = false,
  speechText,
  className = '',
}) => {
  const resolvedAction: CharacterAction =
    action !== 'idle'
      ? action
      : emotion === 'celebrating'
      ? 'celebrate'
      : emotion === 'thinking'
      ? 'thinking'
      : emotion === 'happy'
      ? 'celebrate'
      : 'idle';

  const [internalAction, setInternalAction] = useState<CharacterAction>(resolvedAction);
  const [isWaving, setIsWaving] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [showInteractiveBubble, setShowInteractiveBubble] = useState(false);

  // Sync prop action
  React.useEffect(() => {
    setInternalAction(resolvedAction);
    if (resolvedAction === 'sayHi') {
      triggerWave();
    } else if (resolvedAction === 'turnaround') {
      triggerTurnaround();
    }
  }, [resolvedAction]);

  const sizeMap = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-36 h-36',
    xl: 'w-48 h-48',
    hero: 'w-56 h-56',
  };

  const triggerTurnaround = () => {
    sound.playStarChime(1.3);
    setIsSpinning(true);
    setTimeout(() => {
      setIsSpinning(false);
      onActionComplete?.();
    }, 950);
  };

  const triggerWave = () => {
    sound.playStarChime(1.1);
    setIsWaving(true);
    setShowInteractiveBubble(true);
    setTimeout(() => {
      setIsWaving(false);
      setTimeout(() => setShowInteractiveBubble(false), 2200);
      onActionComplete?.();
    }, 1200);
  };

  const handleClick = () => {
    if (!interactive) return;
    // Alternate between turnaround spin and saying hi
    if (!isSpinning && !isWaving) {
      if (Math.random() > 0.5) {
        triggerTurnaround();
      } else {
        triggerWave();
      }
    }
  };

  // Sticker decal contour filter with white outline and soft ambient shadow
  const stickerStyle = {
    filter:
      'drop-shadow(2px 0 0 #FFFFFF) drop-shadow(-2px 0 0 #FFFFFF) drop-shadow(0 2px 0 #FFFFFF) drop-shadow(0 -2px 0 #FFFFFF) drop-shadow(0 4px 12px rgba(10, 15, 40, 0.25))',
  };

  // Eye catchlights helper: can render circle or star catchlights
  const renderEyes = (options?: { starCatchlight?: boolean; eyeColor?: string }) => {
    const star = options?.starCatchlight;
    const color = options?.eyeColor || '#1B1E2B';

    return (
      <g className="animate-character-blink">
        {/* Left Eye */}
        <ellipse cx="37" cy="49" rx="5" ry="6.5" fill={color} />
        {star ? (
          <polygon
            points="36,45 37,47 39,47.5 37.5,49 38,51 36,50 34,51 34.5,49 33,47.5 35,47"
            fill="#FFFFFF"
          />
        ) : (
          <>
            <circle cx="35.5" cy="46.5" r="2.2" fill="#FFFFFF" />
            <circle cx="39.5" cy="51.5" r="1.1" fill="#FFFFFF" />
          </>
        )}
        <path d="M32 45 Q37 42 42 45" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" />

        {/* Right Eye */}
        <ellipse cx="63" cy="49" rx="5" ry="6.5" fill={color} />
        {star ? (
          <polygon
            points="62,45 63,47 65,47.5 63.5,49 64,51 62,50 60,51 60.5,49 59,47.5 61,47"
            fill="#FFFFFF"
          />
        ) : (
          <>
            <circle cx="61.5" cy="46.5" r="2.2" fill="#FFFFFF" />
            <circle cx="65.5" cy="51.5" r="1.1" fill="#FFFFFF" />
          </>
        )}
        <path d="M58 45 Q63 42 68 45" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      </g>
    );
  };

  // Waving hand element for sayHi action
  const renderWavingHand = (fillColor: string = '#FCD7B0') => {
    if (!isWaving) return null;
    return (
      <g className="animate-wave" style={{ transformOrigin: '82px 65px' }}>
        <path d="M80 65 Q88 50 90 40 Q94 38 93 45 Q96 46 94 52 Q95 56 90 60 Z" fill={fillColor} stroke="#FFFFFF" strokeWidth="1.5" />
        <circle cx="88" cy="42" r="2.5" fill={fillColor} />
      </g>
    );
  };

  const renderCharacterSvg = () => {
    switch (avatarId) {
      // 1. Oliver: Starlight Wizard
      case 'starlight_wizard':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full" style={stickerStyle}>
            {/* Blue Robe & Mantle */}
            <path d="M22 84 Q50 72 78 84 L80 100 L20 100 Z" fill="#3A5BA0" />
            <path d="M42 80 L50 88 L58 80 Z" fill="#FFD166" />
            {/* Neck */}
            <rect x="44" y="68" width="12" height="14" fill="#FCD7B0" rx="3" />
            {/* Ears */}
            <circle cx="20" cy="52" r="5" fill="#FCD7B0" />
            <circle cx="80" cy="52" r="5" fill="#FCD7B0" />
            {/* Head */}
            <circle cx="50" cy="52" r="29" fill="#FCD7B0" />
            {/* Rosy Blush */}
            <circle cx="31" cy="59" r="6" fill="#FFAAA6" opacity="0.7" />
            <circle cx="69" cy="59" r="6" fill="#FFAAA6" opacity="0.7" />
            {/* Round Blue Spectacles */}
            <circle cx="37" cy="49" r="9.5" fill="none" stroke="#2B4C8C" strokeWidth="2.5" />
            <circle cx="63" cy="49" r="9.5" fill="none" stroke="#2B4C8C" strokeWidth="2.5" />
            <line x1="46.5" y1="49" x2="53.5" y2="49" stroke="#2B4C8C" strokeWidth="2.5" />
            {/* Eyes */}
            {renderEyes({ starCatchlight: true })}
            {/* Smile */}
            <path d="M43 63 Q50 71 57 63" fill="none" stroke="#6A381F" strokeWidth="2.6" strokeLinecap="round" />
            {/* Brown Hair */}
            <path d="M22 46 C20 28 35 24 50 24 C65 24 80 28 78 46 C74 36 68 34 50 34 C32 34 26 36 22 46 Z" fill="#6D4C41" />
            {/* Star-Speckled Pointy Wizard Hat */}
            <path d="M12 40 Q50 34 88 40 L50 6 Z" fill="#283593" />
            <ellipse cx="50" cy="39" rx="38" ry="7" fill="#1A237E" />
            <polygon points="50,18 52,22 56,22 53,25 54,29 50,26 46,29 47,25 44,22 48,22" fill="#FFD166" />
            <circle cx="40" cy="28" r="1.5" fill="#FFD166" />
            <circle cx="60" cy="26" r="1.5" fill="#FFD166" />
            {renderWavingHand('#FCD7B0')}
          </svg>
        );

      // 2. Elira: Forest Elf
      case 'forest_elf':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full" style={stickerStyle}>
            {/* Green Leaf Tunic */}
            <path d="M22 84 Q50 72 78 84 L80 100 L20 100 Z" fill="#4E9F3D" />
            <path d="M40 82 Q50 90 60 82 Z" fill="#A8E6CF" />
            {/* Neck */}
            <rect x="44" y="68" width="12" height="14" fill="#FCE0C6" rx="3" />
            {/* Pointed Elf Ears */}
            <path d="M22 52 C12 48 8 36 12 34 C16 36 20 44 22 52 Z" fill="#FCE0C6" />
            <path d="M78 52 C88 48 92 36 88 34 C84 36 80 44 78 52 Z" fill="#FCE0C6" />
            {/* Head */}
            <circle cx="50" cy="52" r="29" fill="#FCE0C6" />
            {/* Soft Peach Blush */}
            <circle cx="31" cy="59" r="6" fill="#FFAAA6" opacity="0.75" />
            <circle cx="69" cy="59" r="6" fill="#FFAAA6" opacity="0.75" />
            {/* Eyes */}
            {renderEyes()}
            {/* Sweet Smile */}
            <path d="M44 63 Q50 70 56 63" fill="none" stroke="#5D3017" strokeWidth="2.5" strokeLinecap="round" />
            {/* Emerald Green Hair */}
            <path d="M18 46 C15 25 35 16 50 16 C65 16 85 25 82 46 C86 64 80 74 76 70 C74 58 76 40 74 36 C64 36 60 40 50 40 C40 40 36 36 26 36 C24 40 26 58 24 70 C20 74 14 64 18 46 Z" fill="#388E3C" />
            {/* Flower Blossom Crown */}
            <path d="M24 34 Q50 24 76 34" fill="none" stroke="#2E7D32" strokeWidth="2.5" />
            <circle cx="35" cy="30" r="3.5" fill="#FF80AB" />
            <circle cx="50" cy="27" r="4" fill="#FFD166" />
            <circle cx="65" cy="30" r="3.5" fill="#FF80AB" />
            {renderWavingHand('#FCE0C6')}
          </svg>
        );

      // 3. Ignis: Baby Dragon
      case 'baby_dragon':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full" style={stickerStyle}>
            {/* Dragon Wings */}
            <path d="M16 65 C8 55 10 38 22 45 Z" fill="#FFB085" />
            <path d="M84 65 C92 55 90 38 78 45 Z" fill="#FFB085" />
            {/* Orange Dragon Body */}
            <ellipse cx="50" cy="62" rx="34" ry="30" fill="#FF7B54" />
            {/* Soft Cream Belly Ridges */}
            <path d="M36 66 Q50 78 64 66 Q50 88 36 66 Z" fill="#FFE0B2" />
            <line x1="42" y1="72" x2="58" y2="72" stroke="#FF7B54" strokeWidth="1.5" />
            {/* Golden Dragon Horns */}
            <path d="M30 35 C26 22 34 16 38 24 Z" fill="#FFD166" />
            <path d="M70 35 C74 22 66 16 62 24 Z" fill="#FFD166" />
            {/* Cheeks */}
            <circle cx="28" cy="62" r="6" fill="#FF5252" opacity="0.4" />
            <circle cx="72" cy="62" r="6" fill="#FF5252" opacity="0.4" />
            {/* Eyes */}
            {renderEyes({ eyeColor: '#2D1B00' })}
            {/* Dragon Cute Nostrils & Smile */}
            <circle cx="46" cy="59" r="1.2" fill="#8D3B1B" />
            <circle cx="54" cy="59" r="1.2" fill="#8D3B1B" />
            <path d="M43 65 Q50 72 57 65" fill="none" stroke="#8D3B1B" strokeWidth="2.6" strokeLinecap="round" />
            {/* Cute Flame Puff on head */}
            <path d="M50 28 C47 20 53 14 50 10 C53 14 57 20 50 28 Z" fill="#FFD166" />
            {renderWavingHand('#FF7B54')}
          </svg>
        );

      // 4. Felix: Sky Explorer
      case 'sky_explorer':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full" style={stickerStyle}>
            {/* Aviator Jacket */}
            <path d="M22 84 Q50 74 78 84 L80 100 L20 100 Z" fill="#6D4C41" />
            <circle cx="50" cy="85" r="4.5" fill="#FFD166" stroke="#B37D28" strokeWidth="1.5" />
            {/* Neck */}
            <rect x="44" y="68" width="12" height="14" fill="#FCD7B0" rx="3" />
            {/* Ears */}
            <circle cx="20" cy="52" r="5" fill="#FCD7B0" />
            <circle cx="80" cy="52" r="5" fill="#FCD7B0" />
            {/* Head */}
            <circle cx="50" cy="52" r="29" fill="#FCD7B0" />
            {/* Cheeks */}
            <circle cx="31" cy="59" r="6" fill="#FFAAA6" opacity="0.65" />
            <circle cx="69" cy="59" r="6" fill="#FFAAA6" opacity="0.65" />
            {/* Eyes */}
            {renderEyes()}
            {/* Daring Smile */}
            <path d="M43 63 Q50 71 57 63" fill="none" stroke="#5D3017" strokeWidth="2.6" strokeLinecap="round" />
            {/* Leather Pilot Cap with Ear Flaps */}
            <path d="M18 46 C16 22 35 16 50 16 C65 16 84 22 82 46 C80 62 76 66 74 62 C74 42 76 34 50 34 C24 34 26 42 26 62 C24 66 20 62 18 46 Z" fill="#8D6E63" />
            {/* Aviator Goggles on forehead */}
            <rect x="26" y="24" width="20" height="11" rx="4" fill="#4E342E" stroke="#FFD166" strokeWidth="2" />
            <rect x="54" y="24" width="20" height="11" rx="4" fill="#4E342E" stroke="#FFD166" strokeWidth="2" />
            <circle cx="36" cy="29.5" r="4" fill="#81D4FA" opacity="0.8" />
            <circle cx="64" cy="29.5" r="4" fill="#81D4FA" opacity="0.8" />
            <line x1="46" y1="29.5" x2="54" y2="29.5" stroke="#FFD166" strokeWidth="2" />
            {renderWavingHand('#FCD7B0')}
          </svg>
        );

      // 5. Marina: Ocean Mermaid
      case 'ocean_mermaid':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full" style={stickerStyle}>
            {/* Shimmering Aqua Top */}
            <path d="M22 84 Q50 74 78 84 L80 100 L20 100 Z" fill="#2EC4B6" />
            {/* Neck */}
            <rect x="44" y="68" width="12" height="14" fill="#FCE0C6" rx="3" />
            {/* Ears & Pearl Earring */}
            <circle cx="20" cy="52" r="5" fill="#FCE0C6" />
            <circle cx="80" cy="52" r="5" fill="#FCE0C6" />
            <circle cx="80" cy="54" r="2" fill="#FFFDF7" />
            {/* Head */}
            <circle cx="50" cy="52" r="29" fill="#FCE0C6" />
            {/* Freckles */}
            <circle cx="43" cy="56" r="0.9" fill="#B37D28" />
            <circle cx="47" cy="57" r="0.9" fill="#B37D28" />
            <circle cx="53" cy="57" r="0.9" fill="#B37D28" />
            <circle cx="57" cy="56" r="0.9" fill="#B37D28" />
            {/* Cheeks */}
            <circle cx="31" cy="59" r="6" fill="#FF8E8E" opacity="0.65" />
            <circle cx="69" cy="59" r="6" fill="#FF8E8E" opacity="0.65" />
            {/* Eyes */}
            {renderEyes({ eyeColor: '#004D40' })}
            {/* Sweet Smile */}
            <path d="M43 63 Q50 70 57 63" fill="none" stroke="#5D3017" strokeWidth="2.5" strokeLinecap="round" />
            {/* Aqua Mermaid Hair */}
            <path d="M16 48 C14 24 35 15 50 15 C65 15 86 24 84 48 C88 72 80 82 76 76 C74 60 76 38 72 34 C64 34 60 38 50 38 C40 38 36 34 28 34 C24 38 26 60 24 76 C20 82 12 72 16 48 Z" fill="#00B4D8" />
            {/* Seashell Hairpiece */}
            <path d="M72 32 C78 28 84 34 78 40 Z" fill="#FF80AB" />
            <circle cx="75" cy="35" r="2" fill="#FFFDF7" />
            {renderWavingHand('#FCE0C6')}
          </svg>
        );

      // 6. Barnaby: Scholar Owl
      case 'scholar_owl':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full" style={stickerStyle}>
            {/* Owl Feathery Body */}
            <ellipse cx="50" cy="58" rx="34" ry="36" fill="#8D5B4C" />
            <path d="M38 68 Q50 76 62 68 Q50 88 38 68 Z" fill="#FFFDF7" opacity="0.9" />
            {/* Cheeks */}
            <circle cx="28" cy="58" r="6" fill="#FFAAA6" opacity="0.5" />
            <circle cx="72" cy="58" r="6" fill="#FFAAA6" opacity="0.5" />
            {/* Round Wire Spectacles */}
            <circle cx="36" cy="48" r="12" fill="#FFFDF7" stroke="#FFD166" strokeWidth="2.5" />
            <circle cx="64" cy="48" r="12" fill="#FFFDF7" stroke="#FFD166" strokeWidth="2.5" />
            <line x1="48" y1="48" x2="52" y2="48" stroke="#FFD166" strokeWidth="2.5" />
            {/* Eyes behind spectacles */}
            {renderEyes({ eyeColor: '#1B1E2B' })}
            {/* Golden Beak */}
            <polygon points="46,56 54,56 50,66" fill="#FFB703" />
            {/* Scholar Graduation Cap (Mortarboard) */}
            <polygon points="50,14 84,24 50,34 16,24" fill="#1B1F38" />
            <rect x="36" y="28" width="28" height="8" fill="#101426" rx="2" />
            <line x1="50" y1="24" x2="78" y2="34" stroke="#FFD166" strokeWidth="2" />
            <circle cx="78" cy="35" r="2.5" fill="#FFD166" />
            {renderWavingHand('#8D5B4C')}
          </svg>
        );

      // 7. Nova: Stargazer
      case 'stargazer':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full" style={stickerStyle}>
            {/* Stargazer Robe */}
            <path d="M22 84 Q50 74 78 84 L80 100 L20 100 Z" fill="#6C5CE7" />
            {/* Neck */}
            <rect x="44" y="68" width="12" height="14" fill="#FCD7B0" rx="3" />
            {/* Ears */}
            <circle cx="20" cy="52" r="5" fill="#FCD7B0" />
            <circle cx="80" cy="52" r="5" fill="#FCD7B0" />
            {/* Head */}
            <circle cx="50" cy="52" r="29" fill="#FCD7B0" />
            {/* Rosy Blush */}
            <circle cx="31" cy="59" r="6" fill="#FFAAA6" opacity="0.75" />
            <circle cx="69" cy="59" r="6" fill="#FFAAA6" opacity="0.75" />
            {/* Eyes with Glowing Star Catchlights */}
            {renderEyes({ starCatchlight: true, eyeColor: '#2C1B4D' })}
            {/* Cheerful Smile */}
            <path d="M43 63 Q50 71 57 63" fill="none" stroke="#5D3017" strokeWidth="2.6" strokeLinecap="round" />
            {/* Deep Violet Hair */}
            <path d="M18 46 C15 24 35 16 50 16 C65 16 85 24 82 46 C76 34 68 30 50 30 C32 30 24 34 18 46 Z" fill="#5F27CD" />
            <path d="M20 42 Q35 30 50 36 Q65 30 80 42 Z" fill="#4B1FA6" />
            {/* Golden Star Hairpins */}
            <polygon points="26,30 28,34 32,34 29,37 30,41 26,38 22,41 23,37 20,34 24,34" fill="#FFD166" />
            {renderWavingHand('#FCD7B0')}
          </svg>
        );

      // 8. Rowan: Faun Sprite
      case 'faun_sprite':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full" style={stickerStyle}>
            {/* Oak-leaf collar */}
            <path d="M22 84 Q50 74 78 84 L80 100 L20 100 Z" fill="#795548" />
            <path d="M38 80 L50 88 L62 80 Z" fill="#81C784" />
            {/* Neck */}
            <rect x="44" y="68" width="12" height="14" fill="#FCE0C6" rx="3" />
            {/* Pointed Faun Ears */}
            <path d="M22 52 C12 48 8 36 12 34 C16 36 20 44 22 52 Z" fill="#FCE0C6" />
            <path d="M78 52 C88 48 92 36 88 34 C84 36 80 44 78 52 Z" fill="#FCE0C6" />
            {/* Head */}
            <circle cx="50" cy="52" r="29" fill="#FCE0C6" />
            {/* Deer Antlers */}
            <path d="M34 28 C30 18 24 14 26 8 C28 14 36 16 38 24 Z" fill="#8D6E63" />
            <path d="M66 28 C70 18 76 14 74 8 C72 14 64 16 62 24 Z" fill="#8D6E63" />
            {/* Rosy Cheeks */}
            <circle cx="31" cy="59" r="6" fill="#FFAAA6" opacity="0.7" />
            <circle cx="69" cy="59" r="6" fill="#FFAAA6" opacity="0.7" />
            {/* Eyes */}
            {renderEyes()}
            {/* Mischievous Smile */}
            <path d="M43 63 Q52 70 58 63" fill="none" stroke="#5D3017" strokeWidth="2.6" strokeLinecap="round" />
            {/* Chestnut Mossy Hair */}
            <path d="M18 46 C15 25 35 18 50 18 C65 18 85 25 82 46 C76 35 68 32 50 32 C32 32 24 35 18 46 Z" fill="#A1887F" />
            {renderWavingHand('#FCE0C6')}
          </svg>
        );

      // 9. Celeste: Magic Unicorn
      case 'magic_unicorn':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full" style={stickerStyle}>
            {/* Shoulders */}
            <ellipse cx="50" cy="85" rx="36" ry="24" fill="#FFFDF7" />
            {/* Unicorn Head */}
            <circle cx="50" cy="52" r="30" fill="#FFFDF7" />
            {/* Cute Ears */}
            <polygon points="26,36 34,18 40,34" fill="#FFFDF7" />
            <polygon points="28,34 34,22 38,32" fill="#FF80AB" opacity="0.6" />
            <polygon points="74,36 66,18 60,34" fill="#FFFDF7" />
            <polygon points="72,34 66,22 62,32" fill="#FF80AB" opacity="0.6" />
            {/* Golden Spiral Horn */}
            <polygon points="46,30 54,30 50,6" fill="#FFD166" />
            <line x1="47" y1="24" x2="52" y2="20" stroke="#FFA000" strokeWidth="1.5" />
            <line x1="48" y1="16" x2="51" y2="12" stroke="#FFA000" strokeWidth="1.5" />
            {/* Pastel Rainbow Mane */}
            <path d="M18 46 C12 36 20 22 28 32 Z" fill="#FF80AB" />
            <path d="M78 44 C86 36 84 24 74 32 Z" fill="#80D8FF" />
            <path d="M22 62 C14 54 18 42 26 50 Z" fill="#B388FF" />
            {/* Cheeks */}
            <circle cx="31" cy="60" r="6" fill="#FF80AB" opacity="0.5" />
            <circle cx="69" cy="60" r="6" fill="#FF80AB" opacity="0.5" />
            {/* Eyes */}
            {renderEyes({ starCatchlight: true, eyeColor: '#303F9F' })}
            {/* Sweet Unicorn Smile */}
            <path d="M45 64 Q50 70 55 64" fill="none" stroke="#5D3017" strokeWidth="2.5" strokeLinecap="round" />
            {renderWavingHand('#FFFDF7')}
          </svg>
        );

      // 10. Lyra: Cosmic Sorceress
      case 'cosmic_sorceress':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full" style={stickerStyle}>
            {/* Cosmic Robe */}
            <path d="M22 84 Q50 74 78 84 L80 100 L20 100 Z" fill="#8E44AD" />
            <circle cx="50" cy="85" r="4" fill="#FFD166" />
            {/* Neck */}
            <rect x="44" y="68" width="12" height="14" fill="#FCD7B0" rx="3" />
            {/* Ears */}
            <circle cx="20" cy="52" r="5" fill="#FCD7B0" />
            <circle cx="80" cy="52" r="5" fill="#FCD7B0" />
            {/* Head */}
            <circle cx="50" cy="52" r="29" fill="#FCD7B0" />
            {/* Cheeks */}
            <circle cx="31" cy="59" r="6" fill="#FFAAA6" opacity="0.75" />
            <circle cx="69" cy="59" r="6" fill="#FFAAA6" opacity="0.75" />
            {/* Eyes */}
            {renderEyes({ starCatchlight: true, eyeColor: '#4A148C' })}
            {/* Smile */}
            <path d="M43 63 Q50 71 57 63" fill="none" stroke="#5D3017" strokeWidth="2.6" strokeLinecap="round" />
            {/* Glowing Nebula Galaxy Hair */}
            <path d="M16 48 C14 24 35 15 50 15 C65 15 86 24 84 48 C88 72 80 82 76 76 C74 60 76 38 72 34 C64 34 60 38 50 38 C40 38 36 34 28 34 C24 38 26 60 24 76 C20 82 12 72 16 48 Z" fill="#6A1B9A" />
            {/* Stardust Sprinkles on hair */}
            <circle cx="26" cy="30" r="1.5" fill="#FFD166" />
            <circle cx="72" cy="28" r="1.5" fill="#FFD166" />
            <circle cx="48" cy="22" r="2" fill="#FFD166" />
            <circle cx="78" cy="55" r="1.2" fill="#FFFFFF" />
            <circle cx="22" cy="58" r="1.2" fill="#FFFFFF" />
            {renderWavingHand('#FCD7B0')}
          </svg>
        );

      // 11. Pip: Celestial Aurora Fox
      case 'celestial_fox':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full" style={stickerStyle}>
            {/* Big Fox Ears */}
            <polygon points="18,18 42,42 18,48" fill="#E67E22" />
            <polygon points="22,24 38,42 22,45" fill="#FFFDF7" />
            <polygon points="82,18 58,42 82,48" fill="#E67E22" />
            <polygon points="78,24 62,42 78,45" fill="#FFFDF7" />
            {/* Fox Head */}
            <ellipse cx="50" cy="54" rx="36" ry="30" fill="#E67E22" />
            {/* White Face Mask */}
            <path d="M22 62 Q50 78 78 62 Q68 85 50 86 Q32 85 22 62 Z" fill="#FFFDF7" />
            {/* Purple Knit Scarf */}
            <path d="M26 80 Q50 90 74 80 L76 96 Q50 102 24 96 Z" fill="#6A1B9A" />
            {/* Black Nose */}
            <polygon points="46,72 54,72 50,77" fill="#1B1F38" />
            {/* Starlight Freckles */}
            <circle cx="34" cy="58" r="1.2" fill="#FFD166" />
            <circle cx="66" cy="58" r="1.2" fill="#FFD166" />
            {/* Cheeks */}
            <circle cx="30" cy="62" r="5" fill="#FF8E8E" opacity="0.4" />
            <circle cx="70" cy="62" r="5" fill="#FF8E8E" opacity="0.4" />
            {/* Eyes */}
            {renderEyes({ starCatchlight: true })}
            {renderWavingHand('#E67E22')}
          </svg>
        );

      // 12. Arthur: Brave Knight
      case 'brave_knight':
      default:
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full" style={stickerStyle}>
            {/* Plate Armor Shoulders */}
            <path d="M22 84 Q50 74 78 84 L80 100 L20 100 Z" fill="#78909C" />
            <circle cx="50" cy="85" r="3.5" fill="#ECEFF1" />
            {/* Neck */}
            <rect x="44" y="68" width="12" height="14" fill="#FCD7B0" rx="3" />
            {/* Ears */}
            <circle cx="20" cy="52" r="5" fill="#FCD7B0" />
            <circle cx="80" cy="52" r="5" fill="#FCD7B0" />
            {/* Head */}
            <circle cx="50" cy="52" r="29" fill="#FCD7B0" />
            {/* Cheeks */}
            <circle cx="31" cy="59" r="6" fill="#FFAAA6" opacity="0.75" />
            <circle cx="69" cy="59" r="6" fill="#FFAAA6" opacity="0.75" />
            {/* Eyes */}
            {renderEyes()}
            {/* Brave Smile */}
            <path d="M43 63 Q50 71 57 63" fill="none" stroke="#5D3017" strokeWidth="2.6" strokeLinecap="round" />
            {/* Silver Helmet with Raised Visor */}
            <path d="M20 44 C18 20 35 15 50 15 C65 15 82 20 80 44 C76 34 66 32 50 32 C34 32 24 34 20 44 Z" fill="#B0BEC5" />
            <rect x="24" y="28" width="52" height="10" rx="4" fill="#90A4AE" stroke="#ECEFF1" strokeWidth="1.5" />
            {/* Soft Pink Feather Plume on Top */}
            <path d="M50 16 C48 6 56 4 54 0 C50 6 44 8 50 16 Z" fill="#F48FB1" />
            {renderWavingHand('#FCD7B0')}
          </svg>
        );
    }
  };

  const currentSpeech =
    speechText || `Hi there, ${childName}! Ready for magic?`;

  return (
    <div
      onClick={handleClick}
      className={`relative inline-flex flex-col items-center select-none ${
        interactive ? 'cursor-pointer' : ''
      } ${className}`}
    >
      {/* Speech Bubble with Elastic Spring Animation */}
      {(showSpeechBubble || showInteractiveBubble) && (
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 z-30 w-52 bg-[#FFFDF7] text-[#1B1F38] text-xs font-extrabold rounded-2xl p-2.5 shadow-xl border-2 border-[#FFD166] text-center animate-speech-pop pointer-events-none">
          {currentSpeech}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-[#FFFDF7]" />
        </div>
      )}

      {/* Animated Character Base */}
      <div
        className={`${sizeMap[size]} transition-transform duration-300 relative flex items-center justify-center ${
          isSpinning
            ? 'animate-turnaround'
            : isWaving
            ? 'rotate-[-6deg]'
            : internalAction === 'celebrate'
            ? 'animate-bounce scale-110'
            : internalAction === 'thinking'
            ? 'rotate-[-4deg]'
            : 'animate-float hover:scale-105'
        }`}
      >
        {renderCharacterSvg()}

        {/* Golden star sparkles during turnaround spin */}
        {isSpinning && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <span className="absolute -top-2 left-4 text-[#FFD166] text-lg animate-ping">✨</span>
            <span className="absolute top-2 -right-2 text-[#FFD166] text-sm animate-ping">⭐</span>
            <span className="absolute -bottom-2 left-1/2 text-[#FFD166] text-base animate-ping">✨</span>
          </div>
        )}
      </div>
    </div>
  );
};
