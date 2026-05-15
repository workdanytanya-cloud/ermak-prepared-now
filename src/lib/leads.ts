import type { Application } from "@/data/applications";
import { requestVkWallDuplicate } from "@/lib/vkLeadGateway";
import { telegramProxyUrl, warnIfMixedContent } from "@/lib/leadsServer";

const STORAGE_KEY = "ermak_applications";
/** Дубль заявки «запись на курс» на офисную почту (параллельно Telegram). */
const OFFICE_LEAD_EMAIL = "ermakcentrnsk@gmail.com";
const COURSE_INQUIRY_EMAIL = OFFICE_LEAD_EMAIL;

// Значения по умолчанию для бота-приёмщика заявок ЦСП «Ермак».
// Если api.telegram.org с сайта недоступен (таймаут) — поднимите прокси (scripts/tg-proxy.example.php) и VITE_TELEGRAM_SEND_PROXY_URL.
// Если нужно сменить (бот скомпрометирован / спам) — пишем @BotFather → /revoke → подставляем новый токен.
// Можно переопределить через VITE_TELEGRAM_BOT_TOKEN / VITE_TELEGRAM_CHAT_ID на хостинге.
const DEFAULT_TELEGRAM_BOT_TOKEN = "8674084495:AAGxZIyVeeLFLHDd-rvBEby0C3GPvZW_kTw";
const DEFAULT_TELEGRAM_CHAT_ID = "489781325";

/** Публичный access key [Web3Forms](https://web3forms.com) — письма на привязанный к форме email. Смена ключа на сайте Web3Forms или `VITE_WEB3FORMS_ACCESS_KEY`. */
const DEFAULT_WEB3FORMS_ACCESS_KEY = "8f9f0170-23c1-4bd6-ab37-a2f080ee4e20";

export function loadApplications(): Application[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Application[];
    if (!Array.isArray(parsed)) return [];
    return parsed.map((a) => ({
      ...a,
      comments: Array.isArray(a.comments) ? a.comments : [],
    }));
  } catch {
    return [];
  }
}

function appendApplicationToLocal(app: Application) {
  const apps = loadApplications();
  apps.push(app);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(apps));
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/** «+7 999 123 45 67» → «+79991234567» (Telegram сам сделает кликабельным). */
function normalizePhone(input?: string): string | undefined {
  if (!input) return undefined;
  const trimmed = input.trim();
  if (!trimmed) return undefined;
  const digits = trimmed.replace(/\D/g, "");
  if (!digits) return trimmed;
  if (digits.length === 11 && (digits.startsWith("7") || digits.startsWith("8"))) {
    return `+7${digits.slice(1)}`;
  }
  if (digits.length === 10) return `+7${digits}`;
  return trimmed.startsWith("+") ? `+${digits}` : `+${digits}`;
}

