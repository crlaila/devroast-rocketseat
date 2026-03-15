CREATE TYPE "public"."diff_line_type" AS ENUM('removed', 'added', 'context');--> statement-breakpoint
CREATE TYPE "public"."issue_severity" AS ENUM('critical', 'warning', 'good');--> statement-breakpoint
CREATE TYPE "public"."verdict" AS ENUM('legendary_garbage', 'needs_serious_help', 'could_be_worse', 'not_terrible', 'almost_decent');--> statement-breakpoint
CREATE TABLE "roast_diffs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"submission_id" uuid NOT NULL,
	"line_type" "diff_line_type" NOT NULL,
	"content" text NOT NULL,
	"line_number" integer NOT NULL,
	"sort_order" integer NOT NULL,
	"file_name" varchar(256)
);
--> statement-breakpoint
CREATE TABLE "roast_issues" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"submission_id" uuid NOT NULL,
	"severity" "issue_severity" NOT NULL,
	"badge_label" varchar(64) NOT NULL,
	"title" varchar(256) NOT NULL,
	"description" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "submissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" text NOT NULL,
	"language" varchar(64),
	"line_count" integer NOT NULL,
	"roast_mode" boolean DEFAULT false NOT NULL,
	"score" numeric(3, 1) NOT NULL,
	"verdict" "verdict" NOT NULL,
	"roast_quote" text NOT NULL,
	"is_public" boolean DEFAULT true NOT NULL,
	"shame_score" numeric(5, 2),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "roast_diffs" ADD CONSTRAINT "roast_diffs_submission_id_submissions_id_fk" FOREIGN KEY ("submission_id") REFERENCES "public"."submissions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "roast_issues" ADD CONSTRAINT "roast_issues_submission_id_submissions_id_fk" FOREIGN KEY ("submission_id") REFERENCES "public"."submissions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "submissions_shame_score_idx" ON "submissions" USING btree ("shame_score");--> statement-breakpoint
CREATE INDEX "submissions_public_created_idx" ON "submissions" USING btree ("is_public","created_at");