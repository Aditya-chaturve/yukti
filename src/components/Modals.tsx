import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, BookOpen, Keyboard, ShieldCheck, Cpu, Zap, Layers, Binary } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertExpression?: (expr: string) => void;
}

export const CategoriesModal: React.FC<ModalProps> = ({ isOpen, onClose, onInsertExpression }) => {
  if (!isOpen) return null;

  const categories = [
    {
      title: 'Trigonometry & Inverses',
      accent: 'text-purple-400 border-purple-500/20 bg-purple-500/5',
      items: [
        { name: 'sin(x)', desc: 'Sine function', example: 'sin(30)' },
        { name: 'cos(x)', desc: 'Cosine function', example: 'cos(60)' },
        { name: 'tan(x)', desc: 'Tangent function', example: 'tan(45)' },
        { name: 'cot(x)', desc: 'Cotangent (1/tan)', example: 'cot(45)' },
        { name: 'sec(x)', desc: 'Secant (1/cos)', example: 'sec(60)' },
        { name: 'csc(x)', desc: 'Cosecant (1/sin)', example: 'csc(30)' },
        { name: 'sin⁻¹(x)', desc: 'Arcsine (inverse sine)', example: 'asin(0.5)' },
        { name: 'cos⁻¹(x)', desc: 'Arccosine (inverse cos)', example: 'acos(0.5)' },
        { name: 'tan⁻¹(x)', desc: 'Arctangent', example: 'atan(1)' },
      ]
    },
    {
      title: 'Hyperbolic Functions',
      accent: 'text-blue-400 border-blue-500/20 bg-blue-500/5',
      items: [
        { name: 'sinh(x)', desc: 'Hyperbolic sine', example: 'sinh(1)' },
        { name: 'cosh(x)', desc: 'Hyperbolic cosine', example: 'cosh(1)' },
        { name: 'tanh(x)', desc: 'Hyperbolic tangent', example: 'tanh(1)' },
      ]
    },
    {
      title: 'Powers, Roots & Logarithms',
      accent: 'text-cyan-400 border-cyan-500/20 bg-cyan-500/5',
      items: [
        { name: 'x²', desc: 'Square power', example: '12^2' },
        { name: 'x³', desc: 'Cube power', example: '5^3' },
        { name: 'xʸ', desc: 'Arbitrary exponent', example: '2^8' },
        { name: '√x', desc: 'Square root', example: 'sqrt(144)' },
        { name: '∛x', desc: 'Cube root', example: 'cbrt(27)' },
        { name: 'ʸ√x', desc: 'y-th root of x', example: '3 yroot 64' },
        { name: 'log(x)', desc: 'Base 10 logarithm', example: 'log(1000)' },
        { name: 'ln(x)', desc: 'Natural log (base e)', example: 'ln(2.71828)' },
        { name: 'log₂(x)', desc: 'Base 2 logarithm', example: 'log2(256)' },
        { name: '10ˣ / eˣ', desc: 'Exponential powers', example: '10^3' },
      ]
    },
    {
      title: 'Constants & Advanced Math',
      accent: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5',
      items: [
        { name: 'π', desc: 'Archimedes constant (3.14159...)', example: '2 * π * 5' },
        { name: 'e', desc: "Euler's number (2.71828...)", example: 'e^2' },
        { name: 'φ', desc: 'Golden ratio (1.61803...)', example: 'φ^2' },
        { name: 'x!', desc: 'Factorial / Gamma', example: '5!' },
        { name: '|x|', desc: 'Absolute magnitude', example: 'abs(-42)' },
        { name: '1/x', desc: 'Multiplicative reciprocal', example: '1 / 8' },
        { name: 'MOD', desc: 'Modulo remainder', example: '17 mod 5' },
        { name: 'EXP', desc: 'Scientific notation (×10ⁿ)', example: '1.5e6' },
      ]
    }
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="relative w-full max-w-3xl max-h-[85vh] overflow-hidden rounded-3xl bg-[#0C0C12] border border-white/10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_40px_rgba(124,58,237,0.2)] flex flex-col"
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-white/8 flex items-center justify-between bg-[#111118]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white tracking-wide">Scientific Function Reference</h3>
                <p className="text-xs text-neutral-400">Click any example to insert directly into calculator</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto space-y-6">
            {categories.map((cat, idx) => (
              <div key={idx} className="space-y-3">
                <div className={`px-3 py-1.5 rounded-lg border text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-2 ${cat.accent}`}>
                  <Sparkles className="w-3.5 h-3.5" />
                  {cat.title}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                  {cat.items.map((item, itemIdx) => (
                    <button
                      key={itemIdx}
                      onClick={() => {
                        if (onInsertExpression) {
                          onInsertExpression(item.example);
                          onClose();
                        }
                      }}
                      className="group p-3 rounded-xl bg-[#151520] hover:bg-[#1C1C2A] border border-white/5 hover:border-purple-500/30 text-left transition-all hover:scale-[1.02] flex flex-col justify-between"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono text-sm font-semibold text-purple-300 group-hover:text-purple-200">{item.name}</span>
                        <span className="text-[10px] text-neutral-500 group-hover:text-neutral-400">Insert →</span>
                      </div>
                      <span className="text-xs text-neutral-400 line-clamp-1">{item.desc}</span>
                      <span className="mt-2 text-[11px] font-mono text-neutral-500 bg-black/40 px-2 py-0.5 rounded border border-white/5 group-hover:border-purple-500/20 text-right">
                        {item.example}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-white/8 bg-[#09090E] flex items-center justify-between text-xs text-neutral-400">
            <span>Supports standard nested parenthetical syntax & DEG/RAD/GRAD modes</span>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 font-medium transition-colors"
            >
              Done
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export const ShortcutsModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: '0 – 9', desc: 'Enter numbers' },
    { key: '+  −  *  /', desc: 'Standard arithmetic operators' },
    { key: 'Enter  or  =', desc: 'Compute & evaluate expression' },
    { key: 'Escape', desc: 'All Clear (AC)' },
    { key: 'Backspace', desc: 'Delete previous character / symbol' },
    { key: '(  )  [  ]  {  }', desc: 'Parentheses and groupings' },
    { key: '^', desc: 'Power / Exponentiation (xʸ)' },
    { key: '!', desc: 'Factorial operation' },
    { key: '%', desc: 'Percentage calculation' },
    { key: 'p  or  P', desc: 'Insert constant π (Pi)' },
    { key: 'e  or  E', desc: "Insert constant e (Euler's number)" },
    { key: 's / c / t', desc: 'Insert sin / cos / tan trigonometric functions' },
    { key: 'l / n', desc: 'Insert log₁₀ / ln (natural log)' },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="relative w-full max-w-xl max-h-[85vh] overflow-hidden rounded-3xl bg-[#0C0C12] border border-white/10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_40px_rgba(124,58,237,0.2)] flex flex-col"
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-white/8 flex items-center justify-between bg-[#111118]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Keyboard className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white tracking-wide">Keyboard Controls</h3>
                <p className="text-xs text-neutral-400">Seamless physical keyboard input mapping</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto space-y-2.5">
            {shortcuts.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-xl bg-[#14141E] border border-white/5 hover:border-purple-500/20 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <kbd className="px-2.5 py-1 rounded-lg bg-[#09090F] border border-purple-500/30 text-purple-300 font-mono text-xs font-semibold shadow-inner">
                    {item.key}
                  </kbd>
                </div>
                <span className="text-xs text-neutral-300">{item.desc}</span>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-white/8 bg-[#09090E] flex items-center justify-between text-xs text-neutral-400">
            <span className="flex items-center gap-1.5 text-purple-400">
              <Zap className="w-3.5 h-3.5" /> High-frequency keyboard event listener active
            </span>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export const AboutModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-[#0C0C12] border border-white/10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_50px_rgba(124,58,237,0.25)] flex flex-col"
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-white/8 flex items-center justify-between bg-[#111118]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white tracking-wide">YUKTI Scientific</h3>
                <p className="text-xs text-purple-400 font-mono">ENGINEERING v2.5 PRO</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-5 text-sm text-neutral-300 leading-relaxed">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-900/20 to-transparent border border-purple-500/20">
              <p className="font-medium text-white text-base mb-1">
                “Intelligent tools, beautifully designed.”
              </p>
              <p className="text-xs text-neutral-400">
                From everyday arithmetic to advanced mathematical research, YUKTI merges computational accuracy with cinematic luxury tactile engineering.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-[#14141F] border border-white/5 space-y-1">
                <div className="flex items-center gap-2 text-purple-400 text-xs font-semibold">
                  <ShieldCheck className="w-4 h-4" /> IEEE 754 & Lanczos
                </div>
                <p className="text-[11px] text-neutral-400">
                  Precision AST parsing with automatic floating artifact normalization.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#14141F] border border-white/5 space-y-1">
                <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold">
                  <Layers className="w-4 h-4" /> 3 Angular Domains
                </div>
                <p className="text-[11px] text-neutral-400">
                  Seamless DEG, RAD, & GRAD calculations with zero precision drift.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#14141F] border border-white/5 space-y-1">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
                  <Zap className="w-4 h-4" /> Tactile Web Audio
                </div>
                <p className="text-[11px] text-neutral-400">
                  Procedural harmonic audio synthesis for physical mechanical feedback.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#14141F] border border-white/5 space-y-1">
                <div className="flex items-center gap-2 text-pink-400 text-xs font-semibold">
                  <Binary className="w-4 h-4" /> Instant Expression Cache
                </div>
                <p className="text-[11px] text-neutral-400">
                  Persistent calculation history with one-tap expression restoration.
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-white/8 bg-[#09090E] flex items-center justify-between text-xs text-neutral-500">
            <span>© {new Date().getFullYear()} YUKTI Systems. All Rights Reserved.</span>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium transition-all shadow-[0_0_15px_rgba(124,58,237,0.4)]"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
