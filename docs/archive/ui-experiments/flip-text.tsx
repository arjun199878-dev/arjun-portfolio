"use client";

import React, { useMemo } from "react";
import { cn } from "@/lib/utils";
import styles from "./flip-text.module.css";

export interface FlipTextProps {
  /**
   * Additional CSS classes for the wrapper
   */
  className?: string;

  /**
   * The text content to animate (will be split by spaces or separator)
   */
  children: string;

  /**
   * Duration of the flip animation in seconds
   * @default 2.2
   */
  duration?: number;

  /**
   * Initial delay before animation starts in seconds
   * @default 0
   */
  delay?: number;

  /**
   * Whether the animation should loop infinitely
   * @default true
   */
  loop?: boolean;

  /**
   * Custom separator for splitting text (default is space)
   * @default " "
   */
  separator?: string;

  /**
   * Whether all characters should animate together (no stagger)
   * @default false
   */
  together?: boolean;

  /**
   * Optional inline styles
   */
  style?: React.CSSProperties;
}

export function FlipText({
  className,
  children,
  duration = 2.2,
  delay = 0,
  loop = true,
  separator = " ",
  together = false,
  style,
}: FlipTextProps) {
  const words = useMemo(() => children.split(separator), [children, separator]);
  const totalChars = children.length;

  // Calculate character index for each position
  const getCharIndex = (wordIndex: number, charIndex: number) => {
    let index = 0;
    for (let i = 0; i < wordIndex; i++) {
      index += words[i].length + (separator === " " ? 1 : separator.length);
    }
    return index + charIndex;
  };

  return (
    <div
      className={cn(
        styles.flipTextWrapper,
        "flip-text-wrapper inline-block leading-none",
        className
      )}
      style={{ perspective: "1000px", ...style }}
      aria-label={children}
      role="text"
    >
      {words.map((word, wordIndex) => {
        const chars = word.split("");

        return (
          <span
            key={wordIndex}
            className={cn(
              styles.word,
              "word inline-block whitespace-nowrap"
            )}
            style={{ transformStyle: "preserve-3d" }}
            aria-hidden="true"
          >
            {chars.map((char, charIndex) => {
              const currentGlobalIndex = getCharIndex(wordIndex, charIndex);

              // Calculate delay - if together, use same delay for all
              let calculatedDelay = delay;
              if (!together) {
                const normalizedIndex = totalChars > 0 ? currentGlobalIndex / totalChars : 0;
                const sineValue = Math.sin(normalizedIndex * (Math.PI / 2));
                calculatedDelay = sineValue * (duration * 0.25) + delay;
              }

              return (
                <span
                  key={charIndex}
                  className={cn(
                    styles.flipChar,
                    "flip-char inline-block relative"
                  )}
                  data-char={char}
                  style={
                    {
                      "--flip-duration": `${duration}s`,
                      "--flip-delay": `${calculatedDelay}s`,
                      "--flip-iteration": loop ? "infinite" : "1",
                      transformStyle: "preserve-3d",
                    } as React.CSSProperties
                  }
                >
                  {char}
                </span>
              );
            })}
            {separator === " " && wordIndex < words.length - 1 && (
              <span className={cn(styles.whitespace, "whitespace inline-block")}>
                &nbsp;
              </span>
            )}
            {separator !== " " && wordIndex < words.length - 1 && (
              <span className={cn(styles.separator, "separator inline-block")}>
                {separator}
              </span>
            )}
          </span>
        );
      })}
    </div>
  );
}

export function Example() {
  return (
    <FlipText className="text-4xl font-bold">
      Your amazing text here
    </FlipText>
  );
}

export default FlipText;
