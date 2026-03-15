import * as React from "react";
import { cn } from "@/lib/utils";

export interface ScoreRingProps extends React.HTMLAttributes<HTMLDivElement> {
  score?: number;
  maxScore?: number;
  progress?: number;
}

const ScoreRing = React.forwardRef<HTMLDivElement, ScoreRingProps>(
  ({ className, score = 3.5, maxScore = 10, progress, ...props }, ref) => {
    const fraction = progress !== undefined ? progress : score / maxScore;

    const SIZE = 180;
    const STROKE = 4;
    const R = (SIZE - STROKE) / 2;
    const CX = SIZE / 2;
    const CY = SIZE / 2;
    const CIRCUMFERENCE = 2 * Math.PI * R;
    const arcLength = fraction * CIRCUMFERENCE;

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
          <defs>
            <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#22C55E" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>
          </defs>

          <circle
            cx={CX}
            cy={CY}
            r={R}
            fill="none"
            stroke="#2A2A2A"
            strokeWidth={STROKE}
          />

          <circle
            cx={CX}
            cy={CY}
            r={R}
            fill="none"
            stroke={`url(#${gradId})`}
            strokeWidth={STROKE}
            strokeDasharray={`${arcLength} ${CIRCUMFERENCE}`}
            strokeLinecap="round"
            transform={`rotate(-90 ${CX} ${CY})`}
          />
        </svg>

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
