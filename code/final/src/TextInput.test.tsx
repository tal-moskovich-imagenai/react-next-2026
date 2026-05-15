import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render } from "ink-testing-library";
import { TextInput } from "./TextInput.js";

describe("TextInput", () => {
  it("renders the prompt and cursor", () => {
    const { lastFrame } = render(<TextInput onSubmit={() => {}} />);
    expect(lastFrame()).toContain("❯");
    expect(lastFrame()).toContain("█");
  });

  it("displays typed characters", () => {
    const { lastFrame, stdin } = render(<TextInput onSubmit={() => {}} />);
    stdin.write("hello");
    expect(lastFrame()).toContain("hello");
  });

  it("calls onSubmit with the current value on Enter", () => {
    const onSubmit = vi.fn();
    const { stdin } = render(<TextInput onSubmit={onSubmit} />);
    stdin.write("my prompt");
    stdin.write("\r");
    expect(onSubmit).toHaveBeenCalledWith("my prompt");
  });

  it("clears the input after submitting", () => {
    const { lastFrame, stdin } = render(<TextInput onSubmit={() => {}} />);
    stdin.write("hello");
    stdin.write("\r");
    // After submit, value should be cleared
    expect(lastFrame()).not.toContain("hello");
  });

  it("deletes the last character on backspace", () => {
    const { lastFrame, stdin } = render(<TextInput onSubmit={() => {}} />);
    stdin.write("hello");
    stdin.write("\u007F"); // backspace
    expect(lastFrame()).toContain("hell");
    expect(lastFrame()).not.toContain("hello");
  });

  it("does not append ctrl+c to input", () => {
    const { lastFrame, stdin } = render(<TextInput onSubmit={() => {}} />);
    stdin.write("\u0003"); // ctrl+c
    // No characters should have been appended
    const frame = lastFrame() ?? "";
    // The input area (between ❯ and █) should be empty
    expect(frame.replace(/[❯█\s]/g, "")).toBe("");
  });
});
