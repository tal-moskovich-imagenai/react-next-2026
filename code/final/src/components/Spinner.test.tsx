import React from "react";
import { describe, it, expect } from "vitest";
import { render } from "ink-testing-library";
import { Spinner } from "./Spinner.js";

describe("Spinner", () => {
  it("renders the first braille frame", () => {
    const { lastFrame } = render(<Spinner />);
    // Any braille spinner character
    expect(lastFrame()).toMatch(/[⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏]/);
  });

  it("renders with a label", () => {
    const { lastFrame } = render(<Spinner label="Loading models" />);
    expect(lastFrame()).toMatch(/Loading models/);
  });

  it("renders with the default label when none is provided", () => {
    const { lastFrame } = render(<Spinner />);
    expect(lastFrame()).toMatch(/Thinking\.\.\./);
  });
});
