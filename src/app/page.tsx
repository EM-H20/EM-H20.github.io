import Link from "next/link";
import { site } from "@/lib/site";

// Placeholder until design tokens and sections are defined
export default function Home() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-24">
      <h1 className="text-3xl font-semibold">{site.name}</h1>
      <p className="mt-2">{site.tagline}</p>
      <p className="mt-6">{site.description}</p>
      <nav className="mt-10">
        <Link href="/blog" className="underline">
          Blog
        </Link>
      </nav>
    </main>
  );
}
