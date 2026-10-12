import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Container";
import { hero, links } from "@/content/profile";
import { site } from "@/lib/site";

export function Contact() {
  return (
    <Section id="contact" eyebrow="Contact" title="함께 일해요">
      <p className="max-w-xl text-body text-fg-muted">{hero.contactLine}</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button href={links.email.href}>메일 보내기</Button>
        <Button href={site.pdf.href} download={site.pdf.filename} variant="ghost">
          PDF 포트폴리오 받기
        </Button>
      </div>
      <ul className="mt-16 flex flex-wrap gap-x-6 gap-y-2">
        {Object.values(links).map((link) => (
          <li key={link.href}>
            <Button href={link.href} variant="text">
              {link.label}
            </Button>
          </li>
        ))}
      </ul>
      <p className="mt-8 font-mono text-caption text-fg-subtle">
        © {new Date().getFullYear()} {site.name}
      </p>
    </Section>
  );
}
