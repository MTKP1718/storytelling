import React, { useEffect, useState } from 'react';

interface StarConfig {
  id: number;
  top: number; // Percentage
  left: number; // Percentage
  angle: number; // Degrees
  speed: number; // Seconds
  length: number; // Pixels
  delay: number; // Seconds
}

export const ShootingStars: React.FC = () => {
  const [stars, setStars] = useState<StarConfig[]>([]);

  useEffect(() => {
    // Generate an initial pool of looping shooting stars with staggered delays and varied trajectories
    const initialStars: StarConfig[] = [
      { id: 1, top: 10, left: 12, angle: 42, speed: 1.4, length: 150, delay: 0 },
      { id: 2, top: 20, left: 58, angle: 30, speed: 1.1, length: 120, delay: 2.5 },
      { id: 3, top: 8,  left: 78, angle: 55, speed: 1.7, length: 170, delay: 4.8 },
      { id: 4, top: 26, left: 28, angle: 24, speed: 1.3, length: 130, delay: 7.2 },
      { id: 5, top: 15, left: 45, angle: 65, speed: 1.5, length: 140, delay: 9.5 },
      { id: 6, top: 5,  left: 30, angle: 35, speed: 1.2, length: 160, delay: 11.8 },
    ];
    setStars(initialStars);

    // Periodically re-randomize positions and angles for infinite organic variety
    const interval = setInterval(() => {
      setStars((prev) =>
        prev.map((s) => ({
          ...s,
          top: Math.floor(Math.random() * 38) + 4,
          left: Math.floor(Math.random() * 70) + 5,
          angle: Math.floor(Math.random() * 40) + 25,
          delay: Math.random() * 2.5,
        }))
      );
    }, 9500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
      {stars.map((star) => (
        <span
          key={star.id}
          className="shooting-star-streak absolute block rounded-full"
          style={{
            top: `${star.top}%`,
            left: `${star.left}%`,
            width: `${star.length}px`,
            height: '2.5px',
            transform: `rotate(${star.angle}deg)`,
            animation: `streakPass ${star.speed}s cubic-bezier(0.25, 0.1, 0.25, 1) infinite`,
            animationDelay: `${star.delay}s`,
            background:
              'linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(255,209,102,0.9) 25%, rgba(165,243,252,0.7) 50%, rgba(91,66,243,0) 100%)',
            boxShadow: '0 0 14px 2px rgba(255, 255, 255, 0.85)',
          }}
        />
      ))}
    </div>
  );
};
