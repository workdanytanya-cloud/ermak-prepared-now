import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, Heart, Target, Users, Clock, ChevronRight, Star, AlertTriangle, ArrowRight, HelpCircle, MessageCircle } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import AnimatedSection from "@/components/AnimatedSection";
import CourseCard from "@/components/CourseCard";
import BookingForm from "@/components/BookingForm";
import QuizModal from "@/components/QuizModal";
import { courses } from "@/data/courses";
import heroBg from "@/assets/hero-bg.jpg";
import trainingMedical from "@/assets/training-medical.jpg";
import trainingTactical from "@/assets/training-tactical.jpg";
import trainingWomen from "@/assets/training-women.jpg";

const faqData = [
  {
    q: "Нужен ли опыт, чтобы прийти на курс?",
    a: "Нет. На базовые форматы можно приходить с нуля. Мы начинаем с простого, объясняем порядок, показываем руками и только потом добавляем темп. Если вы без подготовки — это нормально, просто скажите об этом заранее."
  },
  {
    q: "Можно ли прийти без физподготовки?",
    a: "Можно. Мы не делаем отбор «по спорту» на гражданских программах. Нагрузка дозируется, а акцент ставится на правильность действий. В профессиональных форматах уровень выше, но и там программа настраивается под состав группы."
  },
  {
    q: "Что брать с собой на занятие?",
    a: "Обычно — удобную закрытую одежду, воду, блокнот по желанию и спокойный настрой на работу. Если нужен специфический комплект, мы отправляем список заранее, чтобы не было сюрпризов в день тренировки."
  },
  {
    q: "Больше теория или практика?",
    a: "Короткая теория нужна, чтобы не делать опасных ошибок. Но основа — практика. Мы строим занятие так: объяснение, показ, отработка, разбор, повтор. На выходе у вас должен быть рабочий навык, а не только «понятие о теме»."
  },
  {
    q: "Можно ли девушкам на ваши программы?",
    a: "Да. У нас есть и отдельные форматы, и смешанные группы. Мы не делим людей по стереотипам — только по задаче и уровню. Главное, чтобы человеку было понятно, безопасно и полезно."
  },
  {
    q: "Можно ли отправить подростка или ребёнка?",
    a: "Да, но в правильный возрастной формат. Для подростков важна не «жёсткость», а дисциплина, алгоритмы и безопасная практика. Мы всегда обсуждаем это с родителями до старта."
  },
  {
    q: "Есть ли корпоративные и групповые форматы?",
    a: "Да. Мы делаем отдельные программы для компаний, организаций и команд. Можно собрать занятие под конкретную задачу: первая помощь на объекте, командное взаимодействие, выездной интенсив."
  },
  {
    q: "Чем вы отличаетесь от «обычных курсов»?",
    a: "Структурой и глубиной отработки. Мы не ограничиваемся лекцией и разовой практикой. Наша задача — чтобы человек мог повторить действия в реальном стрессе, а не только пересказать материал."
  },
  {
    q: "Можно ли собрать программу под задачу подразделения?",
    a: "Да, это стандартная работа для профессионального направления. Вы описываете задачу, состав и уровень группы, а мы предлагаем сценарий с логикой, этапностью и понятным контролем результата."
  },
  {
    q: "Есть ли выездной формат?",
    a: "Есть. Проводим выездные занятия и практики под запрос. Важно заранее согласовать площадку, длительность и цели, чтобы выезд действительно дал результат."
  },
  {
    q: "Как записаться?",
    a: "Самый быстрый путь — кнопка заявки на сайте. Оставляете имя, телефон и запрос. Мы связываемся, задаём 2–3 уточняющих вопроса и предлагаем ближайший уместный формат."
  },
  {
    q: "Как понять, какой курс мне подходит?",
    a: "Если сомневаетесь — это нормально. Опишите вашу ситуацию: для себя, для семьи, для команды или подразделения. Мы подскажем маршрут без «продажи ради продажи»."
  },
];

