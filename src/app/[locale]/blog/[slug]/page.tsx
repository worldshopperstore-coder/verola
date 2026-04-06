import { createClient } from "@supabase/supabase-js";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Link } from "@/i18n/routing";
import { Calendar, ArrowLeft, ArrowRight } from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

type Locale = "tr" | "en" | "de" | "pl" | "ru";

export async function generateStaticParams() {
  const { data: posts } = await supabase
    .from("blog_posts")
    .select("slug")
    .eq("is_published", true);

  const locales: Locale[] = ["tr", "en", "de", "pl", "ru"];
  return (posts ?? []).flatMap((post) =>
    locales.map((locale) => ({ locale, slug: post.slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const loc = locale as Locale;

  const { data: post } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (!post) return { title: "Not Found" };

  const title = post[`title_${loc}`] || post.title_en || "Blog";
  const content = post[`content_${loc}`] || post.content_en || "";
  const description = content.replace(/<[^>]*>/g, "").slice(0, 160);

  return {
    title: `${title} | VELORA Transfer Blog`,
    description,
    openGraph: {
      title,
      description,
      ...(post.image_url ? { images: [post.image_url] } : {}),
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const loc = locale as Locale;
  const t = await getTranslations({ locale, namespace: "blog" });

  const { data: post } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (!post) notFound();

  const title = post[`title_${loc}`] || post.title_en || "Untitled";
  const content = post[`content_${loc}`] || post.content_en || "";

  // Related posts
  const { data: related } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("is_published", true)
    .neq("slug", slug)
    .order("published_at", { ascending: false })
    .limit(3);

  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero with article title */}
        <section
          className="relative py-20 overflow-hidden"
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
          <div className="relative max-w-3xl mx-auto px-4">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-[#86868b] hover:text-orange-400 transition-colors mb-8 text-sm"
            >
              <ArrowLeft size={16} />
              {t("backToBlog")}
            </Link>
            {post.published_at && (
              <div className="flex items-center gap-2 text-sm text-[#86868b] mb-4">
                <Calendar size={14} />
                <time>
                  {t("publishedOn")}{" "}
                  {new Date(post.published_at).toLocaleDateString(loc, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
              </div>
            )}
            <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-white">
              {title}
            </h1>
          </div>
        </section>

        {/* Featured image */}
        {post.image_url && (
          <section className="max-w-4xl mx-auto px-4 -mt-4">
            <div className="rounded-2xl overflow-hidden">
              <img
                src={post.image_url}
                alt={title}
                className="w-full h-auto object-cover max-h-[480px]"
              />
            </div>
          </section>
        )}

        {/* Content */}
        <section className="py-16">
          <div className="max-w-3xl mx-auto px-4">
            <div
              className="prose prose-invert prose-lg max-w-none
                prose-headings:text-white prose-headings:font-bold
                prose-p:text-[#a1a1a6] prose-p:leading-relaxed
                prose-a:text-orange-400 prose-a:no-underline hover:prose-a:underline
                prose-strong:text-white
                prose-li:text-[#a1a1a6]
                prose-blockquote:border-orange-400/30 prose-blockquote:text-[#86868b]"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>
        </section>

        {/* Related posts */}
        {related && related.length > 0 && (
          <section className="py-16 border-t border-white/5">
            <div className="max-w-6xl mx-auto px-4">
              <h2 className="text-2xl font-bold text-white mb-10">
                {t("relatedPosts")}
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                {related.map((rp) => {
                  const rpTitle =
                    rp[`title_${loc}`] || rp.title_en || "Untitled";
                  return (
                    <Link
                      key={rp.id}
                      href={`/blog/${rp.slug}`}
                      className="group rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
                      style={{
                        backgroundColor: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.06)",
                      }}
                    >
                      {rp.image_url && (
                        <div className="aspect-[16/9] overflow-hidden">
                          <img
                            src={rp.image_url}
                            alt={rpTitle}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                      )}
                      <div className="p-5">
                        <h3 className="text-lg font-semibold text-white group-hover:text-orange-400 transition-colors line-clamp-2">
                          {rpTitle}
                        </h3>
                        <span className="inline-flex items-center gap-1 text-orange-400 text-sm font-medium mt-3">
                          {t("readMore")}
                          <ArrowRight size={14} />
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
