// Pencil: diffLineSection → diffLines (width=560)
// Three rows, all: flex row, gap=8, padding=[8,16]
//
// diffRemoved (0mlFd): fill=#1A0A0A
//   prefix "-"  fill=accent-red (#EF4444), JetBrains Mono 13px normal
//   code         fill=text-secondary (#6B7280), JetBrains Mono 13px normal
//
// diffAdded (hVheA): fill=#0A1A0F
//   prefix "+"  fill=accent-green (#22C55E), JetBrains Mono 13px normal
//   code         fill=text-primary (#FAFAFA), JetBrains Mono 13px normal
//
// diffContext (vYoEf): no fill (transparent)
//   prefix " "  fill=text-tertiary (#4B5563), JetBrains Mono 13px normal
//   code         fill=text-secondary (#6B7280), JetBrains Mono 13px normal

import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";

const diffLineVariants = cva("flex items-center gap-2 px-4 py-2 w-full", {
  variants: {
    type: {
      removed: "bg-[#1A0A0A]",
      added: "bg-[#0A1A0F]",
      context: "bg-transparent",
    },
  },
  defaultVariants: { type: "context" },
});

const prefixStyle: Record<string, string> = {
  removed: "text-[#EF4444]",
  added: "text-[#22C55E]",
  context: "text-[#4B5563]",
};

const prefixChar: Record<string, string> = {
  removed: "-",
  added: "+",
  context: " ",
};

const codeStyle: Record<string, string> = {
  removed: "text-[#6B7280]",
  added: "text-[#FAFAFA]",
  context: "text-[#6B7280]",
};

export interface DiffLineProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof diffLineVariants> {
  code: string;
}

const DiffLine = React.forwardRef<HTMLDivElement, DiffLineProps>(
  ({ className, type = "context", code, ...props }, ref) => {
    const t = type ?? "context";
    return (
      <div
        ref={ref}
        className={cn(diffLineVariants({ type }), className)}
        {...props}
      >
        <span
          className={cn(
            "font-['JetBrains_Mono',monospace] text-[13px] font-normal shrink-0 w-3",
            prefixStyle[t],
          )}
        >
          {prefixChar[t]}
        </span>
        <span
          className={cn(
            "font-['JetBrains_Mono',monospace] text-[13px] font-normal",
            codeStyle[t],
          )}
        >
          {code}
        </span>
      </div>
    );
  },
);
DiffLine.displayName = "DiffLine";

export { DiffLine, diffLineVariants };
