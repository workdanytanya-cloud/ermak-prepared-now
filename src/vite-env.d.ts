/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Опционально: URL для POST JSON при новой заявке (n8n, свой бэкенд и т.д.) */
  readonly VITE_LEADS_WEBHOOK_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
