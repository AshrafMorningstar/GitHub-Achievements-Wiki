import React, { useState } from 'react';
import { INITIAL_BADGES } from './constants';
import BadgeCard from './components/BadgeCard';
import GeminiTools from './components/GeminiTools';
import StrategyModal from './components/StrategyModal';
import ProfileChecker from './components/ProfileChecker';
import { analyzeUnlockStrategy } from './services/geminiService';
import { Badge } from './types';
import { Github, Award } from 'lucide-react';

const App: React.FC = () => {
  const [badges, setBadges] = useState<Badge[]>(INITIAL_BADGES);
  const [strategyModalOpen, setStrategyModalOpen] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  const [strategyContent, setStrategyContent] = useState('');
  const [strategyLoading, setStrategyLoading] = useState(false);

  // Profile Tracking State
  const [unlockedIds, setUnlockedIds] = useState<Set<string>>(new Set());
  const [isTracking, setIsTracking] = useState(false);

  const handleAnalyze = async (badge: Badge) => {
    setSelectedBadge(badge);
    setStrategyModalOpen(true);
    setStrategyLoading(true);
    setStrategyContent('');

    try {
      const analysis = await analyzeUnlockStrategy(badge.name);
      setStrategyContent(analysis);
    } catch (e) {
      setStrategyContent("Failed to analyze strategy.");
    } finally {
      setStrategyLoading(false);
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

  return (
    <div className="min-h-screen bg-[#0d1117] text-gray-300 font-sans selection:bg-blue-500/30">
      {/* Header */}
      <header className="border-b border-[#30363d] bg-[#161b22]/80 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 rounded-full text-black">
              <Github className="w-6 h-6" />
            </div>
            <div>
               <h1 className="text-xl font-bold text-white tracking-tight">GitHub Achievements Wiki</h1>
               <p className="text-xs text-gray-500">Powered by Gemini 2.5 & 3.0</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <a href="https://github.com/Ashraf-Morningstar" target="_blank" rel="noreferrer" className="text-sm text-gray-400 hover:text-white transition-colors">
               Created by Ashraf Morningstar
             </a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-2 mb-6 rounded-full bg-gradient-to-r from-blue-900/50 to-purple-900/50 border border-blue-500/30">
             <Award className="w-5 h-5 text-blue-400 mr-2" />
             <span className="text-blue-200 text-sm font-medium">Uncover Hidden Badges with AI</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">
            The Complete List of <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
              GitHub Profile Achievements
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Discover how to unlock every badge, generate custom concepts, and use deep AI reasoning to plan your contribution strategy.
          </p>
        </div>

        {/* Profile Checker Section */}
        <div className="max-w-4xl mx-auto">
          <ProfileChecker 
            onProfileLoaded={handleProfileLoaded} 
            onClear={handleClearProfile} 
          />
        </div>

        {/* Split Layout: Grid + AI Tools */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
          
          {/* Left: Badge Grid */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                {isTracking ? 'User Progress' : 'Achievements Gallery'}
                {isTracking && (
                   <span className="text-sm font-normal bg-green-900/30 text-green-400 px-2 py-1 rounded-full border border-green-500/30">
                     {unlockedIds.size} Unlocked
                   </span>
                )}
              </h3>
              <span className="text-sm text-gray-500">{badges.length} Items</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {badges.map(badge => (
                <BadgeCard 
                  key={badge.id} 
                  badge={badge} 
                  onAnalyze={handleAnalyze}
                  isUnlocked={unlockedIds.has(badge.id)}
                  isTracking={isTracking}
                />
              ))}
            </div>
          </div>

          {/* Right: AI Tools Sticky */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <div className="mb-2">
                 <h3 className="text-2xl font-bold text-white mb-2">Gemini Command Center</h3>
                 <p className="text-sm text-gray-500">Live search, deep thinking, and generation.</p>
              </div>
              <GeminiTools onAddCustomBadge={handleAddCustomBadge} />

              <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 border border-purple-500/30 rounded-xl p-6">
                <h4 className="font-bold text-white mb-2">Pro Tip</h4>
                <p className="text-sm text-gray-400">
                  Use the <span className="text-purple-400">Generate Badge</span> tab to create custom 4K designs for your dream achievements using Gemini 3 Pro Image.
                </p>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#30363d] bg-[#161b22] py-8 mt-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
           <p className="text-gray-500 mb-2">
             GitHub Achievements Wiki &copy; {new Date().getFullYear()}
           </p>
           <p className="text-gray-400 font-medium">
             Created with ❤️ by <span className="text-blue-400">Ashraf Morningstar</span>
           </p>
           <p className="text-xs text-gray-600 mt-4 max-w-lg mx-auto">
             Not affiliated with GitHub. All badge images are property of GitHub. 
             This project references community efforts like githubachievements.com but is a standalone implementation by Ashraf Morningstar.
           </p>
        </div>
      </footer>

      {/* Modals */}
      <StrategyModal 
        isOpen={strategyModalOpen}
        onClose={() => setStrategyModalOpen(false)}
        badgeName={selectedBadge?.name || ''}
        strategy={strategyContent}
        loading={strategyLoading}
      />
    </div>
  );
};

export default App;
