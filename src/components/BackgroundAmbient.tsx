import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export const BackgroundAmbient: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: -500, y: -500 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Floating scientific glyphs with coordinate positions, scales and animations
  const symbols = [
    { char: 'π', top: '12%', left: '8%', size: 'text-4xl', duration: 9, delay: 0, opacity: 'opacity-20' },
    { char: 'Σ', top: '24%', right: '10%', size: 'text-5xl', duration: 11, delay: 1, opacity: 'opacity-15' },
    { char: '√', top: '45%', left: '6%', size: 'text-3xl', duration: 8, delay: 2, opacity: 'opacity-25' },
    { char: '∞', top: '65%', right: '8%', size: 'text-4xl', duration: 12, delay: 1.5, opacity: 'opacity-20' },
    { char: '∫', top: '78%', left: '12%', size: 'text-5xl', duration: 10, delay: 0.5, opacity: 'opacity-20' },
    { char: 'Δ', top: '82%', right: '14%', size: 'text-3xl', duration: 9.5, delay: 2.5, opacity: 'opacity-20' },
    { char: 'θ', top: '18%', left: '22%', size: 'text-2xl', duration: 7.5, delay: 3, opacity: 'opacity-15' },
    { char: 'λ', top: '35%', right: '18%', size: 'text-3xl', duration: 10.5, delay: 1.8, opacity: 'opacity-15' },
    { char: 'μ', top: '55%', left: '15%', size: 'text-2xl', duration: 8.5, delay: 0.8, opacity: 'opacity-15' },
    { char: '∂', top: '70%', left: '26%', size: 'text-3xl', duration: 11.5, delay: 2, opacity: 'opacity-15' },
    { char: 'φ', top: '28%', right: '28%', size: 'text-3xl', duration: 9, delay: 1.2, opacity: 'opacity-15' },
    { char: '∇', top: '85%', right: '25%', size: 'text-2xl', duration: 10, delay: 3.2, opacity: 'opacity-15' },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden select-none -z-10 bg-[#050507]">
      {/* Mathematical Coordinate Grid */}
      <div className="absolute inset-0 math-grid opacity-35" />

      {/* Primary Deep Purple Radial Glow Center Top */}
      <div 
        className="absolute -top-[15%] left-1/2 -translate-x-1/2 w-[900px] h-[650px] rounded-full blur-[140px] opacity-40"
        style={{
          background: 'radial-gradient(circle, rgba(124, 58, 237, 0.45) 0%, rgba(109, 40, 217, 0.2) 40%, rgba(5, 5, 7, 0) 75%)'
        }}
      />

      {/* Secondary Deep Blue / Indigo Bottom Glow */}
      <div 
        className="absolute -bottom-[10%] left-1/3 w-[800px] h-[550px] rounded-full blur-[150px] opacity-25"
        style={{
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.35) 0%, rgba(109, 40, 217, 0.15) 50%, rgba(5, 5, 7, 0) 80%)'
        }}
      />

      {/* Subtle Cyan Accent Orb Right */}
      <div 
        className="absolute top-1/3 -right-[100px] w-[500px] h-[500px] rounded-full blur-[160px] opacity-20"
        style={{
          background: 'radial-gradient(circle, rgba(6, 182, 212, 0.3) 0%, rgba(5, 5, 7, 0) 70%)'
        }}
      />

      {/* Interactive Cursor Glow Spotlight */}
      <div
        className="absolute w-[600px] h-[600px] rounded-full blur-[120px] transition-transform duration-300 ease-out will-change-transform opacity-25"
        style={{
          transform: `translate(${mousePos.x - 300}px, ${mousePos.y - 300}px)`,
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, rgba(124, 58, 237, 0.1) 40%, transparent 70%)',
        }}
      />

      {/* Floating Translucent Mathematical Symbols */}
      {symbols.map((item, idx) => (
        <motion.div
          key={idx}
          className={`absolute font-mono text-purple-300 font-light ${item.size} ${item.opacity} hidden md:block`}
          style={{
            top: item.top,
            left: item.left,
            right: item.right,
          }}
          animate={{
            y: [-10, 12, -10],
            rotate: [-4, 6, -4],
            opacity: [0.15, 0.28, 0.15],
          }}
          transition={{
            duration: item.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: item.delay,
          }}
        >
          {item.char}
        </motion.div>
      ))}

      {/* Delicate Vignette */}
      <div className="absolute inset-0 bg-radial from-transparent via-transparent to-[#050507]/80" />
    </div>
  );
};
