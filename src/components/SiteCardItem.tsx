import React, { useState } from 'react';
import {
  ExternalLink,
  Copy,
  Check,
  Trash2,
  RefreshCw,
  Maximize2,
  Eye,
  Globe,
  Camera,
} from 'lucide-react';
import { DiscoveredSite } from '../lib/types';
import { SUPPORTED_PLATFORMS } from '../data/platforms';

interface SiteCardItemProps {
  site: DiscoveredSite;
  onPreview: (site: DiscoveredSite) => void;
  onViewScreenshot: (screenshotUrl: string, title: string) => void;
  onDelete: (id: string) => void;
  onRefreshScreenshot: (id: string, url: string) => void;
}

export const SiteCardItem: React.FC<SiteCardItemProps> = ({
  site,
  onPreview,
  onViewScreenshot,
  onDelete,
  onRefreshScreenshot,
}) => {
  const [copied, setCopied] = useState(false);
  const [imgLoading, setImgLoading] = useState(true);
  const [imgFailed, setImgFailed] = useState(false);

  const platformMeta = SUPPORTED_PLATFORMS.find((p) => p.id === site.platformId);
  const hostname = `${site.name}.${site.domain}`;

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(site.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  const handleRefresh = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImgLoading(true);
    setImgFailed(false);
    onRefreshScreenshot(site.id, site.url);
  };

  return (
    <div className="group bg-slate-900/90 border border-slate-800 hover:border-blue-500/60 rounded-xl overflow-hidden transition-all duration-200 hover:-translate-y-1 shadow-lg hover:shadow-2xl flex flex-col">
      {/* Screenshot Container */}
      <div
        className="relative h-44 w-full bg-slate-950 overflow-hidden cursor-pointer select-none"
        onClick={() => onViewScreenshot(site.screenshot, site.title)}
      >
        {/* Real Screenshot Image */}
        <img
          src={site.screenshot}
          alt={`Screenshot of ${site.title}`}
          loading="lazy"
          referrerPolicy="no-referrer"
          onLoad={() => {
            setImgLoading(false);
            setImgFailed(false);
          }}
          onError={() => {
            setImgLoading(false);
            setImgFailed(true);
          }}
          className={`w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105 ${
            imgLoading ? 'opacity-30 blur-xs' : 'opacity-100'
          }`}
        />

        {/* Loading Spinner */}
        {imgLoading && (
          <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs flex flex-col items-center justify-center p-3 text-center">
            <Camera className="w-6 h-6 text-blue-400 animate-pulse mb-1.5" />
            <span className="text-xs font-medium text-slate-300">Capturing page screenshot...</span>
            <span className="text-[11px] font-mono text-slate-400 mt-0.5">{hostname}</span>
          </div>
        )}

        {/* Failed Fallback */}
        {imgFailed && (
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-slate-950 flex flex-col items-center justify-center p-4 text-center">
            <img
              src={`https://www.google.com/s2/favicons?domain=${hostname}&sz=64`}
              alt=""
              className="w-10 h-10 mb-2 rounded bg-slate-800 p-1.5 border border-slate-700"
              onError={(e) => {
                (e.currentTarget as HTMLElement).style.display = 'none';
              }}
            />
            <div className="text-xs font-semibold text-slate-200 truncate max-w-full">
              {site.title || hostname}
            </div>
            <div className="text-[11px] font-mono text-slate-400 mt-0.5">{site.url}</div>
            <div className="flex items-center gap-2 mt-2.5">
              <button
                type="button"
                onClick={handleRefresh}
                className="px-2.5 py-1 text-[11px] font-medium text-blue-400 hover:text-blue-300 bg-slate-800 hover:bg-slate-700 rounded transition-colors flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Retry</span>
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onPreview(site);
                }}
                className="px-2.5 py-1 text-[11px] font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Eye className="w-3 h-3" />
                <span>Live View</span>
              </button>
            </div>
          </div>
        )}

        {/* Top Floating Badges: Platform + HTTP Status */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1 pointer-events-none">
          {/* Platform Tag */}
          <span
            className={`text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded backdrop-blur-md shadow-sm border ${
              platformMeta ? `${platformMeta.badgeBg} ${platformMeta.badgeText} ${platformMeta.badgeBorder}` : 'bg-slate-900 text-slate-200 border-slate-700'
            }`}
          >
            {site.platformName}
          </span>

          {/* HTTP Status & Latency */}
          <div className="flex items-center gap-1.5 bg-slate-950/80 backdrop-blur-md px-2 py-0.5 rounded border border-slate-800 text-[10px] font-mono text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>{site.statusCode || 200} OK</span>
            {site.latencyMs > 0 && <span className="text-slate-400">· {site.latencyMs}ms</span>}
          </div>
        </div>

        {/* Hover Quick Actions */}
        <div className="absolute bottom-2 right-2 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            title="Interactive Live Preview"
            onClick={(e) => {
              e.stopPropagation();
              onPreview(site);
            }}
            className="p-1.5 bg-slate-950/90 hover:bg-blue-600 text-slate-200 hover:text-white rounded-md transition-colors cursor-pointer shadow-md"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            title="Full Screenshot Lightbox"
            onClick={(e) => {
              e.stopPropagation();
              onViewScreenshot(site.screenshot, site.title);
            }}
            className="p-1.5 bg-slate-950/90 hover:bg-blue-600 text-slate-200 hover:text-white rounded-md transition-colors cursor-pointer shadow-md"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            title="Refresh Screenshot"
            onClick={handleRefresh}
            className="p-1.5 bg-slate-950/90 hover:bg-blue-600 text-slate-200 hover:text-white rounded-md transition-colors cursor-pointer shadow-md"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Card Info Section */}
      <div className="p-3.5 flex flex-col justify-between flex-1 gap-2.5">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h4
              className="text-sm font-semibold text-slate-100 truncate group-hover:text-blue-400 transition-colors"
              title={site.title}
            >
              {site.title || site.name}
            </h4>
          </div>

          {/* Full URL Display */}
          <div className="text-xs font-mono text-slate-400 truncate mt-1 flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span className="truncate">{site.url}</span>
          </div>
        </div>

        {/* Bottom Buttons */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
          <a
            href={site.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-1.5 px-3 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm whitespace-nowrap"
          >
            <span>Open Site</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          <button
            type="button"
            onClick={handleCopy}
            title="Copy URL"
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer shrink-0"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={() => onDelete(site.id)}
            title="Remove Card"
            className="p-2 text-slate-500 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer shrink-0"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
