export interface PlatformConfig {
  id: string;
  name: string;
  domain: string;
  tagline: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  accentColor: string;
  iconName: string;
}

export const SUPPORTED_PLATFORMS: PlatformConfig[] = [
  {
    id: 'vercel',
    name: 'Vercel',
    domain: 'vercel.app',
    tagline: 'Next.js & Frontend Cloud',
    badgeBg: 'bg-black',
    badgeText: 'text-white',
    badgeBorder: 'border-slate-700',
    accentColor: '#ffffff',
    iconName: 'vercel',
  },
  {
    id: 'netlify',
    name: 'Netlify',
    domain: 'netlify.app',
    tagline: 'Modern Web Hosting',
    badgeBg: 'bg-teal-950',
    badgeText: 'text-teal-300',
    badgeBorder: 'border-teal-700/60',
    accentColor: '#00c7b7',
    iconName: 'netlify',
  },
  {
    id: 'github',
    name: 'GitHub Pages',
    domain: 'github.io',
    tagline: 'Open Source Repositories',
    badgeBg: 'bg-purple-950',
    badgeText: 'text-purple-300',
    badgeBorder: 'border-purple-700/60',
    accentColor: '#8a63d2',
    iconName: 'github',
  },
  {
    id: 'cloudflare',
    name: 'Cloudflare Pages',
    domain: 'pages.dev',
    tagline: 'Edge Network Hosting',
    badgeBg: 'bg-orange-950',
    badgeText: 'text-orange-300',
    badgeBorder: 'border-orange-700/60',
    accentColor: '#f38020',
    iconName: 'cloudflare',
  },
  {
    id: 'firebase',
    name: 'Firebase Hosting',
    domain: 'web.app',
    tagline: 'Google Cloud Web Apps',
    badgeBg: 'bg-amber-950',
    badgeText: 'text-amber-300',
    badgeBorder: 'border-amber-700/60',
    accentColor: '#ffca28',
    iconName: 'firebase',
  },
  {
    id: 'surge',
    name: 'Surge',
    domain: 'surge.sh',
    tagline: 'Static Web Publishing',
    badgeBg: 'bg-emerald-950',
    badgeText: 'text-emerald-300',
    badgeBorder: 'border-emerald-700/60',
    accentColor: '#21d392',
    iconName: 'surge',
  },
  {
    id: 'render',
    name: 'Render',
    domain: 'onrender.com',
    tagline: 'Full Stack Cloud Apps',
    badgeBg: 'bg-cyan-950',
    badgeText: 'text-cyan-300',
    badgeBorder: 'border-cyan-700/60',
    accentColor: '#46e3b7',
    iconName: 'render',
  },
  {
    id: 'gitlab',
    name: 'GitLab Pages',
    domain: 'gitlab.io',
    tagline: 'GitLab CI/CD Pages',
    badgeBg: 'bg-rose-950',
    badgeText: 'text-rose-300',
    badgeBorder: 'border-rose-700/60',
    accentColor: '#fc6d26',
    iconName: 'gitlab',
  },
  {
    id: 'railway',
    name: 'Railway',
    domain: 'up.railway.app',
    tagline: 'Instant Infrastructure',
    badgeBg: 'bg-violet-950',
    badgeText: 'text-violet-300',
    badgeBorder: 'border-violet-700/60',
    accentColor: '#a78bfa',
    iconName: 'railway',
  },
  {
    id: 'supabase',
    name: 'Supabase',
    domain: 'supabase.co',
    tagline: 'Open Source Firebase Alternative',
    badgeBg: 'bg-emerald-950',
    badgeText: 'text-emerald-300',
    badgeBorder: 'border-emerald-700/60',
    accentColor: '#3ecf8e',
    iconName: 'supabase',
  },
];
