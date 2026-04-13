import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLeadUi } from "@/contexts/LeadUiContext";

const MobileStickyCta = () => {
  const { pathname } = useLocation();
  const { openBooking, openQuiz } = useLeadUi();

  if (pathname !== "/" && pathname !== "/courses") return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 md:hidden border-t border-border bg-background/95 backdrop-blur-md shadow-[0_-8px_30px_hsl(0_0%_0%/0.35)]">
      <div className="flex gap-2 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <Button type="button" className="flex-1 bg-cta-gradient text-accent-foreground font-heading tracking-wider shadow-cta text-sm" onClick={() => openBooking()}>
          Записаться
        </Button>
        <Button
          type="button"
          variant="outline"
          className="flex-1 border-border text-foreground font-heading tracking-wide text-sm hover:bg-secondary"
          onClick={() => openQuiz()}
        >
          Подобрать курс
        </Button>
      </div>
    </div>
  );
};

export default MobileStickyCta;
