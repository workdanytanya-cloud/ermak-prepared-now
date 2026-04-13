import type { Course } from "@/data/courses";

export type QuizAudience = "self" | "family" | "work" | "service";
export type QuizExperience = "none" | "basic" | "advanced";
export type QuizPriority = "first-aid" | "safety" | "fire" | "tactics";
export type QuizUrgency = "soon" | "researching";

export type CourseQuizAnswers = {
  audience: QuizAudience | null;
  experience: QuizExperience | null;
  priority: QuizPriority | null;
  urgency: QuizUrgency | null;
};

function add(scores: Record<string, number>, ids: string[], w: number) {
  for (const id of ids) {
    if (scores[id] != null) scores[id] += w;
  }
}

export function scoreCoursesByQuiz(answers: CourseQuizAnswers, list: Course[]): Record<string, number> {
  const scores: Record<string, number> = {};
  for (const c of list) scores[c.id] = 0;

  if (answers.audience) {
    switch (answers.audience) {
      case "self":
        add(scores, ["first-aid", "women-safety", "pistol", "individual"], 2);
        break;
      case "family":
        add(scores, ["first-aid", "women-safety", "tactical-medicine"], 3);
        break;
      case "work":
        add(scores, ["tactical-medicine", "pistol", "events", "first-aid", "women-safety"], 3);
        break;
      case "service":
        add(scores, ["ak-operator", "tactical-training", "tactical-medicine", "field-intensive", "engineering", "weekend-practice"], 4);
        break;
    }
  }

  if (answers.experience) {
    switch (answers.experience) {
      case "none":
        add(scores, ["first-aid", "women-safety", "ak-operator"], 2);
        break;
      case "basic":
        add(scores, ["tactical-medicine", "pistol", "tactical-training", "engineering"], 2);
        break;
      case "advanced":
        add(scores, ["field-intensive", "engineering", "tactical-training", "weekend-practice", "tactical-medicine"], 3);
        break;
    }
  }

  if (answers.priority) {
    switch (answers.priority) {
      case "first-aid":
        add(scores, ["first-aid", "tactical-medicine"], 5);
        break;
      case "safety":
        add(scores, ["women-safety", "pistol", "individual"], 5);
        break;
      case "fire":
        add(scores, ["ak-operator", "pistol", "weekend-practice"], 5);
        break;
      case "tactics":
        add(scores, ["tactical-training", "field-intensive", "engineering", "events"], 5);
        break;
    }
  }

  if (answers.urgency === "soon") {
    for (const c of list) {
      if (c.hasDate) scores[c.id] += 1;
    }
  }

  return scores;
}

export function pickRecommendedCourses(scores: Record<string, number>, list: Course[]): Course[] {
  return [...list]
    .sort((a, b) => (scores[b.id] ?? 0) - (scores[a.id] ?? 0))
    .slice(0, 5);
}

export function buildQuizReason(course: Course, answers: CourseQuizAnswers): string {
  const parts: string[] = [];
  if (answers.priority === "first-aid" && (course.filterTags.includes("first-aid") || course.filterTags.includes("tactical-medicine"))) {
    parts.push("Уклон в первую помощь и работу в стрессе.");
  }
  if (answers.priority === "safety" && course.filterTags.includes("women-safety")) {
    parts.push("Закрывает личную безопасность в городе и быту.");
  }
  if (answers.priority === "fire" && (course.filterTags.includes("firearms") || course.filterTags.includes("pistol"))) {
    parts.push("Сфокусирован на огневой подготовке и прикладной стрельбе.");
  }
  if (answers.priority === "tactics" && (course.filterTags.includes("tactics") || course.filterTags.includes("field"))) {
    parts.push("Дает тактику и работу в группе / полевой формат.");
  }
  if (answers.audience === "service") {
    parts.push("Подходит под задачи службы и служебной подготовки.");
  }
  if (answers.experience === "none") {
    parts.push("Можно пройти с нуля — программа выстроена от базы.");
  }
  if (parts.length === 0) {
    parts.push("Совпадает с вашими ответами и типовыми задачами ЦСП «ЕРМАК».");
  }
  return parts.join(" ");
}
