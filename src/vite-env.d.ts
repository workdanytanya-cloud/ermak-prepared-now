/// <reference types="vite/client" />

interface ImportMetaEnv {
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
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
