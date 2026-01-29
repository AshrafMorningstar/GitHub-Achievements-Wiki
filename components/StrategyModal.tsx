import React from 'react';
import { X, BrainCircuit, Loader2 } from 'lucide-react';

interface StrategyModalProps {
  isOpen: boolean;
  onClose: () => void;
  badgeName: string;
  strategy: string;
  loading: boolean;
}

const StrategyModal: React.FC<StrategyModalProps> = ({ isOpen, onClose, badgeName, strategy, loading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-sm">
      <div className="bg-white dark:bg-[#161b22] w-full max-w-2xl rounded-xl border border-gray-200 dark:border-[#30363d] shadow-2xl flex flex-col max-h-[80vh] transition-colors duration-300">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-[#30363d]">
          <div className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
             <BrainCircuit className="w-6 h-6 text-purple-600 dark:text-purple-400" />
             <h2 className="text-lg font-bold">Strategy Analysis: {badgeName}</h2>
          </div>
          <button onClick={onClose} className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto text-gray-700 dark:text-gray-300 leading-relaxed space-y-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
               <Loader2 className="w-12 h-12 animate-spin text-purple-600 dark:text-purple-500 mb-4" />
               <p className="text-purple-600 dark:text-purple-400 font-mono animate-pulse">Analyzing strategy...</p>
            </div>
          ) : (
            <div className="prose dark:prose-invert max-w-none">
              <div className="whitespace-pre-wrap">{strategy}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StrategyModal;