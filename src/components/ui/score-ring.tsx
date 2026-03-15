// Pencil: scoreRingSection → scoreRingContainer (tPUOa)
// layout=none (absolute positioning), width=180, height=180
//
// outerRing (MZnZu): ellipse 180×180, stroke inside border-primary (#2A2A2A) thickness=4
//
// gradientArc (SoWM7): ellipse 180×180, startAngle=90 (starts at top)
//   stroke: angular gradient, thickness=4
//     stop 0%:   accent-green (#22C55E)
//     stop 35%:  accent-amber (#F59E0B)
//     stop 36%:  transparent (arc ends here — ~35% of 360° = ~126°)
//
// scoreCenter (SIHMS): absolute, 180×180, flex col, justifyContent=center, alignItems=center, gap=2
//   scoreNum  "3.5": JetBrains Mono 48px bold, fill=text-primary (#FAFAFA), lineHeight=1
//   scoreDenom "/10": JetBrains Mono 16px normal, fill=text-tertiary (#4B5563), lineHeight=1
//
// The arc covers 35% of the circle = 35% × 360° = 126° starting from top (−90° in SVG coords)
// Using SVG arc: circumference = 2πr. With r=86 (180/2 − 4/2 = 88, minus stroke half = 86+2=88 actually)
// Stroke width 4, so effective r for stroke center = (180-4)/2 = 88

import * as React from "react";
import { cn } from "@/lib/utils";

export interface ScoreRingProps extends React.HTMLAttributes<HTMLDivElement> {
  score?: number; // numeric value shown, e.g. 3.5
  maxScore?: number; // denominator shown, e.g. 10
  /** 0–1 fraction of the arc that is filled (default: score/maxScore) */
  progress?: number;
}

const ScoreRing = React.forwardRef<HTMLDivElement, ScoreRingProps>(
  ({ className, score = 3.5, maxScore = 10, progress, ...props }, ref) => {
    const fraction = progress !== undefined ? progress : score / maxScore;

    // SVG geometry matching the Pencil design
    const SIZE = 180;
    const STROKE = 4;
    const R = (SIZE - STROKE) / 2; // 88
    const CX = SIZE / 2; // 90
    const CY = SIZE / 2; // 90
    const CIRCUMFERENCE = 2 * Math.PI * R;
    // Arc covers `fraction` of the full circle
    const arcLength = fraction * CIRCUMFERENCE;

    // Gradient id – unique per instance when multiple rings on page
    const gradId = React.useId().replace(/:/g, "");

    return (
      <div
        ref={ref}
        className={cn("relative w-[180px] h-[180px] shrink-0", className)}
        {...props}
      >
        <svg
          width={SIZE}
          height={SIZE}
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          aria-label={`Score ${score} out of ${maxScore}`}
        >
          {/* Gradient definition */}
          <defs>
            {/* Angular-style gradient along the stroke path:
                We approximate it with a linearGradient rotated.
                The arc starts at the top (−90° = 270° in standard).
                A conic/angular gradient is best done with a linearGradient
                that sweeps from green to amber. */}
            <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#22C55E" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>
          </defs>

          {/* outerRing: full circle, stroke = border-primary */}
          <circle
            cx={CX}
            cy={CY}
            r={R}
            fill="none"
            stroke="#2A2A2A"
            strokeWidth={STROKE}
          />

          {/* gradientArc: starts at top (rotate −90°), fills `fraction` */}
          <circle
            cx={CX}
            cy={CY}
            r={R}
            fill="none"
            stroke={`url(#${gradId})`}
            strokeWidth={STROKE}
            strokeDasharray={`${arcLength} ${CIRCUMFERENCE}`}
            strokeLinecap="round"
            /* rotate so arc starts from top */
            transform={`rotate(-90 ${CX} ${CY})`}
          />
        </svg>

        {/* scoreCenter: absolutely positioned over the SVG */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
          <span className="font-['JetBrains_Mono',monospace] text-[48px] font-bold text-[#FAFAFA] leading-none">
            {score}
          </span>
          <span className="font-['JetBrains_Mono',monospace] text-[16px] font-normal text-[#4B5563] leading-none">
            /{maxScore}
          </span>
        </div>
      </div>
    );
  },
);
ScoreRing.displayName = "ScoreRing";

export { ScoreRing };
