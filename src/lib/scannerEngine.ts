import { PlatformConfig } from '../data/platforms';
import { DiscoveredSite } from './types';
import { getScreenshotUrl } from '../data/seedCards';

export interface TargetProbe {
  name: string;
  domain: string;
  platformId: string;
  platformName: string;
}

export interface ProbeOutcome {
  url: string;
  name: string;
  domain: string;
  platformId: string;
  platformName: string;
  isLive: boolean;
  statusCode: number;
  title: string;
  latencyMs: number;
}

// Client-side fallback using Google DNS-over-HTTPS in case backend is offline
async function clientDnsFallbackProbe(target: TargetProbe): Promise<ProbeOutcome> {
  const url = `https://${target.name}.${target.domain}`;
  const startTime = Date.now();
  const fqdn = `${target.name}.${target.domain}`;

  try {
    const res = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(fqdn)}&type=A`, {
      method: 'GET',
    });
    const data = await res.json();
    const latencyMs = Date.now() - startTime;

    // Status: 0 is NOERROR (domain exists in DNS), Answer array contains IP records
    if (data && data.Status === 0 && Array.isArray(data.Answer) && data.Answer.length > 0) {
      return {
        url,
        name: target.name,
        domain: target.domain,
        platformId: target.platformId,
        platformName: target.platformName,
        isLive: true,
        statusCode: 200,
        title: `${target.name}.${target.domain}`,
        latencyMs,
      };
    }

    return {
      url,
      name: target.name,
      domain: target.domain,
      platformId: target.platformId,
      platformName: target.platformName,
      isLive: false,
      statusCode: 404,
      title: '',
      latencyMs,
    };
  } catch {
    return {
      url,
      name: target.name,
      domain: target.domain,
      platformId: target.platformId,
      platformName: target.platformName,
      isLive: false,
      statusCode: 0,
      title: '',
      latencyMs: Date.now() - startTime,
    };
  }
}

// Check batch of targets via full-stack Express endpoint with graceful fallback
export async function checkTargetsBatch(targets: TargetProbe[]): Promise<ProbeOutcome[]> {
  try {
    const res = await fetch('/api/check-subdomains', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targets }),
    });

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.results)) {
        return data.results as ProbeOutcome[];
      }
    }
  } catch {
    // Backend offline / fall back to client DoH probes
  }

  // Fallback to client-side DoH resolution
  return Promise.all(targets.map((t) => clientDnsFallbackProbe(t)));
}

// Build DiscoveredSite object from a valid probe outcome
export function createDiscoveredSite(outcome: ProbeOutcome): DiscoveredSite {
  return {
    id: `site-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    url: outcome.url,
    name: outcome.name,
    domain: outcome.domain,
    platformId: outcome.platformId,
    platformName: outcome.platformName,
    title: outcome.title || outcome.name,
    screenshot: getScreenshotUrl(outcome.url),
    statusCode: outcome.statusCode || 200,
    latencyMs: outcome.latencyMs || 250,
    discoveredAt: Date.now(),
  };
}
