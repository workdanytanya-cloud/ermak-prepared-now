/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Канонический URL сайта для SEO, sitemap и Open Graph (по умолчанию https://ermakcentr.ru) */
  readonly VITE_SITE_URL?: string;
  /** Опционально: URL для POST JSON при новой заявке (n8n, свой бэкенд и т.д.) */
  readonly VITE_LEADS_WEBHOOK_URL?: string;
  /** Доп. ящик для копий заявки (офисный всегда в коде). */
  readonly VITE_LEADS_EMAIL_TO?: string;
  /** Ключ с https://web3forms.com — надёжнее FormSubmit из РФ; письма идут на email, привязанный к ключу. */
  readonly VITE_WEB3FORMS_ACCESS_KEY?: string;
  /** Telegram bot token (через @BotFather) для доставки лидов в Telegram */
  readonly VITE_TELEGRAM_BOT_TOKEN?: string;
  /** Telegram chat_id, куда бот пишет лиды (личный chat_id или id группы со знаком минус) */
  readonly VITE_TELEGRAM_CHAT_ID?: string;
  /**
   * URL своего прокси (например PHP на Timeweb), который POST-ит тело как есть на api.telegram.org/bot…/sendMessage.
   * Нужен, если с сайта `api.telegram.org` не открывается (таймаут в РФ). Токен бота храните только в скрипте прокси.
   */
  readonly VITE_TELEGRAM_SEND_PROXY_URL?: string;
  /**
   * Базовый URL шлюза на VPS, например https://api.ermakcentr.ru или http://IP:5055.
   * Из него собираются /vk-lead и /telegram-send, если не заданы отдельные URL.
   */
  readonly VITE_LEADS_SERVER_URL?: string;
  /**
   * URL серверного шлюза для дубля заявки на стену ВК (POST JSON, см. server/vk-gateway.mjs).
   * Токен VK только на сервере: VK_GROUP_TOKEN.
   */
  readonly VITE_VK_LEAD_GATEWAY_URL?: string;
  /** Полный URL CRM API, например http://127.0.0.1:8000/api/leads или https://api.ermakcentr.ru/api/leads */
  readonly VITE_CRM_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
