import type { Metadata } from "next";
import { CodeBlock } from "@/components/ui/code-block";
import { leaderboardEntries, leaderboardStats } from "./data";

export const metadata: Metadata = {
  title: "shame leaderboard — devroast",
  description:
    "The most roasted code on the internet. 2,847 submissions and counting.",
};

// SSR — this page is server-rendered on every request for SEO indexability
export const dynamic = "force-dynamic";

export default async function LeaderboardPage() {
  return (
    <main className="w-full bg-[#0A0A0A] min-h-screen">
      <div className="max-w-[960px] mx-auto px-20 py-10 flex flex-col gap-10">
        {/* Hero Section */}
        <section className="flex flex-col gap-4">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <span className="font-['JetBrains_Mono',monospace] text-[32px] font-bold text-[#22C55E]">
                &gt;
              </span>
              <h1 className="font-['JetBrains_Mono',monospace] text-[28px] font-bold text-[#FAFAFA]">
                shame_leaderboard
              </h1>
            </div>

            <p className="font-['IBM_Plex_Mono',monospace] text-[14px] font-normal text-[#6B7280]">
              {"// the most roasted code on the internet"}
            </p>

            <div className="flex items-center gap-2">
              <span className="font-['IBM_Plex_Mono',monospace] text-[12px] font-normal text-[#4B5563]">
                {leaderboardStats.totalSubmissions} submissions
              </span>
              <span className="font-['IBM_Plex_Mono',monospace] text-[12px] font-normal text-[#4B5563]">
                ·
              </span>
              <span className="font-['IBM_Plex_Mono',monospace] text-[12px] font-normal text-[#4B5563]">
                avg score: {leaderboardStats.avgScore}/10
              </span>
            </div>
          </div>
        </section>

        {/* Leaderboard Entries */}
        <section className="flex flex-col gap-5">
          {leaderboardEntries.map((entry) => (
            <article
              key={entry.rank}
              className="flex flex-col border border-[#2A2A2A] w-full"
            >
              {/* Meta Row */}
              <div className="flex items-center justify-between h-12 px-5 border-b border-[#2A2A2A]">
                {/* Left: rank + score */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <span className="font-['JetBrains_Mono',monospace] text-[13px] font-normal text-[#4B5563]">
                      #
                    </span>
                    <span className="font-['JetBrains_Mono',monospace] text-[13px] font-bold text-[#F59E0B]">
                      {entry.rank}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="font-['JetBrains_Mono',monospace] text-[12px] font-normal text-[#4B5563]">
                      score:
                    </span>
                    <span className="font-['JetBrains_Mono',monospace] text-[13px] font-bold text-[#EF4444]">
                      {entry.score.toFixed(1)}
                    </span>
                  </div>
                </div>

                {/* Right: language + line count */}
                <div className="flex items-center gap-3">
                  <span className="font-['JetBrains_Mono',monospace] text-[12px] font-normal text-[#6B7280]">
                    {entry.language}
                  </span>
                  <span className="font-['JetBrains_Mono',monospace] text-[12px] font-normal text-[#4B5563]">
                    {entry.lines.length} lines
                  </span>
                </div>
              </div>

              {/* Code Block */}
              <CodeBlock
                lines={entry.lines}
                className="w-full border-none rounded-none"
              />
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
