"use client";

import {
  type ChangeEvent,
  type KeyboardEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import type { DetectionMode } from "@/hooks/use-language-detection";
import { useLanguageDetection } from "@/hooks/use-language-detection";
import { useShikiHighlighter } from "@/hooks/use-shiki-highlighter";
import { LANGUAGE_MAP, LANGUAGES } from "@/lib/languages";
import { cn } from "@/lib/utils";
import "./code-editor.css";

const LINE_HEIGHT = 20; // px — must match code-editor.css
const MAX_LINES = 500;

// ─── Types ───────────────────────────────────────────────────────────────────

export interface CodeEditorProps {
  value: string;
  onChange?: (value: string) => void;
  onLanguageChange?: (lang: string | null) => void;
  /** Pre-set language (skips auto-detection). Required when readOnly=true. */
  detectedLanguage?: string;
  /** Read-only display mode — no textarea, no detection */
  readOnly?: boolean;
  className?: string;
}

// ─── Internal: Window dots ────────────────────────────────────────────────────

function WindowDots() {
  return (
    <div className="flex items-center gap-2">
      <span className="w-3 h-3 rounded-full bg-[#EF4444] shrink-0" />
      <span className="w-3 h-3 rounded-full bg-[#F59E0B] shrink-0" />
      <span className="w-3 h-3 rounded-full bg-[#10B981] shrink-0" />
    </div>
  );
}

// ─── Internal: Language Badge ─────────────────────────────────────────────────

interface LanguageBadgeProps {
  lang: string | null;
  confidence: number;
  mode: DetectionMode;
  onClick: () => void;
  readOnly?: boolean;
}

function LanguageBadge({
  lang,
  confidence,
  mode,
  onClick,
  readOnly,
}: LanguageBadgeProps) {
  const label = LANGUAGE_MAP[lang ?? ""]?.label ?? lang;
  const pct = Math.round(confidence * 100);

  let text: string;
  if (mode === "detecting") {
    text = "// detecting...";
  } else if (mode === "manual") {
    text = `// manual: ${label}`;
  } else if (mode === "auto" && lang) {
    text = `// auto: ${label} (${pct}%)`;
  } else {
    text = "// lang: unknown";
  }

  if (readOnly) {
    return (
      <span className="font-['JetBrains_Mono',monospace] text-[11px] text-[#4B5563]">
        {text}
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="font-['JetBrains_Mono',monospace] text-[11px] text-[#4B5563] hover:text-[#6B7280] transition-colors cursor-pointer select-none"
      title="Click to change language"
      aria-label={`Current language: ${label ?? "unknown"}. Click to change.`}
    >
      {text}
    </button>
  );
}

// ─── Internal: Language Selector ─────────────────────────────────────────────

interface LanguageSelectorProps {
  currentLangId: string | null;
  onSelect: (id: string | null) => void;
  onClose: () => void;
}

function LanguageSelector({
  currentLangId,
  onSelect,
  onClose,
}: LanguageSelectorProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClose]);

  // Close on Escape
  useEffect(() => {
    function handleKey(e: globalThis.KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div ref={ref} className="lang-selector-dropdown" role="listbox">
      {/* Auto-detect option */}
      <button
        type="button"
        role="option"
        aria-selected={currentLangId === null}
        data-active={currentLangId === null}
        className="lang-selector-item"
        onClick={() => onSelect(null)}
      >
        auto-detect
      </button>

      <div className="h-px bg-[#2A2A2A] mx-3 my-1" />

      {LANGUAGES.map((lang) => (
        <button
          key={lang.id}
          type="button"
          role="option"
          aria-selected={currentLangId === lang.id}
          data-active={currentLangId === lang.id}
          className="lang-selector-item"
          onClick={() => onSelect(lang.id)}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
}

// ─── Internal: Tab / indentation helpers (from ray.so) ───────────────────────

function indentText(text: string) {
  return text
    .split("\n")
    .map((line) => `  ${line}`)
    .join("\n");
}

function dedentText(text: string) {
  return text
    .split("\n")
    .map((line) => line.replace(/^\s\s/, ""))
    .join("\n");
}

function getCurrentLine(textarea: HTMLTextAreaElement): string {
  const before = textarea.value.slice(0, textarea.selectionStart);
  return textarea.value
    .slice(before.lastIndexOf("\n") !== -1 ? before.lastIndexOf("\n") + 1 : 0)
    .split("\n")[0];
}

function handleTabKey(textarea: HTMLTextAreaElement, shiftKey: boolean) {
  const { value, selectionStart: start, selectionEnd: end } = textarea;
  const before = value.slice(0, start);
  const currentLine = getCurrentLine(textarea);

  if (start === end) {
    if (shiftKey) {
      const newStart = before.lastIndexOf("\n") + 1;
      textarea.setSelectionRange(newStart, end);
      document.execCommand(
        "insertText",
        false,
        dedentText(value.slice(newStart, end)),
      );
    } else {
      document.execCommand("insertText", false, "  ");
    }
  } else {
    const newStart = before.lastIndexOf("\n") + 1 || 0;
    textarea.setSelectionRange(newStart, end);
    if (shiftKey) {
      const newText = dedentText(value.slice(newStart, end));
      document.execCommand("insertText", false, newText);
      if (currentLine.startsWith("  ")) {
        textarea.setSelectionRange(start - 2, start - 2 + newText.length);
      } else {
        textarea.setSelectionRange(start, start + newText.length);
      }
    } else {
      const newText = indentText(value.slice(newStart, end));
      document.execCommand("insertText", false, newText);
      textarea.setSelectionRange(start + 2, start + 2 + newText.length);
    }
  }
}

function handleEnterKey(textarea: HTMLTextAreaElement) {
  const currentLine = getCurrentLine(textarea);
  const indentMatch = currentLine.match(/^(\s+)/);
  let indent = indentMatch ? indentMatch[0] : "";
  if (currentLine.match(/([{[:>])$/)) indent += "  ";
  document.execCommand("insertText", false, `\n${indent}`);
}

// ─── Main component ───────────────────────────────────────────────────────────

export function CodeEditor({
  value,
  onChange,
  onLanguageChange,
  detectedLanguage,
  readOnly = false,
  className,
}: CodeEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);

  // Manual language override (null = auto-detect)
  const [manualOverride, setManualOverride] = useState<string | null>(
    detectedLanguage ?? null,
  );
  const [selectorOpen, setSelectorOpen] = useState(false);

  // Hooks
  const { highlight, ready } = useShikiHighlighter();
  const detection = useLanguageDetection(
    readOnly ? "" : value,
    readOnly ? (detectedLanguage ?? null) : manualOverride,
  );

  const activeLang = detection.lang;

  // Notify parent of language changes
  useEffect(() => {
    onLanguageChange?.(activeLang);
  }, [activeLang, onLanguageChange]);

  // Line numbers
  const lineCount = Math.max(value.split("\n").length, 16);
  const lineNumbers = Array.from({ length: lineCount }, (_, i) => i + 1);
  const isLargeFile = value.split("\n").length > MAX_LINES;

  // Highlighted HTML
  const highlightedHtml =
    ready && activeLang
      ? highlight(value, activeLang)
      : `<pre><code>${value
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")}</code></pre>`;

  // ── Event handlers ──────────────────────────────────────────────────────────

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      onChange?.(e.target.value);
    },
    [onChange],
  );

  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLTextAreaElement>) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    switch (e.key) {
      case "Tab":
        e.preventDefault();
        handleTabKey(textarea, e.shiftKey);
        break;
      case "Enter":
        e.preventDefault();
        handleEnterKey(textarea);
        break;
      case "Escape":
        textarea.blur();
        break;
    }
  }, []);

  const handleScroll = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    if (highlightRef.current) {
      highlightRef.current.scrollTop = textarea.scrollTop;
      highlightRef.current.scrollLeft = textarea.scrollLeft;
    }
    if (lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textarea.scrollTop;
    }
  }, []);

  const handleBadgeClick = useCallback(() => {
    setSelectorOpen((v) => !v);
  }, []);

  const handleSelectLang = useCallback((id: string | null) => {
    setManualOverride(id);
    setSelectorOpen(false);
  }, []);

  const handleSelectorClose = useCallback(() => {
    setSelectorOpen(false);
  }, []);

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div
      className={cn(
        "flex flex-col border border-[#2A2A2A] bg-[#111111] overflow-hidden",
        className,
      )}
    >
      {/* Toolbar */}
      <div className="flex items-center justify-between h-10 px-4 border-b border-[#2A2A2A] shrink-0">
        <WindowDots />

        {/* Badge + selector container */}
        <div ref={badgeRef} className="relative flex items-center">
          <LanguageBadge
            lang={activeLang}
            confidence={detection.confidence}
            mode={detection.mode}
            onClick={handleBadgeClick}
            readOnly={readOnly}
          />

          {/* Reset to auto button (shown only in manual mode) */}
          {!readOnly && detection.mode === "manual" && (
            <button
              type="button"
              onClick={() => setManualOverride(null)}
              className="ml-2 font-['JetBrains_Mono',monospace] text-[10px] text-[#4B5563] hover:text-[#22C55E] transition-colors border border-[#2A2A2A] px-1.5 py-0.5"
              title="Reset to auto-detect"
              aria-label="Reset to auto-detect"
            >
              auto
            </button>
          )}

          {selectorOpen && (
            <LanguageSelector
              currentLangId={manualOverride}
              onSelect={handleSelectLang}
              onClose={handleSelectorClose}
            />
          )}
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 min-h-0">
        {/* Line numbers */}
        <div
          ref={lineNumbersRef}
          className="flex flex-col shrink-0 bg-[#0F0F0F] border-r border-[#2A2A2A] px-3 py-4 overflow-hidden select-none"
          style={{ width: "48px", gap: `${LINE_HEIGHT - 20}px` }}
          aria-hidden="true"
        >
          {lineNumbers.map((n) => (
            <span
              key={n}
              className="font-['JetBrains_Mono',monospace] text-[12px] text-[#4B5563] text-right"
              style={{
                lineHeight: `${LINE_HEIGHT}px`,
                height: `${LINE_HEIGHT}px`,
                display: "block",
              }}
            >
              {n}
            </span>
          ))}
        </div>

        {/* Editor area: overlay */}
        <div className="editor-area flex-1">
          {/* Large file warning — rendered as first "line" in highlight layer */}
          {isLargeFile && (
            <div
              className="absolute top-0 left-0 right-0 z-10 px-4 py-1 font-['JetBrains_Mono',monospace] text-[11px] text-[#F59E0B] bg-[#111111] border-b border-[#2A2A2A] pointer-events-none"
              aria-live="polite"
            >
              {"// warning: large file — highlighting may be slow"}
            </div>
          )}

          {/* Highlighted HTML layer */}
          <div
            ref={highlightRef}
            className="highlight-layer"
            style={{ top: isLargeFile ? "28px" : "0" }}
            // biome-ignore lint/security/noDangerouslySetInnerHtml: sanitized by shiki
            dangerouslySetInnerHTML={{ __html: highlightedHtml }}
            aria-hidden="true"
          />

          {/* Textarea input layer */}
          {!readOnly && (
            <textarea
              ref={textareaRef}
              value={value}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              onScroll={handleScroll}
              spellCheck={false}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              placeholder="// paste your code here..."
              className="input-layer"
              style={{
                top: isLargeFile ? "28px" : "0",
                height: isLargeFile ? "calc(100% - 28px)" : "100%",
              }}
              aria-label="Code editor"
            />
          )}
        </div>
      </div>
    </div>
  );
}
