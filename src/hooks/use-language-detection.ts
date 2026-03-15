"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { DetectLanguageResponse } from "@/app/api/detect-language/route";

export type DetectionMode = "auto" | "manual" | "detecting" | "unknown";

export interface LanguageDetectionState {
  lang: string | null;
  confidence: number;
  mode: DetectionMode;
}

const DEBOUNCE_MS = 500;
const MIN_CODE_LENGTH = 30;

/**
 * Hook para detecção automática de linguagem + suporte a override manual.
 *
 * @param code          Código atual do editor
 * @param manualOverride  ID de linguagem selecionado manualmente, ou null para modo auto
 */
export function useLanguageDetection(
  code: string,
  manualOverride: string | null,
): LanguageDetectionState {
  const [state, setState] = useState<LanguageDetectionState>({
    lang: null,
    confidence: 0,
    mode: "unknown",
  });

  const abortRef = useRef<AbortController | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const detect = useCallback(async (codeToDetect: string) => {
    // Cancela request anterior
    if (abortRef.current) {
      abortRef.current.abort();
    }
    const controller = new AbortController();
    abortRef.current = controller;

    setState((prev) => ({ ...prev, mode: "detecting" }));

    try {
      const res = await fetch("/api/detect-language", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: codeToDetect }),
        signal: controller.signal,
      });

      if (!res.ok) throw new Error("detect-language request failed");

      const data: DetectLanguageResponse = await res.json();

      if (!controller.signal.aborted) {
        setState({
          lang: data.languageId,
          confidence: data.confidence,
          mode: data.languageId ? "auto" : "unknown",
        });
      }
    } catch (err) {
      // Ignora erros de abort (usuário continuou digitando)
      if (err instanceof Error && err.name === "AbortError") return;
      console.error("[useLanguageDetection]", err);
      if (!controller.signal.aborted) {
        setState({ lang: null, confidence: 0, mode: "unknown" });
      }
    }
  }, []);

  useEffect(() => {
    // Modo manual — retorna imediatamente sem chamada de rede
    if (manualOverride !== null) {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (abortRef.current) abortRef.current.abort();
      setState({ lang: manualOverride, confidence: 1, mode: "manual" });
      return;
    }

    // Código muito curto — não detecta
    if (code.length < MIN_CODE_LENGTH) {
      if (timerRef.current) clearTimeout(timerRef.current);
      setState({ lang: null, confidence: 0, mode: "unknown" });
      return;
    }

    // Debounce antes de chamar a API
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      detect(code);
    }, DEBOUNCE_MS);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [code, manualOverride, detect]);

  // Cleanup no unmount
  useEffect(() => {
    return () => {
      if (abortRef.current) abortRef.current.abort();
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return state;
}
