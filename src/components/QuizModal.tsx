import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertTriangle, Shield, Heart } from "lucide-react";
import { Link } from "react-router-dom";

type Direction = "civil" | "military" | null;

interface QuizQuestion {
  q: string;
  options: { label: string; civil: number; military: number; skill: number }[];
}

const directionQuestion = {
  q: "Какое направление подготовки вас интересует?",
  options: [
    { label: "Гражданское — защита себя и близких в повседневной жизни", value: "civil" as Direction },
    { label: "Силовое — профессиональная тактическая подготовка", value: "military" as Direction },
  ],
};

const civilQuestions: QuizQuestion[] = [
  {
    q: "Вы умеете остановить артериальное кровотечение с помощью жгута или турникета?",
    options: [
      { label: "Да, отрабатывал(а) на практике", civil: 3, military: 0, skill: 3 },
      { label: "Знаю теорию, но не практиковал(а)", civil: 1, military: 0, skill: 1 },
      { label: "Нет, не владею этим навыком", civil: 0, military: 0, skill: 0 },
    ],
  },
  {
    q: "Как вы поступите, если при вас человек потерял сознание и не дышит?",
    options: [
      { label: "Начну СЛР и попрошу вызвать скорую", civil: 3, military: 0, skill: 3 },
      { label: "Вызову скорую и буду ждать", civil: 1, military: 0, skill: 1 },
      { label: "Не знаю алгоритм действий", civil: 0, military: 0, skill: 0 },
    ],
  },
  {
    q: "Есть ли у вас навыки безопасного поведения при нападении или угрозе?",
    options: [
      { label: "Проходил(а) курсы самообороны / безопасности", civil: 3, military: 0, skill: 3 },
      { label: "Интуитивно, без подготовки", civil: 1, military: 0, skill: 1 },
      { label: "Нет, растеряюсь", civil: 0, military: 0, skill: 0 },
    ],
  },
  {
    q: "Какой формат обучения вам ближе?",
    options: [
      { label: "Короткий интенсив на 1–2 дня", civil: 1, military: 0, skill: 0 },
      { label: "Развёрнутый курс с отработкой навыков", civil: 2, military: 0, skill: 0 },
      { label: "Индивидуальная тренировка под мои задачи", civil: 3, military: 0, skill: 0 },
    ],
  },
];

const militaryQuestions: QuizQuestion[] = [
  {
    q: "Какой у вас опыт обращения с оружием?",
    options: [
      { label: "Регулярная практика, уверенно владею", civil: 0, military: 3, skill: 3 },
      { label: "Базовый опыт (срочная служба / стрельбище)", civil: 0, military: 1, skill: 1 },
      { label: "Без опыта обращения", civil: 0, military: 0, skill: 0 },
    ],
  },
  {
    q: "Знакомы ли вам протоколы тактической медицины (TCCC/ТССС)?",
    options: [
      { label: "Да, проходил подготовку и отрабатывал", civil: 0, military: 3, skill: 3 },
      { label: "Слышал, но не практиковал", civil: 0, military: 1, skill: 1 },
      { label: "Нет, не знаком", civil: 0, military: 0, skill: 0 },
    ],
  },
  {
    q: "Есть ли у вас опыт действий в составе группы (тактика, слаживание)?",
    options: [
      { label: "Да, проходил тактическую подготовку", civil: 0, military: 3, skill: 3 },
      { label: "Только базовые навыки из армии", civil: 0, military: 1, skill: 1 },
      { label: "Нет опыта", civil: 0, military: 0, skill: 0 },
    ],
  },
  {
    q: "Какая задача для вас приоритетна?",
    options: [
      { label: "Подготовка к контракту / командировке", civil: 0, military: 3, skill: 0 },
      { label: "Повышение квалификации (действующий сотрудник)", civil: 0, military: 2, skill: 2 },
      { label: "Базовая подготовка с нуля", civil: 0, military: 1, skill: 0 },
    ],
  },
];

const getCivilRecommendation = (skill: number) => {
  if (skill >= 9) return { title: "Высокий уровень", text: "Вы уже владеете базовыми навыками. Рекомендуем продвинутые форматы для закрепления.", courses: ["tactical-medicine", "pistol", "individual"], color: "text-primary" };
  if (skill >= 4) return { title: "Средний уровень", text: "Есть основа, но пробелы могут стоить дорого. Начните с практического курса.", courses: ["first-aid", "women-safety", "weekend-practice"], color: "text-accent" };
  return { title: "Начальный уровень", text: "Вы не готовы к экстренной ситуации. Это нормально — и это можно исправить.", courses: ["first-aid", "women-safety"], color: "text-destructive" };
};