function nowMoscow(): string {
  return new Date().toLocaleString("ru-RU", {
    timeZone: "Asia/Novosibirsk",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatPayloadPlain(payload: Record<string, unknown>): string {
  return Object.entries(payload)
    .filter(([, v]) => v != null && String(v).trim() !== "")
    .map(([k, v]) => `${k}: ${String(v)}`)
    .join("\n");
}

function deliverWeb3Forms(accessKey: string, payload: Record<string, unknown>, recipients: string[]) {
  const subject = String(payload._subject ?? "Заявка с сайта ermakcentr.ru");
  const name = String(payload.name ?? "Клиент (сайт)");
  const visitorEmail =
    typeof payload.email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email.trim())
      ? payload.email.trim()
      : "";
  const email = visitorEmail || OFFICE_LEAD_EMAIL;
  const phone = String(payload.phone ?? "");
  let message = formatPayloadPlain(payload);
  const extraRecipients = recipients.filter((r) => r.toLowerCase() !== email.toLowerCase());
  if (extraRecipients.length) {
    // Не используем ccemail — на бесплатном плане Web3Forms отклоняет весь запрос («Pro feature»).
    message += `\n\nДоп. получатель (перешлите вручную): ${extraRecipients.join(", ")}`;
  }
  if (!message.trim()) {
    message = "(данные заявки в теме письма)";
  }

  const fields: Record<string, string> = {
    access_key: accessKey,
    subject,
    name,
    email,
    from_name: "ermakcentr.ru",
    message,
  };
  if (phone) fields.phone = phone;
  if (visitorEmail) fields.replyto = visitorEmail;

  void (async () => {
    const body = new URLSearchParams(fields).toString();
    const res = await postWithRetry(
      "https://api.web3forms.com/submit",
      body,
      "web3forms",
      3,
      "application/x-www-form-urlencoded",
    );
    if (!res) return;
    const data = (await res.json().catch(() => ({}))) as { success?: boolean; message?: string };
    if (!res.ok || data.success === false) {
      console.error("[leads] web3forms failed", res.status, data);
      return;
    }
    console.info("[leads] web3forms delivered");
  })();
}

/** Почта: при `VITE_LEADS_WEBHOOK_URL` только webhook (Web3Forms не вызывается). Иначе Web3Forms (urlencoded fetch). */
function deliverEmails(payload: Record<string, unknown>, recipients: string[]) {
  const list = [...new Map(recipients.map((r) => r.trim()).filter(Boolean).map((r) => [r.toLowerCase(), r])).values()];
  if (list.length === 0) return;

  const webhook = (import.meta.env.VITE_LEADS_WEBHOOK_URL as string | undefined)?.trim();
  if (webhook) {
    for (const to of list) {
      void (async () => {
        const body = JSON.stringify({ type: "ermak_lead", recipient: to, ...payload });
        await postWithRetry(webhook, body, "webhook");
      })();
    }
    return;
  }

  const w3 =
    (import.meta.env.VITE_WEB3FORMS_ACCESS_KEY as string | undefined)?.trim() || DEFAULT_WEB3FORMS_ACCESS_KEY;
  deliverWeb3Forms(w3, payload, list);
}

/** Всегда офисный ящик; при `VITE_LEADS_EMAIL_TO` — дополнительно туда (без дубликатов). */
function uniqueBookingEmailRecipients(): string[] {
  const out = new Map<string, string>();
  const add = (raw: string) => {
    const t = raw.trim();
    if (!t) return;
    out.set(t.toLowerCase(), t);
  };
  add(OFFICE_LEAD_EMAIL);
  const fromEnv = (import.meta.env.VITE_LEADS_EMAIL_TO as string | undefined)?.trim();
  if (fromEnv) add(fromEnv);
  return [...out.values()];
}

interface TelegramSection {
  /** Заголовок поля. */
  label: string;
  /** Значение поля. Если пусто — секция пропускается. */
  value?: string | null;
  /** Если true — значение оборачивается в <code> (моноширинный, удобно копировать). */
  monospace?: boolean;
}

/** Повторные попытки POST-запроса при сетевых сбоях (ERR_NETWORK_CHANGED, обрыв и т.п.). */
async function postWithRetry(
  url: string,
  body: string,
  label: string,
  attempts = 3,
  /** JSON тянет CORS preflight; у api.telegram.org OPTIONS даёт 501 — браузер режет запрос. Urlencoded = «простой» POST без preflight. */
  contentType: "application/json" | "application/x-www-form-urlencoded" = "application/json",
): Promise<Response | null> {
  let lastError: unknown = null;
  for (let i = 1; i <= attempts; i++) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": contentType },
        body,
      });
      return res;
    } catch (err) {
      lastError = err;
      console.warn(`[leads] ${label} attempt ${i}/${attempts} failed`, err);
      if (i < attempts) {
        // backoff: 600ms, 1500ms
        await new Promise((resolve) => setTimeout(resolve, i * 700 + 200));
      }
    }
  }
  console.error(`[leads] ${label} unreachable after ${attempts} attempts`, lastError);
  return null;
}

