/** Старые URL прошлого сайта ermakcentr.ru → актуальные маршруты React */
export const LEGACY_EXACT_REDIRECTS: Record<string, string> = {
  "/engineeringtraining": "/course/engineering",
  "/engineering-training": "/course/engineering",
  "/inzhenernaya": "/course/engineering",
  "/raspisanie": "/courses",
  "/schedule": "/courses",
  "/deti": "/courses",
  "/csp-deti": "/courses",
  "/video": "/courses",
  "/video2": "/courses",
  "/samooborona": "/course/women-safety",
  "/tactical": "/course/tactical-training",
  "/tactics": "/course/tactical-training",
  "/taktika": "/course/tactical-training",
  "/tacmed": "/course/tactical-medicine-military",
  "/tacticalmedicine": "/course/tactical-medicine-military",
  "/ak": "/course/ak-operator-military",
  "/ak-operator": "/course/ak-operator-military",
  "/pistol": "/course/pistol-military",
  "/pistole": "/course/pistol-military",
  "/firstaid": "/course/first-aid",
  "/first-aid-course": "/course/first-aid",
  "/women": "/course/women-safety",
  "/field": "/course/field-intensive-military",
  "/intensive": "/course/field-intensive-military",
  "/contacts": "/#contacts",
  "/kontakty": "/#contacts",
};

const LEGACY_KEYWORD_RULES: { test: RegExp; to: string }[] = [
  { test: /engineering|inzhener/i, to: "/course/engineering" },
  { test: /tactical|taktik|shturm|shtorm/i, to: "/course/tactical-training" },
  { test: /tacmed|tactical-medic|taktichesk.*med/i, to: "/course/tactical-medicine-military" },
  { test: /pistol|pistole|pist/i, to: "/course/pistol-military" },
  { test: /operator.*ak|ak-operator|\bak\b/i, to: "/course/ak-operator-military" },
  { test: /first.?aid|pervaya|pomosh/i, to: "/course/first-aid" },
  { test: /women|zhensk|samooboron/i, to: "/course/women-safety" },
  { test: /field|polev|intensiv/i, to: "/course/field-intensive-military" },
  { test: /deti|lager|camp/i, to: "/courses" },
  { test: /video|raspisan|schedule/i, to: "/courses" },
];

export function normalizePathname(pathname: string): string {
  let path = pathname || "/";

  if (path.endsWith("/index.html")) {
    path = path.slice(0, -"/index.html".length) || "/";
  }

  if (path.length > 1 && path.endsWith("/")) {
    path = path.slice(0, -1);
  }

  return path || "/";
}

export function resolveLegacyRedirect(pathname: string): string | null {
  const path = normalizePathname(pathname);
  const lower = path.toLowerCase();

  if (LEGACY_EXACT_REDIRECTS[path]) return LEGACY_EXACT_REDIRECTS[path];
  if (LEGACY_EXACT_REDIRECTS[lower]) return LEGACY_EXACT_REDIRECTS[lower];

  for (const rule of LEGACY_KEYWORD_RULES) {
    if (rule.test.test(path)) return rule.to;
  }

  return null;
}
