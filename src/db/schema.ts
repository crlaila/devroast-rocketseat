import {
  boolean,
  index,
  integer,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

// ---------------------------------------------------------------------------
// Enums
// ---------------------------------------------------------------------------

export const verdictEnum = pgEnum("verdict", [
  "legendary_garbage", // score 0.0 – 2.0
  "needs_serious_help", // score 2.1 – 4.0
  "could_be_worse", // score 4.1 – 6.0
  "not_terrible", // score 6.1 – 8.0
  "almost_decent", // score 8.1 – 10.0
]);

export const issueSeverityEnum = pgEnum("issue_severity", [
  "critical", // BadgeStatus variant="critical" — accent-red
  "warning", // BadgeStatus variant="warning"  — accent-amber
  "good", // BadgeStatus variant="good"     — accent-green
]);

export const diffLineTypeEnum = pgEnum("diff_line_type", [
  "removed", // DiffLine variant="removed"
  "added", // DiffLine variant="added"
  "context", // DiffLine variant="context"
]);

// ---------------------------------------------------------------------------
// submissions
// ---------------------------------------------------------------------------

export const submissions = pgTable(
  "submissions",
  {
    id: uuid().primaryKey().defaultRandom(),
    code: text().notNull(),
    language: varchar({ length: 64 }),
    lineCount: integer().notNull(),
    roastMode: boolean().notNull().default(false),
    score: numeric({ precision: 3, scale: 1 }).notNull(),
    verdict: verdictEnum().notNull(),
    roastQuote: text().notNull(),
    isPublic: boolean().notNull().default(true),
    // (10 - score) * weight — quanto maior, pior; suporta upvotes futuros
    shameScore: numeric({ precision: 5, scale: 2 }),
    createdAt: timestamp().notNull().defaultNow(),
  },
  (t) => [
    // leaderboard: ORDER BY shame_score DESC
    index("submissions_shame_score_idx").on(t.shameScore),
    // leaderboard: WHERE is_public = true ORDER BY created_at DESC
    index("submissions_public_created_idx").on(t.isPublic, t.createdAt),
  ],
);

// ---------------------------------------------------------------------------
// roast_issues
// ---------------------------------------------------------------------------

export const roastIssues = pgTable("roast_issues", {
  id: uuid().primaryKey().defaultRandom(),
  submissionId: uuid()
    .notNull()
    .references(() => submissions.id, { onDelete: "cascade" }),
  severity: issueSeverityEnum().notNull(),
  badgeLabel: varchar({ length: 64 }).notNull(),
  title: varchar({ length: 256 }).notNull(),
  description: text().notNull(),
  sortOrder: integer().notNull().default(0),
});

// ---------------------------------------------------------------------------
// roast_diffs
// ---------------------------------------------------------------------------

export const roastDiffs = pgTable("roast_diffs", {
  id: uuid().primaryKey().defaultRandom(),
  submissionId: uuid()
    .notNull()
    .references(() => submissions.id, { onDelete: "cascade" }),
  lineType: diffLineTypeEnum().notNull(),
  content: text().notNull(),
  lineNumber: integer().notNull(),
  sortOrder: integer().notNull(),
  fileName: varchar({ length: 256 }),
});
