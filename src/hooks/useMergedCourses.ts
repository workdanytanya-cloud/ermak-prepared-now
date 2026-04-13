import { useCallback, useEffect, useMemo, useState } from "react";
import { courses as defaultCourses } from "@/data/courses";
import { mergeCourses } from "@/lib/courseStorage";

export function useMergedCourses() {
  const [version, setVersion] = useState(0);
  const bump = useCallback(() => setVersion((v) => v + 1), []);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "ermak_course_patches") bump();
    };
    const onCustom = () => bump();
    window.addEventListener("storage", onStorage);
    window.addEventListener("ermak-courses-updated", onCustom);
    window.addEventListener("focus", onCustom);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("ermak-courses-updated", onCustom);
      window.removeEventListener("focus", onCustom);
    };
  }, [bump]);

  return useMemo(() => mergeCourses(defaultCourses), [version]);
}
