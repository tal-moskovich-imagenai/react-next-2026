import React from "react";
import { render } from "ink";
import { App } from "./App.js";

process.stdout.write("\x1b[2J\x1b[H"); // just clear, keep scroll buffer

render(<App />);
