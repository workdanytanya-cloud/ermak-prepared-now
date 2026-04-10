export type AppStatus = "new" | "in_progress" | "enrolled";

export interface Application {
  id: string;
  name: string;
  phone: string;
  course: string;
  date: string;
  status: AppStatus;
  comments: string[];
  createdAt: string;
}

export const statusLabels: Record<AppStatus, string> = {
  new: "Новая",
  in_progress: "В работе",
  enrolled: "Записан",
};

export const statusColors: Record<AppStatus, string> = {
  new: "bg-accent text-accent-foreground",
  in_progress: "bg-primary text-primary-foreground",
  enrolled: "bg-primary/60 text-primary-foreground",
};
