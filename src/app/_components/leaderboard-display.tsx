"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import Link from "next/link";
import { CollapsibleCode } from "@/components";
import { useTRPC } from "@/trpc/client";

const RANK_COLORS = ["#F59E0B", "#6B7280", "#6B7280"];

export function LeaderboardDisplay() {
  const trpc = useTRPC();
  const { data: rows } = useSuspenseQuery(
    trpc.leaderboard.topThree.queryOptions(),
  );

  if (!rows.length) {
    return (
      <div className="border border-[#2A2A2A] flex flex-col w-full">
        <div className="flex items-center h-20 justify-center">
          <span className="font-['IBM_Plex_Mono',monospace] text-[13px] font-normal text-[#4B5563]">
            {"// no submissions yet"}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 w-full">
      {rows.map((row, index) => {
        const rankColor = RANK_COLORS[index] ?? "#6B7280";

        return (
          <article
            key={row.id}
            className="flex flex-col border border-[#2A2A2A]"
          >
            {/* Meta header — entire row is a link to the result */}
            <Link
              href={`/result/${row.id}`}
              className="flex items-center justify-between h-10 px-4 bg-[#0F0F0F] border-b border-[#2A2A2A] hover:bg-[#141414] transition-colors"
            >
              <div className="flex items-center gap-4">
                {/* Rank */}
                <div className="flex items-center gap-1.5">
                  <span className="font-['JetBrains_Mono',monospace] text-[12px] font-normal text-[#4B5563]">
                    #
                  </span>
                  <span
                    className="font-['JetBrains_Mono',monospace] text-[13px] font-bold"
                    style={{ color: rankColor }}
                  >
                    {row.rank}
                  </span>
                </div>

                {/* Score */}
                <div className="flex items-center gap-1.5">
                  <span className="font-['JetBrains_Mono',monospace] text-[12px] font-normal text-[#4B5563]">
                    score:
                  </span>
                  <span className="font-['JetBrains_Mono',monospace] text-[13px] font-bold text-[#EF4444]">
                    {Number(row.score).toFixed(1)}
                  </span>
                </div>
              </div>

              {/* Language */}
              <span className="font-['JetBrains_Mono',monospace] text-[12px] font-normal text-[#6B7280]">
                {row.language}
              </span>
            </Link>

            {/* Collapsible code block — outside the Link to avoid navigation on expand */}
            <CollapsibleCode
              code={row.code}
              language={row.language}
              className="w-full"
            />
          </article>
        );
      })}
    </div>
  );
}
