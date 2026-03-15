'use client';

// Screen 1 - Code Input  (Pencil node: 9qwc9)
// Main Content: layout vertical, padding [80,40,0,40], gap=32
// Content is max-w-[960px] centred; editor+actions bar are max-w-[780px]

import { useState } from 'react';
import { Button, Toggle } from '@/components';

// ─── static data ────────────────────────────────────────────────────────────

// Pencil leaderboard rows (static)
const LEADERBOARD = [
  {
    rank: '1',
    rankColor: '#F59E0B', // accent-amber — only rank 1
    score: '1.2',
    codeLines: [
      'eval(prompt("enter code"))',
      'document.write(response)',
      '// trust the user lol',
    ],
    commentIndices: [2], // index of grey comment lines
    lang: 'javascript',
    lastRow: false,
  },
  {
    rank: '2',
    rankColor: '#6B7280', // text-secondary
    score: '1.8',
    codeLines: [
      'if (x == true) { return true; }',
      'else if (x == false) { return false; }',
      'else { return !false; }',
    ],
    commentIndices: [],
    lang: 'typescript',
    lastRow: false,
  },
  {
    rank: '3',
    rankColor: '#6B7280',
    score: '2.1',
    codeLines: ['SELECT * FROM users WHERE 1=1', '-- TODO: add authentication'],
    commentIndices: [1],
    lang: 'sql',
    lastRow: true,
  },
];

// ─── sub-components ─────────────────────────────────────────────────────────

// macOS-style window dots + optional filename
function WindowHeader() {
  return (
    <div className="flex items-center gap-2 h-10 px-4 border-b border-[#2A2A2A] shrink-0">
      <span className="w-3 h-3 rounded-full bg-[#EF4444]" />
      <span className="w-3 h-3 rounded-full bg-[#F59E0B]" />
      <span className="w-3 h-3 rounded-full bg-[#10B981]" />
    </div>
  );
}

// Leaderboard table header row
function LeaderboardHeader() {
  return (
    <div className="flex items-center h-10 px-5 bg-[#0F0F0F] border-b border-[#2A2A2A]">
      <span className="w-[50px] shrink-0 font-['JetBrains_Mono',monospace] text-[12px] font-medium text-[#4B5563]">
        {'#'}
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

// Single leaderboard data row
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
      className={`flex items-start px-5 py-4 ${lastRow ? '' : 'border-b border-[#2A2A2A]'}`}
    >
      {/* rank */}
      <span
        className="w-[50px] shrink-0 font-['JetBrains_Mono',monospace] text-[12px] font-normal pt-px"
        style={{ color: rankColor }}
      >
        {rank}
      </span>

      {/* score */}
      <span className="w-[70px] shrink-0 font-['JetBrains_Mono',monospace] text-[12px] font-bold text-[#EF4444] pt-px">
        {score}
      </span>

      {/* code lines */}
      <div className="flex-1 flex flex-col gap-[3px] min-w-0">
        {codeLines.map((line, i) => (
          <span
            // biome-ignore lint/suspicious/noArrayIndexKey: static leaderboard lines are positional
            key={i}
            className="font-['JetBrains_Mono',monospace] text-[12px] font-normal"
            style={{
              color: commentIndices.includes(i) ? '#8B8B8B' : '#FAFAFA',
            }}
          >
            {line}
          </span>
        ))}
      </div>

      {/* lang */}
      <span className="w-[100px] shrink-0 font-['JetBrains_Mono',monospace] text-[12px] font-normal text-[#6B7280] text-right pt-px">
        {lang}
      </span>
    </div>
  );
}

