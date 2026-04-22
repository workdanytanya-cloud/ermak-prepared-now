import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ChevronRight, Star, Phone, Send, Shield, Target, Heart, Clock } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import AnimatedSection from "@/components/AnimatedSection";
import CourseCard from "@/components/CourseCard";
import { motion } from "framer-motion";
import { useLeadUi } from "@/contexts/LeadUiContext";
import { useMergedCourses } from "@/hooks/useMergedCourses";
import { useSiteData } from "@/hooks/useSiteData";

const faqData = [
  {
    q: "Нужен ли опыт?",
    a: "Нет для большинства базовых курсов. Если формат продвинутый — это указано в карточке, и мы заранее согласуем входной уровень.",
  },
  {
    q: "Можно ли прийти без физподготовки?",
    a: "Да. Мы не гоняем «на спортзал»: важна техника, безопасность и правильные решения. Нагрузку дозируем под группу.",
  },
  {
    q: "Подойдёт ли курс обычному человеку без службы?",
    a: "Да. Гражданские программы как раз про повседневную жизнь: семья, дорога, работа, город. Силовые форматы — отдельным блоком.",
  },
  {
    q: "Помогаете ли устроиться на контракт?",
    a: "Мы даём прикладную подготовку и сертификаты по программам. Вопросы трудоустройства зависят от работодателя — подскажем, какие курсы чаще всего закрывают пробелы.",
  },
  {
    q: "Можно ли девушкам?",
    a: "Да. Есть женская безопасность и смешанные группы. Условия уточняем заранее, чтобы вам было комфортно.",
  },
  {
    q: "Что брать с собой?",
    a: "Закрытая удобная одежда, вода. Для части курсов нужен камуфляж/берцы — пришлём список после записи.",
  },
  {
    q: "Есть ли корпоративный формат?",
    a: "Да: выезды, тимформаты, интерактив под вашу задачу. Оставьте заявку — соберём программу под срок и состав.",
  },
  {
    q: "Можно ли подарить сертификат?",
    a: "Да, оформим подарочный сертификат на сумму или конкретный курс. Напишите в Telegram или оставьте заявку.",
  },
  {
    q: "Есть ли индивидуальные занятия?",
    a: "Да: персональные тренировки по огневой и такмеду, а также подготовка под узкую задачу.",
  },
  {
    q: "Как понять, какой курс выбрать?",
    a: "Нажмите «Подобрать курс» на главной — короткий квиз подскажет стартовый формат. Или запишитесь на звонок: администратор соберёт маршрут под вашу задачу.",
  },
  {
    q: "Больше теория или практика?",
    a: "Практика — основа. Сначала понятный алгоритм, затем отработка руками, разбор ошибок, повтор до уверенности.",
  },
  {
    q: "Как записаться?",
    a: "Кнопка «Записаться» в шапке, на карточке курса или внизу страницы — оставьте контакты, мы подтвердим дату и место.",
  },
];

const trustItems = [
  { icon: Target, title: "Инструкторы с реальным опытом", text: "Работают по задачам, с которыми сталкивались сами." },
  { icon: Shield, title: "Работаем через практику", text: "Минимум теории, максимум отработки руками." },
  { icon: Heart, title: "Малые группы", text: "Больше внимания каждому участнику и его ошибкам." },
  { icon: Clock, title: "Контроль каждого участника", text: "Доводим действия до точности и стабильности." },
];

const civilCourseIds = [
  "first-aid",
  "women-safety",
  "tactical-medicine-civil",
  "pistol-civil",
  "ak-operator-civil",
  "engineering-civil",
  "field-intensive-civil",
  "weekend-practice-civil",
  "individual-civil",
  "events-civil",
];
const militaryCourseIds = [
  "ak-operator-military",
  "tactical-medicine-military",
  "tactical-training",
  "pistol-military",
  "engineering",
  "field-intensive-military",
  "weekend-practice",
  "individual-military",
  "events-military",
];

