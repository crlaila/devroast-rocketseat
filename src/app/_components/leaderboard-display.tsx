"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useTRPC } from "@/trpc/client";

const RANK_COLORS = ["#F59E0B", "#6B7280", "#6B7280"];

function isComment(line: string): boolean {
  const trimmed = line.trimStart();
  return (
    trimmed.startsWith("//") ||
    trimmed.startsWith("#") ||
    trimmed.startsWith("--") ||
    trimmed.startsWith("/*") ||
    trimmed.startsWith("*")
  );
}

export function LeaderboardDisplay() {
  const trpc = useTRPC();
  const { data } = useQuery(trpc.leaderboard.topThree.queryOptions());

  const rows = data ?? [];

  return (
    <div className="border border-[#2A2A2A] flex flex-col w-full">
      {/* header */}
      <div className="flex items-center h-10 px-5 bg-[#0F0F0F] border-b border-[#2A2A2A]">
        <span className="w-[50px] shrink-0 font-['JetBrains_Mono',monospace] text-[12px] font-medium text-[#4B5563]">
          #
        </span>
        <span className="w-[70px] shrink-0 font-['JetBrains_Mono',monospace] text-[12px] font-medium text-[#4B5563]">
          score
        </span>
        <span className="flex-1 font-['JetBrains_Mono',monospace] text-[12px] font-medium text-[#4B5563]">
          code
        </span>
        <span className="w-[100px] shrink-0 font-['JetBrains_Mono',monospace] text-[12px] font-medium text-[#4B5563]">
          lang
        </span>
      </div>

      {rows.map((row, index) => {
        const isLast = index === rows.length - 1;
        const rankColor = RANK_COLORS[index] ?? "#6B7280";

        return (
          <Link
            key={row.id}
            href={`/result/${row.id}`}
            className={`flex items-start px-5 py-4 transition-colors hover:bg-[#141414] ${
              isLast ? "" : "border-b border-[#2A2A2A]"
            }`}
          >
            <span
              className="w-[50px] shrink-0 font-['JetBrains_Mono',monospace] text-[12px] font-normal pt-px"
              style={{ color: rankColor }}
            >
              {row.rank}
            </span>

            <span className="w-[70px] shrink-0 font-['JetBrains_Mono',monospace] text-[12px] font-bold text-[#EF4444] pt-px">
              {Number(row.score).toFixed(1)}
            </span>

            <div className="flex-1 flex flex-col gap-[3px] min-w-0">
              {row.codeLines.map((line, i) => (
                <span
                  // biome-ignore lint/suspicious/noArrayIndexKey: code lines are positional
                  key={i}
                  className="font-['JetBrains_Mono',monospace] text-[12px] font-normal truncate"
                  style={{ color: isComment(line) ? "#4B5563" : "#FAFAFA" }}
                >
                  {line}
                </span>
              ))}
            </div>

            <span className="w-[100px] shrink-0 font-['JetBrains_Mono',monospace] text-[12px] font-normal text-[#6B7280] text-right pt-px">
              {row.language}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
