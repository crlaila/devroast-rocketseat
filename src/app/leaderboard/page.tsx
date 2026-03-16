import type { Metadata } from "next";
import { MetricsServer } from "@/app/_components/metrics-server";
import { LeaderboardPageServer } from "./_components/leaderboard-page-server";

export const revalidate = 3600; // revalida a cada 1 hora

export const metadata: Metadata = {
  title: "shame leaderboard — devroast",
  description:
    "The most roasted code on the internet. 2,847 submissions and counting.",
};

export default function LeaderboardPage() {
  return (
    <main className="w-full bg-[#0A0A0A] min-h-screen">
      <div className="max-w-[960px] mx-auto px-20 py-10 flex flex-col gap-10">
        {/* Hero Section */}
        <section className="flex flex-col gap-4">
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

          <MetricsServer />
        </section>

        {/* Leaderboard Entries */}
        <section className="flex flex-col gap-5">
          <LeaderboardPageServer />
        </section>
      </div>
    </main>
  );
}
