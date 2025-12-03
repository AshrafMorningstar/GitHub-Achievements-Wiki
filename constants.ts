import { Badge } from './types';

export const INITIAL_BADGES: Badge[] = [
  {
    id: 'mars-2020',
    name: 'Mars 2020 Helicopter Mission',
    description: 'Contributed to repositories used in the Mars 2020 Helicopter mission.',
    rarity: 'Legendary',
    category: 'Contribution',
    unlockGuide: 'Awarded to developers who contributed code to specific open-source projects used by NASA/JPL for the Mars Ingenuity Helicopter.',
    imageUrl: 'https://github.githubassets.com/images/modules/profile/achievements/mars-2020-helicopter-default.png',
    isHistorical: true
  },
  {
    id: 'arctic-code-vault',
    name: 'Arctic Code Vault Contributor',
    description: 'Code contributed to a repository included in the 2020 Arctic Code Vault snapshot.',
    rarity: 'Legendary',
    category: 'Event',
    unlockGuide: 'This is a legacy achievement. You must have committed to a repository that was snapshot and stored in the Arctic World Archive in Svalbard, Norway, on 02/02/2020.',
    imageUrl: 'https://github.githubassets.com/images/modules/profile/achievements/arctic-code-vault-contributor-default.png',
    isHistorical: true
  },
  {
    id: 'public-sponsor',
    name: 'Public Sponsor',
    description: 'Sponsoring open source work via GitHub Sponsors.',
    rarity: 'Common',
    category: 'Sponsorship',
    unlockGuide: 'Sponsor a developer or organization through GitHub Sponsors. The badge levels up specifically based on how long/much you sponsor.',
    imageUrl: 'https://github.githubassets.com/images/modules/profile/achievements/public-sponsor-default.png'
  },
  {
    id: 'starstruck',
    name: 'Starstruck',
    description: 'Created a repository that has many stars.',
    rarity: 'Rare',
    category: 'Community',
    unlockGuide: 'Get stars on a repository to unlock tiers.',
    imageUrl: 'https://github.githubassets.com/images/modules/profile/achievements/starstruck-default.png',
    tiers: [
      { name: 'Bronze', requirements: '16 Stars' },
      { name: 'Silver', requirements: '128 Stars' },
      { name: 'Gold', requirements: '512 Stars' },
      { name: 'Platinum', requirements: '2048 Stars' }
    ]
  },
  {
    id: 'shark',
    name: 'Shark',
    description: 'Pull Request Shark.',
    rarity: 'Rare',
    category: 'Contribution',
    unlockGuide: 'Submitted a Pull Request that was merged without any changes or comments required.',
    imageUrl: 'https://github.githubassets.com/images/modules/profile/achievements/pull-shark-default.png',
    tiers: [
      { name: 'Bronze', requirements: '1 Pull Request' },
      { name: 'Silver', requirements: '16 Pull Requests' },
      { name: 'Gold', requirements: '128 Pull Requests' }
    ]
  },
  {
    id: 'yolo',
    name: 'YOLO',
    description: 'Merged a Pull Request without code review.',
    rarity: 'Common',
    category: 'Contribution',
    unlockGuide: 'Merge a PR into a protected branch without a review (requires admin privileges usually) or just merge your own PR instantly on a repo.',
    imageUrl: 'https://github.githubassets.com/images/modules/profile/achievements/yolo-default.png'
  },
  {
    id: 'quickdraw',
    name: 'Quickdraw',
    description: 'Closed an issue or PR within 5 minutes of opening.',
    rarity: 'Common',
    category: 'Productivity',
    unlockGuide: 'Close an issue or pull request very quickly after opening it. Often happens when you solve your own problem instantly.',
    imageUrl: 'https://github.githubassets.com/images/modules/profile/achievements/quickdraw-default.png'
  },
  {
    id: 'pair-extraordinaire',
    name: 'Pair Extraordinaire',
    description: 'Co-authored commits.',
    rarity: 'Common',
    category: 'Collaboration',
    unlockGuide: 'Merge a commit that has "Co-authored-by:" in the footer.',
    imageUrl: 'https://github.githubassets.com/images/modules/profile/achievements/pair-extraordinaire-default.png',
    tiers: [
      { name: 'Bronze', requirements: '1 Merge' },
      { name: 'Silver', requirements: '10 Merges' },
      { name: 'Gold', requirements: '24 Merges' }
    ]
  },
  {
    id: 'galaxy-brain',
    name: 'Galaxy Brain',
    description: 'Accepted answer on a Discussion.',
    rarity: 'Rare',
    category: 'Community',
    unlockGuide: 'Have answers marked as "Accepted" in GitHub Discussions.',
    imageUrl: 'https://github.githubassets.com/images/modules/profile/achievements/galaxy-brain-default.png',
    tiers: [
      { name: 'Bronze', requirements: '2 Accepted Answers' },
      { name: 'Silver', requirements: '8 Accepted Answers' },
      { name: 'Gold', requirements: '16 Accepted Answers' }
    ]
  }
];
