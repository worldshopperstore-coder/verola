import { createClient } from "@supabase/supabase-js";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Link } from "@/i18n/routing";
import { Calendar, ArrowRight } from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

type Locale = "tr" | "en" | "de" | "pl" | "ru";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "blog" });
  return {
    title: `${t("heading")} | VELORA Transfer`,
    description: t("subtitle"),
  };
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "blog" });
  const loc = locale as Locale;

  const { data: posts } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("is_published", true)
    .order("published_at", { ascending: false });

  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section
          className="relative py-24 overflow-hidden"
          style={{
            background:
              "linear-gradient(180deg, #1c1c1e 0%, #111113 100%)",
          }}
        >
          <div className="absolute inset-0">
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[120px]"
              style={{ backgroundColor: "rgba(249,115,22,0.06)" }}
            />
          </div>
          <div className="relative max-w-3xl mx-auto px-4 text-center">
            <p className="text-sm font-semibold text-orange-400 uppercase tracking-widest mb-4">
              {t("title")}
            </p>
            <h1 className="text-4xl lg:text-5xl font-bold mb-5 tracking-tight text-white">
              {t("heading")}
            </h1>
            <p className="text-[#86868b] text-lg max-w-xl mx-auto">
              {t("subtitle")}
            </p>
          </div>
        </section>

        {/* Blog Grid */}
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-4">
            {!posts || posts.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-[#86868b] text-lg">{t("noPosts")}</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post) => {
                  const title =
                    post[`title_${loc}`] || post.title_en || "Untitled";
                  const content =
                    post[`content_${loc}`] || post.content_en || "";
                  const excerpt =
                    content.replace(/<[^>]*>/g, "").slice(0, 160) + "...";

                  return (
                    <Link
                      key={post.id}
                      href={`/blog/${post.slug}`}
                      className="group rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
                      style={{
                        backgroundColor: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.06)",
                      }}
                    >
                      {post.image_url && (
                        <div className="aspect-[16/9] overflow-hidden">
                          <img
                            src={post.image_url}
                            alt={title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                      )}
                      <div className="p-6">
                        {post.published_at && (
                          <div className="flex items-center gap-2 text-xs text-[#86868b] mb-3">
                            <Calendar size={14} />
                            <time>
                              {new Date(
                                post.published_at
                              ).toLocaleDateString(loc, {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </time>
                          </div>
                        )}
                        <h2 className="text-xl font-semibold text-white mb-3 group-hover:text-orange-400 transition-colors line-clamp-2">
                          {title}
                        </h2>
                        <p className="text-[#86868b] text-sm leading-relaxed line-clamp-3 mb-4">
                          {excerpt}
                        </p>
                        <span className="inline-flex items-center gap-2 text-orange-400 text-sm font-medium">
                          {t("readMore")}
                          <ArrowRight
                            size={14}
                            className="transition-transform group-hover:translate-x-1"
                          />
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
