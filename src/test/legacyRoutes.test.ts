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
});
