/** Результат проверки «анонимизированное» подключение (VPN / прокси / Tor). Не 100% точность — только эвристика по IP. */
export type PrivacyLevel = "clean" | "suspicious" | "unknown";

const CACHE_KEY = "ermak_ip_privacy_v1";
const OVERRIDE_KEY = "ermak_vpn_submit_override_v1";
const CACHE_MS = 15 * 60 * 1000;

interface IpWhoSecurity {
  vpn?: boolean;
  proxy?: boolean;
  tor?: boolean;
  hosting?: boolean;
}

interface IpWhoResponse {
  success?: boolean;
  security?: IpWhoSecurity;
}

function readCache(): { level: PrivacyLevel; ts: number } | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const p = JSON.parse(raw) as { level: PrivacyLevel; ts: number };
    if (!p || typeof p.ts !== "number" || !p.level) return null;
    if (Date.now() - p.ts > CACHE_MS) return null;
    return p;
  } catch {
    return null;
  }
}

function writeCache(level: PrivacyLevel) {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ level, ts: Date.now() }));
  } catch {
    /* ignore */
  }
}

/** Сбросить кэш проверки (после «отключил VPN» — перепроверить IP при следующей отправке). */
export function clearPrivacyCache() {
  try {
    sessionStorage.removeItem(CACHE_KEY);
  } catch {
    /* ignore */
  }
}

/** Пользователь явно согласился отправить несмотря на предупреждение (на вкладку). */
export function hasVpnSubmitOverride(): boolean {
  try {
    return sessionStorage.getItem(OVERRIDE_KEY) === "1";
  } catch {
    return false;
  }
}

export function setVpnSubmitOverride() {
  try {
    sessionStorage.setItem(OVERRIDE_KEY, "1");
  } catch {
    /* ignore */
  }
}

/**
 * Определяет по внешнему IP признаки VPN/прокси/Tor (ipwho.is).
 * При ошибке сети/CORS возвращает unknown — тогда не показываем ложные срабатывания.
 */
export async function detectPrivacyLevel(): Promise<PrivacyLevel> {
  const cached = readCache();
  if (cached) return cached.level;

  const controller = new AbortController();
  const t = window.setTimeout(() => controller.abort(), 5000);
  try {
    const res = await fetch("https://ipwho.is/", {
      method: "GET",
      signal: controller.signal,
      headers: { Accept: "application/json" },
    });
    if (!res.ok) {
      writeCache("unknown");
      return "unknown";
    }
    const data = (await res.json()) as IpWhoResponse;
    if (!data.success || !data.security) {
      writeCache("unknown");
      return "unknown";
    }
    const s = data.security;
    const suspicious = Boolean(s.vpn || s.proxy || s.tor);
    const level: PrivacyLevel = suspicious ? "suspicious" : "clean";
    writeCache(level);
    return level;
  } catch {
    writeCache("unknown");
    return "unknown";
  } finally {
    window.clearTimeout(t);
  }
}
