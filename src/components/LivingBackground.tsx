import React, { useEffect, useRef } from 'react';
import type { WorldThemeId } from '../types';
import { useThemeMood } from '../context/ThemeMoodContext';
import { ClimateParticleCanvas } from './ClimateParticleCanvas';
import { ShootingStars } from './ShootingStars';

interface LivingBackgroundProps {
  theme?: WorldThemeId;
}

export const LivingBackground: React.FC<LivingBackgroundProps> = ({ theme = 'tree_kingdom' }) => {
  const { timeOfDay } = useThemeMood();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Particle pool tailored to theme
    interface Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      maxOpacity: number;
      glowColor: string;
      pulseRate: number;
      pulseAngle: number;
      type: 'firefly' | 'star' | 'bubble' | 'leaf';
    }

    const particleCount = 42;
    const particles: Particle[] = [];

    const getThemeColors = () => {
      switch (theme) {
        case 'cosmic_quest':
          return {
            glows: ['#5B42F3', '#FFD166', '#A29BFE', '#74B9FF'],
            type: 'star' as const,
          };
        case 'ocean_whispers':
          return {
            glows: ['#2EC4B6', '#70A1FF', '#7BED9F', '#2ED573'],
            type: 'bubble' as const,
          };
        case 'detective_guild':
          return {
            glows: ['#FFD166', '#FFA502', '#CED6E0', '#FF9F68'],
            type: 'firefly' as const,
          };
        case 'tree_kingdom':
        default:
          return {
            glows: ['#FFD166', '#2EC4B6', '#FF9F68', '#A8E6CF'],
            type: 'firefly' as const,
          };
      }
    };

    const { glows, type } = getThemeColors();

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 3.5 + 1.2,
        speedX: (Math.random() - 0.5) * 0.45,
        speedY: type === 'bubble' ? -Math.random() * 0.7 - 0.2 : (Math.random() - 0.5) * 0.4,
        opacity: Math.random() * 0.6 + 0.2,
        maxOpacity: Math.random() * 0.4 + 0.4,
        glowColor: glows[Math.floor(Math.random() * glows.length)],
        pulseRate: Math.random() * 0.04 + 0.015,
        pulseAngle: Math.random() * Math.PI * 2,
        type,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Render subtle ambient light cone from top-left (warm arched window light)
      const grad = ctx.createRadialGradient(
        width * 0.15,
        height * 0.05,
        10,
        width * 0.2,
        height * 0.2,
        Math.max(width, height) * 0.8
      );
      grad.addColorStop(0, 'rgba(255, 209, 102, 0.08)');
      grad.addColorStop(0.4, 'rgba(91, 66, 243, 0.04)');
      grad.addColorStop(1, 'rgba(16, 20, 38, 0)');

      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Draw particles
      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.pulseAngle += p.pulseRate;

        // Wrap around boundaries
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;

        const currentOpacity =
          Math.max(0.1, Math.min(p.maxOpacity, Math.sin(p.pulseAngle) * 0.4 + 0.5));

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);

        // Soft outer glow
        ctx.shadowColor = p.glowColor;
        ctx.shadowBlur = 10;
        ctx.fillStyle = p.glowColor;
        ctx.globalAlpha = currentOpacity;
        ctx.fill();

        // White core highlight
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 0.45, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFDF7';
        ctx.globalAlpha = currentOpacity * 0.9;
        ctx.fill();

        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  const getTimeGradients = () => {
    switch (timeOfDay) {
      case 'morning':
        return {
          baseGradient: 'from-[#0F172A] via-[#1E293B] to-[#0A0F1D]',
          overlay: 'bg-gradient-to-tr from-[#FCE7F3]/12 via-[#E0F2FE]/10 to-[#FEF08A]/12',
          windowLight: 'radial-gradient(circle, rgba(254, 240, 138, 0.35) 0%, rgba(252, 231, 243, 0.25) 50%, transparent 80%)',
          ambientGlow: 'radial-gradient(circle, rgba(224, 242, 254, 0.3) 0%, rgba(56, 189, 248, 0.18) 60%, transparent 80%)',
        };
      case 'evening':
        return {
          baseGradient: 'from-[#0F172A] via-[#1E1B4B] to-[#120D1D]',
          overlay: 'bg-gradient-to-tr from-[#F97316]/15 via-[#4C1D95]/20 to-[#FDBA74]/12',
          windowLight: 'radial-gradient(circle, rgba(249, 115, 22, 0.4) 0%, rgba(253, 186, 116, 0.25) 50%, transparent 80%)',
          ambientGlow: 'radial-gradient(circle, rgba(147, 51, 234, 0.3) 0%, rgba(76, 29, 149, 0.25) 60%, transparent 80%)',
        };
      case 'night':
      default:
        return {
          baseGradient: 'from-[#0B0F19] via-[#161B33] to-[#070A12]',
          overlay: 'bg-gradient-to-tr from-[#5B42F3]/15 via-[#1B1F38]/25 to-[#FFD166]/10',
          windowLight: 'radial-gradient(circle, rgba(255, 209, 102, 0.25) 0%, rgba(255, 159, 104, 0.18) 50%, transparent 80%)',
          ambientGlow: 'radial-gradient(circle, rgba(91, 66, 243, 0.22) 0%, rgba(126, 105, 255, 0.15) 60%, transparent 80%)',
        };
    }
  };

  const currentGradients = getTimeGradients();

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden transition-colors duration-1000">
      {/* Dynamic Base Radial/Linear Background Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-b ${currentGradients.baseGradient}`} />
      <div className={`absolute inset-0 ${currentGradients.overlay}`} />

      {/* Arched Window / Sky light beam */}
      <div
        className="absolute -top-32 -left-32 w-96 h-96 rounded-full blur-3xl opacity-35 pointer-events-none transition-all duration-1000"
        style={{ background: currentGradients.windowLight }}
      />

      {/* Magic secondary ambient glow */}
      <div
        className="absolute top-1/3 -right-32 w-96 h-96 rounded-full blur-3xl opacity-30 pointer-events-none transition-all duration-1000"
        style={{ background: currentGradients.ambientGlow }}
      />

      {/* Shooting Stars Overlay */}
      <ShootingStars />

      {/* Real-time Japanese Climate Canvas Particle Overlay (Sakura, Tsuyu Rain, Storm, Wind, Snow) */}
      <ClimateParticleCanvas />

      {/* Theme specific background particle simulation (fireflies, starlight, bubbles) */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-[2]" />

      {/* Enchanted bottom woodland vignette with glowing mushroom silhouettes */}
      <div className="absolute bottom-0 left-0 right-0 h-28 pointer-events-none flex items-end justify-between px-6 opacity-30">
        <svg className="w-16 h-14 text-[#2EC4B6] animate-float-slow" viewBox="0 0 100 100" fill="currentColor">
          <ellipse cx="50" cy="40" rx="36" ry="24" fill="#2EC4B6" />
          <circle cx="35" cy="35" r="4" fill="#FFFDF7" opacity="0.8" />
          <circle cx="65" cy="32" r="5" fill="#FFFDF7" opacity="0.8" />
          <circle cx="50" cy="48" r="3.5" fill="#FFFDF7" opacity="0.8" />
          <path d="M44 40 L44 80 Q50 85 56 80 L56 40 Z" fill="#EAE5D9" />
        </svg>

        <svg className="w-12 h-10 text-[#FFD166] animate-float" viewBox="0 0 100 100" fill="currentColor">
          <ellipse cx="50" cy="40" rx="28" ry="18" fill="#FFD166" />
          <circle cx="40" cy="36" r="3" fill="#FFFDF7" opacity="0.8" />
          <circle cx="60" cy="36" r="3" fill="#FFFDF7" opacity="0.8" />
          <path d="M46 40 L46 75 Q50 78 54 75 L54 40 Z" fill="#EAE5D9" />
        </svg>

        <svg className="w-14 h-12 text-[#FF9F68] animate-float-slow" viewBox="0 0 100 100" fill="currentColor">
          <ellipse cx="50" cy="40" rx="32" ry="20" fill="#FF9F68" />
          <circle cx="38" cy="35" r="4" fill="#FFFDF7" opacity="0.8" />
          <circle cx="62" cy="38" r="3.5" fill="#FFFDF7" opacity="0.8" />
          <path d="M45 40 L45 78 Q50 82 55 78 L55 40 Z" fill="#EAE5D9" />
        </svg>
      </div>
    </div>
  );
};
