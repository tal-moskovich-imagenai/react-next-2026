---
layout: section
---

# Block 7
## When to Reach for This

<!--
2 minutes. Be honest about trade-offs. Not the answer to every CLI need.
-->

---
layout: two-cols
---

## Good fits

<v-clicks>

✅ **Interactive wizards** — multi-step setup flows
_(create-react-app, prisma init)_

✅ **Long-running processes** — build tools, test runners, deploy scripts

✅ **AI agent CLIs** — streaming responses, interrupt handling, real-time state

✅ **Developer tooling** — anything needing more than a log line

✅ **Internal ops tools** — dashboards, monitors, pipelines

</v-clicks>

::right::

<v-click>

## Not the best fit

❌ **One-shot scripts** — just need to print and exit? `console.log` is fine.

❌ **Shell pipelines** — tools that need to work with `|` and `>` in scripts

❌ **System daemons** — Ink keeps the event loop alive; it's a REPL, not a daemon

</v-click>

<v-click>

## The bar to clear

<TerminalFrame title="the question">
  <div style="font-family: 'SF Mono', monospace; font-size: 15px; color: #F3EFF5; padding: 4px 0">
    "Would a user of this tool benefit from seeing<br/>
    state update in real time while they interact?"
  </div>
</TerminalFrame>

If yes — Ink is worth it.
If the tool runs, prints, and exits — it probably isn't.

</v-click>

---
layout: two-cols
---

## Don't build from scratch: `@inkjs/ui`

```bash
npm install @inkjs/ui
```

```tsx
import { Select, TextInput,
         Spinner, ProgressBar } from "@inkjs/ui";
```

::right::

| Component | What it does |
|-----------|--------------|
| `<TextInput>` | Controlled input with cursor |
| `<Select>` | Arrow-key navigation list |
| `<MultiSelect>` | Checkbox multi-selection |
| `<ConfirmInput>` | y/n prompt |
| `<Spinner>` | Animated spinner |
| `<ProgressBar>` | Horizontal progress bar |
| `<Badge>` | Coloured label |
| `<StatusMessage>` | info/error/warning/success |
| `<UnorderedList>` | Semantic list |

<v-click>

The components we built today were great for understanding the primitives.

In a **production CLI**, use `@inkjs/ui` — spend your time on the product, not the widget library.

</v-click>

<!--
Natural closer after "when to reach for it" — save the audience some work.
-->
