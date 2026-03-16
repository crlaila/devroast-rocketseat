import type { CodeLine } from "@/components/ui/code-block";

export type AnalysisVariant = "critical" | "warning" | "good";

export interface AnalysisIssue {
  variant: AnalysisVariant;
  label: string;
  title: string;
  description: string;
}

export interface DiffEntry {
  type: "context" | "removed" | "added";
  code: string;
}

export interface RoastResult {
  id: string;
  score: number;
  maxScore: number;
  verdict: string;
  roastQuote: string;
  language: string;
  submissionLines: CodeLine[];
  analysisIssues: AnalysisIssue[];
  diffFileName: string;
  diff: DiffEntry[];
}

// Syntax token colors — mirrors Pencil design system variables
const KW = "#C678DD"; // syn-keyword
const FN = "#61AFEF"; // syn-function
const VA = "#E06C75"; // syn-variable
const OP = "#ABB2BF"; // syn-operator
const ST = "#E5C07B"; // syn-string
const NU = "#D19A66"; // syn-number
const PR = "#98C379"; // syn-property
const CM = "#8B8B8B"; // comment

export const staticResult: RoastResult = {
  id: "demo",
  score: 3.5,
  maxScore: 10,
  verdict: "verdict: needs_serious_help",
  roastQuote:
    '"this code looks like it was written during a power outage... in 2005."',
  language: "javascript",
  submissionLines: [
    [
      { text: "function", color: KW },
      { text: " ", color: OP },
      { text: "calculateTotal", color: FN },
      { text: "(", color: OP },
      { text: "items", color: VA },
      { text: ") {", color: OP },
    ],
    [
      { text: "  ", color: OP },
      { text: "var", color: KW },
      { text: " ", color: OP },
      { text: "total", color: VA },
      { text: " = ", color: OP },
      { text: "0", color: NU },
      { text: ";", color: OP },
    ],
    [
      { text: "  ", color: OP },
      { text: "for", color: KW },
      { text: " (", color: OP },
      { text: "var", color: KW },
      { text: " ", color: OP },
      { text: "i", color: VA },
      { text: " = ", color: OP },
      { text: "0", color: NU },
      { text: "; ", color: OP },
      { text: "i", color: VA },
      { text: " < ", color: OP },
      { text: "items", color: VA },
      { text: ".length", color: PR },
      { text: "; ", color: OP },
      { text: "i", color: VA },
      { text: "++) {", color: OP },
    ],
    [
      { text: "    ", color: OP },
      { text: "total", color: VA },
      { text: " = ", color: OP },
      { text: "total", color: VA },
      { text: " + ", color: OP },
      { text: "items", color: VA },
      { text: "[", color: OP },
      { text: "i", color: VA },
      { text: "]", color: OP },
      { text: ".price", color: PR },
      { text: ";", color: OP },
    ],
    [{ text: "  }", color: OP }],
    [{ text: " ", color: OP }],
    [
      { text: "  ", color: OP },
      { text: "if", color: KW },
      { text: " (", color: OP },
      { text: "total", color: VA },
      { text: " > ", color: OP },
      { text: "100", color: NU },
      { text: ") {", color: OP },
    ],
    [
      { text: "    ", color: OP },
      { text: "console", color: VA },
      { text: ".log", color: FN },
      { text: "(", color: OP },
      { text: '"discount applied"', color: ST },
      { text: ");", color: OP },
    ],
    [
      { text: "    ", color: OP },
      { text: "total", color: VA },
      { text: " = ", color: OP },
      { text: "total", color: VA },
      { text: " * ", color: OP },
      { text: "0.9", color: NU },
      { text: ";", color: OP },
    ],
    [{ text: "  }", color: OP }],
    [{ text: " ", color: OP }],
    [{ text: "  // TODO: handle tax calculation", color: CM }],
    [{ text: "  // TODO: handle currency conversion", color: CM }],
    [{ text: " ", color: OP }],
    [
      { text: "  ", color: OP },
      { text: "return", color: KW },
      { text: " ", color: OP },
      { text: "total", color: VA },
      { text: ";", color: OP },
    ],
    [{ text: "}", color: OP }],
  ],
  analysisIssues: [
    {
      variant: "critical",
      label: "critical",
      title: "using var instead of const/let",
      description:
        "var is function-scoped and leads to hoisting bugs. use const by default, let when reassignment is needed.",
    },
    {
      variant: "warning",
      label: "warning",
      title: "imperative loop pattern",
      description:
        "for loops are verbose and error-prone. use .reduce() or .map() for cleaner, functional transformations.",
    },
    {
      variant: "good",
      label: "good",
      title: "clear naming conventions",
      description:
        "calculateTotal and items are descriptive, self-documenting names that communicate intent without comments.",
    },
    {
      variant: "good",
      label: "good",
      title: "single responsibility",
      description:
        "the function does one thing well — calculates a total. no side effects, no mixed concerns, no hidden complexity.",
    },
  ],
  diffFileName: "your_code.ts → improved_code.ts",
  diff: [
    { type: "context", code: "function calculateTotal(items) {" },
    { type: "removed", code: "  var total = 0;" },
    { type: "removed", code: "  for (var i = 0; i < items.length; i++) {" },
    { type: "removed", code: "    total = total + items[i].price;" },
    { type: "removed", code: "  }" },
    { type: "removed", code: "  return total;" },
    {
      type: "added",
      code: "  return items.reduce((sum, item) => sum + item.price, 0);",
    },
    { type: "context", code: "}" },
  ],
};
