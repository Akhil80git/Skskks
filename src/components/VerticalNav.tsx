import React from 'react';
import {
  Globe,
  Sliders,
  Terminal,
  Link2,
  Download,
  Play,
  Square,
  Zap,
  Sparkles,
  ChevronRight,
  Layers,
  CheckCircle2,
  X,
} from 'lucide-react';
import { SUPPORTED_PLATFORMS, PlatformConfig } from '../data/platforms';

export type ActiveView =
  | 'all'
  | 'scanner-studio'
  | 'link-launcher'
  | 'terminal'
  | string; // platform id (e.g. 'vercel', 'netlify', etc.)

interface VerticalNavProps {
  activeView: ActiveView;
  onSelectView: (view: ActiveView) => void;
  platformCounts: Record<string, number>;
  totalSitesCount: number;
  isScanning: boolean;
  onStartScanner: () => void;
  onStopScanner: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  onExportJSON: () => void;
  onExportCSV: () => void;
}

export const VerticalNav: React.FC<VerticalNavProps> = ({
  activeView,
  onSelectView,
  platformCounts,
  totalSitesCount,
  isScanning,
  onStartScanner,
  onStopScanner,
  isMobileOpen,
  onCloseMobile,
  onExportJSON,
  onExportCSV,
}) => {
  const handleItemClick = (view: ActiveView) => {
    onSelectView(view);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-xs z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Vertical Sidebar */}
      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 w-64 bg-slate-950 border-r border-slate-800 flex flex-col justify-between transition-transform duration-200 ease-in-out shrink-0 select-none ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top: Brand Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Zap className="w-4 h-4 fill-white" />
            </div>
            <div>
              <div className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
                <span>Subdomain</span>
                <span className="text-blue-400">Hunter</span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono">Multi-Platform Scanner</div>
            </div>
          </div>

          <button
            type="button"
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Middle: Navigation Links */}
        <div className="flex-1 overflow-y-auto p-3 space-y-6 scrollbar-thin scrollbar-thumb-slate-800">
          {/* Section 1: Core Engines & Workspaces */}
          <div>
            <div className="px-2 text-[10px] font-semibold tracking-wider text-slate-400 uppercase mb-2">
              MISSION CONTROL
            </div>
            <div className="space-y-1 text-xs">
              {/* All Discovered Cards */}
              <button
                type="button"
                onClick={() => handleItemClick('all')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
                  activeView === 'all'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Globe className="w-4 h-4 text-blue-400 shrink-0" />
                  <span className="truncate">All Discovered Sites</span>
                </div>
                <span
                  className={`text-[11px] font-mono px-1.5 py-0.2 rounded ${
                    activeView === 'all'
                      ? 'bg-blue-700 text-white'
                      : 'bg-slate-900 text-slate-400 border border-slate-800'
                  }`}
                >
                  {totalSitesCount}
                </span>
              </button>

              {/* Dedicated Scanner Studio / Script Runner */}
              <button
                type="button"
                onClick={() => handleItemClick('scanner-studio')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
                  activeView === 'scanner-studio'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Sliders className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span className="truncate">Scanner Studio & Script</span>
                </div>
                {isScanning ? (
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                ) : (
                  <span className="text-[10px] text-slate-400 uppercase">Engine</span>
                )}
              </button>

              {/* Dedicated Link Launcher & Snapper ("link vala alg") */}
              <button
                type="button"
                onClick={() => handleItemClick('link-launcher')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
                  activeView === 'link-launcher'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Link2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="truncate">Instant Link Snapper</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-1 rounded border border-emerald-800">
                  Direct
                </span>
              </button>

              {/* Dedicated Terminal Console */}
              <button
                type="button"
                onClick={() => handleItemClick('terminal')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
                  activeView === 'terminal'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Terminal className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="truncate">Activity Terminal</span>
                </div>
                {isScanning && (
                  <span className="text-[10px] font-mono text-emerald-400 animate-pulse">LIVE</span>
                )}
              </button>
            </div>
          </div>

          {/* Section 2: Individual Platform Filter Views */}
          <div>
            <div className="px-2 text-[10px] font-semibold tracking-wider text-slate-400 uppercase mb-2 flex items-center justify-between">
              <span>PLATFORMS ({SUPPORTED_PLATFORMS.length})</span>
              <span className="text-[9px] text-slate-400">FILTER BY</span>
            </div>
            <div className="space-y-1 text-xs">
              {SUPPORTED_PLATFORMS.map((plat) => {
                const count = platformCounts[plat.id] || 0;
                const isCurrent = activeView === plat.id;

                return (
                  <button
                    key={plat.id}
                    type="button"
                    onClick={() => handleItemClick(plat.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
                      isCurrent
                        ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
                        : 'text-slate-400 hover:bg-slate-900/80 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: plat.accentColor }}
                      />
                      <div className="text-left truncate">
                        <div className="truncate text-slate-200 font-medium">{plat.name}</div>
                        <div className="text-[10px] font-mono text-slate-400 truncate">
                          .{plat.domain}
                        </div>
                      </div>
                    </div>

                    <span
                      className={`text-[11px] font-mono px-1.5 py-0.2 rounded ${
                        count > 0
                          ? 'bg-slate-900 text-emerald-400 font-semibold border border-slate-800'
                          : 'text-slate-400'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom: Fast Trigger & Export */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/80 space-y-2">
          {/* Quick Start / Stop Toggle */}
          {!isScanning ? (
            <button
              type="button"
              onClick={onStartScanner}
              className="w-full py-2.5 px-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold rounded-lg transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>START SCANNER</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onStopScanner}
              className="w-full py-2.5 px-3 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-lg transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer animate-pulse"
            >
              <Square className="w-3.5 h-3.5 fill-white" />
              <span>STOP SCANNER</span>
            </button>
          )}

          {/* Export Buttons */}
          <div className="flex items-center gap-1.5 text-xs">
            <button
              type="button"
              onClick={onExportJSON}
              className="flex-1 py-1.5 px-2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded border border-slate-800 text-[11px] font-medium transition-colors flex items-center justify-center gap-1 cursor-pointer"
            >
              <Download className="w-3 h-3 text-slate-400" />
              <span>JSON</span>
            </button>
            <button
              type="button"
              onClick={onExportCSV}
              className="flex-1 py-1.5 px-2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded border border-slate-800 text-[11px] font-medium transition-colors flex items-center justify-center gap-1 cursor-pointer"
            >
              <Download className="w-3 h-3 text-slate-400" />
              <span>CSV</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
