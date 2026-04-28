import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "ermak_exit_intent_shown";
const TG_LINK = "https://t.me/ErmakCenter";
const MAX_LINK = "https://max.ru/join/huVj5A5o7ptBjq5ibPQpQnpsNGa4MxilwblaupwU4aE";
const VK_LINK = "https://vk.com/ermakcentr";

const ExitIntentModal = () => {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  const enabled = useMemo(() => pathname !== "/admin", [pathname]);

  useEffect(() => {
    if (!enabled) return;
    if (sessionStorage.getItem(STORAGE_KEY) === "1") return;

    const showOnce = () => {
      if (sessionStorage.getItem(STORAGE_KEY) === "1") return;
      sessionStorage.setItem(STORAGE_KEY, "1");
      setOpen(true);
    };

    const onMouseOut = (event: MouseEvent) => {
      const to = event.relatedTarget as Node | null;
      if (!to && event.clientY <= 8) showOnce();
    };

    const stateMarker = { exitGuard: true };
    window.history.pushState(stateMarker, "", window.location.href);

    const onPopState = () => {
      if (sessionStorage.getItem(STORAGE_KEY) !== "1") {
        showOnce();
        window.history.pushState(stateMarker, "", window.location.href);
      }
    };

    document.addEventListener("mouseout", onMouseOut);
    window.addEventListener("popstate", onPopState);

    return () => {
      document.removeEventListener("mouseout", onMouseOut);
      window.removeEventListener("popstate", onPopState);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="bg-card border-border max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading text-2xl text-foreground">Заберите это с собой</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground leading-relaxed">
          Даже если сейчас не готовы идти на курс - возьмите знания, которые могут пригодиться.
        </p>
        <p className="text-sm text-foreground leading-relaxed">👉 В канале - разборы, сценарии и реальные ситуации</p>

        <div className="space-y-2">
          <div className="w-full bg-cta-gradient text-accent-foreground font-heading tracking-wider shadow-cta rounded-md py-3 text-center">
            Выберите удобный для себя канал
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <a href={MAX_LINK} target="_blank" rel="noopener noreferrer" className="block">
              <Button type="button" variant="outline" className="w-full border-border text-foreground hover:bg-secondary">
                MAX
              </Button>
            </a>
            <a href={TG_LINK} target="_blank" rel="noopener noreferrer" className="block">
              <Button type="button" variant="outline" className="w-full border-border text-foreground hover:bg-secondary">
                Telegram
              </Button>
            </a>
            <a href={VK_LINK} target="_blank" rel="noopener noreferrer" className="block">
              <Button type="button" variant="outline" className="w-full border-border text-foreground hover:bg-secondary">
                VK
              </Button>
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExitIntentModal;
