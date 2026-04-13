import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Shield,
  Heart,
  Target,
  AlertTriangle,
  ArrowRight,
  ChevronRight,
  Star,
  Phone,
  Send,
  Clock,
  ShieldCheck,
  Sparkles,
  Crosshair,
  GraduationCap,
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import AnimatedSection from "@/components/AnimatedSection";
import CourseCard from "@/components/CourseCard";
import { courses } from "@/data/courses";
import { motion } from "framer-motion";
import { useLeadUi } from "@/contexts/LeadUiContext";

const faqData = [
  { q: "Нужен ли опыт?", a: "Нет для большинства базовых курсов. Если формат продвинутый — это указано в карточке, и мы заранее согласуем входной уровень." },
  { q: "Можно ли прийти без физподготовки?", a: "Да. Мы не гоняем «на спортзал»: важна техника, безопасность и правильные решения. Нагрузку дозируем под группу." },
  { q: "Подойдёт ли курс обычному человеку без службы?", a: "Да. Гражданские программы как раз про повседневную жизнь: семья, дорога, работа, город. Силовые форматы — отдельным блоком." },
  { q: "Помогаете ли устроиться на контракт?", a: "Мы даём прикладную подготовку и сертификаты по программам. Вопросы трудоустройства зависят от работодателя — подскажем, какие курсы чаще всего закрывают пробелы." },
  { q: "Можно ли девушкам?", a: "Да. Есть женская безопасность и смешанные группы. Условия уточняем заранее, чтобы вам было комфортно." },
  { q: "Что брать с собой?", a: "Закрытая удобная одежда, вода. Для части курсов нужен камуфляж/берцы — пришлём список после записи." },
  { q: "Есть ли корпоративный формат?", a: "Да: выезды, тимформаты, интерактив под вашу задачу. Оставьте заявку — соберём программу под срок и состав." },
  { q: "Можно ли подарить сертификат?", a: "Да, оформим подарочный сертификат на сумму или конкретный курс. Напишите в Telegram или оставьте заявку." },
  { q: "Есть ли индивидуальные занятия?", a: "Да: персональные тренировки по огневой и такмеду, а также подготовка под узкую задачу." },
  { q: "Как понять, какой курс выбрать?", a: "Нажмите «Подобрать курс» на главной — короткий квиз подскажет стартовый формат. Или запишитесь на звонок: администратор соберёт маршрут под вашу задачу." },
  { q: "Больше теория или практика?", a: "Практика — основа. Сначала понятный алгоритм, затем отработка руками, разбор ошибок, повтор до уверенности." },
  { q: "Как записаться?", a: "Кнопка «Записаться» в шапке, на карточке курса или внизу страницы — оставьте контакты, мы подтвердим дату и место." },
];

const trustItems = [
  { icon: Crosshair, title: "Практика, а не нудные лекции", text: "Отработка навыков на сценариях,  максимально близких к реальности." },
  { icon: GraduationCap, title: "Инструкторы с реальным опытом", text: "Многолетняя служебная и преподавательская практика." },
  { icon: Sparkles, title: "Прикладные сценарии", text: "Город, дорога, быт, работа — не абстрактные «кейсы из интернета»." },
  { icon: ShieldCheck, title: "Гражданские и силовые треки", text: "Понятное разделение задач: жизнь/семья и служба/профессия." },
  { icon: Heart, title: "Навыки «на сейчас»", text: "То, что применимо, когда помощь нужна немедленно." },
];

const civilCourseIds = ["first-aid", "women-safety", "tactical-medicine", "pistol", "weekend-practice", "individual", "events"];
const militaryCourseIds = ["ak-operator", "tactical-medicine", "tactical-training", "pistol", "engineering", "field-intensive", "weekend-practice", "individual", "events"];

