import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

interface TargetCheck {
  name: string;
  domain: string;
  platformId: string;
  platformName: string;
}

interface CheckResult {
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

// Extract page title from raw HTML
function extractTitle(html: string): string {
  const match = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  if (match && match[1]) {
    return match[1].trim().replace(/\s+/g, ' ').slice(0, 80);
  }
  return '';
}

// Probe a single website with custom timeout and false-positive filtering
async function probeTarget(target: TargetCheck, timeoutMs = 3500): Promise<CheckResult> {
  const url = `https://${target.name}.${target.domain}`;
  const startTime = Date.now();

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
      signal: controller.signal,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    });

    clearTimeout(timeoutId);
    const latencyMs = Date.now() - startTime;
    const statusCode = response.status;

    // Check platform specific error headers
    const vercelError = response.headers.get('x-vercel-error');
    if (vercelError && (vercelError.includes('DEPLOYMENT_NOT_FOUND') || vercelError.includes('NOT_FOUND'))) {
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
    }

    if (statusCode >= 200 && statusCode < 400) {
      // Read initial chunk to check title and 404 text templates
      const reader = response.body?.getReader();
      let text = '';
      if (reader) {
        let bytesRead = 0;
        const decoder = new TextDecoder();
        while (bytesRead < 40000) {
          const { done, value } = await reader.read();
          if (done || !value) break;
          bytesRead += value.length;
          text += decoder.decode(value, { stream: true });
        }
        try {
          reader.cancel();
        } catch {
          // ignore
        }
      }

      // Check common catch-all 404 signatures
      const lower = text.toLowerCase();
      const isNetlify404 = lower.includes('page not found') && lower.includes('netlify');
      const isGithub404 =
        lower.includes("there isn't a github pages site here") ||
        (lower.includes('404') && lower.includes('file not found') && lower.includes('github'));
      const isSurge404 = lower.includes('project not found');
      const isVercel404 = lower.includes('deployment not found') || lower.includes('404: not_found');
      const isFirebase404 = lower.includes('site not found') && lower.includes('firebase');
      const isCloudflare404 = lower.includes('page not found') && lower.includes('cloudflare pages');

      if (isNetlify404 || isGithub404 || isSurge404 || isVercel404 || isFirebase404 || isCloudflare404) {
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
      }

      const extractedTitle = extractTitle(text) || `${target.name}.${target.domain}`;

      return {
        url: response.url || url,
        name: target.name,
        domain: target.domain,
        platformId: target.platformId,
        platformName: target.platformName,
        isLive: true,
        statusCode,
        title: extractedTitle,
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
      statusCode,
      title: '',
      latencyMs,
    };
  } catch (err: any) {
    clearTimeout(timeoutId);
    const latencyMs = Date.now() - startTime;
    return {
      url,
      name: target.name,
      domain: target.domain,
      platformId: target.platformId,
      platformName: target.platformName,
      isLive: false,
      statusCode: 0,
      title: '',
      latencyMs,
    };
  }
}

// API: Batch check targets concurrently
app.post('/api/check-subdomains', async (req: Request, res: Response) => {
  const { targets } = req.body as { targets?: TargetCheck[] };

  if (!Array.isArray(targets) || targets.length === 0) {
    return res.status(400).json({ error: 'targets array required' });
  }

  // Cap batch size to 60 per request for stability
  const safeTargets = targets.slice(0, 60);

  // Parallel execution across targets
  const results = await Promise.all(safeTargets.map((t) => probeTarget(t)));

  return res.json({
    results,
    tested: results.length,
    liveCount: results.filter((r) => r.isLive).length,
  });
});

// API: Check single subdomain
app.post('/api/check-single', async (req: Request, res: Response) => {
  const { name, domain, platformId, platformName } = req.body;
  if (!name || !domain) {
    return res.status(400).json({ error: 'name and domain required' });
  }

  const result = await probeTarget({
    name,
    domain,
    platformId: platformId || 'custom',
    platformName: platformName || domain,
  });

  return res.json(result);
});

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', time: Date.now() });
});

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true, port: PORT },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
