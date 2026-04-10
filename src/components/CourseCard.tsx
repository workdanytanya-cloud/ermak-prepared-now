import { Link } from "react-router-dom";
import { Clock, Users, ArrowRight } from "lucide-react";
import { Course, levelLabels } from "@/data/courses";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Props {
  course: Course;
}

const CourseCard = ({ course }: Props) => (
  <div className="group bg-card-gradient border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-glow flex flex-col">
    <div className="relative h-48 overflow-hidden">
      <img
        src={course.image}
        alt={course.title}
        loading="lazy"
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
      {course.spotsLeft <= 5 && (
        <div className="absolute top-3 right-3">
          <Badge className="bg-destructive text-destructive-foreground text-xs font-body">
            Осталось {course.spotsLeft} мест
          </Badge>
        </div>
      )}
      <Badge className="absolute top-3 left-3 bg-secondary text-secondary-foreground text-xs font-body">
        {levelLabels[course.level]}
      </Badge>
    </div>

    <div className="p-5 flex flex-col flex-1">
      <h3 className="font-heading text-lg font-semibold text-foreground mb-2">{course.title}</h3>
      <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">{course.result}</p>

      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {course.duration}</span>
        <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {course.format}</span>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <span className="text-xl font-heading font-bold text-foreground">{course.price.toLocaleString("ru-RU")} ₽</span>
          <span className="text-xs text-muted-foreground block">{course.nextDate}</span>
        </div>
        <Link to={`/course/${course.id}`}>
          <Button size="sm" className="bg-cta-gradient text-accent-foreground font-heading tracking-wider shadow-cta hover:opacity-90 transition-opacity gap-1">
            Подробнее <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </Link>
      </div>
    </div>
  </div>
);

export default CourseCard;
