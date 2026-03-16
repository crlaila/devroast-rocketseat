# Specs — Formato e Convenções

Toda nova feature começa com um arquivo `.md` nesta pasta antes de qualquer implementação.

---

## Nome do arquivo

`kebab-case` descrevendo a feature. Ex: `editor-syntax-highlight.md`, `drizzle-database.md`

---

## Estrutura obrigatória

```md
# Spec: <Nome da Feature>

> Status: **pending** | **aprovado** | **em andamento** | **concluído**
> Depends on: <outras specs ou "nenhuma">

---

## Contexto

Por que essa feature existe. O que ela resolve. Qual estado atual do app ela muda.

---

## Decisão Técnica

Bibliotecas escolhidas, padrões arquiteturais, o que foi descartado e por quê.

---

## Arquitetura de Componentes / Estrutura de Arquivos

Quais arquivos serão criados/modificados, interfaces TypeScript relevantes, estrutura de pastas.

---

## Comportamento Esperado

Descrição funcional do que o usuário vê/experimenta. Casos de borda relevantes.

---

## To-Dos de Implementação

Tarefas em ordem de dependência, agrupadas por categoria (SETUP, SCHEMA, COMP, etc.).

- [ ] **CATEGORY-N** — Descrição da tarefa
```

---

## Regras

- **Status** deve ser atualizado conforme a implementação avança
- Seções opcionais (performance, referências, dados de seed) entram quando relevantes
- Se a spec depende de outra, declarar em `Depends on`
- Decisões tomadas durante a implementação devem ser registradas na spec (não apenas no código)
- Não criar componentes ou instalar dependências sem spec aprovada primeiro
