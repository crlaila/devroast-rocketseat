export type Language = {
  id: string;
  label: string;
  shikiId: string;
};

export const LANGUAGES: Language[] = [
  { id: "javascript", label: "JavaScript", shikiId: "javascript" },
  { id: "typescript", label: "TypeScript", shikiId: "typescript" },
  { id: "jsx", label: "JSX", shikiId: "jsx" },
  { id: "tsx", label: "TSX", shikiId: "tsx" },
  { id: "python", label: "Python", shikiId: "python" },
  { id: "go", label: "Go", shikiId: "go" },
  { id: "rust", label: "Rust", shikiId: "rust" },
  { id: "java", label: "Java", shikiId: "java" },
  { id: "css", label: "CSS", shikiId: "css" },
  { id: "html", label: "HTML", shikiId: "html" },
  { id: "sql", label: "SQL", shikiId: "sql" },
  { id: "bash", label: "Bash / Shell", shikiId: "bash" },
  { id: "json", label: "JSON", shikiId: "json" },
  { id: "yaml", label: "YAML", shikiId: "yaml" },
  { id: "markdown", label: "Markdown", shikiId: "markdown" },
  { id: "php", label: "PHP", shikiId: "php" },
  { id: "ruby", label: "Ruby", shikiId: "ruby" },
  { id: "kotlin", label: "Kotlin", shikiId: "kotlin" },
  { id: "swift", label: "Swift", shikiId: "swift" },
  { id: "csharp", label: "C#", shikiId: "csharp" },
  { id: "cpp", label: "C++", shikiId: "cpp" },
  { id: "plaintext", label: "Plain Text", shikiId: "plaintext" },
];

/** IDs pré-carregados no init do highlighter (as mais frequentes) */
export const PRELOADED_LANG_IDS = [
  "javascript",
  "typescript",
  "tsx",
  "python",
  "bash",
];

/** Map rápido de id → Language */
export const LANGUAGE_MAP: Record<string, Language> = Object.fromEntries(
  LANGUAGES.map((l) => [l.id, l]),
);

/** IDs que o vscode-languagedetection pode retornar → nosso id interno */
export const VSCODE_ID_MAP: Record<string, string> = {
  js: "javascript",
  javascript: "javascript",
  ts: "typescript",
  typescript: "typescript",
  jsx: "jsx",
  tsx: "tsx",
  py: "python",
  python: "python",
  go: "go",
  rs: "rust",
  rust: "rust",
  java: "java",
  css: "css",
  html: "html",
  sql: "sql",
  sh: "bash",
  bash: "bash",
  json: "json",
  yaml: "yaml",
  yml: "yaml",
  md: "markdown",
  markdown: "markdown",
  php: "php",
  rb: "ruby",
  ruby: "ruby",
  kotlin: "kotlin",
  kt: "kotlin",
  swift: "swift",
  cs: "csharp",
  csharp: "csharp",
  cpp: "cpp",
  "c++": "cpp",
  c: "cpp",
};
