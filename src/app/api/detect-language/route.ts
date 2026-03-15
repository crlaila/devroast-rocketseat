import { type NextRequest, NextResponse } from "next/server";
import { VSCODE_ID_MAP } from "@/lib/languages";

/**
 * Minimum confidence threshold.
 * The model rarely exceeds 0.3 for dynamic languages (Python ~0.17, Go ~0.22)
 * but can reach 0.7 for distinctive ones (SQL, TypeScript).
 * 0.01 is a safe floor that filters obvious noise while accepting the model's best guess
 * (the highest confidence result is typically the most reliable).
 */
const MIN_CONFIDENCE = 0.01;

export interface DetectLanguageResponse {
  languageId: string | null;
  confidence: number;
}

/**
 * Lazy singleton — loaded once per Node.js process to avoid reloading the
 * ~1MB model binary on every request.
 *
 * The package is listed in `serverExternalPackages` in next.config.ts so that
 * Next.js does NOT bundle it — it's required natively at runtime, giving it
 * access to the real filesystem paths it needs to load model.json and the
 * weights binary.
 *
 * We use a dynamic import because the package is CJS and its named exports
 * live under `default` when consumed via ESM (which Next.js uses for routes).
 */
// biome-ignore lint/suspicious/noExplicitAny: CJS/ESM interop — no typings cover this
let modelOpsPromise: Promise<any> | null = null;

// biome-ignore lint/suspicious/noExplicitAny: CJS/ESM interop
async function getModelOps(): Promise<any> {
  if (!modelOpsPromise) {
    modelOpsPromise = (async () => {
      const mod = await import("@vscode/vscode-languagedetection");
      // biome-ignore lint/suspicious/noExplicitAny: CJS/ESM interop
      const modAny = mod as any;
      const Ctor = modAny.default?.ModelOperations ?? modAny.ModelOperations;
      return new Ctor();
    })();
  }
  return modelOpsPromise;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const code: string = body?.code ?? "";

    if (typeof code !== "string" || code.trim().length < 20) {
      return NextResponse.json<DetectLanguageResponse>({
        languageId: null,
        confidence: 0,
      });
    }

    const ops = await getModelOps();
    const results: Array<{ languageId: string; confidence: number }> =
      await ops.runModel(code);

    if (!results || results.length === 0) {
      return NextResponse.json<DetectLanguageResponse>({
        languageId: null,
        confidence: 0,
      });
    }

    // Walk results in confidence order (already sorted descending).
    // Pick the first result whose languageId maps to one of our supported
    // languages AND meets the minimum confidence threshold.
    for (const result of results) {
      const mapped = VSCODE_ID_MAP[result.languageId];
      if (mapped && result.confidence >= MIN_CONFIDENCE) {
        return NextResponse.json<DetectLanguageResponse>({
          languageId: mapped,
          confidence: result.confidence,
        });
      }
    }

    // Nothing met the threshold — return unknown
    return NextResponse.json<DetectLanguageResponse>({
      languageId: null,
      confidence: 0,
    });
  } catch (err) {
    console.error("[detect-language] Error:", err);
    return NextResponse.json<DetectLanguageResponse>(
      { languageId: null, confidence: 0 },
      { status: 500 },
    );
  }
}
