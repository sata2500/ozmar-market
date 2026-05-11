"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./HeroSlider.module.css";

type Slide = {
  id: string;
  title: string | null;
  subtitle: string | null;
  description: string | null;
  image: string;
  mobileImage: string | null;
  link: string | null;
  buttonText: string | null;
  buttonStyle: string;
  textAlign: string;
  textColor: string;
};

type Props = {
  slides: Slide[];
};

export default function HeroSlider({ slides }: Props) {
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const total = slides.length;

  const goTo = useCallback(
    (index: number) => {
      if (isAnimating || total === 0) return;
      setIsAnimating(true);
      setCurrent((index + total) % total);
      setTimeout(() => setIsAnimating(false), 600);
    },
    [isAnimating, total]
  );

  const goNext = useCallback(() => goTo(current + 1), [current, goTo]);
  const goPrev = useCallback(() => goTo(current - 1), [current, goTo]);

  useEffect(() => {
    if (total <= 1 || isPaused) return;
    timerRef.current = setTimeout(goNext, 5000);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [current, isPaused, total, goNext]);

  if (total === 0) return null;

  const slide = slides[current];

  return (
    <section
      className={styles.slider}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="Ana sayfa slayt gösterisi"
    >
      {/* Slides */}
      <div className={styles.track}>
        {slides.map((s, i) => (
          <div
            key={s.id}
            className={`${styles.slide} ${i === current ? styles.active : styles.inactive}`}
            aria-hidden={i !== current}
          >
            <Image
              src={s.image}
              alt={s.title || "Slayt"}
              fill
              priority={i === 0}
              className={styles.image}
              sizes="100vw"
            />
            <div className={styles.overlay} />
          </div>
        ))}
      </div>

      {/* Content */}
      <div
        className={styles.content}
        style={{
          textAlign: slide.textAlign as "left" | "center" | "right",
          color: slide.textColor,
          alignItems:
            slide.textAlign === "center"
              ? "center"
              : slide.textAlign === "right"
              ? "flex-end"
              : "flex-start",
        }}
      >
        <div className={styles.contentInner}>
          {slide.subtitle && (
            <span className={styles.subtitle}>{slide.subtitle}</span>
          )}
          {slide.title && <h1 className={styles.title}>{slide.title}</h1>}
          {slide.description && (
            <p className={styles.description}>{slide.description}</p>
          )}
          {slide.link && slide.buttonText && (
            <Link
              href={slide.link}
              className={`btn btn-${slide.buttonStyle || "primary"} btn-lg ${styles.cta}`}
            >
              {slide.buttonText}
            </Link>
          )}
        </div>
      </div>

      {/* Navigation Arrows */}
      {total > 1 && (
        <>
          <button
            onClick={goPrev}
            className={`${styles.arrow} ${styles.arrowLeft}`}
            aria-label="Önceki slayt"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            onClick={goNext}
            className={`${styles.arrow} ${styles.arrowRight}`}
            aria-label="Sonraki slayt"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </>
      )}

      {/* Dots */}
      {total > 1 && (
        <div className={styles.dots} role="tablist" aria-label="Slayt gezintisi">
          {slides.map((_, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === current}
              aria-label={`Slayt ${i + 1}`}
              className={`${styles.dot} ${i === current ? styles.dotActive : ""}`}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
      )}

      {/* Progress Bar */}
      {total > 1 && !isPaused && (
        <div className={styles.progressBar}>
          <div
            key={`${current}-progress`}
            className={styles.progress}
          />
        </div>
      )}
    </section>
  );
}