const instructorsData = [
  {
    name: "Данюкин Андрей Игоревич",
    role: "Руководитель ЦСП «ЕРМАК»",
    photo: "/instructor-danyukin.png",
    specialization: "Тактическая и огневая подготовка, работа с группами",
    experienceLabel: "Служебный и инструкторский опыт — с 2012 года, участник БД",
    directions: ["Огневая подготовка", "ТСП", "Детские лагеря"],
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
    specialization: "Такмед и первая помощь, стрельба, спецподготовка",
    experienceLabel: "Инструктор с 2014 года, ВМА им. Кирова, участник БД",
    directions: ["Ножевой бой", "Тактика", "Такмед"],
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
    specialization: "Тактическая медицина, догоспитальная помощь",
    experienceLabel: "ВМА им. Кирова, протоколы ТССС / ТАКМЕД",
    directions: ["Такмед", "Кровотечения", "Санинструктор"],
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
    specialization: "Тактическая медицина и первая помощь",
    experienceLabel: "Педагогическое образование, фельдшер, ВМА им. Кирова",
    directions: ["Такмед", "Первая помощь"],
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
    specialization: "Личная безопасность женщин, правовой контекст",
    experienceLabel: "Юрист 16+ лет, спорт — ММА / CJJ / крав-мага",
    directions: ["Женская безопасность", "Самооборона"],
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
  const { openBooking, openQuiz } = useLeadUi();
  const [activeInstructor, setActiveInstructor] = useState<number | null>(null);
  const [hoveredSide, setHoveredSide] = useState<"civil" | "military" | null>(null);

  const civilCourses = courses.filter(c => civilCourseIds.includes(c.id));
  const militaryCourses = courses.filter(c => militaryCourseIds.includes(c.id));
  const uniqueMilitaryCourses = militaryCourses.filter((c, i, arr) => arr.findIndex(x => x.id === c.id) === i);

  const scrollToId = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen pb-28 md:pb-0">
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
          <div className="relative z-10 text-center px-4 sm:px-6 py-12 md:py-0 max-w-lg flex flex-col items-center justify-end md:justify-center md:h-auto h-full pb-36 md:pb-0">
            <p className="font-heading text-[10px] sm:text-xs tracking-[0.3em] text-[hsl(40,10%,80%)] mb-2 sm:mb-3">​</p>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-4xl lg:text-5xl font-bold text-white leading-[0.95] mb-3 sm:mb-4 min-h-[2.4em] md:min-h-[3em] flex items-end justify-center">
              <span className="text-5xl">ГРАЖДАНСКАЯ<br />ПОДГОТОВКА</span>
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
          <div className="relative z-10 text-center px-4 sm:px-6 py-12 md:py-0 max-w-lg flex flex-col items-center justify-end md:justify-center md:h-auto h-full pb-36 md:pb-0">
            <p className="font-heading text-[10px] sm:text-xs tracking-[0.3em] text-military-muted mb-2 sm:mb-3">​</p>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-4xl lg:text-5xl font-bold text-military leading-[0.95] mb-3 sm:mb-4 min-h-[2.4em] md:min-h-[3em] flex items-end justify-center">
              <span className="text-5xl">ПОДГОТОВКА<br /> СИЛОВЫХ<br />НАПРАВЛЕНИЙ</span>
            </h2>
            <p className="text-military-muted text-sm sm:text-base md:text-base lg:text-lg mb-5 sm:mb-6 font-body h-12 flex items-center">
              Навыки, от которых зависит жизнь<br /><br />
            </p>
            <a href="#military">
              <Button size="lg" className="bg-cta-gradient text-accent-foreground font-heading text-base sm:text-lg tracking-wider shadow-cta hover:opacity-90 px-6 sm:px-8 py-5 sm:py-6">
                Смотреть курсы
              </Button>
            </a>
          </div>
        </motion.div>

        <div className="absolute bottom-0 left-0 right-0 z-30 pointer-events-none bg-gradient-to-t from-background via-background/90 to-transparent pt-16 pb-4 md:pb-6">
          <div className="pointer-events-auto container mx-auto px-3 sm:px-4">
            <p className="text-center font-heading text-[9px] sm:text-[10px] tracking-[0.2em] text-muted-foreground mb-3">
              НАВЫКИ, КОТОРЫЕ НЕ РАБОТАЮТ «НА ГЛАЗ» — ИХ НУЖНО ПРОЖИТЬ РУКАМИ
            </p>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center items-stretch sm:items-center max-w-4xl mx-auto">
              <Button
                type="button"
                size="lg"
                variant="outline"
                className="w-full sm:flex-1 border-white/25 bg-background/70 backdrop-blur-md text-foreground hover:bg-background/90 hover:border-accent/50 font-heading tracking-wide py-5"
                onClick={() => scrollToId("civil")}
              >
                Я для себя
              </Button>
              <Button
                type="button"
                size="lg"
                variant="outline"
                className="w-full sm:flex-1 border-white/25 bg-background/70 backdrop-blur-md text-foreground hover:bg-background/90 hover:border-accent/50 font-heading tracking-wide py-5"
                onClick={() => scrollToId("military")}
              >
                Я для службы / работы
              </Button>
              <Button
                type="button"
                size="lg"
                className="w-full sm:flex-1 bg-cta-gradient text-accent-foreground font-heading tracking-wider shadow-cta hover:opacity-95 py-5"
                onClick={() => openQuiz()}
              >
                Подобрать курс
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section className="py-12 md:py-20 px-4 md:px-8 border-b border-border/60 bg-card/40">
        <div className="container mx-auto">
          <AnimatedSection>
            <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-foreground text-center mb-2 md:mb-4">
              Почему нам <span className="text-gradient">доверяют</span>
            </h2>
            <p className="text-center text-muted-foreground text-sm max-w-2xl mx-auto mb-8 md:mb-12 leading-relaxed">
              То, что видят люди после первой же отработки.
            </p>
          </AnimatedSection>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4">
            {trustItems.map((item, i) => (
              <AnimatedSection key={item.title} delay={i * 0.06}>
                <div className="h-full rounded-lg border border-border bg-card-gradient p-4 md:p-5 hover:border-accent/35 hover:shadow-glow transition-all duration-300">
                  <item.icon className="w-8 h-8 text-accent mb-3" />
                  <h3 className="font-heading text-sm md:text-base text-foreground mb-2 leading-snug">{item.title}</h3>
                  <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">{item.text}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* START PATH */}
      <section className="py-12 md:py-20 px-4 md:px-8">
        <div className="container mx-auto max-w-5xl">
          <AnimatedSection>
            <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-foreground text-center mb-8 md:mb-12">
              Не знаете, <span className="text-gradient">с чего начать</span>?
            </h2>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {[
              {
                title: "Научиться помогать в критической ситуации и не растеряться",
                hint: "Первая помощь и такмед под гражданские и служебные сценарии",
                track: "help",
              },
              {
                title: "Повысить личную безопасность",
                hint: "Женская безопасность, уверенность в городе и быту",
                track: "safety",
              },
              {
                title: "Прикладная тактика, огневая подготовка, пистолет",
                hint: "Силовой трек: от базы до полевых форматов",
                track: "tactical",
              },
            ].map((card, i) => (
              <AnimatedSection key={card.track} delay={i * 0.08}>
                <Link
                  to={`/courses?track=${card.track}`}
                  className="group block h-full rounded-lg border border-border bg-card-gradient p-5 md:p-6 hover:border-accent/45 hover:-translate-y-0.5 hover:shadow-glow transition-all duration-300"
                >
                  <h3 className="font-heading text-base md:text-lg text-foreground mb-2 leading-snug group-hover:text-accent transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">{card.hint}</p>
                  <span className="font-heading text-xs tracking-widest text-accent flex items-center gap-1">
                    Смотреть курсы <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </div>
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
      <section className="py-16 md:py-28 px-4 md:px-8 bg-[hsl(220,18%,8%)] border-y border-border/80">
        <div className="container mx-auto">
          <AnimatedSection>
            <h2 className="font-heading text-2xl sm:text-3xl md:text-5xl font-bold text-foreground text-center mb-3 sm:mb-4">
              Почему это <span className="text-gradient">важно</span>
            </h2>
            <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-10 md:mb-16 text-sm sm:text-base leading-relaxed">
              Не про страх ради страха — про реальные разрывы между «ждать помощь» и «сделать самому».
            </p>
          </AnimatedSection>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              {
                icon: AlertTriangle,
                title: "Скорая всегда успевает",
                text: (
                  <>
                    Это миф. <strong className="text-accent font-semibold">Ошибка стоит минут</strong> — и дальше уже не «лечение», а шанс.
                  </>
                ),
              },
              {
                icon: Heart,
                title: "На трассе помочь можете только вы",
                text: (
                  <>
                    Пока едет бригада, <strong className="text-accent font-semibold">решения принимаете вы</strong> — или никто.
                  </>
                ),
              },
              {
                icon: Shield,
                title: "Улица не про «вдруг повезёт»",
                text: (
                  <>
                    Нужна <strong className="text-accent font-semibold">трезвая модель поведения</strong>, а не надежда, что «обойдётся».
                  </>
                ),
              },
              {
                icon: Target,
                title: "Вдали от города — на себя",
                text: (
                  <>
                    Без связи и инфраструктуры <strong className="text-accent font-semibold">рассчитывать придётся на себя</strong> — это не походный романтизм, это математика.
                  </>
                ),
              },
            ].map((item, i) => (
              <AnimatedSection key={i} delay={i * 0.1}>
                <div className="bg-card-gradient border border-border rounded-lg p-6 md:p-7 hover:border-accent/30 hover:shadow-glow transition-all duration-300 h-full min-h-[220px] flex flex-col">
                  <item.icon className="w-10 h-10 text-accent mb-4 shrink-0" />
                  <h3 className="font-heading text-lg md:text-xl font-semibold text-foreground mb-3 leading-tight">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed flex-1">{item.text}</p>
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
      <section id="instructors" className="py-16 md:py-28 px-4 md:px-8 bg-card">
        <div className="container mx-auto">
          <AnimatedSection>
            <h2 className="font-heading text-2xl sm:text-3xl md:text-5xl font-bold text-foreground text-center mb-8 md:mb-16">
              <span className="text-gradient">Инструкторы</span>
            </h2>
          </AnimatedSection>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-6 max-w-7xl mx-auto">
            {instructorsData.map((inst, i) => (
              <AnimatedSection key={i} delay={i * 0.08}>
                <div className="text-left p-4 sm:p-5 bg-card-gradient border border-border rounded-lg hover:border-accent/35 hover:shadow-glow transition-all duration-300 h-full min-h-[420px] flex flex-col">
                  <div className="w-20 h-20 rounded-full mb-4 overflow-hidden border-2 border-accent/30 shrink-0 mx-auto sm:mx-0">
                    <img src={inst.photo} alt={inst.name} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                  <h3 className="font-heading text-sm sm:text-base font-semibold text-foreground leading-tight text-center sm:text-left">{inst.name}</h3>
                  <p className="text-[11px] sm:text-xs text-accent mb-2 text-center sm:text-left font-heading tracking-wide">{inst.role}</p>
                  <p className="text-xs text-foreground/90 leading-snug mb-1">
                    <span className="text-muted-foreground font-heading text-[10px] uppercase tracking-wider">Специализация</span>
                    <br />
                    {inst.specialization}
                  </p>
                  <p className="text-[11px] text-muted-foreground mb-3">{inst.experienceLabel}</p>
                  <div className="flex flex-wrap gap-1.5 mb-4 flex-1 content-start">
                    {inst.directions.map((d) => (
                      <span key={d} className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground border border-border">
                        {d}
                      </span>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-auto w-full border-border text-muted-foreground hover:text-foreground hover:border-accent/40 font-heading text-xs tracking-wider"
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
      <section className="py-16 md:py-28 px-4 md:px-8 bg-card/30">
        <div className="container mx-auto max-w-6xl">
          <AnimatedSection>
            <h2 className="font-heading text-2xl sm:text-3xl md:text-5xl font-bold text-foreground text-center mb-3">
              Реальные <span className="text-gradient">отзывы</span>
            </h2>
            <p className="text-center text-muted-foreground text-sm mb-10 md:mb-14 max-w-2xl mx-auto">
              ​
            </p>
          </AnimatedSection>

          {(["civil", "military"] as const).map((segment) => (
            <div key={segment} className="mb-12 last:mb-0">
              <h3 className="font-heading text-xs tracking-[0.25em] text-accent text-center mb-6">
                {segment === "civil" ? "ГРАЖДАНСКИЕ ФОРМАТЫ" : "СИЛОВОЙ ТРЕК"}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {[
                  {
                    text: "На трассе попал в ДТП. Пострадавший истекал кровью. Я наложил турникет за 15 секунд — как на тренировке. Врачи сказали: ещё 3 минуты — и было бы поздно.",
                    author: "Алексей, 34 года",
                    course: "Тактическая медицина",
                    outcome: "Применил алгоритм на дороге — время работало на пострадавшего",
                    type: "civil" as const,
                  },
                  {
                    text: "Дочь подавилась на площадке. Я не практически без паники — сделала всё, как учили. Через 10 секунд она дышала.",
                    author: "Мария, 28 лет",
                    course: "Первая помощь",
                    outcome: "Спокойные действия вместо паники",
                    type: "civil" as const,
                  },
                  {
                    text: "После курса тактики действовал уверенно. Знал, как работать в группе, как входить в помещение, как прикрывать. Это не теория — это навык.",
                    author: "Сергей, 29 лет",
                    course: "Тактическая подготовка",
                    outcome: "Уверенная работа в составе звена",
                    type: "military" as const,
                  },
                  {
                    text: "Освежил работу с АК и манипуляции под стрессом — на учениях меньше шума в голове, больше автоматизма и безопасности обращения.",
                    author: "Иван, 32 года",
                    course: "Оператор АК",
                    outcome: "Спокойнее техника под нагрузкой",
                    type: "military" as const,
                  },
                  {
                    text: "Прошла женскую безопасность. Теперь иначе смотрю на привычные маршруты. Вижу опасности, знаю, как реагировать. Это спокойствие, а не паранойя.",
                    author: "Екатерина, 31 год",
                    course: "Женская безопасность",
                    outcome: "Иначе читаю среду и риски",
                    type: "civil" as const,
                  },
                ]
                  .filter((s) => s.type === segment)
                  .map((story, i) => (
                    <AnimatedSection key={story.author} delay={i * 0.08}>
                      <div
                        className={`rounded-lg p-6 border h-full min-h-[260px] flex flex-col transition-all duration-300 hover:border-accent/35 hover:shadow-glow ${
                          story.type === "civil" ? "bg-civil border-[hsl(40,5%,80%)]" : "bg-card-gradient border-border"
                        }`}
                      >
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <span
                            className={`text-[10px] font-heading tracking-wider uppercase px-2 py-0.5 rounded border ${
                              story.type === "civil" ? "border-civil-muted text-civil" : "border-border text-muted-foreground"
                            }`}
                          >
                            {story.course}
                          </span>
                          <div className="flex gap-0.5">
                            {[...Array(5)].map((_, j) => (
                              <Star key={j} className="w-3 h-3 fill-accent text-accent" />
                            ))}
                          </div>
                        </div>
                        <p className={`leading-relaxed mb-4 text-sm flex-1 ${story.type === "civil" ? "text-civil" : "text-foreground"}`}>«{story.text}»</p>
                        <div className={`text-xs font-medium mb-2 ${story.type === "civil" ? "text-civil" : "text-accent"}`}>Итог: {story.outcome}</div>
                        <div>
                          <p className={`font-heading font-semibold text-sm ${story.type === "civil" ? "text-civil" : "text-foreground"}`}>{story.author}</p>
                        </div>
                      </div>
                    </AnimatedSection>
                  ))}
              </div>
            </div>
          ))}
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
              { step: "03", title: "Стресс-факторы", text: "Давление, ограниченное время, шум, истерики окружающих. Как в реальной ситуации.", icon: AlertTriangle },
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
                <AccordionItem
                  key={i}
                  value={`faq-${i}`}
                  className="bg-card-gradient border border-border rounded-lg px-6 data-[state=open]:border-accent/35 data-[state=open]:shadow-glow transition-all duration-300"
                >
                  <AccordionTrigger className="font-heading text-foreground text-left hover:no-underline py-5 hover:text-accent/90 transition-colors">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed pb-5 text-sm md:text-[15px]">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </AnimatedSection>
        </div>
      </section>

      {/* CONTACT / CTA */}
      <section id="contact-cta" className="py-16 md:py-28 px-4 md:px-8 bg-gradient-to-b from-card to-background border-t border-border">
        <div className="container mx-auto max-w-3xl text-center">
          <AnimatedSection>
            <h2 className="font-heading text-2xl sm:text-3xl md:text-5xl font-bold text-foreground mb-4 sm:mb-5 leading-tight">
              Не ждите, пока <span className="text-gradient">станет поздно</span>
            </h2>
            <p className="text-muted-foreground mb-8 sm:mb-10 text-sm sm:text-lg leading-relaxed max-w-2xl mx-auto">
              Оставьте заявку — поможем подобрать курс под ваш уровень, задачу и ближайшую доступную дату.
            </p>
          </AnimatedSection>
          <AnimatedSection delay={0.1}>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-6 sm:mb-8">
              <Button
                type="button"
                onClick={() => openBooking()}
                size="lg"
                className="w-full sm:w-auto bg-cta-gradient text-accent-foreground font-heading text-base sm:text-lg tracking-wider shadow-cta hover:opacity-95 px-8 sm:px-10 py-5 sm:py-6"
              >
                Записаться
              </Button>
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => openQuiz()}
                className="w-full sm:w-auto border-border text-foreground hover:bg-secondary font-heading tracking-wider px-8 py-5 sm:py-6"
              >
                Подобрать курс
              </Button>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <a href="https://t.me/ErmakCenter" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto border-border text-foreground hover:border-accent/40 hover:bg-secondary/80 font-heading tracking-wider gap-2 px-6 sm:px-8 py-4 sm:py-5 transition-all"
                >
                  <Send className="w-4 h-4" /> Написать в Telegram
                </Button>
              </a>
              <a href="tel:+79994675684" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto border-border text-foreground hover:border-accent/40 hover:bg-secondary/80 font-heading tracking-wider gap-2 px-6 sm:px-8 py-4 sm:py-5 transition-all"
                >
                  <Phone className="w-4 h-4" /> Позвонить
                </Button>
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
};

export default Index;
