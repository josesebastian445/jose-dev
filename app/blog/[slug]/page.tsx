import { getAllPosts, getPost } from "@/app/lib/posts";
import { MDXRemote } from "next-mdx-remote/rsc";
import TableOfContents from "@/components/TableOfContents";

export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export default function PostPage({ params }: { params: { slug: string } }) {
  const { data, content } = getPost(params.slug);

  return (
    <article className="max-w-5xl mx-auto px-6 py-20 prose prose-invert relative">
      <TableOfContents content={content} />
      <h1 className="text-4xl font-bold text-gold-400 mb-4">{data.title}</h1>
      <p className="text-sm text-blue-400 mb-8">{data.date}</p>
      <MDXRemote source={content} />
    </article>
  );
}
