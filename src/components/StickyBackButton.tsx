import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const StickyBackButton = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Static back button at top */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Назад
      </button>

      {/* Fixed back button on scroll */}
      <AnimatePresence>
        {scrolled && (
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            onClick={() => navigate(-1)}
            className="fixed top-20 left-4 z-40 inline-flex items-center gap-1.5 text-sm bg-background/90 backdrop-blur-md border border-border text-muted-foreground hover:text-foreground px-3 py-2 rounded-full shadow-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Назад
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
};

export default StickyBackButton;