const Index = () => {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [quizOpen, setQuizOpen] = useState(false);

  const featuredCourses = courses.filter(c => c.level === "beginner" && c.category !== "individual" && c.category !== "events").slice(0, 4);

  return (
    <div className="min-h-screen">
      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroBg} alt="Тренировка ЦСП Ермак" className="w-full h-full object-cover" width={1920} height={1080} />
          <div className="absolute inset-0 bg-background/80" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-transparent to-background" />
        </div>
        <div className="relative container mx-auto px-4 text-center py-32">
          <AnimatedSection>
            <p className="text-primary font-heading text-sm tracking-[0.3em] mb-4">ЦЕНТР СПЕЦИАЛЬНОЙ ПОДГОТОВКИ</p>
            <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl font-bold text-foreground leading-[0.95] mb-6">
              КОГДА СЧЁТ<br />
              <span className="text-gradient">НА СЕКУНДЫ</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 font-body leading-relaxed">
              Навыки, которые нельзя загуглить в критический момент. Первая помощь, тактика, самозащита — от практиков, а не теоретиков.
            </p>
          </AnimatedSection>
          <AnimatedSection delay={0.2}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={() => setBookingOpen(true)} size="lg" className="bg-cta-gradient text-accent-foreground font-heading text-lg tracking-wider shadow-cta hover:opacity-90 animate-pulse-glow px-8 py-6">
                Записаться на курс
              </Button>
              <Button onClick={() => setQuizOpen(true)} variant="outline" size="lg" className="border-primary/50 text-foreground font-heading text-lg tracking-wider hover:bg-primary/10 px-8 py-6">
                Проверить свою готовность
              </Button>
            </div>
          </AnimatedSection>
          <AnimatedSection delay={0.4}>
            <div className="flex justify-center gap-8 md:gap-16 mt-16 text-center">
              {[
                { num: "1000+", label: "Выпускников" },
                { num: "50+", label: "Курсов проведено" },
                { num: "15", label: "Лет опыта" },
              ].map((s, i) => (
                <div key={i}>
                  <span className="text-3xl md:text-4xl font-heading font-bold text-foreground">{s.num}</span>
                  <span className="block text-xs text-muted-foreground mt-1">{s.label}</span>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* PAIN POINTS */}
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
              { icon: Target, title: "Вдали от цивилизации", text: "Чаще всего непредвиденные обстоятельства случаются именно тогда, когда под рукой ничего нет. Поход, рыбалка, пикник. Связи нет, помощь далеко. Всё зависит только от вас." },
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

      {/* FOR WHOM */}
      <section className="section-padding">
        <div className="container mx-auto">
          <AnimatedSection>
            <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground text-center mb-16">
              Для кого <span className="text-gradient">наши курсы</span>
            </h2>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { img: trainingMedical, title: "Гражданские", items: ["Родители, которые хотят защитить семью", "Водители — первая помощь при ДТП", "Туристы и путешественники", "Все, кто ценит свою безопасность"], cta: "Курсы для начинающих" },
              { img: trainingTactical, title: "Силовые структуры", items: ["Действующие военнослужащие", "Сотрудники охранных предприятий", "Контрактники и добровольцы", "Резервисты"], cta: "Продвинутые курсы" },
              { img: trainingWomen, title: "Женщины", items: ["Самозащита без боевых искусств", "Безопасное поведение в городе", "Психологическая подготовка", "Юридические аспекты самообороны"], cta: "Женская безопасность" },
            ].map((seg, i) => (
              <AnimatedSection key={i} delay={i * 0.15}>
                <div className="group bg-card-gradient border border-border rounded-lg overflow-hidden hover:border-primary/30 transition-all">
                  <div className="h-52 overflow-hidden">
                    <img src={seg.img} alt={seg.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-6">
                    <h3 className="font-heading text-xl font-semibold text-foreground mb-4">{seg.title}</h3>
                    <ul className="space-y-2 mb-6">
                      {seg.items.map((item, j) => (
                        <li key={j} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <ChevronRight className="w-4 h-4 text-primary mt-0.5 shrink-0" /> {item}
                        </li>
                      ))}
                    </ul>
                    <Link to="/courses">
                      <Button variant="outline" className="w-full border-primary/30 text-foreground hover:bg-primary/10 font-heading tracking-wider">
                        {seg.cta}
                      </Button>
                    </Link>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT YOU GET */}
      <section className="section-padding bg-card">
        <div className="container mx-auto">
          <AnimatedSection>
            <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground text-center mb-16">
              Что вы <span className="text-gradient">получите</span>
            </h2>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Target, title: "Реальные навыки", text: "Не теория из учебника. Практика на реальных сценариях, отработанная до автоматизма." },
              { icon: Shield, title: "Уверенность", text: "Вы будете знать, что делать. Не надеяться на авось, а действовать." },
              { icon: Users, title: "Контроль ситуации", text: "В любой критической ситуации — от ДТП до нападения — вы берёте ситуацию в свои руки." },
            ].map((item, i) => (
              <AnimatedSection key={i} delay={i * 0.1}>
                <div className="text-center p-8">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                    <item.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-heading text-xl font-semibold text-foreground mb-3">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{item.text}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED COURSES */}
      <section className="section-padding">
        <div className="container mx-auto">
          <AnimatedSection>
            <div className="flex items-end justify-between mb-12">
              <div>
                <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground">
                  Наши <span className="text-gradient">курсы</span>
                </h2>
                <p className="text-muted-foreground mt-2">Выберите свой путь к безопасности</p>
              </div>
              <Link to="/courses" className="hidden md:flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors font-medium">
                Все курсы <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredCourses.map((course, i) => (
              <AnimatedSection key={course.id} delay={i * 0.1}>
                <CourseCard course={course} />
              </AnimatedSection>
            ))}
          </div>
          <AnimatedSection>
            <p className="text-center text-sm text-primary mt-8 font-medium">На все курсы доступна без% рассрочка</p>
          </AnimatedSection>
          <div className="mt-4 text-center md:hidden">
            <Link to="/courses">
              <Button variant="outline" className="border-primary/30 text-foreground hover:bg-primary/10 font-heading">
                Все курсы <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* REAL STORIES */}
      <section className="section-padding bg-card">
        <div className="container mx-auto">
          <AnimatedSection>
            <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground text-center mb-16">
              Реальные <span className="text-gradient">истории</span>
            </h2>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              { text: "На трассе попал в ДТП. Пострадавший истекал кровью. Я наложил турникет за 15 секунд — как на тренировке. Врачи потом сказали: ещё 3 минуты — и было бы поздно.", author: "Алексей, 34 года", role: "Выпускник курса «Тактическая медицина»" },
              { text: "Дочь подавилась на детской площадке. Я не паниковала — сделала всё, как учили. Через 10 секунд она дышала. Этот курс — лучшее, что я сделала для своей семьи.", author: "Мария, 28 лет", role: "Выпускница курса «Первая помощь»" },
            ].map((story, i) => (
              <AnimatedSection key={i} delay={i * 0.15}>
                <div className="bg-card-gradient border border-border rounded-lg p-8 hover:border-primary/30 transition-all">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-accent text-accent" />)}
                  </div>
                  <p className="text-foreground leading-relaxed mb-6 italic">«{story.text}»</p>
                  <div>
                    <p className="font-heading font-semibold text-foreground">{story.author}</p>
                    <p className="text-xs text-muted-foreground">{story.role}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* INSTRUCTORS */}
      <section id="instructors" className="section-padding">
        <div className="container mx-auto">
          <AnimatedSection>
            <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground text-center mb-16">
              <span className="text-gradient">Инструкторы</span>
            </h2>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: "Данюкин Андрей Игоревич",
                role: "Руководитель ЦСП «ЕРМАК»",
                exp: "Профессиональный военный, участник боевых действий. Инструктор по армейской тактической стрельбе. Действующий инструктор фонда «Антитеррор» ФСБ России. Стаж работы с детьми более 10 лет. Награждён государственными наградами.",
              },
              {
                name: "Дедов Михаил Владимирович",
                role: "Старший инструктор",
                exp: "Инструкторская деятельность с 2014 года. Участник боевых действий. Прошёл курсы: «Партизан Интенсив» (СПб), инструктор «Волк» (Ростов), тактическая медицина (ВМА им. Кирова). Инструктор по тактико-специальной подготовке.",
              },
              {
                name: "Подоксенов Владимир Александрович",
                role: "Инструктор",
                exp: "ВМА им. Кирова (Москва). Подготовка ТССС (ТАКМЕД), расширенный курс РАТМЕД. Повышение квалификации: Академия Боткина, преподаватель первой помощи «Искрум».",
              },
              {
                name: "Воронков Алексей Евгеньевич",
                role: "Инструктор",
                exp: "Высшее педагогическое, среднее — лечебное дело (фельдшер). Инструктор тактической медицины (ВМА им. Кирова, «Технологии выживания»). Инструктор первой помощи (АГМУ, Сибирский институт безопасности).",
              },
            ].map((inst, i) => (
              <AnimatedSection key={i} delay={i * 0.1}>
                <div className="text-center p-6 bg-card-gradient border border-border rounded-lg hover:border-primary/30 transition-all h-full">
                  <div className="w-20 h-20 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                    <Users className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-heading text-lg font-semibold text-foreground">{inst.name}</h3>
                  <p className="text-sm text-primary mb-3">{inst.role}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{inst.exp}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section-padding bg-card">
        <div className="container mx-auto">
          <AnimatedSection>
            <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground text-center mb-16">
              Как проходит <span className="text-gradient">обучение</span>
            </h2>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Теория", text: "Короткий брифинг. Только то, что нужно знать для практики.", icon: Clock },
              { step: "02", title: "Демонстрация", text: "Инструктор показывает технику. Разбираем нюансы.", icon: Target },
              { step: "03", title: "Практика", text: "Вы отрабатываете навык. Снова и снова, пока не станет автоматизмом.", icon: Shield },
              { step: "04", title: "Сценарий", text: "Реальная ситуация. Стресс, ограниченное время, давление. Как в жизни.", icon: AlertTriangle },
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
            <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground text-center mb-4">
              Частые <span className="text-gradient">вопросы</span>
            </h2>
            <p className="text-muted-foreground text-center mb-12">
              Честные ответы на вопросы, которые мы слышим чаще всего
            </p>
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
            <div className="text-center mt-8">
              <Button onClick={() => setBookingOpen(true)} variant="outline" className="border-primary/30 text-foreground hover:bg-primary/10 font-heading tracking-wider gap-2">
                <MessageCircle className="w-4 h-4" /> Задать свой вопрос
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="section-padding relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-gradient" />
        <div className="relative container mx-auto text-center">
          <AnimatedSection>
            <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground mb-4">
              Не ждите, пока <span className="text-gradient">станет поздно</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-10 text-lg">
              Оставьте заявку — мы подберём курс под ваш уровень и задачи. Бесплатная консультация.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={() => setBookingOpen(true)} size="lg" className="bg-cta-gradient text-accent-foreground font-heading text-lg tracking-wider shadow-cta hover:opacity-90 animate-pulse-glow px-10 py-6">
                Оставить заявку
              </Button>
              <Button onClick={() => setQuizOpen(true)} variant="outline" size="lg" className="border-primary/50 text-foreground font-heading text-lg tracking-wider hover:bg-primary/10 px-10 py-6">
                Пройти тест готовности
              </Button>
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
