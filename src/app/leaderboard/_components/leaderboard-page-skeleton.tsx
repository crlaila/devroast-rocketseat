function SkeletonCard({ rank }: { rank: number }) {
  return (
    <div className="flex flex-col border border-[#2A2A2A]">
      {/* Meta header skeleton */}
      <div className="flex items-center justify-between h-10 px-4 bg-[#0F0F0F] border-b border-[#2A2A2A]">
        <div className="flex items-center gap-4">
          {/* Rank */}
          <div className="flex items-center gap-1.5">
            <span className="font-['JetBrains_Mono',monospace] text-[12px] font-normal text-[#4B5563]">
              #
            </span>
            <span className="font-['JetBrains_Mono',monospace] text-[13px] font-bold text-[#4B5563]">
              {rank}
            </span>
          </div>
          {/* Score placeholder */}
          <span className="block h-3 w-16 rounded-sm bg-[#1F1F1F] animate-pulse" />
        </div>
        {/* Language placeholder */}
        <span className="block h-3 w-14 rounded-sm bg-[#1F1F1F] animate-pulse" />
      </div>

      {/* Code area skeleton */}
      <div className="flex bg-[#111111] p-3 gap-3">
        {/* Line numbers column */}
        <div className="flex flex-col gap-[6px] w-10 shrink-0">
          <span className="block h-3 w-4 rounded-sm bg-[#1F1F1F] animate-pulse" />
          <span className="block h-3 w-4 rounded-sm bg-[#1F1F1F] animate-pulse" />
          <span className="block h-3 w-4 rounded-sm bg-[#1F1F1F] animate-pulse" />
        </div>
        {/* Code lines */}
        <div className="flex flex-col gap-[6px] flex-1">
          <span className="block h-3 w-[75%] rounded-sm bg-[#1F1F1F] animate-pulse" />
          <span className="block h-3 w-[55%] rounded-sm bg-[#1F1F1F] animate-pulse" />
          <span className="block h-3 w-[40%] rounded-sm bg-[#1F1F1F] animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export function LeaderboardPageSkeleton() {
  return (
    <div className="flex flex-col gap-3 w-full">
      {Array.from({ length: 20 }, (_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: skeleton rows are positional placeholders
        <SkeletonCard key={i + 1} rank={i + 1} />
      ))}
    </div>
  );
}
