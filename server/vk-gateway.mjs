/**
 * Шлюз: приём JSON с фронта ermakcentr.ru → wall.post от имени сообщества ВК.
 *
 * Переменные окружения:
 *   VK_GROUP_TOKEN — ключ сообщества с правами wall (обязательно)
 *   TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID — для POST /telegram-send (прокси из РФ)
 *   CRM_BACKEND_URL — URL CRM (по умолчанию http://127.0.0.1:8000) для POST /api/leads
 *   VK_ALLOWED_ORIGINS — через запятую, для CORS (по умолчанию https://ermakcentr.ru,http://localhost:5173)
 *
 * Запуск: VK_GROUP_TOKEN=... node server/vk-gateway.mjs
 * На Timeweb можно PM2 / systemd; на Vercel — переписать в serverless.
 */

import http from "node:http";
import { URL } from "node:url";

const PORT = Number(process.env.PORT) || 5055;
const VK_TOKEN = process.env.VK_GROUP_TOKEN;
const TG_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TG_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const CRM_BACKEND_URL = (process.env.CRM_BACKEND_URL || "http://127.0.0.1:8000").replace(/\/$/, "");
const OWNER_ID = "-238725296";
const VK_API_VERSION = "5.199";

const DEFAULT_ORIGINS = ["https://ermakcentr.ru", "https://www.ermakcentr.ru", "http://localhost:5173", "http://127.0.0.1:5173"];
const ALLOWED_ORIGINS = (process.env.VK_ALLOWED_ORIGINS || DEFAULT_ORIGINS.join(","))
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

function corsHeaders(origin) {
  const o = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": o,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Accept",
    "Access-Control-Max-Age": "86400",
  };
}

function nowNovosibirsk() {
  return new Date().toLocaleString("ru-RU", {
    timeZone: "Asia/Novosibirsk",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function sanitize(s, max = 6000) {
  if (typeof s !== "string") return "";
  const t = s.replace(/\r\n/g, "\n").trim();
  return t.length > max ? t.slice(0, max) + "…" : t;
}

function buildMessage(body) {
  const course = sanitize(body?.course, 500) || "—";
  const name = sanitize(body?.name, 300) || "—";
  const phone = sanitize(body?.phone, 80) || "—";
  const messengers = sanitize(body?.messengers, 500);
  const comment = sanitize(body?.comment, 3500);
  const pageUrl = sanitize(body?.pageUrl, 2000);

  return [
    "🔥 Новая заявка с сайта ЕРМАК",
    "",
    `Курс: ${course}`,
    `Имя: ${name}`,
    `Телефон: ${phone}`,
    `Telegram/WhatsApp: ${messengers || "—"}`,
    `Комментарий: ${comment || "—"}`,
    `Страница заявки: ${pageUrl || "—"}`,
    `Дата и время: ${nowNovosibirsk()} (Новосибирск)`,
  ].join("\n");
}

async function postWall(message) {
  if (!VK_TOKEN) {
    console.error("[vk-gateway] VK_GROUP_TOKEN is not set");
    return { ok: false, error: "server_misconfigured" };
  }

  const params = new URLSearchParams({
    owner_id: OWNER_ID,
    from_group: "1",
    message,
    access_token: VK_TOKEN,
    v: VK_API_VERSION,
  });

  const res = await fetch("https://api.vk.com/method/wall.post", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
    body: params.toString(),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.error) {
    console.error("[vk-gateway] wall.post failed", res.status, JSON.stringify(data).slice(0, 2000));
    return { ok: false, data };
  }
  console.info("[vk-gateway] wall.post ok", data.response);
  return { ok: true, data };
}

async function proxyToCrm(body, req) {
  const url = `${CRM_BACKEND_URL}/api/leads`;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-Forwarded-For": req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "",
      },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      console.error("[leads-server] CRM proxy failed", res.status, JSON.stringify(data).slice(0, 2000));
    } else {
      console.info("[leads-server] CRM proxy ok", { client_id: data?.client_id, new: data?.is_new_client });
    }
    return { status: res.status, data };
  } catch (err) {
    console.error("[leads-server] CRM unreachable at", url, err?.message || err);
    return { status: 502, data: { success: false, error: "crm_unreachable" } };
  }
}

