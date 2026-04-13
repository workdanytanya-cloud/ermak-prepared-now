import type { Application } from "@/data/applications";

const STORAGE_KEY = "ermak_applications";

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
  const apps = loadApplications();
  apps.push(full);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(apps));

  const webhook = import.meta.env.VITE_LEADS_WEBHOOK_URL as string | undefined;
  if (webhook) {
    fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "ermak_lead",
        ...full,
      }),
    }).catch(() => {});
  }

  return full;
}
