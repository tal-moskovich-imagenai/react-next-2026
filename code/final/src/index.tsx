import React from "react";
import { render } from "ink";
import { App } from "./App.js";

process.stdout.write("\x1b[2J\x1b[H"); // clear screen, keep scroll buffer

const { waitUntilExit } = render(<App />);
await waitUntilExit(); // keep process alive until user quits
