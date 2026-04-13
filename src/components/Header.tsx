import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useLeadUi } from "@/contexts/LeadUiContext";

const navItems = [
  { label: "Главная", href: "/" },
  { label: "Курсы", href: "/courses" },
  { label: "Инструкторы", href: "/#instructors" },
  { label: "Контакты", href: "/#contacts" },
];

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { openBooking } = useLeadUi();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setIsOpen(false); }, [location]);

  const handleNavClick = (e: React.MouseEvent, href: string) => {
    if (href.startsWith("/#")) {
      e.preventDefault();
      const hash = href.substring(1);
      if (location.pathname === "/") {
        const el = document.querySelector(hash);
        el?.scrollIntoView({ behavior: "smooth" });
      } else {
        navigate("/" + hash);
      }
    }
  };

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-background/95 backdrop-blur-md border-b border-border" : "bg-transparent"}`}>
        <div className="container mx-auto flex items-center justify-between h-16 md:h-20 px-4">
          <Link to="/" className="font-heading text-2xl md:text-3xl font-bold tracking-wider text-foreground">
            ЕРМАК
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link key={item.href} to={item.href} onClick={(e) => handleNavClick(e, item.href)} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <a href="tel:+79994675684" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <Phone className="w-4 h-4" />
              +7 999 467 56 84
            </a>
            <Button onClick={() => openBooking()} className="bg-cta-gradient text-accent-foreground font-heading tracking-wider shadow-cta hover:opacity-90 transition-opacity">
              Записаться
            </Button>
          </div>

          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-foreground">
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-background/95 backdrop-blur-md border-b border-border"
            >
              <div className="container mx-auto px-4 py-6 flex flex-col gap-4">
                {navItems.map((item) => (
                  <Link key={item.href} to={item.href} onClick={(e) => handleNavClick(e, item.href)} className="text-lg font-heading text-foreground py-2">
                    {item.label}
                  </Link>
                ))}
                <a href="tel:+79994675684" className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="w-4 h-4" /> +7 999 467 56 84
                </a>
                <Button onClick={() => { setIsOpen(false); openBooking(); }} className="w-full bg-cta-gradient text-accent-foreground font-heading tracking-wider shadow-cta">
                  Записаться
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

    </>
  );
};

export default Header;
