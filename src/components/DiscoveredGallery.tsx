import React, { useState, useMemo } from 'react';
import {
  Globe,
  Trash2,
  Download,
  Copy,
  Check,
  Search,
  Filter,
  ArrowUpDown,
  Sparkles,
} from 'lucide-react';
import { DiscoveredSite } from '../lib/types';
import { SUPPORTED_PLATFORMS } from '../data/platforms';
import { SiteCardItem } from './SiteCardItem';

interface DiscoveredGalleryProps {
  sites: DiscoveredSite[];
  activeView?: string;
  onSelectView?: (view: string) => void;
  onDeleteSite: (id: string) => void;
  onClearAll: () => void;
  onPreviewSite: (site: DiscoveredSite) => void;
  onViewScreenshot: (url: string, title: string) => void;
  onRefreshScreenshot: (id: string, url: string) => void;
}

export const DiscoveredGallery: React.FC<DiscoveredGalleryProps> = ({
  sites,
  activeView = 'all',
  onSelectView,
  onDeleteSite,
  onClearAll,
  onPreviewSite,
  onViewScreenshot,
  onRefreshScreenshot,
}) => {
  const [platformFilter, setPlatformFilter] = useState<string>(
    activeView && activeView !== 'all' && activeView !== 'scanner-studio' && activeView !== 'link-launcher' && activeView !== 'terminal'
      ? activeView
      : 'all'
  );

  // Sync when activeView changes from sidebar
  React.useEffect(() => {
    if (activeView && activeView !== 'scanner-studio' && activeView !== 'link-launcher' && activeView !== 'terminal') {
      setPlatformFilter(activeView);
    }
  }, [activeView]);

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'fastest' | 'alpha'>('newest');
  const [copiedAll, setCopiedAll] = useState(false);

  // Platform counts
  const platformCounts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const s of sites) {
      map[s.platformId] = (map[s.platformId] || 0) + 1;
    }
    return map;
  }, [sites]);

  // Active platforms with at least 1 site
  const activePlatforms = useMemo(() => {
    return SUPPORTED_PLATFORMS.filter((p) => (platformCounts[p.id] || 0) > 0);
  }, [platformCounts]);

  // Filtered & Sorted sites
  const displayedSites = useMemo(() => {
    let result = sites.filter((site) => {
      if (platformFilter !== 'all' && site.platformId !== platformFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          site.url.toLowerCase().includes(q) ||
          site.name.toLowerCase().includes(q) ||
          site.title.toLowerCase().includes(q) ||
          site.platformName.toLowerCase().includes(q)
        );
      }
      return true;
    });

    if (sortBy === 'newest') {
      result.sort((a, b) => b.discoveredAt - a.discoveredAt);
    } else if (sortBy === 'fastest') {
      result.sort((a, b) => (a.latencyMs || 9999) - (b.latencyMs || 9999));
    } else if (sortBy === 'alpha') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [sites, platformFilter, searchQuery, sortBy]);

  // Export functions
  const handleExportJSON = () => {
    const blob = new Blob([JSON.stringify(displayedSites, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `discovered_subdomains_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportCSV = () => {
    const headers = 'URL,Name,Domain,Platform,Title,Status,LatencyMs\n';
    const rows = displayedSites
      .map(
        (s) =>
          `"${s.url}","${s.name}","${s.domain}","${s.platformName}","${s.title.replace(/"/g, '""')}",${s.statusCode},${s.latencyMs}`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `discovered_subdomains_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyAllUrls = () => {
    const urls = displayedSites.map((s) => s.url).join('\n');
    navigator.clipboard.writeText(urls);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 1600);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 sm:p-5 shadow-xl flex flex-col gap-4">
      {/* Top Header & Export Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <Globe className="w-5 h-5 text-blue-400" />
          <h3 className="text-base font-bold text-slate-100">Discovered Websites & Screenshots</h3>
          <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-bold border border-slate-700">
            {displayedSites.length} {displayedSites.length === 1 ? 'Site' : 'Sites'}
          </span>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <button
            type="button"
            onClick={handleCopyAllUrls}
            title="Copy all URLs to clipboard"
            className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            {copiedAll ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
            <span>{copiedAll ? 'Copied URLs' : 'Copy URLs'}</span>
          </button>

          <button
            type="button"
            onClick={handleExportJSON}
            title="Export as JSON"
            className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>JSON</span>
          </button>

          <button
            type="button"
            onClick={handleExportCSV}
            title="Export as CSV"
            className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>CSV</span>
          </button>

          <button
            type="button"
            onClick={onClearAll}
            className="px-2.5 py-1.5 bg-slate-800 hover:bg-red-950/60 hover:text-red-300 text-slate-400 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Platform Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none text-xs">
          <button
            type="button"
            onClick={() => {
              setPlatformFilter('all');
              if (onSelectView) onSelectView('all');
            }}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
              platformFilter === 'all'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-950/70 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            All Platforms ({sites.length})
          </button>

          {activePlatforms.map((plat) => {
            const count = platformCounts[plat.id] || 0;
            const isCurrent = platformFilter === plat.id;
            return (
              <button
                key={plat.id}
                type="button"
                onClick={() => {
                  setPlatformFilter(plat.id);
                  if (onSelectView) onSelectView(plat.id);
                }}
                className={`px-2.5 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
                  isCurrent
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-950/70 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: plat.accentColor }}
                />
                <span>{plat.name}</span>
                <span className="font-mono text-[11px] opacity-70">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Search & Sort Controls */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 md:w-56">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search discovered..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-xs text-slate-300">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-slate-200 text-xs focus:outline-none cursor-pointer"
            >
              <option value="newest">Newest</option>
              <option value="fastest">Fastest</option>
              <option value="alpha">A-Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      {displayedSites.length === 0 ? (
        <div className="text-center py-16 px-4 border border-dashed border-slate-800 rounded-xl bg-slate-950/40">
          <Globe className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h4 className="text-sm font-semibold text-slate-300">No websites match your filter</h4>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            {sites.length === 0
              ? 'Click "RUN SCANNER" above to start multi-platform simultaneous discovery across Vercel, Netlify, GitHub Pages, Cloudflare, and more!'
              : 'Try clearing the search query or switching to "All Platforms".'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {displayedSites.map((site) => (
            <SiteCardItem
              key={site.id}
              site={site}
              onPreview={onPreviewSite}
              onViewScreenshot={onViewScreenshot}
              onDelete={onDeleteSite}
              onRefreshScreenshot={onRefreshScreenshot}
            />
          ))}
        </div>
      )}
    </div>
  );
};