async function sendTelegram(text, parseMode = "HTML") {
  if (!TG_TOKEN || !TG_CHAT_ID) {
    console.error("[leads-server] TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID missing");
    return { ok: false, error: "telegram_misconfigured" };
  }
  const params = new URLSearchParams({
    chat_id: String(TG_CHAT_ID),
    text: String(text).slice(0, 4096),
    parse_mode: parseMode,
    disable_web_page_preview: "true",
  });
  const res = await fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
    body: params.toString(),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.ok === false) {
    console.error("[leads-server] telegram failed", res.status, JSON.stringify(data).slice(0, 2000));
    return { ok: false, data };
  }
  console.info("[leads-server] telegram ok");
  return { ok: true, data };
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => {
      try {
        const raw = Buffer.concat(chunks).toString("utf8");
        if (!raw) return resolve({});
        resolve(JSON.parse(raw));
      } catch (e) {
        reject(e);
      }
    });
    req.on("error", reject);
  });
}

const server = http.createServer(async (req, res) => {
  const origin = req.headers.origin || "";
  const ch = corsHeaders(origin);

  if (req.method === "OPTIONS") {
    res.writeHead(204, { ...ch });
    return res.end();
  }

  const host = req.headers.host || "localhost";
  const url = new URL(req.url || "/", `http://${host}`);

  if (req.method === "GET" && url.pathname === "/health") {
    res.writeHead(200, { "Content-Type": "application/json", ...ch });
    return res.end(
      JSON.stringify({
        ok: true,
        service: "ermak-leads",
        vk: Boolean(VK_TOKEN),
        telegram: Boolean(TG_TOKEN && TG_CHAT_ID),
      }),
    );
  }

  if (req.method !== "POST") {
    res.writeHead(404, { "Content-Type": "application/json", ...ch });
    return res.end(JSON.stringify({ ok: false, error: "not_found" }));
  }

  if (url.pathname === "/api/leads") {
    let body;
    try {
      body = await readBody(req);
    } catch {
      res.writeHead(400, { "Content-Type": "application/json", ...ch });
      return res.end(JSON.stringify({ ok: false, error: "invalid_json" }));
    }
    console.info("[leads-server] received /api/leads", {
      phone: sanitize(body?.phone, 20),
      course: sanitize(body?.selected_course, 200),
      form: sanitize(body?.form_name, 80),
    });
    const { status, data } = await proxyToCrm(body, req);
    res.writeHead(status, { "Content-Type": "application/json", ...ch });
    return res.end(JSON.stringify(data));
  }

  if (url.pathname === "/telegram-send") {
    let body;
    try {
      body = await readBody(req);
    } catch {
      res.writeHead(400, { "Content-Type": "application/json", ...ch });
      return res.end(JSON.stringify({ ok: false, error: "invalid_json" }));
    }
    const text = sanitize(body?.text, 4096);
    if (!text) {
      res.writeHead(400, { "Content-Type": "application/json", ...ch });
      return res.end(JSON.stringify({ ok: false, error: "text_required" }));
    }
    console.info("[leads-server] received /telegram-send", { len: String(text).length });
    await sendTelegram(text, body?.parse_mode === "Markdown" ? "Markdown" : "HTML");
    res.writeHead(200, { "Content-Type": "application/json", ...ch });
    return res.end(JSON.stringify({ ok: true }));
  }

  if (url.pathname === "/vk-lead") {
    let body;
    try {
      body = await readBody(req);
    } catch {
      res.writeHead(400, { "Content-Type": "application/json", ...ch });
      return res.end(JSON.stringify({ ok: false, error: "invalid_json" }));
    }
    console.info("[leads-server] received /vk-lead", {
      kind: body?.kind,
      course: sanitize(body?.course, 200),
    });
    const message = buildMessage(body);
    await postWall(message);
    res.writeHead(200, { "Content-Type": "application/json", ...ch });
    return res.end(JSON.stringify({ ok: true }));
  }

  res.writeHead(404, { "Content-Type": "application/json", ...ch });
  res.end(JSON.stringify({ ok: false, error: "not_found" }));
});

server.listen(PORT, () => {
  console.info(`[leads-server] :${PORT} — POST /api/leads, /vk-lead, /telegram-send (CRM → ${CRM_BACKEND_URL})`);
});
