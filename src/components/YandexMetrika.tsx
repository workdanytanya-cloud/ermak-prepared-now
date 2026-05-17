import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  YANDEX_METRIKA_ID,
  buildMetrikaPageUrl,
  ensureYandexMetrikaScript,
  hitYandexMetrika,
  initYandexMetrika,
} from "@/lib/yandexMetrika";

/**
 * Один счётчик на всё SPA: init при первой загрузке, hit при смене маршрута.
 */
const YandexMetrika = () => {
  const { pathname, search, hash } = useLocation();

  useEffect(() => {
    ensureYandexMetrikaScript();
  }, []);

  useEffect(() => {
    const pageUrl = buildMetrikaPageUrl(pathname, search, hash);

    const send = () => {
      initYandexMetrika();
      hitYandexMetrika(pageUrl);
    };

    if (typeof window.ym === "function") {
      send();
      return;
    }

    const started = Date.now();
    const timer = window.setInterval(() => {
      if (typeof window.ym === "function") {
        window.clearInterval(timer);
        send();
        return;
      }
      if (Date.now() - started > 10_000) {
        window.clearInterval(timer);
      }
    }, 100);

    return () => window.clearInterval(timer);
  }, [pathname, search, hash]);

  return (
    <noscript>
      <div>
        <img
          src={`https://mc.yandex.ru/watch/${YANDEX_METRIKA_ID}`}
          style={{ position: "absolute", left: "-9999px" }}
          alt=""
        />
      </div>
    </noscript>
  );
};

export default YandexMetrika;
