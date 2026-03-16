import "server-only";

import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import { dehydrate, HydrationBoundary, type FetchQueryOptions } from "@tanstack/react-query";
import { cache } from "react";
import { createCallerFactory, createTRPCContext } from "./init";
import { makeQueryClient } from "./query-client";
import { appRouter } from "./routers/_app";

export const getQueryClient = cache(makeQueryClient);

export const trpc = createTRPCOptionsProxy({
  ctx: createTRPCContext,
  router: appRouter,
  queryClient: getQueryClient,
});

const createCaller = createCallerFactory(appRouter);
export const caller = createCaller(createTRPCContext);

export function HydrateClient({ children }: { children: React.ReactNode }) {
  return (
    <HydrationBoundary state={dehydrate(getQueryClient())}>
      {children}
    </HydrationBoundary>
  );
}

// biome-ignore lint/suspicious/noExplicitAny: tRPC queryOptions is a superset of FetchQueryOptions
export function prefetch(queryOptions: FetchQueryOptions<any, any, any, any>) {
  const qc = getQueryClient();
  void qc.prefetchQuery(queryOptions);
}
