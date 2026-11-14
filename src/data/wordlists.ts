// Curated high-probability names, project titles, tech tags, and portfolio keywords
export const HIGH_PROBABILITY_WORDS: string[] = [
  // Portfolios & Personal
  'portfolio', 'dev', 'blog', 'resume', 'cv', 'me', 'personal', 'projects', 'bio', 'about',
  'showcase', 'craft', 'profile', 'work', 'folio', 'home', 'space', 'diary', 'journal', 'mycv',
  // Apps & Tools
  'app', 'dashboard', 'calc', 'calculator', 'todo', 'notes', 'weather', 'chat', 'game', 'quiz',
  'tools', 'editor', 'converter', 'clock', 'timer', 'player', 'music', 'tracker', 'board', 'canvas',
  'reader', 'viewer', 'finder', 'search', 'hub', 'suite', 'studio', 'portal', 'flow', 'task',
  // Startups, Agencies & Business
  'store', 'shop', 'agency', 'labs', 'studio', 'club', 'market', 'ventures', 'media', 'tech',
  'cloud', 'group', 'team', 'design', 'brand', 'space', 'forge', 'pulse', 'spark', 'nexus',
  'prime', 'core', 'wave', 'orbit', 'zenith', 'apex', 'vibe', 'collective', 'works', 'digital',
  // Frameworks & Modern Stacks
  'react', 'next', 'vue', 'vite', 'tailwind', 'node', 'astro', 'svelte', 'nuxt', 'deno',
  'graphql', 'python', 'rust', 'go', 'flutter', 'swift', 'docker', 'web3', 'ai', 'gpt',
  'llm', 'bot', 'agent', 'crypto', 'nft', 'eth', 'sol', 'defi', 'chain', 'meta',
  // Common Web Services
  'docs', 'api', 'demo', 'staging', 'preview', 'test', 'beta', 'alpha', 'live', 'status',
  'guide', 'handbook', 'learn', 'academy', 'school', 'course', 'tutorial', 'wiki', 'kb', 'help',
  // Creative & Lifestyle
  'art', 'photo', 'gallery', 'camera', 'film', 'cinema', 'video', 'sound', 'audio', 'beats',
  'coffee', 'book', 'fashion', 'style', 'travel', 'food', 'recipe', 'gym', 'fit', 'fitness',
  // Short 3-4 letter high yield tech acronyms
  'cms', 'crm', 'erp', 'saas', 'b2b', 'auth', 'mail', 'link', 'feed', 'news',
  'post', 'view', 'snap', 'drop', 'mint', 'sync', 'vault', 'byte', 'pixel', 'code',
  // Popular developer projects
  'e-commerce', 'landing', 'showcase', 'template', 'starter', 'boilerplate', 'theme', 'ui', 'components',
  'frontend', 'backend', 'fullstack', 'playground', 'sandbox', 'experiment', 'lab', 'prototype'
];

// Curated popular developer handles and common words
export const DEVELOPER_HANDLES: string[] = [
  'alex', 'sam', 'max', 'leo', 'david', 'sarah', 'chris', 'john', 'dan', 'mike',
  'james', 'kevin', 'ryan', 'jason', 'eric', 'luke', 'adam', 'ben', 'emma', 'jack',
  'dev-portfolio', 'web-app', 'my-portfolio', 'simple-weather', 'react-todo', 'crypto-tracker'
];

export function generateRandomName(minLen = 3, maxLen = 6): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const len = Math.floor(Math.random() * (maxLen - minLen + 1)) + minLen;
  let res = '';
  // Avoid leading numbers for subdomains
  const letters = 'abcdefghijklmnopqrstuvwxyz';
  res += letters[Math.floor(Math.random() * letters.length)];
  for (let i = 1; i < len; i++) {
    res += chars[Math.floor(Math.random() * chars.length)];
  }
  return res;
}

export function generateCombinations(prefix: string, list: string[]): string[] {
  const cleanPrefix = prefix.trim().toLowerCase().replace(/[^a-z0-9-]/g, '');
  if (!cleanPrefix) return [];
  return list.map((word) => `${cleanPrefix}-${word}`);
}
