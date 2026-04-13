import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { courses as defaultCourses, levelLabels, categoryLabels } from "@/data/courses";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Clock, Users, ChevronRight, CheckCircle, AlertTriangle, Calendar, CalendarSearch, Shirt, MapPin, Award, Tag } from "lucide-react";
import StickyBackButton from "@/components/StickyBackButton";
import AnimatedSection from "@/components/AnimatedSection";
import CourseCard from "@/components/CourseCard";
import { toast } from "sonner";
import { useLeadUi } from "@/contexts/LeadUiContext";
import { useMergedCourses } from "@/hooks/useMergedCourses";
import { saveApplication } from "@/lib/leads";

const CourseDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const list = useMergedCourses();
  const course = list.find((c) => c.id === id) ?? defaultCourses.find((c) => c.id === id);
  const { openBooking } = useLeadUi();
  const [dateDialogOpen, setDateDialogOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const [dateSubmitted, setDateSubmitted] = useState(false);

  if (!course) {
    return (
      <div className="min-h-screen pt-32 text-center">
        <h1 className="font-heading text-3xl text-foreground">Курс не найден</h1>
        <Link to="/courses">
          <Button className="mt-4" variant="outline">
            К каталогу
          </Button>
        </Link>
      </div>
    );
  }

  const related = list.filter((c) => c.category === course.category && c.id !== course.id).slice(0, 3);

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
      comments: [`Запрос даты курса: ${course.title}`],
    });
    setDateSubmitted(true);
    setPhone("");
  };

  return (
    <div className="min-h-screen pt-24 pb-24 md:pb-20">
      <div className="container mx-auto px-4">
        <StickyBackButton />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <AnimatedSection>
              <div className="relative h-64 md:h-96 rounded-lg overflow-hidden mb-8">
                <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                <div className="absolute bottom-6 left-6 flex gap-2">
                  <Badge className="bg-secondary text-secondary-foreground font-body">{levelLabels[course.level]}</Badge>
                  <Badge className="bg-primary/20 text-primary font-body">{categoryLabels[course.category]}</Badge>
                </div>
              </div>

              <h1 className="font-heading text-3xl md:text-5xl font-bold text-foreground mb-4">{course.title}</h1>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">{course.description}</p>

              <div className="bg-card-gradient border border-primary/20 rounded-lg p-6 mb-8">
                <h3 className="font-heading text-lg text-foreground mb-2 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-accent" /> Результат курса
                </h3>
                <p className="text-foreground leading-relaxed">{course.result}</p>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.1}>
              <h2 className="font-heading text-2xl font-bold text-foreground mb-6">Программа курса</h2>
              <div className="space-y-3 mb-12">
                {course.program.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 bg-card-gradient border border-border rounded-lg">
                    <span className="text-sm font-heading text-accent font-bold shrink-0">{String(i + 1).padStart(2, "0")}</span>
                    <span className="text-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.15}>
              <h2 className="font-heading text-2xl font-bold text-foreground mb-6">Кому подойдёт</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-12">
                {course.forWhom.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-foreground">
                    <ChevronRight className="w-4 h-4 text-accent shrink-0" /> {item}
                  </div>
                ))}
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <h2 className="font-heading text-2xl font-bold text-foreground mb-6">Знакомые проблемы?</h2>
              <div className="space-y-3 mb-12">
                {course.pains.map((pain, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 bg-destructive/5 border border-destructive/20 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                    <span className="text-foreground">{pain}</span>
                  </div>
                ))}
              </div>
            </AnimatedSection>

            {course.equipment && course.equipment.length > 0 && (
              <AnimatedSection delay={0.25}>
                <div className="bg-card-gradient border border-border rounded-lg p-6 mb-12">
                  <h2 className="font-heading text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                    <Shirt className="w-5 h-5 text-accent" /> Что взять с собой
                  </h2>
                  <ul className="space-y-2">
                    {course.equipment.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-foreground text-sm">
                        <ChevronRight className="w-4 h-4 text-accent shrink-0 mt-0.5" /> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </AnimatedSection>
            )}

            {course.includes && course.includes.length > 0 && (
              <AnimatedSection delay={0.3}>
                <div className="bg-accent/5 border border-accent/20 rounded-lg p-6 mb-12">
                  <h3 className="font-heading text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                    <Tag className="w-5 h-5 text-accent" /> Включено в стоимость
                  </h3>
                  <ul className="space-y-2">
                    {course.includes.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-foreground text-sm">
                        <CheckCircle className="w-4 h-4 text-accent shrink-0 mt-0.5" /> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </AnimatedSection>
            )}
          </div>

          <div className="lg:col-span-1">
            <AnimatedSection delay={0.1}>
              <div className="sticky top-24 bg-card-gradient border border-border rounded-lg p-6 space-y-6">
                <div>
                  <span className="text-4xl font-heading font-bold text-accent">{course.price.toLocaleString("ru-RU")} ₽</span>
                  {course.priceNote && <p className="text-xs text-muted-foreground mt-1">{course.priceNote}</p>}
                  {course.installment && <p className="text-xs text-muted-foreground mt-1">Доступна без% рассрочка 6/12 мес.</p>}
                  {course.discount && <p className="text-xs text-accent mt-1">{course.discount}</p>}
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="w-4 h-4 text-accent" /> {course.duration}
                  </div>
                  {course.schedule && (
                    <div className="flex items-start gap-2 text-muted-foreground text-xs">
                      <Clock className="w-3.5 h-3.5 text-accent mt-0.5 shrink-0" /> {course.schedule}
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="w-4 h-4 text-accent" /> {course.format}
                  </div>
                  {course.hasDate ? (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-4 h-4 text-accent" /> {course.nextDate}
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setDateDialogOpen(true);
                        setDateSubmitted(false);
                      }}
                      className="flex items-center gap-2 text-accent hover:text-accent/80 transition-colors"
                    >
                      <CalendarSearch className="w-4 h-4" /> Уточнить дату
                    </button>
                  )}
                  {course.location && (
                    <div className="flex items-start gap-2 text-muted-foreground text-xs">
                      <MapPin className="w-3.5 h-3.5 text-accent mt-0.5 shrink-0" /> {course.location}
                    </div>
                  )}
                  {course.certificate && (
                    <div className="flex items-start gap-2 text-muted-foreground text-xs">
                      <Award className="w-3.5 h-3.5 text-accent mt-0.5 shrink-0" /> {course.certificate}
                    </div>
                  )}
                </div>

                {course.spotsLeft <= 5 && (
                  <div className="bg-destructive/10 border border-destructive/25 rounded-lg p-3 text-center">
                    <span className="text-sm text-destructive font-heading tracking-wide">
                      {course.spotsLeft <= 3 ? "Набор почти закрыт" : `Осталось ${course.spotsLeft} мест`}
                    </span>
                  </div>
                )}

                <Button
                  type="button"
                  onClick={() => openBooking(course.id)}
                  className="w-full bg-cta-gradient text-accent-foreground font-heading text-lg tracking-wider shadow-cta hover:opacity-95 py-6"
                >
                  Записаться
                </Button>
                <Button type="button" variant="outline" onClick={() => navigate("/courses")} className="w-full border-border text-foreground hover:bg-secondary font-heading tracking-wider">
                  Другие курсы
                </Button>

                <p className="text-xs text-muted-foreground text-center leading-relaxed">Предоплата фиксирует место в группе — детали согласуем по телефону.</p>
              </div>
            </AnimatedSection>
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-20">
            <AnimatedSection>
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-8">Похожие курсы</h2>
            </AnimatedSection>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((c, i) => (
                <AnimatedSection key={c.id} delay={i * 0.1}>
                  <CourseCard course={c} />
                </AnimatedSection>
              ))}
            </div>
          </div>
        )}
      </div>

      <Dialog open={dateDialogOpen} onOpenChange={setDateDialogOpen}>
        <DialogContent className="bg-card border-border max-w-sm">
          {dateSubmitted ? (
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
    </div>
  );
};

export default CourseDetailPage;
