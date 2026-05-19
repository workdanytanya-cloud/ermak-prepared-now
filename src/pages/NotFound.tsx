import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import PageSeo from "@/components/PageSeo";
import { seoPages } from "@/lib/seoPages";
import { Button } from "@/components/ui/button";
import { resolveLegacyRedirect } from "@/lib/legacyRoutes";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const legacy = resolveLegacyRedirect(location.pathname);
    if (legacy) {
      navigate(legacy, { replace: true });
      return;
    }
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname, navigate]);

  return (
    <>
      <PageSeo
        title={seoPages.notFound.title}
        description={seoPages.notFound.description}
        noindex
      />
      <div className="flex min-h-screen items-center justify-center bg-muted pt-24 px-4">
        <div className="text-center max-w-md">
          <h1 className="mb-4 font-heading text-4xl font-bold text-foreground">404</h1>
          <p className="mb-6 text-lg text-muted-foreground">Страница не найдена</p>
          <p className="mb-8 text-sm text-muted-foreground">
            Возможно, ссылка устарела. Перейдите на главную или в каталог курсов ЦСП «Ермак».
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild className="font-heading">
              <Link to="/">На главную</Link>
            </Button>
            <Button asChild variant="outline" className="font-heading">
              <Link to="/courses">Каталог курсов</Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFound;
