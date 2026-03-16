"use client";

import NumberFlow from "@number-flow/react";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

export function MetricsDisplay() {
  const trpc = useTRPC();
  const { data } = useQuery(trpc.metrics.stats.queryOptions());

  const totalRoasted = data?.totalRoasted ?? 0;
  const avgScore = data?.avgScore ? Number(data.avgScore) : 0;

  return (
    <div className="flex items-center justify-center gap-6">
      <span className="font-['IBM_Plex_Mono',monospace] text-[12px] font-normal text-[#4B5563]">
        <NumberFlow
          value={totalRoasted}
          format={{ useGrouping: true }}
          className="inline-block tabular-nums"
        />{" "}
        codes roasted
      </span>
      <span className="font-['JetBrains_Mono',monospace] text-[12px] font-normal text-[#4B5563]">
        ·
      </span>
      <span className="font-['IBM_Plex_Mono',monospace] text-[12px] font-normal text-[#4B5563]">
        avg score:{" "}
        <NumberFlow
          value={avgScore}
          format={{ minimumFractionDigits: 1, maximumFractionDigits: 1 }}
          className="inline-block tabular-nums"
        />
        /10
      </span>
    </div>
  );
}