function deliverToTelegram(opts: {
  title: string;
  intro?: string;
  sections: TelegramSection[];
  footer?: string;
}) {
  const token = (import.meta.env.VITE_TELEGRAM_BOT_TOKEN as string | undefined) || DEFAULT_TELEGRAM_BOT_TOKEN;
  const chatId = (import.meta.env.VITE_TELEGRAM_CHAT_ID as string | undefined) || DEFAULT_TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    console.info("[leads] telegram skipped: token/chat_id not configured");
    return;
  }

  const body = opts.sections
    .filter((s) => s.value != null && String(s.value).trim().length > 0)
    .map((s) => {
      const v = String(s.value);
      const renderedValue = s.monospace ? `<code>${escapeHtml(v)}</code>` : escapeHtml(v);
      return `<b>${escapeHtml(s.label)}:</b> ${renderedValue}`;
    })
    .join("\n");

  const parts = [
    `<b>${escapeHtml(opts.title)}</b>`,
    opts.intro ? escapeHtml(opts.intro) : "",
    body,
    opts.footer ? `<i>${escapeHtml(opts.footer)}</i>` : "",
  ].filter(Boolean);

  const text = parts.join("\n\n");

  void (async () => {
    const proxy = telegramProxyUrl();
    warnIfMixedContent(proxy, "Telegram");

    if (proxy.includes("/telegram-send")) {
      const response = await postWithRetry(
        proxy,
        JSON.stringify({ text, parse_mode: "HTML" }),
        "telegram",
        3,
        "application/json",
      );
      if (!response) return;
      const data = await response.json().catch(() => ({}));
      if (!response.ok || (data && data.ok === false)) {
        console.error("[leads] telegram proxy error", response.status, data);
      } else {
        console.info("[leads] telegram delivered (via VPS)");
      }
      return;
    }

    const requestBody = new URLSearchParams({
      chat_id: String(chatId),
      text,
      parse_mode: "HTML",
      disable_web_page_preview: "true",
    }).toString();

    const endpoint = `https://api.telegram.org/bot${token}/sendMessage`;
    const response = await postWithRetry(endpoint, requestBody, "telegram", 3, "application/x-www-form-urlencoded");
    if (!response) return;
    const data = await response.json().catch(() => ({}));
    if (!response.ok || (data && data.ok === false)) {
      console.error("[leads] telegram error", response.status, data);
    } else {
      console.info("[leads] telegram delivered");
    }
  })();
}

// =============================================================
// Заявка на запись (BookingForm)
// =============================================================

export interface BookingExtras {
  /** Откуда пришёл лид: страница, кнопка, источник. */
  source?: string;
}

export function saveApplication(
  app: Omit<Application, "id" | "createdAt"> & { id?: string; createdAt?: string },
  extras?: BookingExtras,
): Application {
  const full: Application = {
    id: app.id ?? crypto.randomUUID(),
    name: app.name,
    phone: app.phone,
    course: app.course,
    date: app.date,
    status: app.status,
    comments: app.comments,
    createdAt: app.createdAt ?? new Date().toISOString(),
    desiredDate: app.desiredDate,
    comment: app.comment,
  };
  appendApplicationToLocal(full);

  const bookingPayload = {
    _subject: `Новая заявка: ${full.course}`,
    name: full.name,
    phone: full.phone,
    course: full.course,
    date: full.date,
    desiredDate: full.desiredDate ?? "",
    comment: full.comment ?? "",
    source: extras?.source ?? "",
  };
  deliverEmails(bookingPayload, uniqueBookingEmailRecipients());

  const phone = normalizePhone(full.phone);
  deliverToTelegram({
    title: "🟢 НОВАЯ ЗАЯВКА на курс",
    intro: `Курс: «${full.course}»`,
    sections: [
      { label: "👤 Имя", value: full.name },
      { label: "📞 Телефон", value: phone, monospace: true },
      { label: "🗓 Желаемая дата", value: full.desiredDate },
      { label: "💬 Комментарий", value: full.comment },
      { label: "📍 Источник", value: extras?.source },
    ],
    footer: `Получено: ${nowMoscow()} (Новосибирск)`,
  });

  const vkCommentParts: string[] = [];
  if (full.desiredDate?.trim()) vkCommentParts.push(`Желаемая дата: ${full.desiredDate.trim()}`);
  if (full.comment?.trim()) vkCommentParts.push(full.comment.trim());
  requestVkWallDuplicate({
    kind: "booking",
    course: full.course,
    name: full.name,
    phone: full.phone,
    comment: vkCommentParts.length ? vkCommentParts.join("\n") : undefined,
    pageUrl: typeof globalThis !== "undefined" && "location" in globalThis ? globalThis.location.href : undefined,
  });

  return full;
}

