import { courses as defaultCourses, type Course } from "@/data/courses";

export type CoursePatch = Partial<
  Pick<Course, "spotsLeft" | "nextDate" | "hasDate" | "price" | "totalSpots" | "title" | "shortTitle">
>;

const PATCHES_KEY = "ermak_course_patches";

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
  const patches = getCoursePatches();
  return base.map((c) => ({ ...c, ...(patches[c.id] || {}) }));
}
