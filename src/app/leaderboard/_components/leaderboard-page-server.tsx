import { Suspense } from "react";
import { trpc, HydrateClient, prefetch } from "@/trpc/server";
import { LeaderboardPageDisplay } from "./leaderboard-page-display";
import { LeaderboardPageSkeleton } from "./leaderboard-page-skeleton";

export function LeaderboardPageServer() {
  prefetch(trpc.leaderboard.topTwenty.queryOptions());

  return (
    <HydrateClient>
      <Suspense fallback={<LeaderboardPageSkeleton />}>
        <LeaderboardPageDisplay />
      </Suspense>
    </HydrateClient>
  );
}
