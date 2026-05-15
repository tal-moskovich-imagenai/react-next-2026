---
layout: section
---

# Block 5
## Testing

<!--
3 minutes. Testing is first-class. ink-testing-library works exactly like React Testing Library.
-->

---
layout: two-cols
---

## ink-testing-library

```bash
npm install -D vitest ink-testing-library
```

```tsx
import { render } from "ink-testing-library";
import { Spinner } from "./Spinner.js";

describe("Spinner", () => {
  it("renders with label", () => {
    const { lastFrame } = render(
      <Spinner label="Loading" />
    );
    expect(lastFrame()).toMatch(/Loading/);
  });
});
```

<v-click>

`lastFrame()` = the plain text of what would be written to the terminal.

Assert on strings — just like asserting on DOM text in React Testing Library.

</v-click>

::right::

<v-click>

### Full API

| Method | Description |
|--------|-------------|
| `render(<App />)` | Render to buffer |
| `lastFrame()` | Most recent output string |
| `frames` | All rendered frames |
| `rerender(<App />)` | Re-render with new props |
| `stdin.write(str)` | Simulate keyboard input |
| `unmount()` | Unmount + cleanup |

</v-click>

<v-click>

```tsx
// Simulate keyboard input
stdin.write("\u001B[B"); // ↓ arrow
stdin.write("\r");       // Enter
```

No DOM. No jsdom. Actually runs components through Ink's renderer into a string buffer.

</v-click>

---
layout: two-cols
---

## Testing `use()` + Suspense

```tsx {all|4-9|11|13-17}
// Must mock BEFORE the component suspends
vi.mock("./fetchModels.js", () => ({
  modelsPromise: Promise.resolve([
    { id: "gpt-4o-mini", label: "GPT-4o Mini" },
    { id: "gpt-4o",      label: "GPT-4o" },
    { id: "o1-mini",     label: "o1 Mini" },
  ]),
}));

// Flush microtasks so React processes the resolved Promise
const flush = () => new Promise(r => setTimeout(r, 0));

it("shows models after resolving", async () => {
  const { lastFrame } = render(<ModelSelect onSelect={() => {}} />);
  await flush(); // ← let use() resume
  expect(lastFrame()).toContain("GPT-4o Mini");
});
```

::right::

<v-click>

```tsx
it("navigates with arrow keys", async () => {
  const { lastFrame, stdin } =
    render(<ModelSelect onSelect={() => {}} />);
  await flush();

  stdin.write("\u001B[B"); // ↓
  expect(lastFrame()).toContain("❯ GPT-4o");
});

it("calls onSelect on Enter", async () => {
  const onSelect = vi.fn();
  const { stdin } =
    render(<ModelSelect onSelect={onSelect} />);
  await flush();

  stdin.write("\r");
  expect(onSelect)
    .toHaveBeenCalledWith("gpt-4o-mini");
});
```

</v-click>

<v-click>

```bash
npx vitest

 ✔ Spinner › renders with label
 ✔ ModelSelect › shows all model options
 ✔ ModelSelect › starts cursor on first item
 ✔ ModelSelect › moves cursor with arrow key
 ✔ ModelSelect › calls onSelect on Enter
 ✔ ModelSelect › does not go below last item
```

</v-click>

<!--
The key insight: use() suspends — so you MUST mock with a pre-resolved Promise
and flush microtasks before asserting. Same pattern as testing async components in the browser.
-->
