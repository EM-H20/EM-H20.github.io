import { Nav } from "@/components/ui/Nav";

export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <Nav />
      {children}
    </>
  );
}
