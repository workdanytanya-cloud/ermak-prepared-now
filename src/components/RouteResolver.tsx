import { useEffect } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { normalizePathname, resolveLegacyRedirect } from "@/lib/legacyRoutes";

const KNOWN_APP_PATHS = new Set([
  "/",
  "/courses",
  "/admin",
  "/privacy-policy",
]);

/** Нормализует URL и перенаправляет со старых адресов сайта */
const RouteResolver = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const normalized = normalizePathname(location.pathname);
  const legacyTarget = resolveLegacyRedirect(location.pathname);

  useEffect(() => {
    if (normalized === location.pathname) return;
    navigate(`${normalized}${location.search}${location.hash}`, { replace: true });
  }, [location.pathname, location.search, location.hash, normalized, navigate]);

  if (legacyTarget) {
    if (legacyTarget.includes("#")) {
      const hash = legacyTarget.slice(legacyTarget.indexOf("#"));
      return <Navigate to={{ pathname: "/", hash, search: location.search }} replace />;
    }
    return <Navigate to={`${legacyTarget}${location.search}`} replace />;
  }

  if (normalized !== location.pathname) {
    return <Navigate to={`${normalized}${location.search}${location.hash}`} replace />;
  }

  return <>{children}</>;
};

export function isKnownAppPath(pathname: string): boolean {
  const path = normalizePathname(pathname);
  if (KNOWN_APP_PATHS.has(path)) return true;
  if (path.startsWith("/course/")) return true;
  return false;
}

export default RouteResolver;
