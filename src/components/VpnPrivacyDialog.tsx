import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ShieldAlert } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** «Отключил VPN» / готов отправить снова — закрыть и повторить submit снаружи */
  onRetryAfterVpnOff: () => void;
  /** Отправить несмотря на риск сети */
  onSubmitAnyway: () => void;
}

/**
 * Предупреждение при признаках VPN/прокси по IP.
 * Не блокирует навсегда — даёт выбор «отключил VPN» или «отправить всё равно».
 */
const VpnPrivacyDialog = ({ open, onOpenChange, onRetryAfterVpnOff, onSubmitAnyway }: Props) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-10 h-10 text-destructive shrink-0" aria-hidden />
            <DialogTitle className="font-heading text-lg text-foreground text-left leading-tight">
              Возможен VPN или прокси
            </DialogTitle>
          </div>
          <DialogDescription className="text-left text-sm text-muted-foreground leading-relaxed pt-2">
            По вашему подключению видны признаки анонимной сети (VPN, прокси или Tor). В таком режиме отправка заявки в
            Telegram и на почту иногда обрывается из‑за смены сети.
            <br />
            <br />
            <strong className="text-foreground">Рекомендуем:</strong> временно отключить VPN, обновить страницу (Ctrl+F5)
            и отправить форму ещё раз.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col sm:flex-col gap-2 sm:gap-2">
          <Button
            type="button"
            className="w-full bg-cta-gradient text-accent-foreground font-heading shadow-cta"
            onClick={() => {
              onOpenChange(false);
              onRetryAfterVpnOff();
            }}
          >
            Отключил VPN — отправить снова
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full border-border"
            onClick={() => {
              onOpenChange(false);
              onSubmitAnyway();
            }}
          >
            Отправить всё равно
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default VpnPrivacyDialog;
