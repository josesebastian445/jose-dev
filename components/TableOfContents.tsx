"use client";
import { useEffect, useState } from "react";

export default function TableOfContents({ content }: { content: string }) {
  const [headings, setHeadings] = useState<{ id: string; text: string }[]>([]);

  useEffect(() => {
    const matches = [...content.matchAll(/^##\s+(.*)$/gm)];
    setHeadings(matches.map((m) => ({ id: m[1].replace(/\s+/g, "-").toLowerCase(), text: m[1] })));
  }, [content]);

  return (
    <aside className="hidden lg:block fixed right-12 top-32 w-56 text-sm space-y-2">
      {headings.map((h) => (
        <a key={h.id} href={`#${h.id}`} className="block text-blue-300 hover:text-gold-400 transition">
          {h.text}
        </a>
      ))}
    </aside>
  );
}
