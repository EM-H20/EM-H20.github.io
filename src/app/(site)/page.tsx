import { Awards } from "@/components/sections/Awards";
import { AxNative } from "@/components/sections/AxNative";
import { Contact } from "@/components/sections/Contact";
import { Hero } from "@/components/sections/Hero";
import { Projects } from "@/components/sections/Projects";

export default function Home() {
  return (
    <main className="flex-1 pb-8">
      <Hero />
      <Projects />
      <Awards />
      <AxNative />
      <Contact />
    </main>
  );
}
