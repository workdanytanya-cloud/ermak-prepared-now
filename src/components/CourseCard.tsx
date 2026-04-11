import { useState } from "react";
import { Link } from "react-router-dom";
import { Clock, Users, ArrowRight, CalendarSearch } from "lucide-react";
import { Course, levelLabels } from "@/data/courses";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { courses } from "@/data/courses";

interface Props {
  course: Course;
  lightMode?: boolean;
}

const CourseCard = ({ course, lightMode }: Props) => {
  const [dateDialogOpen, setDateDialogOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleDateInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) {
      toast.error("Введите номер телефона");
      return;
    }
    const apps = JSON.parse(localStorage.getItem("ermak_applications") || "[]");
    apps.push({
      id: crypto.randomUUID(),
      name: "Запрос даты",
      phone: phone.trim(),
      course: course.title,
      date: new Date().toLocaleDateString("ru-RU"),
      status: "new",
      comments: [`Запрос даты курса: ${course.title}`],
      createdAt: new Date().toISOString(),
    });
    localStorage.setItem("ermak_applications", JSON.stringify(apps));
    setSubmitted(true);
    setPhone("");
  };

  return (
    <>
      <div className={`group border rounded-lg overflow-hidden transition-all duration-300 hover:shadow-glow flex flex-col ${lightMode ? "bg-white border-[hsl(40,5%,80%)] hover:border-[hsl(38,90%,50%)]/50" : "bg-card-gradient border-border hover:border-primary/50"}`}>
        <div className="relative h-48 overflow-hidden flex items-center justify-center bg-muted">
          <img
            src={course.image}
            alt={course.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
          {course.spotsLeft <= 5 && (
            <div className="absolute top-3 right-3">
              <Badge className="bg-destructive text-destructive-foreground text-xs font-body">
                Осталось {course.spotsLeft} мест
              </Badge>
            </div>
          )}
          <Badge className="absolute top-3 left-3 bg-secondary text-secondary-foreground text-xs font-body">
            {levelLabels[course.level]}
          </Badge>
        </div>

        <div className="p-5 flex flex-col flex-1">
          <h3 className="font-heading text-lg font-semibold text-foreground mb-2">{course.title}</h3>
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">{course.result}</p>

          <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {course.duration}</span>
            <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {course.format}</span>
          </div>

          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-xl font-heading font-bold text-foreground">{course.price.toLocaleString("ru-RU")} ₽</span>
              {course.hasDate ? (
                <span className="text-xs text-muted-foreground block">{course.nextDate}</span>
              ) : (
                <button
                  onClick={() => { setDateDialogOpen(true); setSubmitted(false); }}
                  className="text-xs text-primary hover:text-primary/80 transition-colors flex items-center gap-1 mt-0.5"
                >
                  <CalendarSearch className="w-3 h-3" /> Уточнить дату
                </button>
              )}
            </div>
            <Link to={`/course/${course.id}`}>
              <Button size="sm" className="bg-cta-gradient text-accent-foreground font-heading tracking-wider shadow-cta hover:opacity-90 transition-opacity gap-1">
                Подробнее <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>

          {course.installment && (
            <p className="text-[10px] text-primary/70 text-center">Доступна без% рассрочка</p>
          )}
        </div>
      </div>

      <Dialog open={dateDialogOpen} onOpenChange={setDateDialogOpen}>
        <DialogContent className="bg-card border-border max-w-sm">
          {submitted ? (
            <div className="text-center py-6">
              <DialogTitle className="font-heading text-xl text-foreground mb-3">Заявка отправлена!</DialogTitle>
              <p className="text-sm text-muted-foreground">Мы отправим вам ближайшую дату курса на телефон, который вы указали.</p>
              <Button onClick={() => setDateDialogOpen(false)} className="mt-4 bg-cta-gradient text-accent-foreground font-heading shadow-cta">Хорошо</Button>
            </div>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle className="font-heading text-lg text-foreground">Уточнить дату: {course.shortTitle}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleDateInquiry} className="space-y-4 mt-2">
                <Input placeholder="Ваш телефон" type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="bg-input border-border text-foreground placeholder:text-muted-foreground" />
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
