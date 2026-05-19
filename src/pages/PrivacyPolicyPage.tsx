import { privacyPolicyText } from "@/data/privacyPolicyText";
import PageSeo from "@/components/PageSeo";
import { seoPages } from "@/lib/seoPages";
import { breadcrumbJsonLd } from "@/lib/seoStructuredData";

const PrivacyPolicyPage = () => (
  <>
    <PageSeo
      title={seoPages.privacy.title}
      description={seoPages.privacy.description}
      path={seoPages.privacy.path}
      keywords={seoPages.privacy.keywords}
      jsonLd={breadcrumbJsonLd([
        { name: "Главная", path: "/" },
        { name: "Политика конфиденциальности", path: "/privacy-policy" },
      ])}
    />
    <main className="bg-background min-h-[70vh]">
      <section className="container mx-auto px-4 py-10 md:py-14">
        <h1 className="font-heading text-3xl md:text-4xl text-foreground mb-6">Политика конфиденциальности</h1>
        <div className="rounded-lg border border-border bg-card p-4 md:p-6">
          <p className="text-sm md:text-base text-foreground/90 whitespace-pre-wrap leading-relaxed">{privacyPolicyText}</p>
        </div>
      </section>
    </main>
  </>
);

export default PrivacyPolicyPage;
