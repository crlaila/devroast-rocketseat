import { Suspense } from "react";
import { trpc, HydrateClient, prefetch } from "@/trpc/server";
import { MetricsDisplay } from "./metrics-display";
import { MetricsSkeleton } from "./metrics-skeleton";

export function MetricsServer() {
  prefetch(trpc.metrics.stats.queryOptions());

  return (
    <HydrateClient>
      <Suspense fallback={<MetricsSkeleton />}>
        <MetricsDisplay />
      </Suspense>
    </HydrateClient>
  );
}
