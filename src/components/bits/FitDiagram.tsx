import type { ChartKind } from "@/utils/sizeCharts";

/**
 * Line drawing showing where each measurement is taken. Inline SVG rather than
 * a hosted PNG so it inherits brand colours and stays crisp at any size.
 */
export function FitDiagram({ kind }: { kind: ChartKind }) {
  return kind === "bottom" ? <BottomDiagram /> : <TopDiagram />;
}

const garment = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinejoin: "round" as const,
};

const guide = {
  stroke: "var(--color-maroon-600)",
  strokeWidth: 1.5,
  strokeDasharray: "4 4",
};

function TopDiagram() {
  return (
    <svg
      viewBox="0 0 380 210"
      role="img"
      aria-label="Where each measurement is taken on a kurta"
      className="mx-auto h-40 w-full max-w-sm text-stone-400"
    >
      {/* kurta: neckline, shoulders, sleeves, A-line body */}
      <path
        {...garment}
        d="M148 26 L124 34 L104 44 L96 112 L116 118 L124 74 L124 184 L196 184 L196 74 L204 118 L224 112 L216 44 L196 34 L172 26 C167 42 153 42 148 26 Z"
      />

      <Guide y={44} x2={244} label="Shoulder" from={124} to={196} />
      <Guide y={80} x2={244} label="Bust" from={124} to={196} />
      <Guide y={122} x2={244} label="Waist" from={124} to={196} />
      <Guide y={162} x2={244} label="Hip" from={124} to={196} />
    </svg>
  );
}

function BottomDiagram() {
  return (
    <svg
      viewBox="0 0 380 210"
      role="img"
      aria-label="Where each measurement is taken on bottom wear"
      className="mx-auto h-40 w-full max-w-sm text-stone-400"
    >
      {/* trousers: waistband, two legs, centre seam */}
      <path
        {...garment}
        d="M126 34 L206 34 L214 186 L178 186 L166 104 L154 186 L118 186 Z"
      />
      <path {...garment} d="M126 48 L206 48" strokeWidth={1.5} />

      {/* labels sit left here so they don't collide with the length arrow */}
      <line x1={126} y1={41} x2={64} y2={41} {...guide} />
      <text
        x={58}
        y={45}
        textAnchor="end"
        className="fill-maroon-800 text-[15px] font-semibold"
      >
        Waist
      </text>

      <line x1={122} y1={70} x2={64} y2={70} {...guide} />
      <text
        x={58}
        y={74}
        textAnchor="end"
        className="fill-maroon-800 text-[15px] font-semibold"
      >
        Hips
      </text>

      {/* length: vertical arrow down the outside of the leg */}
      <line x1={244} y1={34} x2={244} y2={186} {...guide} />
      <circle cx={244} cy={34} r={3} className="fill-maroon-600" />
      <circle cx={244} cy={186} r={3} className="fill-maroon-600" />
      <line x1={214} y1={186} x2={244} y2={186} {...guide} />
      <line x1={206} y1={34} x2={244} y2={34} {...guide} />
      <text
        x={256}
        y={115}
        className="fill-maroon-800 text-[15px] font-semibold"
      >
        Length
      </text>
    </svg>
  );
}

/** A dashed rule across the garment, continuing out to a right-hand label. */
function Guide({
  y,
  x2,
  label,
  from,
  to,
}: {
  y: number;
  x2: number;
  label: string;
  from: number;
  to: number;
}) {
  return (
    <>
      <line x1={from} y1={y} x2={to} y2={y} {...guide} />
      <line x1={to} y1={y} x2={x2} y2={y} {...guide} />
      <text
        x={x2 + 10}
        y={y + 5}
        className="fill-maroon-800 text-[15px] font-semibold"
      >
        {label}
      </text>
    </>
  );
}
