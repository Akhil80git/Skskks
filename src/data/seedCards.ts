import { DiscoveredSite } from '../lib/types';

// High resolution screenshot URL helper
export function getScreenshotUrl(targetUrl: string, refreshKey = 0): string {
  const clean = targetUrl.trim();
  const base = `https://image.thum.io/get/width/900/crop/540/${clean}`;
  return refreshKey > 0 ? `${base}?t=${refreshKey}` : base;
}

// Backup screenshot URL helper
export function getBackupScreenshotUrl(targetUrl: string): string {
  return `https://api.microlink.io/?url=${encodeURIComponent(targetUrl)}&screenshot=true&meta=false&embed=screenshot.url`;
}

export const INITIAL_DISCOVERED_SITES: DiscoveredSite[] = [
  {
    id: 'seed-netlify-ryan',
    url: 'https://portfolio.netlify.app',
    name: 'portfolio',
    domain: 'netlify.app',
    platformId: 'netlify',
    platformName: 'Netlify',
    title: 'Ryan Unruh | Creative Software Engineer',
    screenshot: getScreenshotUrl('https://portfolio.netlify.app'),
    statusCode: 200,
    latencyMs: 380,
    discoveredAt: Date.now() - 1000 * 60 * 12,
  },
  {
    id: 'seed-github-flutter',
    url: 'https://flutter.github.io',
    name: 'flutter',
    domain: 'github.io',
    platformId: 'github',
    platformName: 'GitHub Pages',
    title: 'Flutter — Beautiful Native Apps In Record Time',
    screenshot: getScreenshotUrl('https://flutter.github.io'),
    statusCode: 200,
    latencyMs: 240,
    discoveredAt: Date.now() - 1000 * 60 * 10,
  },
  {
    id: 'seed-github-microsoft',
    url: 'https://microsoft.github.io',
    name: 'microsoft',
    domain: 'github.io',
    platformId: 'github',
    platformName: 'GitHub Pages',
    title: 'Microsoft Open Source Portals & Projects',
    screenshot: getScreenshotUrl('https://microsoft.github.io'),
    statusCode: 200,
    latencyMs: 195,
    discoveredAt: Date.now() - 1000 * 60 * 8,
  },
  {
    id: 'seed-cloudflare-docs',
    url: 'https://docs.pages.dev',
    name: 'docs',
    domain: 'pages.dev',
    platformId: 'cloudflare',
    platformName: 'Cloudflare Pages',
    title: 'Cloudflare Pages Technical Documentation',
    screenshot: getScreenshotUrl('https://docs.pages.dev'),
    statusCode: 200,
    latencyMs: 160,
    discoveredAt: Date.now() - 1000 * 60 * 6,
  },
  {
    id: 'seed-surge-demo',
    url: 'https://react.surge.sh',
    name: 'react',
    domain: 'surge.sh',
    platformId: 'surge',
    platformName: 'Surge',
    title: 'React Static Showcase App',
    screenshot: getScreenshotUrl('https://react.surge.sh'),
    statusCode: 200,
    latencyMs: 290,
    discoveredAt: Date.now() - 1000 * 60 * 4,
  },
  {
    id: 'seed-firebase-app',
    url: 'https://chat.web.app',
    name: 'chat',
    domain: 'web.app',
    platformId: 'firebase',
    platformName: 'Firebase Hosting',
    title: 'Firebase Realtime Web Application',
    screenshot: getScreenshotUrl('https://chat.web.app'),
    statusCode: 200,
    latencyMs: 210,
    discoveredAt: Date.now() - 1000 * 60 * 2,
  },
];