const getMilitaryRecommendation = (skill: number) => {
  if (skill >= 9) return { title: "Продвинутый уровень", text: "Вы имеете серьёзную подготовку. Рекомендуем интенсивные форматы.", courses: ["field-intensive", "tactical-training", "engineering"], color: "text-primary" };
  if (skill >= 4) return { title: "Базовый уровень", text: "Есть фундамент, но навыки нужно довести до автоматизма.", courses: ["ak-operator", "tactical-medicine", "pistol"], color: "text-accent" };
  return { title: "Начальный уровень", text: "Начните с базовых курсов — они дадут необходимый минимум.", courses: ["ak-operator", "tactical-medicine", "weekend-practice"], color: "text-destructive" };
};

import { courses } from "@/data/courses";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete?: () => void;
}

const QuizModal = ({ open, onOpenChange, onComplete }: Props) => {
  const [direction, setDirection] = useState<Direction>(null);
  const [step, setStep] = useState(0);
  const [skill, setSkill] = useState(0);
  const [finished, setFinished] = useState(false);

  const currentQuestions = direction === "civil" ? civilQuestions : militaryQuestions;

  const handleDirectionSelect = (dir: Direction) => {
    setDirection(dir);
    setStep(0);
    setSkill(0);
  };

  const handleAnswer = (option: { skill: number }) => {
    const newSkill = skill + option.skill;
    setSkill(newSkill);
    if (step < currentQuestions.length - 1) {
      setStep(step + 1);
    } else {
      setFinished(true);
    }
  };

  const reset = () => {
    setDirection(null);
    setStep(0);
    setSkill(0);
    setFinished(false);
  };

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  const getResult = () => {
    return direction === "civil" ? getCivilRecommendation(skill) : getMilitaryRecommendation(skill);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-card border-border max-w-lg">
        <AnimatePresence mode="wait">
          {!direction ? (
            <motion.div key="direction" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <DialogTitle className="font-heading text-xl text-foreground mb-2">Оценка готовности</DialogTitle>
              <p className="text-muted-foreground text-sm mb-6">Выберите направление, чтобы определить ваш уровень подготовки</p>
              <div className="space-y-3">
                {directionQuestion.options.map((opt) => (
                  <Button
                    key={opt.value}
                    variant="outline"
                    onClick={() => handleDirectionSelect(opt.value)}
                    className="w-full justify-start text-left h-auto py-4 px-4 bg-secondary border-border text-foreground hover:bg-muted hover:border-primary/50 font-body transition-all"
                  >
                    <div className="flex items-center gap-3">
                      {opt.value === "civil" ? <Heart className="w-5 h-5 text-accent shrink-0" /> : <Shield className="w-5 h-5 text-primary shrink-0" />}
                      <span>{opt.label}</span>
                    </div>
                  </Button>
                ))}
              </div>
            </motion.div>
          ) : !finished ? (
            <motion.div key={`q-${step}`} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
              <div className="mb-2 flex justify-between items-center">
                <DialogTitle className="text-xs text-muted-foreground font-body font-normal">
                  {direction === "civil" ? "Гражданское" : "Силовое"} • Вопрос {step + 1} из {currentQuestions.length}
                </DialogTitle>
                <div className="h-1 flex-1 ml-4 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary transition-all duration-300 rounded-full" style={{ width: `${((step + 1) / currentQuestions.length) * 100}%` }} />
                </div>
              </div>
              <h3 className="font-heading text-xl text-foreground mt-4 mb-6">{currentQuestions[step].q}</h3>
              <div className="space-y-3">
                {currentQuestions[step].options.map((opt, i) => (
                  <Button key={i} variant="outline" onClick={() => handleAnswer(opt)} className="w-full justify-start text-left h-auto py-3 px-4 bg-secondary border-border text-foreground hover:bg-muted hover:border-primary/50 font-body transition-all">
                    {opt.label}
                  </Button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="py-4">
              {(() => {
                const r = getResult();
                const Icon = r.color === "text-destructive" ? AlertTriangle : CheckCircle;
                const recommendedCourses = courses.filter(c => r.courses.includes(c.id));
                return (
                  <>
                    <Icon className={`w-14 h-14 mx-auto mb-4 ${r.color}`} />
                    <DialogTitle className="font-heading text-2xl text-foreground mb-2 text-center">{r.title}</DialogTitle>
                    <p className="text-muted-foreground mb-6 text-center">{r.text}</p>
                    <p className="font-heading text-sm text-foreground mb-3">Рекомендуемые курсы:</p>
                    <div className="space-y-2 mb-6">
                      {recommendedCourses.map(c => (
                        <Link key={c.id} to={`/course/${c.id}`} onClick={handleClose} className="block bg-secondary border border-border rounded-md p-3 hover:border-primary/50 transition-all">
                          <p className="font-heading text-sm text-foreground">{c.title}</p>
                          <p className="text-xs text-muted-foreground mt-1">{c.price}</p>
                        </Link>
                      ))}
                    </div>
                    <Button onClick={() => { handleClose(); onComplete?.(); }} className="w-full bg-cta-gradient text-accent-foreground font-heading shadow-cta">
                      Записаться на курс
                    </Button>
                  </>
                );
              })()}
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};

export default QuizModal;