const instructorsData = [
  {
    name: "Данюкин Андрей Игоревич",
    role: "Руководитель ЦСП «ЕРМАК»",
    photo: "/instructors/instructor-danyukin.png",
    specialization: "Тактическая и огневая подготовка, работа с группами",
    experienceLabel: "Служебный и инструкторский опыт — многие годы",
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
    photo: "/instructors/instructor-dedov.png",
    specialization: "Рукопашный бой, стрельба, спецподготовка",
    experienceLabel: "Инструктор с 2014 года, участник БД",
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
    photo: "/instructors/instructor-podoksenov.png",
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
    photo: "/instructors/instructor-voronkov.png",
    specialization: "Тактическая медицина и первая помощь",
    experienceLabel: "Педагогическое образование, фельдшер",
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
    photo: "/instructors/audience-women.png",
    specialization: "Личная безопасность женщин, правовой контекст",
    experienceLabel: "Юрист 16+ лет, спорт — ММА /  крав-мага",
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

const Index = () => {
  const { openBooking, openQuiz } = useLeadUi();
  const courses = useMergedCourses();
  const { faq, instructors: apiInstructors, reviews: apiReviews, settings } = useSiteData();
  const [activeInstructor, setActiveInstructor] = useState<number | null>(null);
  const [hoveredSide, setHoveredSide] = useState<"civil" | "military" | null>(null);

  const civilCourses = courses.filter((c) => civilCourseIds.includes(c.id));
  const militaryCourses = courses.filter((c) => militaryCourseIds.includes(c.id));
  const uniqueMilitaryCourses = militaryCourses.filter((c, i, arr) => arr.findIndex((x) => x.id === c.id) === i);
  const catalogCivilCourses = civilCourses;
  const catalogMilitaryCourses = uniqueMilitaryCourses;
  const faqItems = faq.length > 0 ? faq.map((x) => ({ q: x.question, a: x.answer })) : faqData;
  const instructors = apiInstructors.length
    ? apiInstructors.map((x) => ({
        name: x.name || "Инструктор",
        role: x.specialization || "Инструктор",
        photo: x.photo_url || "/placeholder.svg",
        specialization: x.specialization || "Специализация уточняется",
        experienceLabel: x.experience || "Опыт уточняется",
        directions: String(x.linked_courses || "")
          .split(",")
          .map((v: string) => v.trim())
          .filter(Boolean),
        fullExp: x.description || x.experience || "Описание будет добавлено администратором.",
      }))
    : instructorsData;
  const dynamicReviews = apiReviews
    .filter((x) => x?.text && x?.author)
    .map((x) => ({
      text: x.text,
      author: x.age ? `${x.author}, ${x.age}` : x.author,
      course: x.course || "Курс ЦСП ЕРМАК",
      outcome: x.result_short || "Навык применим в реальной ситуации",
      type: x.audience_type === "military" || x.audience_type === "force" ? ("military" as const) : ("civil" as const),
    }));
  const reviewStories =
    dynamicReviews.length > 0
      ? dynamicReviews
      : [
          {
            text: "На трассе попал в ДТП. Пострадавший истекал кровью. Я наложил турникет за 15 секунд — как на тренировке. Врачи сказали: ещё 3 минуты — и было бы поздно.",
            author: "Алексей, 34 года",
            course: "Тактическая медицина",
            outcome: "Применил алгоритм на дороге — время работало на пострадавшего",
            type: "civil" as const,
          },
          {
            text: "Дочь подавилась на площадке. В голове сразу вылез сценарий отработки на курсе — сделала всё, как учили. Через 10 секунд она дышала. Панику окружающих было не передать",
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
        ];
  const telegramLink = settings.social_telegram || "https://t.me/ErmakCenter";
  const phoneValue = settings.phone || "+7 999 467 56 84";
  const phoneLink = `tel:${phoneValue.replace(/[^\d+]/g, "")}`;

  const scrollToId = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen pb-28 md:pb-0">
      {/* SPLIT HERO */}
      <section className="relative min-h-[100svh] flex flex-col overflow-hidden">
        {/* Hero title — static on mobile, absolute on md+ */}
        <div className="relative z-30 pt-20 pb-6 px-4 bg-gradient-to-b from-[hsl(220,20%,7%)] to-[hsl(220,20%,7%)]/80 md:absolute md:top-0 md:left-0 md:right-0 md:bg-none md:pt-20 md:pb-0">
          <div className="container mx-auto text-center max-w-4xl">
            <h1 className="font-heading text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-2">
              Навыки, которые работают в реальных ситуациях - только практика
            </h1>
            <p className="text-[hsl(40,10%,78%)] text-xs sm:text-sm font-body font-normal leading-relaxed md:text-sm">
              Подготовка для гражданских и силовых структур.
              <br className="hidden sm:block" />С практикой, сценариями и отработкой до автоматизма.
            </p>
          </div>
        </div>

        {/* Two halves */}
        <div className="flex flex-col md:flex-row flex-1">
          {/* Civil side */}
          <motion.div
            className="relative flex-1 min-h-[44svh] md:min-h-0 flex items-center justify-center cursor-pointer overflow-hidden"
            animate={{ flex: hoveredSide === "civil" ? 1.06 : hoveredSide === "military" ? 0.94 : 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            onMouseEnter={() => setHoveredSide("civil")}
            onMouseLeave={() => setHoveredSide(null)}
          >
            <div className="absolute inset-0">
              <img
                src="/hero-civil.jpg"
                alt="Гражданская подготовка"
                className="w-full h-full object-cover"
                width={960}
                height={1080}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-[hsl(40,10%,20%)]/70 via-[hsl(40,10%,15%)]/50 to-[hsl(40,10%,10%)]/80" />
            </div>
            <div className="relative z-10 text-center px-4 sm:px-6 py-8 md:py-0 max-w-lg flex flex-col items-center justify-center">
              <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-[0.95] mb-2 sm:mb-4 md:text-2xl">
                ГРАЖДАНСКИЕ
              </h2>
              <p className="text-[hsl(40,10%,72%)] text-xs sm:text-sm md:text-base mb-2 sm:mb-3 font-body font-normal">
                Если рядом станет плохо - Вы знаете, что делать?
              </p>
              <ul className="text-[hsl(40,10%,72%)] text-[11px] sm:text-xs mb-4 sm:mb-6 text-left space-y-1">
                <li className="flex items-center gap-1">
                  <ChevronRight className="w-3 h-3" /> Первая помощь
                </li>
                <li className="flex items-center gap-1">
                  <ChevronRight className="w-3 h-3" /> Личная безопасность
                </li>
                <li className="flex items-center gap-1">
                  <ChevronRight className="w-3 h-3" /> Поведение в опасных ситуациях
                </li>
              </ul>
              <a href="#civil">
                <Button
                  size="lg"
                  className="bg-cta-gradient text-accent-foreground font-heading text-sm sm:text-base tracking-wider shadow-cta hover:opacity-90 px-5 sm:px-7 py-4 sm:py-5"
                >
                  Я для себя
                </Button>
              </a>
            </div>
          </motion.div>

          {/* Military side */}
          <motion.div
            className="relative flex-1 min-h-[44svh] md:min-h-0 flex items-center justify-center cursor-pointer overflow-hidden"
            animate={{ flex: hoveredSide === "military" ? 1.06 : hoveredSide === "civil" ? 0.94 : 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            onMouseEnter={() => setHoveredSide("military")}
            onMouseLeave={() => setHoveredSide(null)}
          >
            <div className="absolute inset-0">
              <img
                src="/hero-military.jpg"
                alt="Подготовка для силовых"
                className="w-full h-full object-cover"
                width={960}
                height={1080}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-[hsl(220,20%,8%)]/80 via-[hsl(220,20%,8%)]/60 to-[hsl(220,20%,8%)]/90" />
            </div>
            <div className="relative z-10 text-center px-4 sm:px-6 py-8 md:py-0 max-w-lg flex flex-col items-center justify-center">
              <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-[0.95] mb-2 sm:mb-4 md:text-2xl">
                СИЛОВЫЕ СТРУКТУРЫ
              </h2>
              <p className="text-[hsl(210,10%,72%)] text-xs sm:text-sm md:text-base mb-2 sm:mb-3 font-body font-normal">
                Ошибки в реальной ситуации стоят слишком дорого.
              </p>
              <ul className="text-[hsl(210,10%,72%)] text-[11px] sm:text-xs mb-4 sm:mb-6 text-left space-y-1">
                <li className="flex items-center gap-1">
                  <ChevronRight className="w-3 h-3" /> Тактическая медицина
                </li>
                <li className="flex items-center gap-1">
                  <ChevronRight className="w-3 h-3" /> Огневая и тактическая подготовка
                </li>
                <li className="flex items-center gap-1">
                  <ChevronRight className="w-3 h-3" /> Работа в условиях риска
                </li>
              </ul>
              <a href="#military">
                <Button
                  size="lg"
                  className="bg-cta-gradient text-accent-foreground font-heading text-sm sm:text-base tracking-wider shadow-cta hover:opacity-90 px-5 sm:px-7 py-4 sm:py-5"
                >
                  Я для службы / работы
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
        {/* Bottom CTA bar — static on mobile to avoid overlap */}
        <div className="relative md:absolute md:bottom-0 md:left-0 md:right-0 z-30 pointer-events-none bg-gradient-to-t from-background via-background/80 to-transparent pt-6 md:pt-12 pb-4 md:pb-6">
          <div className="pointer-events-auto container mx-auto px-3 sm:px-4">
            <p className="text-center font-heading text-[9px] sm:text-[10px] tracking-[0.2em] text-muted-foreground mb-3">
              ОГРАНИЧЕННЫЕ ГРУППЫ. ПРАКТИКА С ИНСТРУКТОРАМИ.
            </p>
            <div className="flex justify-center max-w-md mx-auto">
              <Button
                type="button"
                size="lg"
                className="w-full sm:w-auto bg-white text-[hsl(220,18%,12%)] hover:bg-white/90 font-heading text-sm sm:text-base tracking-wider px-8 sm:px-12 py-5"
                onClick={() => openQuiz()}
              >
                Подобрать курс
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="py-12 md:py-20 px-4 md:px-8 border-b border-border/60 bg-card/40">
        <div className="container mx-auto">
          <AnimatedSection>
            <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-foreground text-center mb-2 md:mb-4">
              РЕАЛЬНАЯ ПОДГОТОВКА, <span className="text-gradient">С НЕОБХОДИМЫМ МИНИМУМОМ</span>
            </h2>
            <p className="text-center text-muted-foreground text-sm max-w-2xl mx-auto mb-8 md:mb-12 leading-relaxed">
              Подготовка под реальные задачи, а не "для отчёта".
            </p>
          </AnimatedSection>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
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

      {/* PAIN BLOCK */}
      <section className="py-16 md:py-28 px-4 md:px-8 bg-[hsl(220,18%,8%)] border-y border-border/80">
        <div className="container mx-auto">
          <AnimatedSection>
            <h2 className="font-heading text-2xl sm:text-3xl md:text-5xl font-bold text-foreground text-center mb-3 sm:mb-4">
              В критической ситуации <span className="text-gradient">мозг отключается - работают только устойчивые навыки</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-10 md:mb-16 text-sm sm:text-base leading-relaxed">
              Потеря контроля = потеря времени. {"\n"}Ошибка = последствия. {"\n"}Отсутствие навыка = ступор.
            </p>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
            {[
              {
                icon: AlertTriangle,
                title: "Гражданским",
                text: <>Скорая может не успеть. Первые минуты - решающие. И именно Вы окажетесь рядом.</>,
              },
              {
                icon: Shield,
                title: "Силовым",
                text: <>В условиях стресса работает не знание - работает навык, доведённый до автоматизма.</>,
              },
            ].map((item, i) => (
              <AnimatedSection key={i} delay={i * 0.1}>
                <div className="bg-card-gradient border border-border rounded-lg p-6 md:p-7 hover:border-accent/30 hover:shadow-glow transition-all duration-300 h-full min-h-[220px] flex flex-col">
                  <item.icon className="w-10 h-10 text-accent mb-4 shrink-0" />
                  <h3 className="font-heading text-lg md:text-xl font-semibold text-foreground mb-3 leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed flex-1">{item.text}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
          <p className="text-center text-sm text-muted-foreground max-w-3xl mx-auto">
            Решение принимается заранее. Когда начнётся критическая ситуация, гуглить будет уже поздно.
          </p>
        </div>
      </section>

      {/* WHAT YOU GET */}
      <section className="py-14 md:py-24 px-4 md:px-8">
        <div className="container mx-auto max-w-6xl">
          <AnimatedSection>
            <h2 className="font-heading text-2xl sm:text-3xl md:text-5xl font-bold text-foreground text-center mb-8 md:mb-12">
              Что Вы <span className="text-gradient">получите</span>
            </h2>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <AnimatedSection>
              <div className="rounded-lg border border-[hsl(40,5%,80%)] bg-civil p-6 md:p-8 h-full">
                <h3 className="font-heading text-xl text-civil mb-4">Обычные граждане</h3>
                <ul className="space-y-2 text-civil-muted text-sm md:text-base">
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 mt-0.5 text-accent" /> Гарантированно остановите кровотечение
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 mt-0.5 text-accent" /> Поймёте, как действовать при ДТП и травмах
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 mt-0.5 text-accent" /> Сможете защитить себя и близких
                  </li>
                </ul>
              </div>
            </AnimatedSection>
            <AnimatedSection delay={0.05}>
              <div className="rounded-lg border border-border bg-card-gradient p-6 md:p-8 h-full">
                <h3 className="font-heading text-xl text-foreground mb-4">Силовые направления</h3>
                <ul className="space-y-2 text-muted-foreground text-sm md:text-base">
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 mt-0.5 text-accent" /> Работа по протоколам в стрессе
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 mt-0.5 text-accent" /> Быстрая оценка обстановки
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 mt-0.5 text-accent" /> Действия без потери времени
                  </li>
                </ul>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* CIVIL COURSES */}
      <section id="civil" className="py-14 md:py-28 px-4 md:px-8 bg-civil">
        <div className="container mx-auto">
          <AnimatedSection>
            <h2 className="font-heading text-2xl sm:text-3xl md:text-5xl font-bold text-civil text-center mb-3 sm:mb-4">
              Гражданские <span className="text-gradient-dark">курсы</span>
            </h2>
            <div className="max-w-2xl mx-auto mb-8 md:mb-12">
              <p className="text-center text-sm sm:text-base text-civil-muted">
                Коротко, по делу. То, что применимо в обычной жизни.
              </p>
            </div>
          </AnimatedSection>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {catalogCivilCourses.map((course, i) => (
              <AnimatedSection key={course.id} delay={i * 0.05}>
                <div className="space-y-2">
                  <CourseCard course={course} lightMode />
                  <p className="text-xs text-civil-muted text-center">Осталось {course.spotsLeft} мест</p>
                </div>
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
              Силовые <span className="text-gradient">структуры</span>
            </h2>
            <div className="max-w-2xl mx-auto mb-8 md:mb-12">
              <p className="text-center text-sm sm:text-base text-military-muted">
                Чёткая отработка решений и действий под нагрузкой.
              </p>
            </div>
          </AnimatedSection>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {catalogMilitaryCourses.map((course, i) => (
              <AnimatedSection key={course.id} delay={i * 0.05}>
                <div className="space-y-2">
                  <CourseCard course={course} />
                  <p className="text-xs text-military-muted text-center">Осталось {course.spotsLeft} мест</p>
                </div>
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
            {instructors.map((inst, i) => (
              <AnimatedSection key={i} delay={i * 0.08}>
                <div className="text-left p-4 sm:p-5 bg-card-gradient border border-border rounded-lg hover:border-accent/35 hover:shadow-glow transition-all duration-300 h-full min-h-[320px] sm:min-h-[420px] flex flex-col">
                  <div className="w-20 h-20 rounded-full mb-4 overflow-hidden border-2 border-accent/30 shrink-0 mx-auto sm:mx-0">
                    <img src={inst.photo} alt={inst.name} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                  <h3 className="font-heading text-sm sm:text-base font-semibold text-foreground leading-tight text-center sm:text-left">
                    {inst.name}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-accent mb-2 text-center sm:text-left font-heading tracking-wide">
                    {inst.role}
                  </p>
                  <p className="text-xs text-foreground/90 leading-snug mb-1">
                    <span className="text-muted-foreground font-heading text-[10px] uppercase tracking-wider">
                      Специализация
                    </span>
                    <br />
                    {inst.specialization}
                  </p>
                  <p className="text-[11px] text-muted-foreground mb-3">{inst.experienceLabel}</p>
                  <div className="flex flex-wrap gap-1.5 mb-4 flex-1 content-start">
                    {inst.directions.map((d) => (
                      <span
                        key={d}
                        className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground border border-border"
                      >
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
                    <img
                      src={instructors[activeInstructor].photo}
                      alt={instructors[activeInstructor].name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <DialogTitle className="font-heading text-lg text-foreground">
                      {instructors[activeInstructor].name}
                    </DialogTitle>
                    <p className="text-sm text-primary">{instructors[activeInstructor].role}</p>
                  </div>
                </div>
              </DialogHeader>
              <p className="text-sm text-muted-foreground leading-relaxed mt-4 whitespace-pre-line">
                {instructors[activeInstructor].fullExp}
              </p>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* REVIEWS */}
      <section className="py-16 md:py-28 px-4 md:px-8 bg-card/30">
        <div className="container mx-auto max-w-6xl">
          <AnimatedSection>
            <h2 className="font-heading text-2xl sm:text-3xl md:text-5xl font-bold text-foreground text-center mb-3">
              После курса всё становится <span className="text-gradient">на свои места</span>
            </h2>
            <p className="text-center text-muted-foreground text-sm mb-10 md:mb-14 max-w-2xl mx-auto">​</p>
          </AnimatedSection>

          {(["civil", "military"] as const).map((segment) => (
            <div key={segment} className="mb-12 last:mb-0">
              <h3 className="font-heading text-xs tracking-[0.25em] text-accent text-center mb-6">
                {segment === "civil" ? "ГРАЖДАНСКИЕ НАПРАВЛЕНИЯ" : "СИЛОВЫЕ НАПРАВЛЕНИЯ"}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {reviewStories
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
                              story.type === "civil"
                                ? "border-civil-muted text-civil"
                                : "border-border text-muted-foreground"
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
                        <p
                          className={`leading-relaxed mb-4 text-sm flex-1 ${story.type === "civil" ? "text-civil" : "text-foreground"}`}
                        >
                          «{story.text}»
                        </p>
                        <div
                          className={`text-xs font-medium mb-2 ${story.type === "civil" ? "text-civil" : "text-accent"}`}
                        >
                          Итог: {story.outcome}
                        </div>
                        <div>
                          <p
                            className={`font-heading font-semibold text-sm ${story.type === "civil" ? "text-civil" : "text-foreground"}`}
                          >
                            {story.author}
                          </p>
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
              Не лекции - <span className="text-gradient">реальные сценарии</span>
            </h2>
            <p className="text-center text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto mb-8 md:-mt-8 md:mb-12">
              Вы не только слушаете. Вы делаете.
            </p>
          </AnimatedSection>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 max-w-5xl mx-auto">
            {[
              {
                step: "01",
                title: "Работа в парах и группах",
                text: "Отработка с партнёром, чтобы закрепить алгоритмы.",
                icon: Target,
              },
              {
                step: "02",
                title: "Имитация реальных ситуаций",
                text: "Сценарии из жизни и служебной практики.",
                icon: Shield,
              },
              {
                step: "03",
                title: "Давление по времени",
                text: "Ограниченное время и стресс-факторы как в реальности.",
                icon: AlertTriangle,
              },
              {
                step: "04",
                title: "Повтор до автоматизма",
                text: "Отработка до состояния, когда не нужно думать.",
                icon: Clock,
              },
            ].map((s, i) => (
              <AnimatedSection key={i} delay={i * 0.1}>
                <div className="text-center">
                  <span className="text-3xl sm:text-5xl font-heading font-bold text-primary/20">{s.step}</span>
                  <h3 className="font-heading text-sm sm:text-lg font-semibold text-foreground mt-1 sm:mt-2 mb-1 sm:mb-2">
                    {s.title}
                  </h3>
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
              {faqItems.map((item, i) => (
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

      {/* SQUEEZE */}
      <section className="py-14 md:py-20 px-4 md:px-8 border-y border-border/60 bg-[hsl(220,18%,8%)]">
        <div className="container mx-auto max-w-4xl text-center">
          <AnimatedSection>
            <h2 className="font-heading text-2xl sm:text-3xl md:text-5xl font-bold text-foreground mb-4">
              Вы либо умеете - либо нет
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base md:text-lg leading-relaxed">
              В момент, когда что-то случится, не будет второго шанса "подготовиться".
              <br className="hidden sm:block" />
              Решение принимается заранее.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* CONTACT / CTA */}
      <section
        id="contact-cta"
        className="py-16 md:py-28 px-4 md:px-8 bg-gradient-to-b from-card to-background border-t border-border"
      >
        <div className="container mx-auto max-w-3xl text-center">
          <AnimatedSection>
            <h2 className="font-heading text-2xl sm:text-3xl md:text-5xl font-bold text-foreground mb-4 sm:mb-5 leading-tight">
              Подберём курс под Вашу ситуацию <span className="text-gradient">за 1 минуту</span>
            </h2>
            <p className="text-muted-foreground mb-8 sm:mb-10 text-sm sm:text-lg leading-relaxed max-w-2xl mx-auto">
              Свяжемся и подскажем, что подойдёт именно Вам.
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
                Оставить заявку
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
              <a href={telegramLink} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto border-border text-foreground hover:border-accent/40 hover:bg-secondary/80 font-heading tracking-wider gap-2 px-6 sm:px-8 py-4 sm:py-5 transition-all"
                >
                  <Send className="w-4 h-4" /> Написать в Telegram
                </Button>
              </a>
              <a href={phoneLink} className="w-full sm:w-auto">
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
