import { createContext, useCallback, useContext, useMemo, useState, type Context, type ReactNode } from "react";
import BookingForm from "@/components/BookingForm";
import QuizModal from "@/components/QuizModal";

export interface BookingOpenOptions {
  /** Откуда пришёл клик (например, «Квиз», «Главная», «Sticky CTA»). */
  source?: string;
}

type LeadUi = {
  openBooking: (courseId?: string, options?: BookingOpenOptions) => void;
  openQuiz: () => void;
};

type LeadUiContextValue = LeadUi | null;
type LeadUiGlobal = typeof globalThis & {
  __leadUiContext?: Context<LeadUiContextValue>;
};

const leadUiGlobal = globalThis as LeadUiGlobal;
const LeadUiContext = leadUiGlobal.__leadUiContext ?? createContext<LeadUiContextValue>(null);

if (import.meta.env.DEV) {
  leadUiGlobal.__leadUiContext = LeadUiContext;
}

export function LeadUiProvider({ children }: { children: ReactNode }) {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [preselectedCourse, setPreselectedCourse] = useState<string | undefined>();
  const [bookingSourceOverride, setBookingSourceOverride] = useState<string | undefined>();
  const [quizOpen, setQuizOpen] = useState(false);

  const openBooking = useCallback((courseId?: string, options?: BookingOpenOptions) => {
    setPreselectedCourse(courseId);
    setBookingSourceOverride(options?.source);
    setBookingOpen(true);
  }, []);

  const openQuiz = useCallback(() => setQuizOpen(true), []);

  const handleBookingOpenChange = useCallback((open: boolean) => {
    setBookingOpen(open);
    if (!open) {
      setPreselectedCourse(undefined);
      setBookingSourceOverride(undefined);
    }
  }, []);

  const handleQuizBooking = useCallback((courseId?: string) => {
    setQuizOpen(false);
    openBooking(courseId, { source: "Квиз «Подобрать курс»" });
  }, [openBooking]);

  const value = useMemo(() => ({ openBooking, openQuiz }), [openBooking, openQuiz]);

  return (
    <LeadUiContext.Provider value={value}>
      {children}
      <BookingForm
        open={bookingOpen}
        onOpenChange={handleBookingOpenChange}
        preselectedCourse={preselectedCourse}
        sourceOverride={bookingSourceOverride}
      />
      <QuizModal open={quizOpen} onOpenChange={setQuizOpen} onRequestBooking={handleQuizBooking} />
    </LeadUiContext.Provider>
  );
}

export function useLeadUi() {
  const ctx = useContext(LeadUiContext);
  if (!ctx) throw new Error("useLeadUi must be used within LeadUiProvider");
  return ctx;
}

/** @deprecated use useLeadUi */
export const useBooking = useLeadUi;
