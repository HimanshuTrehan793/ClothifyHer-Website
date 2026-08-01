import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Play, ZoomIn } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProductMedia } from "@/interfaces/catalog";

interface ProductGalleryProps {
  media: ProductMedia[];
  title: string;
}

export function ProductGallery({ media, title }: ProductGalleryProps) {
  const [index, setIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [origin, setOrigin] = useState("50% 50%");
  const stageRef = useRef<HTMLDivElement>(null);

  const current = media[index];
  const go = (next: number) =>
    setIndex(((next % media.length) + media.length) % media.length);

  // Track the cursor as a percentage so transform-origin follows the pointer.
  const onMove = (e: React.MouseEvent) => {
    if (!zoomed || !stageRef.current) return;
    const r = stageRef.current.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    setOrigin(`${x}% ${y}%`);
  };

  return (
    <div className="flex flex-col-reverse gap-3 lg:flex-row">
      {/* Thumbnails: horizontal rail on mobile, vertical column on desktop */}
      {media.length > 1 && (
        <ul className="hide-scrollbar flex shrink-0 gap-2 overflow-x-auto lg:w-20 lg:flex-col lg:overflow-visible">
          {media.map((item, i) => (
            <li key={item.url + i}>
              <button
                type="button"
                onClick={() => {
                  setIndex(i);
                  setZoomed(false);
                }}
                aria-label={`View ${item.kind} ${i + 1} of ${media.length}`}
                aria-current={i === index}
                className={cn(
                  "relative block w-16 overflow-hidden rounded-xl border-2 transition-colors lg:w-full",
                  i === index
                    ? "border-maroon-800"
                    : "border-transparent hover:border-stone-300",
                )}
              >
                <img
                  src={item.kind === "video" ? item.poster : item.url}
                  alt=""
                  loading="lazy"
                  className="aspect-[3/4] w-full object-cover"
                />
                {item.kind === "video" && (
                  <span className="absolute inset-0 grid place-items-center bg-stone-900/25">
                    <Play className="h-4 w-4 fill-white text-white" />
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Stage */}
      <div
        ref={stageRef}
        onMouseMove={onMove}
        onMouseLeave={() => setZoomed(false)}
        className="relative flex-1 overflow-hidden rounded-2xl bg-stone-200"
      >
        {current.kind === "image" ? (
          <>
            <img
              src={current.url}
              alt={current.alt ?? title}
              /* First frame is the LCP element on this route. */
              loading={index === 0 ? "eager" : "lazy"}
              onClick={() => setZoomed((z) => !z)}
              style={{ transformOrigin: origin }}
              className={cn(
                "aspect-[3/4] w-full object-cover transition-transform duration-300",
                zoomed ? "scale-[2] cursor-zoom-out" : "cursor-zoom-in",
              )}
            />
            {!zoomed && (
              <span className="pointer-events-none absolute right-3 bottom-3 inline-flex items-center gap-1.5 rounded-full bg-white/85 px-3 py-1.5 text-[11px] font-medium text-stone-700 backdrop-blur-sm">
                <ZoomIn className="h-3.5 w-3.5" />
                Tap to zoom
              </span>
            )}
          </>
        ) : (
          <video
            key={current.url}
            src={current.url}
            poster={current.poster}
            controls
            playsInline
            preload="metadata"
            className="aspect-[3/4] w-full bg-stone-900 object-cover"
          />
        )}

        {media.length > 1 && (
          <>
            <GalleryArrow side="left" onClick={() => go(index - 1)} />
            <GalleryArrow side="right" onClick={() => go(index + 1)} />
          </>
        )}
      </div>
    </div>
  );
}

function GalleryArrow({
  side,
  onClick,
}: {
  side: "left" | "right";
  onClick: () => void;
}) {
  const Icon = side === "left" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={side === "left" ? "Previous media" : "Next media"}
      className={cn(
        "absolute top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-white/85 text-stone-700 shadow-sm backdrop-blur-sm transition-colors hover:bg-white",
        side === "left" ? "left-3" : "right-3",
      )}
    >
      <Icon className="h-5 w-5" />
    </button>
  );
}
