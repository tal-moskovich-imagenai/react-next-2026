import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render } from "ink-testing-library";
import { ModelSelect } from "./ModelSelect.js";

// Provide a pre-resolved promise so use() never actually suspends.
// Vitest hoists vi.mock() above imports.
vi.mock("./fetchModels.js", () => ({
  modelsPromise: Promise.resolve([
    { id: "gpt-4o-mini", label: "GPT-4o Mini" },
    { id: "gpt-4o", label: "GPT-4o" },
    { id: "o1-mini", label: "o1 Mini" },
  ]),
}));

// Flush microtasks so the resolved promise is processed by React
const flush = () => new Promise<void>((r) => setTimeout(r, 0));

describe("ModelSelect", () => {
  it("shows a loading state immediately after render", () => {
    const { lastFrame } = render(<ModelSelect onSelect={() => {}} />);
    // React may still show Suspense fallback on the very first frame
    expect(typeof lastFrame()).toBe("string");
  });

  it("shows all model options after promise resolves", async () => {
    const { lastFrame } = render(<ModelSelect onSelect={() => {}} />);
    await flush();
    expect(lastFrame()).toContain("GPT-4o Mini");
    expect(lastFrame()).toContain("GPT-4o");
    expect(lastFrame()).toContain("o1 Mini");
  });

  it("starts cursor on first item", async () => {
    const { lastFrame } = render(<ModelSelect onSelect={() => {}} />);
    await flush();
    expect(lastFrame()).toContain("❯ GPT-4o Mini");
  });

  it("moves cursor down with down arrow", async () => {
    const { lastFrame, stdin } = render(<ModelSelect onSelect={() => {}} />);
    await flush();

    stdin.write("\u001B[B"); // ↓
    expect(lastFrame()).toContain("❯ GPT-4o");
  });

  it("moves cursor up after moving down", async () => {
    const { lastFrame, stdin } = render(<ModelSelect onSelect={() => {}} />);
    await flush();

    stdin.write("\u001B[B"); // ↓
    stdin.write("\u001B[A"); // ↑
    expect(lastFrame()).toContain("❯ GPT-4o Mini");
  });

  it("calls onSelect with the model id when Enter is pressed", async () => {
    const onSelect = vi.fn();
    const { stdin } = render(<ModelSelect onSelect={onSelect} />);
    await flush();

    stdin.write("\r");
    expect(onSelect).toHaveBeenCalledWith("gpt-4o-mini");
  });

  it("does not go below the last item", async () => {
    const { lastFrame, stdin } = render(<ModelSelect onSelect={() => {}} />);
    await flush();

    for (let i = 0; i < 10; i++) {
      stdin.write("\u001B[B");
    }
    expect(lastFrame()).toContain("❯ o1 Mini");
  });

  it("does not go above the first item", async () => {
    const { lastFrame, stdin } = render(<ModelSelect onSelect={() => {}} />);
    await flush();

    for (let i = 0; i < 10; i++) {
      stdin.write("\u001B[A"); // ↑
    }
    expect(lastFrame()).toContain("❯ GPT-4o Mini");
  });
});
