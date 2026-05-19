import type { Course } from "@/data/courses";
import {
  SITE_ADDRESS,
  SITE_NAME,
  SITE_PHONE,
  SITE_URL,
  SITE_VK_URL,
  SITE_OG_IMAGE,
  SITE_LOCALITY,
  SITE_REGION,
  toAbsoluteUrl,
  truncateDescription,
} from "@/lib/siteSeo";

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    alternateName: "Ермак",
    url: SITE_URL,
    logo: SITE_OG_IMAGE,
    image: SITE_OG_IMAGE,
    telephone: SITE_PHONE,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Красный проспект, 11",
      addressLocality: SITE_LOCALITY,
      addressRegion: SITE_REGION,
      addressCountry: "RU",
    },
    sameAs: [SITE_VK_URL],
    description:
      "Центр специальной подготовки в Новосибирске: практические курсы тактической медицины, огневой и тактической подготовки.",
    areaServed: {
      "@type": "City",
      name: SITE_LOCALITY,
    },
  };
}

export function webSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE_NAME,
    description: "Официальный сайт центра специальной подготовки «Ермак»",
    publisher: { "@id": `${SITE_URL}/#organization` },
    inLanguage: "ru-RU",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/courses?tags={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function courseJsonLd(course: Course) {
  const url = `${SITE_URL}/course/${course.id}`;
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    "@id": `${url}#course`,
    name: course.title,
    description: truncateDescription(course.description, 300),
    url,
    image: toAbsoluteUrl(course.image),
    provider: { "@id": `${SITE_URL}/#organization` },
    offers: {
      "@type": "Offer",
      price: course.price,
      priceCurrency: "RUB",
      availability: "https://schema.org/InStock",
      url,
    },
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: course.format.includes("онлайн") ? "online" : "onsite",
      location: course.location
        ? {
            "@type": "Place",
            name: course.location,
            address: SITE_ADDRESS,
          }
        : {
            "@type": "Place",
            name: SITE_NAME,
            address: SITE_ADDRESS,
          },
    },
    educationalLevel: course.level === "advanced" ? "Advanced" : "Beginner",
    inLanguage: "ru-RU",
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: toAbsoluteUrl(item.path),
    })),
  };
}
