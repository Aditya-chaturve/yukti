import React from 'react';
import { Sparkles } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="w-full max-w-3xl mx-auto pt-6 pb-2 px-4 flex flex-col items-center">
      {/* Minimal Floating Header Bar */}
      <div className="w-full flex items-center justify-between py-2.5 px-5 sm:px-6 rounded-2xl bg-[#0B0B10]/80 backdrop-blur-xl border border-white/6 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
        {/* Left: YUKTI Logo + Wordmark */}
        <div className="flex items-center gap-2.5">
          <div className="relative w-8 h-8 rounded-xl overflow-hidden shadow-[0_0_15px_rgba(124,58,237,0.45)] border border-purple-400/30">
            <img 
              src="/yukti-logo.png" 
              alt="YUKTI Logo" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-extrabold tracking-widest text-base sm:text-lg text-white font-sans">
              YUKTI
            </span>
            <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-purple-500/10 border border-purple-500/25 text-purple-300 font-mono hidden sm:inline-block">
              CALCULATOR
            </span>
          </div>
        </div>

        {/* Right: Minimal Status Tag (Subtle & Non-intrusive) */}
        <div className="flex items-center gap-2 text-xs text-neutral-400 font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34D399]" />
          <span className="text-[11px] text-neutral-400 hidden sm:inline tracking-wider">
            SCIENTIFIC ENGINE
          </span>
        </div>
      </div>

      {/* Main Title & Subtitle Below Header */}
      <div className="mt-5 mb-2 text-center">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-white flex items-center justify-center gap-2">
          <span>SCIENTIFIC CALCULATOR</span>
          <span className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_8px_#8B5CF6]" />
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-neutral-400 font-light tracking-wide">
          “From everyday arithmetic to advanced mathematics.”
        </p>
      </div>
    </header>
  );
};
