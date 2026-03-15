# Editor com Syntax Highlighting — Especificação

**Status:** Aprovado  
**Data:** 2026-03-15  

---

## 1. Contexto

A homepage (`src/app/page.tsx`) atualmente tem um `<textarea>` simples onde o usuário cola o código. O objetivo desta feature é transformar esse editor em um componente que:

1. Detecta automaticamente a linguagem do código colado.
2. Aplica syntax highlighting em tempo real conforme o usuário digita/cola.
3. Permite que o usuário sobrescreva manualmente a linguagem detectada via um seletor no editor.

O editor deve manter a estética dark/terminal do projeto (tokens `bg-input: #111111`, `border-primary: #2A2A2A`, `text-primary: #FAFAFA`, `accent-green: #22C55E`, fonte JetBrains Mono).

O mesmo componente `<CodeEditor />` também será usado na página de resultado do roast para exibir o código submetido com syntax highlighting (modo leitura). O componente `CodeBlock` atual (`src/components/ui/code-block.tsx`) **não** será modificado — ele continuará sendo usado para exibição de snippets estáticos na interface de resultado.

---

## 2. Referência: ray.so

O editor do [ray.so](https://ray.so) (código em [`raycast/ray-so`](https://github.com/raycast/ray-so)) foi analisado. Arquitetura relevante:

### Abordagem de sobreposição (overlay pattern)
- Um `<textarea>` invisível captura a digitação do usuário (posicionado em cima).
- Uma `<div>` atrás renderiza o HTML gerado pelo highlighter (`dangerouslySetInnerHTML`).
- Ambos ficam com o mesmo font, line-height e padding, criando a ilusão de um editor com cores.

### Bibliotecas usadas pelo ray.so
| Biblioteca | Função |
|---|---|
| `shiki` | Syntax highlighting via TextMate grammars |
| `jotai` | Estado global (code, linguagem selecionada, highlighter) |
| `shiki/wasm` | Carregamento do highlighter via WebAssembly |

### Fluxo de highlight (ray.so)
1. Na montagem do componente, inicializa `getHighlighterCore` com os idiomas padrão carregados de forma lazy.
2. O `HighlightedCode.tsx` observa mudanças em `code` e `selectedLanguage`.
3. Se a linguagem ainda não foi carregada, chama `highlighter.loadLanguage(lang.src())` sob demanda.
4. Renderiza o HTML resultante de `highlighter.codeToHtml()` em uma `<div>`.

### O que o ray.so NÃO faz
- **Não detecta a linguagem automaticamente.** O usuário seleciona via `LanguageControl.tsx` (dropdown/combobox).

---

## 3. Pesquisa de Bibliotecas

### 3.1 Syntax Highlighting

#### **Shiki** ⭐ Recomendado
- **Repo:** https://github.com/shikijs/shiki (13k+ stars)
- **Como funciona:** Usa TextMate grammars (o mesmo padrão do VS Code). Produz HTML com tokens coloridos via `<span style="color:...">`.
- **Prós:**
  - Qualidade de highlight idêntica ao VS Code
  - Suporte a +200 linguagens out of the box
  - Suporte a WASM no browser (sem Node.js dependency)
  - Lazy loading de grammars por linguagem
  - Usado em produção pelo ray.so, VitePress, Astro, Nuxt
  - Themes customizáveis (pode usar CSS variables para integrar com nosso design system)
- **Contras:**
  - Bundle inicial pode ser grande se muitas linguagens carregadas de uma vez (mitigado por lazy load)
  - Não é um editor real — só highlighting
- **Tamanho:** core ~50kb gzip, cada grammar adicional ~5-30kb

#### CodeMirror 6
- **Como funciona:** Editor completo (não só highlighting). Parser próprio com Lezer.
- **Prós:** Suporte a edição real (autocomplete, keybindings avançados)
- **Contras:** Bundle muito maior (~300kb+), overkill para nosso caso de uso (só precisamos de highlight, não de editor LSP-completo), menos controle visual sobre o tema
- **Indicado quando:** o produto é primariamente um editor de código (e.g., IDE online)

#### Prism.js / highlight.js
- **Como funciona:** Regex-based highlighting, mais simples
- **Prós:** Leve, madura, bem conhecida
- **Contras:** Qualidade inferior ao Shiki (não usa TextMate grammars), menos preciso em linguagens complexas como TSX, menos manutenida que Shiki

### 3.2 Detecção Automática de Linguagem

#### **`@vscode/vscode-languagedetection` via API Route** ⭐ Recomendado
- **Repo:** https://github.com/microsoft/vscode-languagedetection
- **Como funciona:** Usa ML (modelo TensorFlow.js, ~1MB) treinado pela equipe do VS Code. É exatamente o mesmo modelo que o VS Code usa para detectar linguagem ao abrir um arquivo sem extensão.
- **Output:** Array de `{ languageId: string, confidence: number }` ordenado por confiança
- **Prós:**
  - Excelente acurácia para as linguagens mais populares
  - Detecta diferença entre JS/TS, JSX/TSX, etc.
  - Retorna confiança — podemos mostrar "auto-detectado: TypeScript (92%)"
  - Executando no servidor (API Route), o ~1MB do modelo **não impacta** o bundle do cliente
  - Mesma infra que será usada para o roast via AI
- **Contras:**
  - Requer chamada de rede (latência de ~100-300ms) — mitigada pelo debounce de 500ms
  - Requer mínimo de ~20 chars para detectar
- **Instalação:** `npm install @vscode/vscode-languagedetection`
- **API Route:** `POST /api/detect-language` — recebe `{ code: string }`, retorna `{ languageId: string, confidence: number }`

#### Alternativas descartadas
| Opção | Por que descartada |
|---|---|
| `@vscode/vscode-languagedetection` no browser | Modelo de ~1MB inaceitável no bundle do cliente |
| `franc` | Detecta linguagens humanas (pt, en, es...), não de programação |
| Heurísticas manuais (regex) | Frágil, difícil de manter, baixa acurácia para casos ambíguos |
| Linguist (GitHub) | Apenas Node.js/server-side, não roda no browser diretamente |

---

## 4. Decisão Técnica

**Highlighter:** `shiki` (v3+)  
**Detecção de linguagem:** `@vscode/vscode-languagedetection` — via Next.js API Route (server-side), não no browser  
**Padrão de UI:** Overlay (textarea invisível + div de highlight), inspirado no ray.so  
**Estado:** `useState` local no componente (sem Jotai por enquanto — manter simples)  
**Modo leitura:** O `<CodeEditor />` suporta `readOnly={true}` para uso na página de resultado

---

## 5. Comportamento esperado

### 5.1 Detecção automática
- Trigger: quando o usuário para de digitar por **500ms** (debounce) E o conteúdo tem **≥ 30 caracteres**
- Exibe badge com a linguagem detectada e nível de confiança: `// auto: typescript (94%)`
- Se confiança < 40%, exibe `// lang: unknown` e não aplica highlighting específico

### 5.2 Seleção manual
- Dropdown acima ou abaixo do editor (dentro do frame do terminal) com as linguagens suportadas
- Ao selecionar manualmente, cancela a detecção automática ("override mode")
- Um botão "auto" ou "reset" volta para detecção automática
- O seletor deve mostrar um ícone ou label indicando se está em modo "auto" ou "manual"

### 5.3 Comportamento do editor
- Suporte a Tab/Shift+Tab para indentação
- Não interferir com comportamentos de colar (Cmd+V / Ctrl+V)
- Preservar seleção de texto
- Cursor verde (`accent-green: #22C55E`) — já definido na implementação atual

---

## 6. Arquitetura de Componentes

### Novo componente: `<CodeEditor />`

Deve substituir o bloco do `<textarea>` atual em `page.tsx` e também ser usado na página de resultado do roast para exibir o código submetido com highlighting (modo leitura).

```
src/components/ui/
  code-editor.tsx    ← componente novo
  code-editor.css    ← estilos de posicionamento (overlay)

src/app/api/
  detect-language/
    route.ts         ← API Route Next.js para detecção server-side
```

**Interface:**
```typescript
interface CodeEditorProps {
  value: string;
  onChange?: (value: string) => void;   // opcional — omitir em readOnly
  onLanguageChange?: (lang: string | null) => void;
  readOnly?: boolean;                    // modo leitura (página de resultado)
  detectedLanguage?: string;            // linguagem pré-definida (modo leitura)
  className?: string;
}
```

**Estrutura interna:**
```
<div class="editor-root">          ← container relativo
  <div class="editor-toolbar">    ← macOS dots + language badge/selector
    <WindowDots />
    <LanguageBadge lang="typescript" confidence={0.94} mode="auto" />
    <LanguageSelector />          ← só visível quando clicado/foco no badge
  </div>
  <div class="editor-body">
    <LineNumbers count={n} />
    <div class="editor-area">     ← posição relativa
      <div                        ← highlighted HTML (atrás)
        class="highlight-layer"
        dangerouslySetInnerHTML=... />
      <textarea                   ← input real (na frente, transparente)
        class="input-layer" />
    </div>
  </div>
</div>
```

---

## 7. Linguagens Suportadas

Subconjunto inicial (as mais populares no contexto de code review):

| ID interno | Nome exibido |
|---|---|
| `javascript` | JavaScript |
| `typescript` | TypeScript |
| `jsx` | JSX |
| `tsx` | TSX |
| `python` | Python |
| `go` | Go |
| `rust` | Rust |
| `java` | Java |
| `css` | CSS |
| `html` | HTML |
| `sql` | SQL |
| `bash` | Bash / Shell |
| `json` | JSON |
| `yaml` | YAML |
| `markdown` | Markdown |
| `php` | PHP |
| `ruby` | Ruby |
| `kotlin` | Kotlin |
| `swift` | Swift |
| `csharp` | C# |
| `cpp` | C++ |
| `plaintext` | Plain Text |

---

## 8. Tema de Cores (Shiki)

O Shiki suporta themes via CSS variables, o que nos permite usar os tokens do design system.

**Estratégia:** Criar um tema customizado que mapeia os tokens semânticos do Shiki para as cores do DevRoast:

```css
/* Tokens Shiki → DevRoast */
--shiki-color-text: #FAFAFA;          /* text-primary */
--shiki-color-background: #111111;    /* bg-input */
--shiki-token-constant: #22C55E;      /* accent-green — números, constantes */
--shiki-token-string: #F59E0B;        /* accent-amber — strings */
--shiki-token-comment: #4B5563;       /* text-tertiary — comentários */
--shiki-token-keyword: #EF4444;       /* accent-red — keywords */
--shiki-token-parameter: #FAFAFA;     /* text-primary — parâmetros */
--shiki-token-function: #93C5FD;      /* azul suave — funções */
--shiki-token-string-expression: #F59E0B;
--shiki-token-punctuation: #6B7280;   /* text-secondary */
--shiki-token-link: #22C55E;
```

---

## 9. Considerações de Performance

1. **Lazy loading de linguagens Shiki:** Cada grammar é carregado apenas quando necessário (igual ao ray.so). Pré-carregar apenas as 5 mais comuns: `javascript`, `typescript`, `tsx`, `python`, `bash`.

2. **Detecção server-side:** `@vscode/vscode-languagedetection` roda apenas na API Route (servidor Next.js), nunca no cliente. O modelo de ~1MB fica no servidor e não é enviado ao browser.

3. **Debounce na detecção:** 500ms após o último keystroke. Cancelar chamadas anteriores se o usuário continua digitando.

4. **Debounce no highlight:** Pode ser necessário um debounce leve (50-100ms) no highlight para evitar re-renders excessivos durante digitação rápida, mas o Shiki é síncrono após o grammar estar carregado — avaliar se necessário.

5. **Sem SSR:** O editor deve ser wrapped em `dynamic(() => import(...), { ssr: false })` ou usar um `useEffect` para montar apenas no client, pois depende de WebAssembly.

---

## 10. Decisões

> Respostas às open questions originais.

- [x] **Q1: Escopo do editor** — O `<CodeEditor />` será usado tanto no input da homepage (modo edição) quanto na página de resultado do roast (modo leitura, `readOnly={true}`). O `CodeBlock` estático existente **não** é substituído e permanece fora deste escopo.

- [x] **Q2: Modelo de detecção no browser** — O modelo de ~1MB **não é aceitável** no bundle do cliente. A detecção será feita via **Next.js API Route** (`POST /api/detect-language`), mantendo o cliente leve.

- [x] **Q3: Persistência da linguagem** — A linguagem selecionada manualmente **não** é persistida entre sessões. Reset a cada nova visita.

- [x] **Q4: Tamanho do código** — Limite de **500 linhas**. Ao ultrapassar, exibir aviso: `// warning: large file — highlighting may be slow`. O conteúdo ainda é aceito.

- [x] **Q5: Modo de edição vs. leitura** — O `CodeBlock` atual (`src/components/ui/code-block.tsx`) é **fora de escopo** desta feature. Apenas o editor de input e a exibição do código submetido na página de resultado usarão Shiki.

---

## 11. To-Dos de Implementação

> Em ordem de dependência.

### Setup
- [ ] **SETUP-1** — Instalar dependências: `npm install shiki @vscode/vscode-languagedetection`
- [ ] **SETUP-2** — Criar tema Shiki customizado com CSS variables do design system (`src/lib/shiki-theme.ts`)
- [ ] **SETUP-3** — Criar hook `useShikiHighlighter` — inicializa o highlighter com WASM, pré-carrega 5 linguagens comuns, lazy load das demais (`src/hooks/use-shiki-highlighter.ts`)
- [ ] **SETUP-4** — Criar hook `useLanguageDetection` — debounce 500ms, chama `POST /api/detect-language`, retorna `{ lang, confidence, mode }` (`src/hooks/use-language-detection.ts`)
- [ ] **SETUP-5** — Criar API Route `src/app/api/detect-language/route.ts` — recebe `{ code: string }`, roda `@vscode/vscode-languagedetection` server-side, retorna `{ languageId, confidence }`

### Componentes
- [ ] **COMP-1** — Criar `LanguageBadge` — exibe linguagem detectada + confiança + modo (auto/manual). Ao clicar, abre o `LanguageSelector`
- [ ] **COMP-2** — Criar `LanguageSelector` — dropdown com a lista de linguagens suportadas (seção 7) + opção "auto-detect"
- [ ] **COMP-3** — Criar `CodeEditor` — overlay pattern completo, integrando hooks e sub-componentes, suporte a `readOnly`
- [ ] **COMP-4** — Substituir o `<textarea>` atual em `src/app/page.tsx` pelo `<CodeEditor />`
- [ ] **COMP-5** — Usar `<CodeEditor readOnly detectedLanguage={lang} value={code} />` na página de resultado do roast
- [ ] **COMP-6** — Exportar `CodeEditor` via `src/components/ui/index.ts`

### Validação
- [ ] **TEST-1** — Validar detecção automática com snippets: JS, TS, TSX, Python, SQL, Go, Bash
- [ ] **TEST-2** — Validar override manual e retorno ao modo auto
- [ ] **TEST-3** — Validar performance com 500 linhas de código coladas
- [ ] **TEST-4** — Validar modo `readOnly` na página de resultado

### Polish
- [ ] **POLISH-1** — Animação suave (fade/transition) na troca de linguagem detectada
- [ ] **POLISH-2** — Placeholder text: `// paste your code here...`
- [ ] **POLISH-3** — Aviso de 500 linhas: `// warning: large file — highlighting may be slow`
- [ ] **POLISH-4** — Acessibilidade: `aria-label` no textarea, `role="status"` no badge de linguagem

---

## 12. Referências

- [ray.so source — Editor.tsx](https://github.com/raycast/ray-so/blob/main/app/(navigation)/(code)/components/Editor.tsx)
- [ray.so source — HighlightedCode.tsx](https://github.com/raycast/ray-so/blob/main/app/(navigation)/(code)/components/HighlightedCode.tsx)
- [ray.so source — languages.ts](https://github.com/raycast/ray-so/blob/main/app/(navigation)/(code)/util/languages.ts)
- [Shiki documentation](https://shiki.style)
- [shikijs/shiki on GitHub](https://github.com/shikijs/shiki)
- [microsoft/vscode-languagedetection on GitHub](https://github.com/microsoft/vscode-languagedetection)
- [Shiki CSS Variables Theme](https://shiki.style/guide/theme#css-variables-theme)
