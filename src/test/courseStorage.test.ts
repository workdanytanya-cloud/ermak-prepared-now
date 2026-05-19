import { describe, it, expect, beforeEach } from "vitest";
import { courses } from "@/data/courses";
import { mergeCourses, getCoursePatches, setCoursePatches } from "@/lib/courseStorage";
import { courseShowsFixedDate } from "@/lib/courseDate";

describe("tactical-training date", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("never shows fixed date in source data", () => {
    const course = courses.find((c) => c.id === "tactical-training")!;
    expect(course.hasDate).toBe(false);
    expect(courseShowsFixedDate(course)).toBe(false);
  });

  it("ignores localStorage patch that re-enables date", () => {
    setCoursePatches({
      "tactical-training": {
        hasDate: true,
        nextDate: "16–17 мая 2026 (штурм + окопы)",
      },
    });

    const merged = mergeCourses(courses).find((c) => c.id === "tactical-training")!;
    expect(merged.hasDate).toBe(false);
    expect(courseShowsFixedDate(merged)).toBe(false);
    expect(merged.nextDate).not.toContain("май 2026");
  });
});
