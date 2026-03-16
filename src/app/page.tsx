import { Button } from "@/components";
import { HomeEditor } from "./_components/home-editor";
import { LeaderboardServer } from "./_components/leaderboard-server";
import { MetricsServer } from "./_components/metrics-server";

export default function HomePage() {
  return (
    <main className="bg-[#0A0A0A] min-h-screen">
      <div className="max-w-[960px] mx-auto px-10 pt-20 pb-20 flex flex-col gap-8">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-center gap-3">
            <span className="font-['JetBrains_Mono',monospace] text-[36px] font-bold text-[#22C55E]">
              $
            </span>
            <span className="font-['JetBrains_Mono',monospace] text-[36px] font-bold text-[#FAFAFA]">
              paste your code. get roasted.
            </span>
          </div>
          <p className="font-['IBM_Plex_Mono',monospace] text-center text-[14px] font-normal text-[#6B7280]">
            {
              "// drop your code below and we'll rate it — brutally honest or full roast mode"
            }
          </p>
        </div>

        <HomeEditor />

        <MetricsServer />

        <div className="h-[60px]" />

        <div className="flex flex-col gap-6 w-full">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <span className="font-['JetBrains_Mono',monospace] text-[14px] font-bold text-[#22C55E]">
                {"//"}
              </span>
              <span className="font-['JetBrains_Mono',monospace] text-[14px] font-bold text-[#FAFAFA]">
                shame_leaderboard
              </span>
            </div>
            <Button variant="link">{"$ view_all >>"}</Button>
          </div>

          <p className="font-['IBM_Plex_Mono',monospace] text-[13px] font-normal text-[#4B5563]">
            {"// the worst code on the internet, ranked by shame"}
          </p>

          <LeaderboardServer />

          <div className="flex justify-center py-4">
            <span className="font-['IBM_Plex_Mono',monospace] text-[12px] font-normal text-[#4B5563]">
              {"showing top 3 · view full leaderboard >>"}
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}
