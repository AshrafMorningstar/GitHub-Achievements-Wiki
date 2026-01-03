/*
 Copyright (c) 2026 Ashraf Morningstar
 These are personal recreations of existing projects, developed by Ashraf Morningstar
 for learning and skill development.
 Original project concepts remain the intellectual property of their respective creators.
 Repository: https://github.com/AshrafMorningstar
*/

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { INITIAL_BADGES } from './constants';
import BadgeCard from './components/BadgeCard';
import BadgeDetail from './components/BadgeDetail';
import GeminiTools from './components/GeminiTools';
import StrategyModal from './components/StrategyModal';
import ProfileChecker from './components/ProfileChecker';
import { analyzeUnlockStrategy } from './services/geminiService';
import { Badge } from './types';
import { Github, Sun, Moon, Search, SortAsc, LayoutGrid, Calendar, Tag, Sparkles } from 'lucide-react';

const App: React.FC = () => {
  const [badges, setBadges] = useState<Badge[]>(INITIAL_BADGES);
  const [strategyModalOpen, setStrategyModalOpen] = useState(false);
  const [selectedBadgeForStrategy, setSelectedBadgeForStrategy] = useState<Badge | null>(null);
  const [strategyContent, setStrategyContent] = useState('');
  
  // Track specific badge loading state for the card button
  const [analyzingBadgeId, setAnalyzingBadgeId] = useState<string | null>(null);
  // General modal loading state
  const [strategyLoading, setStrategyLoading] = useState(false);

  // View State: 'gallery' or 'detail'
  const [view, setView] = useState<'gallery' | 'detail'>('gallery');
  const [detailBadge, setDetailBadge] = useState<Badge | null>(null);
  const [lastActiveBadgeId, setLastActiveBadgeId] = useState<string | null>(null);

  // Filter & Sort State
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'rarity' | 'category'>('name');
  const [filterType, setFilterType] = useState<'all' | 'owned' | 'unowned'>('all');
  const [filterCategory, setFilterCategory] = useState<string>('All');

  // Theme State
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'dark';
    }
    return 'dark';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Scroll Restoration Effect
  useEffect(() => {
    if (view === 'gallery' && lastActiveBadgeId) {
      // Use a small timeout to ensure DOM is ready after transition
      const timer = setTimeout(() => {
        const element = document.getElementById(`badge-card-${lastActiveBadgeId}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [view, lastActiveBadgeId]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  // Profile Tracking State
  const [unlockedIds, setUnlockedIds] = useState<Set<string>>(new Set());
  const [isTracking, setIsTracking] = useState(false);

  const handleAnalyze = async (badge: Badge, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    
    // Set loading states
    setAnalyzingBadgeId(badge.id);
    setSelectedBadgeForStrategy(badge);
    setStrategyLoading(true);
    setStrategyContent('');
    
    // Open modal immediately to show loading state there too, 
    // or wait. Here we open immediately but show loader.
    setStrategyModalOpen(true);

    try {
      const analysis = await analyzeUnlockStrategy(badge.name);
      setStrategyContent(analysis);
    } catch (e) {
      setStrategyContent("Failed to analyze strategy.");
    } finally {
      setStrategyLoading(false);
      setAnalyzingBadgeId(null);
    }
  };

  const handleAddCustomBadge = (url: string, prompt: string) => {
    const newBadge: Badge = {
      id: `custom-${Date.now()}`,
      name: 'Custom Concept',
      description: prompt,
      rarity: 'Legendary',
      category: 'Concept',
      unlockGuide: 'This is a custom generated badge concept.',
      imageUrl: url
    };
    setBadges(prev => [newBadge, ...prev]);
  };

  const handleProfileLoaded = (ids: string[]) => {
    setUnlockedIds(new Set(ids));
    setIsTracking(true);
  };

  const handleClearProfile = () => {
    setUnlockedIds(new Set());
    setIsTracking(false);
  };

  const handleBadgeClick = (badge: Badge) => {
    setLastActiveBadgeId(badge.id);
    setDetailBadge(badge);
    setView('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToGallery = () => {
    setView('gallery');
    setTimeout(() => setDetailBadge(null), 300); // Cleanup after transition
  };

  const toggleBadgeUnlock = (badgeId: string) => {
    setUnlockedIds(prev => {
      const next = new Set(prev);
      if (next.has(badgeId)) {
        next.delete(badgeId);
      } else {
        next.add(badgeId);
      }
      return next;
    });
    if (!isTracking) setIsTracking(true);
  };

  // Get unique categories for dropdown
  const categories = useMemo(() => {
    const cats = new Set(badges.map(b => b.category));
    return Array.from(cats).sort();
  }, [badges]);

  // Filter and Sort Logic
  const filteredAndSortedBadges = useMemo(() => {
    let result = badges.filter(b => 
      (b.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
       b.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
       b.unlockGuide.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    if (filterCategory !== 'All') {
      result = result.filter(b => b.category === filterCategory);
    }

    if (filterType === 'owned') {
      result = result.filter(b => unlockedIds.has(b.id));
    } else if (filterType === 'unowned') {
      result = result.filter(b => !unlockedIds.has(b.id));
    }

    result.sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'category') return a.category.localeCompare(b.category);
      if (sortBy === 'rarity') {
        const priority = { 'Common': 1, 'Rare': 2, 'Legendary': 3, 'Event': 4 };
        return (priority[b.rarity as keyof typeof priority] || 0) - (priority[a.rarity as keyof typeof priority] || 0);
      }
      return 0;
    });

    return result;
  }, [badges, searchQuery, sortBy, filterCategory, filterType, unlockedIds]);

  const earnableBadges = filteredAndSortedBadges.filter(b => !b.isHistorical);
  const historicalBadges = filteredAndSortedBadges.filter(b => b.isHistorical);

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0a0c10] text-gray-900 dark:text-gray-300 font-sans selection:bg-indigo-500/30 transition-colors duration-500 overflow-x-hidden relative">
      
      {/* Premium Animated Background Mesh */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[80%] h-[80%] rounded-full bg-blue-500/5 dark:bg-blue-600/5 blur-[120px] animate-float opacity-70"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-purple-500/5 dark:bg-purple-600/5 blur-[120px] animate-float opacity-70" style={{ animationDelay: '3s', animationDirection: 'reverse' }}></div>
        <div className="absolute top-[30%] left-[40%] w-[40%] h-[40%] rounded-full bg-pink-500/5 dark:bg-pink-600/5 blur-[100px] animate-pulse-slow opacity-50" style={{ animationDelay: '5s' }}></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-soft-light"></div>
      </div>

      {/* Header */}
      <header className="glass-panel sticky top-0 z-40 transition-all duration-300 border-b-0 shadow-sm dark:shadow-none backdrop-blur-xl bg-white/70 dark:bg-[#161b22]/80">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full md:w-auto group cursor-pointer" onClick={() => { setView('gallery'); window.scrollTo({top: 0, behavior: 'smooth'}); }}>
              <div className="p-2.5 bg-gradient-to-br from-gray-900 to-gray-800 dark:from-white dark:to-gray-200 rounded-xl shadow-lg group-hover:scale-105 transition-transform duration-300">
                <Github className="w-6 h-6 text-white dark:text-gray-900" />
              </div>
              <div className="flex flex-col">
                 <h1 className="text-xl font-display font-bold text-gray-900 dark:text-white tracking-tight leading-none">GitHub <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">Achievements</span></h1>
                 <p className="text-[10px] font-bold text-gray-500 tracking-widest uppercase mt-0.5">Wiki & Strategy Hub</p>
              </div>
            </div>

            <div className="flex items-center gap-4 w-full md:w-auto flex-1 justify-end">
               {/* Search Bar - Only show in gallery view */}
               {view === 'gallery' && (
                 <div className="relative flex-1 max-w-lg group hidden md:block animate-in fade-in zoom-in-95 duration-500">
                   <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                     <Search className="w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                   </div>
                   <input 
                     type="text"
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     placeholder="Search badges, strategies..."
                     className="w-full bg-white/50 dark:bg-[#0d1117]/50 border border-gray-200 dark:border-[#30363d] rounded-2xl pl-11 pr-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm hover:bg-white/80 dark:hover:bg-[#0d1117]"
                   />
                 </div>
               )}

               <button 
                 onClick={toggleTheme}
                 className="p-2.5 rounded-xl bg-white/50 dark:bg-[#161b22]/50 border border-gray-200 dark:border-[#30363d] text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-[#30363d] hover:shadow-md transition-all active:scale-95"
                 aria-label="Toggle Theme"
               >
                 {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
               </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 md:py-12 relative z-10 min-h-[85vh]">
        
        {view === 'detail' && detailBadge ? (
          <BadgeDetail 
            badge={detailBadge}
            onBack={handleBackToGallery}
            onAnalyze={() => handleAnalyze(detailBadge)}
            isUnlocked={unlockedIds.has(detailBadge.id)}
            onToggleUnlock={() => toggleBadgeUnlock(detailBadge.id)}
          />
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
            {/* Hero Section */}
            <div className="text-center mb-16 relative">
              <div className="inline-flex items-center justify-center px-4 py-1.5 mb-6 rounded-full bg-white/80 dark:bg-[#161b22]/80 backdrop-blur-md border border-blue-200 dark:border-blue-900/30 shadow-sm hover:shadow-md transition-shadow cursor-default ring-1 ring-blue-500/10">
                 <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400 mr-2" />
                 <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 text-xs font-bold uppercase tracking-widest">Interactive Guide</span>
              </div>
              <h2 className="text-5xl md:text-7xl font-display font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight leading-tight drop-shadow-sm">
                Unlock Your <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400">True Potential</span>
              </h2>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed font-light">
                The ultimate handbook to GitHub achievements. Track your progress, discover hidden strategies, and master your profile.
              </p>
            </div>

            {/* Profile Checker Section */}
            <div className="max-w-4xl mx-auto mb-16">
              <ProfileChecker 
                onProfileLoaded={handleProfileLoaded} 
                onClear={handleClearProfile} 
              />
            </div>

            {/* Split Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left: Badge Content */}
              <div className="lg:col-span-8 space-y-8">
                
                {/* Controls Bar */}
                <div className="glass-panel p-2 rounded-2xl flex flex-col md:flex-row gap-4 items-center justify-between sticky top-24 z-30 shadow-xl shadow-gray-200/50 dark:shadow-black/20 transition-all duration-300 border-white/40 dark:border-white/5 backdrop-blur-xl">
                  <div className="flex flex-wrap items-center gap-2 w-full md:w-auto px-2">
                    
                    {/* Sort Dropdown */}
                    <div className="relative group">
                       <div className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 cursor-pointer transition-colors">
                         <SortAsc className="w-4 h-4 text-gray-500" />
                         <select 
                           value={sortBy} 
                           onChange={(e) => setSortBy(e.target.value as any)}
                           className="bg-transparent text-sm font-semibold text-gray-700 dark:text-gray-300 focus:outline-none cursor-pointer appearance-none pr-4"
                         >
                           <option value="name">Name</option>
                           <option value="rarity">Rarity</option>
                           <option value="category">Category</option>
                         </select>
                       </div>
                    </div>

                    <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-2"></div>

                    {/* Category Dropdown */}
                    <div className="relative group">
                       <div className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 cursor-pointer transition-colors">
                         <Tag className="w-4 h-4 text-gray-500" />
                         <select 
                           value={filterCategory} 
                           onChange={(e) => setFilterCategory(e.target.value)}
                           className="bg-transparent text-sm font-semibold text-gray-700 dark:text-gray-300 focus:outline-none cursor-pointer appearance-none pr-4"
                         >
                           <option value="All">All Categories</option>
                           {categories.map(cat => (
                             <option key={cat} value={cat}>{cat}</option>
                           ))}
                         </select>
                       </div>
                    </div>
                  </div>
                  
                  {/* Filter Tabs */}
                  <div className="flex bg-gray-100 dark:bg-[#0d1117] p-1 rounded-xl w-full md:w-auto border border-gray-200 dark:border-[#30363d]">
                    <button 
                      onClick={() => setFilterType('all')}
                      className={`flex-1 md:flex-none px-4 py-1.5 text-xs font-bold rounded-lg transition-all duration-300 ${filterType === 'all' ? 'bg-white dark:bg-[#30363d] text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                    >
                      All
                    </button>
                    <button 
                      onClick={() => setFilterType('owned')}
                      className={`flex-1 md:flex-none px-4 py-1.5 text-xs font-bold rounded-lg transition-all duration-300 ${filterType === 'owned' ? 'bg-white dark:bg-[#30363d] text-green-600 dark:text-green-400 shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                    >
                      Owned
                    </button>
                    <button 
                      onClick={() => setFilterType('unowned')}
                      className={`flex-1 md:flex-none px-4 py-1.5 text-xs font-bold rounded-lg transition-all duration-300 ${filterType === 'unowned' ? 'bg-white dark:bg-[#30363d] text-red-500 dark:text-red-400 shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                    >
                      Unowned
                    </button>
                  </div>
                </div>

                {/* Active Badges Grid */}
                {earnableBadges.length > 0 && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between px-2">
                      <h3 className="text-xl font-display font-bold text-gray-900 dark:text-white flex items-center gap-3">
                        <div className="p-1.5 bg-blue-500 rounded-lg shadow-lg shadow-blue-500/30">
                          <LayoutGrid className="w-5 h-5 text-white" />
                        </div>
                        Earnable Achievements
                      </h3>
                      <span className="text-[10px] font-bold bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-3 py-1.5 rounded-full border border-blue-100 dark:border-blue-800 uppercase tracking-widest">
                        {earnableBadges.length} Active
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {earnableBadges.map(badge => (
                        <BadgeCard 
                          key={badge.id} 
                          badge={badge} 
                          onClick={handleBadgeClick}
                          onAnalyze={handleAnalyze}
                          isUnlocked={unlockedIds.has(badge.id)}
                          isTracking={isTracking}
                          isAnalyzing={analyzingBadgeId === badge.id}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Retired Badges Grid */}
                {historicalBadges.length > 0 && (
                  <div className="space-y-6 pt-12 border-t border-gray-200/50 dark:border-gray-800/50">
                     <div className="flex items-center justify-between px-2 opacity-80">
                      <h3 className="text-xl font-display font-bold text-gray-600 dark:text-gray-400 flex items-center gap-3">
                        <div className="p-1.5 bg-gray-500 rounded-lg shadow-lg">
                          <Calendar className="w-5 h-5 text-white" />
                        </div>
                        Historical & Retired
                      </h3>
                      <span className="text-[10px] font-bold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-3 py-1.5 rounded-full uppercase tracking-widest">
                        {historicalBadges.length} Archived
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-80 hover:opacity-100 transition-opacity duration-300">
                      {historicalBadges.map(badge => (
                        <BadgeCard 
                          key={badge.id} 
                          badge={badge} 
                          onClick={handleBadgeClick}
                          onAnalyze={handleAnalyze}
                          isUnlocked={unlockedIds.has(badge.id)}
                          isTracking={isTracking}
                          isAnalyzing={analyzingBadgeId === badge.id}
                        />
                      ))}
                    </div>
                  </div>
                )}
                
                {filteredAndSortedBadges.length === 0 && (
                   <div className="flex flex-col items-center justify-center py-24 text-center glass-panel rounded-2xl border-dashed border-2 border-gray-200 dark:border-gray-800">
                     <Search className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-4" />
                     <h3 className="text-lg font-bold text-gray-900 dark:text-white">No badges found</h3>
                     <p className="text-gray-500">Try adjusting your search or filters.</p>
                   </div>
                )}
              </div>

              {/* Right: Smart Tools Sticky */}
              <div className="lg:col-span-4 relative">
                <div className="sticky top-24 space-y-6">
                  <div className="mb-2 pl-1">
                     <h3 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-1">Command Center</h3>
                     <p className="text-sm text-gray-500">Live search and smart generation.</p>
                  </div>
                  
                  <GeminiTools onAddCustomBadge={handleAddCustomBadge} />

                  <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group hover:shadow-xl transition-all duration-500 border border-white/50 dark:border-white/5">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-purple-500/20 transition-all"></div>
                    <h4 className="font-display font-bold text-gray-900 dark:text-white mb-2 relative z-10 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-purple-500" />
                      Pro Insight
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 relative z-10 leading-relaxed">
                      Use the <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">Badge Generator</span> to create custom 4K designs. Perfect for visualizing your next big milestone.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200/50 dark:border-gray-800/50 bg-white/50 dark:bg-[#0a0c10]/50 backdrop-blur-xl py-12 mt-24">
        <div className="max-w-7xl mx-auto px-4 text-center">
           <div className="flex justify-center mb-6">
             <div className="p-3 bg-white dark:bg-[#161b22] rounded-full shadow-lg border border-gray-100 dark:border-gray-800 hover:scale-110 transition-transform duration-300">
               <Github className="w-6 h-6 text-gray-900 dark:text-white" />
             </div>
           </div>
           <p className="text-gray-500 mb-2 font-medium">
             GitHub Achievements Wiki &copy; {new Date().getFullYear()}
           </p>
           <p className="text-gray-600 dark:text-gray-400 text-sm font-semibold tracking-wide">
             Created by Ashraf Morningstar
           </p>
        </div>
      </footer>

      {/* Modals */}
      <StrategyModal 
        isOpen={strategyModalOpen}
        onClose={() => setStrategyModalOpen(false)}
        badgeName={selectedBadgeForStrategy?.name || ''}
        strategy={strategyContent}
        loading={strategyLoading}
      />
    </div>
  );
};

export default App;