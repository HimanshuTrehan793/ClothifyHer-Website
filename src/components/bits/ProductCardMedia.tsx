import { useEffect, useRef, useState } from "react";
import { Play } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  prefersHoverPlayback,
  prefersReducedMotion,
  videoOf,
} from "@/utils/media";
import type { Product } from "@/interfaces/catalog";

interface ProductCardMediaProps {
  product: Product;
  className?: string;
}

/**
 * Card thumbnail that upgrades to video when the product has one.
 *
 * Desktop (hover-capable): the still is shown until hover, then the video
 * fades in and plays. Touch: no hover exists, so the video plays only while
 * the card is at least 60% on screen and pauses the moment it leaves —
 * otherwise a grid of cards would decode a dozen videos at once.
 *
 * Reduced-motion users never get autoplay; they see the still plus the badge.
 */
export function ProductCardMedia({
  product,
  className,
}: ProductCardMediaProps) {
  const video = videoOf(product);
  const videoRef = useRef<HTMLVideoElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);

  // `play()` rejects if the element is detached or autoplay is blocked —
  // swallow it so a failed play never surfaces as an unhandled rejection.
  const play = () => {
    videoRef.current?.play().then(
      () => setPlaying(true),
      () => setPlaying(false),
    );
  };

  const pause = () => {
    const el = videoRef.current;
    if (!el) return;
    el.pause();
    el.currentTime = 0;
    setPlaying(false);
  };

  useEffect(() => {
    if (!video || prefersReducedMotion()) return;
    // Desktop drives playback from hover handlers instead.
    if (prefersHoverPlayback()) return;

    const el = wrapRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? play() : pause()),
      { threshold: 0.6 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      pause();
    };
  }, [video]);

  const hoverHandlers =
    video && !prefersReducedMotion() && prefersHoverPlayback()
      ? { onMouseEnter: play, onMouseLeave: pause }
      : {};

  return (
    <div
      ref={wrapRef}
      className={cn(
        "relative overflow-hidden rounded-2xl bg-stone-200",
        className,
      )}
      {...hoverHandlers}
    >
      {/* 3:4 keeps the tall, editorial crop fashion product shots need. */}
      <img
        src={product.image}
        alt={product.title}
        loading="lazy"
        className={cn(
          "aspect-[3/4] w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105",
          playing && "opacity-0",
        )}
      />

      {video && (
        <>
          <video
            ref={videoRef}
            src={video.url}
            poster={video.poster}
            muted
            loop
            playsInline
            preload="none"
            aria-hidden
            tabIndex={-1}
            className={cn(
              "absolute inset-0 h-full w-full object-cover transition-opacity duration-300",
              playing ? "opacity-100" : "opacity-0",
            )}
          />

          {/* Tells the user there's video here before anything moves. */}
          <span
            className={cn(
              "pointer-events-none absolute bottom-2.5 left-2.5 grid h-7 w-7 place-items-center rounded-full bg-stone-900/55 backdrop-blur-sm transition-opacity duration-300",
              playing ? "opacity-0" : "opacity-100",
            )}
          >
            <Play className="h-3 w-3 fill-white text-white" />
          </span>
        </>
      )}
    </div>
  );
}
