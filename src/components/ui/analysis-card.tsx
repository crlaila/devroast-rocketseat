import * as React from "react";
import { cn } from "@/lib/utils";

type CardVariant = "critical" | "warning" | "good";

const variantColors: Record<CardVariant, string> = {
  critical: "#EF4444",
  warning: "#F59E0B",
  good: "#22C55E",
};

export interface AnalysisCardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  badgeLabel?: string;
  title?: string;
  description?: string;
}

const AnalysisCard = React.forwardRef<HTMLDivElement, AnalysisCardProps>(
  (
    {
      className,
      variant = "critical",
      badgeLabel,
      title,
      description,
      children,
      ...props
    },
    ref,
  ) => {
    const color = variantColors[variant];

    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col gap-3 p-5 border border-[#2A2A2A] w-[480px]",
          className,
        )}
        {...props}
      >
        {badgeLabel && (
          <div className="flex items-center gap-2">
            <span
              className="inline-block w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: color }}
            />
            <span
              className="font-['JetBrains_Mono',monospace] text-[12px] font-normal"
              style={{ color }}
            >
              {badgeLabel}
            </span>
          </div>
        )}

        {title && (
          <p className="font-['JetBrains_Mono',monospace] text-[13px] font-normal text-[#FAFAFA]">
            {title}
          </p>
        )}

        {description && (
          <p className="font-['IBM_Plex_Mono',monospace] text-[12px] font-normal text-[#6B7280] leading-[1.5]">
            {description}
          </p>
        )}

        {children}
      </div>
    );
  },
);
AnalysisCard.displayName = "AnalysisCard";

export { AnalysisCard };
