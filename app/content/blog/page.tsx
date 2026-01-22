import { getAllPublishedPosts } from "@/app/lib/payload-client";
import BlogCard from "@/components/BlogCard";
import BlogHero from "@/components/BlogHero";

export const metadata = {
  title: "Blog | Jose Cyber",
  description:
    "Insights on performance, security, and futuristic web design — powered by Jose Cyber.",
};

export default async function BlogPage() {
  const posts = await getAllPublishedPosts();

  return (
    <main
      id="blog"
      className="relative min-h-screen overflow-hidden bg-[#05060d] text-white"
    >
      {/* Neon gradient background glows */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-24 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(0,170,255,0.18)_0%,rgba(0,0,0,0)_70%)] blur-[60px]" />
        <div className="absolute -right-40 top-1/3 h-[400px] w-[400px] rotate-12 rounded-full bg-[radial-gradient(circle_at_center,rgba(81, 0, 255, 0.11)_0%,rgba(0,0,0,0)_70%)] blur-[80px]" />
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

      {/* Hero section */}
      <BlogHero />

      {/* Blog Grid */}
      <div className="mx-auto max-w-6xl px-6 py-20 grid md:grid-cols-2 lg:grid-cols-3 gap-10">
        {posts.length === 0 ? (
          <p className="col-span-full text-center text-gray-400">
            No blog posts found. Add posts via the CMS at /admin
          </p>
        ) : (
          posts.map((p) => <BlogCard key={p.slug} post={p} />)
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/20 py-12 text-center text-sm text-white/50 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-6">
          <div className="font-medium text-white/80">
            Jose Cyber — Secure. Fast. Future-Ready.
          </div>
          <div className="mt-2 text-white/40">© 2025 Jose. All rights reserved.</div>
        </div>
      </footer>
    </main>
  );
}
