import { Link } from "react-router-dom";
import { Phone, Mail, MapPin } from "lucide-react";

const Footer = () => (
  <footer id="contacts" className="bg-card border-t border-border">
    <div className="container mx-auto px-4 py-16">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <h3 className="font-heading text-2xl font-bold text-foreground mb-4">ЕРМАК</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Центр Специальной Подготовки. Новосибирск. Учим тому, что реально работает.
          </p>
        </div>

        <div>
          <h4 className="font-heading text-sm font-semibold text-foreground mb-4 tracking-wider">Курсы</h4>
          <div className="flex flex-col gap-2">
            <Link to="/courses" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Каталог курсов</Link>
            <Link to="/courses" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Тактическая медицина</Link>
            <Link to="/courses" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Женская безопасность</Link>
            <Link to="/courses" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Индивидуальные</Link>
          </div>
        </div>

        <div>
          <h4 className="font-heading text-sm font-semibold text-foreground mb-4 tracking-wider">Контакты</h4>
          <div className="flex flex-col gap-3">
            <a href="tel:+79994675684" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <Phone className="w-4 h-4 text-primary" /> +7 999 467 56 84
            </a>
            <a href="mailto:ermakcentrnsk@gmail.com" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <Mail className="w-4 h-4 text-primary" /> ermakcentrnsk@gmail.com
            </a>
            <div className="flex items-start gap-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4 text-primary mt-0.5" /> Красный проспект, 11, Новосибирск
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-heading text-sm font-semibold text-foreground mb-4 tracking-wider">Соцсети</h4>
          <div className="flex flex-col gap-2">
            <a href="https://t.me/ErmakCenter" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Telegram</a>
            <a href="https://vk.com/ermakcentr" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">ВКонтакте</a>
            <a href="https://max.ru/join/huVj5A5o7ptBjq5ibPQpQnpsNGa4MxilwblaupwU4aE" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">MAX</a>
          </div>
        </div>
      </div>

      <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-xs text-muted-foreground">© 2026 ЦСП «ЕРМАК». Все права защищены.</p>
        <div className="flex gap-6">
          <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Политика конфиденциальности</a>
          <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Оферта</a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
