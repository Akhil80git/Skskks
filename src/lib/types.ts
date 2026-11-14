export interface DiscoveredSite {
  id: string;
  url: string;
  name: string;
  domain: string;
  platformId: string;
  platformName: string;
  title: string;
  screenshot: string;
  statusCode: number;
  latencyMs: number;
  discoveredAt: number;
}

export interface ActivityLogItem {
  id: string;
  timestamp: string;
  url: string;
  name: string;
  domain: string;
  platformName: string;
  platformId: string;
  status: 'valid' | 'invalid' | 'probing' | 'error';
  statusCode?: number;
  latencyMs?: number;
  message?: string;
}

export type ScanMode = 'smart-words' | 'random' | 'prefix' | 'custom-list';
