import type { Course } from "@/data/courses";

/** Курсы без публикации фиксированной даты на сайте */
export const NO_FIXED_DATE_COURSE_IDS = new Set(["tactical-training"]);

export function courseShowsFixedDate(course: Pick<Course, "id" | "hasDate">): boolean {
  if (NO_FIXED_DATE_COURSE_IDS.has(course.id)) return false;
  return course.hasDate === true;
}
