import { Awards } from "@/components/sections/Awards";
import { Contact } from "@/components/sections/Contact";
import { Hero } from "@/components/sections/Hero";
import { Projects } from "@/components/sections/Projects";
import { Stack } from "@/components/sections/Stack";

export default function Home() {
  return (
    <main className="flex-1 pb-12">
      <Hero />
      <Projects />
      <Awards />
      <Stack />
      <Contact />
    </main>
  );
}
