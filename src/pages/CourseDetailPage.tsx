import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { courses, levelLabels, categoryLabels } from "@/data/courses";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Clock, Users, ChevronRight, ArrowLeft, CheckCircle, AlertTriangle, Calendar, CalendarSearch, Shirt, MapPin, Award, Tag } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import BookingForm from "@/components/BookingForm";
import CourseCard from "@/components/CourseCard";
import { toast } from "sonner";

const CourseDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const course = courses.find(c => c.id === id);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [dateDialogOpen, setDateDialogOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const [dateSubmitted, setDateSubmitted] = useState(false);

  if (!course) {
    return (
      <div className="min-h-screen pt-32 text-center">
        <h1 className="font-heading text-3xl text-foreground">Курс не найден</h1>
        <Link to="/courses"><Button className="mt-4" variant="outline">К каталогу</Button></Link>
      </div>
    );
  }

  const related = courses.filter(c => c.category === course.category && c.id !== course.id).slice(0, 3);

  const handleDateInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) { toast.error("Введите номер телефона"); return; }
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
    setDateSubmitted(true);
    setPhone("");
  };

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-4">
        <AnimatedSection>
          <button onClick={() => navigate(-1)} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Назад
          </button>
        </AnimatedSection>

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
                  <CheckCircle className="w-5 h-5 text-primary" /> Результат курса
                </h3>
                <p className="text-foreground">{course.result}</p>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.1}>
              <h2 className="font-heading text-2xl font-bold text-foreground mb-6">Программа курса</h2>
              <div className="space-y-3 mb-12">
                {course.program.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 bg-card-gradient border border-border rounded-lg">
                    <span className="text-sm font-heading text-primary font-bold shrink-0">{String(i + 1).padStart(2, "0")}</span>
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
                    <ChevronRight className="w-4 h-4 text-primary shrink-0" /> {item}
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

            {/* EQUIPMENT */}
            {course.equipment && course.equipment.length > 0 && (
              <AnimatedSection delay={0.25}>
                <div className="bg-card-gradient border border-border rounded-lg p-6 mb-12">
                  <h2 className="font-heading text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                    <Shirt className="w-5 h-5 text-primary" /> Что взять с собой
                  </h2>
                  <ul className="space-y-2">
                    {course.equipment.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-foreground text-sm">
                        <ChevronRight className="w-4 h-4 text-primary shrink-0 mt-0.5" /> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </AnimatedSection>
            )}

            {/* INCLUDES */}
            {course.includes && course.includes.length > 0 && (
              <AnimatedSection delay={0.3}>
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 mb-12">
                  <h3 className="font-heading text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                    <Tag className="w-5 h-5 text-primary" /> Включено в стоимость
                  </h3>
                  <ul className="space-y-2">
                    {course.includes.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-foreground text-sm">
                        <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" /> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </AnimatedSection>
            )}
          </div>

          {/* SIDEBAR */}
          <div className="lg:col-span-1">
            <AnimatedSection delay={0.1}>
              <div className="sticky top-24 bg-card-gradient border border-border rounded-lg p-6 space-y-6">
                <div>
                  <span className="text-4xl font-heading font-bold text-foreground">{course.price.toLocaleString("ru-RU")} ₽</span>
                  {course.priceNote && (
                    <p className="text-xs text-muted-foreground mt-1">{course.priceNote}</p>
                  )}
                  {course.installment && (
                    <p className="text-xs text-primary mt-1">Доступна без% рассрочка 6/12 мес.</p>
                  )}
                  {course.discount && (
                    <p className="text-xs text-accent mt-1">{course.discount}</p>
                  )}
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="w-4 h-4 text-primary" /> {course.duration}
                  </div>
                  {course.schedule && (
                    <div className="flex items-start gap-2 text-muted-foreground text-xs">
                      <Clock className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" /> {course.schedule}
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="w-4 h-4 text-primary" /> {course.format}
                  </div>
                  {course.hasDate ? (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-4 h-4 text-primary" /> {course.nextDate}
                    </div>
                  ) : (
                    <button
                      onClick={() => { setDateDialogOpen(true); setDateSubmitted(false); }}
                      className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
                    >
                      <CalendarSearch className="w-4 h-4" /> Уточнить дату
                    </button>
                  )}
                  {course.location && (
                    <div className="flex items-start gap-2 text-muted-foreground text-xs">
                      <MapPin className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" /> {course.location}
                    </div>
                  )}
                  {course.certificate && (
                    <div className="flex items-start gap-2 text-muted-foreground text-xs">
                      <Award className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" /> {course.certificate}
                    </div>
                  )}
                </div>

                {course.spotsLeft <= 5 && (
                  <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 text-center">
                    <span className="text-sm text-destructive font-semibold">Осталось {course.spotsLeft} мест!</span>
                  </div>
                )}

                <Button onClick={() => setBookingOpen(true)} className="w-full bg-cta-gradient text-accent-foreground font-heading text-lg tracking-wider shadow-cta hover:opacity-90 animate-pulse-glow py-6">
                  Забронировать место
                </Button>
                <Button variant="outline" onClick={() => setBookingOpen(true)} className="w-full border-primary/30 text-foreground hover:bg-primary/10 font-heading tracking-wider">
                  Оплатить
                </Button>

                <p className="text-xs text-muted-foreground text-center">Предоплата гарантирует ваше место в группе</p>
              </div>
            </AnimatedSection>
          </div>
        </div>

        {/* RELATED */}
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

      <BookingForm open={bookingOpen} onOpenChange={setBookingOpen} preselectedCourse={course.id} />

      <Dialog open={dateDialogOpen} onOpenChange={setDateDialogOpen}>
        <DialogContent className="bg-card border-border max-w-sm">
          {dateSubmitted ? (
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
    </div>
  );
};

export default CourseDetailPage;
