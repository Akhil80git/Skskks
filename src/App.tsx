import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { SUPPORTED_PLATFORMS, PlatformConfig } from './data/platforms';
import { HIGH_PROBABILITY_WORDS, DEVELOPER_HANDLES, generateRandomName } from './data/wordlists';
import { INITIAL_DISCOVERED_SITES, getScreenshotUrl } from './data/seedCards';
import { DiscoveredSite, ActivityLogItem, ScanMode } from './lib/types';
import { checkTargetsBatch, createDiscoveredSite, TargetProbe } from './lib/scannerEngine';
import { VerticalNav, ActiveView } from './components/VerticalNav';
import { TopNav } from './components/TopNav';
import { DiscoveredGallery } from './components/DiscoveredGallery';
import { ScannerStudioView } from './components/ScannerStudioView';
import { LinkLauncherStudio } from './components/LinkLauncherStudio';
import { ActivityTerminal } from './components/ActivityTerminal';
import { SitePreviewModal } from './components/SitePreviewModal';

const STORAGE_KEY = 'subhunter_discovered_v4';

export default function App() {
  // Navigation State
  const [activeView, setActiveView] = useState<ActiveView>('all');
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Discovered Sites State
  const [sites, setSites] = useState<DiscoveredSite[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return INITIAL_DISCOVERED_SITES;
  });

  // Scanner Configuration State
  const [selectedPlatformIds, setSelectedPlatformIds] = useState<string[]>([
    'vercel',
    'netlify',
    'github',
    'cloudflare',
    'firebase',
    'surge',
  ]);
  const [customDomainEnabled, setCustomDomainEnabled] = useState(false);
  const [customDomain, setCustomDomain] = useState('');
  const [scanMode, setScanMode] = useState<ScanMode>('smart-words');
  const [keywordPrefix, setKeywordPrefix] = useState('portfolio');
  const [customWordlistInput, setCustomWordlistInput] = useState('portfolio, dev, dashboard, store, blog, weather, chat, docs');
  const [minLen, setMinLen] = useState(3);
  const [maxLen, setMaxLen] = useState(6);
  const [speedMs, setSpeedMs] = useState(350);
  const [concurrency, setConcurrency] = useState(6);
  const [scanLimit, setScanLimit] = useState(500);

  // Scanner Execution & Stats State
  const [isScanning, setIsScanning] = useState(false);
  const [scannedCount, setScannedCount] = useState(0);
  const [validCount, setValidCount] = useState(INITIAL_DISCOVERED_SITES.length);
  const [invalidCount, setInvalidCount] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [probesPerSec, setProbesPerSec] = useState(0);

  // Terminal Activity Logs
  const [logs, setLogs] = useState<ActivityLogItem[]>([
    {
      id: 'init-1',
      timestamp: new Date().toLocaleTimeString(),
      url: 'Multi-Platform Engine Initialized',
      name: 'System',
      domain: 'all',
      platformName: 'Core',
      platformId: 'system',
      status: 'valid',
      message: 'Scanner ready. 6 platforms active for simultaneous scan.',
    },
  ]);

  // Modals & Viewer State
  const [activePreviewSite, setActivePreviewSite] = useState<DiscoveredSite | null>(null);
  const [screenshotLightboxUrl, setScreenshotLightboxUrl] = useState<string | null>(null);
  const [screenshotLightboxTitle, setScreenshotLightboxTitle] = useState<string | null>(null);

  // Refs for scan loop control
  const isScanningRef = useRef(isScanning);
  isScanningRef.current = isScanning;
  const wordlistIndexRef = useRef(0);
  const testedSetRef = useRef<Set<string>>(new Set());

  // Populate testedSet
  useEffect(() => {
    for (const s of sites) {
      testedSetRef.current.add(s.url.toLowerCase());
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sites));
    } catch {
      // ignore
    }
  }, [sites]);

  // Elapsed timer & rate calculation
  useEffect(() => {
    if (!isScanning) return;
    const interval = setInterval(() => {
      if (startTime) {
        const sec = Math.max(1, Math.floor((Date.now() - startTime) / 1000));
        setElapsedSeconds(sec);
        setProbesPerSec(Math.round((scannedCount / sec) * 10) / 10);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [isScanning, startTime, scannedCount]);

  // Platform counts
  const platformCounts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const s of sites) {
      map[s.platformId] = (map[s.platformId] || 0) + 1;
    }
    return map;
  }, [sites]);

  // Platform selection handlers
  const handleTogglePlatform = (id: string) => {
    setSelectedPlatformIds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleSelectAllPlatforms = () => {
    setSelectedPlatformIds(SUPPORTED_PLATFORMS.map((p) => p.id));
  };

  const handleSelectCloudPresets = () => {
    setSelectedPlatformIds(['vercel', 'netlify', 'github', 'cloudflare']);
  };

  // Helper to add activity log
  const addLog = useCallback(
    (item: Omit<ActivityLogItem, 'id' | 'timestamp'>) => {
      const newLog: ActivityLogItem = {
        ...item,
        id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        timestamp: new Date().toLocaleTimeString(),
      };
      setLogs((prev) => [newLog, ...prev.slice(0, 75)]);
    },
    []
  );

  // Get active platform list
  const getActivePlatforms = useCallback((): PlatformConfig[] => {
    const list = SUPPORTED_PLATFORMS.filter((p) => selectedPlatformIds.includes(p.id));
    if (customDomainEnabled && customDomain.trim()) {
      const cleanCustom = customDomain
        .trim()
        .toLowerCase()
        .replace(/^https?:\/\//, '')
        .replace(/\/.*$/, '');
      list.push({
        id: 'custom',
        name: 'Custom Domain',
        domain: cleanCustom,
        tagline: 'Custom Host',
        badgeBg: 'bg-indigo-950',
        badgeText: 'text-indigo-300',
        badgeBorder: 'border-indigo-700/60',
        accentColor: '#6366f1',
        iconName: 'custom',
      });
    }
    return list;
  }, [selectedPlatformIds, customDomainEnabled, customDomain]);

  // Generate target names for next batch
  const getNextBatchNames = useCallback(
    (count: number): string[] => {
      const names: string[] = [];

      if (scanMode === 'smart-words') {
        const pool = [...HIGH_PROBABILITY_WORDS, ...DEVELOPER_HANDLES];
        for (let i = 0; i < count; i++) {
          const idx = (wordlistIndexRef.current + i) % pool.length;
          names.push(pool[idx]);
        }
        wordlistIndexRef.current = (wordlistIndexRef.current + count) % pool.length;
      } else if (scanMode === 'prefix') {
        const clean = keywordPrefix.trim().toLowerCase().replace(/[^a-z0-9-]/g, '') || 'app';
        const subWords = ['dev', 'app', 'ui', 'hub', 'api', 'bot', 'lab', 'demo', 'web', 'site', 'pro', 'cloud'];
        for (let i = 0; i < count; i++) {
          const sub = subWords[(wordlistIndexRef.current + i) % subWords.length];
          names.push(i % 2 === 0 ? `${clean}-${sub}` : `${clean}${i + 1}`);
        }
        wordlistIndexRef.current += count;
      } else if (scanMode === 'custom-list') {
        const raw = customWordlistInput
          .split(/[\n,]+/)
          .map((s) => s.trim().toLowerCase().replace(/[^a-z0-9-]/g, ''))
          .filter(Boolean);
        if (raw.length === 0) {
          names.push('portfolio', 'dev', 'demo');
        } else {
          for (let i = 0; i < count; i++) {
            const idx = (wordlistIndexRef.current + i) % raw.length;
            names.push(raw[idx]);
          }
          wordlistIndexRef.current = (wordlistIndexRef.current + count) % raw.length;
        }
      } else {
        // Random permutations
        for (let i = 0; i < count; i++) {
          names.push(generateRandomName(minLen, maxLen));
        }
      }

      return names;
    },
    [scanMode, keywordPrefix, customWordlistInput, minLen, maxLen]
  );

  // Scan single batch across ALL selected platforms
  const scanBatchStep = useCallback(async () => {
    if (!isScanningRef.current) return;

    const platforms = getActivePlatforms();
    if (platforms.length === 0) {
      stopScanner();
      return;
    }

    const nameBatchSize = Math.max(1, Math.floor(concurrency / platforms.length)) || 1;
    const names = getNextBatchNames(nameBatchSize);

    const targetProbes: TargetProbe[] = [];
    for (const name of names) {
      for (const plat of platforms) {
        const url = `https://${name}.${plat.domain}`;
        if (!testedSetRef.current.has(url.toLowerCase())) {
          targetProbes.push({
            name,
            domain: plat.domain,
            platformId: plat.id,
            platformName: plat.name,
          });
        }
      }
    }

    if (targetProbes.length === 0) {
      return;
    }

    for (const t of targetProbes) {
      testedSetRef.current.add(`https://${t.name}.${t.domain}`.toLowerCase());
    }

    const results = await checkTargetsBatch(targetProbes);

    if (!isScanningRef.current) return;

    setScannedCount((prev) => prev + results.length);

    const newlyDiscovered: DiscoveredSite[] = [];

    for (const r of results) {
      if (r.isLive) {
        setValidCount((prev) => prev + 1);
        addLog({
          url: r.url,
          name: r.name,
          domain: r.domain,
          platformId: r.platformId,
          platformName: r.platformName,
          status: 'valid',
          statusCode: r.statusCode,
          latencyMs: r.latencyMs,
          message: `LIVE DISCOVERY: ${r.title || r.url}`,
        });

        const newSite = createDiscoveredSite(r);
        newlyDiscovered.push(newSite);
      } else {
        setInvalidCount((prev) => prev + 1);
        addLog({
          url: r.url,
          name: r.name,
          domain: r.domain,
          platformId: r.platformId,
          platformName: r.platformName,
          status: 'invalid',
          statusCode: r.statusCode || 404,
          latencyMs: r.latencyMs,
        });
      }
    }

    if (newlyDiscovered.length > 0) {
      setSites((prev) => {
        const existingUrls = new Set(prev.map((p) => p.url.toLowerCase()));
        const uniqueNew = newlyDiscovered.filter((n) => !existingUrls.has(n.url.toLowerCase()));
        return [...uniqueNew, ...prev];
      });
    }
  }, [getActivePlatforms, concurrency, getNextBatchNames, addLog]);

  // Main scan loop runner
  useEffect(() => {
    if (!isScanning) return;

    let timerId: NodeJS.Timeout | null = null;

    const runLoop = async () => {
      if (!isScanningRef.current) return;

      if (scannedCount >= scanLimit && scanLimit < 999999) {
        stopScanner();
        addLog({
          url: 'Scanner Limit Reached',
          name: 'Engine',
          domain: 'all',
          platformId: 'system',
          platformName: 'System',
          status: 'valid',
          message: `Completed target limit of ${scanLimit} probes.`,
        });
        return;
      }

      try {
        await scanBatchStep();
      } catch (err: any) {
        console.error('Scan batch error:', err);
      }

      if (isScanningRef.current) {
        timerId = setTimeout(runLoop, speedMs);
      }
    };

    runLoop();

    return () => {
      if (timerId) clearTimeout(timerId);
    };
  }, [isScanning, speedMs, scanLimit, scanBatchStep, addLog]);

  // Start Scanner
  const startScanner = () => {
    const active = getActivePlatforms();
    if (active.length === 0) {
      alert('Please select at least one hosting platform to scan.');
      return;
    }

    setIsScanning(true);
    isScanningRef.current = true;
    setStartTime(Date.now());

    addLog({
      url: `Multi-Platform Scanner Started (${active.length} platforms simultaneous)`,
      name: 'Engine',
      domain: 'all',
      platformId: 'system',
      platformName: 'System',
      status: 'valid',
      message: `Scanning across ${active.map((p) => p.name).join(', ')}`,
    });
  };

  // Stop Scanner
  const stopScanner = () => {
    setIsScanning(false);
    isScanningRef.current = false;
    addLog({
      url: 'Scanner Stopped by User',
      name: 'Engine',
      domain: 'all',
      platformId: 'system',
      platformName: 'System',
      status: 'invalid',
      message: 'Scanner paused.',
    });
  };

  // Instant direct URL launcher ("link vala alg")
  const handleDirectOpenAndCapture = async (rawUrl: string, customTitle?: string) => {
    let target = rawUrl.trim();
    if (!/^https?:\/\//i.test(target)) {
      target = `https://${target}`;
    }

    let parsedHost = '';
    try {
      const u = new URL(target);
      parsedHost = u.hostname.replace(/^www\./, '').toLowerCase();
    } catch {
      alert('Please enter a valid URL.');
      return;
    }

    // Identify platform
    let matchedPlatformId = 'custom';
    let matchedPlatformName = 'Web';
    let subName = parsedHost.split('.')[0] || parsedHost;
    let baseDomain = parsedHost.split('.').slice(1).join('.') || parsedHost;

    for (const p of SUPPORTED_PLATFORMS) {
      if (parsedHost.endsWith(p.domain)) {
        matchedPlatformId = p.id;
        matchedPlatformName = p.name;
        subName = parsedHost.replace(`.${p.domain}`, '');
        baseDomain = p.domain;
        break;
      }
    }

    addLog({
      url: target,
      name: subName,
      domain: baseDomain,
      platformId: matchedPlatformId,
      platformName: matchedPlatformName,
      status: 'probing',
      message: `Direct link snap: ${target}`,
    });

    // Check target probe
    const [result] = await checkTargetsBatch([
      {
        name: subName,
        domain: baseDomain,
        platformId: matchedPlatformId,
        platformName: matchedPlatformName,
      },
    ]);

    const title = customTitle || result?.title || subName;
    const newSite: DiscoveredSite = {
      id: `site-direct-${Date.now()}`,
      url: target,
      name: subName,
      domain: baseDomain,
      platformId: matchedPlatformId,
      platformName: matchedPlatformName,
      title,
      screenshot: getScreenshotUrl(target),
      statusCode: result?.statusCode || 200,
      latencyMs: result?.latencyMs || 220,
      discoveredAt: Date.now(),
    };

    setSites((prev) => [newSite, ...prev.filter((s) => s.url !== target)]);
    setActivePreviewSite(newSite);

    addLog({
      url: target,
      name: subName,
      domain: baseDomain,
      platformId: matchedPlatformId,
      platformName: matchedPlatformName,
      status: 'valid',
      statusCode: newSite.statusCode,
      latencyMs: newSite.latencyMs,
      message: `Card saved & preview opened: ${title}`,
    });
  };

  // Instant single probe across all platforms
  const handleQuickProbeSingle = async (name: string) => {
    const cleanName = name.trim().toLowerCase().replace(/[^a-z0-9-]/g, '');
    if (!cleanName) return;

    const platforms = getActivePlatforms();
    if (platforms.length === 0) return;

    const targets: TargetProbe[] = platforms.map((p) => ({
      name: cleanName,
      domain: p.domain,
      platformId: p.id,
      platformName: p.name,
    }));

    addLog({
      url: `Probing "${cleanName}" across all ${platforms.length} platforms...`,
      name: cleanName,
      domain: 'multi',
      platformId: 'system',
      platformName: 'Probe',
      status: 'probing',
    });

    const results = await checkTargetsBatch(targets);
    setScannedCount((c) => c + results.length);

    for (const r of results) {
      if (r.isLive) {
        setValidCount((c) => c + 1);
        addLog({
          url: r.url,
          name: r.name,
          domain: r.domain,
          platformId: r.platformId,
          platformName: r.platformName,
          status: 'valid',
          statusCode: r.statusCode,
          latencyMs: r.latencyMs,
          message: `LIVE HIT: ${r.title || r.url}`,
        });

        const newSite = createDiscoveredSite(r);
        setSites((prev) => {
          if (prev.some((s) => s.url === newSite.url)) return prev;
          return [newSite, ...prev];
        });
      } else {
        setInvalidCount((c) => c + 1);
        addLog({
          url: r.url,
          name: r.name,
          domain: r.domain,
          platformId: r.platformId,
          platformName: r.platformName,
          status: 'invalid',
          statusCode: r.statusCode || 404,
          latencyMs: r.latencyMs,
        });
      }
    }
  };

  // Card Actions
  const handleDeleteSite = (id: string) => {
    setSites((prev) => prev.filter((s) => s.id !== id));
  };

  const handleClearAll = () => {
    if (window.confirm('Delete all discovered website cards?')) {
      setSites([]);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const handleRefreshScreenshot = (id: string, url: string) => {
    const freshUrl = getScreenshotUrl(url, Date.now());
    setSites((prev) =>
      prev.map((s) => (s.id === id ? { ...s, screenshot: freshUrl } : s))
    );
  };

  const handleViewScreenshot = (url: string, title: string) => {
    setScreenshotLightboxUrl(url);
    setScreenshotLightboxTitle(title);
  };

  // Export functions
  const handleExportJSON = () => {
    const blob = new Blob([JSON.stringify(sites, null, 2)], {
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
    const rows = sites
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

  const hitRate = scannedCount > 0 ? ((validCount / scannedCount) * 100).toFixed(1) : '0.0';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans selection:bg-blue-600 selection:text-white">
      {/* 1. PC VERTICAL SIDEBAR NAVIGATION */}
      <VerticalNav
        activeView={activeView}
        onSelectView={setActiveView}
        platformCounts={platformCounts}
        totalSitesCount={sites.length}
        isScanning={isScanning}
        onStartScanner={startScanner}
        onStopScanner={stopScanner}
        isMobileOpen={isMobileNavOpen}
        onCloseMobile={() => setIsMobileNavOpen(false)}
        onExportJSON={handleExportJSON}
        onExportCSV={handleExportCSV}
      />

      {/* 2. MAIN APP CONTAINER (RIGHT SIDE ON DESKTOP) */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Universal Top Nav: Split Scanning Control & Direct Link Opener */}
        <TopNav
          activeView={activeView}
          onOpenMobileMenu={() => setIsMobileNavOpen(true)}
          onDirectOpenAndCapture={handleDirectOpenAndCapture}
          isScanning={isScanning}
          onStartScanner={startScanner}
          onStopScanner={stopScanner}
          scannedCount={scannedCount}
          validCount={validCount}
          probesPerSec={probesPerSec}
        />

        {/* Main Work Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 flex flex-col gap-5">
          {/* VIEW ROUTING */}

          {/* VIEW A: Dedicated Scanner Studio & Script Runner ("kha sare start stop and script chalti hai vo alag ho") */}
          {activeView === 'scanner-studio' && (
            <ScannerStudioView
              isScanning={isScanning}
              onStart={startScanner}
              onStop={stopScanner}
              selectedPlatformIds={selectedPlatformIds}
              onTogglePlatform={handleTogglePlatform}
              onSelectAllPlatforms={handleSelectAllPlatforms}
              onSelectCloudPresets={handleSelectCloudPresets}
              customDomain={customDomain}
              onCustomDomainChange={setCustomDomain}
              customDomainEnabled={customDomainEnabled}
              onCustomDomainToggle={() => setCustomDomainEnabled((e) => !e)}
              scanMode={scanMode}
              onScanModeChange={setScanMode}
              keywordPrefix={keywordPrefix}
              onKeywordPrefixChange={setKeywordPrefix}
              customWordlistInput={customWordlistInput}
              onCustomWordlistChange={setCustomWordlistInput}
              minLen={minLen}
              maxLen={maxLen}
              onMinLenChange={setMinLen}
              onMaxLenChange={setMaxLen}
              speedMs={speedMs}
              onSpeedChange={setSpeedMs}
              concurrency={concurrency}
              onConcurrencyChange={setConcurrency}
              scanLimit={scanLimit}
              onScanLimitChange={setScanLimit}
              onQuickProbeSingle={handleQuickProbeSingle}
              logs={logs}
              onClearLogs={() => setLogs([])}
              scannedCount={scannedCount}
              validCount={validCount}
              invalidCount={invalidCount}
              probesPerSec={probesPerSec}
              elapsedSeconds={elapsedSeconds}
              hitRate={hitRate}
            />
          )}

          {/* VIEW B: Dedicated Direct Link Snapper ("link vala alg") */}
          {activeView === 'link-launcher' && (
            <LinkLauncherStudio onDirectCapture={handleDirectOpenAndCapture} />
          )}

          {/* VIEW C: Dedicated Full-Screen Activity Terminal */}
          {activeView === 'terminal' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-white">Full-Screen Activity Terminal</h2>
                  <p className="text-xs text-slate-400">
                    Live probe stream inspection and server latency logs
                  </p>
                </div>
              </div>
              <ActivityTerminal
                logs={logs}
                onClearLogs={() => setLogs([])}
                isScanning={isScanning}
              />
            </div>
          )}

          {/* VIEW D: Discovered Sites Gallery (All Platforms or Specific Platform Filter) */}
          {activeView !== 'scanner-studio' &&
            activeView !== 'link-launcher' &&
            activeView !== 'terminal' && (
              <div className="space-y-5">
                {/* Metric Strip */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase">
                      TOTAL SCANNED
                    </span>
                    <div className="text-xl font-bold font-mono text-slate-100 mt-1">
                      {scannedCount}
                    </div>
                  </div>
                  <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase">
                      VALID SITES
                    </span>
                    <div className="text-xl font-bold font-mono text-emerald-400 mt-1">
                      {sites.length}
                    </div>
                  </div>
                  <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase">
                      MISSES / 404
                    </span>
                    <div className="text-xl font-bold font-mono text-slate-400 mt-1">
                      {invalidCount}
                    </div>
                  </div>
                  <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase">
                      STATUS
                    </span>
                    <div className="text-xl font-bold font-mono text-blue-400 mt-1">
                      {isScanning ? `${probesPerSec}/s` : 'Idle'}
                    </div>
                  </div>
                </div>

                {/* Discovered Cards Grid */}
                <DiscoveredGallery
                  sites={sites}
                  activeView={activeView}
                  onSelectView={setActiveView}
                  onDeleteSite={handleDeleteSite}
                  onClearAll={handleClearAll}
                  onPreviewSite={(site) => setActivePreviewSite(site)}
                  onViewScreenshot={handleViewScreenshot}
                  onRefreshScreenshot={handleRefreshScreenshot}
                />
              </div>
            )}
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-900 bg-slate-950 py-4 text-center text-xs text-slate-500 font-sans">
          <p>Subdomain Hunter · Multi-Platform Simultaneous Discovery Engine</p>
        </footer>
      </div>

      {/* In-App Live Website Viewer Modal & Screenshot Lightbox */}
      <SitePreviewModal
        activeSite={activePreviewSite}
        screenshotLightboxUrl={screenshotLightboxUrl}
        screenshotLightboxTitle={screenshotLightboxTitle}
        onClosePreview={() => setActivePreviewSite(null)}
        onCloseLightbox={() => {
          setScreenshotLightboxUrl(null);
          setScreenshotLightboxTitle(null);
        }}
        onRefreshScreenshot={handleRefreshScreenshot}
      />
    </div>
  );
}
