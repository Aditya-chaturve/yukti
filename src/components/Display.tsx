import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, CornerDownLeft, Sparkles } from 'lucide-react';
import { AngleMode } from '../utils/mathEngine';
import { soundController } from '../utils/audio';

interface DisplayProps {
  expression: string;
  result: string;
  livePreview: string | null;
  angleMode: AngleMode;
  setAngleMode: (mode: AngleMode) => void;
  memoryValue: number;
  errorMessage: string | null;
  isEvaluating: boolean;
  onRestorePrevious?: () => void;
  hasPreviousResult?: boolean;
}

export const Display: React.FC<DisplayProps> = ({
  expression,
  result,
  livePreview,
  angleMode,
  setAngleMode,
  memoryValue,
  errorMessage,
  isEvaluating,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  // Auto scroll expression container to right as user types
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }
  }, [expression]);

  const handleCopy = () => {
    const textToCopy = errorMessage ? expression : result || expression;
    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      soundController.playKeyClick();
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleModeChange = (mode: AngleMode) => {
    if (angleMode !== mode) {
      setAngleMode(mode);
      soundController.playOpClick();
    }
  };

  return (
    <div
      className={`relative w-full rounded-2xl glass-display p-4 sm:p-5 transition-all duration-300 ${
        isEvaluating ? 'ring-2 ring-purple-500/50 shadow-[0_0_30px_rgba(124,58,237,0.3)]' : ''
      } ${
        errorMessage ? 'ring-1 ring-rose-500/40 bg-rose-950/10' : ''
      }`}
    >
      {/* Top Status Bar in Display: Angle Modes (DEG/RAD/GRAD) + Memory Indicator + Copy */}
      <div className="flex items-center justify-between pb-2 border-b border-white/5 mb-3">
        {/* Angle Mode Selector */}
        <div className="flex items-center gap-1 p-0.5 rounded-lg bg-black/40 border border-white/5">
          {(['DEG', 'RAD', 'GRAD'] as AngleMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => handleModeChange(mode)}
              className={`px-2 py-0.5 text-[10px] font-mono font-medium rounded-md transition-all ${
                angleMode === mode
                  ? 'bg-gradient-to-r from-purple-600 to-purple-800 text-white shadow-[0_0_10px_rgba(124,58,237,0.4)] font-bold'
                  : 'text-neutral-500 hover:text-neutral-300'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>

        {/* Center: Memory Active Indicator & Status */}
        <div className="flex items-center gap-3">
          {/* Memory Indicator */}
          <div
            className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-mono transition-all border ${
              memoryValue !== 0
                ? 'bg-cyan-950/50 text-cyan-300 border-cyan-500/40 shadow-[0_0_10px_rgba(6,182,212,0.35)] font-bold'
                : 'text-neutral-600 border-transparent'
            }`}
            title={memoryValue !== 0 ? `Memory: ${memoryValue}` : 'Memory empty'}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${memoryValue !== 0 ? 'bg-cyan-400 shadow-[0_0_6px_#22D3EE]' : 'bg-neutral-700'}`} />
            <span>M</span>
          </div>

          {/* Precision Tag */}
          <div className="text-[10px] font-mono text-neutral-600 hidden sm:block">
            64-BIT PRECISION
          </div>
        </div>

        {/* Copy Action */}
        <button
          onClick={handleCopy}
          title="Copy calculation or result"
          className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono text-neutral-400 hover:text-purple-300 hover:bg-purple-500/10 border border-transparent hover:border-purple-500/20 transition-all"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-400">COPIED</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>COPY</span>
            </>
          )}
        </button>
      </div>

      {/* Main Display Canvas */}
      <div className="flex flex-col justify-end min-h-[90px] sm:min-h-[105px]">
        {/* Upper Area: Expression Input (Horizontal Scrolling with Gradient Edge) */}
        <div className="relative w-full overflow-hidden">
          <div
            ref={scrollRef}
            className="w-full overflow-x-auto whitespace-nowrap text-right font-mono-numbers text-sm sm:text-base text-neutral-400 tracking-wider pb-1 scrollbar-none transition-colors"
          >
            {expression ? (
              <span className="text-neutral-300 font-normal">
                {/* Format brackets and special symbols nicely */}
                {expression}
              </span>
            ) : (
              <span className="text-neutral-600 select-none">0</span>
            )}
          </div>
        </div>

        {/* Lower Area: Main Bold Result or Live Preview or Error */}
        <div className="relative w-full text-right mt-1 min-h-[44px] flex items-center justify-end overflow-hidden">
          <AnimatePresence mode="wait">
            {errorMessage ? (
              <motion.div
                key="error"
                initial={{ opacity: 0, x: 6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -6 }}
                transition={{ duration: 0.15 }}
                className="text-rose-400 font-mono text-base sm:text-xl font-medium tracking-wide flex items-center gap-2 justify-end"
              >
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                <span>{errorMessage}</span>
              </motion.div>
            ) : (
              <motion.div
                key={result}
                initial={{ opacity: 0.7, y: 3, scale: 0.99 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -3 }}
                transition={{ duration: 0.12, ease: "easeOut" }}
                className="w-full flex items-baseline justify-end gap-2 overflow-x-auto scrollbar-none"
              >
                {/* Live Preview Ghost Value if expression is being composed */}
                {livePreview && livePreview !== result && (
                  <span className="text-neutral-600 text-xs sm:text-sm font-mono font-light mr-1 flex items-center gap-1 hidden sm:flex">
                    <CornerDownLeft className="w-3 h-3 text-neutral-600" />
                    ≈ {livePreview}
                  </span>
                )}

                {/* Main Large Result Typography */}
                <span
                  className={`font-mono-numbers font-bold text-2xl sm:text-4xl md:text-[2.65rem] tracking-tight text-white transition-all select-all ${
                    isEvaluating ? 'text-purple-300 drop-shadow-[0_0_15px_rgba(167,139,250,0.6)]' : 'text-neutral-100'
                  }`}
                  style={{
                    textShadow: isEvaluating
                      ? '0 0 20px rgba(139, 92, 246, 0.6), 0 0 40px rgba(124, 58, 237, 0.3)'
                      : '0 2px 10px rgba(0, 0, 0, 0.5)'
                  }}
                >
                  {result || '0'}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