// ─── page ────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const [code, setCode] = useState('');
  const [roastMode, setRoastMode] = useState(true);
  const hasCode = code.trim().length > 0;

  // Sync line-number count with textarea content
  const lineCount = code.split('\n').length;
  const lineNumbers = Array.from(
    { length: Math.max(lineCount, 16) },
    (_, i) => i + 1,
  );

  return (
    <main className="bg-[#0A0A0A] min-h-screen">
      {/* ── Main Content ── max-w-[960px] centred, pt=80, px=40, gap=32 */}
      <div className="max-w-[960px] mx-auto px-10 pt-20 pb-20 flex flex-col gap-8">
        {/* ── Hero Title ── gap=12 */}
        <div className="flex flex-col gap-3">
          {/* titleLine: "$" green + text white, both JetBrains Mono 36px bold, gap=12 */}
          <div className="flex items-center justify-center gap-3">
            <span className="font-['JetBrains_Mono',monospace] text-[36px] font-bold text-[#22C55E]">
              $
            </span>
            <span className="font-['JetBrains_Mono',monospace] text-[36px] font-bold text-[#FAFAFA]">
              paste your code. get roasted.
            </span>
          </div>
          {/* subtitle: IBM Plex Mono 14px, text-secondary */}
          <p className="font-['IBM_Plex_Mono',monospace] text-center text-[14px] font-normal text-[#6B7280]">
            {
              "// drop your code below and we'll rate it — brutally honest or full roast mode"
            }
          </p>
        </div>

        {/* ── Code Editor ── max-w=780, h=360, bg=#111111, border #2A2A2A */}
        <div className="flex flex-col border border-[#2A2A2A] bg-[#111111] w-full max-w-[780px] mx-auto h-[360px] overflow-hidden">
          <WindowHeader />

          {/* body: line numbers + textarea */}
          <div className="flex flex-1 min-h-0">
            {/* Line numbers: w=48, bg=bg-surface, border-right, padding [16,12]
                Each number is 20px tall (12px font + 8px gap) to match textarea line-height */}
            <div
              className="flex flex-col w-12 shrink-0 bg-[#0F0F0F] border-r border-[#2A2A2A] px-3 py-4 overflow-hidden"
              style={{ gap: '8px' }}
            >
              {lineNumbers.map((n) => (
                <span
                  key={n}
                  className="font-['JetBrains_Mono',monospace] text-[12px] font-normal text-[#4B5563] text-right select-none"
                  style={{
                    lineHeight: '20px',
                    height: '20px',
                    display: 'block',
                  }}
                >
                  {n}
                </span>
              ))}
            </div>

            {/* textarea: transparent, fills remaining space.
                line-height=20px matches the line-number column exactly */}
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck={false}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              className="flex-1 bg-transparent text-[#FAFAFA] font-['JetBrains_Mono',monospace] text-[12px] font-normal resize-none outline-none border-0 p-4 overflow-auto"
              style={{
                lineHeight: '20px',
                caretColor: '#22C55E',
              }}
            />
          </div>
        </div>

        {/* ── Actions Bar ── max-w=780, space-between */}
        <div className="flex items-center justify-between w-full max-w-[780px] mx-auto">
          {/* left: toggle + hint */}
          <div className="flex items-center gap-4">
            <Toggle
              checked={roastMode}
              onChange={setRoastMode}
              label="roast mode"
            />
            {/* IBM Plex Mono 12px, text-tertiary */}
            <span className="font-['IBM_Plex_Mono',monospace] text-[12px] font-normal text-[#4B5563]">
              {'// maximum sarcasm enabled'}
            </span>
          </div>

          {/* right: submit button — only enabled when textarea has content */}
          <Button variant="primary" disabled={!hasCode}>
            $ roast_my_code
          </Button>
        </div>

        {/* ── Footer Hint ── centred stats */}
        <div className="flex items-center justify-center gap-6">
          <span className="font-['IBM_Plex_Mono',monospace] text-[12px] font-normal text-[#4B5563]">
            2,847 codes roasted
          </span>
          <span className="font-['JetBrains_Mono',monospace] text-[12px] font-normal text-[#4B5563]">
            ·
          </span>
          <span className="font-['IBM_Plex_Mono',monospace] text-[12px] font-normal text-[#4B5563]">
            avg score: 4.2/10
          </span>
        </div>

        {/* ── Spacer ── h=60 */}
        <div className="h-[60px]" />

        {/* ── Leaderboard Preview ── w=full (960px), gap=24 */}
        <div className="flex flex-col gap-6 w-full">
          {/* title row: "// shame_leaderboard" + "$ view_all >>" */}
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <span className="font-['JetBrains_Mono',monospace] text-[14px] font-bold text-[#22C55E]">
                {'//'}
              </span>
              <span className="font-['JetBrains_Mono',monospace] text-[14px] font-bold text-[#FAFAFA]">
                shame_leaderboard
              </span>
            </div>
            <Button variant="link">{'$ view_all >>'}</Button>
          </div>

          {/* subtitle */}
          <p className="font-['IBM_Plex_Mono',monospace] text-[13px] font-normal text-[#4B5563]">
            {'// the worst code on the internet, ranked by shame'}
          </p>

          {/* table: border #2A2A2A, layout vertical */}
          <div className="border border-[#2A2A2A] flex flex-col w-full">
            <LeaderboardHeader />
            {LEADERBOARD.map((row) => (
              <LeaderboardRow key={row.rank} {...row} />
            ))}
          </div>

          {/* fade hint */}
          <div className="flex justify-center py-4">
            <span className="font-['IBM_Plex_Mono',monospace] text-[12px] font-normal text-[#4B5563]">
              {'showing top 3 of 2,847 · view full leaderboard >>'}
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}
