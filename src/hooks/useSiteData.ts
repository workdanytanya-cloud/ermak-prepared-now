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
      author?: string;
      age?: string;
      course?: string;
      result_short?: string;
      audience_type?: string;
    }[],
    settings: {} as Record<string, string>,
  };
}
