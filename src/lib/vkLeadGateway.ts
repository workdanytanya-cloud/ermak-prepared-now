/**
 * Дублирование лида на стену закрытого сообщества ВК через свой сервер.
 * URL шлюза: VITE_VK_LEAD_GATEWAY_URL (POST JSON). Токен VK только на сервере (VK_GROUP_TOKEN).
 */

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

function gatewayUrl(): string | undefined {
  return (import.meta.env.VITE_VK_LEAD_GATEWAY_URL as string | undefined)?.trim();
}

/** Не блокирует UX: ошибки только в консоль. */
export function requestVkWallDuplicate(payload: VkWallLeadPayload): void {
  const url = gatewayUrl();
  if (!url) return;

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
      }
    })
    .catch((err) => {
      console.warn("[leads] VK gateway fetch failed", err);
    });
}
