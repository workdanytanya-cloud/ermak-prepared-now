import { useState, useMemo } from "react";
import { courses, categoryLabels, levelLabels } from "@/data/courses";
import CourseCard from "@/components/CourseCard";
import AnimatedSection from "@/components/AnimatedSection";
import { Button } from "@/components/ui/button";

const CoursesPage = () => {
  const [category, setCategory] = useState<string>("all");
  const [level, setLevel] = useState<string>("all");

  const filtered = useMemo(() => {
    return courses.filter(c => {
      if (category !== "all" && c.category !== category) return false;
      if (level !== "all" && c.level !== level) return false;
      return true;
    });
  }, [category, level]);

  const categories = ["all", ...Object.keys(categoryLabels)];
  const levels = ["all", ...Object.keys(levelLabels)];

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-4">
        <AnimatedSection>
          <h1 className="font-heading text-4xl md:text-6xl font-bold text-foreground text-center mb-4">
            Каталог <span className="text-gradient">курсов</span>
          </h1>
          <p className="text-muted-foreground text-center max-w-xl mx-auto mb-12">
            Выберите направление и уровень подготовки
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <div className="flex flex-wrap gap-2 justify-center mb-4">
            {categories.map(c => (
              <Button key={c} variant={category === c ? "default" : "outline"} size="sm"
                onClick={() => setCategory(c)}
                className={category === c ? "bg-primary text-primary-foreground font-heading" : "border-border text-muted-foreground hover:text-foreground font-heading"}>
                {c === "all" ? "Все направления" : categoryLabels[c]}
              </Button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 justify-center mb-12">
            {levels.map(l => (
              <Button key={l} variant={level === l ? "default" : "outline"} size="sm"
                onClick={() => setLevel(l)}
                className={level === l ? "bg-primary text-primary-foreground font-heading" : "border-border text-muted-foreground hover:text-foreground font-heading"}>
                {l === "all" ? "Все уровни" : levelLabels[l]}
              </Button>
            ))}
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((course, i) => (
            <AnimatedSection key={course.id} delay={i * 0.05}>
              <CourseCard course={course} />
            </AnimatedSection>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-20">Курсов по выбранным фильтрам не найдено</p>
        )}
      </div>
    </div>
  );
};

export default CoursesPage;
