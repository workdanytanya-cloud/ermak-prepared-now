import type { Course } from "@/data/courses";

/** Курсы без публикации фиксированной даты на сайте */
export const NO_FIXED_DATE_COURSE_IDS = new Set(["tactical-training"]);

const MONTH_INDEX: Record<string, number> = {
  января: 0,
  январь: 0,
  февраля: 1,
  февраль: 1,
  марта: 2,
  март: 2,
  апреля: 3,
  апрель: 3,
  мая: 4,
  май: 4,
  июня: 5,
  июнь: 5,
  июля: 6,
  июль: 6,
  августа: 7,
  август: 7,
  сентября: 8,
  сентябрь: 8,
  октября: 9,
  октябрь: 9,
  ноября: 10,
  ноябрь: 10,
  декабря: 11,
  декабрь: 11,
};

function startOfToday(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function resolveYear(month: number, endDay: number, explicitYear?: number): number {
  if (explicitYear !== undefined) return explicitYear;
  const year = new Date().getFullYear();
  const candidate = new Date(year, month, endDay);
  candidate.setHours(23, 59, 59, 999);
  if (candidate < startOfToday()) return year + 1;
  return year;
}

/** Конец ближайшего периода из строки nextDate (диапазон или одна дата). */
export function parseCourseDateEnd(nextDate: string): Date | null {
  const rangeMatch = nextDate.match(/(\d{1,2})\s*[–-]\s*(\d{1,2})\s+([а-яё]+)(?:\s+(\d{4}))?/i);
  if (rangeMatch) {
    const endDay = Number(rangeMatch[2]);
    const month = MONTH_INDEX[rangeMatch[3].toLowerCase()];
    if (month === undefined) return null;
    const year = resolveYear(month, endDay, rangeMatch[4] ? Number(rangeMatch[4]) : undefined);
    return new Date(year, month, endDay, 23, 59, 59, 999);
  }

  const singleMatch = nextDate.match(/(\d{1,2})\s+([а-яё]+)(?:\s+(\d{4}))?/i);
  if (singleMatch) {
    const day = Number(singleMatch[1]);
    const month = MONTH_INDEX[singleMatch[2].toLowerCase()];
    if (month === undefined) return null;
    const year = resolveYear(month, day, singleMatch[3] ? Number(singleMatch[3]) : undefined);
    return new Date(year, month, day, 23, 59, 59, 999);
  }

  return null;
}

export function isCourseDatePast(course: Pick<Course, "hasDate" | "nextDate">): boolean {
  if (!course.hasDate) return false;
  const end = parseCourseDateEnd(course.nextDate);
  if (!end) return false;
  return end < startOfToday();
}

export function courseShowsFixedDate(course: Pick<Course, "id" | "hasDate" | "nextDate">): boolean {
  if (NO_FIXED_DATE_COURSE_IDS.has(course.id)) return false;
  if (!course.hasDate) return false;
  if (isCourseDatePast(course)) return false;
  return true;
}
