import React from 'react';
import {
  Play,
  Square,
  Sliders,
  Sparkles,
  Zap,
  Globe,
  Shuffle,
  FileText,
  Search,
  Activity,
  Check,
  Terminal as TerminalIcon,
} from 'lucide-react';
import { SUPPORTED_PLATFORMS, PlatformConfig } from '../data/platforms';
import { ScanMode, ActivityLogItem } from '../lib/types';
import { ActivityTerminal } from './ActivityTerminal';

interface ScannerStudioViewProps {
  isScanning: boolean;
  onStart: () => void;
  onStop: () => void;
  selectedPlatformIds: string[];
  onTogglePlatform: (id: string) => void;
  onSelectAllPlatforms: () => void;
  onSelectCloudPresets: () => void;
  customDomain: string;
  onCustomDomainChange: (val: string) => void;
  customDomainEnabled: boolean;
  onCustomDomainToggle: () => void;
  scanMode: ScanMode;
  onScanModeChange: (mode: ScanMode) => void;
  keywordPrefix: string;
  onKeywordPrefixChange: (val: string) => void;
  customWordlistInput: string;
  onCustomWordlistChange: (val: string) => void;
  minLen: number;
  maxLen: number;
  onMinLenChange: (n: number) => void;
  onMaxLenChange: (n: number) => void;
  speedMs: number;
  onSpeedChange: (n: number) => void;
  concurrency: number;
  onConcurrencyChange: (n: number) => void;
  scanLimit: number;
  onScanLimitChange: (n: number) => void;
  onQuickProbeSingle: (name: string) => void;
  // Terminal
  logs: ActivityLogItem[];
  onClearLogs: () => void;
  // Stats
  scannedCount: number;
  validCount: number;
  invalidCount: number;
  probesPerSec: number;
  elapsedSeconds: number;
  hitRate: string;
}

