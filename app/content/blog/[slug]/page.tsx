import { getAllPosts, getPost } from "@/app/lib/posts";
import { MDXRemote } from "next-mdx-remote/rsc";
import { notFound } from "next/navigation";
import Image from "next/image";

export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = getPost(params.slug);
  if (!post) return {};

  const { data } = post;
  const title =
    data.metaTitle || `${data.title} | Jose Cyber`;
  const description =
    data.metaDescription ||
    data.excerpt ||
    "Insights on performance, SEO, and futuristic web development.";
  const url = `https://jose-cyber-pro.vercel.app/blog/${params.slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "article",
      publishedTime: data.date,
      authors: ["Jose"],
      images: [
        {
          url: data.featuredImage || "/og-jose-cyber.png",
          width: 1200,
          height: 630,
          alt: data.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [data.featuredImage || "/og-jose-cyber.png"],
      creator: "@JoseCyber",
    },
  };
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const { data, content } = getPost(params.slug);

  if (!data) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: data.title,
    image: [`https://jose-cyber-pro.vercel.app${data.featuredImage || "/og-jose-cyber.png"}`],
    author: {
      "@type": "Person",
      name: "Jose",
      url: "https://jose-cyber-pro.vercel.app/about",
    },
    publisher: {
      "@type": "Organization",
      name: "Jose Cyber",
      logo: {
        "@type": "ImageObject",
        url: "https://jose-cyber-pro.vercel.app/logo.png",
      },
    },
    url: `https://jose-cyber-pro.vercel.app/blog/${params.slug}`,
    datePublished: data.date,
    dateModified: data.date,
    description:
      data.metaDescription ||
      data.excerpt ||
      "A deep dive into performance, SEO, and futuristic web development strategies.",
    keywords: data.tags || ["Performance", "Next.js", "SEO", "UX"],
  };

  return (
    <article className="relative min-h-screen bg-[#05060d] text-white">
      {/* Neon Cyber Background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-24 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(0,170,255,0.18)_0%,rgba(0,0,0,0)_70%)] blur-[60px]" />
        <div className="absolute -right-40 top-1/3 h-[400px] w-[400px] rotate-12 rounded-full bg-[radial-gradient(circle_at_center,rgba(80,0,255,0.2)_0%,rgba(0,0,0,0)_70%)] blur-[80px]" />
        <div
          className="absolute inset-0 opacity-[0.07] mix-blend-screen"
          style={{
            backgroundImage:
              "linear-gradient(to_right,rgba(0,255,255,.15)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,255,255,.15)_1px,transparent_1px)",
            backgroundSize: "36px 36px",
            maskImage:
              "radial-gradient(circle at 50% 30%,rgba(0,0,0,1) 0%,rgba(0,0,0,0) 70%)",
            WebkitMaskImage:
              "radial-gradient(circle at 50% 30%,rgba(0,0,0,1) 0%,rgba(0,0,0,0) 70%)",
          }}
        />
      </div>

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Section */}
      <section className="mx-auto max-w-5xl px-6 pt-28 pb-10 text-center">
        <h1 className="text-3xl md:text-5xl font-bold text-cyan-300 mb-4">
          {data.title}
        </h1>
        <p className="text-white/70 text-lg max-w-2xl mx-auto mb-6">
          {data.excerpt}
        </p>
        <div className="flex justify-center gap-3 text-white/60 text-sm">
          <span>{data.date}</span>
          <span>•</span>
          <span>By Jose</span>
          <span>•</span>
          <span>{data.tags?.join(", ")}</span>
        </div>

        <div className="relative mt-10 aspect-[16/9] w-full overflow-hidden rounded-2xl ring-1 ring-white/10">
          <Image
            src={data.featuredImage || "/og-jose-cyber.png"}
            alt={data.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      </section>

      {/* Blog Content */}
      <section className="mx-auto max-w-3xl px-6 py-12 prose prose-invert prose-headings:text-cyan-300 prose-a:text-cyan-400 hover:prose-a:text-white prose-blockquote:border-cyan-300 prose-blockquote:bg-white/5 prose-blockquote:text-white/70">
<div>{content}</div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/20 py-12 text-center text-sm text-white/50 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-6">
          <div className="font-medium text-white/80">
            Jose Cyber — Secure. Fast. Future-Ready.
          </div>
          <div className="mt-2 text-white/40">
            © 2025 Jose. All rights reserved.
          </div>
        </div>
      </footer>
    </article>
  );
}
