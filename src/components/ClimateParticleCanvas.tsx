import React, { useEffect, useRef } from 'react';
import { useThemeMood } from '../context/ThemeMoodContext';

export const ClimateParticleCanvas: React.FC = () => {
  const { climate } = useThemeMood();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // 1. Sakura Petals Pool
    interface SakuraPetal {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      rotation: number;
      rotationSpeed: number;
      flutter: number;
      flutterSpeed: number;
      color: string;
      alpha: number;
    }
    const sakuraColors = ['#FFB7C5', '#FF9EAA', '#FFC0CB', '#FFAAA6', '#FCE7F3'];
    const sakuraList: SakuraPetal[] = Array.from({ length: 42 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 8 + 6,
      speedX: Math.random() * 1.4 + 0.8,
      speedY: Math.random() * 1.2 + 0.6,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.04,
      flutter: Math.random() * Math.PI * 2,
      flutterSpeed: Math.random() * 0.03 + 0.02,
      color: sakuraColors[Math.floor(Math.random() * sakuraColors.length)],
      alpha: Math.random() * 0.4 + 0.45,
    }));

    // 2. Tsuyu Rain Drops & Bottom Ripples Pool
    interface RainDrop {
      x: number;
      y: number;
      length: number;
      speedY: number;
      alpha: number;
    }
    interface RainRipple {
      x: number;
      y: number;
      radius: number;
      maxRadius: number;
      alpha: number;
    }
    const rainDrops: RainDrop[] = Array.from({ length: 75 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      length: Math.random() * 14 + 10,
      speedY: Math.random() * 9 + 12,
      alpha: Math.random() * 0.35 + 0.25,
    }));
    const ripples: RainRipple[] = [];

    // 3. Arashi Storm Heavy Rain & Ambient Sheet Lightning
    interface StormStreak {
      x: number;
      y: number;
      length: number;
      speedX: number;
      speedY: number;
      alpha: number;
    }
    const stormStreaks: StormStreak[] = Array.from({ length: 110 }, () => ({
      x: Math.random() * (width + 300) - 150,
      y: Math.random() * height,
      length: Math.random() * 22 + 16,
      speedX: Math.random() * 4 + 5, // whipped by wind
      speedY: Math.random() * 12 + 18,
      alpha: Math.random() * 0.4 + 0.3,
    }));
    let lightningFlash = 0; // 0 to 1
    let nextLightningTime = Date.now() + Math.random() * 6000 + 3000;

    // 4. Kaze Mountain Wind Gusts & Bamboo Leaves Pool
    interface WindGust {
      x: number;
      y: number;
      length: number;
      speedX: number;
      alpha: number;
      curve: number;
    }
    interface BambooLeaf {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      rot: number;
      rotSpeed: number;
      color: string;
    }
    const windGusts: WindGust[] = Array.from({ length: 12 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      length: Math.random() * 140 + 80,
      speedX: Math.random() * 4 + 3.5,
      alpha: Math.random() * 0.2 + 0.1,
      curve: (Math.random() - 0.5) * 30,
    }));
    const bambooLeaves: BambooLeaf[] = Array.from({ length: 24 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 7 + 6,
      speedX: Math.random() * 2.8 + 2.0,
      speedY: (Math.random() - 0.5) * 0.8,
      rot: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.05,
      color: Math.random() > 0.4 ? '#34D399' : '#FBBF24',
    }));

    // 5. Fuyu Snowflakes Pool
    interface Snowflake {
      x: number;
      y: number;
      radius: number;
      speedY: number;
      swayOffset: number;
      swaySpeed: number;
      alpha: number;
      isHex: boolean;
    }
    const snowflakes: Snowflake[] = Array.from({ length: 65 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 3.8 + 1.2,
      speedY: Math.random() * 1.1 + 0.4,
      swayOffset: Math.random() * Math.PI * 2,
      swaySpeed: Math.random() * 0.02 + 0.01,
      alpha: Math.random() * 0.5 + 0.35,
      isHex: Math.random() > 0.55,
    }));

    let frameCount = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      frameCount++;

      // ==========================================
      // CLIMATE 1: SAKURA SPRING
      // ==========================================
      if (climate === 'sakura_spring') {
        sakuraList.forEach((p) => {
          p.x += p.speedX;
          p.y += p.speedY;
          p.rotation += p.rotationSpeed;
          p.flutter += p.flutterSpeed;

          if (p.x > width + 20) p.x = -20;
          if (p.y > height + 20) p.y = -20;

          const flutterScale = Math.sin(p.flutter);

          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.scale(Math.abs(flutterScale) * 0.7 + 0.3, 1);

          // Draw natural sakura petal shape
          ctx.beginPath();
          ctx.moveTo(0, -p.size);
          ctx.bezierCurveTo(p.size * 0.7, -p.size * 0.7, p.size * 0.9, p.size * 0.3, 0, p.size);
          ctx.bezierCurveTo(-p.size * 0.9, p.size * 0.3, -p.size * 0.7, -p.size * 0.7, 0, -p.size);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha;
          ctx.fill();

          // Subtle central vein highlight
          ctx.beginPath();
          ctx.moveTo(0, -p.size * 0.7);
          ctx.lineTo(0, p.size * 0.4);
          ctx.strokeStyle = '#FFFFFF';
          ctx.globalAlpha = p.alpha * 0.4;
          ctx.lineWidth = 1;
          ctx.stroke();

          ctx.restore();
        });
      }

      // ==========================================
      // CLIMATE 2: TSUYU RAIN
      // ==========================================
      else if (climate === 'tsuyu_rain') {
        ctx.strokeStyle = 'rgba(186, 230, 253, 0.65)';
        ctx.lineWidth = 1.2;

        rainDrops.forEach((drop) => {
          ctx.beginPath();
          ctx.moveTo(drop.x, drop.y);
          ctx.lineTo(drop.x, drop.y + drop.length);
          ctx.globalAlpha = drop.alpha;
          ctx.stroke();

          drop.y += drop.speedY;
          if (drop.y > height - 15) {
            // Chance of creating a bottom ripple
            if (Math.random() > 0.6) {
              ripples.push({
                x: drop.x,
                y: height - Math.random() * 20,
                radius: 1,
                maxRadius: Math.random() * 14 + 8,
                alpha: 0.5,
              });
            }
            drop.y = -drop.length - Math.random() * 40;
            drop.x = Math.random() * width;
          }
        });

        // Draw and update bottom water ripples
        for (let i = ripples.length - 1; i >= 0; i--) {
          const r = ripples[i];
          r.radius += 0.8;
          r.alpha -= 0.025;

          if (r.alpha <= 0 || r.radius >= r.maxRadius) {
            ripples.splice(i, 1);
            continue;
          }

          ctx.save();
          ctx.beginPath();
          ctx.ellipse(r.x, r.y, r.radius, r.radius * 0.35, 0, 0, Math.PI * 2);
          ctx.strokeStyle = '#38BDF8';
          ctx.globalAlpha = r.alpha;
          ctx.lineWidth = 1;
          ctx.stroke();
          ctx.restore();
        }
      }

      // ==========================================
      // CLIMATE 3: ARASHI STORM
      // ==========================================
      else if (climate === 'arashi_storm') {
        // Check for ambient sheet lightning flash
        const now = Date.now();
        if (now > nextLightningTime) {
          lightningFlash = 0.38;
          nextLightningTime = now + Math.random() * 9000 + 6000;
        }

        // Draw ambient sheet lightning wash
        if (lightningFlash > 0.01) {
          ctx.save();
          ctx.fillStyle = 'rgba(224, 242, 254, 1)';
          ctx.globalAlpha = lightningFlash;
          ctx.fillRect(0, 0, width, height);
          ctx.restore();
          lightningFlash *= 0.86; // fast decay
        }

        // Wind-whipped angled heavy rain
        ctx.strokeStyle = 'rgba(199, 210, 254, 0.7)';
        ctx.lineWidth = 1.5;

        stormStreaks.forEach((s) => {
          ctx.beginPath();
          ctx.moveTo(s.x, s.y);
          ctx.lineTo(s.x + s.speedX * 1.4, s.y + s.length);
          ctx.globalAlpha = s.alpha;
          ctx.stroke();

          s.x += s.speedX;
          s.y += s.speedY;

          if (s.y > height || s.x > width + 100) {
            s.y = -s.length - Math.random() * 30;
            s.x = Math.random() * (width + 200) - 150;
          }
        });
      }

      // ==========================================
      // CLIMATE 4: KAZE MOUNTAIN WIND
      // ==========================================
      else if (climate === 'kaze_mountain_wind') {
        // Draw graceful horizontal wind gust ribbons
        windGusts.forEach((g) => {
          ctx.save();
          ctx.beginPath();
          ctx.moveTo(g.x, g.y);
          ctx.quadraticCurveTo(
            g.x + g.length * 0.5,
            g.y + g.curve,
            g.x + g.length,
            g.y
          );
          ctx.strokeStyle = '#E0F2FE';
          ctx.lineWidth = 1.4;
          ctx.globalAlpha = g.alpha;
          ctx.stroke();
          ctx.restore();

          g.x += g.speedX;
          if (g.x > width + 50) {
            g.x = -g.length - 20;
            g.y = Math.random() * height;
          }
        });

        // Floating bamboo leaves & golden embers
        bambooLeaves.forEach((leaf) => {
          leaf.x += leaf.speedX;
          leaf.y += leaf.speedY + Math.sin(frameCount * 0.04 + leaf.x * 0.01) * 0.6;
          leaf.rot += leaf.rotSpeed;

          if (leaf.x > width + 20) {
            leaf.x = -20;
            leaf.y = Math.random() * height;
          }

          ctx.save();
          ctx.translate(leaf.x, leaf.y);
          ctx.rotate(leaf.rot);

          // Slender bamboo leaf shape
          ctx.beginPath();
          ctx.ellipse(0, 0, leaf.size, leaf.size * 0.35, 0, 0, Math.PI * 2);
          ctx.fillStyle = leaf.color;
          ctx.globalAlpha = 0.55;
          ctx.fill();

          ctx.restore();
        });
      }

      // ==========================================
      // CLIMATE 5: FUYU SNOW
      // ==========================================
      else if (climate === 'fuyu_snow') {
        snowflakes.forEach((s) => {
          s.y += s.speedY;
          s.x += Math.sin(frameCount * s.swaySpeed + s.swayOffset) * 0.7;

          if (s.y > height + 10) {
            s.y = -10;
            s.x = Math.random() * width;
          }
          if (s.x > width + 10) s.x = -10;
          if (s.x < -10) s.x = width + 10;

          ctx.save();
          ctx.translate(s.x, s.y);
          ctx.globalAlpha = s.alpha;

          if (s.isHex && s.radius > 2.5) {
            // Little 6-point crystal snowflake
            ctx.strokeStyle = '#FFFFFF';
            ctx.lineWidth = 1;
            for (let i = 0; i < 3; i++) {
              ctx.rotate(Math.PI / 3);
              ctx.beginPath();
              ctx.moveTo(-s.radius, 0);
              ctx.lineTo(s.radius, 0);
              ctx.stroke();
            }
          } else {
            // Soft glowing circular snow dot
            ctx.beginPath();
            ctx.arc(0, 0, s.radius, 0, Math.PI * 2);
            ctx.fillStyle = '#FFFFFF';
            ctx.shadowColor = '#93C5FD';
            ctx.shadowBlur = 6;
            ctx.fill();
          }

          ctx.restore();
        });
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, [climate]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-[1]" />;
};
