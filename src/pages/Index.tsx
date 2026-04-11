import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, Heart, Target, AlertTriangle, ArrowRight, ChevronRight, Star, Phone, Send, Clock, Users, MessageCircle, HelpCircle, X } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import AnimatedSection from "@/components/AnimatedSection";
import CourseCard from "@/components/CourseCard";
import BookingForm from "@/components/BookingForm";
import QuizModal from "@/components/QuizModal";
import { courses } from "@/data/courses";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { motion } from "framer-motion";

const faqData = [
  { q: "Нужен ли опыт, чтобы прийти на курс?", a: "Нет. На базовые форматы можно приходить с нуля. Мы начинаем с простого." },
  { q: "Можно ли прийти без физподготовки?", a: "Можно. Нагрузка дозируется, акцент на правильность действий." },
  { q: "Что брать с собой?", a: "Удобную закрытую одежду, воду, блокнот. Если нужен спецкомплект — отправим список заранее." },
  { q: "Больше теория или практика?", a: "Основа — практика. Объяснение → показ → отработка → разбор → повтор." },
  { q: "Можно ли девушкам?", a: "Да. Есть отдельные форматы и смешанные группы." },
  { q: "Есть ли корпоративные форматы?", a: "Да. Делаем программы для компаний и команд под задачу." },
  { q: "Как записаться?", a: "Кнопка заявки → имя, телефон → мы связываемся и подбираем формат." },
];

const civilCourseIds = ["first-aid", "women-safety", "tactical-medicine", "pistol", "weekend-practice", "individual", "events"];
const militaryCourseIds = ["ak-operator", "tactical-medicine", "tactical-training", "pistol", "engineering", "field-intensive-beginner", "field-intensive-advanced", "weekend-practice", "individual", "events"];

const instructorsData = [
  {
    name: "Данюкин Андрей Игоревич",
    role: "Руководитель ЦСП «ЕРМАК»",
    photo: "/instructor-danyukin.png",
    shortExp: "Профессиональный военный, участник боевых действий. Инструктор по армейской тактической стрельбе.",
    fullExp: "Профессиональный военный, участник боевых действий. Инструктор по армейской тактической стрельбе. Действующий инструктор фонда «Антитеррор» ФСБ России. Стаж работы с детьми более 10 лет. Награждён государственными наградами.",
  },
  {
    name: "Дедов Михаил Владимирович",
    role: "Старший инструктор",
    photo: "/instructor-dedov.jpg",
    shortExp: "Инструкторская деятельность с 2014 года. Участник боевых действий.",
    fullExp: "Инструкторская деятельность с 2014 года. Участник боевых действий. Прошёл курсы: «Партизан Интенсив» (СПб), инструктор «Волк» (Ростов), тактическая медицина (ВМА им. Кирова). Инструктор по тактико-специальной подготовке.",
  },
  {
    name: "Подоксенов Владимир Александрович",
    role: "Инструктор",
    photo: "/instructor-podoksenov.jpg",
    shortExp: "ВМА им. Кирова. Подготовка ТССС (ТАКМЕД), расширенный курс РАТМЕД.",
    fullExp: "ВМА им. Кирова (Москва). Подготовка ТССС (ТАКМЕД), расширенный курс РАТМЕД. Повышение квалификации: Академия Боткина, преподаватель первой помощи «Искрум».",
  },
  {
    name: "Воронков Алексей Евгеньевич",
    role: "Инструктор",
    photo: "/instructor-voronkov.jpg",
    shortExp: "Высшее педагогическое, фельдшер. Инструктор тактической медицины.",
    fullExp: "Высшее педагогическое, среднее — лечебное дело (фельдшер). Инструктор тактической медицины (ВМА им. Кирова, «Технологии выживания»). Инструктор первой помощи (АГМУ, Сибирский институт безопасности). Инструкторская деятельность с 2021 года.",
  },
  {
    name: "Инструктор по женской безопасности",
    role: "Инструктор",
    photo: "/audience-women.png",
    shortExp: "Высшее юридическое. Более 16 лет опыта. Личный спортивный опыт 10+ лет: ММА, CJJ, Крав-мага.",
    fullExp: "Образование: высшее юридическое, стаж оказания юридических услуг широкого спектра в области семейного, трудового, гражданского права и арбитражного процесса более 16 лет, с опытом консультирования и представления интересов потерпевших по уголовным делам о причинении вреда здоровью.\n\nДополнительное изучение дисциплин: Криминология, психология, судебная психиатрия с участием в проведении патолого-анатомических вскрытий (ФБГУ «РЦСМЭ» Минздрава России).\n\nЛичный спортивный опыт более 10 лет: смешанные единоборства (ММА), Combat Jiu-Jitsu (CJJ), Крав-мага.\n\nПостоянный участник курсов и интенсивов в ЦСП «Ермак»: «Оператор АК», «Тактическая медицина», комплексные интенсивы, выездной интенсив по тактической медицине в Новороссийск (сентябрь 2025).\n\nНевольный участник массированной атаки БПЛА на Волгоград, сентябрь 2025.\n\nОператор в ЦСП «Ермак» с 2023 года.",
  },
];

