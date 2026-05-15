/**
 * Дублирование лида на стену закрытого сообщества ВК через свой сервер.
 * URL: VITE_VK_LEAD_GATEWAY_URL или VITE_LEADS_SERVER_URL + /vk-lead. Токен VK только на сервере.
 */

import { vkLeadGatewayUrl, warnIfMixedContent } from "@/lib/leadsServer";
import { toast } from "sonner";

export type VkLeadKind = "booking" | "course_inquiry";

export interface VkWallLeadPayload {
  kind: VkLeadKind;
  course: string;
  name: string;
  phone: string;
  /** Telegram / WhatsApp / MAX и т.п., если указано */
  messengers?: string;
  /** Комментарий, вопрос, желаемая дата — одной строкой или многострочно */
  comment?: string;
  /** Полный URL страницы с формой */
  pageUrl?: string;
}

/** Не блокирует UX: ошибки только в консоль. */
export function requestVkWallDuplicate(payload: VkWallLeadPayload): void {
  const url = vkLeadGatewayUrl();
  const mixed =
    typeof globalThis !== "undefined" &&
    "location" in globalThis &&
    globalThis.location.protocol === "https:" &&
    url.startsWith("http://");
  warnIfMixedContent(url, "VK");
  if (mixed) {
    toast.warning(
      "Дубль в ВК не отправлен: нужен HTTPS-шлюз (api.ermakcentr.ru). Заявка на сайте сохранена.",
      { duration: 8000 },
    );
    return;
  }

  void fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
    mode: "cors",
    credentials: "omit",
  })
    .then(async (res) => {
      if (!res.ok) {
        const t = await res.text().catch(() => "");
        console.warn("[leads] VK gateway HTTP", res.status, t.slice(0, 500));
      } else {
        console.info("[leads] VK gateway ok");
      }
    })
    .catch((err) => {
      console.warn("[leads] VK gateway fetch failed", err);
    });
}
