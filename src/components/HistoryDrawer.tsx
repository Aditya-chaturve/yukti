import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, X, Clock, ArrowLeftRight, Copy, Check, Download } from 'lucide-react';
import { CalculationHistoryItem } from '../utils/mathEngine';
import { soundController } from '../utils/audio';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: CalculationHistoryItem[];
  onSelectHistoryItem: (item: CalculationHistoryItem) => void;
  onClearHistory: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  onSelectHistoryItem,
  onClearHistory,
}) => {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const handleCopy = (e: React.MouseEvent, item: CalculationHistoryItem) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`${item.expression} = ${item.result}`);
    setCopiedId(item.id);
    soundController.playKeyClick();
    setTimeout(() => setCopiedId(null), 1800);
  };

  const handleExport = () => {
    const text = history
      .map(
        (h) =>
          `[${new Date(h.timestamp).toLocaleTimeString()}] (${h.angleMode}) ${h.expression} = ${h.result}`
      )
      .join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `yukti-history-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    soundController.playOpClick();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop for mobile */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />

          {/* Slide-out Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.98 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="fixed inset-y-0 right-0 w-full max-w-sm sm:max-w-md bg-[#0C0C14]/95 backdrop-blur-2xl border-l border-white/10 z-50 flex flex-col shadow-[-20px_0_50px_rgba(0,0,0,0.8),0_0_30px_rgba(124,58,237,0.15)]"
          >
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-white/8 flex items-center justify-between bg-[#11111A]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-600/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white tracking-wide">Calculation History</h3>
                  <p className="text-[10px] font-mono text-neutral-400">
                    {history.length} {history.length === 1 ? 'record' : 'records'} cached
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {history.length > 0 && (
                  <>
                    <button
                      onClick={handleExport}
                      title="Export history as text"
                      className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        soundController.playClearSound();
                        onClearHistory();
                      }}
                      title="Clear History"
                      className="p-1.5 rounded-lg text-rose-400/80 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                )}
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
              {history.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-neutral-500">
                  <Clock className="w-10 h-10 stroke-[1.2] text-neutral-700 mb-2" />
                  <p className="text-xs font-medium text-neutral-400">No calculations recorded yet</p>
                  <p className="text-[11px] text-neutral-600 mt-1 max-w-[200px]">
                    Evaluate expressions with = to save them here for quick restoration.
                  </p>
                </div>
              ) : (
                history.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={() => {
                      soundController.playKeyClick();
                      onSelectHistoryItem(item);
                      onClose();
                    }}
                    className="group relative p-3.5 rounded-2xl bg-[#14141E] hover:bg-[#1C1C2A] border border-white/6 hover:border-purple-500/40 cursor-pointer transition-all hover:scale-[1.01] hover:shadow-[0_8px_20px_-5px_rgba(0,0,0,0.6),0_0_15px_rgba(124,58,237,0.15)] flex flex-col gap-1.5"
                  >
                    <div className="flex items-center justify-between text-[10px] text-neutral-500 font-mono">
                      <span className="px-1.5 py-0.2 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
                        {item.angleMode}
                      </span>
                      <span>{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                    </div>

                    <div className="font-mono text-xs text-neutral-400 break-all group-hover:text-neutral-300">
                      {item.expression}
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-white/5">
                      <div className="font-mono-numbers font-bold text-base sm:text-lg text-white group-hover:text-purple-200">
                        = {item.result}
                      </div>

                      <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                        <button
                          onClick={(e) => handleCopy(e, item)}
                          title="Copy full line"
                          className="p-1 rounded-md text-neutral-400 hover:text-purple-300 hover:bg-white/5 transition-colors"
                        >
                          {copiedId === item.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <span className="text-[10px] text-purple-400 font-medium flex items-center gap-0.5">
                          Restore <ArrowLeftRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="p-3.5 border-t border-white/8 bg-[#09090E] flex items-center justify-between text-[11px] text-neutral-500">
              <span>Click any card to load into calculator</span>
              <button
                onClick={onClose}
                className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
