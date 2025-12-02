import React, { useState } from 'react';
import { Search, Sparkles, MessageSquare, Image as ImageIcon, Loader2, ArrowRight } from 'lucide-react';
import { askFastQuestion, searchForBadges, generateBadgeConcept, analyzeUnlockStrategy } from '../services/geminiService';
import { ChatMessage, ImageGenerationConfig, Badge } from '../types';

interface GeminiToolsProps {
  onAddCustomBadge: (url: string, prompt: string) => void;
}

const GeminiTools: React.FC<GeminiToolsProps> = ({ onAddCustomBadge }) => {
  const [activeTab, setActiveTab] = useState<'chat' | 'search' | 'generate'>('search');
  const [query, setQuery] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [genConfig, setGenConfig] = useState<ImageGenerationConfig>({ size: '1K', prompt: '' });

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    // Add user query to history
    setChatHistory(prev => [...prev, { role: 'user', content: query }]);

    try {
      const result = await searchForBadges(query);
      setChatHistory(prev => [...prev, { 
        role: 'model', 
        content: result.text,
        sources: result.sources 
      }]);
    } catch (e) {
      setChatHistory(prev => [...prev, { role: 'model', content: "Error performing search." }]);
    } finally {
      setLoading(false);
      setQuery('');
    }
  };

  const handleFastChat = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setChatHistory(prev => [...prev, { role: 'user', content: query }]);
    try {
      const result = await askFastQuestion(query);
      setChatHistory(prev => [...prev, { role: 'model', content: result }]);
    } catch (e) {
      setChatHistory(prev => [...prev, { role: 'model', content: "Error in fast chat." }]);
    } finally {
      setLoading(false);
      setQuery('');
    }
  };

  const handleGenerate = async () => {
    if (!genConfig.prompt.trim()) return;
    setLoading(true);
    setChatHistory(prev => [...prev, { role: 'user', content: `Generate badge: ${genConfig.prompt} (${genConfig.size})` }]);
    try {
      const imageUrl = await generateBadgeConcept(genConfig);
      if (imageUrl) {
        setChatHistory(prev => [...prev, { 
          role: 'model', 
          content: "Here is your generated badge concept:",
          image: imageUrl
        }]);
        onAddCustomBadge(imageUrl, genConfig.prompt);
      } else {
        setChatHistory(prev => [...prev, { role: 'model', content: "Failed to generate image." }]);
      }
    } catch (e) {
       setChatHistory(prev => [...prev, { role: 'model', content: "Error generating image. Ensure you have selected a paid API key for Veo/Imagen models." }]);
    } finally {
      setLoading(false);
      setGenConfig({ ...genConfig, prompt: '' });
    }
  };

  return (
    <div className="bg-[#161b22] border border-[#30363d] rounded-xl overflow-hidden shadow-2xl flex flex-col h-[600px]">
      {/* Header Tabs */}
      <div className="flex border-b border-[#30363d]">
        <button 
          onClick={() => setActiveTab('search')}
          className={`flex-1 py-4 text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${activeTab === 'search' ? 'bg-[#0d1117] text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-gray-200'}`}
        >
          <Search className="w-4 h-4" />
          Live Search
        </button>
        <button 
          onClick={() => setActiveTab('chat')}
          className={`flex-1 py-4 text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${activeTab === 'chat' ? 'bg-[#0d1117] text-green-400 border-b-2 border-green-400' : 'text-gray-400 hover:text-gray-200'}`}
        >
          <MessageSquare className="w-4 h-4" />
          Fast Q&A
        </button>
        <button 
          onClick={() => setActiveTab('generate')}
          className={`flex-1 py-4 text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${activeTab === 'generate' ? 'bg-[#0d1117] text-purple-400 border-b-2 border-purple-400' : 'text-gray-400 hover:text-gray-200'}`}
        >
          <ImageIcon className="w-4 h-4" />
          Generate Badge
        </button>
      </div>

      {/* Chat Area */}
      <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-[#0d1117]">
        {chatHistory.length === 0 && (
          <div className="text-center text-gray-500 mt-20">
            <Sparkles className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p>Select a tool above and start interacting with Gemini AI.</p>
          </div>
        )}
        {chatHistory.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-3 rounded-lg text-sm ${
              msg.role === 'user' 
                ? 'bg-blue-600 text-white' 
                : 'bg-[#161b22] border border-[#30363d] text-gray-300'
            }`}>
              <div className="whitespace-pre-wrap">{msg.content}</div>
              
              {msg.image && (
                <img src={msg.image} alt="Generated" className="mt-3 rounded-lg border border-[#30363d] max-w-full h-auto" />
              )}
              
              {msg.sources && msg.sources.length > 0 && (
                <div className="mt-3 pt-2 border-t border-[#30363d] text-xs">
                  <p className="font-semibold text-gray-400 mb-1">Sources:</p>
                  <ul className="list-disc pl-4 space-y-1">
                    {msg.sources.map((s, i) => (
                      <li key={i}>
                        <a href={s.uri} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline break-all">
                          {s.title || s.uri}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
             <div className="bg-[#161b22] border border-[#30363d] p-3 rounded-lg">
                <Loader2 className="w-5 h-5 animate-spin text-blue-400" />
             </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-[#30363d] bg-[#161b22]">
        {activeTab === 'generate' ? (
          <div className="space-y-3">
             <div className="flex gap-2">
                <select 
                  value={genConfig.size} 
                  onChange={(e) => setGenConfig({...genConfig, size: e.target.value as any})}
                  className="bg-[#0d1117] border border-[#30363d] text-gray-300 rounded px-3 text-sm focus:outline-none focus:border-purple-400"
                >
                  <option value="1K">1K</option>
                  <option value="2K">2K</option>
                  <option value="4K">4K</option>
                </select>
                <input
                  type="text"
                  value={genConfig.prompt}
                  onChange={(e) => setGenConfig({...genConfig, prompt: e.target.value})}
                  placeholder="Describe your badge concept..."
                  className="flex-grow bg-[#0d1117] border border-[#30363d] rounded px-4 py-2 text-white focus:outline-none focus:border-purple-400"
                  onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                />
                <button 
                  onClick={handleGenerate}
                  disabled={loading}
                  className="bg-purple-600 hover:bg-purple-700 text-white p-2 rounded transition-colors disabled:opacity-50"
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
             </div>
             <p className="text-xs text-gray-500">Note: High quality generation requires selecting a paid API key.</p>
          </div>
        ) : (
          <div className="flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={activeTab === 'search' ? "Search for new badges (e.g., 'GitHub Galaxy 2024 badges')..." : "Ask a quick question..."}
              className="flex-grow bg-[#0d1117] border border-[#30363d] rounded px-4 py-2 text-white focus:outline-none focus:border-blue-400"
              onKeyDown={(e) => e.key === 'Enter' && (activeTab === 'search' ? handleSearch() : handleFastChat())}
            />
            <button 
              onClick={activeTab === 'search' ? handleSearch : handleFastChat}
              disabled={loading}
              className={`text-white p-2 rounded transition-colors disabled:opacity-50 ${activeTab === 'search' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'}`}
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GeminiTools;
