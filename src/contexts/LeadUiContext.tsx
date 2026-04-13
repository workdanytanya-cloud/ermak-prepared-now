import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import BookingForm from "@/components/BookingForm";
import QuizModal from "@/components/QuizModal";

type LeadUi = {
  openBooking: (courseId?: string) => void;
  openQuiz: () => void;
};

const LeadUiContext = createContext<LeadUi | null>(null);

export function LeadUiProvider({ children }: { children: ReactNode }) {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [preselectedCourse, setPreselectedCourse] = useState<string | undefined>();
  const [quizOpen, setQuizOpen] = useState(false);

  const openBooking = useCallback((courseId?: string) => {
    setPreselectedCourse(courseId);
    setBookingOpen(true);
  }, []);

  const openQuiz = useCallback(() => setQuizOpen(true), []);

  const handleBookingOpenChange = useCallback((open: boolean) => {
    setBookingOpen(open);
    if (!open) setPreselectedCourse(undefined);
  }, []);

  const handleQuizBooking = useCallback((courseId?: string) => {
    setQuizOpen(false);
    openBooking(courseId);
  }, [openBooking]);

  const value = useMemo(() => ({ openBooking, openQuiz }), [openBooking, openQuiz]);

  return (
    <LeadUiContext.Provider value={value}>
      {children}
      <BookingForm open={bookingOpen} onOpenChange={handleBookingOpenChange} preselectedCourse={preselectedCourse} />
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
