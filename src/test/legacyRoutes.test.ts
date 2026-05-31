import { describe, it, expect } from "vitest";
import { normalizePathname, resolveLegacyRedirect } from "@/lib/legacyRoutes";

describe("legacyRoutes", () => {
  it("normalizes index.html suffix only", () => {
    expect(normalizePathname("/courses/index.html")).toBe("/courses");
    expect(normalizePathname("/courses/")).toBe("/courses/");
  });

  it("redirects old site URLs", () => {
    expect(resolveLegacyRedirect("/engineeringtraining")).toBe("/course/engineering");
    expect(resolveLegacyRedirect("/deti")).toBe("/courses");
    expect(resolveLegacyRedirect("/samooborona")).toBe("/course/women-safety");
    expect(resolveLegacyRedirect("/o-centre")).toBe("/#about");
    expect(resolveLegacyRedirect("/combattraining")).toBe("/course/ak-operator-military");
  });

  it("does not rewrite modern /course/* URLs", () => {
    expect(resolveLegacyRedirect("/course/women-safety")).toBeNull();
    expect(resolveLegacyRedirect("/course/pistol-civil")).toBeNull();
    expect(resolveLegacyRedirect("/course/field-intensive-civil")).toBeNull();
    expect(resolveLegacyRedirect("/course/first-aid")).toBeNull();
  });
});
