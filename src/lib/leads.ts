import type { Application } from "@/data/applications";

const STORAGE_KEY = "ermak_applications";
const DEFAULT_LEAD_EMAIL = "panova.fortuna@gmail.com";
const COURSE_INQUIRY_EMAIL = "ermakcentrnsk@gmail.com";

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

function deliverToEmail(payload: Record<string, unknown>, recipient: string) {
  const webhook = import.meta.env.VITE_LEADS_WEBHOOK_URL as string | undefined;
  if (webhook) {
    fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "ermak_lead", recipient, ...payload }),
    }).catch((err) => console.error("[leads] webhook error", err));
    return;
  }
  fetch(`https://formsubmit.co/ajax/${encodeURIComponent(recipient)}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      _captcha: "false",
      _template: "table",
      source: "ermak-site",
      ...payload,
    }),
  })
    .then(async (r) => {
      const data = await r.json().catch(() => ({}));
      console.info("[leads] formsubmit response", r.status, data);
    })
    .catch((err) => console.warn("[leads] formsubmit unreachable", err));
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function deliverToTelegram(title: string, lines: Array<[string, string | undefined]>) {
  const token = import.meta.env.VITE_TELEGRAM_BOT_TOKEN as string | undefined;
  const chatId = import.meta.env.VITE_TELEGRAM_CHAT_ID as string | undefined;
  if (!token || !chatId) {
    console.info("[leads] telegram skipped: token/chat_id not configured");
    return;
  }

  const body = lines
    .filter(([, v]) => v && v.toString().trim().length > 0)
    .map(([k, v]) => `<b>${escapeHtml(k)}:</b> ${escapeHtml(String(v))}`)
    .join("\n");

  const text = `<b>${escapeHtml(title)}</b>\n${body}`;

  fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: "HTML",
      disable_web_page_preview: true,
    }),
  })
    .then(async (r) => {
      const data = await r.json().catch(() => ({}));
      if (!r.ok || (data && data.ok === false)) {
        console.error("[leads] telegram error", r.status, data);
      } else {
        console.info("[leads] telegram delivered");
      }
    })
    .catch((err) => console.error("[leads] telegram unreachable", err));
}

export function saveApplication(app: Omit<Application, "id" | "createdAt"> & { id?: string; createdAt?: string }): Application {
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

  const recipient = (import.meta.env.VITE_LEADS_EMAIL_TO as string | undefined) || DEFAULT_LEAD_EMAIL;
  deliverToEmail(
    {
      _subject: `Новая заявка: ${full.course}`,
      name: full.name,
      phone: full.phone,
      course: full.course,
      date: full.date,
      desiredDate: full.desiredDate ?? "",
      comment: full.comment ?? "",
    },
    recipient,
  );

  deliverToTelegram(`🟢 Новая заявка: ${full.course}`, [
    ["Имя", full.name],
    ["Телефон", full.phone],
    ["Курс", full.course],
    ["Желаемая дата", full.desiredDate],
    ["Комментарий", full.comment],
    ["Дата подачи", full.date],
  ]);

  return full;
}

export type InquiryContactType = "email" | "phone";
export type InquiryPhoneMethod = "call" | "telegram" | "max" | "sms";

export interface CourseInquiryPayload {
  courseTitle: string;
  contactType: InquiryContactType;
  email?: string;
  phone?: string;
  phoneMethod?: InquiryPhoneMethod;
  question?: string;
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
    ].filter(Boolean),
    createdAt: new Date().toISOString(),
    comment: inq.question,
  };
  appendApplicationToLocal(full);

  // Best-effort: email через FormSubmit. В РФ часто блокируется ISP — это нормально, дубль через Telegram.
  deliverToEmail(
    {
      _subject: `Запрос даты курса: ${inq.courseTitle}`,
      type: "course_inquiry",
      course: inq.courseTitle,
      contactType: inq.contactType === "email" ? "Email" : "Телефон",
      email: inq.email ?? "",
      phone: inq.phone ?? "",
      phoneMethod: inq.phoneMethod ? inquiryPhoneMethodLabel[inq.phoneMethod] : "",
      question: inq.question ?? "",
      summary: contactSummary,
    },
    COURSE_INQUIRY_EMAIL,
  );

  // Основной надёжный канал
  deliverToTelegram(`📅 Запрос даты курса: ${inq.courseTitle}`, [
    ["Курс", inq.courseTitle],
    ["Куда отвечать", inq.contactType === "email" ? "Email" : "Телефон"],
    ["Email", inq.email],
    ["Телефон", inq.phone],
    ["Способ связи", inq.phoneMethod ? inquiryPhoneMethodLabel[inq.phoneMethod] : undefined],
    ["Вопрос", inq.question],
  ]);

  return full;
}