const audienceGroups = [
  {
    title: "🚗 Гражданская жизнь",
    color: "text-accent",
    items: ["мотоциклисты", "эндуристы", "велосипедисты", "самокатчики", "автомобилисты", "дальнобойщики", "курьеры"],
  },
  {
    title: "🌲 Активный отдых",
    color: "text-primary",
    items: ["туристы", "походники", "альпинисты", "скалолазы", "рыбаки", "охотники", "джиперы", "экстремалы"],
  },
  {
    title: "👨‍👩‍👧 Повседневная жизнь",
    color: "text-accent",
    items: ["родители", "мамы с детьми", "семьи", "учителя", "воспитатели", "офисные сотрудники", "предприниматели"],
  },
  {
    title: "⚡ Риск и работа",
    color: "text-destructive",
    items: ["строители", "монтажники", "электрики", "высотники", "рабочие на производстве", "горняки"],
  },
  {
    title: "💪 Физически активные",
    color: "text-primary",
    items: ["спортсмены", "фитнес-тренеры", "единоборцы", "кроссфитеры"],
  },
];

const Index = () => {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [quizOpen, setQuizOpen] = useState(false);
  const [activeInstructor, setActiveInstructor] = useState<number | null>(null);
  const [hoveredSide, setHoveredSide] = useState<"civil" | "military" | null>(null);

  // Get unique courses for each section
  const civilCourses = courses.filter(c => civilCourseIds.includes(c.id) && c.level === "beginner");
  const militaryCourses = courses.filter(c => militaryCourseIds.includes(c.id));
  // Remove duplicates for military, keep unique by id
  const uniqueMilitaryCourses = militaryCourses.filter((c, i, arr) => arr.findIndex(x => x.id === c.id) === i);

  return (
    <div className="min-h-screen">
      {/* SPLIT HERO */}
      <section className="relative min-h-screen flex flex-col md:flex-row overflow-hidden">
        {/* Civil side */}
        <motion.div
          className="relative flex-1 flex items-center justify-center cursor-pointer overflow-hidden"
          animate={{ flex: hoveredSide === "civil" ? 1.06 : hoveredSide === "military" ? 0.94 : 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          onMouseEnter={() => setHoveredSide("civil")}
          onMouseLeave={() => setHoveredSide(null)}
        >
          <div className="absolute inset-0">
            <img src="/hero-civil.jpg" alt="Гражданская подготовка" className="w-full h-full object-cover" width={960} height={1080} />
            <div className="absolute inset-0 bg-gradient-to-b from-[hsl(40,10%,92%)]/80 via-[hsl(40,10%,92%)]/60 to-[hsl(40,10%,92%)]/90" />
          </div>
          <div className="relative z-10 text-center px-6 py-32 md:py-0 max-w-lg">
            <p className="font-heading text-xs tracking-[0.3em] text-civil-muted mb-3">ЦЕНТР СПЕЦИАЛЬНОЙ ПОДГОТОВКИ</p>
            <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-civil leading-[0.95] mb-4">
              ГРАЖДАНСКАЯ<br />ПОДГОТОВКА
            </h2>
            <p className="text-civil-muted text-base md:text-lg mb-8 font-body">
              Навыки, которые помогут защитить себя и близких
            </p>
            <a href="#civil">
              <Button size="lg" className="bg-cta-gradient text-accent-foreground font-heading text-lg tracking-wider shadow-cta hover:opacity-90 px-8 py-6">
                Смотреть курсы
              </Button>
            </a>
          </div>
        </motion.div>

        {/* Divider with central text */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 hidden md:block text-center pointer-events-none">
          <div className="bg-background/90 backdrop-blur-md px-6 py-5 rounded-lg border border-border">
            <p className="font-heading text-sm md:text-base text-accent tracking-wider">НАВЫКИ, КОТОРЫЕ НЕЛЬЗЯ ЗАГУГЛИТЬ<br />В КРИТИЧЕСКИЙ МОМЕНТ</p>
            <p className="text-xs text-muted-foreground mt-2">Выбери свой уровень подготовки</p>
          </div>
        </div>

        {/* Military side */}
        <motion.div
          className="relative flex-1 flex items-center justify-center cursor-pointer overflow-hidden"
          animate={{ flex: hoveredSide === "military" ? 1.06 : hoveredSide === "civil" ? 0.94 : 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          onMouseEnter={() => setHoveredSide("military")}
          onMouseLeave={() => setHoveredSide(null)}
        >
          <div className="absolute inset-0">
            <img src="/hero-military.jpg" alt="Подготовка для силовых" className="w-full h-full object-cover" width={960} height={1080} />
            <div className="absolute inset-0 bg-gradient-to-b from-[hsl(220,20%,8%)]/80 via-[hsl(220,20%,8%)]/60 to-[hsl(220,20%,8%)]/90" />
          </div>
          <div className="relative z-10 text-center px-6 py-32 md:py-0 max-w-lg">
            <p className="font-heading text-xs tracking-[0.3em] text-military-muted mb-3">ЦЕНТР СПЕЦИАЛЬНОЙ ПОДГОТОВКИ</p>
            <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-military leading-[0.95] mb-4">
              ПОДГОТОВКА<br />ДЛЯ СИЛОВЫХ
            </h2>
            <p className="text-military-muted text-base md:text-lg mb-8 font-body">
              Навыки, от которых зависит жизнь
            </p>
            <a href="#military">
              <Button size="lg" className="bg-cta-gradient text-accent-foreground font-heading text-lg tracking-wider shadow-cta hover:opacity-90 px-8 py-6">
                Смотреть курсы
              </Button>
            </a>
          </div>
        </motion.div>

        {/* Mobile central text */}
        <div className="md:hidden absolute bottom-8 left-0 right-0 z-20 text-center px-4">
          <div className="bg-background/90 backdrop-blur-md px-4 py-3 rounded-lg border border-border inline-block">
            <p className="font-heading text-xs text-accent tracking-wider">НАВЫКИ, КОТОРЫЕ НЕЛЬЗЯ ЗАГУГЛИТЬ В КРИТИЧЕСКИЙ МОМЕНТ</p>
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <section className="bg-card border-y border-border py-8">
        <div className="container mx-auto flex justify-center gap-8 md:gap-16">
          {[
            { num: "1000+", label: "Выпускников" },
            { num: "50+", label: "Курсов проведено" },
            { num: "15", label: "Лет опыта" },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <span className="text-3xl md:text-4xl font-heading font-bold text-foreground">{s.num}</span>
              <span className="block text-xs text-muted-foreground mt-1">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* WHY IT MATTERS */}
      <section className="section-padding bg-card">
        <div className="container mx-auto">
          <AnimatedSection>
            <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground text-center mb-4">
              Почему это <span className="text-gradient">важно</span>
            </h2>
            <p className="text-muted-foreground text-center max-w-xl mx-auto mb-16">
              Каждый день кто-то оказывается в ситуации, к которой не был готов
            </p>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: AlertTriangle, title: "Скорая не успеет", text: "Среднее время приезда — 20 минут. Человек с артериальным кровотечением без помощи не проживёт и пяти." },
              { icon: Shield, title: "Нападение на улице", text: "Количество уличных нападений растёт. Без навыков самозащиты и умения видеть опасность — вы лёгкая мишень." },
              { icon: Heart, title: "ДТП на трассе", text: "Вы единственный, кто может помочь. Но знаете ли вы, что делать, когда человек не дышит?" },
              { icon: Target, title: "Вдали от цивилизации", text: "Поход, рыбалка, пикник. Связи нет, помощь далеко. Всё зависит только от вас." },
            ].map((item, i) => (
              <AnimatedSection key={i} delay={i * 0.1}>
                <div className="bg-card-gradient border border-border rounded-lg p-6 hover:border-primary/30 transition-all h-full">
                  <item.icon className="w-10 h-10 text-accent mb-4" />
                  <h3 className="font-heading text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.text}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* FOR WHOM — expanded grid */}
      <section className="section-padding">
        <div className="container mx-auto">
          <AnimatedSection>
            <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground text-center mb-16">
              Для кого <span className="text-gradient">наши курсы</span>
            </h2>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {audienceGroups.map((group, gi) => (
              <AnimatedSection key={gi} delay={gi * 0.1}>
                <div className="bg-card-gradient border border-border rounded-lg p-6 hover:border-primary/30 transition-all h-full">
                  <h3 className={`font-heading text-lg font-semibold mb-4 ${group.color}`}>{group.title}</h3>
                  <div className="flex flex-wrap gap-2">
                    {group.items.map((item, j) => (
                      <span key={j} className="text-xs bg-secondary text-secondary-foreground px-3 py-1.5 rounded-full hover:bg-primary/20 transition-colors cursor-default">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </AnimatedSection>
            ))}
            <AnimatedSection delay={0.5}>
              <div className="bg-card-gradient border border-accent/30 rounded-lg p-6 flex flex-col justify-center h-full">
                <p className="font-heading text-lg font-semibold text-accent mb-2">И ТЕ, КТО ПРОСТО ПОНИМАЕТ</p>
                <p className="text-sm text-muted-foreground leading-relaxed mb-1">что не хочет оказаться беспомощным</p>
                <ul className="text-sm text-muted-foreground space-y-1 mt-2">
                  <li className="flex items-center gap-2"><ChevronRight className="w-3 h-3 text-accent" /> те, у кого есть семья</li>
                  <li className="flex items-center gap-2"><ChevronRight className="w-3 h-3 text-accent" /> те, кто уже видел, как бывает</li>
                </ul>
              </div>
            </AnimatedSection>
          </div>
          <AnimatedSection delay={0.3}>
            <div className="text-center">
              <p className="text-muted-foreground text-lg mb-2 italic">
                Вопрос не в том, кто ты.<br />
                Вопрос — что ты будешь делать, когда это случится.
              </p>
              <Link to="/courses">
                <Button size="lg" className="mt-6 bg-cta-gradient text-accent-foreground font-heading text-lg tracking-wider shadow-cta hover:opacity-90 px-8 py-6">
                  Выбрать курс <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* CIVIL COURSES */}
      <section id="civil" className="section-padding bg-civil">
        <div className="container mx-auto">
          <AnimatedSection>
            <h2 className="font-heading text-3xl md:text-5xl font-bold text-civil text-center mb-4">
              Гражданская <span className="text-gradient-dark">подготовка</span>
            </h2>
            <div className="max-w-2xl mx-auto mb-12">
              <div className="flex flex-wrap justify-center gap-3 text-sm text-civil-muted">
                {["Родители, которые хотят защитить семью", "Водители — первая помощь при ДТП", "Туристы и путешественники", "Все, кто ценит свою безопасность"].map((t, i) => (
                  <span key={i} className="flex items-center gap-1"><ChevronRight className="w-3 h-3 text-accent" />{t}</span>
                ))}
              </div>
            </div>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {civilCourses.map((course, i) => (
              <AnimatedSection key={course.id} delay={i * 0.05}>
                <CourseCard course={course} lightMode />
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* MILITARY COURSES */}
      <section id="military" className="section-padding bg-military">
        <div className="container mx-auto">
          <AnimatedSection>
            <h2 className="font-heading text-3xl md:text-5xl font-bold text-military text-center mb-4">
              Подготовка для <span className="text-gradient">силовых</span>
            </h2>
            <div className="max-w-2xl mx-auto mb-12">
              <div className="flex flex-wrap justify-center gap-3 text-sm text-military-muted">
                {["Действующие военнослужащие", "Сотрудники охранных предприятий", "Контрактники и добровольцы", "Резервисты / призывники"].map((t, i) => (
                  <span key={i} className="flex items-center gap-1"><ChevronRight className="w-3 h-3 text-accent" />{t}</span>
                ))}
              </div>
            </div>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {uniqueMilitaryCourses.map((course, i) => (
              <AnimatedSection key={course.id} delay={i * 0.05}>
                <CourseCard course={course} />
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* INSTRUCTORS */}
      <section id="instructors" className="section-padding bg-card">
        <div className="container mx-auto">
          <AnimatedSection>
            <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground text-center mb-16">
              <span className="text-gradient">Инструкторы</span>
            </h2>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 max-w-7xl mx-auto">
            {instructorsData.map((inst, i) => (
              <AnimatedSection key={i} delay={i * 0.1}>
                <div className="text-center p-5 bg-card-gradient border border-border rounded-lg hover:border-primary/30 transition-all h-full flex flex-col">
                  <div className="w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden border-2 border-primary/30">
                    <img src={inst.photo} alt={inst.name} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                  <h3 className="font-heading text-base font-semibold text-foreground">{inst.name}</h3>
                  <p className="text-xs text-primary mb-2">{inst.role}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed flex-1">{inst.shortExp}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3 border-primary/30 text-foreground hover:bg-primary/10 font-heading text-xs tracking-wider"
                    onClick={() => setActiveInstructor(i)}
                  >
                    Подробнее
                  </Button>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Instructor detail modal */}
      <Dialog open={activeInstructor !== null} onOpenChange={() => setActiveInstructor(null)}>
        <DialogContent className="bg-card border-border max-w-lg max-h-[80vh] overflow-y-auto">
          {activeInstructor !== null && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary/30 shrink-0">
                    <img src={instructorsData[activeInstructor].photo} alt={instructorsData[activeInstructor].name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <DialogTitle className="font-heading text-lg text-foreground">{instructorsData[activeInstructor].name}</DialogTitle>
                    <p className="text-sm text-primary">{instructorsData[activeInstructor].role}</p>
                  </div>
                </div>
              </DialogHeader>
              <p className="text-sm text-muted-foreground leading-relaxed mt-4 whitespace-pre-line">{instructorsData[activeInstructor].fullExp}</p>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* REVIEWS */}
      <section className="section-padding">
        <div className="container mx-auto">
          <AnimatedSection>
            <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground text-center mb-16">
              Реальные <span className="text-gradient">отзывы</span>
            </h2>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {[
              { text: "На трассе попал в ДТП. Пострадавший истекал кровью. Я наложил турникет за 15 секунд — как на тренировке. Врачи сказали: ещё 3 минуты — и было бы поздно.", author: "Алексей, 34 года", role: "Выпускник «Тактическая медицина»", type: "civil" },
              { text: "Дочь подавилась на площадке. Я не паниковала — сделала всё, как учили. Через 10 секунд она дышала.", author: "Мария, 28 лет", role: "Выпускница «Первая помощь»", type: "civil" },
              { text: "После курса тактики действовал уверенно. Знал, как работать в группе, как входить в помещение, как прикрывать. Это не теория — это навык.", author: "Сергей, 29 лет", role: "Выпускник «Тактическая подготовка»", type: "military" },
              { text: "Прошла женскую безопасность. Теперь иначе смотрю на привычные маршруты. Вижу опасности, знаю, как реагировать. Это спокойствие, а не паранойя.", author: "Екатерина, 31 год", role: "Выпускница «Женская безопасность»", type: "civil" },
            ].map((story, i) => (
              <AnimatedSection key={i} delay={i * 0.1}>
                <div className={`rounded-lg p-6 border transition-all h-full ${story.type === "civil" ? "bg-civil border-[hsl(40,5%,80%)]" : "bg-card-gradient border-border"}`}>
                  <div className="flex gap-1 mb-3">
                    {[...Array(5)].map((_, j) => <Star key={j} className="w-3.5 h-3.5 fill-accent text-accent" />)}
                  </div>
                  <p className={`leading-relaxed mb-4 text-sm italic ${story.type === "civil" ? "text-civil" : "text-foreground"}`}>«{story.text}»</p>
                  <div>
                    <p className={`font-heading font-semibold text-sm ${story.type === "civil" ? "text-civil" : "text-foreground"}`}>{story.author}</p>
                    <p className={`text-xs ${story.type === "civil" ? "text-civil-muted" : "text-muted-foreground"}`}>{story.role}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* HOW TRAINING WORKS */}
      <section className="section-padding bg-card">
        <div className="container mx-auto">
          <AnimatedSection>
            <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground text-center mb-16">
              Как проходит <span className="text-gradient">обучение</span>
            </h2>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {[
              { step: "01", title: "Практика с первого часа", text: "Минимум лекций. Берёте в руки, делаете, разбираете ошибки.", icon: Target },
              { step: "02", title: "Реальные сценарии", text: "Не абстрактная теория — а ситуации, взятые из жизни и боевого опыта.", icon: Shield },
              { step: "03", title: "Стресс-факторы", text: "Давление, ограниченное время, шум. Как в реальной ситуации.", icon: AlertTriangle },
              { step: "04", title: "Минимальная теория", text: "Только то, что нужно для практики. Без воды и слайдов.", icon: Clock },
            ].map((s, i) => (
              <AnimatedSection key={i} delay={i * 0.1}>
                <div className="text-center">
                  <span className="text-5xl font-heading font-bold text-primary/20">{s.step}</span>
                  <h3 className="font-heading text-lg font-semibold text-foreground mt-2 mb-2">{s.title}</h3>
                  <p className="text-sm text-muted-foreground">{s.text}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="section-padding">
        <div className="container mx-auto max-w-3xl">
          <AnimatedSection>
            <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground text-center mb-12">
              Частые <span className="text-gradient">вопросы</span>
            </h2>
          </AnimatedSection>
          <AnimatedSection delay={0.1}>
            <Accordion type="single" collapsible className="space-y-3">
              {faqData.map((item, i) => (
                <AccordionItem key={i} value={`faq-${i}`} className="bg-card-gradient border border-border rounded-lg px-6 data-[state=open]:border-primary/30">
                  <AccordionTrigger className="font-heading text-foreground text-left hover:no-underline py-5">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </AnimatedSection>
        </div>
      </section>

      {/* CONTACT / CTA */}
      <section id="contacts" className="section-padding bg-card">
        <div className="container mx-auto max-w-2xl text-center">
          <AnimatedSection>
            <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground mb-4">
              Не ждите, пока <span className="text-gradient">станет поздно</span>
            </h2>
            <p className="text-muted-foreground mb-10 text-lg">
              Оставьте заявку — мы подберём курс под ваш уровень и задачи
            </p>
          </AnimatedSection>
          <AnimatedSection delay={0.1}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button onClick={() => setBookingOpen(true)} size="lg" className="bg-cta-gradient text-accent-foreground font-heading text-lg tracking-wider shadow-cta hover:opacity-90 animate-pulse-glow px-10 py-6">
                Записаться
              </Button>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="https://t.me/ErmakCenter" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="lg" className="border-primary/30 text-foreground hover:bg-primary/10 font-heading tracking-wider gap-2 px-8 py-5">
                  <Send className="w-4 h-4" /> Написать в Telegram
                </Button>
              </a>
              <a href="tel:+79994675684">
                <Button variant="outline" size="lg" className="border-primary/30 text-foreground hover:bg-primary/10 font-heading tracking-wider gap-2 px-8 py-5">
                  <Phone className="w-4 h-4" /> Позвонить
                </Button>
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <BookingForm open={bookingOpen} onOpenChange={setBookingOpen} />
      <QuizModal open={quizOpen} onOpenChange={setQuizOpen} onComplete={() => setBookingOpen(true)} />
    </div>
  );
};

export default Index;
