export function useSiteData() {
  return {
    faq: [] as { question: string; answer: string }[],
    instructors: [] as {
      name?: string;
      specialization?: string;
      photo_url?: string;
      experience?: string;
      linked_courses?: string;
      description?: string;
    }[],
    reviews: [] as {
      name?: string;
      text?: string;
      rating?: number;
    }[],
    settings: {} as Record<string, string>,
  };
}
