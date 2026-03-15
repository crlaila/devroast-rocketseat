// Pencil: codeBlockSection → codeEditor
// codeEditor: layout=vertical, fill=bg-input (#111111), stroke inside border-primary 1px, width=560
//
// codeHeader (nq6gE): flex row, height=40, padding=[0,16], gap=12, stroke bottom border-primary 1px
//   dotRed   #EF4444  10×10 ellipse
//   dotAmber #F59E0B  10×10 ellipse
//   dotGreen #10B981  10×10 ellipse
//   spacer:  fill_container flex-1
//   fileName: JetBrains Mono 12px text-tertiary (#4B5563)
//
// codeBody (IKvq1): flex row, width=fill_container
//   lineNumbers (Aenly): layout=vertical, fill=bg-surface (#0F0F0F), width=40, padding=[12,10], gap=6
//     stroke right border-primary 1px
//     each: JetBrains Mono 13px text-tertiary (#4B5563)
//   codeLines (E7asV): layout=vertical, gap=6, padding=12, width=fill_container
//     each line is a flex row with syntax-coloured spans
//
// Syntax token colours (from variables, first value):
//   syn-keyword:  #C678DD
//   syn-function: #61AFEF  (but design shows #FFC799 - second value used in dark theme)
//   syn-variable: #E06C75
//   syn-operator: #ABB2BF
//   syn-number:   #D19A66

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
      {/* ── Header ── */}
      <div className="flex items-center gap-3 h-10 px-4 border-b border-[#2A2A2A]">
        {/* macOS traffic light dots */}
        <span className="w-[10px] h-[10px] rounded-full bg-[#EF4444] shrink-0" />
        <span className="w-[10px] h-[10px] rounded-full bg-[#F59E0B] shrink-0" />
        <span className="w-[10px] h-[10px] rounded-full bg-[#10B981] shrink-0" />
        {/* spacer fills remaining */}
        <span className="flex-1" />
        {/* filename */}
        {fileName && (
          <span className="font-['JetBrains_Mono',monospace] text-[12px] font-normal text-[#4B5563]">
            {fileName}
          </span>
        )}
      </div>

      {/* ── Body ── */}
      <div className="flex">
        {/* Line numbers: w=40, bg=bg-surface, border-right */}
        <div className="flex flex-col gap-[6px] w-10 shrink-0 bg-[#0F0F0F] border-r border-[#2A2A2A] px-[10px] py-3">
          {lines.map((_, i) => (
            <span
              // biome-ignore lint/suspicious/noArrayIndexKey: line numbers are positional by definition
              key={i}
              className="font-['JetBrains_Mono',monospace] text-[13px] font-normal text-[#4B5563] leading-none"
            >
              {i + 1}
            </span>
          ))}
        </div>

        {/* Code lines: gap=6, padding=12 */}
        <div className="flex flex-col gap-[6px] flex-1 p-3">
          {lines.map((tokens, i) => (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: code lines are positional by definition
              key={i}
              className="flex flex-wrap leading-none"
            >
              {tokens.map((token, j) => (
                <span
                  // biome-ignore lint/suspicious/noArrayIndexKey: token positions within a line are stable
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
