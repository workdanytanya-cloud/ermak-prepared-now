import { crmLeadsUrl, warnIfMixedContent } from "@/lib/leadsServer";

export interface CrmLeadPayload {
  name?: string;
  phone: string;
  selected_course?: string;
  comment?: string;
  preferred_contact_channel?: string;
  page_url?: string;
  form_name?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  consent_personal_data: boolean;
  website?: string;
}

function utmFromLocation(): Pick<
  CrmLeadPayload,
  "utm_source" | "utm_medium" | "utm_campaign" | "utm_content" | "utm_term"
> {
  if (typeof window === "undefined") return {};
  const p = new URLSearchParams(window.location.search);
  return {
    utm_source: p.get("utm_source") ?? undefined,
    utm_medium: p.get("utm_medium") ?? undefined,
    utm_campaign: p.get("utm_campaign") ?? undefined,
    utm_content: p.get("utm_content") ?? undefined,
    utm_term: p.get("utm_term") ?? undefined,
  };
}

/** Отправка заявки в CRM (POST /api/leads). Не блокирует UI при ошибке сети. */
export async function submitLeadToCrm(payload: Omit<CrmLeadPayload, "consent_personal_data" | "website">): Promise<boolean> {
  const url = crmLeadsUrl();
  if (!url) {
    console.warn("[crm] VITE_CRM_API_URL не задан — заявка не отправлена в CRM");
    return false;
  }

  warnIfMixedContent(url, "CRM");

  const body: CrmLeadPayload = {
    ...utmFromLocation(),
    ...payload,
    consent_personal_data: true,
    website: "",
    page_url: payload.page_url ?? (typeof window !== "undefined" ? window.location.href : undefined),
  };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(body),
    });
    const data = (await res.json().catch(() => ({}))) as { success?: boolean; detail?: string; message?: string };
    if (!res.ok || data.success === false) {
      console.error("[crm] lead failed", res.status, data);
      return false;
    }
    console.info("[crm] lead saved", data);
    return true;
  } catch (err) {
    console.error("[crm] lead unreachable", err);
    return false;
  }
}
