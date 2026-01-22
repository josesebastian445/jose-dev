import { getAllPublishedPosts, getPostBySlug } from "@/app/lib/payload-client";
import { notFound } from "next/navigation";
import Image from "next/image";
import RichText from "@/components/RichText";

export async function generateStaticParams() {
  const posts = await getAllPublishedPosts();
  return posts.map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};

  return {
    title: post.metaTitle || `${post.title} | Jose Cyber`,
    description:
      post.metaDescription ||
      post.excerpt ||
      "Insights on performance, SEO, and futuristic web development.",
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return notFound();
  }

  return (
    <article className="relative min-h-screen bg-[#05060d] text-white">
      <section className="mx-auto max-w-3xl px-6 pt-28 pb-10">
        <h1 className="text-4xl font-bold text-cyan-300 mb-6">
          {post.title}
        </h1>

        {post.featuredImage && (
          <div className="relative mt-6 aspect-[16/9] w-full overflow-hidden rounded-xl">
            <Image
              src={post.featuredImage.url}
              alt={post.featuredImage.alt || post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        <div className="mt-6 text-sm text-gray-400">
          {new Date(post.publishedDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </div>
      </section>

      {/* Blog Content */}
      <section className="mx-auto max-w-3xl px-6 py-12">
        <div className="prose prose-invert max-w-none">
          <RichText content={post.content} />
        </div>
      </section>
    </article>
  );
}
