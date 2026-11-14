import React, { useState } from 'react';
import {
  Play,
  Square,
  CheckSquare,
  Sliders,
  Sparkles,
  Zap,
  Globe,
  Shuffle,
  FileText,
  Search,
  Check,
} from 'lucide-react';
import { SUPPORTED_PLATFORMS, PlatformConfig } from '../data/platforms';
import { ScanMode } from '../lib/types';

interface ScannerConfigPanelProps {
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
}

export const ScannerConfigPanel: React.FC<ScannerConfigPanelProps> = ({
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
}) => {
  const [quickInput, setQuickInput] = useState('');

  const activeCount = selectedPlatformIds.length + (customDomainEnabled && customDomain.trim() ? 1 : 0);

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickInput.trim()) {
      onQuickProbeSingle(quickInput.trim());
      setQuickInput('');
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 sm:p-5 shadow-xl flex flex-col gap-4">
      {/* Header with platform count */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <Sliders className="w-4 h-4 text-blue-400" />
          <h2 className="text-sm font-bold text-slate-100">Multi-Platform Scanner Engine</h2>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/60">
            {activeCount} Platforms Simultaneous
          </span>
        </div>

        {/* Quick Platform Presets */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onSelectAllPlatforms}
            className="text-xs text-blue-400 hover:text-blue-300 hover:bg-slate-800 px-2.5 py-1 rounded transition-colors cursor-pointer"
          >
            Select All
          </button>
          <span className="text-slate-700">·</span>
          <button
            type="button"
            onClick={onSelectCloudPresets}
            className="text-xs text-slate-300 hover:text-white hover:bg-slate-800 px-2.5 py-1 rounded transition-colors cursor-pointer"
          >
            Top 4 Cloud
          </button>
        </div>
      </div>

      {/* 1. Multi-Platform Badges Grid */}
      <div>
        <label className="text-xs font-semibold text-slate-400 block mb-2">
          TARGET HOSTING PLATFORMS (Scans all simultaneously in parallel):
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
          {SUPPORTED_PLATFORMS.map((plat) => {
            const isSelected = selectedPlatformIds.includes(plat.id);
            return (
              <button
                key={plat.id}
                type="button"
                onClick={() => onTogglePlatform(plat.id)}
                className={`flex items-center justify-between p-2 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-slate-800/90 border-blue-500/80 text-white shadow-sm ring-1 ring-blue-500/30'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
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

        {/* Custom Domain Input Toggle */}
        <div className="mt-2.5 pt-2 flex items-center gap-2">
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
              className="flex-1 max-w-xs bg-slate-950 border border-slate-700 rounded-lg px-3 py-1 text-xs font-mono text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
            />
          )}
        </div>
      </div>

      {/* 2. Scan Discovery Mode Selector */}
      <div className="border-t border-slate-800 pt-3">
        <label className="text-xs font-semibold text-slate-400 block mb-2">
          DISCOVERY METHOD:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button
            type="button"
            onClick={() => onScanModeChange('smart-words')}
            className={`p-2.5 rounded-lg border text-xs font-medium transition-all flex flex-col items-start gap-1 cursor-pointer ${
              scanMode === 'smart-words'
                ? 'bg-blue-950/50 border-blue-500 text-blue-200 shadow-sm'
                : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center gap-1.5 font-bold">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Smart Tech Wordlist</span>
            </div>
            <span className="text-[10px] text-slate-400">Finds real portfolios & apps fast</span>
          </button>

          <button
            type="button"
            onClick={() => onScanModeChange('prefix')}
            className={`p-2.5 rounded-lg border text-xs font-medium transition-all flex flex-col items-start gap-1 cursor-pointer ${
              scanMode === 'prefix'
                ? 'bg-blue-950/50 border-blue-500 text-blue-200 shadow-sm'
                : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:text-slate-200'
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
            className={`p-2.5 rounded-lg border text-xs font-medium transition-all flex flex-col items-start gap-1 cursor-pointer ${
              scanMode === 'random'
                ? 'bg-blue-950/50 border-blue-500 text-blue-200 shadow-sm'
                : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center gap-1.5 font-bold">
              <Shuffle className="w-3.5 h-3.5 text-blue-400" />
              <span>Random Permutations</span>
            </div>
            <span className="text-[10px] text-slate-400">Letter & number length scan</span>
          </button>

          <button
            type="button"
            onClick={() => onScanModeChange('custom-list')}
            className={`p-2.5 rounded-lg border text-xs font-medium transition-all flex flex-col items-start gap-1 cursor-pointer ${
              scanMode === 'custom-list'
                ? 'bg-blue-950/50 border-blue-500 text-blue-200 shadow-sm'
                : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:text-slate-200'
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
          <div className="mt-3 bg-slate-950/70 p-3 rounded-lg border border-slate-800 flex items-center gap-3">
            <span className="text-xs text-slate-400 whitespace-nowrap">Enter Keyword or Prefix:</span>
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
          <div className="mt-3 bg-slate-950/70 p-3 rounded-lg border border-slate-800">
            <span className="text-xs text-slate-400 block mb-1.5">
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
          <div className="mt-3 bg-slate-950/70 p-3 rounded-lg border border-slate-800 flex flex-wrap items-center gap-4 text-xs">
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

      {/* 3. Concurrency, Speed, and Limit Settings */}
      <div className="border-t border-slate-800 pt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="text-[11px] font-semibold text-slate-400 block mb-1">
            PARALLEL WORKERS (Concurrency):
          </label>
          <select
            value={concurrency}
            onChange={(e) => onConcurrencyChange(Number(e.target.value))}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
          >
            <option value={3}>3 Simultaneous probes</option>
            <option value={6}>6 Simultaneous probes (Balanced)</option>
            <option value={10}>10 Simultaneous probes (Fast)</option>
            <option value={15}>15 Simultaneous probes (Turbo)</option>
          </select>
        </div>

        <div>
          <label className="text-[11px] font-semibold text-slate-400 block mb-1">
            REQUEST INTERVAL:
          </label>
          <select
            value={speedMs}
            onChange={(e) => onSpeedChange(Number(e.target.value))}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
          >
            <option value={150}>Ultra (150ms)</option>
            <option value={350}>Fast (350ms - Recommended)</option>
            <option value={700}>Moderate (700ms)</option>
            <option value={1200}>Calm (1200ms)</option>
          </select>
        </div>

        <div>
          <label className="text-[11px] font-semibold text-slate-400 block mb-1">
            PROBE LIMIT:
          </label>
          <select
            value={scanLimit}
            onChange={(e) => onScanLimitChange(Number(e.target.value))}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
          >
            <option value={50}>50 Total probes</option>
            <option value={150}>150 Total probes</option>
            <option value={300}>300 Total probes</option>
            <option value={1000}>1000 Total probes</option>
            <option value={999999}>Unlimited (Run continuous)</option>
          </select>
        </div>
      </div>

      {/* 4. Action Buttons & Quick Single Probe */}
      <div className="border-t border-slate-800 pt-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Run / Stop Scanner */}
        <div className="flex items-center gap-2.5 flex-1 max-w-md">
          {!isScanning ? (
            <button
              type="button"
              onClick={onStart}
              disabled={activeCount === 0}
              className="flex-1 py-3 px-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>RUN SCANNER (ALL {activeCount} PLATFORMS)</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onStop}
              className="flex-1 py-3 px-5 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer animate-pulse"
            >
              <Square className="w-4 h-4 fill-white" />
              <span>STOP SCANNER</span>
            </button>
          )}
        </div>

        {/* Quick Instant Probe Bar */}
        <form onSubmit={handleQuickSubmit} className="flex items-center gap-2 flex-1 max-w-sm">
          <input
            type="text"
            value={quickInput}
            onChange={(e) => setQuickInput(e.target.value)}
            placeholder="Quick test one name across all..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            disabled={!quickInput.trim()}
            className="py-2 px-3 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-xs font-semibold text-slate-200 rounded-lg transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1"
          >
            <Zap className="w-3.5 h-3.5 text-blue-400" />
            <span>Probe</span>
          </button>
        </form>
      </div>
    </div>
  );
};
