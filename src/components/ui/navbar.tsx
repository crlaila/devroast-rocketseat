// Pencil: navbarSection → navBar (9ikkG)
// flex row, alignItems=center, padding=[0,24], height=56, fill=bg-page (#0A0A0A)
// stroke bottom border-primary (#2A2A2A) 1px, width=fill_container
//
// navLogo (nSXzw): flex row, alignItems=center, gap=8
//   navPrompt ">":  JetBrains Mono 20px bold, fill=accent-green (#22C55E)
//   navName "devroast": JetBrains Mono 18px 500, fill=text-primary (#FAFAFA)
//
// navSpacer (rTutZ): height=1, width=fill_container  ← flex-1 spacer
//
// navLink "leaderboard": JetBrains Mono 13px normal, fill=text-secondary (#6B7280)

import * as React from "react";
import { cn } from "@/lib/utils";

export interface NavbarProps extends React.HTMLAttributes<HTMLElement> {
  appName?: string;
  links?: Array<{ label: string; href?: string }>;
}

const Navbar = React.forwardRef<HTMLElement, NavbarProps>(
  ({ className, appName = "devroast", links, children, ...props }, ref) => (
    <nav
      ref={ref}
      className={cn(
        "flex items-center px-6 h-14 bg-[#0A0A0A] border-b border-[#2A2A2A] w-full",
        className,
      )}
      {...props}
    >
      {/* navLogo */}
      <div className="flex items-center gap-2">
        <span className="font-['JetBrains_Mono',monospace] text-[20px] font-bold text-[#22C55E]">
          {">"}
        </span>
        <span className="font-['JetBrains_Mono',monospace] text-[18px] font-medium text-[#FAFAFA]">
          {appName}
        </span>
      </div>

      {/* navSpacer: flex-1 */}
      <span className="flex-1" />

      {/* nav links */}
      {links?.map((link) =>
        link.href ? (
          <a
            key={link.label}
            href={link.href}
            className="font-['JetBrains_Mono',monospace] text-[13px] font-normal text-[#6B7280] hover:text-[#FAFAFA] transition-colors"
          >
            {link.label}
          </a>
        ) : (
          <span
            key={link.label}
            className="font-['JetBrains_Mono',monospace] text-[13px] font-normal text-[#6B7280]"
          >
            {link.label}
          </span>
        ),
      )}

      {/* children (custom right-side content) */}
      {children}
    </nav>
  ),
);
Navbar.displayName = "Navbar";

export { Navbar };
