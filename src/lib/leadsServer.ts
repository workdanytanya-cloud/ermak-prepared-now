/**
 * Общий шлюз на VPS (Timeweb): ВК + Telegram. Токены только на сервере.
 * С https://ermakcentr.ru нужен HTTPS-URL шлюза (иначе браузер блокирует http://).
 */

/** Шлюз заявок на VPS (HTTPS). Переопределяется через VITE_LEADS_SERVER_URL при сборке. */
export const DEFAULT_LEADS_SERVER = "https://api.ermakcentr.ru";

export function leadsServerBase(): string {
  const fromVk = (import.meta.env.VITE_VK_LEAD_GATEWAY_URL as string | undefined)?.trim();
  if (fromVk) {
    return fromVk.replace(/\/vk-lead\/?$/i, "");
  }
  const base = (import.meta.env.VITE_LEADS_SERVER_URL as string | undefined)?.trim();
  return (base || DEFAULT_LEADS_SERVER).replace(/\/$/, "");
}

export function vkLeadGatewayUrl(): string {
  const explicit = (import.meta.env.VITE_VK_LEAD_GATEWAY_URL as string | undefined)?.trim();
  if (explicit) return explicit;
  return `${leadsServerBase()}/vk-lead`;
}

export function telegramProxyUrl(): string {
  const explicit = (import.meta.env.VITE_TELEGRAM_SEND_PROXY_URL as string | undefined)?.trim();
  if (explicit) return explicit;
  return `${leadsServerBase()}/telegram-send`;
}

/** URL CRM API: VITE_CRM_API_URL или шлюз api.ermakcentr.ru/api/leads */
export function crmLeadsUrl(): string {
  const explicit = (import.meta.env.VITE_CRM_API_URL as string | undefined)?.trim();
  if (explicit) return explicit.replace(/\/$/, "");
  const server = (import.meta.env.VITE_LEADS_SERVER_URL as string | undefined)?.trim();
  if (server?.startsWith("https://")) {
    return `${server.replace(/\/$/, "")}/api/leads`;
  }
  return "https://api.ermakcentr.ru/api/leads";
}

export function warnIfMixedContent(url: string, label: string) {
  if (typeof globalThis === "undefined" || !("location" in globalThis)) return;
  const loc = globalThis.location;
  if (loc.protocol === "https:" && url.startsWith("http://")) {
    console.warn(
      `[leads] ${label}: браузер может блокировать ${url} с HTTPS-сайта. ` +
        "Настройте https://api.ermakcentr.ru (Nginx+SSL) и VITE_LEADS_SERVER_URL.",
    );
  }
}
