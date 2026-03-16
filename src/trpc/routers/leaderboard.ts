import { desc, eq } from "drizzle-orm";
import { submissions } from "@/db/schema";
import { baseProcedure, createTRPCRouter } from "../init";

export const leaderboardRouter = createTRPCRouter({
  topTwenty: baseProcedure.query(async ({ ctx }) => {
    const rows = await ctx.db
      .select({
        id: submissions.id,
        code: submissions.code,
        score: submissions.score,
        language: submissions.language,
        shameScore: submissions.shameScore,
      })
      .from(submissions)
      .where(eq(submissions.isPublic, true))
      .orderBy(desc(submissions.shameScore))
      .limit(20);

    return rows.map((row, index) => ({
      id: row.id,
      rank: index + 1,
      score: row.score,
      language: row.language ?? "unknown",
      shameScore: row.shameScore,
      code: row.code,
    }));
  }),

  topThree: baseProcedure.query(async ({ ctx }) => {
    const rows = await ctx.db
      .select({
        id: submissions.id,
        code: submissions.code,
        score: submissions.score,
        language: submissions.language,
        shameScore: submissions.shameScore,
      })
      .from(submissions)
      .where(eq(submissions.isPublic, true))
      .orderBy(desc(submissions.shameScore))
      .limit(3);

    return rows.map((row, index) => ({
      id: row.id,
      rank: index + 1,
      score: row.score,
      language: row.language ?? "unknown",
      shameScore: row.shameScore,
      code: row.code,
    }));
  }),
});
