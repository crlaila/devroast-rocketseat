import { Button } from "@/components";
import { HomeEditor } from "./_components/home-editor";
import { MetricsServer } from "./_components/metrics-server";

const LEADERBOARD = [
  {
    rank: "1",
    rankColor: "#F59E0B",
    score: "1.2",
    codeLines: [
      'eval(prompt("enter code"))',
      "document.write(response)",
      "// trust the user lol",
    ],
    commentIndices: [2],
    lang: "javascript",
    lastRow: false,
  },
  {
    rank: "2",
    rankColor: "#6B7280",
    score: "1.8",
    codeLines: [
      "if (x == true) { return true; }",
      "else if (x == false) { return false; }",
      "else { return !false; }",
    ],
    commentIndices: [],
    lang: "typescript",
    lastRow: false,
  },
  {
    rank: "3",
    rankColor: "#6B7280",
    score: "2.1",
    codeLines: ["SELECT * FROM users WHERE 1=1", "-- TODO: add authentication"],
    commentIndices: [1],
    lang: "sql",
    lastRow: true,
  },
];

function LeaderboardHeader() {
  return (
    <div className="flex items-center h-10 px-5 bg-[#0F0F0F] border-b border-[#2A2A2A]">
      <span className="w-[50px] shrink-0 font-['JetBrains_Mono',monospace] text-[12px] font-medium text-[#4B5563]">
        {"#"}
      </span>
      <span className="w-[70px] shrink-0 font-['JetBrains_Mono',monospace] text-[12px] font-medium text-[#4B5563]">
        score
      </span>
      <span className="flex-1 font-['JetBrains_Mono',monospace] text-[12px] font-medium text-[#4B5563]">
        code
      </span>
      <span className="w-[100px] shrink-0 font-['JetBrains_Mono',monospace] text-[12px] font-medium text-[#4B5563]">
        lang
      </span>
    </div>
  );
}

function LeaderboardRow({
  rank,
  rankColor,
  score,
  codeLines,
  commentIndices,
  lang,
  lastRow,
}: (typeof LEADERBOARD)[0]) {
  return (
    <div
      className={`flex items-start px-5 py-4 ${lastRow ? "" : "border-b border-[#2A2A2A]"}`}
    >
      <span
        className="w-[50px] shrink-0 font-['JetBrains_Mono',monospace] text-[12px] font-normal pt-px"
        style={{ color: rankColor }}
      >
        {rank}
      </span>

      <span className="w-[70px] shrink-0 font-['JetBrains_Mono',monospace] text-[12px] font-bold text-[#EF4444] pt-px">
        {score}
      </span>

      <div className="flex-1 flex flex-col gap-[3px] min-w-0">
        {codeLines.map((line, i) => (
          <span
            // biome-ignore lint/suspicious/noArrayIndexKey: static leaderboard lines are positional
            key={i}
            className="font-['JetBrains_Mono',monospace] text-[12px] font-normal"
            style={{
              color: commentIndices.includes(i) ? "#8B8B8B" : "#FAFAFA",
            }}
          >
            {line}
          </span>
        ))}
      </div>

      <span className="w-[100px] shrink-0 font-['JetBrains_Mono',monospace] text-[12px] font-normal text-[#6B7280] text-right pt-px">
        {lang}
      </span>
    </div>
  );
}

export default function HomePage() {
  return (
    <main className="bg-[#0A0A0A] min-h-screen">
      <div className="max-w-[960px] mx-auto px-10 pt-20 pb-20 flex flex-col gap-8">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-center gap-3">
            <span className="font-['JetBrains_Mono',monospace] text-[36px] font-bold text-[#22C55E]">
              $
            </span>
            <span className="font-['JetBrains_Mono',monospace] text-[36px] font-bold text-[#FAFAFA]">
              paste your code. get roasted.
            </span>
          </div>
          <p className="font-['IBM_Plex_Mono',monospace] text-center text-[14px] font-normal text-[#6B7280]">
            {
              "// drop your code below and we'll rate it — brutally honest or full roast mode"
            }
          </p>
        </div>

        <HomeEditor />

        <MetricsServer />

        <div className="h-[60px]" />

        <div className="flex flex-col gap-6 w-full">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <span className="font-['JetBrains_Mono',monospace] text-[14px] font-bold text-[#22C55E]">
                {"//"}
              </span>
              <span className="font-['JetBrains_Mono',monospace] text-[14px] font-bold text-[#FAFAFA]">
                shame_leaderboard
              </span>
            </div>
            <Button variant="link">{"$ view_all >>"}</Button>
          </div>

          <p className="font-['IBM_Plex_Mono',monospace] text-[13px] font-normal text-[#4B5563]">
            {"// the worst code on the internet, ranked by shame"}
          </p>

          <div className="border border-[#2A2A2A] flex flex-col w-full">
            <LeaderboardHeader />
            {LEADERBOARD.map((row) => (
              <LeaderboardRow key={row.rank} {...row} />
            ))}
          </div>

          <div className="flex justify-center py-4">
            <span className="font-['IBM_Plex_Mono',monospace] text-[12px] font-normal text-[#4B5563]">
              {"showing top 3 · view full leaderboard >>"}
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}
