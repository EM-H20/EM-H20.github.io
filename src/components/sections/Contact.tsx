import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Container";
import { hero, links } from "@/content/profile";
import { site } from "@/lib/site";

export function Contact() {
  return (
    <Section id="contact" chip="CONTACT">
      <p className="font-display text-title-lg font-light text-fg">함께 일해요</p>
      <p className="mt-2 text-body text-fg-muted">{hero.contactLine}</p>
      <div className="mt-6 flex flex-wrap gap-2.5">
        <Button href={links.email.href}>메일 보내기</Button>
        <Button href={site.pdf.href} download={site.pdf.filename} variant="ghost">
          PDF 포트폴리오
        </Button>
      </div>
      <ul className="mt-8 flex flex-wrap gap-x-5">
        {Object.values(links).map((link) => (
          <li key={link.href}>
            <Button href={link.href} variant="text">
              {link.label}
            </Button>
          </li>
        ))}
      </ul>
      <p className="mt-6 text-meta text-fg-subtle">
        © {new Date().getFullYear()} {site.name}
      </p>
    </Section>
  );
}
