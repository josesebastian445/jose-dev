import { getPost, getAllPosts } from "@/app/lib/posts";
import { notFound } from "next/navigation";
import Image from "next/image";
import { MDXRemote } from "next-mdx-remote/rsc";

export async function generateStaticParams() {
  return getAllPosts().map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const post = getPost(params.slug);
  if (!post) return {};

  const { data } = post;

  return {
    title: data.metaTitle || `${data.title} | Jose Cyber`,
    description:
      data.metaDescription ||
      data.excerpt ||
      "Insights on performance, SEO, and futuristic web development.",
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = getPost(params.slug);

  if (!post) {
    return notFound();
  }

  const { data, content } = post;

  return (
    <article className="relative min-h-screen bg-[#05060d] text-white">
      <section className="mx-auto max-w-3xl px-6 pt-28 pb-10">
        <h1 className="text-4xl font-bold text-cyan-300 mb-6">
          {data.title}
        </h1>

        {data.featuredImage && (
          <div className="relative mt-6 aspect-[16/9] w-full overflow-hidden rounded-xl">
            <Image
              src={data.featuredImage}
              alt={data.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}
      </section>

      {/* Blog Content */}
      <section className="mx-auto max-w-3xl px-6 py-12 prose prose-invert">
        <MDXRemote source={content} />
      </section>
    </article>
  );
}
