// Pencil: buttonsSection → buttonRow
// 3 variants from design:
//   primaryBtn:   fill=#22C55E (accent-green), text=#0A0A0A, padding=[10,24], font JetBrains Mono 13 500
//   secondaryBtn: transparent, border=border-primary (#2A2A2A), padding=[8,16], font JetBrains Mono 12 normal, text=text-primary
//   linkBtn:      transparent, border=border-primary (#2A2A2A), padding=[6,12], font JetBrains Mono 12 normal, text=text-secondary (#6B7280)

import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center font-['JetBrains_Mono',monospace] cursor-pointer transition-opacity hover:opacity-80 disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none",
  {
    variants: {
      variant: {
        // primaryBtn: fill accent-green, text #0A0A0A, padding [10,24]
        primary:
          "bg-[#22C55E] text-[#0A0A0A] text-[13px] font-medium px-6 py-[10px]",
        // secondaryBtn: transparent + border-primary, text text-primary, padding [8,16]
        secondary:
          "bg-transparent border border-[#2A2A2A] text-[#FAFAFA] text-[12px] font-normal px-4 py-2",
        // linkBtn: transparent + border-primary, text text-secondary, padding [6,12]
        link: "bg-transparent border border-[#2A2A2A] text-[#6B7280] text-[12px] font-normal px-3 py-[6px]",
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, children, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant }), className)}
      {...props}
    >
      {children}
    </button>
  ),
);
Button.displayName = "Button";

export { Button, buttonVariants };
