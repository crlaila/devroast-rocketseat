"use client";

import { useEffect, useRef, useState } from "react";
import type { HighlighterCore, LanguageInput } from "shiki/core";
import type { CodeLine } from "@/components/ui/code-block";
import { LANGUAGE_MAP, PRELOADED_LANG_IDS } from "@/lib/languages";
import { devroastTheme } from "@/lib/shiki-theme";

type HighlightFn = (code: string, langId: string) => string;
type TokenizeFn = (code: string, langId: string) => CodeLine[];

const FALLBACK_COLOR = "#FAFAFA";

interface UseShikiHighlighterReturn {
  highlight: HighlightFn;
  tokenize: TokenizeFn;
  ready: boolean;
}

/**
 * Hook que inicializa o Shiki highlighter no cliente via WASM.
 * Pré-carrega as 5 linguagens mais comuns e faz lazy load das demais.
 */
export function useShikiHighlighter(): UseShikiHighlighterReturn {
  const [ready, setReady] = useState(false);
  const highlighterRef = useRef<HighlighterCore | null>(null);
  const loadingLangsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        // Importações dinâmicas — evita SSR e mantém o bundle do servidor limpo
        const { createHighlighterCore } = await import("shiki/core");
        const { createOnigurumaEngine } = await import(
          "shiki/engine/oniguruma"
        );

        // Pré-carrega langs mais comuns
        const preloadedLangs = await Promise.all(
          PRELOADED_LANG_IDS.map((id) => importShikiLang(id)),
        );
        const validPreloaded = preloadedLangs.filter(
          Boolean,
        ) as LanguageInput[];

        const highlighter = await createHighlighterCore({
          themes: [devroastTheme],
          langs: validPreloaded,
          engine: createOnigurumaEngine(import("shiki/wasm")),
        });

        if (!cancelled) {
          highlighterRef.current = highlighter;
          setReady(true);
        }
      } catch (err) {
        console.error("[useShikiHighlighter] Init failed:", err);
      }
    }

    init();
    return () => {
      cancelled = true;
    };
  }, []);

  const highlight: HighlightFn = (code: string, langId: string): string => {
    const highlighter = highlighterRef.current;
    if (!highlighter) return escapeHtml(code);

    const lang = LANGUAGE_MAP[langId];
    if (!lang || langId === "plaintext") return escapeHtml(code);

    const shikiId = lang.shikiId;
    const loadedLangs = highlighter.getLoadedLanguages();

    // Se a linguagem ainda não foi carregada, inicia o lazy load async
    // e retorna o texto sem highlight por ora
    if (!loadedLangs.includes(shikiId as never)) {
      if (!loadingLangsRef.current.has(shikiId)) {
        loadingLangsRef.current.add(shikiId);
        importShikiLang(langId).then(async (langModule) => {
          if (langModule) {
            try {
              await highlighter.loadLanguage(langModule as never);
            } catch (_) {
              // silently ignore duplicate load errors
            }
          }
          loadingLangsRef.current.delete(shikiId);
        });
      }
      return escapeHtml(code);
    }

    try {
      return highlighter.codeToHtml(code, {
        lang: shikiId,
        theme: "devroast",
      });
    } catch (_) {
      return escapeHtml(code);
    }
  };

  const tokenize: TokenizeFn = (code: string, langId: string): CodeLine[] => {
    const highlighter = highlighterRef.current;

    // Fallback: each line is a single plain-text token
    const plainLines = (): CodeLine[] =>
      code.split("\n").map((line) => [{ text: line, color: FALLBACK_COLOR }]);

    if (!highlighter) return plainLines();

    const lang = LANGUAGE_MAP[langId];
    if (!lang || langId === "plaintext") return plainLines();

    const shikiId = lang.shikiId;
    const loadedLangs = highlighter.getLoadedLanguages();

    if (!loadedLangs.includes(shikiId as never)) {
      if (!loadingLangsRef.current.has(shikiId)) {
        loadingLangsRef.current.add(shikiId);
        importShikiLang(langId).then(async (langModule) => {
          if (langModule) {
            try {
              await highlighter.loadLanguage(langModule as never);
            } catch (_) {
              // silently ignore duplicate load errors
            }
          }
          loadingLangsRef.current.delete(shikiId);
        });
      }
      return plainLines();
    }

    try {
      const result = highlighter.codeToTokens(code, {
        lang: shikiId,
        theme: "devroast",
      });
      return result.tokens.map((lineTokens) =>
        lineTokens.map((token) => ({
          text: token.content,
          color: token.color ?? FALLBACK_COLOR,
        })),
      );
    } catch (_) {
      return plainLines();
    }
  };

  return { highlight, tokenize, ready };
}

/**
 * Importa dinamicamente a grammar Shiki de uma linguagem pelo nosso id interno.
 * Retorna null se não houver mapeamento.
 */
async function importShikiLang(id: string): Promise<unknown> {
  try {
    switch (id) {
      case "javascript":
        return (await import("shiki/langs/javascript.mjs")).default;
      case "typescript":
        return (await import("shiki/langs/typescript.mjs")).default;
      case "jsx":
        return (await import("shiki/langs/jsx.mjs")).default;
      case "tsx":
        return (await import("shiki/langs/tsx.mjs")).default;
      case "python":
        return (await import("shiki/langs/python.mjs")).default;
      case "go":
        return (await import("shiki/langs/go.mjs")).default;
      case "rust":
        return (await import("shiki/langs/rust.mjs")).default;
      case "java":
        return (await import("shiki/langs/java.mjs")).default;
      case "css":
        return (await import("shiki/langs/css.mjs")).default;
      case "html":
        return (await import("shiki/langs/html.mjs")).default;
      case "sql":
        return (await import("shiki/langs/sql.mjs")).default;
      case "bash":
        return (await import("shiki/langs/bash.mjs")).default;
      case "json":
        return (await import("shiki/langs/json.mjs")).default;
      case "yaml":
        return (await import("shiki/langs/yaml.mjs")).default;
      case "markdown":
        return (await import("shiki/langs/markdown.mjs")).default;
      case "php":
        return (await import("shiki/langs/php.mjs")).default;
      case "ruby":
        return (await import("shiki/langs/ruby.mjs")).default;
      case "kotlin":
        return (await import("shiki/langs/kotlin.mjs")).default;
      case "swift":
        return (await import("shiki/langs/swift.mjs")).default;
      case "csharp":
        return (await import("shiki/langs/csharp.mjs")).default;
      case "cpp":
        return (await import("shiki/langs/cpp.mjs")).default;
      default:
        return null;
    }
  } catch {
    return null;
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
