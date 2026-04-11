import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, Heart, Target, AlertTriangle, ArrowRight, ChevronRight, Star, Phone, Send, Clock } from "lucide-react";
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
const militaryCourseIds = ["ak-operator", "tactical-medicine", "tactical-training", "pistol", "engineering", "field-intensive", "weekend-practice", "individual", "events"];

const instructorsData = [
  {
    name: "Данюкин Андрей Игоревич",
    role: "Руководитель ЦСП «ЕРМАК»",
    photo: "/instructor-danyukin.png",
    shortExp: "Профессиональный военный, участник боевых действий. Инструктор по армейской тактической стрельбе.",
    fullExp: `Данюкин Андрей Игоревич – руководитель центра специальной подготовки "Ермак", а также тренер СК "РОСТ".

Образование — высшее. Профессиональный военный. Службу проходил в различных силах специального назначения (в том числе на должности инструктора по физической подготовке и рукопашному бою).

Участник боевых действий.

Инструктор по армейской тактической стрельбе.

Действующий инструктор фонда ветеранов спецподразделений и сотрудников ФСБ России «Антитеррор» г. Новосибирск.

Инструктор по тактико-специальной подготовке (Новосибирская региональная общественная организация по развитию армейских тактических дисциплин «Звезда») № 043-Т.

Стаж работы с детьми более 10 лет.

Постоянный участник и разработчик программ для детских лагерей военно-патриотической и военно-приключенческой направленности.

Награждён государственными наградами, а также благодарственными письмами правительства за личный вклад в воспитании детей.

Если ваши дети ездили на наши военные сезоны, то знают о его брутальности не понаслышке. Андрей Игоревич будет интересен вашему ребёнку, как личность, а вам, как профессионал своего дела. Он очень компетентен и востребован в том, что делает.`,
  },
  {
    name: "Дедов Михаил Владимирович",
    role: "Старший инструктор",
    photo: "/instructor-dedov.jpg",
    shortExp: "Инструкторская деятельность с 2014 года. Участник боевых действий.",
    fullExp: `Дедов Михаил Владимирович — старший инструктор центра специальной подготовки "Ермак".

Опыт инструкторской деятельности с 2014 года.

2014–2018 – инструктор по рукопашному и ножевому бою, СК «РОСТ».
2022–наст.время – инструктор ЦСП «Ермак».

Участник боевых действий.

Стаж работы с детьми с 2015 года, на регулярной основе принимал участие в организации и проведении детских летних военных лагерей от СК «РОСТ».

Постоянный участник и организатор мастер-классов по рукопашному бою, стрельбе и специальной подготовке:

• Центр тактической и огневой подготовки «Партизан» (Санкт-Петербург), курс «Партизан Интенсив»
• Международный центр боевой и специальной подготовки «Волк» (Ростов-на-Дону), курс «Инструктор личной безопасности»
• АНО «Первая помощь» (Новосибирск), курс «Первая помощь в условиях ведения боевых действий»
• Инструктор по тактической медицине (Военно-медицинская Академия имени Кирова, г. Санкт-Петербург)
• АНО ДПО «Учебный центр «Профессионал» (Новосибирск), курс «Инструктор армейской тактической стрельбы»
• Проект «Технологии выживания» (Новосибирск), курс «Тактическая медицина»
• Инструктор по тактико-специальной подготовке (Новосибирская региональная общественная организация по развитию армейских тактических дисциплин «Звезда») № 044-Т

Постоянный участник и разработчик программ для детских лагерей военно-патриотической и военно-приключенческой направленности.

Награждён благодарственными письмами правительства за личный вклад в воспитании детей.`,
  },
  {
    name: "Подоксенов Владимир Александрович",
    role: "Инструктор",
    photo: "/instructor-podoksenov.jpg",
    shortExp: "ВМА им. Кирова. Подготовка ТССС (ТАКМЕД), расширенный курс РАТМЕД.",
    fullExp: `Подоксенов Владимир Александрович — инструктор центра специальной подготовки "Ермак".

Обучение в Военно-медицинской академии имени Кирова (филиал Москва).

Подготовка по протоколу ТССС (ЦСП ТАКМЕД).

Подготовка по остановке жизнеугрожающих кровотечений (УЦ Территория безопасности Ангел).

Подготовка «Расширенный курс по тактической медицине. Догоспитальная помощь. Санитарный инструктор» (УЦ РАТМЕД).

Повышение квалификации в Московской академии медицины им. Боткина «Сестринское дело» и «Общая врачебная практика».

Повышение квалификации в ООО «Центр современного обучения первой помощи «Искрум» по программе «Преподаватель, обучающий приемам оказания первой помощи».`,
  },
  {
    name: "Воронков Алексей Евгеньевич",
    role: "Инструктор",
    photo: "/instructor-voronkov.jpg",
    shortExp: "Высшее педагогическое, фельдшер. Инструктор тактической медицины.",
    fullExp: `Воронков Алексей Евгеньевич — инструктор центра специальной подготовки "Ермак".

Опыт инструкторской деятельности с 2021 года.

Образование: высшее педагогическое, среднее по специальности: лечебное дело (фельдшер) (Барнаульский базовый медицинский колледж).

Инструктор по тактической медицине (Военно-медицинская Академия имени Кирова, г. Санкт-Петербург).

Инструктор по тактической медицине (проект «Технологии выживания»).

Инструктор по первой помощи (Алтайский государственный медицинский университет, г. Барнаул).

Инструктор по первой помощи (АНО ДПО Сибирский институт безопасности).`,
  },
  {
    name: "Мария Александровна",
    role: "Инструктор по женской безопасности",
    photo: "/audience-women.png",
    shortExp: "Высшее юридическое. Более 16 лет опыта. Личный спортивный опыт 10+ лет: ММА, CJJ, Крав-мага.",
    fullExp: `Мария Александровна — инструктор по женской безопасности.

Образование: высшее юридическое, стаж оказания юридических услуг широкого спектра в области семейного, трудового, гражданского права и арбитражного процесса более 16 лет, с опытом консультирования и представления интересов потерпевших по уголовным делам о причинении вреда здоровью.

Дополнительное изучение дисциплин на базе высшего юридического образования: Криминология, психология, судебная психиатрия с участием в проведении патолого-анатомических вскрытий (ФБГУ «РЦСМЭ» Минздрава России).

Личный спортивный опыт более 10 лет: смешанные единоборства (ММА), Combat Jiu-Jitsu (CJJ) — гибридная дисциплина, сочетающая традиционное бразильское джиу-джитсу (BJJ) с элементами смешанных единоборств (ММА), Крав-мага — разработанная в Израиле военная система рукопашного боя.

Постоянный участник курсов и интенсивов в ЦСП «Ермак»: «Оператор АК» — расширенный курс огневой подготовки на базе автомата Калашникова, включая боевые стрельбы, «Тактическая медицина», комплексные интенсивы в формате полевых выходов, включающие в себя все базовые дисциплины (огневая, тактико-специальная и инженерная подготовка, тактическая медицина, военная топография и пр.), выездной интенсив сентябрь 2025 по тактической медицине с инструкторами ЦСП «Ермак» в Новороссийск.

Невольный участник массированной атаки БПЛА на Волгоград, сентябрь 2025.

Оператор в ЦСП «Ермак» с 2023 года.`,
  },
];

