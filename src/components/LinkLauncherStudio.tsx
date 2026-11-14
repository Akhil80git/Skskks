import React, { useState } from 'react';
import {
  Link2,
  Camera,
  Globe,
  ExternalLink,
  CheckCircle2,
  Zap,
  Sparkles,
  RefreshCw,
  Plus,
} from 'lucide-react';
import { SUPPORTED_PLATFORMS } from '../data/platforms';

interface LinkLauncherStudioProps {
  onDirectCapture: (url: string, customTitle?: string) => Promise<void> | void;
}

const SAMPLE_SHORTCUTS = [
  { label: 'Ryan Portfolio', url: 'https://portfolio.netlify.app', platform: 'Netlify' },
  { label: 'Flutter Docs', url: 'https://flutter.github.io', platform: 'GitHub Pages' },
  { label: 'Microsoft OpenSource', url: 'https://microsoft.github.io', platform: 'GitHub Pages' },
  { label: 'React Surge Demo', url: 'https://react.surge.sh', platform: 'Surge' },
  { label: 'Vercel Showcase', url: 'https://demo.vercel.app', platform: 'Vercel' },
  { label: 'Wikipedia', url: 'https://www.wikipedia.org', platform: 'Web' },
  { label: 'MDN Web Docs', url: 'https://developer.mozilla.org', platform: 'Web' },
];

export const LinkLauncherStudio: React.FC<LinkLauncherStudioProps> = ({
  onDirectCapture,
}) => {
  const [urlInput, setUrlInput] = useState('');
  const [customTitle, setCustomTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastCaptured, setLastCaptured] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    setIsSubmitting(true);
    try {
      await onDirectCapture(urlInput.trim(), customTitle.trim() || undefined);
      setLastCaptured(urlInput.trim());
      setUrlInput('');
      setCustomTitle('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleShortcutClick = (url: string, label: string) => {
    setUrlInput(url);
    setCustomTitle(label);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Studio Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
            <Link2 className="w-4 h-4" />
          </div>
          <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
            DIRECT URL SNAPPER
          </span>
        </div>
        <h2 className="text-xl font-bold text-white tracking-tight">
          Instant Website Snapper & Card Creator
        </h2>
        <p className="text-xs text-slate-400">
          Paste any website address (e.g. your own portfolio, a project link, or client demo). It will automatically probe the live site, capture a high-resolution screenshot card, and save it to your directory.
        </p>
      </div>

      {/* Main Link Input Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 sm:p-6 shadow-lg space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              TARGET WEBSITE LINK (URL):
            </label>
            <div className="flex items-center bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 gap-2.5 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500/30 transition-all">
              <Globe className="w-4 h-4 text-emerald-400 shrink-0" />
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://portfolio.vercel.app or my-app.netlify.app"
                className="w-full bg-transparent text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none font-mono"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              CUSTOM TITLE OR LABEL (Optional):
            </label>
            <input
              type="text"
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              placeholder="e.g. My Next.js Portfolio or Sarah's Store"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="pt-2 flex items-center justify-between gap-3">
            <span className="text-[11px] text-slate-500">
              Captures full viewport screenshot & detects host platform
            </span>

            <button
              type="submit"
              disabled={!urlInput.trim() || isSubmitting}
              className="py-2.5 px-6 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-40 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Probing & Snapping...</span>
                </>
              ) : (
                <>
                  <Camera className="w-4 h-4" />
                  <span>Capture Screenshot Card</span>
                </>
              )}
            </button>
          </div>
        </form>

        {lastCaptured && (
          <div className="p-3 bg-emerald-950/40 border border-emerald-800/60 rounded-lg flex items-center gap-2 text-xs text-emerald-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="truncate">
              Successfully snapped <strong>{lastCaptured}</strong> and added to your Discovered Cards!
            </span>
          </div>
        )}
      </div>

      {/* Quick Launch Pre-sets */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase">
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          <span>Quick Preset Examples</span>
        </div>
        <p className="text-xs text-slate-400">
          Click any preset below to instantly load and snap a real live website into your cards gallery:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 pt-1">
          {SAMPLE_SHORTCUTS.map((sample) => (
            <button
              key={sample.url}
              type="button"
              onClick={() => handleShortcutClick(sample.url, sample.label)}
              className="p-2.5 bg-slate-950/70 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-lg text-left transition-colors flex items-center justify-between group cursor-pointer"
            >
              <div className="min-w-0">
                <div className="text-xs font-semibold text-slate-200 group-hover:text-blue-400 truncate">
                  {sample.label}
                </div>
                <div className="text-[10px] font-mono text-slate-500 truncate mt-0.5">
                  {sample.url}
                </div>
              </div>
              <Plus className="w-3.5 h-3.5 text-slate-500 group-hover:text-white shrink-0 ml-2" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
