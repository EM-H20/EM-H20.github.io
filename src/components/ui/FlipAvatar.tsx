"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const FLIP_MS = 3000;

// Coin flip between the drawn avatar and the photo. Flips on its own every few seconds;
// a tap or key press flips it by hand and stops the auto-flip, so motion can be paused.
export function FlipAvatar() {
  const [flipped, setFlipped] = useState(false);
  const [auto, setAuto] = useState(true);

  useEffect(() => {
    if (!auto || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setInterval(() => {
      if (!document.hidden) setFlipped((f) => !f);
    }, FLIP_MS);
    return () => clearInterval(timer);
  }, [auto]);

  return (
    <button
      type="button"
      onClick={() => {
        setAuto(false);
        setFlipped((f) => !f);
      }}
      aria-pressed={flipped}
      aria-label={flipped ? "그림 아바타로 뒤집기" : "실제 사진으로 뒤집기"}
      className="block w-40 cursor-pointer perspective-distant sm:w-48"
    >
      <span
        className={`relative block aspect-[360/518] transition-transform duration-500 transform-3d motion-reduce:transition-none ${flipped ? "rotate-y-180" : ""}`}
      >
        <Image
          src="/images/profile-illustration.png"
          alt="홍의민 그림 아바타"
          width={360}
          height={518}
          className="invert-in-dark absolute inset-0 h-full w-full object-contain backface-hidden"
        />
        <Image
          src="/images/profile-cutout.png"
          alt="홍의민 사진"
          width={465}
          height={640}
          className="absolute inset-0 h-full w-full rotate-y-180 object-contain backface-hidden"
        />
      </span>
    </button>
  );
}
