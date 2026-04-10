import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { courses } from "@/data/courses";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CheckCircle } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preselectedCourse?: string;
}

const BookingForm = ({ open, onOpenChange, preselectedCourse }: Props) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [courseId, setCourseId] = useState(preselectedCourse || "");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !courseId) {
      toast.error("Заполните все поля");
      return;
    }

    // Save to localStorage as simple CRM
    const apps = JSON.parse(localStorage.getItem("ermak_applications") || "[]");
    apps.push({
      id: crypto.randomUUID(),
      name: name.trim(),
      phone: phone.trim(),
      course: courses.find(c => c.id === courseId)?.title || courseId,
      date: new Date().toLocaleDateString("ru-RU"),
      status: "new",
      comments: [],
      createdAt: new Date().toISOString(),
    });
    localStorage.setItem("ermak_applications", JSON.stringify(apps));

    setSubmitted(true);
    setName("");
    setPhone("");
  };

  const handleClose = () => {
    setSubmitted(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-card border-border max-w-md">
        {submitted ? (
          <div className="text-center py-8">
            <CheckCircle className="w-16 h-16 text-primary mx-auto mb-4" />
            <DialogTitle className="font-heading text-2xl text-foreground mb-2">Место закреплено!</DialogTitle>
            <p className="text-muted-foreground">С вами свяжутся в ближайшее время для подтверждения.</p>
            <Button onClick={handleClose} className="mt-6 bg-cta-gradient text-accent-foreground font-heading shadow-cta">Хорошо</Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="font-heading text-2xl text-foreground">Забронировать место</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <Input placeholder="Ваше имя" value={name} onChange={e => setName(e.target.value)} className="bg-input border-border text-foreground placeholder:text-muted-foreground" />
              <Input placeholder="Телефон" type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="bg-input border-border text-foreground placeholder:text-muted-foreground" />
              <Select value={courseId} onValueChange={setCourseId}>
                <SelectTrigger className="bg-input border-border text-foreground">
                  <SelectValue placeholder="Выберите курс" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  {courses.map(c => (
                    <SelectItem key={c.id} value={c.id}>{c.shortTitle}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button type="submit" className="w-full bg-cta-gradient text-accent-foreground font-heading tracking-wider shadow-cta hover:opacity-90 animate-pulse-glow">
                Забронировать
              </Button>
              <p className="text-xs text-muted-foreground text-center">Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности</p>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BookingForm;
