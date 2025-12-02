import React from 'react';
import { Badge } from '../types';
import { Award, Lock, ExternalLink } from 'lucide-react';

interface BadgeCardProps {
  badge: Badge;
  onAnalyze: (badge: Badge) => void;
}

const BadgeCard: React.FC<BadgeCardProps> = ({ badge, onAnalyze }) => {
  const getRarityColor = (r: string) => {
    switch (r) {
      case 'Legendary': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'Rare': return 'bg-purple-500/20 text-purple-400 border-purple-500/50';
      case 'Event': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  return (
    <div className="group relative bg-[#161b22] border border-[#30363d] rounded-lg p-6 hover:border-blue-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-900/10 flex flex-col h-full">
      <div className="flex justify-between items-start mb-4">
        <div className="relative">
          {badge.imageUrl ? (
             <img 
               src={badge.imageUrl} 
               alt={badge.name} 
               className="w-16 h-16 rounded-full border-2 border-[#30363d] group-hover:scale-110 transition-transform duration-300"
               onError={(e) => {
                 (e.target as HTMLImageElement).src = 'https://picsum.photos/200';
               }}
             />
          ) : (
             <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center border-2 border-[#30363d] group-hover:scale-110 transition-transform duration-300">
                <Award className="w-8 h-8 text-gray-400" />
             </div>
          )}
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getRarityColor(badge.rarity)}`}>
          {badge.rarity}
        </span>
      </div>
      
      <h3 className="text-xl font-bold text-gray-100 mb-2 group-hover:text-blue-400 transition-colors">
        {badge.name}
      </h3>
      
      <p className="text-gray-400 text-sm mb-4 flex-grow">
        {badge.description}
      </p>

      <div className="space-y-3 mt-auto">
        <div className="p-3 bg-[#0d1117] rounded border border-[#30363d]">
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-300 mb-1">
            <Lock className="w-3 h-3" />
            <span>How to Unlock:</span>
          </div>
          <p className="text-xs text-gray-500 leading-relaxed">
            {badge.unlockGuide}
          </p>
        </div>

        <button 
          onClick={() => onAnalyze(badge)}
          className="w-full py-2 px-4 bg-[#238636] hover:bg-[#2ea043] text-white text-sm font-semibold rounded transition-colors flex items-center justify-center gap-2"
        >
          <ExternalLink className="w-4 h-4" />
          Analyze Strategy
        </button>
      </div>
    </div>
  );
};

export default BadgeCard;
