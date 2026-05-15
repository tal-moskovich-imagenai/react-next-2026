# Live Coding Guide — React Runs Your Terminal

**ReactNext 2026 · June 23 · Block 4: 10:16–10:30 (14 min)**

Each `step-N/` folder is a complete, standalone snapshot of the code at that point in the talk. If something breaks live, you can `cd` into the next step and continue.

## Before you go on stage

```bash
# 1. Verify the API key
node --env-file=final/.env -e "console.log(process.env.OPENAI_API_KEY?.slice(0,8))"
# Should print: sk-proj-

# 2. Run the tests
cd final && npm install && npm test
# All 16 tests should pass

# 3. Pre-install deps in all steps so you don't wait on stage
for dir in step-*/; do (cd "$dir" && npm install --silent); done
```

## Live coding sequence

### Step 1 — Scaffold (~1 min) `step-1-scaffold/`

```bash
mkdir react-terminal-demo && cd react-terminal-demo
npm init -y
npm install ink react ai @ai-sdk/openai
npm install -D typescript tsx @types/react @types/node
```

Show the `tsconfig.json` and `package.json` additions.

---

### Step 2 — Shell Component (~2 min) `step-2-shell/`

Write `src/index.tsx` and `src/App.tsx`. Run:

```bash
npm run dev
```

**Say:** "A styled box. This is React. Same components, same mental model."

---

### Step 3 — Input State (~3 min) `step-3-input/`

Add `src/TextInput.tsx` and update `src/App.tsx`.

Demonstrate typing in the terminal. Show state updating.

**Say:** "Type into the terminal. State updates. UI re-renders. This is React in your terminal."

---

### Step 4 — Streaming AI (~5 min) `step-4-streaming/`

**First:** Show the `cli-vs-browser.svg` diagram on the slides.
- Explain why `useChat` is wrong for a CLI
- Explain why `streamText` is right

Then write:
- `.env` (copy from `.env.example`)
- `src/useStream.ts`
- `src/Spinner.tsx`
- Update `src/App.tsx`

Run and demo the streaming.

**Key line to explain:**
```ts
for await (const chunk of textStream) {
  setContent(accumulated += chunk);
  // Each call → Ink re-render → new ANSI → terminal updates
}
```

---

### Step 5 — Model Selector + `use()` (~3 min) `step-5-models/`

Add `src/fetchModels.ts` and `src/ModelSelect.tsx`.

**Key moment:** show the before/after of `useEffect` vs `use()`.

**Always pair `use()` with:**
1. `<Suspense>` — for the pending state
2. `<ErrorBoundary>` — for rejected promises

---

### Step 6 — Production: `<Static>` (~1 min) `step-6-production/`

Update `src/App.tsx` — replace the `optimisticMessages.map()` with `<Static items={messages}>`.

**Say:** "Without Static: 100-message conversation → Ink diffs all 100 boxes on every token. With Static: diffs exactly one region."

---

## Safety net

```bash
# If something breaks:
cd final && npm run dev

# The final app is fully functional.
# It has the .env.example. Tests pass.
```

## File structure at each step

```
step-1-scaffold/  → package.json · tsconfig.json
step-2-shell/     → + src/index.tsx · src/App.tsx
step-3-input/     → + src/TextInput.tsx · App.tsx updated
step-4-streaming/ → + src/useStream.ts · src/Spinner.tsx · App.tsx with AI
step-5-models/    → + src/fetchModels.ts · src/ModelSelect.tsx · App.tsx with selector
step-6-production/→ + App.tsx with <Static> · polished
final/            → complete app · tests · .env.example
```
