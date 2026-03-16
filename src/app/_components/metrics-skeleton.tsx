export function MetricsSkeleton() {
  return (
    <div className="flex items-center justify-center gap-6">
      <span className="font-['IBM_Plex_Mono',monospace] text-[12px] font-normal text-[#4B5563]">
        — codes roasted
      </span>
      <span className="font-['JetBrains_Mono',monospace] text-[12px] font-normal text-[#4B5563]">
        ·
      </span>
      <span className="font-['IBM_Plex_Mono',monospace] text-[12px] font-normal text-[#4B5563]">
        avg score: —/10
      </span>
    </div>
  );
}
