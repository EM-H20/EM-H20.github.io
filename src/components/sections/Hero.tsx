import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Highlight } from "@/components/ui/Highlight";
import { InfoLines } from "@/components/ui/InfoLines";
import { RotatingWord } from "@/components/ui/RotatingWord";
import { hero, heroInfo, links } from "@/content/profile";
import { site } from "@/lib/site";

// Each line is nowrap and the size is clamped, so the block keeps one height while the word types.
export function Hero() {
  return (
    <Container className="pt-8 pb-7 md:pt-12">
      <h1 className="sr-only">{`안녕하세요! ${hero.words[0]}를 좋아하는 개발자 ${hero.name}입니다.`}</h1>
      <div className="flex flex-col-reverse gap-6 sm:flex-row sm:items-center sm:justify-between">
        <p aria-hidden="true" className="font-display text-greet font-light text-fg">
          <span className="block whitespace-nowrap">안녕하세요!</span>
          <span className="block whitespace-nowrap">
            <RotatingWord words={hero.words} />를 좋아하는
          </span>
          <span className="block whitespace-nowrap">
            개발자{" "}
            <Highlight>
              <strong className="font-bold">{hero.name}</strong>
            </Highlight>
            입니다.
          </span>
        </p>
        <Image
          src="/images/profile-illustration.png"
          alt=""
          width={360}
          height={518}
          loading="eager"
          className="invert-in-dark w-20 shrink-0 sm:w-40"
        />
      </div>
      <InfoLines lines={heroInfo()} className="mt-7" />
      <div className="mt-6 flex flex-wrap gap-2.5">
        <Button href={links.email.href}>메일 보내기</Button>
        <Button href={site.pdf.href} download={site.pdf.filename} variant="ghost">
          PDF 포트폴리오
        </Button>
      </div>
    </Container>
  );
}
