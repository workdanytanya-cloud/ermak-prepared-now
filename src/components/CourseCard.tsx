import { useState } from "react";
import { Link } from "react-router-dom";
import { Clock, Users, ArrowRight, CalendarSearch } from "lucide-react";
import type { Course } from "@/data/courses";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useLeadUi } from "@/contexts/LeadUiContext";
import { saveApplication } from "@/lib/leads";

interface Props {
  course: Course;
  lightMode?: boolean;
}

const CourseCard = ({ course, lightMode }: Props) => {
  const { openBooking } = useLeadUi();
  const [dateDialogOpen, setDateDialogOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const forWhomShort = course.forWhom[0] ?? "Подходит под разные задачи";
  const scarcity =
    course.spotsLeft <= 3
      ? "Набор почти закрыт"
      : course.spotsLeft <= 5
        ? `Осталось ${course.spotsLeft} места`
        : null;

  const handleDateInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) {
      toast.error("Введите номер телефона");
      return;
    }
    saveApplication({
      name: "Запрос даты",
      phone: phone.trim(),
      course: course.title,
      date: new Date().toLocaleDateString("ru-RU"),
      status: "new",
      comments: [`Запрос даты: ${course.title}`],
    });
    setSubmitted(true);
    setPhone("");
  };

  return (
    <>
      <div
        className={`group border rounded-lg overflow-hidden transition-all duration-300 flex flex-col min-h-[480px] hover:-translate-y-0.5 hover:shadow-glow ${
          lightMode
            ? "bg-white border-[hsl(40,5%,80%)] hover:border-[hsl(38,90%,50%)]/45"
            : "bg-card-gradient border-border hover:border-accent/35"
        }`}
      >
        <div className="relative h-40 sm:h-44 overflow-hidden flex items-center justify-center bg-muted shrink-0">
          <img
            src={course.image}
            alt={course.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
          {scarcity && (
            <div className="absolute top-3 right-3">
              <Badge
                className={`text-[10px] font-heading tracking-wide uppercase ${
                  course.spotsLeft <= 3 ? "bg-destructive text-destructive-foreground" : "bg-accent text-accent-foreground"
                }`}
              >
                {scarcity}
              </Badge>
            </div>
          )}
        </div>

        <div className="p-4 sm:p-5 flex flex-col flex-1">
          <h3
            className={`font-heading text-base sm:text-lg font-semibold mb-1 leading-tight line-clamp-2 ${
              lightMode ? "text-civil" : "text-foreground"
            }`}
          >
            {course.title}
          </h3>
          <p className={`text-[11px] sm:text-xs mb-2 font-medium uppercase tracking-wide ${lightMode ? "text-accent" : "text-accent"}`}>
            Для кого: <span className={`font-body normal-case ${lightMode ? "text-civil-muted" : "text-muted-foreground"}`}>{forWhomShort}</span>
          </p>
          <p className={`text-xs sm:text-sm mb-3 line-clamp-2 flex-1 leading-relaxed ${lightMode ? "text-civil-muted" : "text-muted-foreground"}`}>
            <span className={`font-heading text-[10px] uppercase tracking-wider ${lightMode ? "text-civil" : "text-foreground"}`}>Результат: </span>
            {course.result}
          </p>

          <div
            className={`flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] sm:text-xs mb-3 ${lightMode ? "text-civil-muted" : "text-muted-foreground"}`}
          >
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 shrink-0" /> {course.duration}
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 shrink-0" /> {course.format}
            </span>
          </div>

          <div className="mt-auto space-y-3">
            <div className="flex items-end justify-between gap-2">
              <div className="min-w-0">
                <span className={`text-lg sm:text-xl font-heading font-bold text-accent`}>{course.price.toLocaleString("ru-RU")} ₽</span>
                {course.totalSpots != null && (
                  <span className={`text-[10px] block ${lightMode ? "text-civil-muted" : "text-muted-foreground"}`}>
                    Осталось {course.spotsLeft} из {course.totalSpots} мест
                  </span>
                )}
                {course.hasDate ? (
                  <span className={`text-xs block mt-0.5 ${lightMode ? "text-civil-muted" : "text-muted-foreground"}`}>{course.nextDate}</span>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setDateDialogOpen(true);
                      setSubmitted(false);
                    }}
                    className="text-xs text-primary hover:text-accent transition-colors flex items-center gap-1 mt-1"
                  >
                    <CalendarSearch className="w-3 h-3" /> Уточнить дату
                  </button>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Button
                type="button"
                size="sm"
                className="w-full bg-cta-gradient text-accent-foreground font-heading tracking-wider shadow-cta hover:opacity-95 transition-opacity"
                onClick={() => openBooking(course.id)}
              >
                Записаться
              </Button>
              <Link to={`/course/${course.id}`} className="w-full">
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  className={`w-full font-heading tracking-wide border border-transparent hover:border-border ${
                    lightMode ? "text-civil hover:bg-black/5" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Подробнее <ArrowRight className="w-3.5 h-3.5 ml-1 opacity-70" />
                </Button>
              </Link>
            </div>
          </div>

          {course.installment && (
            <p className="text-[10px] text-muted-foreground text-center mt-2">Доступна без% рассрочка</p>
          )}
        </div>
      </div>

      <Dialog open={dateDialogOpen} onOpenChange={setDateDialogOpen}>
        <DialogContent className="bg-card border-border max-w-sm data-[state=open]:animate-in data-[state=open]:zoom-in-95 duration-200">
          {submitted ? (
            <div className="text-center py-6">
              <DialogTitle className="font-heading text-xl text-foreground mb-3">Заявка отправлена</DialogTitle>
              <p className="text-sm text-muted-foreground">Мы отправим вам ближайшую дату курса на указанный телефон.</p>
              <Button onClick={() => setDateDialogOpen(false)} className="mt-4 bg-cta-gradient text-accent-foreground font-heading shadow-cta">
                Хорошо
              </Button>
            </div>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle className="font-heading text-lg text-foreground">Уточнить дату: {course.shortTitle}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleDateInquiry} className="space-y-4 mt-2">
                <Input
                  placeholder="Ваш телефон"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                />
                <Button type="submit" className="w-full bg-cta-gradient text-accent-foreground font-heading tracking-wider shadow-cta hover:opacity-90">
                  Узнать дату
                </Button>
              </form>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CourseCard;
