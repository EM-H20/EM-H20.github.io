import { EnvelopeButton } from "@/components/ui/EnvelopeButton";
import { links } from "@/content/profile";
import { site } from "@/lib/site";

// Mail and PDF calls to action, shared by the hero and the contact section.
export function ContactButtons() {
  return (
    <div className="flex flex-wrap gap-2.5">
      <EnvelopeButton href={links.email.href} letter="To. Elipair">
        메일 보내기
      </EnvelopeButton>
      <EnvelopeButton href={site.pdf.href} download={site.pdf.filename} tone="ghost" letter="Portfolio.pdf">
        PDF 포트폴리오
      </EnvelopeButton>
    </div>
  );
}
