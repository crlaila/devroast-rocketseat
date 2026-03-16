import { Suspense } from "react";
import { trpc, HydrateClient, prefetch } from "@/trpc/server";
import { LeaderboardDisplay } from "./leaderboard-display";
import { LeaderboardSkeleton } from "./leaderboard-skeleton";

export function LeaderboardServer() {
  prefetch(trpc.leaderboard.topThree.queryOptions());

  return (
    <HydrateClient>
      <Suspense fallback={<LeaderboardSkeleton />}>
        <LeaderboardDisplay />
      </Suspense>
    </HydrateClient>
  );
}
