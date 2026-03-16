const RANK_COLORS = ["#F59E0B", "#6B7280", "#6B7280"];

function SkeletonRow({
  rank,
  rankColor,
  lastRow,
}: {
  rank: number;
  rankColor: string;
  lastRow: boolean;
}) {
  return (
    <div
      className={`flex items-start px-5 py-4 ${lastRow ? "" : "border-b border-[#2A2A2A]"}`}
    >
      <span
        className="w-[50px] shrink-0 font-['JetBrains_Mono',monospace] text-[12px] font-normal pt-px"
        style={{ color: rankColor }}
      >
        {rank}
      </span>

      <span className="w-[70px] shrink-0 pt-px">
        <span className="block h-3 w-8 rounded-sm bg-[#1F1F1F] animate-pulse" />
      </span>

      <div className="flex-1 flex flex-col gap-[6px] min-w-0">
        <span className="block h-3 w-[85%] rounded-sm bg-[#1F1F1F] animate-pulse" />
        <span className="block h-3 w-[60%] rounded-sm bg-[#1F1F1F] animate-pulse" />
        <span className="block h-3 w-[40%] rounded-sm bg-[#1F1F1F] animate-pulse" />
      </div>

      <span className="w-[100px] shrink-0 flex justify-end pt-px">
        <span className="block h-3 w-12 rounded-sm bg-[#1F1F1F] animate-pulse" />
      </span>
    </div>
  );
}

export function LeaderboardSkeleton() {
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

      {[1, 2, 3].map((rank) => (
        <SkeletonRow
          key={rank}
          rank={rank}
          rankColor={RANK_COLORS[rank - 1]}
          lastRow={rank === 3}
        />
      ))}
    </div>
  );
}