export const ScannerStudioView: React.FC<ScannerStudioViewProps> = ({
  isScanning,
  onStart,
  onStop,
  selectedPlatformIds,
  onTogglePlatform,
  onSelectAllPlatforms,
  onSelectCloudPresets,
  customDomain,
  onCustomDomainChange,
  customDomainEnabled,
  onCustomDomainToggle,
  scanMode,
  onScanModeChange,
  keywordPrefix,
  onKeywordPrefixChange,
  customWordlistInput,
  onCustomWordlistChange,
  minLen,
  maxLen,
  onMinLenChange,
  onMaxLenChange,
  speedMs,
  onSpeedChange,
  concurrency,
  onConcurrencyChange,
  scanLimit,
  onScanLimitChange,
  onQuickProbeSingle,
  logs,
  onClearLogs,
  scannedCount,
  validCount,
  invalidCount,
  probesPerSec,
  elapsedSeconds,
  hitRate,
}) => {
  const [quickInput, setQuickInput] = React.useState('');
  const activeCount = selectedPlatformIds.length + (customDomainEnabled && customDomain.trim() ? 1 : 0);

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickInput.trim()) {
      onQuickProbeSingle(quickInput.trim());
      setQuickInput('');
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Big Mission Control Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/60 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-5">
        <div className="space-y-1.5 min-w-0">
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isScanning ? 'bg-emerald-400 animate-ping' : 'bg-slate-500'
              }`}
            />
            <span className="text-xs font-mono font-bold tracking-wider uppercase text-slate-300">
              {isScanning ? 'AUTOMATED SCRIPT RUNNING' : 'SCANNER SCRIPT IDLE'}
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-xs font-mono text-emerald-400">
              {activeCount} platforms targeted in parallel
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Scanner Studio & Multi-Platform Script Runner
          </h2>
          <p className="text-xs text-slate-400 max-w-2xl">
            Runs high-throughput parallel discovery across Vercel, Netlify, GitHub Pages, Cloudflare Pages, Firebase Hosting, Surge, Render, and more. When real sites are discovered, visual screenshots and URLs are automatically saved to your directory.
          </p>
        </div>

        {/* Start / Stop Master Button */}
        <div className="flex items-center gap-3 shrink-0">
          {!isScanning ? (
            <button
              type="button"
              onClick={onStart}
              disabled={activeCount === 0}
              className="py-3.5 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-bold rounded-xl transition-all shadow-xl shadow-blue-500/20 flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <Play className="w-5 h-5 fill-white" />
              <span>START SCAN SCRIPT</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onStop}
              className="py-3.5 px-6 bg-red-600 hover:bg-red-500 text-white text-sm font-bold rounded-xl transition-all shadow-xl shadow-red-500/20 flex items-center justify-center gap-2.5 cursor-pointer animate-pulse"
            >
              <Square className="w-5 h-5 fill-white" />
              <span>STOP SCAN SCRIPT</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Live Runtime Gauges Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5">
          <div className="text-[11px] font-semibold text-slate-400 uppercase">PROBES TESTED</div>
          <div className="text-2xl font-bold font-mono text-slate-100 mt-1">{scannedCount}</div>
          <div className="text-[11px] font-mono text-slate-500 mt-0.5">
            Limit: {scanLimit < 999999 ? scanLimit : 'unlimited'}
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5">
          <div className="text-[11px] font-semibold text-slate-400 uppercase flex items-center justify-between">
            <span>REAL SITES FOUND</span>
            <span className="text-emerald-400 font-mono text-[10px]">{hitRate}% hit</span>
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">{validCount}</div>
          <div className="text-[11px] font-mono text-slate-500 mt-0.5">Real screenshot cards</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5">
          <div className="text-[11px] font-semibold text-slate-400 uppercase">404 NOT FOUND</div>
          <div className="text-2xl font-bold font-mono text-slate-400 mt-1">{invalidCount}</div>
          <div className="text-[11px] font-mono text-slate-500 mt-0.5">Filtered out</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5">
          <div className="text-[11px] font-semibold text-slate-400 uppercase">SPEED & TIME</div>
          <div className="text-2xl font-bold font-mono text-blue-400 mt-1">
            {probesPerSec} <span className="text-xs text-slate-400 font-normal">req/s</span>
          </div>
          <div className="text-[11px] font-mono text-slate-500 mt-0.5">Elapsed: {elapsedSeconds}s</div>
        </div>
      </div>

      {/* 3. Multi-Platform Targets Selector */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 sm:p-5 shadow-lg space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-bold text-slate-100">
              Target Hosting Platforms (Simultaneous Parallel Scan)
            </h3>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
              {activeCount} active
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <button
              type="button"
              onClick={onSelectAllPlatforms}
              className="text-blue-400 hover:text-blue-300 hover:bg-slate-800 px-2.5 py-1 rounded transition-colors cursor-pointer"
            >
              Select All (10)
            </button>
            <span className="text-slate-700">·</span>
            <button
              type="button"
              onClick={onSelectCloudPresets}
              className="text-slate-300 hover:text-white hover:bg-slate-800 px-2.5 py-1 rounded transition-colors cursor-pointer"
            >
              Top 4 Cloud
            </button>
          </div>
        </div>

        {/* Platform Buttons Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
          {SUPPORTED_PLATFORMS.map((plat) => {
            const isSelected = selectedPlatformIds.includes(plat.id);
            return (
              <button
                key={plat.id}
                type="button"
                onClick={() => onTogglePlatform(plat.id)}
                className={`flex items-center justify-between p-2.5 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-slate-800/90 border-blue-500/80 text-white shadow-sm ring-1 ring-blue-500/30'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: plat.accentColor }}
                  />
                  <div className="text-left truncate">
                    <div className="font-semibold truncate">{plat.name}</div>
                    <div className="text-[10px] font-mono text-slate-400 truncate">.{plat.domain}</div>
                  </div>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-blue-400 shrink-0 ml-1" />}
              </button>
            );
          })}
        </div>

        {/* Custom Domain Input */}
        <div className="pt-2 flex items-center gap-2">
          <button
            type="button"
            onClick={onCustomDomainToggle}
            className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors flex items-center gap-2 cursor-pointer ${
              customDomainEnabled
                ? 'bg-blue-950/60 border-blue-700 text-blue-200'
                : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>+ Custom Target Domain</span>
          </button>

          {customDomainEnabled && (
            <input
              type="text"
              value={customDomain}
              onChange={(e) => onCustomDomainChange(e.target.value)}
              placeholder="e.g. hashnode.dev or mysite.com"
              className="flex-1 max-w-xs bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs font-mono text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
            />
          )}
        </div>
      </div>

      {/* 4. Discovery Mode & Wordlist Engine */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 sm:p-5 shadow-lg space-y-3">
        <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-3">
          <Sparkles className="w-4 h-4 text-blue-400" />
          <span>Discovery Strategy & Wordlists</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <button
            type="button"
            onClick={() => onScanModeChange('smart-words')}
            className={`p-3 rounded-lg border text-xs font-medium transition-all flex flex-col items-start gap-1 cursor-pointer ${
              scanMode === 'smart-words'
                ? 'bg-blue-950/60 border-blue-500 text-blue-200 shadow-sm'
                : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center gap-1.5 font-bold">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Smart Tech Wordlist</span>
            </div>
            <span className="text-[10px] text-slate-400">200+ curated developer words</span>
          </button>

          <button
            type="button"
            onClick={() => onScanModeChange('prefix')}
            className={`p-3 rounded-lg border text-xs font-medium transition-all flex flex-col items-start gap-1 cursor-pointer ${
              scanMode === 'prefix'
                ? 'bg-blue-950/60 border-blue-500 text-blue-200 shadow-sm'
                : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center gap-1.5 font-bold">
              <Search className="w-3.5 h-3.5 text-blue-400" />
              <span>Keyword Search</span>
            </div>
            <span className="text-[10px] text-slate-400">Target custom keyword/tag</span>
          </button>

          <button
            type="button"
            onClick={() => onScanModeChange('random')}
            className={`p-3 rounded-lg border text-xs font-medium transition-all flex flex-col items-start gap-1 cursor-pointer ${
              scanMode === 'random'
                ? 'bg-blue-950/60 border-blue-500 text-blue-200 shadow-sm'
                : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center gap-1.5 font-bold">
              <Shuffle className="w-3.5 h-3.5 text-blue-400" />
              <span>Random Permutations</span>
            </div>
            <span className="text-[10px] text-slate-400">Custom character length scan</span>
          </button>

          <button
            type="button"
            onClick={() => onScanModeChange('custom-list')}
            className={`p-3 rounded-lg border text-xs font-medium transition-all flex flex-col items-start gap-1 cursor-pointer ${
              scanMode === 'custom-list'
                ? 'bg-blue-950/60 border-blue-500 text-blue-200 shadow-sm'
                : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center gap-1.5 font-bold">
              <FileText className="w-3.5 h-3.5 text-blue-400" />
              <span>Paste Custom List</span>
            </div>
            <span className="text-[10px] text-slate-400">Test exact subdomains batch</span>
          </button>
        </div>

        {/* Dynamic Mode Sub-Controls */}
        {scanMode === 'prefix' && (
          <div className="mt-2 bg-slate-950/70 p-3 rounded-lg border border-slate-800 flex items-center gap-3">
            <span className="text-xs text-slate-400 whitespace-nowrap">Target Keyword:</span>
            <input
              type="text"
              value={keywordPrefix}
              onChange={(e) => onKeywordPrefixChange(e.target.value)}
              placeholder="e.g. ai, crypto, saas, dev, test, demo, store"
              className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>
        )}

        {scanMode === 'custom-list' && (
          <div className="mt-2 bg-slate-950/70 p-3 rounded-lg border border-slate-800">
            <span className="text-xs text-slate-400 block mb-1">
              Paste comma or newline separated names to probe across all selected platforms:
            </span>
            <textarea
              rows={2}
              value={customWordlistInput}
              onChange={(e) => onCustomWordlistChange(e.target.value)}
              placeholder="portfolio, dev, dashboard, store, blog, myapp, gallery"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 font-mono text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-blue-500"
            />
          </div>
        )}

        {scanMode === 'random' && (
          <div className="mt-2 bg-slate-950/70 p-3 rounded-lg border border-slate-800 flex flex-wrap items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Min Length:</span>
              <select
                value={minLen}
                onChange={(e) => onMinLenChange(Number(e.target.value))}
                className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200 text-xs"
              >
                <option value={1}>1 char</option>
                <option value={2}>2 chars</option>
                <option value={3}>3 chars</option>
                <option value={4}>4 chars</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Max Length:</span>
              <select
                value={maxLen}
                onChange={(e) => onMaxLenChange(Number(e.target.value))}
                className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200 text-xs"
              >
                <option value={4}>4 chars</option>
                <option value={5}>5 chars</option>
                <option value={6}>6 chars</option>
                <option value={8}>8 chars</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* 5. Concurrency, Speed, and Single Probe */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Tuning Controls */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-lg space-y-3">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wide">
            Performance & Throttle Settings
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                PARALLEL WORKERS:
              </label>
              <select
                value={concurrency}
                onChange={(e) => onConcurrencyChange(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200"
              >
                <option value={3}>3 Workers</option>
                <option value={6}>6 Workers</option>
                <option value={10}>10 Workers</option>
                <option value={15}>15 Workers</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                INTERVAL:
              </label>
              <select
                value={speedMs}
                onChange={(e) => onSpeedChange(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200"
              >
                <option value={150}>150ms (Ultra)</option>
                <option value={350}>350ms (Fast)</option>
                <option value={700}>700ms (Moderate)</option>
                <option value={1200}>1200ms (Calm)</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                LIMIT:
              </label>
              <select
                value={scanLimit}
                onChange={(e) => onScanLimitChange(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200"
              >
                <option value={50}>50 Probes</option>
                <option value={150}>150 Probes</option>
                <option value={500}>500 Probes</option>
                <option value={999999}>Unlimited</option>
              </select>
            </div>
          </div>
        </div>

        {/* Quick Instant Probe Form */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-lg space-y-3 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wide">
              Quick Single Probe
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Probe a single subdomain name across all {activeCount} platforms in parallel right now:
            </p>
          </div>

          <form onSubmit={handleQuickSubmit} className="flex items-center gap-2">
            <input
              type="text"
              value={quickInput}
              onChange={(e) => setQuickInput(e.target.value)}
              placeholder="e.g. react, portfolio, shop..."
              className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              disabled={!quickInput.trim()}
              className="py-2 px-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-xs font-semibold text-white rounded-lg transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Probe All</span>
            </button>
          </form>
        </div>
      </div>

      {/* 6. Embedded Live Script Activity Terminal ("script chalti hai vo alag ho") */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-200 uppercase tracking-wide">
            <TerminalIcon className="w-4 h-4 text-amber-400" />
            <span>Live Script Execution Console</span>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            Probing active endpoints in real-time
          </span>
        </div>

        <ActivityTerminal
          logs={logs}
          onClearLogs={onClearLogs}
          isScanning={isScanning}
        />
      </div>
    </div>
  );
};
