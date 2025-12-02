import React, { useState } from 'react';
import { Search, Loader2, Github, Users, Book, ExternalLink, AlertCircle } from 'lucide-react';
import { UserProfile } from '../types';
import { analyzeProfileBadges } from '../services/geminiService';

interface ProfileCheckerProps {
  onProfileLoaded: (unlockedBadgeIds: string[]) => void;
  onClear: () => void;
}

const ProfileChecker: React.FC<ProfileCheckerProps> = ({ onProfileLoaded, onClear }) => {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const fetchProfile = async () => {
    if (!username.trim()) return;
    setLoading(true);
    setError('');
    setProfile(null);
    onClear();

    try {
      // 1. Fetch Basic Metadata from GitHub API
      const res = await fetch(`https://api.github.com/users/${username}`);
      if (!res.ok) {
        if (res.status === 404) throw new Error("User not found");
        if (res.status === 403) throw new Error("API Rate limit exceeded. Try again later.");
        throw new Error("Failed to fetch profile");
      }
      const data = await res.json();
      
      const userProfile: UserProfile = {
        username: data.login,
        avatarUrl: data.avatar_url,
        name: data.name || data.login,
        bio: data.bio || "No bio available.",
        publicRepos: data.public_repos,
        followers: data.followers,
        htmlUrl: data.html_url
      };
      
      setProfile(userProfile);

      // 2. Use Gemini to analyze achievements from public web profile
      const detectedIds = await analyzeProfileBadges(userProfile.username);
      onProfileLoaded(detectedIds);

    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setUsername('');
    setProfile(null);
    onClear();
  };

  return (
    <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-6 mb-8 shadow-xl">
      <div className="flex flex-col md:flex-row gap-6">
        
        {/* Input Section */}
        <div className="flex-1">
          <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
            <Github className="w-6 h-6" />
            Check Profile Progress
          </h3>
          <p className="text-sm text-gray-400 mb-4">
            Enter a GitHub username to check which achievements they have unlocked using live AI analysis.
          </p>
          
          <div className="flex gap-2 relative">
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500">@</span>
             </div>
             <input 
               type="text" 
               value={username}
               onChange={(e) => setUsername(e.target.value)}
               placeholder="username"
               className="flex-grow pl-8 bg-[#0d1117] border border-[#30363d] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-400 font-mono"
               onKeyDown={(e) => e.key === 'Enter' && fetchProfile()}
             />
             <button 
               onClick={fetchProfile}
               disabled={loading || !username}
               className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800/50 text-white px-6 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 min-w-[120px] justify-center"
             >
               {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Check'}
             </button>
             {profile && (
               <button onClick={handleClear} className="text-gray-400 hover:text-white px-3 py-2">
                 Clear
               </button>
             )}
          </div>
          {error && (
            <div className="mt-3 flex items-center gap-2 text-red-400 text-sm bg-red-900/10 p-2 rounded border border-red-900/20">
               <AlertCircle className="w-4 h-4" />
               {error}
            </div>
          )}
        </div>

        {/* Profile Stats Section */}
        {profile && (
          <div className="flex-1 bg-[#0d1117] rounded-lg border border-[#30363d] p-4 flex gap-4 animate-in fade-in slide-in-from-right-4 duration-500">
             <img src={profile.avatarUrl} alt={profile.username} className="w-20 h-20 rounded-full border-2 border-[#30363d]" />
             <div className="flex-grow min-w-0">
                <div className="flex justify-between items-start">
                   <div>
                     <h4 className="text-lg font-bold text-white truncate">{profile.name}</h4>
                     <a href={profile.htmlUrl} target="_blank" rel="noreferrer" className="text-sm text-blue-400 hover:underline flex items-center gap-1">
                       @{profile.username} <ExternalLink className="w-3 h-3" />
                     </a>
                   </div>
                   <div className="text-xs text-gray-500 border border-[#30363d] rounded px-2 py-1">
                     Public Profile
                   </div>
                </div>
                
                <p className="text-gray-400 text-sm mt-2 line-clamp-2">{profile.bio}</p>
                
                <div className="flex gap-4 mt-3 text-sm text-gray-300">
                   <div className="flex items-center gap-1">
                      <Book className="w-4 h-4 text-gray-500" />
                      <span className="font-bold">{profile.publicRepos}</span> Repos
                   </div>
                   <div className="flex items-center gap-1">
                      <Users className="w-4 h-4 text-gray-500" />
                      <span className="font-bold">{profile.followers}</span> Followers
                   </div>
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileChecker;
