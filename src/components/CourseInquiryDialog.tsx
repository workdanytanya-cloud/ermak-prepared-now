import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { sendCourseInquiry, type InquiryContactType, type InquiryPhoneMethod } from "@/lib/leads";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  courseTitle: string;
  courseShortTitle: string;
}

const phoneMethodOptions: { value: InquiryPhoneMethod; label: string }[] = [
  { value: "call", label: "Перезвонить" },
  { value: "telegram", label: "Telegram" },
  { value: "max", label: "MAX" },
  { value: "sms", label: "СМС" },
];

const CourseInquiryDialog = ({ open, onOpenChange, courseTitle, courseShortTitle }: Props) => {
  const [contactType, setContactType] = useState<InquiryContactType>("phone");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneMethod, setPhoneMethod] = useState<InquiryPhoneMethod>("call");
  const [question, setQuestion] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) {
      // Reset state shortly after closing for snappier reopen
      const t = window.setTimeout(() => {
        setContactType("phone");
        setEmail("");
        setPhone("");
        setPhoneMethod("call");
        setQuestion("");
        setSubmitted(false);
        setLoading(false);
      }, 150);
      return () => window.clearTimeout(t);
    }
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (contactType === "email") {
      const trimmed = email.trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
        toast.error("Введите корректный email");
        return;
      }
    } else {
      const digits = phone.replace(/\D/g, "");
      if (digits.length < 10) {
        toast.error("Введите корректный номер телефона");
        return;
      }
    }

    setLoading(true);
    try {
      sendCourseInquiry({
        courseTitle,
        contactType,
        email: contactType === "email" ? email.trim() : undefined,
        phone: contactType === "phone" ? phone.trim() : undefined,
        phoneMethod: contactType === "phone" ? phoneMethod : undefined,
        question: question.trim() || undefined,
      });
      setSubmitted(true);
    } catch {
      toast.error("Не удалось отправить — попробуйте ещё раз");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border max-w-md data-[state=open]:animate-in data-[state=open]:zoom-in-95 duration-200">
        {submitted ? (
          <div className="text-center py-6">
            <DialogTitle className="font-heading text-xl text-foreground mb-3">Запрос отправлен</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Свяжемся с вами выбранным способом и сообщим ближайшую дату курса.
            </DialogDescription>
            <Button
              onClick={() => onOpenChange(false)}
              className="mt-4 bg-cta-gradient text-accent-foreground font-heading shadow-cta"
            >
              Хорошо
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="font-heading text-lg text-foreground">
                Уточнить дату: {courseShortTitle}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Оставьте удобный способ связи — мы сообщим ближайшую дату курса.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 mt-1">
              <div className="space-y-2">
                <Label className="text-foreground text-sm">Куда удобнее получить ответ?</Label>
                <RadioGroup
                  value={contactType}
                  onValueChange={(v) => setContactType(v as InquiryContactType)}
                  className="grid grid-cols-2 gap-2"
                >
                  {[
                    { value: "phone", label: "На телефон" },
                    { value: "email", label: "На почту" },
                  ].map((opt) => {
                    const checked = contactType === opt.value;
                    return (
                      <Label
                        key={opt.value}
                        htmlFor={`inquiry-contact-${opt.value}`}
                        className={`flex items-center gap-2 border rounded-md p-2.5 cursor-pointer text-sm transition-colors ${
                          checked ? "border-accent bg-accent/5" : "border-border hover:border-accent/60"
                        }`}
                      >
                        <RadioGroupItem id={`inquiry-contact-${opt.value}`} value={opt.value} />
                        {opt.label}
                      </Label>
                    );
                  })}
                </RadioGroup>
              </div>

              {contactType === "email" ? (
                <div className="space-y-1.5">
                  <Label htmlFor="inquiry-email" className="text-foreground text-sm">
                    Ваш email
                  </Label>
                  <Input
                    id="inquiry-email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@mail.ru"
                    className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                  />
                </div>
              ) : (
                <>
                  <div className="space-y-1.5">
                    <Label htmlFor="inquiry-phone" className="text-foreground text-sm">
                      Ваш телефон
                    </Label>
                    <Input
                      id="inquiry-phone"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+7 ___ ___ __ __"
                      className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-foreground text-sm">Как ответить?</Label>
                    <RadioGroup
                      value={phoneMethod}
                      onValueChange={(v) => setPhoneMethod(v as InquiryPhoneMethod)}
                      className="grid grid-cols-2 gap-2"
                    >
                      {phoneMethodOptions.map((opt) => {
                        const checked = phoneMethod === opt.value;
                        return (
                          <Label
                            key={opt.value}
                            htmlFor={`inquiry-method-${opt.value}`}
                            className={`flex items-center gap-2 border rounded-md p-2.5 cursor-pointer text-sm transition-colors ${
                              checked ? "border-accent bg-accent/5" : "border-border hover:border-accent/60"
                            }`}
                          >
                            <RadioGroupItem id={`inquiry-method-${opt.value}`} value={opt.value} />
                            {opt.label}
                          </Label>
                        );
                      })}
                    </RadioGroup>
                  </div>
                </>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="inquiry-question" className="text-foreground text-sm">
                  Ваш вопрос (необязательно)
                </Label>
                <Textarea
                  id="inquiry-question"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Например: интересует ближайший поток для гражданских"
                  rows={3}
                  className="bg-input border-border text-foreground placeholder:text-muted-foreground resize-none"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-cta-gradient text-accent-foreground font-heading tracking-wider shadow-cta hover:opacity-90"
              >
                {loading ? "Отправка..." : "Отправить запрос"}
              </Button>

              <p className="text-[11px] text-center text-muted-foreground leading-snug">
                Нажимая кнопку, вы соглашаетесь на обработку персональных данных для связи по заявке.
              </p>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CourseInquiryDialog;
