import { describe, expect, it, afterEach, vi } from "vitest";
import { courseShowsFixedDate, isCourseDatePast, parseCourseDateEnd } from "@/lib/courseDate";

describe("parseCourseDateEnd", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("parses date range with year", () => {
    const end = parseCourseDateEnd("20–21 июня 2026");
    expect(end?.getFullYear()).toBe(2026);
    expect(end?.getMonth()).toBe(5);
    expect(end?.getDate()).toBe(21);
  });

  it("parses date range without year using current year", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-05-30T12:00:00"));
    const end = parseCourseDateEnd("10–15 августа");
    expect(end?.getFullYear()).toBe(2026);
    expect(end?.getMonth()).toBe(7);
    expect(end?.getDate()).toBe(15);
  });
});

describe("isCourseDatePast", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns true after course end date", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-22T12:00:00"));
    expect(
      isCourseDatePast({ hasDate: true, nextDate: "20–21 июня 2026" }),
    ).toBe(true);
  });

  it("returns false before course end date", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-10T12:00:00"));
    expect(
      isCourseDatePast({ hasDate: true, nextDate: "20–21 июня 2026" }),
    ).toBe(false);
  });
});

describe("courseShowsFixedDate", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("hides past dates and shows inquiry for tactical-training always", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-22T12:00:00"));
    expect(
      courseShowsFixedDate({
        id: "women-safety",
        hasDate: true,
        nextDate: "20–21 июня 2026",
      }),
    ).toBe(false);
    expect(
      courseShowsFixedDate({
        id: "tactical-training",
        hasDate: true,
        nextDate: "6–7 июня 2026 (лес + здание)",
      }),
    ).toBe(false);
  });
});
