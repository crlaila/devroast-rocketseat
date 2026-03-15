// Pencil: badgeSection → badgeRow
// Each badge: flex row, alignItems=center, gap=8
//   dot: ellipse w=8 h=8, filled with variant color
//   text: font JetBrains Mono 12px (verdict uses 13px), same color as dot
// Variants:
//   critical:  color = accent-red  (#EF4444)
//   warning:   color = accent-amber (#F59E0B)
//   good:      color = accent-green (#22C55E)  ← note: accent-green = #22C55E (from $accent-green var)
//   verdict:   color = accent-red  (#EF4444), text size=13px

import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";

const badgeStatusVariants = cva(
  "inline-flex items-center gap-2 font-['JetBrains_Mono',monospace] font-normal",
  {
    variants: {
      variant: {
        critical: "text-[#EF4444] text-[12px]",
        warning: "text-[#F59E0B] text-[12px]",
        good: "text-[#22C55E] text-[12px]",
        verdict: "text-[#EF4444] text-[13px]",
      },
    },
    defaultVariants: {
      variant: "critical",
    },
  },
);

const dotColor: Record<string, string> = {
  critical: "bg-[#EF4444]",
  warning: "bg-[#F59E0B]",
  good: "bg-[#22C55E]",
  verdict: "bg-[#EF4444]",
};

export interface BadgeStatusProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeStatusVariants> {}

const BadgeStatus = React.forwardRef<HTMLDivElement, BadgeStatusProps>(
  ({ className, variant = "critical", children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(badgeStatusVariants({ variant }), className)}
      {...props}
    >
      {/* dot: ellipse 8×8 */}
      <span
        className={cn(
          "inline-block w-2 h-2 rounded-full shrink-0",
          dotColor[variant ?? "critical"],
        )}
      />
      {children}
    </div>
  ),
);
BadgeStatus.displayName = "BadgeStatus";

export { BadgeStatus, badgeStatusVariants };
