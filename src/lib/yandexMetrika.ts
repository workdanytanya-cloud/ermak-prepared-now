/** Счётчик Яндекс.Метрики для ermakcentr.ru */
export const YANDEX_METRIKA_ID = 92388971;

export const YANDEX_METRIKA_SCRIPT = "https://mc.yandex.ru/metrika/tag.js";

type YmFn = ((counterId: number, method: string, ...args: unknown[]) => void) & {
  a?: unknown[][];
  l?: number;
};

declare global {
  interface Window {
    ym?: YmFn;
  }
}

let scriptRequested = false;
let initialized = false;

/** Подгружает tag.js один раз (без дублирования). */
export function ensureYandexMetrikaScript(): void {
  if (typeof document === "undefined" || scriptRequested) return;

  if (document.querySelector(`script[src="${YANDEX_METRIKA_SCRIPT}"]`)) {
    scriptRequested = true;
    return;
  }

  scriptRequested = true;

  const ymStub: YmFn = ((...args: unknown[]) => {
    ymStub.a = ymStub.a || [];
    ymStub.a.push(args);
  }) as YmFn;
  ymStub.l = Date.now();
  window.ym = ymStub;

  const script = document.createElement("script");
  script.async = true;
  script.src = YANDEX_METRIKA_SCRIPT;
  const first = document.getElementsByTagName("script")[0];
  first?.parentNode?.insertBefore(script, first);
}

export function initYandexMetrika(): boolean {
  if (initialized || typeof window.ym !== "function") return initialized;
  window.ym(YANDEX_METRIKA_ID, "init", {
    defer: true,
    clickmap: true,
    trackLinks: true,
    accurateTrackBounce: true,
    webvisor: true,
  });
  initialized = true;
  return true;
}

export function hitYandexMetrika(pageUrl: string): void {
  if (typeof window.ym !== "function") return;
  if (!initialized) initYandexMetrika();
  window.ym(YANDEX_METRIKA_ID, "hit", pageUrl, { title: document.title });
}

export function buildMetrikaPageUrl(pathname: string, search: string, hash: string): string {
  if (typeof window === "undefined") return pathname + search + hash;
  return `${window.location.origin}${pathname}${search}${hash}`;
}
