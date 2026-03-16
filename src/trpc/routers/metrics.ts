import { count, avg } from "drizzle-orm";
import { submissions } from "@/db/schema";
import { baseProcedure, createTRPCRouter } from "../init";

export const metricsRouter = createTRPCRouter({
  stats: baseProcedure.query(async ({ ctx }) => {
    const [result] = await ctx.db
      .select({
        totalRoasted: count(submissions.id),
        avgScore: avg(submissions.score),
      })
      .from(submissions);

    return {
      totalRoasted: result?.totalRoasted ?? 0,
      avgScore: result?.avgScore ? Number(result.avgScore).toFixed(1) : "0.0",
    };
  }),
});
