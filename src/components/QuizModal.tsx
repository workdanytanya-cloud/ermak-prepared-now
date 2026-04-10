import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertTriangle } from "lucide-react";

const questions = [
  {
    q: "Вы знаете, как остановить сильное кровотечение?",
    options: ["Да, уверенно", "Примерно представляю", "Нет"],
    scores: [2, 1, 0],
  },
  {
    q: "Что вы сделаете, если рядом человек потерял сознание?",
    options: ["Проверю дыхание и вызову скорую", "Вызову скорую", "Растеряюсь"],
    scores: [2, 1, 0],
  },
  {
    q: "Как вы поступите при нападении на улице?",
    options: ["Знаю, как действовать", "Попытаюсь убежать", "Не знаю"],
    scores: [2, 1, 0],
  },
  {
    q: "Есть ли у вас аптечка в машине, и знаете ли вы, как ей пользоваться?",
    options: ["Да, и умею применять", "Есть, но не уверен", "Нет аптечки"],
    scores: [2, 1, 0],
  },
  {
    q: "Как давно вы проходили обучение по первой помощи?",
    options: ["Менее года назад", "Более 3 лет назад", "Никогда"],
    scores: [2, 1, 0],
  },
];

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete?: () => void;
}

const QuizModal = ({ open, onOpenChange, onComplete }: Props) => {
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const handleAnswer = (scoreVal: number) => {
    const newScore = score + scoreVal;
    setScore(newScore);
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      setFinished(true);
    }
  };

  const reset = () => {
    setStep(0);
    setScore(0);
    setFinished(false);
  };

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  const getResult = () => {
    if (score >= 8) return { icon: CheckCircle, color: "text-primary", title: "Хорошая подготовка!", text: "Но навыки нужно поддерживать. Приходите на продвинутые курсы." };
    if (score >= 4) return { icon: AlertTriangle, color: "text-accent", title: "Есть пробелы", text: "Вы знаете основы, но в реальной ситуации этого может не хватить. Рекомендуем базовый курс." };
    return { icon: AlertTriangle, color: "text-destructive", title: "Вы не готовы", text: "В критической ситуации вы можете растеряться. Это можно исправить — начните с курса первой помощи." };
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-card border-border max-w-lg">
        <AnimatePresence mode="wait">
          {!finished ? (
            <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
              <div className="mb-2 flex justify-between items-center">
                <DialogTitle className="text-xs text-muted-foreground font-body font-normal">Вопрос {step + 1} из {questions.length}</DialogTitle>
                <div className="h-1 flex-1 ml-4 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary transition-all duration-300 rounded-full" style={{ width: `${((step + 1) / questions.length) * 100}%` }} />
                </div>
              </div>
              <h3 className="font-heading text-xl text-foreground mt-4 mb-6">{questions[step].q}</h3>
              <div className="space-y-3">
                {questions[step].options.map((opt, i) => (
                  <Button key={i} variant="outline" onClick={() => handleAnswer(questions[step].scores[i])} className="w-full justify-start text-left h-auto py-3 px-4 bg-secondary border-border text-foreground hover:bg-muted hover:border-primary/50 font-body transition-all">
                    {opt}
                  </Button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-4">
              {(() => {
                const r = getResult();
                return (
                  <>
                    <r.icon className={`w-16 h-16 mx-auto mb-4 ${r.color}`} />
                    <DialogTitle className="font-heading text-2xl text-foreground mb-2">{r.title}</DialogTitle>
                    <p className="text-muted-foreground mb-6">{r.text}</p>
                    <Button onClick={() => { handleClose(); onComplete?.(); }} className="bg-cta-gradient text-accent-foreground font-heading shadow-cta">
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
