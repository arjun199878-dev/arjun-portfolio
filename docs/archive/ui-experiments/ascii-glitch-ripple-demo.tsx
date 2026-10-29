"use client";

import { AsciiGlitchRipple } from "@/components/ui/ascii-glitch-ripple";

export function AsciiGlitchRippleDemo() {
  return (
    <AsciiGlitchRipple
      as="a"
      href="#"
      dur={1000}
      spread={1.2}
      className="text-lg font-mono hover:text-white"
    >
      Roadside Picnic — Arkady & Boris Strugatsky
    </AsciiGlitchRipple>
  );
}

export default AsciiGlitchRippleDemo;
