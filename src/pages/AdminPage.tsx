import { useState, useEffect } from "react";
import { Application, AppStatus, statusLabels, statusColors } from "@/data/applications";
import { courses as defaultCourses } from "@/data/courses";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { MessageSquare, Filter, Lock, LayoutList, BookOpen } from "lucide-react";
import { mergeCourses, updateCoursePatch, getCoursePatches, setCoursePatches, type CoursePatch } from "@/lib/courseStorage";

const ADMIN_PASSWORD = "ermak2026";

type Tab = "leads" | "courses";

const AdminPage = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [apps, setApps] = useState<Application[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [tab, setTab] = useState<Tab>("leads");
  const [courseDrafts, setCourseDrafts] = useState<Record<string, CoursePatch>>({});

  useEffect(() => {
    if (sessionStorage.getItem("ermak_admin_auth") === "true") {
      setAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (!authenticated) return;
    const stored = JSON.parse(localStorage.getItem("ermak_applications") || "[]") as Application[];
    setApps(
      Array.isArray(stored)
        ? stored.map((a) => ({ ...a, comments: Array.isArray(a.comments) ? a.comments : [] }))
        : [],
    );
  }, [authenticated]);

  useEffect(() => {
    if (!authenticated || tab !== "courses") return;
    setCourseDrafts(getCoursePatches());
  }, [authenticated, tab]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
      sessionStorage.setItem("ermak_admin_auth", "true");
      setError("");
    } else {
      setError("Неверный пароль");
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex items-center justify-center">
        <div className="bg-card-gradient border border-border rounded-lg p-8 max-w-sm w-full mx-4">
          <div className="text-center mb-6">
            <Lock className="w-12 h-12 text-accent mx-auto mb-4" />
            <h1 className="font-heading text-2xl font-bold text-foreground">Вход в админку</h1>
            <p className="text-sm text-muted-foreground mt-2">Доступ только для администраторов</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              type="password"
              placeholder="Пароль"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              className="bg-input border-border text-foreground"
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full bg-cta-gradient text-accent-foreground font-heading tracking-wider shadow-cta">
              Войти
            </Button>
          </form>
        </div>
      </div>
    );
  }

  const save = (updated: Application[]) => {
    setApps(updated);
    localStorage.setItem("ermak_applications", JSON.stringify(updated));
  };

  const updateStatus = (id: string, status: AppStatus) => {
    save(apps.map((a) => (a.id === id ? { ...a, status } : a)));
  };

  const addComment = (id: string) => {
    const text = commentInputs[id]?.trim();
    if (!text) return;
    save(
      apps.map((a) =>
        a.id === id ? { ...a, comments: [...(a.comments ?? []), `${new Date().toLocaleString("ru-RU")}: ${text}`] } : a,
      ),
    );
    setCommentInputs((prev) => ({ ...prev, [id]: "" }));
  };

  const filtered = apps.filter((a) => {
    if (filterStatus !== "all" && a.status !== filterStatus) return false;
    if (
      search &&
      !a.name.toLowerCase().includes(search.toLowerCase()) &&
      !a.phone.includes(search) &&
      !a.course.toLowerCase().includes(search.toLowerCase())
    )
      return false;
    return true;
  });

  const mergedCourses = mergeCourses(defaultCourses);

  const persistCourseField = (id: string, patch: CoursePatch) => {
    updateCoursePatch(id, patch);
    setCourseDrafts(getCoursePatches());
  };

  const resetCourseData = () => {
    if (!confirm("Сбросить все правки курсов (localStorage)?")) return;
    setCoursePatches({});
    setCourseDrafts({});
    window.dispatchEvent(new Event("ermak-courses-updated"));
  };

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground">Админка / мини-CRM</h1>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              sessionStorage.removeItem("ermak_admin_auth");
              setAuthenticated(false);
            }}
            className="border-border text-muted-foreground shrink-0"
          >
            Выйти
          </Button>
        </div>

        <div className="flex gap-2 mb-8">
          <Button
            type="button"
            variant={tab === "leads" ? "default" : "outline"}
            size="sm"
            onClick={() => setTab("leads")}
            className={tab === "leads" ? "bg-cta-gradient text-accent-foreground font-heading shadow-cta border-0" : "font-heading border-border"}
          >
            <LayoutList className="w-4 h-4 mr-2" />
            Заявки
          </Button>
          <Button
            type="button"
            variant={tab === "courses" ? "default" : "outline"}
            size="sm"
            onClick={() => setTab("courses")}
            className={tab === "courses" ? "bg-cta-gradient text-accent-foreground font-heading shadow-cta border-0" : "font-heading border-border"}
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Курсы (данные на сайте)
          </Button>
        </div>

        {tab === "leads" && (
          <>
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <Input
                placeholder="Поиск по имени, телефону, курсу..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-input border-border text-foreground max-w-sm"
              />
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-44 bg-input border-border text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    <SelectItem value="all">Все статусы</SelectItem>
                    <SelectItem value="new">Новые</SelectItem>
                    <SelectItem value="in_progress">В работе</SelectItem>
                    <SelectItem value="enrolled">Записаны</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="text-sm text-muted-foreground flex items-center">В списке: {filtered.length}</div>
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground">
                <p className="text-lg">Заявок пока нет</p>
                <p className="text-sm mt-2">Они появятся после отправки форм на сайте</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filtered.map((app) => (
                  <div key={app.id} className="bg-card-gradient border border-border rounded-lg p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                      <div>
                        <h3 className="font-heading text-lg text-foreground">{app.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {app.phone} · {app.course} · заявка {app.date}
                        </p>
                        {(app.desiredDate || app.comment) && (
                          <div className="mt-2 text-sm text-foreground/90 space-y-1">
                            {app.desiredDate && (
                              <p>
                                <span className="text-muted-foreground">Желаемая дата:</span> {app.desiredDate}
                              </p>
                            )}
                            {app.comment && (
                              <p>
                                <span className="text-muted-foreground">Комментарий:</span> {app.comment}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={`${statusColors[app.status]} font-body`}>{statusLabels[app.status]}</Badge>
                        <Select value={app.status} onValueChange={(v) => updateStatus(app.id, v as AppStatus)}>
                          <SelectTrigger className="w-36 bg-input border-border text-foreground text-xs h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-popover border-border">
                            <SelectItem value="new">Новая</SelectItem>
                            <SelectItem value="in_progress">В работе</SelectItem>
                            <SelectItem value="enrolled">Записан</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {(app.comments?.length ?? 0) > 0 && (
                      <div className="mb-4 space-y-1">
                        {(app.comments ?? []).map((c, i) => (
                          <p key={i} className="text-xs text-muted-foreground flex items-start gap-1">
                            <MessageSquare className="w-3 h-3 mt-0.5 shrink-0" /> {c}
                          </p>
                        ))}
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Textarea
                        placeholder="Внутренний комментарий..."
                        value={commentInputs[app.id] || ""}
                        onChange={(e) => setCommentInputs((prev) => ({ ...prev, [app.id]: e.target.value }))}
                        className="bg-input border-border text-foreground text-sm min-h-[40px] h-10 resize-none"
                      />
                      <Button size="sm" onClick={() => addComment(app.id)} className="bg-accent text-accent-foreground font-heading shrink-0">
                        Добавить
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {tab === "courses" && (
          <div className="space-y-6">
            <p className="text-sm text-muted-foreground max-w-3xl leading-relaxed">
              Правки сохраняются в браузере (localStorage) и подмешиваются к базовым данным. Для продакшена подключите бэкенд или CMS — структура курсов уже единая для сайта и форм.
            </p>
            <Button type="button" variant="outline" size="sm" onClick={resetCourseData} className="border-destructive/40 text-destructive hover:bg-destructive/10">
              Сбросить правки курсов
            </Button>
            <div className="space-y-8">
              {mergedCourses.map((c) => {
                const draft = courseDrafts[c.id] || {};
                return (
                  <div key={c.id} className="border border-border rounded-lg p-4 md:p-6 bg-card-gradient space-y-4">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-2">
                      <div>
                        <h3 className="font-heading text-lg text-foreground">{c.title}</h3>
                        <p className="text-xs text-muted-foreground font-mono">{c.id}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <Label className="text-muted-foreground text-xs">Цена (₽)</Label>
                        <Input
                          type="number"
                          defaultValue={c.price}
                          key={`${c.id}-price-${draft.price ?? c.price}`}
                          onBlur={(e) => persistCourseField(c.id, { price: Number(e.target.value) || c.price })}
                          className="bg-input border-border"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-muted-foreground text-xs">Свободно мест</Label>
                        <Input
                          type="number"
                          defaultValue={c.spotsLeft}
                          key={`${c.id}-spots-${draft.spotsLeft ?? c.spotsLeft}`}
                          onBlur={(e) => persistCourseField(c.id, { spotsLeft: Number(e.target.value) || c.spotsLeft })}
                          className="bg-input border-border"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-muted-foreground text-xs">Всего мест (опционально)</Label>
                        <Input
                          type="number"
                          placeholder="—"
                          defaultValue={c.totalSpots ?? ""}
                          key={`${c.id}-total-${draft.totalSpots ?? c.totalSpots ?? ""}`}
                          onBlur={(e) => {
                            const v = e.target.value.trim();
                            persistCourseField(c.id, { totalSpots: v ? Number(v) : undefined });
                          }}
                          className="bg-input border-border"
                        />
                      </div>
                      <div className="space-y-2 flex flex-col justify-end">
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={c.hasDate}
                            onCheckedChange={(checked) => persistCourseField(c.id, { hasDate: checked })}
                          />
                          <Label className="text-muted-foreground text-xs">Есть точная дата</Label>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-muted-foreground text-xs">Ближайшая дата / текст</Label>
                      <Input
                        defaultValue={c.nextDate}
                        key={`${c.id}-next-${draft.nextDate ?? c.nextDate}`}
                        onBlur={(e) => persistCourseField(c.id, { nextDate: e.target.value })}
                        className="bg-input border-border"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
