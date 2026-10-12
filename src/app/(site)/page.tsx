import { Featured } from "@/components/sections/Featured";
import { Hero } from "@/components/sections/Hero";

export default function Home() {
  return (
    <main className="flex-1">
      <Hero />
      <Featured />
    </main>
  );
}
