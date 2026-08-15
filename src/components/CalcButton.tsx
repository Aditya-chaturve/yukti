import React from 'react';
import { motion } from 'framer-motion';

export type ButtonVariant = 
  | 'number' 
  | 'scientific' 
  | 'operator' 
  | 'memory' 
  | 'clear' 
  | 'equals' 
  | 'bracket'
  | 'constant';

interface CalcButtonProps {
  label: React.ReactNode;
  subLabel?: string;
  onClick: () => void;
  variant?: ButtonVariant;
  className?: string;
  span?: string;
  isActive?: boolean;
  disabled?: boolean;
  title?: string;
}

export const CalcButton: React.FC<CalcButtonProps> = ({
  label,
  subLabel,
  onClick,
  variant = 'scientific',
  className = '',
  span = '',
  isActive = false,
  disabled = false,
  title,
}) => {
  // Styles based on button variant
  const getVariantStyles = () => {
    switch (variant) {
      case 'number':
        return `
          bg-[#12121A] text-neutral-100 border-white/8
          hover:bg-[#1D1D2B] hover:border-purple-500/50 hover:text-white
          hover:shadow-[0_10px_25px_-5px_rgba(0,0,0,0.7),0_0_20px_rgba(139,92,246,0.3)]
          active:bg-[#28283C]
        `;
      case 'operator':
        return `
          bg-[#181226] text-purple-300 border-purple-500/25
          hover:bg-[#281845] hover:border-purple-400/60 hover:text-purple-100
          hover:shadow-[0_10px_25px_-5px_rgba(109,40,217,0.5),0_0_22px_rgba(139,92,246,0.4)]
          active:bg-[#351B5F]
        `;
      case 'equals':
        return `
          bg-gradient-to-br from-[#8B5CF6] via-[#7C3AED] to-[#5B21B6] text-white border-purple-300/40
          hover:from-[#9D71F9] hover:via-[#8B4CF8] hover:to-[#6D28D9]
          hover:shadow-[0_14px_32px_-4px_rgba(124,58,237,0.7),0_0_35px_rgba(139,92,246,0.6)]
          active:brightness-90 animate-sweep
        `;
      case 'clear':
        return `
          bg-[#220E18] text-rose-300 border-rose-500/25
          hover:bg-[#341223] hover:border-rose-400/60 hover:text-rose-100
          hover:shadow-[0_10px_25px_-5px_rgba(225,29,72,0.4),0_0_20px_rgba(244,63,94,0.3)]
          active:bg-[#45162D]
        `;
      case 'memory':
        return `
          bg-[#0B1522] text-cyan-300 border-cyan-500/20
          hover:bg-[#122438] hover:border-cyan-400/50 hover:text-cyan-100
          hover:shadow-[0_10px_25px_-5px_rgba(6,182,212,0.35),0_0_18px_rgba(6,182,212,0.25)]
          active:bg-[#18324F]
        `;
      case 'constant':
        return `
          bg-[#0C1914] text-emerald-300 border-emerald-500/20
          hover:bg-[#132A21] hover:border-emerald-400/50 hover:text-emerald-100
          hover:shadow-[0_10px_25px_-5px_rgba(16,185,129,0.35),0_0_18px_rgba(16,185,129,0.25)]
          active:bg-[#1B3C2F]
        `;
      case 'bracket':
        return `
          bg-[#151420] text-amber-300 border-amber-500/20
          hover:bg-[#201D30] hover:border-amber-400/45 hover:text-amber-100
          hover:shadow-[0_10px_25px_-5px_rgba(245,158,11,0.3),0_0_15px_rgba(245,158,11,0.2)]
          active:bg-[#2B2742]
        `;
      case 'scientific':
      default:
        return `
          bg-[#0E0E15] text-neutral-300 border-white/6
          hover:bg-[#1A1A26] hover:border-purple-500/40 hover:text-white
          hover:shadow-[0_10px_25px_-5px_rgba(0,0,0,0.6),0_0_16px_rgba(124,58,237,0.25)]
          active:bg-[#252538]
        `;
    }
  };

  return (
    <motion.button
      whileHover={{ y: -4, scale: variant === 'equals' ? 1.03 : 1.02 }}
      whileTap={{ y: 1, scale: 0.93 }}
      transition={{ type: 'spring', stiffness: 550, damping: 24, mass: 0.4 }}
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`
        group relative select-none rounded-xl sm:rounded-2xl border flex flex-col items-center justify-center font-mono
        transition-[background-color,border-color,box-shadow,color] duration-150 cursor-pointer overflow-hidden
        ${span}
        ${getVariantStyles()}
        ${isActive ? 'ring-2 ring-purple-400 shadow-[0_0_25px_rgba(139,92,246,0.6)]' : ''}
        ${className}
      `}
    >
      {/* Soft inner bevel highlight for tactile 3D sheen */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

      {/* Button content with micro scale on hover */}
      <span className="relative z-10 flex items-center justify-center font-medium leading-none transition-transform duration-150 group-hover:scale-105">
        {label}
      </span>

      {subLabel && (
        <span className="text-[9px] text-neutral-500 font-normal leading-none mt-0.5 opacity-70 group-hover:opacity-100">
          {subLabel}
        </span>
      )}
    </motion.button>
  );
};
