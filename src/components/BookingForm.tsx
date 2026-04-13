import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMergedCourses } from "@/hooks/useMergedCourses";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CheckCircle, Send } from "lucide-react";
import { saveApplication } from "@/lib/leads";

const TG_URL = "https://t.me/ErmakCenter";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preselectedCourse?: string;
}

const BookingForm = ({ open, onOpenChange, preselectedCourse }: Props) => {
  const courses = useMergedCourses();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [courseId, setCourseId] = useState("");
  const [desiredDate, setDesiredDate] = useState("");
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!open) return;
    setSubmitted(false);
    setCourseId(preselectedCourse ?? "");
  }, [open, preselectedCourse]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !courseId) {
      toast.error("Укажите имя, телефон и курс");
      return;
    }
    const course = courses.find((c) => c.id === courseId);
    saveApplication({
      name: name.trim(),
      phone: phone.trim(),
      course: course?.title || courseId,
      date: new Date().toLocaleDateString("ru-RU"),
      status: "new",
      comments: [],
      desiredDate: desiredDate.trim() || undefined,
      comment: comment.trim() || undefined,
    });

    setSubmitted(true);
    setName("");
    setPhone("");
    setDesiredDate("");
    setComment("");
  };

  const handleDialogChange = (next: boolean) => {
    if (!next) {
      setSubmitted(false);
    }
    onOpenChange(next);
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogContent className="bg-card border-border max-w-md data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 duration-200">
        {submitted ? (
          <div className="text-center py-6">
            <CheckCircle className="w-16 h-16 text-accent mx-auto mb-4" />
            <DialogTitle className="font-heading text-2xl text-foreground mb-2">Заявка отправлена</DialogTitle>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Мы свяжемся с вами и подтвердим детали: дату, формат и место.
            </p>
            <div className="flex flex-col gap-2 mt-8">
              <a href={TG_URL} target="_blank" rel="noopener noreferrer">
                <Button type="button" variant="outline" className="w-full border-accent/40 text-foreground hover:bg-accent/10 font-heading gap-2">
                  <Send className="w-4 h-4" />
                  Написать в Telegram
                </Button>
              </a>
              <Button onClick={() => handleDialogChange(false)} className="w-full bg-cta-gradient text-accent-foreground font-heading shadow-cta">
                Закрыть
              </Button>
            </div>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="font-heading text-2xl text-foreground">Запись на курс</DialogTitle>
              <p className="text-sm text-muted-foreground text-left font-normal pt-1">
                Коротко оставьте контакты — администратор уточнит дату и группу.
              </p>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-2">
              <div className="space-y-2">
                <Label htmlFor="bf-name" className="text-muted-foreground">
                  Имя
                </Label>
                <Input
                  id="bf-name"
                  placeholder="Как к вам обращаться"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                  autoComplete="name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bf-phone" className="text-muted-foreground">
                  Телефон
                </Label>
                <Input
                  id="bf-phone"
                  placeholder="+7 …"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                  autoComplete="tel"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground">Курс</Label>
                <Select value={courseId} onValueChange={setCourseId}>
                  <SelectTrigger className="bg-input border-border text-foreground">
                    <SelectValue placeholder="Выберите курс" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border max-h-[280px]">
                    {courses.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.shortTitle}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bf-date" className="text-muted-foreground">
                  Желаемая дата старта
                </Label>
                <Input
                  id="bf-date"
                  placeholder="Например: апрель / ближайший поток / конкретные даты"
                  value={desiredDate}
                  onChange={(e) => setDesiredDate(e.target.value)}
                  className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bf-comment" className="text-muted-foreground">
                  Комментарий <span className="text-muted-foreground/60">(необязательно)</span>
                </Label>
                <Textarea
                  id="bf-comment"
                  placeholder="Опыт, ограничения, корпоратив, количество человек…"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="bg-input border-border text-foreground placeholder:text-muted-foreground min-h-[72px] resize-none"
                />
              </div>
              <Button type="submit" className="w-full bg-cta-gradient text-accent-foreground font-heading tracking-wider shadow-cta hover:opacity-95 transition-opacity">
                Отправить заявку
              </Button>
              <p className="text-[11px] text-muted-foreground text-center leading-snug">
                Нажимая кнопку, вы соглашаетесь на обработку персональных данных для связи по заявке.
              </p>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BookingForm;
