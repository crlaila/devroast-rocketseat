import type { ThemeRegistrationRaw } from "shiki";

/**
 * Tema customizado DevRoast para Shiki.
 * Usa o formato TextMate (settings[]) compatível com ThemeRegistrationRaw.
 *
 * Design tokens usados:
 *   text-primary    #FAFAFA
 *   text-secondary  #6B7280
 *   text-tertiary   #4B5563
 *   bg-input        #111111
 *   accent-green    #22C55E  → constantes, números, valores booleanos
 *   accent-red      #EF4444  → keywords
 *   accent-amber    #F59E0B  → strings
 *   azul suave      #93C5FD  → funções, métodos
 */
export const devroastTheme: ThemeRegistrationRaw = {
  name: "devroast",
  type: "dark",
  colors: {
    "editor.background": "#111111",
    "editor.foreground": "#FAFAFA",
  },
  settings: [
    // Global defaults
    {
      settings: { foreground: "#FAFAFA", background: "#111111" },
    },

    // --- Comentários ---
    {
      scope: ["comment", "punctuation.definition.comment"],
      settings: { foreground: "#4B5563", fontStyle: "italic" },
    },

    // --- Keywords ---
    {
      scope: [
        "keyword",
        "keyword.control",
        "keyword.operator.new",
        "keyword.operator.delete",
        "keyword.other",
        "storage.type",
        "storage.modifier",
      ],
      settings: { foreground: "#EF4444" },
    },

    // --- Strings ---
    {
      scope: [
        "string",
        "string.quoted",
        "string.template",
        "punctuation.definition.string",
      ],
      settings: { foreground: "#F59E0B" },
    },

    // --- Constantes, números, booleanos ---
    {
      scope: [
        "constant.numeric",
        "constant.language",
        "constant.character",
        "constant.other",
        "support.constant",
      ],
      settings: { foreground: "#22C55E" },
    },

    // --- Funções e métodos ---
    {
      scope: [
        "entity.name.function",
        "support.function",
        "meta.function-call",
        "variable.function",
      ],
      settings: { foreground: "#93C5FD" },
    },

    // --- Classes e tipos ---
    {
      scope: [
        "entity.name.class",
        "entity.name.type",
        "entity.other.inherited-class",
        "support.class",
        "support.type",
      ],
      settings: { foreground: "#C4B5FD" },
    },

    // --- Variáveis e parâmetros ---
    {
      scope: [
        "variable",
        "variable.other",
        "variable.parameter",
        "variable.other.readwrite",
      ],
      settings: { foreground: "#FAFAFA" },
    },

    // --- Propriedades de objetos ---
    {
      scope: [
        "variable.other.property",
        "support.variable.property",
        "meta.object.member",
      ],
      settings: { foreground: "#E2E8F0" },
    },

    // --- Tags HTML/JSX ---
    {
      scope: [
        "entity.name.tag",
        "punctuation.definition.tag",
        "support.class.component",
      ],
      settings: { foreground: "#EF4444" },
    },

    // --- Atributos HTML ---
    {
      scope: ["entity.other.attribute-name"],
      settings: { foreground: "#F59E0B" },
    },

    // --- Operadores ---
    {
      scope: ["keyword.operator", "punctuation.accessor"],
      settings: { foreground: "#6B7280" },
    },

    // --- Pontuação ---
    {
      scope: [
        "punctuation",
        "punctuation.separator",
        "punctuation.terminator",
        "punctuation.definition.block",
      ],
      settings: { foreground: "#6B7280" },
    },

    // --- Importações / módulos ---
    {
      scope: [
        "entity.name.module",
        "support.module",
        "keyword.control.import",
        "keyword.control.export",
        "keyword.control.from",
      ],
      settings: { foreground: "#EF4444" },
    },

    // --- Decorators ---
    {
      scope: ["meta.decorator", "punctuation.decorator"],
      settings: { foreground: "#F59E0B" },
    },

    // --- Regex ---
    {
      scope: ["string.regexp", "constant.regexp"],
      settings: { foreground: "#22C55E" },
    },

    // --- Invalid / deprecated ---
    {
      scope: ["invalid", "invalid.deprecated"],
      settings: { foreground: "#EF4444", fontStyle: "underline" },
    },
  ],
};
