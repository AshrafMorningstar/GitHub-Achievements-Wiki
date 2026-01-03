/*
 Copyright (c) 2026 Ashraf Morningstar
 These are personal recreations of existing projects, developed by Ashraf Morningstar
 for learning and skill development.
 Original project concepts remain the intellectual property of their respective creators.
 Repository: https://github.com/AshrafMorningstar
*/

import React from 'react';
import { Badge } from '../types';
import { Award, Lock, ExternalLink, CheckCircle, Sparkles, Loader2 } from 'lucide-react';

interface BadgeCardProps {
  badge: Badge;
  onClick: (badge: Badge) => void;
  onAnalyze: (badge: Badge, e: React.MouseEvent) => void;
  isUnlocked?: boolean;
  isTracking?: boolean;
  isAnalyzing?: boolean;
}

const BadgeCard: React.FC<BadgeCardProps> = ({ 
  badge, 
  onClick, 
  onAnalyze, 
  isUnlocked = false, 
  isTracking = false,
  isAnalyzing = false 
}) => {
  const getRarityConfig = (r: string) => {
    switch (r) {
      case 'Legendary': return {
        bg: 'from-amber-500/10 to-orange-500/5',
        border: 'border-amber-200/50 dark:border-amber-500/30',
        text: 'text-amber-700 dark:text-amber-400',
        icon: 'text-amber-500',
        badge: 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300',
        glow: 'group-hover:shadow-amber-500/20'
      };
      case 'Rare': return {
        bg: 'from-purple-500/10 to-indigo-500/5',
        border: 'border-purple-200/50 dark:border-purple-500/30',
        text: 'text-purple-700 dark:text-purple-400',
        icon: 'text-purple-500',
        badge: 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300',
        glow: 'group-hover:shadow-purple-500/20'
      };
      case 'Event': return {
        bg: 'from-cyan-500/10 to-blue-500/5',
        border: 'border-cyan-200/50 dark:border-cyan-500/30',
        text: 'text-cyan-700 dark:text-cyan-400',
        icon: 'text-cyan-500',
        badge: 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-800 dark:text-cyan-300',
        glow: 'group-hover:shadow-cyan-500/20'
      };
      default: return {
        bg: 'from-gray-100/50 to-gray-50/10',
        border: 'border-gray-200/50 dark:border-gray-700/50',
        text: 'text-gray-600 dark:text-gray-400',
        icon: 'text-gray-400',
        badge: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300',
        glow: 'group-hover:shadow-gray-500/20'
      };
    }
  };

  const theme = getRarityConfig(badge.rarity);
  const isDimmed = isTracking && !isUnlocked;

  return (
    <div 
      id={`badge-card-${badge.id}`}
      onClick={() => onClick(badge)}
      className={`group relative bg-white/70 dark:bg-[#161b22]/70 backdrop-blur-md border rounded-2xl p-6 flex flex-col h-full cursor-pointer 
      transition-all duration-300 ease-out transform 
      hover:scale-[1.02] hover:-translate-y-1 hover:shadow-2xl hover:bg-white dark:hover:bg-[#1a212c]
      ${isUnlocked 
        ? 'border-green-500/50 shadow-[0_0_20px_rgba(34,197,94,0.15)]' 
        : isDimmed 
          ? 'border-gray-200 dark:border-[#30363d] opacity-60 grayscale hover:grayscale-0 hover:opacity-100' 
          : `border-gray-200 dark:border-[#30363d] ${theme.glow}`
      }
      ${theme.border}
    `}>
      {/* Subtle Gradient Overlay on Hover */}
      <div className={`absolute inset-0 bg-gradient-to-br ${theme.bg} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}></div>

      {/* Tooltip Preview - Premium Style */}
      <div className="absolute opacity-0 group-hover:opacity-100 transition-all duration-300 bottom-full left-1/2 -translate-x-1/2 mb-4 w-72 z-[60] pointer-events-none transform translate-y-2 group-hover:translate-y-0">
        <div className="bg-[#0d1117]/95 backdrop-blur-xl text-white text-xs p-4 rounded-xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] border border-white/10 relative ring-1 ring-white/10">
          <div className="font-bold mb-2 flex items-center gap-2 text-blue-400 uppercase tracking-wider text-[10px]">
            <Sparkles className="w-3 h-3" />
             How to Earn
          </div>
          <p className="leading-relaxed text-gray-300 font-medium">{badge.unlockGuide}</p>
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-8 border-transparent border-t-[#0d1117]/95"></div>
        </div>
      </div>

      {isUnlocked && (
        <div className="absolute top-4 right-4 animate-in fade-in zoom-in duration-500 z-20">
           <div className="bg-green-500 text-white p-1.5 rounded-full shadow-lg shadow-green-500/30 ring-2 ring-white dark:ring-[#161b22]">
             <CheckCircle className="w-4 h-4" />
           </div>
        </div>
      )}

      <div className="flex justify-between items-start mb-5 z-10 relative">
        <div className="relative group-hover:scale-110 transition-transform duration-500 ease-spring">
          {badge.imageUrl ? (
             <img 
               src={badge.imageUrl} 
               alt={badge.name} 
               className={`w-20 h-20 rounded-full border-4 shadow-lg transition-all duration-300 object-cover bg-white dark:bg-gray-800
                 ${isUnlocked ? 'border-green-500' : 'border-white dark:border-[#30363d]'}
               `}
             />
          ) : (
             <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-50 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center border-4 border-white dark:border-[#30363d] shadow-lg">
                <Award className={`w-8 h-8 ${theme.text}`} />
             </div>
          )}
          {/* Shine effect on image */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/0 via-white/40 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
        </div>
        
        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${theme.badge} border-transparent shadow-sm transition-all duration-300
          ${isUnlocked ? 'scale-110 shadow-[0_0_10px_currentColor] animate-pulse' : ''}
        `}>
          {badge.rarity}
        </span>
      </div>
      
      <div className="relative z-10 flex-grow">
        <h3 className={`text-xl font-display font-bold mb-2 transition-colors duration-300 ${isUnlocked ? 'text-green-600 dark:text-green-400' : 'text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400'}`}>
          {badge.name}
        </h3>
        
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 leading-relaxed line-clamp-2 min-h-[40px]">
          {badge.description}
        </p>
      </div>

      <div className="space-y-4 mt-auto relative z-10">
        <div className={`p-3 rounded-lg border transition-colors duration-300 ${isUnlocked ? 'bg-green-50/50 dark:bg-green-900/10 border-green-100 dark:border-green-900/30' : 'bg-gray-50/50 dark:bg-white/5 border-gray-100 dark:border-white/10'}`}>
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
            <Lock className={`w-3 h-3 ${isUnlocked ? 'text-green-500' : ''}`} />
            <span>{isUnlocked ? 'Unlocked' : 'Requirement'}</span>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-2 font-medium">
            {badge.unlockGuide}
          </p>
        </div>

        <button 
          onClick={(e) => {
            if (!isAnalyzing) {
              onAnalyze(badge, e);
            }
          }}
          disabled={isAnalyzing}
          className={`w-full py-2.5 px-4 text-white text-sm font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-95 disabled:opacity-80 disabled:cursor-not-allowed disabled:active:scale-100
            ${isUnlocked 
              ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500' 
              : 'bg-gradient-to-r from-gray-900 to-gray-800 dark:from-white dark:to-gray-200 dark:text-gray-900 hover:scale-[1.02]'
            }
          `}
        >
          {isAnalyzing ? (
            <>
               <Loader2 className="w-4 h-4 animate-spin" /> Analyzing...
            </>
          ) : isUnlocked ? (
            <>
              <CheckCircle className="w-4 h-4" /> View Strategy
            </>
          ) : (
            <>
              <ExternalLink className="w-4 h-4" /> Analyze Strategy
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default BadgeCard;