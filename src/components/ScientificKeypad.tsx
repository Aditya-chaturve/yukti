import React from 'react';
import { CalcButton } from './CalcButton';
import { soundController } from '../utils/audio';

interface ScientificKeypadProps {
  onInsert: (token: string) => void;
  onFunction: (fnName: string) => void;
  onMemoryAction: (action: 'MC' | 'MR' | 'M+' | 'M-' | 'MS') => void;
  memoryValue: number;
}

export const ScientificKeypad: React.FC<ScientificKeypadProps> = ({
  onInsert,
  onFunction,
  onMemoryAction,
  memoryValue,
}) => {
  const handleSciClick = (fnName: string) => {
    soundController.playSciClick();
    onFunction(fnName);
  };

  const handleInsert = (token: string, type: 'sci' | 'const' | 'bracket' = 'sci') => {
    if (type === 'const') {
      soundController.playKeyClick();
    } else {
      soundController.playSciClick();
    }
    onInsert(token);
  };

  const handleMem = (action: 'MC' | 'MR' | 'M+' | 'M-' | 'MS') => {
    soundController.playMemoryChime();
    onMemoryAction(action);
  };

  return (
    <div className="w-full flex flex-col gap-3.5">
      {/* Group 1: Memory Row with subtle cyan glow */}
      <div className="w-full bg-[#080E14]/60 p-1.5 rounded-2xl border border-cyan-500/15">
        <div className="flex items-center justify-between px-2 pb-1 mb-1 border-b border-cyan-500/10">
          <span className="text-[10px] font-mono font-semibold tracking-wider text-cyan-400/80 uppercase">
            Memory Register
          </span>
          <span className="text-[10px] font-mono text-cyan-500/60">
            {memoryValue !== 0 ? `Active: ${memoryValue}` : 'Empty'}
          </span>
        </div>
        <div className="grid grid-cols-5 gap-1.5">
          <CalcButton
            label="MC"
            title="Memory Clear"
            variant="memory"
            className="h-9 sm:h-10 text-xs"
            onClick={() => handleMem('MC')}
          />
          <CalcButton
            label="MR"
            title="Memory Recall"
            variant="memory"
            className="h-9 sm:h-10 text-xs"
            onClick={() => handleMem('MR')}
          />
          <CalcButton
            label="M+"
            title="Memory Add"
            variant="memory"
            className="h-9 sm:h-10 text-xs"
            onClick={() => handleMem('M+')}
          />
          <CalcButton
            label="M−"
            title="Memory Subtract"
            variant="memory"
            className="h-9 sm:h-10 text-xs"
            onClick={() => handleMem('M-')}
          />
          <CalcButton
            label="MS"
            title="Memory Store"
            variant="memory"
            className="h-9 sm:h-10 text-xs"
            onClick={() => handleMem('MS')}
          />
        </div>
      </div>

      {/* Group 2: Trigonometry & Inverses & Hyperbolics (Organized Sub-Grid) */}
      <div className="w-full bg-[#0E0C17]/70 p-2 rounded-2xl border border-purple-500/15">
        <div className="flex items-center justify-between px-2 pb-1.5 mb-1.5 border-b border-purple-500/10">
          <span className="text-[10px] font-mono font-semibold tracking-wider text-purple-300/80 uppercase">
            Trigonometry & Hyperbolics
          </span>
          <span className="text-[9px] font-mono text-purple-400/50">DEG/RAD/GRAD</span>
        </div>
        <div className="grid grid-cols-6 gap-1.5">
          {/* Row 1: Direct Trig */}
          <CalcButton
            label="sin"
            variant="scientific"
            className="h-9 sm:h-10 text-[11px] sm:text-xs"
            onClick={() => handleSciClick('sin(')}
          />
          <CalcButton
            label="cos"
            variant="scientific"
            className="h-9 sm:h-10 text-[11px] sm:text-xs"
            onClick={() => handleSciClick('cos(')}
          />
          <CalcButton
            label="tan"
            variant="scientific"
            className="h-9 sm:h-10 text-[11px] sm:text-xs"
            onClick={() => handleSciClick('tan(')}
          />
          <CalcButton
            label="cot"
            variant="scientific"
            className="h-9 sm:h-10 text-[11px] sm:text-xs"
            onClick={() => handleSciClick('cot(')}
          />
          <CalcButton
            label="sec"
            variant="scientific"
            className="h-9 sm:h-10 text-[11px] sm:text-xs"
            onClick={() => handleSciClick('sec(')}
          />
          <CalcButton
            label="csc"
            variant="scientific"
            className="h-9 sm:h-10 text-[11px] sm:text-xs"
            onClick={() => handleSciClick('csc(')}
          />

          {/* Row 2: Inverse & Hyperbolic */}
          <CalcButton
            label="sin⁻¹"
            variant="scientific"
            className="h-9 sm:h-10 text-[10px] sm:text-xs"
            onClick={() => handleSciClick('asin(')}
          />
          <CalcButton
            label="cos⁻¹"
            variant="scientific"
            className="h-9 sm:h-10 text-[10px] sm:text-xs"
            onClick={() => handleSciClick('acos(')}
          />
          <CalcButton
            label="tan⁻¹"
            variant="scientific"
            className="h-9 sm:h-10 text-[10px] sm:text-xs"
            onClick={() => handleSciClick('atan(')}
          />
          <CalcButton
            label="sinh"
            variant="scientific"
            className="h-9 sm:h-10 text-[10px] sm:text-xs"
            onClick={() => handleSciClick('sinh(')}
          />
          <CalcButton
            label="cosh"
            variant="scientific"
            className="h-9 sm:h-10 text-[10px] sm:text-xs"
            onClick={() => handleSciClick('cosh(')}
          />
          <CalcButton
            label="tanh"
            variant="scientific"
            className="h-9 sm:h-10 text-[10px] sm:text-xs"
            onClick={() => handleSciClick('tanh(')}
          />
        </div>
      </div>

      {/* Group 3: Powers, Roots, Logarithms, Constants & Brackets */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Left Subgroup: Powers & Roots & Logs */}
        <div className="bg-[#0B0D16]/70 p-2 rounded-2xl border border-blue-500/15">
          <div className="flex items-center justify-between px-2 pb-1 mb-1.5 border-b border-blue-500/10">
            <span className="text-[10px] font-mono font-semibold tracking-wider text-blue-300/80 uppercase">
              Powers, Roots & Logs
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            <CalcButton
              label={<span>x²</span>}
              variant="scientific"
              className="h-9 sm:h-10 text-xs"
              onClick={() => handleInsert('^2')}
            />
            <CalcButton
              label={<span>x³</span>}
              variant="scientific"
              className="h-9 sm:h-10 text-xs"
              onClick={() => handleInsert('^3')}
            />
            <CalcButton
              label={<span>xʸ</span>}
              variant="scientific"
              className="h-9 sm:h-10 text-xs"
              onClick={() => handleInsert('^')}
            />
            <CalcButton
              label={<span>√x</span>}
              variant="scientific"
              className="h-9 sm:h-10 text-xs"
              onClick={() => handleSciClick('sqrt(')}
            />
            <CalcButton
              label={<span>∛x</span>}
              variant="scientific"
              className="h-9 sm:h-10 text-xs"
              onClick={() => handleSciClick('cbrt(')}
            />
            <CalcButton
              label={<span>ʸ√x</span>}
              title="y-th root of x (e.g. 3 yroot 64 = 4)"
              variant="scientific"
              className="h-9 sm:h-10 text-xs"
              onClick={() => handleInsert(' yroot ')}
            />
            <CalcButton
              label="log"
              title="Base 10 logarithm"
              variant="scientific"
              className="h-9 sm:h-10 text-xs"
              onClick={() => handleSciClick('log(')}
            />
            <CalcButton
              label="ln"
              title="Natural logarithm (base e)"
              variant="scientific"
              className="h-9 sm:h-10 text-xs"
              onClick={() => handleSciClick('ln(')}
            />
            <CalcButton
              label={<span>log₂</span>}
              title="Base 2 logarithm"
              variant="scientific"
              className="h-9 sm:h-10 text-xs"
              onClick={() => handleSciClick('log2(')}
            />
            <CalcButton
              label={<span>10ˣ</span>}
              variant="scientific"
              className="h-9 sm:h-10 text-xs"
              onClick={() => handleInsert('10^')}
            />
            <CalcButton
              label={<span>eˣ</span>}
              variant="scientific"
              className="h-9 sm:h-10 text-xs"
              onClick={() => handleInsert('e^')}
            />
            <CalcButton
              label="EXP"
              title="Exponential notation (×10ⁿ)"
              variant="scientific"
              className="h-9 sm:h-10 text-xs"
              onClick={() => handleInsert('e')}
            />
          </div>
        </div>

        {/* Right Subgroup: Constants, Advanced & Brackets */}
        <div className="bg-[#0B1210]/70 p-2 rounded-2xl border border-emerald-500/15">
          <div className="flex items-center justify-between px-2 pb-1 mb-1.5 border-b border-emerald-500/10">
            <span className="text-[10px] font-mono font-semibold tracking-wider text-emerald-300/80 uppercase">
              Constants, Brackets & Ops
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {/* Constants Row */}
            <CalcButton
              label="π"
              title="Pi constant (~3.14159)"
              variant="constant"
              className="h-9 sm:h-10 text-sm font-semibold"
              onClick={() => handleInsert('π', 'const')}
            />
            <CalcButton
              label="e"
              title="Euler constant (~2.71828)"
              variant="constant"
              className="h-9 sm:h-10 text-sm font-semibold"
              onClick={() => handleInsert('e', 'const')}
            />
            <CalcButton
              label="φ"
              title="Golden Ratio (~1.61803)"
              variant="constant"
              className="h-9 sm:h-10 text-sm font-semibold"
              onClick={() => handleInsert('φ', 'const')}
            />

            {/* Brackets */}
            <CalcButton
              label="(  )"
              variant="bracket"
              className="h-9 sm:h-10 text-xs"
              onClick={() => handleInsert('()', 'bracket')}
            />
            <CalcButton
              label="[  ]"
              variant="bracket"
              className="h-9 sm:h-10 text-xs"
              onClick={() => handleInsert('[]', 'bracket')}
            />
            <CalcButton
              label="{  }"
              variant="bracket"
              className="h-9 sm:h-10 text-xs"
              onClick={() => handleInsert('{}', 'bracket')}
            />

            {/* Advanced Math Ops */}
            <CalcButton
              label="x!"
              title="Factorial"
              variant="scientific"
              className="h-9 sm:h-10 text-xs"
              onClick={() => handleInsert('!')}
            />
            <CalcButton
              label="|x|"
              title="Absolute value"
              variant="scientific"
              className="h-9 sm:h-10 text-xs"
              onClick={() => handleSciClick('abs(')}
            />
            <CalcButton
              label="1/x"
              title="Reciprocal"
              variant="scientific"
              className="h-9 sm:h-10 text-xs"
              onClick={() => handleInsert('1/')}
            />
            <CalcButton
              label="MOD"
              title="Modulo Remainder (e.g. 10 MOD 3 = 1)"
              variant="scientific"
              className="h-9 sm:h-10 text-xs"
              onClick={() => handleInsert(' MOD ')}
            />
            <CalcButton
              label="("
              variant="bracket"
              className="h-9 sm:h-10 text-xs"
              onClick={() => handleInsert('(', 'bracket')}
            />
            <CalcButton
              label=")"
              variant="bracket"
              className="h-9 sm:h-10 text-xs"
              onClick={() => handleInsert(')', 'bracket')}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
