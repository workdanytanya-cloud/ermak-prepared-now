import { useMemo, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { categoryLabels, filterTagLabels, type CourseFilterTag } from "@/data/courses";
import CourseCard from "@/components/CourseCard";
import AnimatedSection from "@/components/AnimatedSection";
import StickyBackButton from "@/components/StickyBackButton";
import { Button } from "@/components/ui/button";
import { useMergedCourses } from "@/hooks/useMergedCourses";

const TAG_KEYS = Object.keys(filterTagLabels) as CourseFilterTag[];

const sortModes = [
  { id: "default", label: "По релевантности" },
  { id: "price-asc", label: "Цена ↑" },
  { id: "price-desc", label: "Цена ↓" },
  { id: "date", label: "Ближайшая дата" },
  { id: "format", label: "По формату" },
] as const;

const trackToTags: Record<string, CourseFilterTag[]> = {
  help: ["first-aid", "tactical-medicine"],
  safety: ["women-safety", "pistol"],
  tactical: ["firearms", "tactics", "field"],
};

const CoursesPage = () => {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const list = useMergedCourses();
  const highlightId = params.get("highlight");
  const track = params.get("track");
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const category = params.get("cat") || "all";
  const sort = (params.get("sort") || "default") as (typeof sortModes)[number]["id"];
  const activeTags = new Set((params.get("tags") || "").split(",").filter(Boolean) as CourseFilterTag[]);

  useEffect(() => {
    if (!track || !trackToTags[track]) return;
    const next = new URLSearchParams(params);
    const existing = (next.get("tags") || "").split(",").filter(Boolean);
    const merged = new Set([...existing, ...trackToTags[track]]);
    next.set("tags", [...merged].join(","));
    next.delete("track");
    setParams(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- однократное применение ?track=
  }, [track]);

  useEffect(() => {
    if (!highlightId) return;
    const t = window.setTimeout(() => {
      cardRefs.current[highlightId]?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 300);
    return () => window.clearTimeout(t);
  }, [highlightId, list]);

  const filtered = useMemo(() => {
    let rows = list.filter((c) => {
      if (category !== "all" && c.category !== category) return false;
      if (activeTags.size === 0) return true;
      return [...activeTags].some((t) => c.filterTags.includes(t));
    });

    const parseDateHint = (c: (typeof list)[0]) => {
      if (c.hasDate && /\d{4}/.test(c.nextDate)) return 1;
      if (c.hasDate) return 2;
      return 3;
    };

    rows = [...rows].sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      if (sort === "date") return parseDateHint(a) - parseDateHint(b) || a.nextDate.localeCompare(b.nextDate);
      if (sort === "format") return a.format.localeCompare(b.format, "ru");
      return 0;
    });

    return rows;
  }, [list, category, sort, activeTags]);

  const setTag = (tag: CourseFilterTag) => {
    const next = new URLSearchParams(params);
    const s = new Set(activeTags);
    if (s.has(tag)) s.delete(tag);
    else s.add(tag);
    if (s.size) next.set("tags", [...s].join(","));
    else next.delete("tags");
    setParams(next);
  };

  const clearTags = () => {
    const next = new URLSearchParams(params);
    next.delete("tags");
    setParams(next);
  };

  const setCategory = (c: string) => {
    const next = new URLSearchParams(params);
    if (c === "all") next.delete("cat");
    else next.set("cat", c);
    setParams(next);
  };

  const setSort = (s: string) => {
    const next = new URLSearchParams(params);
    if (s === "default") next.delete("sort");
    else next.set("sort", s);
    setParams(next);
  };

  const categories = ["all", ...Object.keys(categoryLabels)];

  return (
    <div className="min-h-screen pt-24 pb-28 md:pb-20">
      <div className="container mx-auto px-4">
        <StickyBackButton />
        <AnimatedSection>
          <h1 className="font-heading text-4xl md:text-6xl font-bold text-foreground text-center mb-4">
            Каталог <span className="text-gradient">курсов</span>
          </h1>
          <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-10 text-sm md:text-base leading-relaxed">
            Фильтруйте по задаче и формату. Не уверены — на главной есть короткий подбор или кнопка «Подобрать курс».
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.05}>
          <div className="flex flex-wrap gap-2 justify-center mb-6">
            {categories.map((c) => (
              <Button
                key={c}
                type="button"
                variant={category === c ? "default" : "outline"}
                size="sm"
                onClick={() => setCategory(c)}
                className={
                  category === c
                    ? "bg-cta-gradient text-accent-foreground font-heading border-0 shadow-cta"
                    : "border-border text-muted-foreground hover:text-foreground font-heading hover:bg-secondary"
                }
              >
                {c === "all" ? "Все направления" : categoryLabels[c]}
              </Button>
            ))}
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.08}>
          <p className="text-center text-xs uppercase tracking-widest text-muted-foreground font-heading mb-3">Теги</p>
          <div className="flex flex-wrap gap-2 justify-center mb-4 max-w-4xl mx-auto">
            {TAG_KEYS.map((tag) => (
              <Button
                key={tag}
                type="button"
                size="sm"
                variant={activeTags.has(tag) ? "default" : "outline"}
                onClick={() => setTag(tag)}
                className={
                  activeTags.has(tag)
                    ? "bg-accent text-accent-foreground font-heading text-xs h-8"
                    : "border-border text-muted-foreground hover:border-accent/40 text-xs h-8 font-heading"
                }
              >
                {filterTagLabels[tag]}
              </Button>
            ))}
            {activeTags.size > 0 && (
              <Button type="button" size="sm" variant="ghost" onClick={clearTags} className="text-xs h-8 text-muted-foreground">
                Сбросить теги
              </Button>
            )}
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <div className="flex flex-wrap gap-2 justify-center mb-12 items-center">
            <span className="text-xs text-muted-foreground w-full sm:w-auto text-center sm:text-left">Сортировка:</span>
            {sortModes.map((m) => (
              <Button
                key={m.id}
                type="button"
                variant={sort === m.id ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setSort(m.id)}
                className={`text-xs h-8 ${sort === m.id ? "text-foreground bg-secondary" : "text-muted-foreground"}`}
              >
                {m.label}
              </Button>
            ))}
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((course, i) => (
            <AnimatedSection key={course.id} delay={i * 0.04}>
              <div
                ref={(el) => {
                  cardRefs.current[course.id] = el;
                }}
                className={highlightId === course.id ? "ring-2 ring-accent rounded-lg ring-offset-2 ring-offset-background" : ""}
              >
                <CourseCard course={course} />
              </div>
            </AnimatedSection>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 space-y-4">
            <p className="text-muted-foreground text-lg">По выбранным фильтрам курсов нет.</p>
            <Button type="button" variant="outline" onClick={() => navigate("/")} className="font-heading">
              На главную — подобрать курс
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursesPage;
