import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  SITE_NAME,
  SITE_URL,
  SITE_OG_IMAGE,
  DEFAULT_KEYWORDS,
  buildPageTitle,
  toAbsoluteUrl,
  truncateDescription,
} from "@/lib/siteSeo";

export interface PageSeoProps {
  title: string;
  description: string;
  /** Путь для canonical без query, например `/courses` */
  path?: string;
  image?: string;
  type?: "website" | "article";
  keywords?: string;
  noindex?: boolean;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

function upsertMeta(attr: "name" | "property", key: string, content: string) {
  const selector = `meta[${attr}="${key}"]`;
  let el = document.querySelector(selector) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertLink(rel: string, href: string) {
  const selector = `link[rel="${rel}"]`;
  let el = document.querySelector(selector) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

function setJsonLd(data: PageSeoProps["jsonLd"]) {
  const id = "page-seo-jsonld";
  const existing = document.getElementById(id);
  if (existing) existing.remove();
  if (!data) return;

  const script = document.createElement("script");
  script.id = id;
  script.type = "application/ld+json";
  script.textContent = JSON.stringify(Array.isArray(data) ? data : data);
  document.head.appendChild(script);
}

const PageSeo = ({
  title,
  description,
  path,
  image = SITE_OG_IMAGE,
  type = "website",
  keywords = DEFAULT_KEYWORDS,
  noindex = false,
  jsonLd,
}: PageSeoProps) => {
  const location = useLocation();
  const canonicalPath = path ?? location.pathname;
  const canonicalUrl = toAbsoluteUrl(canonicalPath);
  const pageTitle = buildPageTitle(title);
  const pageDescription = truncateDescription(description);
  const ogImage = toAbsoluteUrl(image);

  useEffect(() => {
    document.title = pageTitle;
    document.documentElement.lang = "ru";

    upsertMeta("name", "description", pageDescription);
    upsertMeta("name", "keywords", keywords);
    upsertMeta("name", "author", SITE_NAME);
    upsertMeta("name", "robots", noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large");

    upsertLink("canonical", canonicalUrl);

    upsertMeta("property", "og:locale", "ru_RU");
    upsertMeta("property", "og:site_name", SITE_NAME);
    upsertMeta("property", "og:type", type);
    upsertMeta("property", "og:title", pageTitle);
    upsertMeta("property", "og:description", pageDescription);
    upsertMeta("property", "og:url", canonicalUrl);
    upsertMeta("property", "og:image", ogImage);

    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", pageTitle);
    upsertMeta("name", "twitter:description", pageDescription);
    upsertMeta("name", "twitter:image", ogImage);

    setJsonLd(jsonLd);
  }, [pageTitle, pageDescription, canonicalUrl, ogImage, type, keywords, noindex, jsonLd]);

  return null;
};

export default PageSeo;
