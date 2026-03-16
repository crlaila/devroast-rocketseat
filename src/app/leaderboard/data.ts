import type { CodeLine } from "@/components/ui/code-block";

export interface LeaderboardEntry {
  rank: number;
  score: number;
  language: string;
  lines: CodeLine[];
}

// Syntax token color constants matching the Pencil design system variables
const SYN_KEYWORD = "#C678DD";
const SYN_FUNCTION = "#61AFEF";
const SYN_VARIABLE = "#E06C75";
const SYN_OPERATOR = "#ABB2BF";
const SYN_STRING = "#E5C07B";
const SYN_NUMBER = "#D19A66";
const SYN_COMMENT = "#8B8B8B";

export const leaderboardEntries: LeaderboardEntry[] = [
  {
    rank: 1,
    score: 1.2,
    language: "javascript",
    lines: [
      [
        { text: "eval", color: SYN_FUNCTION },
        { text: "(", color: SYN_OPERATOR },
        { text: "prompt", color: SYN_FUNCTION },
        { text: "(", color: SYN_OPERATOR },
        { text: '"enter code"', color: SYN_STRING },
        { text: "))", color: SYN_OPERATOR },
      ],
      [
        { text: "document", color: SYN_VARIABLE },
        { text: ".write", color: SYN_FUNCTION },
        { text: "(", color: SYN_OPERATOR },
        { text: "response", color: SYN_VARIABLE },
        { text: ")", color: SYN_OPERATOR },
      ],
      [{ text: "// trust the user lol", color: SYN_COMMENT }],
    ],
  },
  {
    rank: 2,
    score: 1.8,
    language: "typescript",
    lines: [
      [
        { text: "if", color: SYN_KEYWORD },
        { text: " (", color: SYN_OPERATOR },
        { text: "x", color: SYN_VARIABLE },
        { text: " == ", color: SYN_OPERATOR },
        { text: "true", color: SYN_KEYWORD },
        { text: ") { ", color: SYN_OPERATOR },
        { text: "return", color: SYN_KEYWORD },
        { text: " true", color: SYN_KEYWORD },
        { text: "; }", color: SYN_OPERATOR },
      ],
      [
        { text: "else if", color: SYN_KEYWORD },
        { text: " (", color: SYN_OPERATOR },
        { text: "x", color: SYN_VARIABLE },
        { text: " == ", color: SYN_OPERATOR },
        { text: "false", color: SYN_KEYWORD },
        { text: ") { ", color: SYN_OPERATOR },
        { text: "return", color: SYN_KEYWORD },
        { text: " false", color: SYN_KEYWORD },
        { text: "; }", color: SYN_OPERATOR },
      ],
      [
        { text: "else", color: SYN_KEYWORD },
        { text: " { ", color: SYN_OPERATOR },
        { text: "return", color: SYN_KEYWORD },
        { text: " !", color: SYN_OPERATOR },
        { text: "false", color: SYN_KEYWORD },
        { text: "; }", color: SYN_OPERATOR },
      ],
    ],
  },
  {
    rank: 3,
    score: 2.1,
    language: "sql",
    lines: [
      [
        { text: "SELECT", color: SYN_KEYWORD },
        { text: " * ", color: SYN_OPERATOR },
        { text: "FROM", color: SYN_KEYWORD },
        { text: " users ", color: SYN_VARIABLE },
        { text: "WHERE", color: SYN_KEYWORD },
        { text: " 1", color: SYN_NUMBER },
        { text: "=", color: SYN_OPERATOR },
        { text: "1", color: SYN_NUMBER },
      ],
      [{ text: "-- TODO: add authentication", color: SYN_COMMENT }],
    ],
  },
  {
    rank: 4,
    score: 2.3,
    language: "java",
    lines: [
      [
        { text: "catch", color: SYN_KEYWORD },
        { text: " (", color: SYN_OPERATOR },
        { text: "e", color: SYN_VARIABLE },
        { text: ") {", color: SYN_OPERATOR },
      ],
      [{ text: "  // ignore", color: SYN_COMMENT }],
      [{ text: "}", color: SYN_OPERATOR }],
    ],
  },
  {
    rank: 5,
    score: 2.5,
    language: "javascript",
    lines: [
      [
        { text: "const", color: SYN_KEYWORD },
        { text: " sleep", color: SYN_FUNCTION },
        { text: " = (", color: SYN_OPERATOR },
        { text: "ms", color: SYN_VARIABLE },
        { text: ") =>", color: SYN_OPERATOR },
      ],
      [
        { text: "  new", color: SYN_KEYWORD },
        { text: " Date", color: SYN_FUNCTION },
        { text: "(", color: SYN_OPERATOR },
        { text: "Date", color: SYN_FUNCTION },
        { text: ".now", color: SYN_FUNCTION },
        { text: "() + ", color: SYN_OPERATOR },
        { text: "ms", color: SYN_VARIABLE },
        { text: ")", color: SYN_OPERATOR },
      ],
      [
        { text: "  while", color: SYN_KEYWORD },
        { text: "(new", color: SYN_KEYWORD },
        { text: " Date", color: SYN_FUNCTION },
        { text: "() < ", color: SYN_OPERATOR },
        { text: "end", color: SYN_VARIABLE },
        { text: ") {}", color: SYN_OPERATOR },
      ],
    ],
  },
];

export const leaderboardStats = {
  totalSubmissions: "2,847",
  avgScore: "4.2",
};
