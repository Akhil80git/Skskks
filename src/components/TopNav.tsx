import React, { useState } from 'react';
import {
  Menu,
  Search,
  ExternalLink,
  Play,
  Square,
  Zap,
  Globe,
  ArrowRight,
  Camera,
  CheckCircle2,
  X,
} from 'lucide-react';
import { ActiveView } from './VerticalNav';
import { SUPPORTED_PLATFORMS } from '../data/platforms';

interface TopNavProps {
  activeView: ActiveView;
  onOpenMobileMenu: () => void;
  // Link Opener ("link vala alg")
  onDirectOpenAndCapture: (url: string) => void;
  // Scanner Controls ("scaning ka alg rahe")
  isScanning: boolean;
  onStartScanner: () => void;
  onStopScanner: () => void;
  scannedCount: number;
  validCount: number;
  probesPerSec: number;
}

export const TopNav: React.FC<TopNavProps> = ({
  activeView,
  onOpenMobileMenu,
  onDirectOpenAndCapture,
  isScanning,
  onStartScanner,
  onStopScanner,
  scannedCount,
  validCount,
  probesPerSec,
}) => {
  const [directUrl, setDirectUrl] = useState('');

  // Determine current view label
  const getViewTitle = () => {
    if (activeView === 'all') return 'All Discovered Websites';
    if (activeView === 'scanner-studio') return 'Scanner Studio & Script Runner';
    if (activeView === 'link-launcher') return 'Instant Link Snapper';
    if (activeView === 'terminal') return 'Real-Time Activity Terminal';
    const plat = SUPPORTED_PLATFORMS.find((p) => p.id === activeView);
    if (plat) return `${plat.name} Sites (${plat.domain})`;
    return 'Directory';
  };

  const handleDirectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (directUrl.trim()) {
      onDirectOpenAndCapture(directUrl.trim());
      setDirectUrl('');
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-slate-950/95 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 py-2.5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Left: Hamburger + View Breadcrumb */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onOpenMobileMenu}
            className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-900 cursor-pointer"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="min-w-0">
            <h1 className="text-sm font-bold text-slate-100 truncate flex items-center gap-2">
              <span>{getViewTitle()}</span>
            </h1>
            <div className="text-[11px] text-slate-400 hidden sm:block">
              Auto-Screenshot capture & Multi-Platform discovery
            </div>
          </div>
        </div>

        {/* Center: DEDICATED DIRECT LINK OPENER ("link vala alg") */}
        <div className="flex-1 max-w-xl mx-auto w-full">
          <form
            onSubmit={handleDirectSubmit}
            className="flex items-center h-10 bg-slate-900 border border-slate-700/80 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500/30 rounded-xl px-3 gap-2 transition-all shadow-inner"
          >
            <Globe className="w-4 h-4 text-emerald-400 shrink-0" />
            <input
              type="text"
              value={directUrl}
              onChange={(e) => setDirectUrl(e.target.value)}
              placeholder="Paste any link (e.g. portfolio.vercel.app or google.com) to snap..."
              className="w-full bg-transparent text-xs text-slate-100 placeholder:text-slate-400 focus:outline-none"
            />

            {directUrl && (
              <button
                type="button"
                onClick={() => setDirectUrl('')}
                className="p-1 text-slate-400 hover:text-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              type="submit"
              disabled={!directUrl.trim()}
              className="h-7 px-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-[11px] font-semibold rounded-lg transition-colors flex items-center gap-1 whitespace-nowrap cursor-pointer shrink-0 shadow-sm"
            >
              <Camera className="w-3 h-3" />
              <span className="hidden sm:inline">Snap & Open</span>
              <span className="sm:hidden">Snap</span>
            </button>
          </form>
        </div>

        {/* Right: DEDICATED SCANNER CONTROL WIDGET ("scaning ka alg rahe") */}
        <div className="flex items-center justify-end gap-3 shrink-0">
          {/* Real-time status badge */}
          <div
            className={`hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-lg border text-xs font-mono ${
              isScanning
                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
                : 'bg-slate-900 text-slate-400 border-slate-800'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isScanning ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'
              }`}
            />
            <span>{isScanning ? `SCANNING (${probesPerSec}/s)` : 'IDLE'}</span>
            <span className="text-slate-600">·</span>
            <span className="text-slate-300">
              {scannedCount} tested / <strong className="text-emerald-400">{validCount} live</strong>
            </span>
          </div>

          {/* Quick Start/Stop Trigger */}
          {!isScanning ? (
            <button
              type="button"
              onClick={onStartScanner}
              className="py-1.5 px-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-sm whitespace-nowrap cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Run Multi-Scan</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onStopScanner}
              className="py-1.5 px-3.5 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-sm whitespace-nowrap cursor-pointer animate-pulse"
            >
              <Square className="w-3.5 h-3.5 fill-white" />
              <span>Stop Scanner</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
