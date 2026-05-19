/** Базовые SEO-константы ЦСП «Ермак» */
export const SITE_NAME = "ЦСП «Ермак»";
export const SITE_NAME_SHORT = "Ермак";
export const SITE_TAGLINE = "Центр специальной подготовки";
export const SITE_LOCALITY = "Новосибирск";
export const SITE_REGION = "Новосибирская область";
export const SITE_COUNTRY = "RU";

export const SITE_URL = (
  (import.meta.env.VITE_SITE_URL as string | undefined)?.trim() || "https://ermakcentr.ru"
).replace(/\/$/, "");

export const SITE_OG_IMAGE = `${SITE_URL}/brand/logo-ermak-main.png`;
export const SITE_PHONE = "+7-913-951-15-30";
export const SITE_VK_URL = "https://vk.com/ermakcentr";
export const SITE_ADDRESS = "Красный проспект, 11, Новосибирск";

export const DEFAULT_TITLE =
  "ЦСП «Ермак» — курсы тактической подготовки, медицины и безопасности в Новосибирске";
export const DEFAULT_DESCRIPTION =
  "Центр специальной подготовки «Ермак» в Новосибирске: первая помощь, тактическая медицина, огневая и тактическая подготовка для гражданских и силовых специалистов. Практика, малые группы, запись онлайн.";
export const DEFAULT_KEYWORDS =
  "ЦСП Ермак, центр специальной подготовки, курсы Новосибирск, тактическая медицина, первая помощь, огневая подготовка, тактика, штурм, прикладной пистолет, тактико-специальная подготовка";

const TITLE_SUFFIX = ` | ${SITE_NAME}`;

export function buildPageTitle(pageTitle?: string): string {
  if (!pageTitle?.trim()) return DEFAULT_TITLE;
  const trimmed = pageTitle.trim();
  if (trimmed.includes(SITE_NAME) || trimmed.includes("Ермак")) return trimmed;
  return `${trimmed}${TITLE_SUFFIX}`;
}

export function toAbsoluteUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${normalized}`;
}

export function truncateDescription(text: string, max = 160): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max - 1).trim()}…`;
}
