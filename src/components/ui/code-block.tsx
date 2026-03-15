import * as React from "react";
import { cn } from "@/lib/utils";

export type CodeToken = { text: string; color: string };
export type CodeLine = CodeToken[];

export interface CodeBlockProps extends React.HTMLAttributes<HTMLDivElement> {
  fileName?: string;
  lines: CodeLine[];
}

const CodeBlock = React.forwardRef<HTMLDivElement, CodeBlockProps>(
  ({ className, fileName, lines, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex flex-col border border-[#2A2A2A] bg-[#111111] w-[560px] overflow-hidden",
        className,
      )}
      {...props}
    >
      <div className="flex items-center gap-3 h-10 px-4 border-b border-[#2A2A2A]">
        <span className="w-[10px] h-[10px] rounded-full bg-[#EF4444] shrink-0" />
        <span className="w-[10px] h-[10px] rounded-full bg-[#F59E0B] shrink-0" />
        <span className="w-[10px] h-[10px] rounded-full bg-[#10B981] shrink-0" />
        <span className="flex-1" />
        {fileName && (
          <span className="font-['JetBrains_Mono',monospace] text-[12px] font-normal text-[#4B5563]">
            {fileName}
          </span>
        )}
      </div>

      <div className="flex">
        <div className="flex flex-col gap-[6px] w-10 shrink-0 bg-[#0F0F0F] border-r border-[#2A2A2A] px-[10px] py-3">
          {lines.map((_, i) => (
            <span
              // biome-ignore lint/suspicious/noArrayIndexKey: line numbers are positional
              key={i}
              className="font-['JetBrains_Mono',monospace] text-[13px] font-normal text-[#4B5563] leading-none"
            >
              {i + 1}
            </span>
          ))}
        </div>

        <div className="flex flex-col gap-[6px] flex-1 p-3">
          {lines.map((tokens, i) => (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: code lines are positional
              key={i}
              className="flex flex-wrap leading-none"
            >
              {tokens.map((token, j) => (
                <span
                  // biome-ignore lint/suspicious/noArrayIndexKey: token positions are stable
                  key={j}
                  className="font-['JetBrains_Mono',monospace] text-[13px] font-normal"
                  style={{ color: token.color }}
                >
                  {token.text}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
);
CodeBlock.displayName = "CodeBlock";

export { CodeBlock };
