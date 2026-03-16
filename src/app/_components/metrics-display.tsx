"use client";

import NumberFlow from "@number-flow/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

export function MetricsDisplay() {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.metrics.stats.queryOptions());

  return (
    <div className="flex items-center justify-center gap-6">
      <span className="font-['IBM_Plex_Mono',monospace] text-[12px] font-normal text-[#4B5563]">
        <NumberFlow
          value={data.totalRoasted}
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
          value={Number(data.avgScore)}
          format={{ minimumFractionDigits: 1, maximumFractionDigits: 1 }}
          className="inline-block tabular-nums"
        />
        /10
      </span>
    </div>
  );
}
