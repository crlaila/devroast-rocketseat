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
      <span className="w-10 shrink-0 font-['JetBrains_Mono',monospace] text-[13px] font-normal text-[#4B5563]">
        {rank}
      </span>
      <span className="w-[60px] shrink-0 font-['JetBrains_Mono',monospace] text-[13px] font-bold text-[#EF4444]">
        {score}
      </span>
      <span className="flex-1 min-w-0 font-['JetBrains_Mono',monospace] text-[12px] font-normal text-[#6B7280] truncate">
        {code}
      </span>
      <span className="w-[100px] shrink-0 font-['JetBrains_Mono',monospace] text-[12px] font-normal text-[#4B5563] text-right">
        {language}
      </span>
    </div>
  ),
);
TableRow.displayName = "TableRow";

export { TableRow };
