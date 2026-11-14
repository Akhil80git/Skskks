import { SiteCard, STARTER_CARDS } from '../data/suggestions';

const DB_NAME = 'snapgrid_directory_v1';
const STORE_NAME = 'sites';
const DB_VERSION = 1;

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('createdAt', 'createdAt', { unique: false });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function loadAllSites(): Promise<SiteCard[]> {
  try {
    const db = await openDb();
    return await new Promise<SiteCard[]>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();
      req.onsuccess = async () => {
        const items = (req.result as SiteCard[]) || [];
        if (items.length === 0) {
          await saveSitesBatch(STARTER_CARDS);
          resolve([...STARTER_CARDS].sort((a, b) => b.createdAt - a.createdAt));
        } else {
          items.sort((a, b) => b.createdAt - a.createdAt);
          resolve(items);
        }
      };
      req.onerror = () => reject(req.error);
    });
  } catch {
    return [...STARTER_CARDS];
  }
}

export async function upsertSite(card: SiteCard): Promise<void> {
  try {
    const db = await openDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      tx.objectStore(STORE_NAME).put(card);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    // Ignore IndexedDB quota/private mode errors gracefully
  }
}

export async function saveSitesBatch(cards: SiteCard[]): Promise<void> {
  if (!cards.length) return;
  try {
    const db = await openDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      for (const card of cards) {
        store.put(card);
      }
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    // Ignore IndexedDB errors gracefully
  }
}

export async function removeSiteById(id: string): Promise<void> {
  try {
    const db = await openDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      tx.objectStore(STORE_NAME).delete(id);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    // Ignore errors
  }
}

export function buildInstantClientThumb(hostname: string, title?: string): string {
  const cleanHost = hostname.replace(/^www\./, '').slice(0, 38);
  const label = (title || cleanHost).slice(0, 44).replace(/[<>&"']/g, '');
  const safeHost = cleanHost.replace(/[<>&"']/g, '');
  let hash = 0;
  for (let i = 0; i < safeHost.length; i++) {
    hash = safeHost.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colors = ['#2563eb', '#0f766e', '#4338ca', '#334155', '#b45309', '#be123c', '#0284c7'];
  const accent = colors[Math.abs(hash) % colors.length];
  const initial = (safeHost[0] || 'W').toUpperCase();

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480" width="640" height="480">
    <rect width="640" height="480" fill="#ffffff"/>
    <rect width="640" height="36" fill="#f1f5f9"/>
    <circle cx="18" cy="18" r="4.5" fill="#cbd5e1"/>
    <circle cx="32" cy="18" r="4.5" fill="#cbd5e1"/>
    <circle cx="46" cy="18" r="4.5" fill="#cbd5e1"/>
    <rect x="68" y="8" width="440" height="20" rx="4" fill="#ffffff" stroke="#e2e8f0"/>
    <text x="80" y="22" font-family="monospace" font-size="10.5" fill="#64748b">https://${safeHost}</text>
    <rect x="28" y="60" width="584" height="172" rx="8" fill="#f8fafc" stroke="#e2e8f0"/>
    <rect x="52" y="84" width="28" height="28" rx="6" fill="${accent}"/>
    <text x="66" y="103" text-anchor="middle" font-family="sans-serif" font-weight="700" font-size="14" fill="#ffffff">${initial}</text>
    <text x="52" y="146" font-family="sans-serif" font-weight="700" font-size="20" fill="#0f172a">${label}</text>
    <text x="52" y="172" font-family="monospace" font-size="12" fill="#64748b">${safeHost}</text>
    <rect x="52" y="190" width="96" height="24" rx="5" fill="${accent}"/>
    <rect x="28" y="254" width="184" height="186" rx="6" fill="#ffffff" stroke="#e2e8f0"/>
    <rect x="44" y="274" width="120" height="10" rx="4" fill="#e2e8f0"/>
    <rect x="44" y="294" width="150" height="8" rx="4" fill="#f1f5f9"/>
    <rect x="44" y="310" width="132" height="8" rx="4" fill="#f1f5f9"/>
    <rect x="228" y="254" width="184" height="186" rx="6" fill="#ffffff" stroke="#e2e8f0"/>
    <rect x="244" y="274" width="110" height="10" rx="4" fill="#e2e8f0"/>
    <rect x="244" y="294" width="148" height="8" rx="4" fill="#f1f5f9"/>
    <rect x="244" y="310" width="126" height="8" rx="4" fill="#f1f5f9"/>
    <rect x="428" y="254" width="184" height="186" rx="6" fill="#ffffff" stroke="#e2e8f0"/>
    <rect x="444" y="274" width="124" height="10" rx="4" fill="#e2e8f0"/>
    <rect x="444" y="294" width="144" height="8" rx="4" fill="#f1f5f9"/>
    <rect x="444" y="310" width="136" height="8" rx="4" fill="#f1f5f9"/>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
