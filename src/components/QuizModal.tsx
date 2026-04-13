import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useMergedCourses } from "@/hooks/useMergedCourses";
import {
  buildQuizReason,
  scoreCoursesByQuiz,
  pickRecommendedCourses,
  type CourseQuizAnswers,
} from "@/lib/courseQuizEngine";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRequestBooking: (courseId?: string) => void;
}

const steps = ["audience", "experience", "priority", "urgency"] as const;

const QuizModal = ({ open, onOpenChange, onRequestBooking }: Props) => {
  const courses = useMergedCourses();
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<CourseQuizAnswers>({
    audience: null,
    experience: null,
    priority: null,
    urgency: null,
  });
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (open) {
      setStepIndex(0);
      setAnswers({ audience: null, experience: null, priority: null, urgency: null });
      setFinished(false);
    }
  }, [open]);

  const scores = useMemo(() => scoreCoursesByQuiz(answers, courses), [answers, courses]);
  const ranked = useMemo(() => pickRecommendedCourses(scores, courses), [scores, courses]);
  const primary = ranked[0];
  const alternates = ranked.slice(1, 4);
  const reason = primary ? buildQuizReason(primary, answers) : "";

  const reset = () => {
    setStepIndex(0);
    setAnswers({ audience: null, experience: null, priority: null, urgency: null });
    setFinished(false);
  };

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  const setStep = (key: keyof CourseQuizAnswers, value: NonNullable<CourseQuizAnswers[typeof key]>) => {
    setAnswers((a) => ({ ...a, [key]: value }));
    if (stepIndex < steps.length - 1) {
      setStepIndex((i) => i + 1);
    } else {
      setFinished(true);
    }
  };

  const currentKey = steps[stepIndex];

  return (
    <Dialog open={open} onOpenChange={(v) => (v ? onOpenChange(true) : handleClose())}>
      <DialogContent className="bg-card border-border max-w-lg data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 duration-200">
        <AnimatePresence mode="wait">
          {!finished ? (
            <motion.div
              key={currentKey}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.2 }}
            >
              <div className="mb-3 flex items-center gap-3">
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-heading">
                  Подбор курса · {stepIndex + 1}/{steps.length}
                </span>
                <div className="h-1 flex-1 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent transition-all duration-300 rounded-full"
                    style={{ width: `${((stepIndex + 1) / steps.length) * 100}%` }}
                  />
                </div>
              </div>

              {currentKey === "audience" && (
                <>
                  <DialogTitle className="font-heading text-xl text-foreground mb-4 pr-8">Для кого нужен курс?</DialogTitle>
                  <div className="space-y-2">
                    {(
                      [
                        { id: "self" as const, label: "Для себя" },
                        { id: "family" as const, label: "Для семьи" },
                        { id: "work" as const, label: "Для работы" },
                        { id: "service" as const, label: "Для службы" },
                      ] as const
                    ).map((o) => (
                      <Button
                        key={o.id}
                        type="button"
                        variant="outline"
                        className="w-full justify-start h-auto py-3 px-4 text-left bg-secondary/50 border-border hover:border-accent/50 hover:bg-secondary transition-all"
                        onClick={() => setStep("audience", o.id)}
                      >
                        {o.label}
                      </Button>
                    ))}
                  </div>
                </>
              )}

              {currentKey === "experience" && (
                <>
                  <DialogTitle className="font-heading text-xl text-foreground mb-4 pr-8">Есть ли опыт?</DialogTitle>
                  <div className="space-y-2">
                    {(
                      [
                        { id: "none" as const, label: "Нет, начинаю с нуля" },
                        { id: "basic" as const, label: "Базовый (служба, разовые тренировки)" },
                        { id: "advanced" as const, label: "Уже занимался(лась) системно" },
                      ] as const
                    ).map((o) => (
                      <Button
                        key={o.id}
                        type="button"
                        variant="outline"
                        className="w-full justify-start h-auto py-3 px-4 text-left bg-secondary/50 border-border hover:border-accent/50 hover:bg-secondary transition-all"
                        onClick={() => setStep("experience", o.id)}
                      >
                        {o.label}
                      </Button>
                    ))}
                  </div>
                </>
              )}

              {currentKey === "priority" && (
                <>
                  <DialogTitle className="font-heading text-xl text-foreground mb-4 pr-8">Что сейчас важнее?</DialogTitle>
                  <div className="space-y-2">
                    {(
                      [
                        { id: "first-aid" as const, label: "Первая помощь в критике" },
                        { id: "safety" as const, label: "Личная безопасность" },
                        { id: "fire" as const, label: "Огневая подготовка" },
                        { id: "tactics" as const, label: "Тактика / выездные интенсивы" },
                      ] as const
                    ).map((o) => (
                      <Button
                        key={o.id}
                        type="button"
                        variant="outline"
                        className="w-full justify-start h-auto py-3 px-4 text-left bg-secondary/50 border-border hover:border-accent/50 hover:bg-secondary transition-all"
                        onClick={() => setStep("priority", o.id)}
                      >
                        {o.label}
                      </Button>
                    ))}
                  </div>
                </>
              )}

              {currentKey === "urgency" && (
                <>
                  <DialogTitle className="font-heading text-xl text-foreground mb-4 pr-8">Насколько срочно хотите попасть?</DialogTitle>
                  <div className="space-y-2">
                    {(
                      [
                        { id: "soon" as const, label: "В ближайшую доступную дату" },
                        { id: "researching" as const, label: "Пока изучаю варианты" },
                      ] as const
                    ).map((o) => (
                      <Button
                        key={o.id}
                        type="button"
                        variant="outline"
                        className="w-full justify-start h-auto py-3 px-4 text-left bg-secondary/50 border-border hover:border-accent/50 hover:bg-secondary transition-all"
                        onClick={() => setStep("urgency", o.id)}
                      >
                        {o.label}
                      </Button>
                    ))}
                  </div>
                </>
              )}
            </motion.div>
          ) : (
            <motion.div key="result" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="py-1">
              <DialogTitle className="font-heading text-xl text-foreground mb-2 text-center">Рекомендуем начать с этого курса</DialogTitle>
              {primary && (
                <>
                  <div className="rounded-lg border border-accent/30 bg-accent/5 p-4 mt-4 mb-3">
                    <p className="font-heading text-lg text-foreground leading-tight">{primary.title}</p>
                    <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{reason}</p>
                    <p className="text-accent font-heading text-xl mt-3">{primary.price.toLocaleString("ru-RU")} ₽</p>
                  </div>
                  <Button
                    type="button"
                    className="w-full bg-cta-gradient text-accent-foreground font-heading shadow-cta hover:opacity-95 mb-2"
                    onClick={() => onRequestBooking(primary.id)}
                  >
                    Оставить заявку
                  </Button>
                  <Link to={`/courses?highlight=${primary.id}`} onClick={handleClose}>
                    <Button type="button" variant="outline" className="w-full border-border text-foreground hover:bg-secondary mb-4">
                      Смотреть все подходящие курсы
                    </Button>
                  </Link>
                  {alternates.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs uppercase tracking-widest text-muted-foreground font-heading">Ещё из подходящих</p>
                      {alternates.map((c) => (
                        <Link
                          key={c.id}
                          to={`/course/${c.id}`}
                          onClick={handleClose}
                          className="block rounded-md border border-border bg-secondary/30 px-3 py-2 text-sm text-foreground hover:border-accent/40 transition-colors"
                        >
                          {c.shortTitle}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};

export default QuizModal;
