import React from 'react';
import { CalcButton } from './CalcButton';
import { Delete, RotateCcw, Equal } from 'lucide-react';
import { soundController } from '../utils/audio';

interface BasicKeypadProps {
  onNumber: (digit: string) => void;
  onOperator: (op: string) => void;
  onClear: () => void;
  onDelete: () => void;
  onNegate: () => void;
  onPercent: () => void;
  onDecimal: () => void;
  onEquals: () => void;
  activeOperator?: string | null;
}

export const BasicKeypad: React.FC<BasicKeypadProps> = ({
  onNumber,
  onOperator,
  onClear,
  onDelete,
  onNegate,
  onPercent,
  onDecimal,
  onEquals,
}) => {
  const handleNum = (d: string) => {
    soundController.playKeyClick();
    onNumber(d);
  };

  const handleOp = (op: string) => {
    soundController.playOpClick();
    onOperator(op);
  };

  const handleClear = () => {
    soundController.playClearSound();
    onClear();
  };

  const handleDel = () => {
    soundController.playOpClick();
    onDelete();
  };

  const handleEq = () => {
    soundController.playEqualsChord();
    onEquals();
  };

  return (
    <div className="w-full grid grid-cols-4 gap-2 sm:gap-2.5">
      {/* Row 1: AC, ±, %, ÷ */}
      <CalcButton
        label={<span className="font-bold tracking-wider">AC</span>}
        variant="clear"
        className="h-12 sm:h-14 text-sm sm:text-base font-semibold"
        onClick={handleClear}
        title="All Clear (Escape)"
      />
      <CalcButton
        label={<span className="font-semibold text-lg">±</span>}
        variant="operator"
        className="h-12 sm:h-14 text-base"
        onClick={onNegate}
        title="Toggle Positive/Negative"
      />
      <CalcButton
        label={<span className="font-semibold text-lg">%</span>}
        variant="operator"
        className="h-12 sm:h-14 text-base"
        onClick={onPercent}
        title="Percentage"
      />
      <CalcButton
        label={<span className="font-bold text-xl">÷</span>}
        variant="operator"
        className="h-12 sm:h-14 text-lg"
        onClick={() => handleOp('÷')}
        title="Divide (/)"
      />

      {/* Row 2: 7, 8, 9, × */}
      <CalcButton
        label="7"
        variant="number"
        className="h-12 sm:h-14 text-lg sm:text-xl font-bold"
        onClick={() => handleNum('7')}
      />
      <CalcButton
        label="8"
        variant="number"
        className="h-12 sm:h-14 text-lg sm:text-xl font-bold"
        onClick={() => handleNum('8')}
      />
      <CalcButton
        label="9"
        variant="number"
        className="h-12 sm:h-14 text-lg sm:text-xl font-bold"
        onClick={() => handleNum('9')}
      />
      <CalcButton
        label={<span className="font-bold text-xl">×</span>}
        variant="operator"
        className="h-12 sm:h-14 text-lg"
        onClick={() => handleOp('×')}
        title="Multiply (*)"
      />

      {/* Row 3: 4, 5, 6, − */}
      <CalcButton
        label="4"
        variant="number"
        className="h-12 sm:h-14 text-lg sm:text-xl font-bold"
        onClick={() => handleNum('4')}
      />
      <CalcButton
        label="5"
        variant="number"
        className="h-12 sm:h-14 text-lg sm:text-xl font-bold"
        onClick={() => handleNum('5')}
      />
      <CalcButton
        label="6"
        variant="number"
        className="h-12 sm:h-14 text-lg sm:text-xl font-bold"
        onClick={() => handleNum('6')}
      />
      <CalcButton
        label={<span className="font-bold text-xl">−</span>}
        variant="operator"
        className="h-12 sm:h-14 text-lg"
        onClick={() => handleOp('−')}
        title="Subtract (-)"
      />

      {/* Row 4: 1, 2, 3, + */}
      <CalcButton
        label="1"
        variant="number"
        className="h-12 sm:h-14 text-lg sm:text-xl font-bold"
        onClick={() => handleNum('1')}
      />
      <CalcButton
        label="2"
        variant="number"
        className="h-12 sm:h-14 text-lg sm:text-xl font-bold"
        onClick={() => handleNum('2')}
      />
      <CalcButton
        label="3"
        variant="number"
        className="h-12 sm:h-14 text-lg sm:text-xl font-bold"
        onClick={() => handleNum('3')}
      />
      <CalcButton
        label={<span className="font-bold text-xl">+</span>}
        variant="operator"
        className="h-12 sm:h-14 text-lg"
        onClick={() => handleOp('+')}
        title="Add (+)"
      />

      {/* Row 5: 0, ., DEL, = */}
      <CalcButton
        label="0"
        variant="number"
        className="h-12 sm:h-14 text-lg sm:text-xl font-bold"
        onClick={() => handleNum('0')}
      />
      <CalcButton
        label={<span className="font-bold text-xl">.</span>}
        variant="number"
        className="h-12 sm:h-14 text-xl"
        onClick={onDecimal}
        title="Decimal point"
      />
      <CalcButton
        label={<Delete className="w-5 h-5 text-neutral-300" />}
        variant="scientific"
        className="h-12 sm:h-14 text-sm"
        onClick={handleDel}
        title="Backspace / Delete"
      />
      <CalcButton
        label={<Equal className="w-6 h-6 text-white stroke-[2.5]" />}
        variant="equals"
        className="h-12 sm:h-14 text-xl font-extrabold"
        onClick={handleEq}
        title="Calculate (Enter)"
      />
    </div>
  );
};
