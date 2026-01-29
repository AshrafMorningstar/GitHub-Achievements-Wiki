import React, { useState } from 'react';
import { Badge } from '../types';
import { Award, Lock, Unlock, Zap, Trophy, ArrowLeft, Calendar, Share2, Star, CheckCircle, Info, ChevronRight, Copy, Check } from 'lucide-react';

interface BadgeDetailProps {
  badge: Badge;
  onBack: () => void;
  onAnalyze: () => void;
  isUnlocked: boolean;
  onToggleUnlock: () => void;
}

const BadgeDetail: React.FC<BadgeDetailProps> = ({ badge, onBack, onAnalyze, isUnlocked, onToggleUnlock }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyId = () => {
    navigator.clipboard.writeText(badge.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full animate-in slide-in-from-right-8 fade-in duration-500 ease-out">
      
      {/* Navigation Bar */}
      <div className="mb-6 flex items-center justify-between">
        <button 
          onClick={onBack}
          className="group flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/80 dark:bg-[#161b22]/80 hover:bg-white dark:hover:bg-[#21262d] border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 transition-all hover:shadow-lg active:scale-95 backdrop-blur-md"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="font-semibold text-sm tracking-wide">Back to Gallery</span>
        </button>
      </div>

      <div className="bg-white/80 dark:bg-[#161b22]/80 backdrop-blur-2xl rounded-[2.5rem] border border-white/20 dark:border-white/5 shadow-2xl overflow-hidden relative">
        
        {/* Cinematic Header */}
        <div className="relative h-96 w-full overflow-hidden group">
           {/* Dynamic Background based on rarity */}
           <div className={`absolute inset-0 bg-gradient-to-br transition-all duration-1000
             ${badge.rarity === 'Legendary' ? 'from-amber-900 via-orange-900 to-black' : 
               badge.rarity === 'Rare' ? 'from-purple-900 via-indigo-900 to-black' : 
               badge.rarity === 'Event' ? 'from-cyan-900 via-blue-900 to-black' :
               'from-slate-800 via-gray-900 to-black'}`}>
           </div>
           
           {/* Texture & Light Overlays */}
           <div className="absolute inset-0 bg-[url('https://github.githubassets.com/images/modules/site/home/globe-texture.png')] opacity-10 bg-center bg-no-repeat bg-cover mix-blend-overlay"></div>
           <div className="absolute inset-0 bg-gradient-to-t from-[#161b22] via-transparent to-transparent opacity-90"></div>
           <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_50%_-20%,rgba(255,255,255,0.1),transparent_70%)]"></div>
           
           {/* Content Container */}
           <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pt-8">
             
             {/* Badge Icon/Image */}
             <div className="relative group/icon mb-8">
                {/* Glow Effect */}
                <div className={`absolute inset-0 rounded-full blur-[60px] opacity-40 transition-colors duration-1000 ${isUnlocked ? 'bg-green-400' : 'bg-white'} transform scale-150`}></div>
                
                {badge.imageUrl ? (
                  <img src={badge.imageUrl} alt={badge.name} className={`w-48 h-48 rounded-full border-[8px] shadow-2xl relative z-10 object-cover bg-gray-900 transition-all duration-700 hover:scale-105 hover:rotate-3
                    ${isUnlocked ? 'border-green-500 grayscale-0' : 'border-white/10 dark:border-white/5 grayscale'}
                  `} />
                ) : (
                  <div className="w-48 h-48 rounded-full bg-[#161b22] flex items-center justify-center border-[8px] border-white/10 shadow-2xl relative z-10 backdrop-blur-md">
                     <Award className="w-24 h-24 text-gray-400" />
                  </div>
                )}
                
                {isUnlocked && (
                  <div className="absolute -bottom-2 -right-2 z-30 bg-gradient-to-br from-green-500 to-emerald-600 text-white p-3 rounded-full border-[6px] border-[#161b22] shadow-xl animate-in zoom-in duration-500">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                )}
             </div>

             <h1 className="text-4xl md:text-6xl font-display font-extrabold text-white tracking-tight drop-shadow-2xl text-center px-4 mb-4">
               {badge.name}
             </h1>

             {/* Pills */}
             <div className="flex flex-wrap justify-center items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
                <span className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest border backdrop-blur-xl shadow-lg
                  ${badge.rarity === 'Legendary' ? 'bg-amber-500/20 text-amber-100 border-amber-500/30' : 
                    badge.rarity === 'Rare' ? 'bg-purple-500/20 text-purple-100 border-purple-500/30' : 
                    badge.rarity === 'Event' ? 'bg-cyan-500/20 text-cyan-100 border-cyan-500/30' :
                    'bg-gray-500/20 text-gray-200 border-gray-500/30'}
                `}>
                  {badge.rarity}
                </span>
                
                <span className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest border backdrop-blur-xl shadow-lg flex items-center gap-2
                   ${isUnlocked 
                     ? 'bg-green-500/20 text-green-100 border-green-500/30' 
                     : 'bg-white/10 text-white border-white/10'
                   }
                `}>
                  <div className={`w-2 h-2 rounded-full ${isUnlocked ? 'bg-green-400 shadow-[0_0_10px_rgba(74,222,128,1)]' : 'bg-gray-400'}`}></div>
                  {isUnlocked ? 'Unlocked' : 'Locked'}
                </span>

                {badge.isHistorical && (
                  <span className="px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest bg-red-500/20 text-red-100 border border-red-500/30 flex items-center gap-2 backdrop-blur-xl shadow-lg">
                    <Calendar className="w-3 h-3" /> Legacy
                  </span>
                )}
             </div>
           </div>
        </div>

        {/* Content Body */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 lg:divide-x divide-gray-200 dark:divide-white/5 bg-white dark:bg-[#161b22]">
          
          {/* Main Info Column */}
          <div className="lg:col-span-8 p-8 md:p-12 space-y-12">
             
             {/* Description */}
             <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
               <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                 <Info className="w-4 h-4" /> Overview
               </h3>
               <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-200 leading-relaxed font-light">
                 {badge.description}
               </p>
             </div>

             {/* Unlock Guide Card */}
             <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
                <div className="bg-gradient-to-br from-blue-50/80 to-indigo-50/50 dark:from-[#1f2937]/50 dark:to-[#111827]/50 rounded-3xl p-8 border border-blue-100 dark:border-white/5 relative overflow-hidden group hover:shadow-lg transition-all duration-500">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none group-hover:bg-blue-500/10 transition-colors"></div>
                  
                  <h3 className="text-sm font-bold text-blue-900 dark:text-blue-200 mb-4 flex items-center gap-2 uppercase tracking-widest relative z-10">
                    <Lock className="w-4 h-4 text-blue-500" />
                    Strategic Guide
                  </h3>
                  <p className="text-lg text-blue-900 dark:text-gray-300 leading-relaxed relative z-10 font-medium">
                    {badge.unlockGuide}
                  </p>
                </div>
             </div>

             {/* Tiers */}
             {badge.tiers && badge.tiers.length > 0 && (
               <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-400">
                  <div className="flex items-center justify-between mb-6">
                     <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest flex items-center gap-2">
                        <Trophy className="w-4 h-4" />
                        Progress Tiers
                     </h3>
                     {/* Progress Bar Label */}
                     <span className={`text-xs font-bold tracking-widest uppercase ${isUnlocked ? 'text-green-500' : 'text-gray-400'}`}>
                       {isUnlocked ? '100% Complete' : '0% Complete'}
                     </span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full mb-8 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ease-out ${isUnlocked ? 'bg-gradient-to-r from-green-400 to-emerald-500 w-full' : 'w-0'}`}
                    ></div>
                  </div>

                  <div className="space-y-4">
                    {badge.tiers.map((tier, idx) => (
                      <div key={idx} className="group flex items-center p-5 bg-white dark:bg-[#0d1117]/50 border border-gray-100 dark:border-white/5 rounded-2xl hover:border-blue-500/30 transition-all shadow-sm hover:shadow-lg hover:bg-gray-50 dark:hover:bg-[#1f2937]/30">
                         {/* Rank Icon */}
                         <div className={`w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center font-bold mr-5 text-lg shadow-inner border border-white/10
                           ${tier.name === 'Gold' ? 'bg-gradient-to-br from-amber-200 to-yellow-500 text-yellow-900' : 
                             tier.name === 'Silver' ? 'bg-gradient-to-br from-slate-200 to-slate-400 text-slate-800' : 
                             tier.name === 'Bronze' ? 'bg-gradient-to-br from-orange-200 to-orange-400 text-orange-900' : 
                             'bg-blue-100 text-blue-700'}
                         `}>
                           {idx + 1}
                         </div>
                         
                         <div className="flex-grow flex flex-col md:flex-row md:items-center justify-between gap-2">
                           <div>
                             <h4 className="font-bold text-gray-900 dark:text-gray-100 text-lg group-hover:text-blue-500 transition-colors flex items-center gap-2">
                               {tier.name}
                               {isUnlocked && <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 animate-in zoom-in" />}
                             </h4>
                             <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider font-bold mt-0.5">Objective</p>
                           </div>
                           
                           <div className="bg-gray-50 dark:bg-[#161b22] px-4 py-2 rounded-lg border border-gray-200 dark:border-white/5">
                              <p className="text-gray-700 dark:text-gray-200 font-mono font-medium text-sm">
                                {tier.requirements}
                              </p>
                           </div>
                         </div>
                      </div>
                    ))}
                  </div>
               </div>
             )}
          </div>

          {/* Sidebar Actions Column */}
          <div className="lg:col-span-4 p-8 md:p-12 bg-gray-50/80 dark:bg-[#0d1117]/30 space-y-10 backdrop-blur-sm">
            
            {/* Action Buttons */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">Control Panel</h3>
               <button 
                 onClick={onToggleUnlock}
                 className={`w-full px-6 py-4 rounded-xl font-bold border transition-all duration-300 flex items-center justify-center gap-3 shadow-md hover:shadow-xl active:scale-95
                   ${isUnlocked 
                     ? 'bg-white dark:bg-[#161b22] text-red-600 dark:text-red-400 border-gray-200 dark:border-white/10 hover:border-red-200 dark:hover:border-red-900/50' 
                     : 'bg-gradient-to-r from-green-600 to-emerald-600 text-white border-transparent hover:brightness-110'
                   }
                 `}
               >
                 {isUnlocked ? <Lock className="w-5 h-5" /> : <Unlock className="w-5 h-5" />}
                 {isUnlocked ? 'Re-lock Badge' : 'Unlock Badge'}
               </button>
               
               <button 
                 onClick={onAnalyze}
                 className="w-full bg-white dark:bg-[#161b22] hover:bg-gray-50 dark:hover:bg-[#21262d] text-gray-900 dark:text-white border border-gray-200 dark:border-white/10 px-6 py-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-3 shadow-sm hover:shadow-lg active:scale-95 group"
               >
                 <Zap className="w-5 h-5 text-purple-500 group-hover:scale-110 transition-transform" />
                 Generate Strategy
               </button>
            </div>

            {/* Visual Stats */}
            <div className="space-y-6">
              <div className="bg-white dark:bg-[#161b22] p-6 rounded-2xl border border-gray-200 dark:border-white/5 shadow-sm hover:shadow-md transition-shadow">
                 <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">Category</h3>
                 <div className="flex items-center gap-4">
                   <div className="w-4 h-4 rounded-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.6)] animate-pulse"></div>
                   <p className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">{badge.category}</p>
                 </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/10 p-6 rounded-2xl border border-blue-100 dark:border-blue-900/30">
                 <div className="flex gap-4">
                    <div className="p-2.5 bg-blue-100 dark:bg-blue-900/40 rounded-xl h-fit">
                      <Share2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h4 className="font-bold text-blue-900 dark:text-blue-100 mb-1">Share Access</h4>
                      <p className="text-sm leading-relaxed text-blue-800 dark:text-blue-300 font-medium opacity-80">
                        Unlocked this badge? This card is optimized for social sharing.
                      </p>
                    </div>
                 </div>
              </div>
            </div>

            <div className="pt-8 border-t border-gray-200 dark:border-white/5 flex items-center justify-center">
                <div className="flex items-center gap-2 group cursor-pointer" onClick={handleCopyId} title="Copy Badge ID">
                   <p className="text-xs text-center text-gray-400 dark:text-gray-600 font-mono transition-colors group-hover:text-blue-500">
                      ID: {badge.id}
                   </p>
                   <button className="p-1 rounded hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                      {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3 text-gray-400 group-hover:text-blue-500" />}
                   </button>
                </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default BadgeDetail;