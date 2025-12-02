export interface Badge {
  id: string;
  name: string;
  description: string;
  rarity: 'Common' | 'Rare' | 'Legendary' | 'Event';
  imageUrl?: string;
  category: string;
  unlockGuide: string;
}

export type AIModelType = 'flash-lite' | 'flash-search' | 'pro-thinking' | 'pro-image';

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
  image?: string;
  sources?: { uri: string; title: string }[];
  isThinking?: boolean;
}

export interface ImageGenerationConfig {
  size: '1K' | '2K' | '4K';
  prompt: string;
}

export interface UserProfile {
  username: string;
  avatarUrl: string;
  name: string;
  bio: string;
  publicRepos: number;
  followers: number;
  htmlUrl: string;
}
