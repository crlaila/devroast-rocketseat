// Pencil: tableRowSection → leaderboardRow (0SI58)
// flex row, alignItems=center, gap=24, padding=[16,20], stroke bottom border-primary 1px, width=fill_container
//
// Cells (all content is JetBrains Mono):
//   rankCell  (K3kUc): width=40,  text "#1"          13px normal text-tertiary (#4B5563)
//   scoreCell (FRMi1): width=60,  text "2.1"         13px bold   accent-red   (#EF4444)
//   codeCell  (gcDEk): flex-1,    text code preview  12px normal text-secondary (#6B7280)
//   langCell  (AN8GW): width=100, text "javascript"  12px normal text-tertiary (#4B5563)

import * as React from "react";
import { cn } from "@/lib/utils";

export interface TableRowProps extends React.HTMLAttributes<HTMLDivElement> {
  rank?: string;
  score?: string;
  code?: string;
  language?: string;
}

const TableRow = React.forwardRef<HTMLDivElement, TableRowProps>(
  ({ className, rank, score, code, language, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex items-center gap-6 px-5 py-4 border-b border-[#2A2A2A] w-full",
        className,
      )}
      {...props}
    >
      {/* rank: w=40 */}
      <span className="w-10 shrink-0 font-['JetBrains_Mono',monospace] text-[13px] font-normal text-[#4B5563]">
        {rank}
      </span>

      {/* score: w=60, bold, accent-red */}
      <span className="w-[60px] shrink-0 font-['JetBrains_Mono',monospace] text-[13px] font-bold text-[#EF4444]">
        {score}
      </span>

      {/* code: fill remaining, text-secondary, truncate */}
      <span className="flex-1 min-w-0 font-['JetBrains_Mono',monospace] text-[12px] font-normal text-[#6B7280] truncate">
        {code}
      </span>

      {/* language: w=100, text-tertiary */}
      <span className="w-[100px] shrink-0 font-['JetBrains_Mono',monospace] text-[12px] font-normal text-[#4B5563] text-right">
        {language}
      </span>
    </div>
  ),
);
TableRow.displayName = "TableRow";

export { TableRow };
