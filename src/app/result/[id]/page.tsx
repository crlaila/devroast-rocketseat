import type { Metadata } from "next";
import { AnalysisCard } from "@/components/ui/analysis-card";
import { CodeBlock } from "@/components/ui/code-block";
import { DiffLine } from "@/components/ui/diff-line";
import { ScoreRing } from "@/components/ui/score-ring";
import { staticResult } from "./data";

export const metadata: Metadata = {
  title: "roast result — devroast",
  description: "See how your code was roasted and scored.",
};

// SSR — page is server-rendered for SEO indexability
export const dynamic = "force-dynamic";

interface ResultPageProps {
  params: Promise<{ id: string }>;
}

export default async function ResultPage({ params }: ResultPageProps) {
  const { id } = await params;

  // Static data — id is captured for future API integration
  const result = { ...staticResult, id };

  const scoreColor =
    result.score <= 3 ? "#EF4444" : result.score <= 6 ? "#F59E0B" : "#22C55E";

  return (
    <main className="w-full bg-[#0A0A0A] min-h-screen">
      <div className="max-w-[960px] mx-auto px-20 py-10 flex flex-col gap-10">
        {/* ── Score Hero ───────────────────────────────────────── */}
        <section className="flex items-center gap-12">
          <ScoreRing score={result.score} maxScore={result.maxScore} />

          <div className="flex flex-col gap-4 flex-1 min-w-0">
            {/* Verdict badge */}
            <div className="flex items-center gap-2">
              <span
                className="inline-block w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: scoreColor }}
              />
              <span
                className="font-['JetBrains_Mono',monospace] text-[13px] font-medium"
                style={{ color: scoreColor }}
              >
                {result.verdict}
              </span>
            </div>

            {/* Roast quote */}
            <p className="font-['IBM_Plex_Mono',monospace] text-[20px] font-normal text-[#FAFAFA] leading-[1.5]">
              {result.roastQuote}
            </p>

            {/* Meta */}
            <div className="flex items-center gap-4">
              <span className="font-['JetBrains_Mono',monospace] text-[12px] font-normal text-[#4B5563]">
                lang: {result.language}
              </span>
              <span className="font-['JetBrains_Mono',monospace] text-[12px] font-normal text-[#4B5563]">
                ·
              </span>
              <span className="font-['JetBrains_Mono',monospace] text-[12px] font-normal text-[#4B5563]">
                {result.submissionLines.length} lines
              </span>
            </div>

            {/* Share button */}
            <div>
              <button
                type="button"
                className="font-['JetBrains_Mono',monospace] text-[12px] font-normal text-[#FAFAFA] border border-[#2A2A2A] px-4 py-2 hover:border-[#4B5563] transition-colors cursor-pointer"
              >
                $ share_roast
              </button>
            </div>
          </div>
        </section>

        {/* divider */}
        <div className="w-full h-px bg-[#2A2A2A]" />

        {/* ── Submitted Code ───────────────────────────────────── */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span className="font-['JetBrains_Mono',monospace] text-[14px] font-bold text-[#22C55E]">
              {"//"}
            </span>
            <h2 className="font-['JetBrains_Mono',monospace] text-[14px] font-bold text-[#FAFAFA]">
              your_submission
            </h2>
          </div>

          <CodeBlock lines={result.submissionLines} className="w-full" />
        </section>

        {/* divider */}
        <div className="w-full h-px bg-[#2A2A2A]" />

        {/* ── Detailed Analysis ────────────────────────────────── */}
        <section className="flex flex-col gap-6">
          <div className="flex items-center gap-2">
            <span className="font-['JetBrains_Mono',monospace] text-[14px] font-bold text-[#22C55E]">
              {"//"}
            </span>
            <h2 className="font-['JetBrains_Mono',monospace] text-[14px] font-bold text-[#FAFAFA]">
              detailed_analysis
            </h2>
          </div>

          <div className="flex flex-col gap-5">
            {/* Row 1 */}
            <div className="flex gap-5">
              {result.analysisIssues.slice(0, 2).map((issue) => (
                <AnalysisCard
                  key={issue.title}
                  variant={issue.variant}
                  badgeLabel={issue.label}
                  title={issue.title}
                  description={issue.description}
                  className="flex-1 w-auto"
                />
              ))}
            </div>
            {/* Row 2 */}
            <div className="flex gap-5">
              {result.analysisIssues.slice(2, 4).map((issue) => (
                <AnalysisCard
                  key={issue.title}
                  variant={issue.variant}
                  badgeLabel={issue.label}
                  title={issue.title}
                  description={issue.description}
                  className="flex-1 w-auto"
                />
              ))}
            </div>
          </div>
        </section>

        {/* divider */}
        <div className="w-full h-px bg-[#2A2A2A]" />

        {/* ── Suggested Fix ────────────────────────────────────── */}
        <section className="flex flex-col gap-6">
          <div className="flex items-center gap-2">
            <span className="font-['JetBrains_Mono',monospace] text-[14px] font-bold text-[#22C55E]">
              {"//"}
            </span>
            <h2 className="font-['JetBrains_Mono',monospace] text-[14px] font-bold text-[#FAFAFA]">
              suggested_fix
            </h2>
          </div>

          {/* Diff block */}
          <div className="border border-[#2A2A2A] bg-[#111111] w-full">
            {/* Diff header */}
            <div className="flex items-center h-10 px-4 border-b border-[#2A2A2A]">
              <span className="font-['JetBrains_Mono',monospace] text-[12px] font-medium text-[#6B7280]">
                {result.diffFileName}
              </span>
            </div>

            {/* Diff lines */}
            <div className="flex flex-col py-1">
              {result.diff.map((line, i) => (
                <DiffLine
                  // biome-ignore lint/suspicious/noArrayIndexKey: diff lines are positional
                  key={i}
                  type={line.type}
                  code={line.code}
                />
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
