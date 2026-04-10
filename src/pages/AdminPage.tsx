import { useState, useEffect } from "react";
import { Application, AppStatus, statusLabels, statusColors } from "@/data/applications";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Filter, Lock } from "lucide-react";

const ADMIN_PASSWORD = "ermak2026";

const AdminPage = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [apps, setApps] = useState<Application[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});

  useEffect(() => {
    if (sessionStorage.getItem("ermak_admin_auth") === "true") {
      setAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (authenticated) {
      const stored = JSON.parse(localStorage.getItem("ermak_applications") || "[]");
      setApps(stored);
    }
  }, [authenticated]);

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
            <Lock className="w-12 h-12 text-primary mx-auto mb-4" />
            <h1 className="font-heading text-2xl font-bold text-foreground">Вход в админку</h1>
            <p className="text-sm text-muted-foreground mt-2">Доступ только для администраторов</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              type="password"
              placeholder="Пароль"
              value={password}
              onChange={e => { setPassword(e.target.value); setError(""); }}
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
    save(apps.map(a => a.id === id ? { ...a, status } : a));
  };

  const addComment = (id: string) => {
    const text = commentInputs[id]?.trim();
    if (!text) return;
    save(apps.map(a => a.id === id ? { ...a, comments: [...a.comments, `${new Date().toLocaleString("ru-RU")}: ${text}`] } : a));
    setCommentInputs(prev => ({ ...prev, [id]: "" }));
  };

  const filtered = apps.filter(a => {
    if (filterStatus !== "all" && a.status !== filterStatus) return false;
    if (search && !a.name.toLowerCase().includes(search.toLowerCase()) && !a.phone.includes(search) && !a.course.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground">Заявки</h1>
          <Button variant="outline" size="sm" onClick={() => { sessionStorage.removeItem("ermak_admin_auth"); setAuthenticated(false); }} className="border-border text-muted-foreground">
            Выйти
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <Input placeholder="Поиск по имени, телефону, курсу..." value={search} onChange={e => setSearch(e.target.value)} className="bg-input border-border text-foreground max-w-sm" />
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40 bg-input border-border text-foreground">
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
          <div className="text-sm text-muted-foreground flex items-center">
            Всего: {filtered.length}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <p className="text-lg">Заявок пока нет</p>
            <p className="text-sm mt-2">Они появятся после заполнения формы на сайте</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map(app => (
              <div key={app.id} className="bg-card-gradient border border-border rounded-lg p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div>
                    <h3 className="font-heading text-lg text-foreground">{app.name}</h3>
                    <p className="text-sm text-muted-foreground">{app.phone} · {app.course} · {app.date}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={`${statusColors[app.status]} font-body`}>{statusLabels[app.status]}</Badge>
                    <Select value={app.status} onValueChange={(v) => updateStatus(app.id, v as AppStatus)}>
                      <SelectTrigger className="w-32 bg-input border-border text-foreground text-xs h-8">
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

                {app.comments.length > 0 && (
                  <div className="mb-4 space-y-1">
                    {app.comments.map((c, i) => (
                      <p key={i} className="text-xs text-muted-foreground flex items-start gap-1">
                        <MessageSquare className="w-3 h-3 mt-0.5 shrink-0" /> {c}
                      </p>
                    ))}
                  </div>
                )}

                <div className="flex gap-2">
                  <Textarea
                    placeholder="Добавить комментарий..."
                    value={commentInputs[app.id] || ""}
                    onChange={e => setCommentInputs(prev => ({ ...prev, [app.id]: e.target.value }))}
                    className="bg-input border-border text-foreground text-sm min-h-[40px] h-10 resize-none"
                  />
                  <Button size="sm" onClick={() => addComment(app.id)} className="bg-primary text-primary-foreground font-heading shrink-0">
                    Добавить
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
