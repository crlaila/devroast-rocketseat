"use client";

import * as Collapsible from "@base_ui/react/Collapsible";
import { useMemo, useState } from "react";
import { useShikiHighlighter } from "@/hooks/use-shiki-highlighter";
import { cn } from "@/lib/utils";
import type { CodeLine } from "./code-block";

const MAX_VISIBLE_LINES = 3;

/** Fallback: converts raw code lines to plain CodeLine tokens */
function toPlainLines(code: string): CodeLine[] {
  return code.split("\n").map((line) => [{ text: line, color: "#FAFAFA" }]);
}

function CodeLines({
  lines,
  startLineNumber = 1,
}: {
  lines: CodeLine[];
  startLineNumber?: number;
}) {
  return (
    <div className="flex">
      {/* Line numbers */}
      <div className="flex flex-col gap-[6px] w-10 shrink-0 bg-[#0F0F0F] border-r border-[#2A2A2A] px-[10px] py-3">
        {lines.map((_, i) => (
          <span
            // biome-ignore lint/suspicious/noArrayIndexKey: line numbers are positional
            key={i}
            className="font-['JetBrains_Mono',monospace] text-[13px] font-normal text-[#4B5563] leading-none"
          >
            {startLineNumber + i}
          </span>
        ))}
      </div>

      {/* Token lines */}
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
  );
}

interface CollapsibleCodeProps {
  code: string;
  language: string;
  className?: string;
}

export function CollapsibleCode({
  code,
  language,
  className,
}: CollapsibleCodeProps) {
  const [open, setOpen] = useState(false);
  const { tokenize, ready } = useShikiHighlighter();

  // All tokenized lines — re-computed only when shiki becomes ready or code changes
  const allLines: CodeLine[] = useMemo(() => {
    if (!ready) return toPlainLines(code);
    return tokenize(code, language);
  }, [ready, tokenize, code, language]);

  const previewLines = allLines.slice(0, MAX_VISIBLE_LINES);
  const extraLines = allLines.slice(MAX_VISIBLE_LINES);
  const hasMore = extraLines.length > 0;
  const hiddenCount = extraLines.length;

  return (
    <Collapsible.Root
      open={open}
      onOpenChange={setOpen}
      className={cn("flex flex-col bg-[#111111] overflow-hidden", className)}
    >
      {/* Always-visible first N lines */}
      <CodeLines lines={previewLines} startLineNumber={1} />

      {hasMore && (
        <>
          {/* Extra lines revealed by collapsible */}
          <Collapsible.Content className="overflow-hidden">
            <div className="border-t border-[#2A2A2A]">
              <CodeLines
                lines={extraLines}
                startLineNumber={MAX_VISIBLE_LINES + 1}
              />
            </div>
          </Collapsible.Content>

          {/* Toggle trigger */}
          <Collapsible.Trigger className="flex items-center justify-center h-8 border-t border-[#2A2A2A] bg-[#0F0F0F] hover:bg-[#141414] transition-colors cursor-pointer w-full">
            <span className="font-['JetBrains_Mono',monospace] text-[12px] font-normal text-[#4B5563] hover:text-[#6B7280] transition-colors">
              {open
                ? "// collapse"
                : `// ${hiddenCount} more line${hiddenCount !== 1 ? "s" : ""} — expand`}
            </span>
          </Collapsible.Trigger>
        </>
      )}
    </Collapsible.Root>
  );
}
