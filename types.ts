/*
 Copyright (c) 2026 Ashraf Morningstar
 These are personal recreations of existing projects, developed by Ashraf Morningstar
 for learning and skill development.
 Original project concepts remain the intellectual property of their respective creators.
 Repository: https://github.com/AshrafMorningstar
*/

export interface BadgeTier {
  name: string;
  requirements: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  rarity: 'Common' | 'Rare' | 'Legendary' | 'Event';
  imageUrl?: string;
  category: string;
  unlockGuide: string;
  tiers?: BadgeTier[];
  isHistorical?: boolean;
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
