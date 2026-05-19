import { courses as defaultCourses, type Course } from "@/data/courses";
import { NO_FIXED_DATE_COURSE_IDS } from "@/lib/courseDate";

export type CoursePatch = Partial<
  Pick<Course, "spotsLeft" | "nextDate" | "hasDate" | "price" | "totalSpots" | "title" | "shortTitle">
>;

const PATCHES_KEY = "ermak_course_patches";

function stripDateFieldsFromPatches(patches: Record<string, CoursePatch>): Record<string, CoursePatch> {
  let changed = false;
  const next = { ...patches };

  for (const id of NO_FIXED_DATE_COURSE_IDS) {
    const patch = next[id];
    if (!patch || (!("nextDate" in patch) && !("hasDate" in patch))) continue;

    const { nextDate: _n, hasDate: _h, ...rest } = patch;
    changed = true;
    if (Object.keys(rest).length === 0) {
      delete next[id];
    } else {
      next[id] = rest;
    }
  }

  return changed ? next : patches;
}

function applyCoursePatch(course: Course, patch: CoursePatch): Course {
  if (!NO_FIXED_DATE_COURSE_IDS.has(course.id)) {
    return { ...course, ...patch };
  }
  const { nextDate: _n, hasDate: _h, ...rest } = patch;
  const merged = { ...course, ...rest };
  return { ...merged, hasDate: false, nextDate: "По набору группы" };
}

/** Сбрасывает сохранённые в браузере даты для курсов без фиксированной даты */
export function initCourseStorage() {
  if (typeof localStorage === "undefined") return;

  try {
    const patches = getCoursePatches();
    const cleaned = stripDateFieldsFromPatches(patches);
    if (cleaned !== patches) {
      setCoursePatches(cleaned);
    }
  } catch {
    /* ignore */
  }
}

export function getCoursePatches(): Record<string, CoursePatch> {
  try {
    const raw = localStorage.getItem(PATCHES_KEY);
    if (!raw) return {};
    const p = JSON.parse(raw) as Record<string, CoursePatch>;
    return p && typeof p === "object" ? p : {};
  } catch {
    return {};
  }
}

export function setCoursePatches(patches: Record<string, CoursePatch>) {
  localStorage.setItem(PATCHES_KEY, JSON.stringify(patches));
  window.dispatchEvent(new Event("ermak-courses-updated"));
}

export function updateCoursePatch(id: string, patch: CoursePatch) {
  const all = { ...getCoursePatches(), [id]: { ...getCoursePatches()[id], ...patch } };
  setCoursePatches(all);
}

export function mergeCourses(base: Course[] = defaultCourses): Course[] {
  initCourseStorage();
  const patches = getCoursePatches();
  return base.map((c) => applyCoursePatch(c, patches[c.id] || {}));
}