// =============================================================
// Запрос даты курса (CourseInquiryDialog)
// =============================================================

export type InquiryContactType = "email" | "phone";
export type InquiryPhoneMethod = "call" | "telegram" | "max" | "sms";

export interface CourseInquiryPayload {
  courseTitle: string;
  contactType: InquiryContactType;
  email?: string;
  phone?: string;
  phoneMethod?: InquiryPhoneMethod;
  question?: string;
  source?: string;
}

export const inquiryPhoneMethodLabel: Record<InquiryPhoneMethod, string> = {
  call: "Перезвонить",
  telegram: "Telegram",
  max: "MAX",
  sms: "СМС",
};

export function sendCourseInquiry(inq: CourseInquiryPayload): Application {
  const contactSummary =
    inq.contactType === "email"
      ? `Ответить на email: ${inq.email ?? ""}`
      : `Ответить на телефон ${inq.phone ?? ""} — ${inquiryPhoneMethodLabel[inq.phoneMethod ?? "call"]}`;

  const full: Application = {
    id: crypto.randomUUID(),
    name: "Запрос даты курса",
    phone: inq.contactType === "phone" ? inq.phone ?? "" : "",
    course: inq.courseTitle,
    date: new Date().toLocaleDateString("ru-RU"),
    status: "new",
    comments: [
      `Запрос даты курса: ${inq.courseTitle}`,
      contactSummary,
      inq.question ? `Вопрос: ${inq.question}` : "",
      inq.source ? `Источник: ${inq.source}` : "",
    ].filter(Boolean),
    createdAt: new Date().toISOString(),
    comment: inq.question,
  };
  appendApplicationToLocal(full);

  // Почта: webhook / Web3Forms / FormSubmit (скрытая форма) — см. deliverEmails.
  deliverEmails(
    {
      _subject: `Запрос даты курса: ${inq.courseTitle}`,
      name: `Запрос даты: ${inq.courseTitle}`,
      type: "course_inquiry",
      course: inq.courseTitle,
      contactType: inq.contactType === "email" ? "Email" : "Телефон",
      email: inq.email ?? "",
      phone: inq.phone ?? "",
      phoneMethod: inq.phoneMethod ? inquiryPhoneMethodLabel[inq.phoneMethod] : "",
      question: inq.question ?? "",
      source: inq.source ?? "",
      summary: contactSummary,
    },
    [COURSE_INQUIRY_EMAIL],
  );

  const phone = normalizePhone(inq.phone);
  const responseChannel =
    inq.contactType === "email"
      ? "Email"
      : `${inquiryPhoneMethodLabel[inq.phoneMethod ?? "call"]} (на телефон)`;

  deliverToTelegram({
    title: "📅 ЗАПРОС ДАТЫ КУРСА",
    intro: `Курс: «${inq.courseTitle}»`,
    sections: [
      { label: "📨 Куда ответить", value: responseChannel },
      { label: "📧 Email", value: inq.email, monospace: true },
      { label: "📞 Телефон", value: phone, monospace: true },
      { label: "❓ Вопрос клиента", value: inq.question },
      { label: "📍 Источник", value: inq.source },
    ],
    footer: `Получено: ${nowMoscow()} (Новосибирск)`,
  });

  const messengers =
    inq.contactType === "email"
      ? inq.email?.trim()
        ? `Email: ${inq.email.trim()}`
        : undefined
      : `Предпочтительный канал: ${inquiryPhoneMethodLabel[inq.phoneMethod ?? "call"]}`;
  const vkInquiryComment = [inq.question?.trim(), inq.source?.trim()].filter(Boolean).join("\n\n") || undefined;

  requestVkWallDuplicate({
    kind: "course_inquiry",
    course: inq.courseTitle,
    name: "не указано",
    phone: inq.contactType === "phone" ? (inq.phone?.trim() || "—") : "—",
    messengers,
    comment: vkInquiryComment,
    pageUrl: typeof globalThis !== "undefined" && "location" in globalThis ? globalThis.location.href : undefined,
  });

  return full;
}