const audienceGroups = [
  {
    title: "Гражданская жизнь",
    color: "text-accent",
    items: ["мотоциклисты", "эндуристы", "велосипедисты", "самокатчики", "автомобилисты", "дальнобойщики", "курьеры"],
  },
  {
    title: "Активный отдых",
    color: "text-primary",
    items: ["туристы", "походники", "альпинисты", "скалолазы", "рыбаки", "охотники", "джиперы", "экстремалы"],
  },
  {
    title: "Повседневная жизнь",
    color: "text-accent",
    items: ["родители", "мамы с детьми", "семьи", "учителя", "воспитатели", "офисные сотрудники", "предприниматели"],
  },
  {
    title: "Риск и работа",
    color: "text-destructive",
    items: ["строители", "монтажники", "электрики", "высотники", "рабочие на производстве", "горняки"],
  },
  {
    title: "Физически активные",
    color: "text-primary",
    items: ["спортсмены", "фитнес-тренеры", "единоборцы", "кроссфитеры"],
  },
];

const Index = () => {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [quizOpen, setQuizOpen] = useState(false);
  const [activeInstructor, setActiveInstructor] = useState<number | null>(null);
  const [hoveredSide, setHoveredSide] = useState<"civil" | "military" | null>(null);

  const civilCourses = courses.filter(c => civilCourseIds.includes(c.id));
  const militaryCourses = courses.filter(c => militaryCourseIds.includes(c.id));
  const uniqueMilitaryCourses = militaryCourses.filter((c, i, arr) => arr.findIndex(x => x.id === c.id) === i);

  return (
    <div className="min-h-screen">
      {/* SPLIT HERO */}
      <section className="relative min-h-[100svh] flex flex-col md:flex-row overflow-hidden">
        {/* Civil side */}
        <motion.div
          className="relative flex-1 min-h-[50svh] md:min-h-0 flex items-center justify-center cursor-pointer overflow-hidden"
          animate={{ flex: hoveredSide === "civil" ? 1.06 : hoveredSide === "military" ? 0.94 : 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          onMouseEnter={() => setHoveredSide("civil")}
          onMouseLeave={() => setHoveredSide(null)}
        >
          <div className="absolute inset-0">
            <img src="/hero-civil.jpg" alt="Гражданская подготовка" className="w-full h-full object-cover" width={960} height={1080} />
            <div className="absolute inset-0 bg-gradient-to-b from-[hsl(40,10%,20%)]/70 via-[hsl(40,10%,15%)]/50 to-[hsl(40,10%,10%)]/80" />
          </div>
          <div className="relative z-10 text-center px-4 sm:px-6 py-12 md:py-0 max-w-lg flex flex-col items-center justify-end md:justify-center md:h-auto h-full pb-24 md:pb-0">
            <p className="font-heading text-[10px] sm:text-xs tracking-[0.3em] text-[hsl(40,10%,80%)] mb-2 sm:mb-3">ЦЕНТР СПЕЦИАЛЬНОЙ ПОДГОТОВКИ</p>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-4xl lg:text-5xl font-bold text-white leading-[0.95] mb-3 sm:mb-4 min-h-[2.4em] md:min-h-[3em] flex items-end justify-center">
              <span>ГРАЖДАНСКАЯ<br />ПОДГОТОВКА</span>
            </h2>
            <p className="text-[hsl(40,10%,80%)] text-sm sm:text-base md:text-base lg:text-lg mb-5 sm:mb-6 font-body h-12 flex items-center">
              Навыки, которые помогут защитить себя и близких
            </p>
            <a href="#civil">
              <Button size="lg" className="bg-cta-gradient text-accent-foreground font-heading text-base sm:text-lg tracking-wider shadow-cta hover:opacity-90 px-6 sm:px-8 py-5 sm:py-6">
                Смотреть курсы
              </Button>
            </a>
          </div>
        </motion.div>

        {/* Quiz button — divider between civil and military */}
        <div className="absolute z-20 left-0 right-0 top-1/2 -translate-y-1/2 md:top-auto md:bottom-6 md:translate-y-0 flex items-center justify-center pointer-events-none">
          <button onClick={() => setQuizOpen(true)} className="pointer-events-auto bg-background/90 backdrop-blur-md px-4 sm:px-6 py-2.5 sm:py-4 rounded-lg border border-border hover:border-accent/50 transition-all cursor-pointer group max-w-[90%] md:max-w-none">
            <p className="font-heading text-[10px] sm:text-sm md:text-base text-accent tracking-wider group-hover:text-accent/80 transition-colors leading-tight">НАВЫКИ, КОТОРЫЕ НЕЛЬЗЯ ЗАГУГЛИТЬ В КРИТИЧЕСКИЙ МОМЕНТ</p>
            <p className="text-[9px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1">Пройди тест — узнай свой уровень подготовки</p>
          </button>
        </div>

        {/* Military side */}
        <motion.div
          className="relative flex-1 min-h-[50svh] md:min-h-0 flex items-center justify-center cursor-pointer overflow-hidden"
          animate={{ flex: hoveredSide === "military" ? 1.06 : hoveredSide === "civil" ? 0.94 : 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          onMouseEnter={() => setHoveredSide("military")}
          onMouseLeave={() => setHoveredSide(null)}
        >
          <div className="absolute inset-0">
            <img src="/hero-military.jpg" alt="Подготовка для силовых" className="w-full h-full object-cover" width={960} height={1080} />
            <div className="absolute inset-0 bg-gradient-to-b from-[hsl(220,20%,8%)]/80 via-[hsl(220,20%,8%)]/60 to-[hsl(220,20%,8%)]/90" />
          </div>
          <div className="relative z-10 text-center px-4 sm:px-6 py-12 md:py-0 max-w-lg flex flex-col items-center justify-end md:justify-center md:h-auto h-full pb-24 md:pb-0">
            <p className="font-heading text-[10px] sm:text-xs tracking-[0.3em] text-military-muted mb-2 sm:mb-3">ЦЕНТР СПЕЦИАЛЬНОЙ ПОДГОТОВКИ</p>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-4xl lg:text-5xl font-bold text-military leading-[0.95] mb-3 sm:mb-4 min-h-[2.4em] md:min-h-[3em] flex items-end justify-center">
              <span>ПОДГОТОВКА<br />ДЛЯ СИЛОВЫХ<br />НАПРАВЛЕНИЙ</span>
            </h2>
            <p className="text-military-muted text-sm sm:text-base md:text-base lg:text-lg mb-5 sm:mb-6 font-body h-12 flex items-center">
              Навыки, от которых зависит жизнь
            </p>
            <a href="#military">
              <Button size="lg" className="bg-cta-gradient text-accent-foreground font-heading text-base sm:text-lg tracking-wider shadow-cta hover:opacity-90 px-6 sm:px-8 py-5 sm:py-6">
                Смотреть курсы
              </Button>
            </a>
          </div>
        </motion.div>
      </section>

      {/* FOR WHOM */}
      <section className="py-14 md:py-28 px-4 md:px-8">
        <div className="container mx-auto">
          <AnimatedSection>
            <h2 className="font-heading text-2xl sm:text-3xl md:text-5xl font-bold text-foreground text-center mb-8 md:mb-16">
              Для кого <span className="text-gradient">наши курсы</span>
            </h2>
          </AnimatedSection>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 md:mb-10">
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

      {/* WHY IT MATTERS */}
      <section className="py-14 md:py-28 px-4 md:px-8 bg-card">
        <div className="container mx-auto">
          <AnimatedSection>
            <h2 className="font-heading text-2xl sm:text-3xl md:text-5xl font-bold text-foreground text-center mb-3 sm:mb-4">
              Почему это <span className="text-gradient">важно</span>
            </h2>
            <p className="text-muted-foreground text-center max-w-xl mx-auto mb-8 md:mb-16 text-sm sm:text-base">
              Каждый день кто-то оказывается в ситуации, к которой не был готов
            </p>
          </AnimatedSection>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
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

      {/* CIVIL COURSES */}
      <section id="civil" className="py-14 md:py-28 px-4 md:px-8 bg-civil">
        <div className="container mx-auto">
          <AnimatedSection>
            <h2 className="font-heading text-2xl sm:text-3xl md:text-5xl font-bold text-civil text-center mb-3 sm:mb-4">
              Гражданская <span className="text-gradient-dark">подготовка</span>
            </h2>
            <div className="max-w-2xl mx-auto mb-8 md:mb-12">
              <div className="flex flex-wrap justify-center gap-2 sm:gap-3 text-xs sm:text-sm text-civil-muted">
                {["Родители, которые хотят защитить семью", "Водители — первая помощь при ДТП", "Туристы и путешественники", "Все, кто ценит свою безопасность"].map((t, i) => (
                  <span key={i} className="flex items-center gap-1"><ChevronRight className="w-3 h-3 text-accent" />{t}</span>
                ))}
              </div>
            </div>
          </AnimatedSection>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {civilCourses.map((course, i) => (
              <AnimatedSection key={course.id} delay={i * 0.05}>
                <CourseCard course={course} lightMode />
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* MILITARY COURSES */}
      <section id="military" className="py-14 md:py-28 px-4 md:px-8 bg-military">
        <div className="container mx-auto">
          <AnimatedSection>
            <h2 className="font-heading text-2xl sm:text-3xl md:text-5xl font-bold text-military text-center mb-3 sm:mb-4">
              Подготовка для <span className="text-gradient">силовых</span>
            </h2>
            <div className="max-w-2xl mx-auto mb-8 md:mb-12">
              <div className="flex flex-wrap justify-center gap-2 sm:gap-3 text-xs sm:text-sm text-military-muted">
                {["Действующие военнослужащие", "Сотрудники охранных предприятий", "Контрактники и добровольцы", "Резервисты / призывники"].map((t, i) => (
                  <span key={i} className="flex items-center gap-1"><ChevronRight className="w-3 h-3 text-accent" />{t}</span>
                ))}
              </div>
            </div>
          </AnimatedSection>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {uniqueMilitaryCourses.map((course, i) => (
              <AnimatedSection key={course.id} delay={i * 0.05}>
                <CourseCard course={course} />
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* INSTRUCTORS */}
      <section id="instructors" className="py-14 md:py-28 px-4 md:px-8 bg-card">
        <div className="container mx-auto">
          <AnimatedSection>
            <h2 className="font-heading text-2xl sm:text-3xl md:text-5xl font-bold text-foreground text-center mb-8 md:mb-16">
              <span className="text-gradient">Инструкторы</span>
            </h2>
          </AnimatedSection>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6 max-w-7xl mx-auto">
            {instructorsData.map((inst, i) => (
              <AnimatedSection key={i} delay={i * 0.1}>
                <div className="text-center p-3 sm:p-5 bg-card-gradient border border-border rounded-lg hover:border-primary/30 transition-all h-full flex flex-col">
                  <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full mx-auto mb-3 sm:mb-4 overflow-hidden border-2 border-primary/30">
                    <img src={inst.photo} alt={inst.name} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                  <h3 className="font-heading text-xs sm:text-base font-semibold text-foreground leading-tight">{inst.name}</h3>
                  <p className="text-[10px] sm:text-xs text-primary mb-1 sm:mb-2">{inst.role}</p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground leading-relaxed flex-1 hidden sm:block">{inst.shortExp}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2 sm:mt-3 border-primary/30 text-foreground hover:bg-primary/10 font-heading text-[10px] sm:text-xs tracking-wider"
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
      <section className="py-14 md:py-28 px-4 md:px-8">
        <div className="container mx-auto">
          <AnimatedSection>
            <h2 className="font-heading text-2xl sm:text-3xl md:text-5xl font-bold text-foreground text-center mb-8 md:mb-16">
              Реальные <span className="text-gradient">отзывы</span>
            </h2>
          </AnimatedSection>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 max-w-5xl mx-auto">
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
      <section className="py-14 md:py-28 px-4 md:px-8 bg-card">
        <div className="container mx-auto">
          <AnimatedSection>
            <h2 className="font-heading text-2xl sm:text-3xl md:text-5xl font-bold text-foreground text-center mb-8 md:mb-16">
              Как проходит <span className="text-gradient">обучение</span>
            </h2>
          </AnimatedSection>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 max-w-5xl mx-auto">
            {[
              { step: "01", title: "Практика с первого часа", text: "Минимум лекций. Берёте в руки, делаете, разбираете ошибки.", icon: Target },
              { step: "02", title: "Реальные сценарии", text: "Не абстрактная теория — а ситуации, взятые из жизни и боевого опыта.", icon: Shield },
              { step: "03", title: "Стресс-факторы", text: "Давление, ограниченное время, шум. Как в реальной ситуации.", icon: AlertTriangle },
              { step: "04", title: "Минимальная теория", text: "Только то, что нужно для практики. Без воды и слайдов.", icon: Clock },
            ].map((s, i) => (
              <AnimatedSection key={i} delay={i * 0.1}>
                <div className="text-center">
                  <span className="text-3xl sm:text-5xl font-heading font-bold text-primary/20">{s.step}</span>
                  <h3 className="font-heading text-sm sm:text-lg font-semibold text-foreground mt-1 sm:mt-2 mb-1 sm:mb-2">{s.title}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">{s.text}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-14 md:py-28 px-4 md:px-8">
        <div className="container mx-auto max-w-3xl">
          <AnimatedSection>
            <h2 className="font-heading text-2xl sm:text-3xl md:text-5xl font-bold text-foreground text-center mb-8 md:mb-12">
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
      <section id="contacts" className="py-14 md:py-28 px-4 md:px-8 bg-card">
        <div className="container mx-auto max-w-2xl text-center">
          <AnimatedSection>
            <h2 className="font-heading text-2xl sm:text-3xl md:text-5xl font-bold text-foreground mb-3 sm:mb-4">
              Не ждите, пока <span className="text-gradient">станет поздно</span>
            </h2>
            <p className="text-muted-foreground mb-6 sm:mb-10 text-sm sm:text-lg">
              Оставьте заявку — мы подберём курс под ваш уровень и задачи
            </p>
          </AnimatedSection>
          <AnimatedSection delay={0.1}>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-6 sm:mb-8">
              <Button onClick={() => setBookingOpen(true)} size="lg" className="w-full sm:w-auto bg-cta-gradient text-accent-foreground font-heading text-base sm:text-lg tracking-wider shadow-cta hover:opacity-90 animate-pulse-glow px-8 sm:px-10 py-5 sm:py-6">
                Записаться
              </Button>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <a href="https://t.me/ErmakCenter" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto border-primary/30 text-foreground hover:bg-primary/10 font-heading tracking-wider gap-2 px-6 sm:px-8 py-4 sm:py-5">
                  <Send className="w-4 h-4" /> Написать в Telegram
                </Button>
              </a>
              <a href="tel:+79994675684" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto border-primary/30 text-foreground hover:bg-primary/10 font-heading tracking-wider gap-2 px-6 sm:px-8 py-4 sm:py-5">
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
