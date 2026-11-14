import React, { useState } from 'react';
import { ExternalLink, X, RefreshCw, Globe, ShieldAlert, Maximize2, Camera } from 'lucide-react';
import { DiscoveredSite } from '../lib/types';
import { SUPPORTED_PLATFORMS } from '../data/platforms';

interface SitePreviewModalProps {
  activeSite: DiscoveredSite | null;
  screenshotLightboxUrl: string | null;
  screenshotLightboxTitle: string | null;
  onClosePreview: () => void;
  onCloseLightbox: () => void;
  onRefreshScreenshot: (id: string, url: string) => void;
}

export const SitePreviewModal: React.FC<SitePreviewModalProps> = ({
  activeSite,
  screenshotLightboxUrl,
  screenshotLightboxTitle,
  onClosePreview,
  onCloseLightbox,
  onRefreshScreenshot,
}) => {
  const [iframeKey, setIframeKey] = useState(0);

  const platformMeta = activeSite
    ? SUPPORTED_PLATFORMS.find((p) => p.id === activeSite.platformId)
    : null;

  return (
    <>
      {/* In-App Live Website Viewer Modal */}
      {activeSite && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex flex-col p-2 sm:p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-slate-900 border border-slate-700/80 rounded-2xl overflow-hidden flex flex-col w-full h-full max-w-6xl mx-auto shadow-2xl">
            {/* Window Browser Header Bar */}
            <div className="h-14 px-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={`https://www.google.com/s2/favicons?domain=${activeSite.name}.${activeSite.domain}&sz=32`}
                  alt=""
                  className="w-5 h-5 rounded shrink-0 bg-slate-800 p-0.5 border border-slate-700"
                  onError={(e) => {
                    (e.currentTarget as HTMLElement).style.display = 'none';
                  }}
                />
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-slate-100 truncate flex items-center gap-2">
                    <span>{activeSite.title || activeSite.name}</span>
                    <span
                      className={`text-[10px] font-semibold uppercase px-1.5 py-0.2 rounded border ${
                        platformMeta ? `${platformMeta.badgeBg} ${platformMeta.badgeText} ${platformMeta.badgeBorder}` : 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}
                    >
                      {activeSite.platformName}
                    </span>
                  </div>
                  <div className="text-xs font-mono text-slate-400 truncate">{activeSite.url}</div>
                </div>
              </div>

              {/* Header Right Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setIframeKey((k) => k + 1)}
                  title="Reload Live View"
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => onRefreshScreenshot(activeSite.id, activeSite.url)}
                  title="Re-capture fresh page screenshot"
                  className="px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5 text-blue-400" />
                  <span className="hidden sm:inline">Refresh Screenshot</span>
                </button>

                <a
                  href={activeSite.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm whitespace-nowrap cursor-pointer"
                >
                  <span>Open Full Tab</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  type="button"
                  onClick={onClosePreview}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Iframe Viewport */}
            <div className="relative flex-1 bg-white">
              <iframe
                key={iframeKey}
                src={activeSite.url}
                title={activeSite.title}
                sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
                className="w-full h-full border-0"
              />

              {/* Bottom Notice & Helper */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-slate-950/90 text-slate-300 text-xs px-4 py-2 rounded-full border border-slate-700 shadow-2xl flex items-center gap-2.5 backdrop-blur-md max-w-[90%]">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                <span className="truncate">Website card screenshot saved in directory</span>
                <span className="text-slate-600">|</span>
                <a
                  href={activeSite.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 font-medium underline flex items-center gap-1 shrink-0"
                >
                  Direct Open <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* High-Resolution Screenshot Lightbox */}
      {screenshotLightboxUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col p-4 sm:p-6"
          onClick={onCloseLightbox}
        >
          <div className="flex items-center justify-between mb-3 text-slate-200 max-w-5xl mx-auto w-full">
            <span className="text-sm font-semibold flex items-center gap-2 truncate">
              <Camera className="w-4 h-4 text-blue-400" />
              <span className="truncate">{screenshotLightboxTitle || 'Full Page Screenshot'}</span>
            </span>
            <button
              type="button"
              onClick={onCloseLightbox}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center overflow-auto max-w-5xl mx-auto w-full">
            <img
              src={screenshotLightboxUrl}
              alt="Full Resolution Screenshot"
              className="max-h-[85vh] max-w-full rounded-xl border border-slate-800 shadow-2xl object-contain bg-slate-950"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </>
  );
};
