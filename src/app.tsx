import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BackgroundAmbient } from './components/BackgroundAmbient';
import { Header } from './components/Header';
import { Display } from './components/Display';
import { ScientificKeypad } from './components/ScientificKeypad';
import { BasicKeypad } from './components/BasicKeypad';
import { MathEvaluator, AngleMode, formatResultNumber } from './utils/mathEngine';
import { soundController } from './utils/audio';
import { Atom, Calculator, Sparkles } from 'lucide-react';

export function App() {
  // Calculator States
  const [expression, setExpression] = useState<string>('');
  const [result, setResult] = useState<string>('0');
  const [numericResult, setNumericResult] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [angleMode, setAngleMode] = useState<AngleMode>('DEG');
  const [memoryValue, setMemoryValue] = useState<number>(0);
  const [mode, setMode] = useState<'SCIENTIFIC' | 'BASIC'>('SCIENTIFIC');
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [isJustCalculated, setIsJustCalculated] = useState<boolean>(false);

  // Math evaluator instance with angleMode
  const evaluator = useMemo(() => new MathEvaluator(angleMode), [angleMode]);

  // Live preview for incomplete expressions
  const livePreview = useMemo(() => {
    if (!expression || expression.trim() === '') return null;
    const trimmed = expression.trim();
    if (/[+\−×÷\^]$/.test(trimmed)) return null;

    try {
      const evalResult = evaluator.evaluate(trimmed);
      if (evalResult.success && evalResult.formattedResult) {
        return evalResult.formattedResult;
      }
    } catch {}
    return null;
  }, [expression, evaluator]);

  // Handle number input
  const handleNumber = useCallback((digit: string) => {
    setErrorMessage(null);
    if (isJustCalculated) {
      setExpression(digit);
      setIsJustCalculated(false);
    } else {
      setExpression((prev) => (prev === '0' ? digit : prev + digit));
    }
  }, [isJustCalculated]);

  // Handle operators (+, −, ×, ÷, etc.)
  const handleOperator = useCallback((op: string) => {
    setErrorMessage(null);
    if (isJustCalculated) {
      setExpression(`${result} ${op} `);
      setIsJustCalculated(false);
    } else {
      setExpression((prev) => {
        if (!prev) return `0 ${op} `;
        const trimmed = prev.trim();
        if (/[+\−×÷\^%]$/.test(trimmed)) {
          return trimmed.slice(0, -1) + ` ${op} `;
        }
        return `${prev} ${op} `;
      });
    }
  }, [isJustCalculated, result]);

  // Handle Function Insertion (e.g. sin(, cos(, sqrt()
  const handleFunction = useCallback((fnStr: string) => {
    setErrorMessage(null);
    if (isJustCalculated) {
      setExpression(fnStr);
      setIsJustCalculated(false);
    } else {
      setExpression((prev) => prev + fnStr);
    }
  }, [isJustCalculated]);

  // Handle raw token insertion (brackets, powers, constants)
  const handleInsert = useCallback((token: string) => {
    setErrorMessage(null);
    if (isJustCalculated) {
      if (token.startsWith('^') || token === '!') {
        setExpression(`${result}${token}`);
      } else {
        setExpression(token);
      }
      setIsJustCalculated(false);
    } else {
      setExpression((prev) => prev + token);
    }
  }, [isJustCalculated, result]);

  // Handle Decimal (.)
  const handleDecimal = useCallback(() => {
    setErrorMessage(null);
    if (isJustCalculated) {
      setExpression('0.');
      setIsJustCalculated(false);
      return;
    }

    setExpression((prev) => {
      if (!prev) return '0.';
      const tokens = prev.split(/[\s+\−×÷()^!]/);
      const lastToken = tokens[tokens.length - 1];
      if (lastToken && lastToken.includes('.')) {
        return prev;
      }
      return prev + '.';
    });
    soundController.playKeyClick();
  }, [isJustCalculated]);

  // Handle ± (Sign Toggle)
  const handleNegate = useCallback(() => {
    setErrorMessage(null);
    soundController.playOpClick();
    if (isJustCalculated && result) {
      const num = -parseFloat(result.replace(/,/g, ''));
      const formatted = formatResultNumber(num, 10);
      setResult(formatted);
      setNumericResult(num);
      setExpression(`-(${result})`);
      return;
    }

    setExpression((prev) => {
      if (!prev || prev === '0') return '-';
      if (prev.startsWith('-')) return prev.substring(1);
      return `-(${prev})`;
    });
  }, [isJustCalculated, result]);

  // Handle Percentage (%)
  const handlePercent = useCallback(() => {
    setErrorMessage(null);
    soundController.playOpClick();
    setExpression((prev) => (prev ? `${prev}%` : '0%'));
  }, []);

  // Handle Delete / Backspace
  const handleDelete = useCallback(() => {
    setErrorMessage(null);
    if (isJustCalculated) {
      setExpression('');
      setIsJustCalculated(false);
      return;
    }

    setExpression((prev) => {
      if (!prev) return '';
      const fns = ['asin(', 'acos(', 'atan(', 'sinh(', 'cosh(', 'tanh(', 'sin(', 'cos(', 'tan(', 'cot(', 'sec(', 'csc(', 'sqrt(', 'cbrt(', 'log2(', 'log(', 'ln(', 'abs('];
      for (const fn of fns) {
        if (prev.endsWith(fn)) {
          return prev.slice(0, -fn.length);
        }
      }
      if (prev.endsWith(' ')) {
        return prev.trimEnd().slice(0, -1).trimEnd();
      }
      return prev.slice(0, -1);
    });
  }, [isJustCalculated]);

  // Handle All Clear (AC)
  const handleClear = useCallback(() => {
    setExpression('');
    setResult('0');
    setNumericResult(0);
    setErrorMessage(null);
    setIsJustCalculated(false);
  }, []);

  // Main Calculation Execution (=)
  const handleEquals = useCallback(() => {
    if (!expression || expression.trim() === '') return;

    // Trigger visual evaluation pulse
    setIsEvaluating(true);
    setTimeout(() => setIsEvaluating(false), 350);

    const evalResult = evaluator.evaluate(expression);

    if (evalResult.success && evalResult.result !== undefined) {
      const formatted = formatResultNumber(evalResult.result, 10);
      setResult(formatted);
      setNumericResult(evalResult.result);
      setErrorMessage(null);
      setIsJustCalculated(true);
    } else {
      const err = evalResult.error || 'Cannot divide by zero';
      setErrorMessage(err);
      soundController.playErrorSound();
    }
  }, [expression, evaluator]);

  // Memory Operations (MC, MR, M+, M-, MS)
  const handleMemoryAction = useCallback((action: 'MC' | 'MR' | 'M+' | 'M-' | 'MS') => {
    setErrorMessage(null);
    const currentVal = isJustCalculated ? numericResult : (parseFloat(result.replace(/,/g, '')) || 0);

    switch (action) {
      case 'MC':
        setMemoryValue(0);
        break;
      case 'MR':
        setExpression((prev) => prev + String(memoryValue));
        setIsJustCalculated(false);
        break;
      case 'M+':
        setMemoryValue((prev) => prev + currentVal);
        break;
      case 'M-':
        setMemoryValue((prev) => prev - currentVal);
        break;
      case 'MS':
        setMemoryValue(currentVal);
        break;
    }
  }, [isJustCalculated, numericResult, result, memoryValue]);

  // Global Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      const key = e.key;

      if (/^[0-9]$/.test(key)) {
        e.preventDefault();
        soundController.playKeyClick();
        handleNumber(key);
      } else if (key === '+') {
        e.preventDefault();
        soundController.playOpClick();
        handleOperator('+');
      } else if (key === '-') {
        e.preventDefault();
        soundController.playOpClick();
        handleOperator('−');
      } else if (key === '*') {
        e.preventDefault();
        soundController.playOpClick();
        handleOperator('×');
      } else if (key === '/') {
        e.preventDefault();
        soundController.playOpClick();
        handleOperator('÷');
      } else if (key === 'Enter' || key === '=') {
        e.preventDefault();
        soundController.playEqualsChord();
        handleEquals();
      } else if (key === 'Backspace') {
        e.preventDefault();
        handleDelete();
      } else if (key === 'Escape') {
        e.preventDefault();
        soundController.playClearSound();
        handleClear();
      } else if (key === '.') {
        e.preventDefault();
        handleDecimal();
      } else if (['(', ')', '[', ']', '{', '}'].includes(key)) {
        e.preventDefault();
        handleInsert(key);
      } else if (key === '^') {
        e.preventDefault();
        handleInsert('^');
      } else if (key === '!') {
        e.preventDefault();
        handleInsert('!');
      } else if (key === '%') {
        e.preventDefault();
        handlePercent();
      } else if (key.toLowerCase() === 'p') {
        e.preventDefault();
        handleInsert('π');
      } else if (key === 'e' || key === 'E') {
        e.preventDefault();
        handleInsert('e');
      } else if (key.toLowerCase() === 's') {
        e.preventDefault();
        handleFunction('sin(');
      } else if (key.toLowerCase() === 'c') {
        e.preventDefault();
        handleFunction('cos(');
      } else if (key.toLowerCase() === 't') {
        e.preventDefault();
        handleFunction('tan(');
      } else if (key.toLowerCase() === 'l') {
        e.preventDefault();
        handleFunction('log(');
      } else if (key.toLowerCase() === 'n') {
        e.preventDefault();
        handleFunction('ln(');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNumber, handleOperator, handleEquals, handleDelete, handleClear, handleDecimal, handleInsert, handlePercent, handleFunction]);

  return (
    <div className="min-h-screen w-full relative flex flex-col justify-between overflow-x-hidden text-neutral-100 selection:bg-purple-600/30">
      {/* Cinematic Ambient Canvas & Particle Matrix */}
      <BackgroundAmbient />

      {/* Floating Minimal Header with YUKTI logo + wordmark */}
      <Header />

      {/* Main Hero Container: Large Centered Luxury Calculator */}
      <main className="flex-1 w-full max-w-3xl mx-auto px-3.5 sm:px-6 flex flex-col items-center justify-center my-1 sm:my-3 z-10">
        <motion.div
          initial={{ opacity: 0, y: 18, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="relative w-full rounded-3xl glass-panel p-4 sm:p-7 shadow-[0_30px_90px_-20px_rgba(0,0,0,0.9),0_0_50px_rgba(124,58,237,0.18)] transition-all"
        >
          {/* Subtle top light sheen on calculator frame */}
          <div className="absolute inset-x-8 top-0 h-[1px] bg-gradient-to-r from-transparent via-purple-400/30 to-transparent pointer-events-none" />

          {/* Mode Switcher: BASIC | SCIENTIFIC */}
          <div className="flex items-center justify-between mb-4 px-1">
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#09090E]/90 border border-white/6 shadow-inner">
              <button
                onClick={() => {
                  setMode('BASIC');
                  soundController.playKeyClick();
                }}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wider transition-all flex items-center gap-1.5 ${
                  mode === 'BASIC'
                    ? 'bg-gradient-to-r from-purple-700 to-purple-900 text-white shadow-[0_0_12px_rgba(124,58,237,0.4)]'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Calculator className="w-3.5 h-3.5" />
                <span>BASIC</span>
              </button>

              <button
                onClick={() => {
                  setMode('SCIENTIFIC');
                  soundController.playKeyClick();
                }}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wider transition-all flex items-center gap-1.5 ${
                  mode === 'SCIENTIFIC'
                    ? 'bg-gradient-to-r from-purple-600 via-[#7C3AED] to-purple-800 text-white shadow-[0_0_15px_rgba(124,58,237,0.5)]'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Atom className="w-3.5 h-3.5" />
                <span>SCIENTIFIC</span>
              </button>
            </div>

            {/* Subtle Engineering Badge */}
            <div className="hidden sm:flex items-center gap-2 text-[11px] font-mono text-purple-300/60 bg-purple-500/5 px-2.5 py-1 rounded-lg border border-purple-500/10">
              <Sparkles className="w-3 h-3 text-purple-400" />
              <span>YUKTI INSTRUMENT ENGINE</span>
            </div>
          </div>

          {/* Area 1: Large Luxury DISPLAY */}
          <Display
            expression={expression}
            result={result}
            livePreview={livePreview}
            angleMode={angleMode}
            setAngleMode={setAngleMode}
            memoryValue={memoryValue}
            errorMessage={errorMessage}
            isEvaluating={isEvaluating}
          />

          {/* Keypad Areas: SCIENTIFIC FUNCTIONS → BASIC KEYPAD */}
          <div className="mt-5 space-y-4">
            {/* Area 2: Scientific Function Panel (Smooth height & opacity collapse/expand) */}
            <AnimatePresence initial={false}>
              {mode === 'SCIENTIFIC' && (
                <motion.div
                  key="scientific-panel"
                  initial={{ opacity: 0, height: 0, y: -8 }}
                  animate={{ opacity: 1, height: 'auto', y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -8 }}
                  transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <ScientificKeypad
                    onInsert={handleInsert}
                    onFunction={handleFunction}
                    onMemoryAction={handleMemoryAction}
                    memoryValue={memoryValue}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Area 3: BASIC KEYPAD (Always visually connected) */}
            <div className="pt-1">
              <BasicKeypad
                onNumber={handleNumber}
                onOperator={handleOperator}
                onClear={handleClear}
                onDelete={handleDelete}
                onNegate={handleNegate}
                onPercent={handlePercent}
                onDecimal={handleDecimal}
                onEquals={handleEquals}
              />
            </div>
          </div>
        </motion.div>
      </main>

      {/* Minimal Luxury Footer */}
      <footer className="w-full py-4 px-4 text-center text-xs text-neutral-500 font-sans z-10 flex items-center justify-center gap-2">
        <span className="font-semibold text-neutral-400">YUKTI</span>
        <span>·</span>
        <span>Intelligent tools, beautifully designed.</span>
      </footer>
    </div>
  );
}

export default App;
