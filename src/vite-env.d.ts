/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Опционально: URL для POST JSON при новой заявке (n8n, свой бэкенд и т.д.) */
  readonly VITE_LEADS_WEBHOOK_URL?: string;
  /** Опционально: email-получатель для лидов (по умолчанию panova.fortuna@gmail.com) */
  readonly VITE_LEADS_EMAIL_TO?: string;
  /** Telegram bot token (через @BotFather) для доставки лидов в Telegram */
  readonly VITE_TELEGRAM_BOT_TOKEN?: string;
  /** Telegram chat_id, куда бот пишет лиды (личный chat_id или id группы со знаком минус) */
  readonly VITE_TELEGRAM_CHAT_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
