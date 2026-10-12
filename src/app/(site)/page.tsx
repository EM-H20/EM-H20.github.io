import { Awards } from "@/components/sections/Awards";
import { Contact } from "@/components/sections/Contact";
import { Featured } from "@/components/sections/Featured";
import { Hero } from "@/components/sections/Hero";
import { Projects } from "@/components/sections/Projects";
import { Stack } from "@/components/sections/Stack";

export default function Home() {
  return (
    <main className="flex-1">
      <Hero />
      <Featured />
      <Projects />
      <Awards />
      <Stack />
      <Contact />
    </main>
  );
}
