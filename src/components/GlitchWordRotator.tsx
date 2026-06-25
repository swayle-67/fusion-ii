import React, { useState, useEffect } from "react";

const WORDS = ["GROWS", "SCALES", "THRIVES", "EVOLVES"];

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

export const GlitchWordRotator: React.FC = () => {
  const [wordIndex, setWordIndex] = useState(0);
  const [prevWordIndex, setPrevWordIndex] = useState<number | null>(null);
  const [step, setStep] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const cycleInterval = setInterval(() => {
      setPrevWordIndex(wordIndex);
      setWordIndex((prev) => (prev + 1) % WORDS.length);
      setStep(0);
      setIsTransitioning(true);
    }, 3000); // Wait 3.0s between words

    return () => clearInterval(cycleInterval);
  }, [wordIndex]);

  useEffect(() => {
    if (!isTransitioning) return;

    const transitionInterval = setInterval(() => {
      setStep((prev) => {
        const nextStep = prev + 1;
        // Max steps to resolve the longest word (e.g. max 7 chars * 1 stagger + 5 scramble duration = 12 frames)
        if (nextStep >= 18) {
          clearInterval(transitionInterval);
          setIsTransitioning(false);
          return 18;
        }
        return nextStep;
      });
    }, 20); // Faster snappy transitions (~20ms per frame)

    return () => clearInterval(transitionInterval);
  }, [isTransitioning]);

  const currentWord = WORDS[wordIndex];
  const previousWord = prevWordIndex !== null ? WORDS[prevWordIndex] : currentWord;
  const activeLength = isTransitioning 
    ? Math.max(currentWord.length, previousWord.length)
    : currentWord.length;

  // Generate list of characters to render for this tick
  const renderLetters = Array.from({ length: activeLength }).map((_, i) => {
    const targetChar = i < currentWord.length ? currentWord[i] : "";
    const originalChar = i < previousWord.length ? previousWord[i] : "";

    if (!isTransitioning) {
      return { char: targetChar, isGlitching: false };
    }

    const staggerStart = i * 1;
    const scrambleDuration = 5;
    const resolveFrame = staggerStart + scrambleDuration;

    if (step < staggerStart) {
      // Show old word character
      return { char: originalChar, isGlitching: false };
    } else if (step < resolveFrame) {
      // Scrambling character slot
      const randChar = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      return { char: randChar, isGlitching: true };
    } else {
      // Locked on new word character
      return { char: targetChar, isGlitching: false };
    }
  });

  return (
    <span className="inline-flex items-center font-monstercat select-none tracking-tight uppercase font-semibold">
      {renderLetters.map((node, i) => {
        if (node.char === "") return null;

        return (
          <span
            key={i}
            className={`inline-block transition-all duration-300 ${
              node.isGlitching
                ? "text-[#00f3ff]/70 font-semibold scale-105"
                : "text-[#00f3ff] font-semibold drop-shadow-[0_0_8px_rgba(0,243,255,0.35)]"
            }`}
          >
            {node.char}
          </span>
        );
      })}
    </span>
  );
};
